# accounts/urls.py

from django.urls import path
from .views import (
    # Auth
    PatientRegisterView,
    HospitalRegisterView,
    DoctorRegisterView,
    LoginView,
    
    # Profils
    UserProfileView,
    HospitalProfileView,
    DoctorProfileView,
    DoctorListView,
    ChangePasswordView,
    
    # Admin
    AdminStatsView,
    AdminHospitalListView,
    AdminHospitalStatusView,
    AdminDoctorListView,
    AdminDoctorStatusView,
    AdminSubscriptionListView,
    AdminSubscriptionStatusView,
    
    # Public
    PublicHospitalListView,
    PublicHospitalDetailView,
    
    # Hôpital
    HospitalAppointmentsView,
    HospitalDoctorsView,
    HospitalStatsView,
    HospitalDoctorStatusView,
    
    # Services hospitaliers (CORRECTION ICI)
    HospitalServicesView,  # Au lieu de HospitalServiceListCreateView
    HospitalServiceDetailView,

      # Abonnements
    HospitalSubscriptionStatusView,
    HospitalSubscriptionView,
    HospitalSubscriptionUpdateView,
    HospitalSubscriptionCancelView,
    HospitalPaymentHistoryView,
    HospitalPaymentCreateView,
)

urlpatterns = [
    # ===================== AUTH =====================
    path('register/patient/', PatientRegisterView.as_view(), name='register-patient'),
    path('register/hospital/', HospitalRegisterView.as_view(), name='register-hospital'),
    path('register/doctor/', DoctorRegisterView.as_view(), name='register-doctor'),
    path('login/', LoginView.as_view(), name='login'),
    
    # ===================== PROFILS =====================
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/update/', UserProfileView.as_view(), name='user-profile-update'),
    path('hospital/profile/', HospitalProfileView.as_view(), name='hospital-profile'),
    path('doctor/profile/', DoctorProfileView.as_view(), name='doctor-profile'),
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # ===================== ADMIN =====================
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/hospitals/', AdminHospitalListView.as_view(), name='admin-hospitals'),
    path('admin/hospitals/<int:pk>/status/', AdminHospitalStatusView.as_view(), name='admin-hospital-status'),
    path('admin/doctors/', AdminDoctorListView.as_view(), name='admin-doctors'),
    path('admin/doctors/<int:pk>/status/', AdminDoctorStatusView.as_view(), name='admin-doctor-status'),
    path('admin/subscriptions/', AdminSubscriptionListView.as_view(), name='admin-subscriptions'),
    path('admin/subscriptions/<int:pk>/status/', AdminSubscriptionStatusView.as_view(), name='admin-subscription-status'),
    
    # ===================== PUBLIC =====================
    path('hospitals/public/', PublicHospitalListView.as_view(), name='public-hospitals'),
    path('hospitals/public/<int:pk>/', PublicHospitalDetailView.as_view(), name='public-hospital-detail'),
    
    # ===================== HÔPITAL =====================
    path('hospital/appointments/', HospitalAppointmentsView.as_view(), name='hospital-appointments'),
    path('hospital/doctors/', HospitalDoctorsView.as_view(), name='hospital-doctors'),
    path('hospital/stats/', HospitalStatsView.as_view(), name='hospital-stats'),
    path('hospital/doctors/<int:pk>/status/', HospitalDoctorStatusView.as_view(), name='hospital-doctor-status'),
    
    # ===================== SERVICES HOSPITALIERS =====================
    path('hospital/services/', HospitalServicesView.as_view(), name='hospital-services'),
    path('hospital/services/<int:pk>/', HospitalServiceDetailView.as_view(), name='hospital-service-detail'),

     # ===================== ABONNEMENTS HÔPITAL =====================
    path('hospital/subscription/status/', HospitalSubscriptionStatusView.as_view(), name='hospital-subscription-status'),
    path('hospital/subscription/', HospitalSubscriptionView.as_view(), name='hospital-subscription'),
    path('hospital/subscription/update/', HospitalSubscriptionUpdateView.as_view(), name='hospital-subscription-update'),
    path('hospital/subscription/cancel/', HospitalSubscriptionCancelView.as_view(), name='hospital-subscription-cancel'),
    path('hospital/payments/', HospitalPaymentHistoryView.as_view(), name='hospital-payments'),
    path('hospital/payments/create/', HospitalPaymentCreateView.as_view(), name='hospital-payment-create'),
]