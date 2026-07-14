# appointments/verification_views.py
"""
Vérification anti-fraude pour les rendez-vous présentiels.

Flux :
1. Le patient affiche son QR code (encodant verification_token) depuis l'app
2. Le personnel hospitalier (ou le médecin) scanne/saisit le token à l'accueil
3. AppointmentVerifyView renvoie les détails pour comparaison visuelle avec la pièce d'identité
4. AppointmentCheckInView enregistre la confirmation d'arrivée
"""

from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Appointment


def _user_can_access(user, appointment):
    """
    Vérifie que l'utilisateur qui scanne a bien le droit de vérifier ce RDV précis :
    - le médecin concerné lui-même
    - ou un compte hôpital dont l'établissement emploie ce médecin
    """
    if user.role == 'doctor' and hasattr(user, 'doctor'):
        return appointment.doctor_id == user.doctor.id
    if user.role == 'hospital' and hasattr(user, 'hospital'):
        return (
            appointment.doctor is not None and
            appointment.doctor.hospital_id == user.hospital.id
        )
    return False


class AppointmentVerifyView(APIView):
    """
    GET /api/appointments/verify/<uuid:token>/
    Renvoie les détails du RDV pour vérification visuelle par le personnel.
    Ne renvoie AUCUNE information si le token est invalide ou si l'utilisateur
    n'a pas le droit de vérifier ce RDV précis (pas de fuite d'info).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, token):
        try:
            appointment = Appointment.objects.select_related(
                'patient', 'doctor__user', 'doctor__hospital'
            ).get(verification_token=token)
        except (Appointment.DoesNotExist, ValueError):
            return Response({'error': 'Code de vérification invalide.'}, status=status.HTTP_404_NOT_FOUND)

        if not _user_can_access(request.user, appointment):
            return Response({'error': 'Non autorisé à vérifier ce rendez-vous.'}, status=status.HTTP_403_FORBIDDEN)

        if appointment.type not in ('in-person', 'presentiel'):
            return Response(
                {'error': 'Ce rendez-vous n\'est pas une consultation en présentiel.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if appointment.status != 'confirmed':
            return Response(
                {
                    'error': f"Ce rendez-vous n'est pas confirmé (statut actuel : {appointment.status}).",
                    'status': appointment.status,
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        already_checked_in = appointment.checked_in_at is not None

        return Response({
            'appointment_id': appointment.id,
            'patient_name': f"{appointment.patient.first_name} {appointment.patient.last_name}",
            'patient_phone': getattr(appointment.patient, 'phone', ''),
            'doctor_name': f"Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}",
            'date': appointment.date,
            'time': appointment.time,
            'reason': appointment.reason,
            'already_checked_in': already_checked_in,
            'checked_in_at': appointment.checked_in_at,
        })


class AppointmentCheckInView(APIView):
    """
    POST /api/appointments/verify/<uuid:token>/checkin/
    Confirme l'arrivée du patient — enregistre l'horodatage et l'auteur.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, token):
        try:
            appointment = Appointment.objects.select_related('doctor__hospital').get(verification_token=token)
        except (Appointment.DoesNotExist, ValueError):
            return Response({'error': 'Code de vérification invalide.'}, status=status.HTTP_404_NOT_FOUND)

        if not _user_can_access(request.user, appointment):
            return Response({'error': 'Non autorisé.'}, status=status.HTTP_403_FORBIDDEN)

        if appointment.checked_in_at is not None:
            return Response(
                {'error': 'Ce patient a déjà été confirmé comme présent.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        appointment.checked_in_at = timezone.now()
        appointment.checked_in_by = request.user
        appointment.save()

        return Response({
            'success': True,
            'checked_in_at': appointment.checked_in_at,
            'message': 'Arrivée du patient confirmée.',
        })