# appointments/prescription_pdf_views.py
"""
Vues pour l'ordonnance (Prescription) :
- liste des ordonnances du patient connecté
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

from .models import Prescription
from .serializers import PrescriptionSerializer


def _generate_qr_base64(token):
    qr = qrcode.QRCode(box_size=6, border=2)
    qr.add_data(str(token))
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")

    buffer = BytesIO()
    img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode('utf-8')


class PatientPrescriptionListView(APIView):
    """
    GET /api/appointments/patient/prescriptions/
    Liste toutes les ordonnances du patient connecté.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Accès réservé aux patients.'}, status=403)

        prescriptions = Prescription.objects.filter(
            patient=request.user
        ).select_related('doctor__user').prefetch_related('items').order_by('-date', '-created_at')

        return Response(PrescriptionSerializer(prescriptions, many=True).data)


class PrescriptionPDFView(APIView):
    """
    GET /api/appointments/prescriptions/<int:pk>/pdf/
    Génère et retourne le PDF de l'ordonnance.
    Accessible au patient concerné OU au médecin prescripteur.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            prescription = Prescription.objects.select_related(
                'patient', 'doctor__user'
            ).prefetch_related('items').get(pk=pk)
        except Prescription.DoesNotExist:
            return Response({'error': 'Ordonnance introuvable.'}, status=404)

        user = request.user
        is_patient_owner = prescription.patient_id == user.id
        is_doctor_author = (
            user.role == 'doctor' and
            hasattr(user, 'doctor') and
            prescription.doctor_id == user.doctor.id
        )

        if not (is_patient_owner or is_doctor_author):
            return Response({'error': 'Non autorisé à accéder à ce document.'}, status=403)

        try:
            from weasyprint import HTML
        except Exception as e:
            return Response(
                {'error': f"Le générateur de PDF n'est pas disponible sur le serveur : {e}"},
                status=500
            )

        qr_base64 = _generate_qr_base64(prescription.verification_token)

        html_content = render_to_string('appointments/prescription_pdf.html', {
            'prescription': prescription,
            'items': prescription.items.all(),
            'patient_name': f"{prescription.patient.first_name} {prescription.patient.last_name}",
            'doctor_name': f"{prescription.doctor.user.first_name} {prescription.doctor.user.last_name}",
            'qr_base64': qr_base64,
        })

        pdf_file = HTML(string=html_content).write_pdf()

        response = HttpResponse(pdf_file, content_type='application/pdf')
        filename = f"ordonnance_{prescription.patient.last_name}_{prescription.date}.pdf"
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response