from django.urls import path
from .views import (
    PatientSearchView,
    DoctorSearchView,
    HospitalSearchView,
    AdminSearchView,
)
 
urlpatterns = [
    path('patient/',  PatientSearchView.as_view(),  name='search-patient'),
    path('doctor/',   DoctorSearchView.as_view(),   name='search-doctor'),
    path('hospital/', HospitalSearchView.as_view(), name='search-hospital'),
    path('admin/',    AdminSearchView.as_view(),    name='search-admin'),
]