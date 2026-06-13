from django.db import models
from django.conf import settings


# ============================================================
# MODÈLE : Log d'accès aux données
# ============================================================
class AccessLog(models.Model):

    ACTION_CHOICES = [
        ('consultation',  'Consultation'),
        ('modification',  'Modification'),
        ('export',        'Export'),
        ('bulk_export',   'Export en masse'),
        ('deletion',      'Suppression'),
        ('access_denied', 'Accès refusé'),
        ('login',         'Connexion'),
        ('logout',        'Déconnexion'),
    ]
    RESOURCE_CHOICES = [
        ('patient_data',    'Données patient'),
        ('patient_records', 'Dossiers patients'),
        ('reports',         'Rapports'),
        ('appointments',    'Rendez-vous'),
        ('prescriptions',   'Prescriptions'),
        ('system',          'Système'),
    ]
    USER_TYPE_CHOICES = [
        ('admin',    'Administrateur'),
        ('doctor',   'Médecin'),
        ('hospital', 'Hôpital'),
        ('patient',  'Patient'),
        ('unknown',  'Inconnu'),
    ]

    user      = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='access_logs'
    )
    user_name  = models.CharField(max_length=255, blank=True)
    user_type  = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='unknown')
    action     = models.CharField(max_length=30, choices=ACTION_CHOICES)
    resource   = models.CharField(max_length=30, choices=RESOURCE_CHOICES)
    patient_id = models.CharField(max_length=50, blank=True)
    purpose    = models.CharField(max_length=255, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    location   = models.CharField(max_length=255, blank=True)
    success    = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user_name} — {self.action} — {self.resource}"


# ============================================================
# MODÈLE : Demande de données (RGPD)
# ============================================================
class DataRequest(models.Model):

    TYPE_CHOICES = [
        ('access_request',   'Demande d\'accès'),
        ('deletion_request', 'Demande de suppression'),
        ('correction_request','Demande de correction'),
        ('portability_request','Demande de portabilité'),
    ]
    STATUS_CHOICES = [
        ('pending',   'En attente'),
        ('approved',  'Approuvé'),
        ('rejected',  'Rejeté'),
        ('completed', 'Terminé'),
    ]

    requester     = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='data_requests'
    )
    requester_name  = models.CharField(max_length=255)
    requester_email = models.EmailField()
    request_type    = models.CharField(max_length=30, choices=TYPE_CHOICES)
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    data_requested  = models.JSONField(default=list)
    purpose         = models.TextField(blank=True)
    expiry_date     = models.DateField(null=True, blank=True)
    response_date   = models.DateField(null=True, blank=True)
    admin_notes     = models.TextField(blank=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.requester_name} — {self.request_type} — {self.status}"


# ============================================================
# MODÈLE : Paramètres de confidentialité
# ============================================================
class PrivacySettings(models.Model):

    AUDIT_FREQUENCY_CHOICES = [
        ('weekly',    'Hebdomadaire'),
        ('monthly',   'Mensuel'),
        ('quarterly', 'Trimestriel'),
        ('yearly',    'Annuel'),
    ]

    # Un seul enregistrement pour toute la plateforme
    data_encryption  = models.BooleanField(default=True)
    anonymization    = models.BooleanField(default=True)
    access_logs      = models.BooleanField(default=True)
    two_factor_auth  = models.BooleanField(default=False)
    session_timeout  = models.IntegerField(default=30)
    data_retention   = models.IntegerField(default=365)
    gdpr_compliant   = models.BooleanField(default=True)
    hipaa_compliant  = models.BooleanField(default=True)
    audit_frequency  = models.CharField(
        max_length=20,
        choices=AUDIT_FREQUENCY_CHOICES,
        default='monthly'
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Paramètres de confidentialité"

    def __str__(self):
        return f"Paramètres confidentialité (mis à jour {self.updated_at})"