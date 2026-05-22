from django.urls import path
from .views import (
    AppointmentListCreateView,
    AppointmentDetailView,
    DoctorAppointmentListView,
    AppointmentStatusUpdateView,
    DoctorAppointmentStatsView,
    DoctorAvailabilityListCreateView,
    DoctorAvailabilityDetailView,
    DoctorAvailabilityBulkSaveView,
    PrescriptionListCreateView,
    PrescriptionDetailView,
    DoctorPatientsListView,
)

urlpatterns = [
    path('', AppointmentListCreateView.as_view(), name='appointment-list'),
    path('<int:pk>/', AppointmentDetailView.as_view(), name='appointment-detail'),
    path('doctor/', DoctorAppointmentListView.as_view(), name='doctor-appointments'),
    path('doctor/stats/', DoctorAppointmentStatsView.as_view(), name='doctor-appointments-stats'),
    path('doctor/patients/', DoctorPatientsListView.as_view(), name='doctor-patients'),
    path('doctor/<int:pk>/status/', AppointmentStatusUpdateView.as_view(), name='appointment-status-update'),
    # Disponibilités
    path('availability/', DoctorAvailabilityListCreateView.as_view(), name='doctor-availability-list'),
    path('availability/bulk-save/', DoctorAvailabilityBulkSaveView.as_view(), name='doctor-availability-bulk'),
    path('availability/<int:pk>/', DoctorAvailabilityDetailView.as_view(), name='doctor-availability-detail'),
    # Prescriptions
    path('prescriptions/', PrescriptionListCreateView.as_view(), name='prescription-list'),
    path('prescriptions/<int:pk>/', PrescriptionDetailView.as_view(), name='prescription-detail'),
]