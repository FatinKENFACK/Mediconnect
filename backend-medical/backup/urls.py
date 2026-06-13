from django.urls import path
from .views import (
    BackupListView,
    BackupCreateView,
    BackupDownloadView,
    BackupDeleteView,
    BackupStatsView,
)

urlpatterns = [
    path('',                          BackupListView.as_view(),     name='backup-list'),
    path('create/',                   BackupCreateView.as_view(),   name='backup-create'),
    path('stats/',                    BackupStatsView.as_view(),    name='backup-stats'),
    path('download/<str:filename>/',  BackupDownloadView.as_view(), name='backup-download'),
    path('delete/<str:filename>/',    BackupDeleteView.as_view(),   name='backup-delete'),
]
