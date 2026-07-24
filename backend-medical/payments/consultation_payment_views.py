# payments/consultation_payment_views.py
"""
Paiement d'une consultation par le patient via CamPay (Mobile Money).

Flux :
1. Le patient choisit son opérateur et entre son numéro
2. InitiateConsultationPaymentView appelle CamPay -> popup PIN sur son téléphone
3. Le frontend interroge PaymentStatusView toutes les X secondes
4. Une fois SUCCESSFUL, le paiement est marqué 'completed' en base
"""

import re
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from notifications.utils import notify_user
from appointments.models import Appointment
from .models import Payment
from .serializers import PaymentSerializer
from .campay_service import initiate_collection, check_transaction_status


def _normalize_phone(phone):
    """Nettoie le numéro et s'assure qu'il commence par l'indicatif 237."""
    digits = re.sub(r'\D', '', phone)
    if digits.startswith('237'):
        return digits
    if len(digits) == 9:  # numéro local sans indicatif
        return f"237{digits}"
    return digits


class InitiateConsultationPaymentView(APIView):
    """
    POST /api/payments/consultation/initiate/
    Body : { "appointment": <id>, "phone_number": "2376XXXXXXXX" }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Réservé aux patients.'}, status=403)

        appointment_id = request.data.get('appointment')
        phone_number = request.data.get('phone_number', '')

        if not appointment_id or not phone_number:
            return Response({'error': 'appointment et phone_number sont requis.'}, status=400)

        try:
            appointment = Appointment.objects.select_related('doctor').get(
                pk=appointment_id, patient=request.user
            )
        except Appointment.DoesNotExist:
            return Response({'error': 'Rendez-vous introuvable.'}, status=404)

        if not appointment.doctor:
            return Response({'error': 'Ce rendez-vous n\'a pas de médecin associé.'}, status=400)

        # Empêche un double paiement du même RDV
        already_paid = Payment.objects.filter(
            appointment=appointment, status='completed'
        ).exists()
        if already_paid:
            return Response({'error': 'Ce rendez-vous a déjà été payé.'}, status=400)

        amount = (
            appointment.doctor.fee_video
            if appointment.type == 'video'
            else appointment.doctor.fee_in_person
        )
        normalized_phone = _normalize_phone(phone_number)

        # Crée l'enregistrement de paiement en attente AVANT l'appel CamPay
        payment = Payment.objects.create(
            patient=request.user,
            appointment=appointment,
            amount=amount,
            currency='XAF',
            status='pending',
            method='mobile_money',
            payment_type='consultation',
            phone_number=normalized_phone,
            description=f"Consultation avec Dr. {appointment.doctor.user.last_name} — {appointment.date}",
        )

        try:
            campay_response = initiate_collection(
                amount=amount,
                phone_number=normalized_phone,
                description=payment.description,
                external_reference=str(payment.id),
            )
        except Exception as e:
            payment.status = 'failed'
            payment.failure_reason = str(e)
            payment.save()
            return Response({'error': f"Erreur CamPay : {e}"}, status=502)

        reference = campay_response.get('reference')
        if not reference:
            payment.status = 'failed'
            payment.failure_reason = campay_response.get('message', 'Réponse CamPay invalide.')
            payment.save()
            return Response({'error': 'Impossible d\'initier le paiement.'}, status=502)

        payment.campay_reference = reference
        payment.save()

        return Response({
            'payment_id': payment.id,
            'reference': reference,
            'status': 'pending',
            'message': "Vérifiez votre téléphone et confirmez avec votre code PIN Mobile Money.",
        }, status=status.HTTP_201_CREATED)


class ConsultationPaymentStatusView(APIView):
    """
    GET /api/payments/consultation/status/<int:payment_id>/
    Interroge CamPay pour connaître le statut réel de la transaction
    et met à jour le paiement en base en conséquence.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, payment_id):
        try:
            payment = Payment.objects.get(pk=payment_id, patient=request.user)
        except Payment.DoesNotExist:
            return Response({'error': 'Paiement introuvable.'}, status=404)

        # Si déjà finalisé, pas besoin de re-questionner CamPay
        if payment.status in ('completed', 'failed', 'refunded', 'cancelled'):
            return Response(PaymentSerializer(payment).data)

        if not payment.campay_reference:
            return Response(PaymentSerializer(payment).data)

        try:
            campay_status = check_transaction_status(payment.campay_reference)
        except Exception as e:
            return Response({'error': f"Erreur de vérification : {e}"}, status=502)

        remote_status = campay_status.get('status')  # PENDING / SUCCESSFUL / FAILED

        if remote_status == 'SUCCESSFUL':
            payment.status = 'completed'
            payment.transaction_id = campay_status.get('reference', payment.campay_reference)
            payment.save()

            # ⬇NOUVEAU : notifier patient ET médecin
            notify_user(
                user=payment.patient,
                type='payment_confirmed',
                title='Paiement confirmé',
                message='Votre paiement a été confirmé. Vous pouvez rejoindre votre consultation.',
                link='/patient/rendez-vous',
            )
            if payment.appointment and payment.appointment.doctor:
                notify_user(
                    user=payment.appointment.doctor.user,
                    type='payment_confirmed',
                    title='Patient payé',
                    message=f"{payment.patient.first_name} {payment.patient.last_name} a payé sa consultation — vous pouvez démarrer l'appel.",
                    link='/medecin/consultations',
                )
        elif remote_status == 'FAILED':
            payment.status = 'failed'
            payment.failure_reason = campay_status.get('reason', 'Paiement refusé ou annulé.')
            payment.save()
        # Si PENDING, on ne change rien — le frontend continuera à interroger

        return Response(PaymentSerializer(payment).data)