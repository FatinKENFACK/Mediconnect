# notifications/models.py

from django.db import models
from django.conf import settings


class Notification(models.Model):

    TYPE_CHOICES = [
        ('payment_confirmed',     'Paiement confirmé'),
        ('call_started',          'Appel démarré'),
        ('appointment_confirmed', 'Rendez-vous confirmé'),
        ('appointment_cancelled', 'Rendez-vous annulé'),
        ('review_moderated',      'Avis modéré'),
        ('other',                 'Autre'),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='other')
    title = models.CharField(max_length=150)
    message = models.CharField(max_length=255)
    # Route frontend vers laquelle rediriger au clic (ex: '/patient/rendez-vous')
    link = models.CharField(max_length=255, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient} — {self.title}"