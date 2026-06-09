from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from accounts.permissions import IsAdminRole
from .models import Payment
from .serializers import PaymentSerializer


class AdminPaymentListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        payments = Payment.objects.select_related(
            'hospital', 'subscription'
        ).all()
        return Response(PaymentSerializer(payments, many=True).data)

    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class AdminPaymentDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_object(self, pk):
        try:
            return Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return None

    def get(self, request, pk):
        payment = self.get_object(pk)
        if not payment:
            return Response({'error': 'Paiement introuvable'}, status=404)
        return Response(PaymentSerializer(payment).data)

    def patch(self, request, pk):
        payment = self.get_object(pk)
        if not payment:
            return Response({'error': 'Paiement introuvable'}, status=404)

        action = request.data.get('action')
        if action == 'refund':
            from django.utils import timezone
            payment.status       = 'refunded'
            payment.refunded     = True
            payment.refund_date  = timezone.now().date()
            payment.refund_reason = request.data.get('reason', '')
        elif action == 'complete':
            payment.status = 'completed'
        elif action == 'cancel':
            payment.status = 'cancelled'
        else:
            for field in ['status', 'failure_reason', 'transaction_id']:
                if field in request.data:
                    setattr(payment, field, request.data[field])

        payment.save()
        return Response(PaymentSerializer(payment).data)