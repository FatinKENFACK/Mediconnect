from django.urls import path
from .views import (
    PatientCreateReviewView,
    PatientMyReviewsView,
    DoctorPublicReviewsView,
    DoctorMyReviewsView,
    HospitalReviewsView,
    AdminReviewListView,
    AdminReviewDetailView,
)

urlpatterns = [
    # ---- Patient ----
    path('',           PatientCreateReviewView.as_view(), name='review-create'),    # POST
    path('my/',        PatientMyReviewsView.as_view(),    name='review-my-list'),   # GET
    path('my/<int:pk>/', PatientMyReviewsView.as_view(),  name='review-my-delete'), # DELETE

    # ---- Public ----
    path('doctor/<int:doctor_id>/', DoctorPublicReviewsView.as_view(), name='review-doctor-public'),

    # ---- Médecin ----
    path('doctor/me/', DoctorMyReviewsView.as_view(), name='review-doctor-me'),

    # ---- Hôpital ----
    path('hospital/', HospitalReviewsView.as_view(), name='review-hospital'),

    # ---- Admin ----
    path('admin/',          AdminReviewListView.as_view(),   name='review-admin-list'),
    path('admin/<int:pk>/', AdminReviewDetailView.as_view(), name='review-admin-detail'),
]