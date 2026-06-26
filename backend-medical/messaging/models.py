from django.db import models
from django.conf import settings


class Conversation(models.Model):

    CONVERSATION_TYPES = [
        ('patient_medecin', 'Patient ↔ Médecin'),
        ('medecin_hopital', 'Médecin ↔ Hôpital'),
        ('patient_hopital', 'Patient ↔ Hôpital'),
    ]

    type = models.CharField(max_length=20, choices=CONVERSATION_TYPES)

    # Patient (optionnel selon le type de conversation)
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conversations_as_patient',
        null=True, blank=True
    )

    # Médecin (optionnel selon le type de conversation)
    medecin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conversations_as_medecin',
        null=True, blank=True
    )

    # Hôpital (optionnel selon le type de conversation)
    hopital = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='conversations_as_hopital',
        null=True, blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.type} - Conv#{self.id}"

    @property
    def last_message(self):
        return self.messages.last()

    @property
    def unread_count(self):
        return self.messages.filter(is_read=False).count()


class Message(models.Model):

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )

    # L'expéditeur est maintenant un vrai utilisateur
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )

    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender} → Conv#{self.conversation.id} : {self.content[:30]}"