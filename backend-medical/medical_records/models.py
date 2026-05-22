from django.db import models
from django.conf import settings

# ============================================================
# MODÈLE : Antécédent médical
# Un patient peut avoir plusieurs antécédents (maladies, chirurgies...)
# ============================================================
class MedicalHistory(models.Model):

    # Choix possibles pour le statut de l'antécédent
    STATUS_CHOICES = [
        ('en_cours', 'En cours'),     
        ('resolu', 'Résolu'),          
        ('chronique', 'Chronique'),    
    ]

    # Lien vers le patient — si le patient est supprimé, ses antécédents le sont aussi (CASCADE)
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,       
        on_delete=models.CASCADE,       
        related_name='medical_history'  
    )

    condition = models.CharField(max_length=255)        
    date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='en_cours'                              
    )
    notes = models.TextField(blank=True)                
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']          

    def __str__(self):
        return f"{self.patient} - {self.condition}"


# ============================================================
# MODÈLE : Allergie
# Un patient peut avoir plusieurs allergies
# ============================================================
class Allergy(models.Model):

    SEVERITY_CHOICES = [
        ('legere', 'Légère'),  
        ('moderee', 'Modérée'),
        ('severe', 'Sévère'),           
    ]

    TYPE_CHOICES = [
        ('medicament', 'Médicament'),   
        ('aliment', 'Aliment'),         
        ('environnement', 'Environnement'), 
        ('autre', 'Autre'),             
    ]

    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='allergies'        
    )

    name = models.CharField(max_length=255)             
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)  
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)  
    notes = models.TextField(blank=True)                
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Allergies'

    def __str__(self):
        return f"{self.patient} - {self.name}"


# ============================================================
# MODÈLE : Médicament
# Liste des médicaments prescrits au patient
# ============================================================
class Medication(models.Model):

    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='medications'      
    )

    name = models.CharField(max_length=255)             
    dosage = models.CharField(max_length=100) 
    frequency = models.CharField(max_length=100)        
    start_date = models.DateField()                     
    end_date = models.DateField(blank=True, null=True)  
    prescriber = models.CharField(max_length=255)       
    notes = models.TextField(blank=True)          
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-start_date']      

    def __str__(self):
        return f"{self.patient} - {self.name} {self.dosage}"


# ============================================================
# MODÈLE : Document médical
# Fichiers uploadés par le patient (analyses, radios, ordonnances...)
# ============================================================
class MedicalDocument(models.Model):

    TYPE_CHOICES = [
        ('analyse', 'Résultats de laboratoire'),    
        ('imagerie', 'Imagerie médicale'),           
        ('ordonnance', 'Ordonnance'),                
        ('compte_rendu', 'Compte-rendu'),            
        ('autre', 'Autre'),                          
    ]

    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='medical_documents'  
    )

    name = models.CharField(max_length=255)             
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)  
    file = models.FileField(upload_to='medical_docs/')  
    size = models.CharField(max_length=50, blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']      

    def __str__(self):
        return f"{self.patient} - {self.name}"