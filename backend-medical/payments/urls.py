from django.urls import path
from .views import AdminPaymentListView, AdminPaymentDetailView

urlpatterns = [
    path('', AdminPaymentListView.as_view(), name='admin-payments'),
    path('<int:pk>/', AdminPaymentDetailView.as_view(), name='admin-payment-detail'),
]