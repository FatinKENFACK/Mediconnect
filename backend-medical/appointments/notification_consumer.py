# appointments/notification_consumer.py
"""
Consumer WebSocket générique de notifications personnelles.
Chaque utilisateur connecté rejoint son propre groupe : notify_<user_id>
Utilisé pour : notification d'appel entrant (et pourra servir plus tard
à d'autres notifications temps réel : nouveau message, rappel RDV, etc.)
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.user = self.scope['user']

        if isinstance(self.user, AnonymousUser) or not self.user.is_authenticated:
            await self.close(code=4001)
            return

        self.group_name = f'notify_{self.user.id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        # Ce canal est unidirectionnel (serveur -> client) ; on ignore les messages entrants
        pass

    # ============================================================
    # HANDLER : reçoit l'event envoyé par call_views.py via group_send
    # ============================================================
    async def call_event(self, event):
        await self.send(text_data=json.dumps(event['payload']))