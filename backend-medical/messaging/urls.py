# messaging/urls.py

from django.urls import path
from .views import (
    ConversationListCreateView,
    ConversationDetailView,
    SendMessageView,
    AvailableContactsView,
)

urlpatterns = [
    path('conversations/', ConversationListCreateView.as_view(), name='conversation-list'),
    path('conversations/<int:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
    path('conversations/<int:pk>/messages/', SendMessageView.as_view(), name='send-message'),
    path('contacts/', AvailableContactsView.as_view(), name='available-contacts'),
]