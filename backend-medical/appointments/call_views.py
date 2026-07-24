# appointments/call_views.py
"""
Vues pour la gestion des appels vidéo/audio (Jitsi Meet).

Flux :
1. Le médecin appelle StartCallView -> génère la room, notifie le patient via WebSocket
2. Le patient reçoit la notif temps réel et appelle CallStatusView pour récupérer les infos
3. À la fin, le médecin (ou le patient) appelle EndCallView
"""

import uuid
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Appointment


def _notify_user(user_id, payload):
    """Envoie un événement temps réel ET persiste une notification si pertinent."""
    from django.contrib.auth import get_user_model
    from notifications.utils import notify_user

    if payload.get('event') == 'call_started':
        User = get_user_model()
        try:
            user = User.objects.get(id=user_id)
            notify_user(
                user=user,
                type='call_started',
                title='Appel démarré',
                message=f"{payload.get('doctor_name', 'Votre médecin')} a démarré l'appel — rejoignez la consultation.",
                link=f"/patient/consultation-video/{payload.get('appointment_id')}",
            )
        except User.DoesNotExist:
            pass
    else:
        # Autres événements (ex: call_ended) — push temps réel seulement, pas persisté
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notify_{user_id}',
            {'type': 'call_event', 'payload': payload}
        )


class StartCallView(APIView):
    """
    POST /api/appointments/<id>/call/start/
    Body : { "call_type": "video" | "audio" }
    Réservé au médecin propriétaire du rendez-vous.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        if user.role != 'doctor':
            return Response(
                {'error': 'Réservé aux médecins.'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            doctor = user.doctor
        except Exception:
            return Response(
                {'error': 'Profil médecin introuvable.'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            appointment = Appointment.objects.get(pk=pk, doctor=doctor)
        except Appointment.DoesNotExist:
            return Response(
                {'error': 'Rendez-vous introuvable ou non autorisé.'},
                status=status.HTTP_404_NOT_FOUND
            )

        # ==========================
        # Vérification du paiement
        # ==========================
        from payments.models import Payment

        is_paid = Payment.objects.filter(
            appointment=appointment,
            status='completed'
        ).exists()

        if not is_paid:
            return Response(
                {'error': "Le patient n'a pas encore payé cette consultation."},
                status=status.HTTP_402_PAYMENT_REQUIRED
            )

        # Vérifier que c'est bien une consultation en ligne
        if appointment.type not in ('video', 'teleconsultation'):
            return Response(
                {'error': "Ce rendez-vous n'est pas une consultation en ligne."},
                status=status.HTTP_400_BAD_REQUEST
            )

        call_type = request.data.get('call_type', 'video')
        if call_type not in ('video', 'audio'):
            return Response(
                {'error': 'call_type doit être "video" ou "audio".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Génère un nom de room imprévisible
        room_name = f"mediconnect-{uuid.uuid4().hex}"

        appointment.call_type = call_type
        appointment.call_room_name = room_name
        appointment.call_status = 'ongoing'
        appointment.call_started_at = timezone.now()
        appointment.save()

        # Notifie le patient
        _notify_user(
            appointment.patient_id,
            {
                'event': 'call_started',
                'appointment_id': appointment.id,
                'room_name': room_name,
                'call_type': call_type,
                'doctor_name': f"Dr. {doctor.user.first_name} {doctor.user.last_name}",
            }
        )

        return Response({
            'room_name': room_name,
            'call_type': call_type,
            'call_status': 'ongoing',
        })


class CallStatusView(APIView):
    """
    GET /api/appointments/<id>/call/status/
    Accessible au patient ET au médecin concernés par le RDV.
    Utilisé par le patient pour récupérer room_name après avoir reçu la notif,
    ou pour vérifier périodiquement (fallback si le WebSocket a raté l'événement).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        user = request.user
        try:
            appointment = Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            return Response({'error': 'Introuvable.'}, status=404)

        is_patient = appointment.patient_id == user.id
        is_doctor = (
            user.role == 'doctor' and
            hasattr(user, 'doctor') and
            appointment.doctor_id == user.doctor.id
        )
        if not (is_patient or is_doctor):
            return Response({'error': 'Non autorisé.'}, status=403)

        return Response({
            'call_status': appointment.call_status,
            'call_type': appointment.call_type,
            'room_name': appointment.call_room_name if appointment.call_status == 'ongoing' else None,
        })


class EndCallView(APIView):
    """
    POST /api/appointments/<id>/call/end/
    Le médecin OU le patient peut terminer l'appel.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        try:
            appointment = Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            return Response({'error': 'Introuvable.'}, status=404)

        is_patient = appointment.patient_id == user.id
        is_doctor = (
            user.role == 'doctor' and
            hasattr(user, 'doctor') and
            appointment.doctor_id == user.doctor.id
        )
        if not (is_patient or is_doctor):
            return Response({'error': 'Non autorisé.'}, status=403)

        appointment.call_status = 'ended'
        appointment.call_ended_at = timezone.now()
        appointment.save()

        # Notifie l'autre participant que l'appel est terminé
        other_user_id = appointment.doctor.user_id if is_patient else appointment.patient_id
        _notify_user(other_user_id, {
            'event': 'call_ended',
            'appointment_id': appointment.id,
        })

        return Response({'call_status': 'ended'})