from django.db import models
from django.conf import settings

class Appointment(models.Model):
    TYPE_CHOICES = [
        ('video', 'Consultation vidéo'),
        ('in-person', 'En cabinet'),
        ('presentiel', 'Présentiel'),
    ]
    
    STATUT_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('cancelled', 'Annulé'),
        ('completed', 'Terminé'),
    ]

    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='appointments'
    )

    #  Lien vers le vrai médecin
    doctor = models.ForeignKey(
        'accounts.Doctor',
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='appointments'
    )

    # Gardés pour compatibilité si doctor est null
    doctor_name = models.CharField(max_length=150, blank=True)
    doctor_specialty = models.CharField(max_length=150, blank=True)

    date = models.DateField()
    time = models.TimeField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUT_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    # ============================================================
    # CHAMPS APPEL VIDÉO / AUDIO (Jitsi Meet)
    # ============================================================
    CALL_TYPE_CHOICES = [
        ('video', 'Vidéo'),
        ('audio', 'Audio'),
    ]
    CALL_STATUS_CHOICES = [
        ('none', 'Aucun appel'),
        ('waiting', 'En attente que le médecin démarre'),
        ('ongoing', 'Appel en cours'),
        ('ended', 'Appel terminé'),
    ]

    PREFERRED_CALL_TYPE_CHOICES = [
        ('video', 'Vidéo'),
        ('audio', 'Audio'),
    ]
    preferred_call_type = models.CharField(
        max_length=10, choices=PREFERRED_CALL_TYPE_CHOICES,
        null=True, blank=True,
        help_text="Préférence indicative du patient à la réservation — le médecin garde la main au moment de l'appel."
    )

    call_type = models.CharField(
        max_length=10, choices=CALL_TYPE_CHOICES,
        null=True, blank=True,
        help_text="Vidéo ou audio, uniquement si type='video' (consultation en ligne)"
    )
    call_status = models.CharField(
        max_length=10, choices=CALL_STATUS_CHOICES, default='none'
    )
    call_room_name = models.CharField(max_length=100, blank=True, null=True)
    call_started_at = models.DateTimeField(null=True, blank=True)
    call_ended_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f"{self.patient} - {self.doctor_name} - {self.date} {self.time}"

# ============================================================
# MODÈLE : Disponibilité médecin
# Définit les créneaux horaires disponibles par jour de la semaine
# ============================================================
class DoctorAvailability(models.Model):

    DAY_CHOICES = [
        (0, 'Lundi'),
        (1, 'Mardi'),
        (2, 'Mercredi'),
        (3, 'Jeudi'),
        (4, 'Vendredi'),
        (5, 'Samedi'),
        (6, 'Dimanche'),
    ]

    TYPE_CHOICES = [
        ('consultation', 'Consultation'),
        ('urgence', 'Urgence'),
        ('video', 'Visioconférence'),
        ('chirurgie', 'Chirurgie'),
    ]

    doctor = models.ForeignKey(
        'accounts.Doctor',
        on_delete=models.CASCADE,
        related_name='availabilities'
    )

    day_of_week = models.IntegerField(choices=DAY_CHOICES)   # 0=Lundi ... 6=Dimanche
    start_time = models.TimeField()                          # ex: 08:00
    end_time = models.TimeField()                            # ex: 12:00
    consultation_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='consultation'
    )
    is_active = models.BooleanField(default=True)            # Permet de désactiver un créneau
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['day_of_week', 'start_time']
        verbose_name = "Disponibilité médecin"
        verbose_name_plural = "Disponibilités médecins"
        # Un médecin ne peut pas avoir 2 créneaux identiques le même jour
        unique_together = ['doctor', 'day_of_week', 'start_time', 'end_time']

    def __str__(self):
        return f"Dr. {self.doctor.user.last_name} — {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"
    
# ============================================================
# MODÈLE : Prescription / Ordonnance
# ============================================================
class Prescription(models.Model):
    STATUS_CHOICES = [
        ('active', 'En cours'),
        ('expired', 'Expirée'),
        ('cancelled', 'Annulée'),
    ]

    doctor = models.ForeignKey(
        'accounts.Doctor',
        on_delete=models.CASCADE,
        related_name='prescriptions'
    )
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='prescriptions'
    )
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"Ordonnance #{self.id} — {self.patient.first_name} {self.patient.last_name}"


class PrescriptionItem(models.Model):
    prescription = models.ForeignKey(
        Prescription,
        on_delete=models.CASCADE,
        related_name='items'
    )
    nom = models.CharField(max_length=200)        
    posologie = models.CharField(max_length=200) 
    duree = models.CharField(max_length=100)      

    def __str__(self):
        return f"{self.nom} — {self.posologie}"

    
# ============================================================
# MODÈLE : Compte-rendu médical
# ============================================================
class CompteRendu(models.Model):
    TYPE_CHOICES = [
        ('consultation', 'Consultation de routine'),
        ('suivi', 'Consultation de suivi'),
        ('urgence', 'Urgence'),
        ('visite', 'Visite à domicile'),
        ('teleconsultation', 'Téléconsultation'),
    ]

    doctor = models.ForeignKey(
        'accounts.Doctor',
        on_delete=models.CASCADE,
        related_name='comptes_rendus'
    )
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comptes_rendus'
    )
    date = models.DateField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='consultation')
    motif = models.CharField(max_length=255)
    observations = models.TextField(blank=True)
    diagnostic = models.CharField(max_length=255, blank=True)
    traitement = models.TextField(blank=True)
    recommandations = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"CR #{self.id} — {self.patient.first_name} {self.patient.last_name} — {self.date}"
