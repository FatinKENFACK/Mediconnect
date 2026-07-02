# messaging/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser


class ChatConsumer(AsyncWebsocketConsumer):
    """
    Consumer WebSocket pour une conversation 1-à-1.
    Groupe Redis : chat_<conversation_id>
    """

    async def connect(self):
        self.user = self.scope['user']
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        # Refuser si non authentifié
        if isinstance(self.user, AnonymousUser) or not self.user.is_authenticated:
            await self.close(code=4001)
            return

        # Vérifier que l'utilisateur appartient bien à cette conversation
        has_access = await self.user_in_conversation(self.user.id, self.conversation_id)
        if not has_access:
            await self.close(code=4003)
            return

        # Rejoindre le groupe Redis de cette conversation
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Marquer les messages comme lus à la connexion
        await self.mark_messages_as_read(self.conversation_id, self.user.id)

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """
        Reçoit un message du client.
        Format attendu : { "type": "message", "content": "..." }
        Ou pour le statut "en train d'écrire" : { "type": "typing" }
        """
        data = json.loads(text_data)
        msg_type = data.get('type', 'message')

        if msg_type == 'message':
            content = data.get('content', '').strip()
            if not content:
                return

            # Sauvegarder en base
            message = await self.save_message(self.conversation_id, self.user.id, content)

            # Diffuser à tous les membres connectés de la conversation
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': {
                        'id':              message['id'],
                        'conversation_id': self.conversation_id,
                        'sender_id':       self.user.id,
                        'sender_name':     f"{self.user.first_name} {self.user.last_name}".strip(),
                        'sender_role':     self.user.role,
                        'content':         message['content'],
                        'is_read':         False,
                        'created_at':      message['created_at'],
                    }
                }
            )

        elif msg_type == 'typing':
            # Notifier l'autre participant que l'utilisateur écrit
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'typing_notification',
                    'user_id': self.user.id,
                    'is_typing': data.get('is_typing', True),
                }
            )

        elif msg_type == 'read':
            # Marquer les messages comme lus
            await self.mark_messages_as_read(self.conversation_id, self.user.id)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'read_notification',
                    'user_id': self.user.id,
                }
            )

    # ============================================================
    # HANDLERS : reçoivent les events du group_send et les envoient au client
    # ============================================================

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message'],
        }))

    async def typing_notification(self, event):
        # Ne pas renvoyer à l'expéditeur lui-même
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'typing',
                'user_id': event['user_id'],
                'is_typing': event['is_typing'],
            }))

    async def read_notification(self, event):
        await self.send(text_data=json.dumps({
            'type': 'read',
            'user_id': event['user_id'],
        }))

    # ============================================================
    # ACCÈS BASE DE DONNÉES (sync → async)
    # ============================================================

    @database_sync_to_async
    def user_in_conversation(self, user_id, conversation_id):
        from .models import Conversation
        try:
            conv = Conversation.objects.get(id=conversation_id)
            return user_id in [
                getattr(conv.patient, 'id', None),
                getattr(conv.medecin, 'id', None),
                getattr(conv.hopital, 'id', None),
            ]
        except Conversation.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, conversation_id, sender_id, content):
        from .models import Conversation, Message
        from django.contrib.auth import get_user_model
        User = get_user_model()

        conversation = Conversation.objects.get(id=conversation_id)
        sender = User.objects.get(id=sender_id)

        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            content=content,
        )
        # Mettre à jour updated_at de la conversation pour le tri
        conversation.save(update_fields=['updated_at'])

        return {
            'id':         message.id,
            'content':    message.content,
            'created_at': message.created_at.isoformat(),
        }

    @database_sync_to_async
    def mark_messages_as_read(self, conversation_id, user_id):
        from .models import Message
        Message.objects.filter(
            conversation_id=conversation_id,
            is_read=False,
        ).exclude(sender_id=user_id).update(is_read=True)