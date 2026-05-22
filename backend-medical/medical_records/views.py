from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import MedicalHistory, Allergy, Medication, MedicalDocument
from .serializers import (
    MedicalHistorySerializer,
    AllergySerializer,
    MedicationSerializer,
    MedicalDocumentSerializer
)


# ============================================================
# VUE : Liste et création des antécédents médicaux
# GET  /api/medical/history/       → liste tous les antécédents du patient connecté
# POST /api/medical/history/       → crée un nouvel antécédent
# ============================================================
class MedicalHistoryListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicalHistorySerializer

    # Seuls les utilisateurs connectés peuvent accéder à cette vue
    permission_classes = [permissions.IsAuthenticated]

    # Cette méthode filtre les données pour ne retourner
    # QUE les antécédents du patient connecté
    # Sans ce filtre, tous les patients verraient les données de tout le monde
    def get_queryset(self):
        return MedicalHistory.objects.filter(patient=self.request.user)

    # Cette méthode est appelée automatiquement lors d'un POST
    # Elle associe automatiquement le patient connecté à l'antécédent créé
    # Le patient n'a pas besoin d'envoyer son ID dans la requête
    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


# ============================================================
# VUE : Détail, modification et suppression d'un antécédent
# GET    /api/medical/history/<id>/  → voir un antécédent spécifique
# PATCH  /api/medical/history/<id>/  → modifier un antécédent
# DELETE /api/medical/history/<id>/  → supprimer un antécédent
# ============================================================
class MedicalHistoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MedicalHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    # Filtre par patient connecté pour éviter qu'un patient
    # accède aux antécédents d'un autre patient
    def get_queryset(self):
        return MedicalHistory.objects.filter(patient=self.request.user)


# ============================================================
# VUE : Liste et création des allergies
# GET  /api/medical/allergies/     → liste toutes les allergies du patient
# POST /api/medical/allergies/     → crée une nouvelle allergie
# ============================================================
class AllergyListCreateView(generics.ListCreateAPIView):
    serializer_class = AllergySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Allergy.objects.filter(patient=self.request.user)

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


# ============================================================
# VUE : Détail, modification et suppression d'une allergie
# GET    /api/medical/allergies/<id>/  → voir une allergie
# PATCH  /api/medical/allergies/<id>/  → modifier une allergie
# DELETE /api/medical/allergies/<id>/  → supprimer une allergie
# ============================================================
class AllergyDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AllergySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Allergy.objects.filter(patient=self.request.user)


# ============================================================
# VUE : Liste et création des médicaments
# GET  /api/medical/medications/   → liste tous les médicaments du patient
# POST /api/medical/medications/   → ajoute un nouveau médicament
# ============================================================
class MedicationListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Medication.objects.filter(patient=self.request.user)

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


# ============================================================
# VUE : Détail, modification et suppression d'un médicament
# GET    /api/medical/medications/<id>/  → voir un médicament
# PATCH  /api/medical/medications/<id>/  → modifier un médicament
# DELETE /api/medical/medications/<id>/  → supprimer un médicament
# ============================================================
class MedicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MedicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Medication.objects.filter(patient=self.request.user)


# ============================================================
# VUE : Liste et upload des documents médicaux
# GET  /api/medical/documents/     → liste tous les documents du patient
# POST /api/medical/documents/     → upload un nouveau document
# ============================================================
class MedicalDocumentListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    # MultiPartParser et FormParser sont nécessaires pour gérer
    # l'upload de fichiers (images, PDFs...)
    # JSONParser est pour les requêtes JSON normales
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        return MedicalDocument.objects.filter(patient=self.request.user)

    def perform_create(self, serializer):
        file = self.request.FILES.get('file')  # Récupère le fichier uploadé
        size = ''

        # Calcule la taille du fichier en MB si un fichier est fourni
        if file:
            size_bytes = file.size                      # Taille en octets
            size_mb = size_bytes / (1024 * 1024)        # Conversion en MB
            size = f"{size_mb:.1f} MB"                  # Format: "2.4 MB"

        # Sauvegarde avec le patient connecté et la taille calculée
        serializer.save(patient=self.request.user, size=size)

    # On passe 'request' dans le contexte pour que le serializer
    # puisse construire l'URL absolue du fichier (file_url)
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


# ============================================================
# VUE : Détail et suppression d'un document médical
# GET    /api/medical/documents/<id>/  → voir un document
# DELETE /api/medical/documents/<id>/  → supprimer un document
# ============================================================
class MedicalDocumentDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = MedicalDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MedicalDocument.objects.filter(patient=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context