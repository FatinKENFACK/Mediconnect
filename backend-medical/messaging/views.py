from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer


# ============================================================
# VUE : Liste et création des conversations
# GET  /api/messaging/conversations/      → liste toutes les conversations
# POST /api/messaging/conversations/      → crée une nouvelle conversation
# ============================================================
class ConversationListCreateView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Retourne uniquement les conversations du patient connecté
    def get_queryset(self):
        return Conversation.objects.filter(patient=self.request.user)

    # Associe automatiquement le patient connecté à la conversation
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


# ============================================================
# VUE : Détail d'une conversation
# GET    /api/messaging/conversations/<id>/  → voir une conversation
# DELETE /api/messaging/conversations/<id>/  → supprimer une conversation
# ============================================================
class ConversationDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(patient=self.request.user)

    # Quand on ouvre une conversation, on marque tous les messages
    # du médecin comme lus
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Marque tous les messages non lus du médecin comme lus
        instance.messages.filter(
            sender='doctor',
            is_read=False
        ).update(is_read=True)

        serializer = self.get_serializer(instance)
        return Response(serializer.data)


# ============================================================
# VUE : Liste et envoi des messages dans une conversation
# GET  /api/messaging/conversations/<id>/messages/  → liste les messages
# POST /api/messaging/conversations/<id>/messages/  → envoie un message
# ============================================================
class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Retourne les messages de la conversation spécifiée par l'URL
    # conversation_pk est l'ID de la conversation dans l'URL
    def get_queryset(self):
        conversation_id = self.kwargs.get('conversation_pk')
        return Message.objects.filter(
            conversation_id=conversation_id,
            conversation__patient=self.request.user  # Sécurité : vérifie que c'est bien le bon patient
        )

    # Crée un nouveau message dans la conversation
    def perform_create(self, serializer):
        conversation_id = self.kwargs.get('conversation_pk')

        # Vérifie que la conversation appartient au patient connecté
        try:
            conversation = Conversation.objects.get(
                id=conversation_id,
                patient=self.request.user
            )
        except Conversation.DoesNotExist:
            return Response(
                {'error': 'Conversation introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Sauvegarde le message avec la conversation et le sender = 'patient'
        # Le patient envoie toujours en tant que 'patient'
        serializer.save(
            conversation=conversation,
            sender='patient'    # Le message est toujours envoyé par le patient
        )

        # Met à jour la date de dernière activité de la conversation
        # auto_now=True dans updated_at s'en charge automatiquement
        conversation.save()