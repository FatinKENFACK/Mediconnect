from django.urls import path
from . import views

urlpatterns = [
    path('conversations/', views.ConversationListCreateView.as_view()),
    path('conversations/<int:pk>/', views.ConversationDetailView.as_view()),
    path('conversations/<int:conversation_pk>/messages/', views.MessageListCreateView.as_view()),
]