from django.urls import path
from .views import (
    # Imports des vues pour les antécédents médicaux
    MedicalHistoryListCreateView,
    MedicalHistoryDetailView,

    # Imports des vues pour les allergies
    AllergyListCreateView,
    AllergyDetailView,

    # Imports des vues pour les médicaments
    MedicationListCreateView,
    MedicationDetailView,

    # Imports des vues pour les documents médicaux
    MedicalDocumentListCreateView,
    MedicalDocumentDetailView,
)

urlpatterns = [

    # ============================================================
    # ROUTES : Antécédents médicaux
    # GET  /api/medical/history/       → liste tous les antécédents
    # POST /api/medical/history/       → crée un antécédent
    # ============================================================
    path(
        'history/',                             
        MedicalHistoryListCreateView.as_view(), 
        name='medical-history-list'            
    ),

    # GET    /api/medical/history/1/   → voir l'antécédent avec id=1
    # PATCH  /api/medical/history/1/   → modifier l'antécédent avec id=1
    # DELETE /api/medical/history/1/   → supprimer l'antécédent avec id=1
    path(
        'history/<int:pk>/',                    # <int:pk> capture l'ID dans l'URL
        MedicalHistoryDetailView.as_view(),
        name='medical-history-detail'
    ),

    # ============================================================
    # ROUTES : Allergies
    # GET  /api/medical/allergies/     → liste toutes les allergies
    # POST /api/medical/allergies/     → crée une allergie
    # ============================================================
    path(
        'allergies/',
        AllergyListCreateView.as_view(),
        name='allergy-list'
    ),

    # GET    /api/medical/allergies/1/ → voir l'allergie avec id=1
    # PATCH  /api/medical/allergies/1/ → modifier
    # DELETE /api/medical/allergies/1/ → supprimer
    path(
        'allergies/<int:pk>/',
        AllergyDetailView.as_view(),
        name='allergy-detail'
    ),

    # ============================================================
    # ROUTES : Médicaments
    # GET  /api/medical/medications/   → liste tous les médicaments
    # POST /api/medical/medications/   → ajoute un médicament
    # ============================================================
    path(
        'medications/',
        MedicationListCreateView.as_view(),
        name='medication-list'
    ),

    # GET    /api/medical/medications/1/ → voir le médicament avec id=1
    # PATCH  /api/medical/medications/1/ → modifier
    # DELETE /api/medical/medications/1/ → supprimer
    path(
        'medications/<int:pk>/',
        MedicationDetailView.as_view(),
        name='medication-detail'
    ),

    # ============================================================
    # ROUTES : Documents médicaux
    # GET  /api/medical/documents/     → liste tous les documents
    # POST /api/medical/documents/     → upload un document
    # ============================================================
    path(
        'documents/',
        MedicalDocumentListCreateView.as_view(),
        name='medical-document-list'
    ),

    # GET    /api/medical/documents/1/ → voir le document avec id=1
    # DELETE /api/medical/documents/1/ → supprimer le document avec id=1
    path(
        'documents/<int:pk>/',
        MedicalDocumentDetailView.as_view(),
        name='medical-document-detail'
    ),
]