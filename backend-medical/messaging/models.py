from django.db import models
from django.conf import settings


# ============================================================
# MODÈLE : Conversation
# Une conversation relie un patient à un médecin (identifié par son nom)
# Chaque conversation contient plusieurs messages
# ============================================================
class Conversation(models.Model):

    # Le patient connecté — lié au modèle CustomUser
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,       # Si le patient est supprimé, ses conversations le sont aussi
        related_name='conversations'    # patient.conversations.all() pour accéder aux conversations
    )

    # Nom du médecin — on stocke juste le nom car les médecins
    # ne sont pas encore des utilisateurs dans notre système
    doctor_name = models.CharField(max_length=255)

    # Spécialité du médecin pour l'afficher dans la liste
    doctor_specialty = models.CharField(max_length=255, blank=True)

    # Date de création de la conversation
    created_at = models.DateTimeField(auto_now_add=True)

    # Date de dernière mise à jour — mise à jour automatiquement
    # quand un nouveau message est envoyé
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Les conversations les plus récentes en premier
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.patient} - {self.doctor_name}"

    # Propriété qui retourne le dernier message de la conversation
    # Utilisée pour afficher l'aperçu dans la liste des conversations
    @property
    def last_message(self):
        return self.messages.last()

    # Propriété qui compte les messages non lus du médecin
    # Un message non lu = envoyé par le médecin et pas encore lu
    @property
    def unread_count(self):
        return self.messages.filter(sender='doctor', is_read=False).count()


# ============================================================
# MODÈLE : Message
# Un message appartient à une conversation
# Il peut être envoyé par le patient ou le médecin
# ============================================================
class Message(models.Model):

    SENDER_CHOICES = [
        ('patient', 'Patient'),     # Message envoyé par le patient
        ('doctor', 'Médecin'),      # Message envoyé par le médecin
    ]

    # Lien vers la conversation — related_name='messages' permet
    # d'accéder aux messages via conversation.messages.all()
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )

    # Qui a envoyé le message : 'patient' ou 'doctor'
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)

    # Contenu du message
    content = models.TextField()

    # Si le message a été lu par le destinataire
    # False par défaut — devient True quand le destinataire ouvre la conversation
    is_read = models.BooleanField(default=False)

    # Date d'envoi du message — générée automatiquement
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Les messages les plus anciens en premier (ordre chronologique)
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender} - {self.content[:50]}"