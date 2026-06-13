from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):

    STATUS_CHOICES = [
        ('pending',  'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
    ]

    # ---- Acteurs ----
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews_given',
        limit_choices_to={'role': 'patient'},
    )
    doctor = models.ForeignKey(
        'accounts.Doctor',
        on_delete=models.CASCADE,
        related_name='reviews_received',
    )

    # Lien vers la consultation (optionnel mais recommandé)
    appointment = models.OneToOneField(
        'appointments.Appointment',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='review',
    )

    # ---- Contenu ----
    rating  = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField(blank=True)

    # ---- Modération ----
    status         = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    rejection_reason = models.CharField(max_length=255, blank=True)
    moderated_at   = models.DateTimeField(null=True, blank=True)
    moderated_by   = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='reviews_moderated',
    )

    # ---- Timestamps ----
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        # Un patient ne peut donner qu'un seul avis par médecin
        unique_together = [('patient', 'doctor')]

    def __str__(self):
        return (
            f"{self.patient.first_name} → Dr. {self.doctor.user.last_name} "
            f"({self.rating}★) [{self.status}]"
        )