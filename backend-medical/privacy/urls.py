from django.urls import path
from .views import (
    AccessLogListView,
    DataRequestListView,
    DataRequestDetailView,
    PrivacySettingsView,
    PrivacyStatsView,
)

urlpatterns = [
    path('logs/',              AccessLogListView.as_view(),    name='access-logs'),
    path('requests/',          DataRequestListView.as_view(),  name='data-requests'),
    path('requests/<int:pk>/', DataRequestDetailView.as_view(),name='data-request-detail'),
    path('settings/',          PrivacySettingsView.as_view(),  name='privacy-settings'),
    path('stats/',             PrivacyStatsView.as_view(),     name='privacy-stats'),
]