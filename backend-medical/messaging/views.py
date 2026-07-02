# messaging/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q, Count
from django.contrib.auth import get_user_model

from .models import Conversation, Message
from .serializers import (
    ConversationListSerializer,
    ConversationDetailSerializer,
    ConversationCreateSerializer,
    MessageSerializer,
)

User = get_user_model()


# ============================================================
# VUE : Liste + création de conversations
# GET  /api/messaging/conversations/
# POST /api/messaging/conversations/
# ============================================================
class ConversationListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Toutes les conversations où l'utilisateur participe
        conversations = Conversation.objects.filter(
            Q(patient=user) | Q(medecin=user) | Q(hopital=user)
        ).order_by('-updated_at')

        serializer = ConversationListSerializer(
            conversations, many=True, context={'request': request}
        )
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        conv_type = request.data.get('type')
        other_user_id = request.data.get('other_user_id')

        if not conv_type or not other_user_id:
            return Response(
                {'detail': 'type et other_user_id sont requis.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            other_user = User.objects.get(id=other_user_id)
        except User.DoesNotExist:
            return Response({'detail': 'Utilisateur introuvable.'}, status=404)

        # Construire les champs selon les rôles
        payload = {'type': conv_type}

        roles_in_type = conv_type.split('_')  # ex: ['patient', 'medecin']

        # Assigner user et other_user aux bons champs selon leur rôle réel
        field_map = {'patient': 'patient', 'medecin': 'medecin', 'doctor': 'medecin', 'hopital': 'hopital', 'hospital': 'hopital'}

        user_field  = field_map.get(user.role)
        other_field = field_map.get(other_user.role)

        if not user_field or not other_field:
            return Response({'detail': 'Rôles incompatibles avec ce type de conversation.'}, status=400)

        payload[user_field]  = user.id
        payload[other_field] = other_user.id

        # Vérifier si une conversation existe déjà entre ces deux personnes
        existing = Conversation.objects.filter(type=conv_type, **{user_field: user.id, other_field: other_user.id}).first()
        if existing:
            serializer = ConversationDetailSerializer(existing, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        serializer = ConversationCreateSerializer(data=payload)
        serializer.is_valid(raise_exception=True)
        conversation = serializer.save()

        detail_serializer = ConversationDetailSerializer(conversation, context={'request': request})
        return Response(detail_serializer.data, status=status.HTTP_201_CREATED)


# ============================================================
# VUE : Détail d'une conversation (avec historique messages)
# GET    /api/messaging/conversations/<id>/
# DELETE /api/messaging/conversations/<id>/
# ============================================================
class ConversationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def _get_conversation(self, request, pk):
        user = request.user
        return Conversation.objects.filter(
            Q(patient=user) | Q(medecin=user) | Q(hopital=user),
            id=pk,
        ).first()

    def get(self, request, pk):
        conversation = self._get_conversation(request, pk)
        if not conversation:
            return Response({'detail': 'Conversation introuvable.'}, status=404)

        serializer = ConversationDetailSerializer(conversation, context={'request': request})
        return Response(serializer.data)

    def delete(self, request, pk):
        conversation = self._get_conversation(request, pk)
        if not conversation:
            return Response({'detail': 'Conversation introuvable.'}, status=404)

        conversation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ============================================================
# VUE : Envoyer un message (fallback REST si WebSocket indisponible)
# POST /api/messaging/conversations/<id>/messages/
# ============================================================
class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        conversation = Conversation.objects.filter(
            Q(patient=user) | Q(medecin=user) | Q(hopital=user),
            id=pk,
        ).first()

        if not conversation:
            return Response({'detail': 'Conversation introuvable.'}, status=404)

        content = request.data.get('content', '').strip()
        if not content:
            return Response({'detail': 'content est requis.'}, status=400)

        message = Message.objects.create(
            conversation=conversation,
            sender=user,
            content=content,
        )
        conversation.save(update_fields=['updated_at'])

        serializer = MessageSerializer(message, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# ============================================================
# VUE : Liste des contacts disponibles pour démarrer une conversation
# GET /api/messaging/contacts/
# Retourne les médecins/hôpitaux/patients selon le rôle de l'utilisateur
# ============================================================
class AvailableContactsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        contacts = []

        if user.role == 'patient':
            # Patient peut contacter : médecins avec qui il a un RDV + hôpitaux
            from appointments.models import Appointment
            doctor_ids = Appointment.objects.filter(
                patient=user
            ).values_list('doctor__user_id', flat=True).distinct()

            doctors = User.objects.filter(id__in=doctor_ids, role='doctor')
            for d in doctors:
                contacts.append({
                    'id':   d.id,
                    'name': f"Dr. {d.first_name} {d.last_name}",
                    'role': 'doctor',
                    'specialty': getattr(d, 'specialization', ''),
                    'avatar': d.profile_picture.url if d.profile_picture else None,
                })

        elif user.role == 'doctor':
            # Médecin peut contacter ses patients + son hôpital
            from appointments.models import Appointment
            patient_ids = Appointment.objects.filter(
                doctor__user=user
            ).values_list('patient_id', flat=True).distinct()

            patients = User.objects.filter(id__in=patient_ids, role='patient')
            for p in patients:
                contacts.append({
                    'id':   p.id,
                    'name': f"{p.first_name} {p.last_name}",
                    'role': 'patient',
                    'avatar': p.profile_picture.url if p.profile_picture else None,
                })

            # Son hôpital
            if hasattr(user, 'doctor') and user.doctor.hospital:
                h_user = user.doctor.hospital.user
                contacts.append({
                    'id':   h_user.id,
                    'name': user.doctor.hospital.name,
                    'role': 'hospital',
                    'avatar': None,
                })

        elif user.role == 'hospital':
            # Hôpital peut contacter ses médecins + ses patients (via RDV)
            if hasattr(user, 'hospital'):
                doctors = User.objects.filter(
                    doctor__hospital=user.hospital, role='doctor'
                )
                for d in doctors:
                    contacts.append({
                        'id':   d.id,
                        'name': f"Dr. {d.first_name} {d.last_name}",
                        'role': 'doctor',
                        'specialty': getattr(d, 'specialization', ''),
                        'avatar': d.profile_picture.url if d.profile_picture else None,
                    })

        return Response(contacts)