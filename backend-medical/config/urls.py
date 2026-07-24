from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/accounts/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('api/appointments/', include('appointments.urls')),
    path('api/medical/', include('medical_records.urls')),
    path('api/messaging/', include('messaging.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/backup/', include('backup.urls')),
    path('api/privacy/', include('privacy.urls')),
    path('api/search/', include('search.urls')),
    path('api/notifications/', include('notifications.urls')),

    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)