import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from messaging.middleware import JwtAuthMiddleware  # on crée ça à l'étape 3
import messaging.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mediconnect.settings')

application = ProtocolTypeRouter({
    # Requêtes HTTP classiques (DRF, admin, etc.)
    'http': get_asgi_application(),

    # Connexions WebSocket
    'websocket': AllowedHostsOriginValidator(
        JwtAuthMiddleware(
            URLRouter(messaging.routing.websocket_urlpatterns)
        )
    ),
})