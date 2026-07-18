# appointments/compte_rendu_pdf_views.py
"""
Vues pour le carnet médical (CompteRendu) :
- liste des comptes-rendus du patient connecté
- génération et téléchargement du PDF avec QR code d'authenticité
"""

import base64
from io import BytesIO

import qrcode
from django.http import HttpResponse
from django.template.loader import render_to_string
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CompteRendu
from .serializers import CompteRenduSerializer


def _generate_qr_base64(token):
    """Génère un QR code encodant le token de vérification, retourné en base64 pour l'embarquer dans le HTML."""
    qr = qrcode.QRCode(box_size=6, border=2)
    qr.add_data(str(token))
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    buffer = BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode('utf-8')


class PatientCompteRenduListView(APIView):
    """
    GET /api/appointments/patient/comptes-rendus/
    Liste tous les comptes-rendus (carnets médicaux) du patient connecté.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Accès réservé aux patients.'}, status=403)

        comptes_rendus = CompteRendu.objects.filter(
            patient=request.user
        ).select_related('doctor__user').order_by('-date', '-created_at')

        return Response(CompteRenduSerializer(comptes_rendus, many=True).data)


class CompteRenduPDFView(APIView):
    """
    GET /api/appointments/comptes-rendus/<int:pk>/pdf/
    Génère et retourne le PDF du carnet médical.
    Accessible au patient concerné OU au médecin auteur.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            compte_rendu = CompteRendu.objects.select_related(
                'patient', 'doctor__user'
            ).get(pk=pk)
        except CompteRendu.DoesNotExist:
            return Response({'error': 'Compte-rendu introuvable.'}, status=404)

        user = request.user
        is_patient_owner = compte_rendu.patient_id == user.id
        is_doctor_author = (
            user.role == 'doctor' and
            hasattr(user, 'doctor') and
            compte_rendu.doctor_id == user.doctor.id
        )

        if not (is_patient_owner or is_doctor_author):
            return Response({'error': 'Non autorisé à accéder à ce document.'}, status=403)

        # Import différé pour éviter un crash au démarrage du serveur si WeasyPrint
        # (et ses dépendances système GTK) n'est pas encore correctement installé.
        try:
            from weasyprint import HTML
        except Exception as e:
            return Response(
                {'error': f"Le générateur de PDF n'est pas disponible sur le serveur : {e}"},
                status=500
            )

        qr_base64 = _generate_qr_base64(compte_rendu.verification_token)

        html_content = render_to_string('appointments/compte_rendu_pdf.html', {
            'compte_rendu': compte_rendu,
            'patient_name': f"{compte_rendu.patient.first_name} {compte_rendu.patient.last_name}",
            'doctor_name': f"{compte_rendu.doctor.user.first_name} {compte_rendu.doctor.user.last_name}",
            'qr_base64': qr_base64,
        })

        pdf_file = HTML(string=html_content).write_pdf()

        response = HttpResponse(pdf_file, content_type='application/pdf')
        filename = f"carnet_medical_{compte_rendu.patient.last_name}_{compte_rendu.date}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response