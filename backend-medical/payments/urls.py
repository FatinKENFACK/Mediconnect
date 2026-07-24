from django.urls import path
from .views import AdminPaymentListView, AdminPaymentDetailView
from .consultation_payment_views import InitiateConsultationPaymentView, ConsultationPaymentStatusView

urlpatterns = [
    path('', AdminPaymentListView.as_view(), name='admin-payments'),
    path('<int:pk>/', AdminPaymentDetailView.as_view(), name='admin-payment-detail'),

    # Patient — paiement consultation via CamPay
    path('consultation/initiate/', InitiateConsultationPaymentView.as_view(), name='consultation-payment-initiate'),
    path('consultation/status/<int:payment_id>/', ConsultationPaymentStatusView.as_view(), name='consultation-payment-status'),
]