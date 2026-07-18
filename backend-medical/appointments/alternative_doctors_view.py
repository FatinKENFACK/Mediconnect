# appointments/alternative_doctors_view.py
"""
Propose des médecins alternatifs (même spécialisation, disponibles)
lorsqu'un rendez-vous reste en statut 'pending' trop longtemps —
le médecin initial n'a pas confirmé, le patient peut basculer facilement.
"""

from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.models import Doctor
from accounts.serializers import DoctorProfileSerializer
from .models import Appointment


class AlternativeDoctorsView(APIView):
    """
    GET /api/appointments/<int:pk>/alternative-doctors/
    Renvoie une liste de médecins disponibles ayant la même spécialisation
    que le médecin du RDV concerné (hors lui-même).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            appointment = Appointment.objects.select_related('doctor').get(pk=pk)
        except Appointment.DoesNotExist:
            return Response({'error': 'Rendez-vous introuvable.'}, status=404)

        if appointment.patient_id != request.user.id:
            return Response({'error': 'Non autorisé.'}, status=403)

        if not appointment.doctor:
            return Response({'error': 'Ce rendez-vous n\'a pas de médecin associé.'}, status=400)

        alternatives = Doctor.objects.filter(
            specialization=appointment.doctor.specialization,
            is_available=True,
            is_verified=True,
        ).exclude(id=appointment.doctor_id).select_related('user', 'hospital').order_by('-experience_years')

        return Response({
            'original_doctor': appointment.doctor.specialization,
            'count': alternatives.count(),
            'doctors': DoctorProfileSerializer(alternatives, many=True).data,
        })