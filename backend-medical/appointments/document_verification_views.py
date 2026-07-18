"""
Vérification publique d'authenticité pour les documents médicaux
(ordonnances et comptes-rendus) générés par MediConnect.

Contrairement à la vérification des RDV présentiels (réservée au personnel
hospitalier authentifié), celle-ci est INTENTIONNELLEMENT PUBLIQUE :
un pharmacien ou un autre établissement de santé doit pouvoir vérifier
qu'une ordonnance imprimée/PDF est authentique, sans avoir de compte
MediConnect.

Principe de confidentialité : on ne renvoie JAMAIS le contenu médical
complet (diagnostic, posologie détaillée, etc.) — uniquement de quoi
confirmer l'authenticité (médecin émetteur, date, statut, initiales
du patient) sans exposer de données sensibles à un tiers non autorisé.
"""

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Prescription, CompteRendu


def _patient_initials(patient):
    """Ex: 'Jean Dupont' -> 'J. D.' — protège l'identité complète."""
    first = (patient.first_name or '').strip()
    last = (patient.last_name or '').strip()
    parts = []
    if first:
        parts.append(f"{first[0].upper()}.")
    if last:
        parts.append(f"{last[0].upper()}.")
    return ' '.join(parts) if parts else 'Patient'


class DocumentVerifyView(APIView):
    """
    GET /api/verify/document/<uuid:token>/
    Accessible SANS authentification — vérification publique d'authenticité.
    Cherche le token parmi les ordonnances ET les comptes-rendus.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        # ---- Cherche d'abord parmi les ordonnances ----
        try:
            prescription = Prescription.objects.select_related(
                'doctor__user', 'patient'
            ).get(verification_token=token)

            return Response({
                'valid': True,
                'document_type': 'ordonnance',
                'document_id': prescription.id,
                'doctor_name': f"Dr. {prescription.doctor.user.first_name} {prescription.doctor.user.last_name}",
                'doctor_license_number': prescription.doctor.license_number,
                'doctor_specialization': prescription.doctor.specialization,
                'patient_initials': _patient_initials(prescription.patient),
                'date': prescription.date,
                'status': prescription.status,
                'status_label': dict(Prescription.STATUS_CHOICES).get(prescription.status, prescription.status),
                'nb_medicaments': prescription.items.count(),
            })
        except Prescription.DoesNotExist:
            pass

        # ---- Sinon, cherche parmi les comptes-rendus ----
        try:
            compte_rendu = CompteRendu.objects.select_related(
                'doctor__user', 'patient'
            ).get(verification_token=token)

            return Response({
                'valid': True,
                'document_type': 'compte_rendu',
                'document_id': compte_rendu.id,
                'doctor_name': f"Dr. {compte_rendu.doctor.user.first_name} {compte_rendu.doctor.user.last_name}",
                'doctor_license_number': compte_rendu.doctor.license_number,
                'doctor_specialization': compte_rendu.doctor.specialization,
                'patient_initials': _patient_initials(compte_rendu.patient),
                'date': compte_rendu.date,
                'type': compte_rendu.type,
                'type_label': dict(CompteRendu.TYPE_CHOICES).get(compte_rendu.type, compte_rendu.type),
            })
        except CompteRendu.DoesNotExist:
            pass

        # ---- Token inconnu : réponse volontairement vague (sécurité) ----
        return Response(
            {
                'valid': False,
                'message': "Ce document n'a pas pu être vérifié. Il est peut-être invalide, falsifié, ou n'existe pas dans notre système.",
            },
            status=404
        )