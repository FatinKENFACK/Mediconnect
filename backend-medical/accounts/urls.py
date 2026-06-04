from django.urls import path


from .views import (
    DoctorListView, DoctorProfileView, HospitalAppointmentsView, HospitalProfileView,
    PatientRegisterView, HospitalRegisterView, LoginView,
    UserProfileView, DoctorRegisterView,
    AdminStatsView, AdminHospitalListView, AdminHospitalStatusView,
    AdminDoctorListView, AdminDoctorStatusView,
    PublicHospitalListView, PublicHospitalDetailView,
)

urlpatterns = [
    # Inscription
    path('register/patient/', PatientRegisterView.as_view(), name='register-patient'),
    path('register/hospital/', HospitalRegisterView.as_view(), name='register-hospital'),
    path('register/doctor/', DoctorRegisterView.as_view(), name='register-doctor'),

    # Connexion
    path('login/', LoginView.as_view(), name='login'),

    # Profil utilisateur
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/update/', UserProfileView.as_view(), name='user-profile-update'),

    # Profil hôpital
    path('hospital/profile/', HospitalProfileView.as_view(), name='hospital-profile'),

    # Profil médecin
    path('doctor/profile/', DoctorProfileView.as_view(), name='doctor-profile'),
    path('doctors/', DoctorListView.as_view(), name='doctor-list'),

    # Admin
    path('admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('admin/hospitals/', AdminHospitalListView.as_view(), name='admin-hospitals'),
    path('admin/hospitals/<int:pk>/status/', AdminHospitalStatusView.as_view(), name='admin-hospital-status'),
    path('admin/doctors/', AdminDoctorListView.as_view(), name='admin-doctors'),
    path('admin/doctors/<int:pk>/status/', AdminDoctorStatusView.as_view(), name='admin-doctor-status'),


    # Dans urlpatterns, ajoute :
    path('hospitals/public/', PublicHospitalListView.as_view(), name='public-hospitals'),
    path('hospitals/public/<int:pk>/', PublicHospitalDetailView.as_view(), name='public-hospital-detail'),

    path('hospital/appointments/', HospitalAppointmentsView.as_view(), name='hospital-appointments'),
]