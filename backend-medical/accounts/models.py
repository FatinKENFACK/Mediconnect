from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

# ===================== MANAGER PERSONNALISÉ =====================
class CustomUserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'adresse email est obligatoire")
        email = self.normalize_email(email)
        extra_fields.setdefault('role', 'patient')
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)



class CustomUser(AbstractUser):
    username = None  # On supprime le username, on utilise l'email
    
    objects = CustomUserManager()

    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Médecin'),
        ('hospital', 'Hôpital'),
        ('admin', 'Administrateur'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient')
    
    # Champs communs
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, blank=True, null=True) 
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)

    # Champs spécifiques aux médecins
    specialization = models.CharField(max_length=150, blank=True, null=True)
    license_number = models.CharField(max_length=50, blank=True, null=True)

    # Photo de profil
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.get_role_display()})"

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"

# ============================================================
# MODÈLE : Hôpital
# Un hôpital s'inscrit et gère ses médecins
# ============================================================
class Hospital(models.Model):

    # Lien vers le compte utilisateur de l'hôpital
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='hospital'
    )

    # Informations de l'établissement
    name = models.CharField(max_length=255)                    # Nom de l'hôpital
    registration_number = models.CharField(max_length=100, unique=True)  # Numéro d'enregistrement
    hospital_type = models.CharField(max_length=50, choices=[
        ('public', 'Public'),
        ('private', 'Privé'),
        ('clinic', 'Clinique'),
        ('ngo', 'ONG'),
    ], default='private')

    # Localisation
    address = models.TextField()
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    website = models.URLField(blank=True, null=True)

    # Statut
    is_verified = models.BooleanField(default=False)           
    created_at = models.DateTimeField(auto_now_add=True)
    # Code unique pour inviter les médecins
    registration_code = models.CharField(max_length=20, unique=True, blank=True)

    def save(self, *args, **kwargs):
    # Génère automatiquement un code unique à la création
        if not self.registration_code:
            import uuid
            self.registration_code = str(uuid.uuid4())[:8].upper()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name
    

# ============================================================
# MODÈLE : Médecin
# Un médecin est lié à un compte utilisateur et à un hôpital
# ============================================================
class Doctor(models.Model):

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='doctor'
    )

    # Informations professionnelles
    specialization = models.CharField(max_length=150)
    license_number = models.CharField(max_length=100, unique=True)
    experience_years = models.IntegerField(default=0)
    bio = models.TextField(blank=True)
    languages = models.CharField(max_length=255, blank=True)  # ex: "Français,Anglais"

    # Hôpital d'appartenance (optionnel)
    hospital = models.ForeignKey(
        Hospital,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='doctors'
    )

    # Tarifs (en XAF)
    fee_in_person = models.IntegerField(default=5000)
    fee_video = models.IntegerField(default=6000)
    fee_followup = models.IntegerField(default=3000)

    # Statut
    is_verified = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Dr. {self.user.first_name} {self.user.last_name} — {self.specialization}"