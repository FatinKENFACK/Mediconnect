from rest_framework import serializers
from .models import Conversation, Message


# ============================================================
# SERIALIZER : Message
# Convertit un message Python en JSON et vice versa
# ============================================================
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = [
            'id',           # Identifiant unique du message
            'sender',       # Qui a envoyé : 'patient' ou 'doctor'
            'content',      # Contenu du message
            'is_read',      # Si le message a été lu
            'created_at'    # Date et heure d'envoi
        ]
        # Ces champs sont générés automatiquement
        read_only_fields = ['id', 'created_at', 'is_read']


# ============================================================
# SERIALIZER : Conversation
# Inclut les messages et les infos du dernier message
# ============================================================
class ConversationSerializer(serializers.ModelSerializer):

    # Inclut tous les messages de la conversation
    # many=True car une conversation a plusieurs messages
    # read_only=True car on ne crée pas de messages via ce serializer
    messages = MessageSerializer(many=True, read_only=True)

    # Champ calculé pour afficher le dernier message dans la liste
    last_message_text = serializers.SerializerMethodField()

    # Champ calculé pour l'heure du dernier message
    last_message_time = serializers.SerializerMethodField()

    # Champ calculé pour le nombre de messages non lus
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id',
            'doctor_name',          # Nom du médecin
            'doctor_specialty',     # Spécialité du médecin
            'messages',             # Liste de tous les messages
            'last_message_text',    # Aperçu du dernier message
            'last_message_time',    # Heure du dernier message
            'unread_count',         # Nombre de messages non lus
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    # Retourne le texte du dernier message
    # Utilisé pour l'aperçu dans la liste des conversations
    def get_last_message_text(self, obj):
        last = obj.messages.last()
        if last:
            return last.content[:50]  # On tronque à 50 caractères
        return ''

    # Retourne l'heure du dernier message formatée
    def get_last_message_time(self, obj):
        last = obj.messages.last()
        if last:
            return last.created_at.strftime('%H:%M')
        return ''

    # Retourne le nombre de messages non lus
    def get_unread_count(self, obj):
        return obj.messages.filter(sender='doctor', is_read=False).count()