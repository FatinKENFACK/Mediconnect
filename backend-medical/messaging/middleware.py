# messaging/middleware.py

from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError


@database_sync_to_async
def get_user_from_token(token):
    """
    Décode le JWT et retourne l'utilisateur correspondant.
    Retourne AnonymousUser si le token est invalide/expiré.
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()

    try:
        access_token = AccessToken(token)
        user_id = access_token['user_id']
        return User.objects.get(id=user_id)
    except (TokenError, KeyError, User.DoesNotExist):
        return AnonymousUser()


class JwtAuthMiddleware:
    """
    Middleware ASGI qui authentifie les connexions WebSocket via JWT.
    Le token est passé en query string : ws://.../ws/chat/1/?token=xxx
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        query_string = scope.get('query_string', b'').decode()
        params = parse_qs(query_string)
        token = params.get('token', [None])[0]

        if token:
            scope['user'] = await get_user_from_token(token)
        else:
            scope['user'] = AnonymousUser()

        return await self.app(scope, receive, send)