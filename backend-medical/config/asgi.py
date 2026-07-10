import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# IMPORTANT : on initialise Django AVANT d'importer quoi que ce soit
# qui touche aux modèles (routing, middleware, consumers)
django_asgi_app = get_asgi_application()

from messaging.middleware import JwtAuthMiddleware
import messaging.routing
import appointments.routing

application = ProtocolTypeRouter({
    # Requêtes HTTP classiques (DRF, admin, etc.)
    'http': django_asgi_app,

    # Connexions WebSocket (chat + notifications d'appel), toutes les deux en JWT
    'websocket': AllowedHostsOriginValidator(
        JwtAuthMiddleware(
            URLRouter(
                messaging.routing.websocket_urlpatterns +
                appointments.routing.websocket_urlpatterns
            )
        )
    ),
})