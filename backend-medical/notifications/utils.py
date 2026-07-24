# notifications/utils.py
"""
Point d'entrée unique pour créer une notification : elle est à la fois
- enregistrée en base (visible dans l'historique de la cloche)
- poussée en temps réel via WebSocket si l'utilisateur est connecté

Utilisation depuis n'importe quelle app :
    from notifications.utils import notify_user
    notify_user(
        user=appointment.patient,
        type='payment_confirmed',
        title='Paiement confirmé',
        message='Votre consultation a été payée avec succès.',
        link='/patient/rendez-vous',
    )
"""

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Notification
from .serializers import NotificationSerializer


def notify_user(user, type, title, message, link=''):
    notification = Notification.objects.create(
        recipient=user,
        type=type,
        title=title,
        message=message,
        link=link,
    )

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'notify_{user.id}',
        {
            'type': 'notification_event',
            'payload': {
                'event': 'new_notification',
                'notification': NotificationSerializer(notification).data,
            },
        }
    )

    return notification