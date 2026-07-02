# messaging/serializers.py

from rest_framework import serializers
from .models import Conversation, Message


# ============================================================
# SERIALIZER : Message
# ============================================================
class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    sender_role = serializers.SerializerMethodField()
    is_mine     = serializers.SerializerMethodField()

    class Meta:
        model  = Message
        fields = [
            'id', 'conversation', 'sender', 'sender_name', 'sender_role',
            'content', 'is_read', 'is_mine', 'created_at',
        ]

    def get_sender_name(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name}".strip()

    def get_sender_role(self, obj):
        return obj.sender.role

    def get_is_mine(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.sender_id == request.user.id
        return False


# ============================================================
# SERIALIZER : Conversation (liste)
# ============================================================
class ConversationListSerializer(serializers.ModelSerializer):
    other_participant_name      = serializers.SerializerMethodField()
    other_participant_role      = serializers.SerializerMethodField()
    other_participant_avatar    = serializers.SerializerMethodField()
    other_participant_specialty = serializers.SerializerMethodField()
    last_message_text           = serializers.SerializerMethodField()
    last_message_time           = serializers.SerializerMethodField()
    unread_count                = serializers.IntegerField(read_only=True)

    class Meta:
        model  = Conversation
        fields = [
            'id', 'type',
            'other_participant_name', 'other_participant_role',
            'other_participant_avatar', 'other_participant_specialty',
            'last_message_text', 'last_message_time',
            'unread_count', 'updated_at',
        ]

    def _get_other_user(self, obj):
        """Retourne l'utilisateur en face, selon qui est connecté."""
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        current_id = request.user.id

        for participant in [obj.patient, obj.medecin, obj.hopital]:
            if participant and participant.id != current_id:
                return participant
        return None

    def get_other_participant_name(self, obj):
        user = self._get_other_user(obj)
        if not user:
            return "Utilisateur"
        if user.role == 'doctor':
            return f"Dr. {user.first_name} {user.last_name}".strip()
        if user.role == 'hospital' and hasattr(user, 'hospital'):
            return user.hospital.name
        return f"{user.first_name} {user.last_name}".strip()

    def get_other_participant_role(self, obj):
        user = self._get_other_user(obj)
        return user.role if user else None

    def get_other_participant_avatar(self, obj):
        user = self._get_other_user(obj)
        if user and user.profile_picture:
            return user.profile_picture.url
        return None

    def get_other_participant_specialty(self, obj):
        user = self._get_other_user(obj)
        if user and user.role == 'doctor':
            return getattr(user, 'specialization', '') or ''
        return ''

    def get_last_message_text(self, obj):
        last = obj.last_message
        return last.content if last else ''

    def get_last_message_time(self, obj):
        last = obj.last_message
        return last.created_at.isoformat() if last else None


# ============================================================
# SERIALIZER : Détail conversation (avec tous les messages)
# ============================================================
class ConversationDetailSerializer(ConversationListSerializer):
    messages = serializers.SerializerMethodField()

    class Meta(ConversationListSerializer.Meta):
        fields = ConversationListSerializer.Meta.fields + ['messages']

    def get_messages(self, obj):
        msgs = obj.messages.all().order_by('created_at')
        return MessageSerializer(msgs, many=True, context=self.context).data


# ============================================================
# SERIALIZER : Création conversation
# ============================================================
class ConversationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Conversation
        fields = ['id', 'type', 'patient', 'medecin', 'hopital']

    def validate(self, attrs):
        conv_type = attrs.get('type')

        if conv_type == 'patient_medecin' and not (attrs.get('patient') and attrs.get('medecin')):
            raise serializers.ValidationError("patient et medecin sont requis pour ce type.")
        if conv_type == 'medecin_hopital' and not (attrs.get('medecin') and attrs.get('hopital')):
            raise serializers.ValidationError("medecin et hopital sont requis pour ce type.")
        if conv_type == 'patient_hopital' and not (attrs.get('patient') and attrs.get('hopital')):
            raise serializers.ValidationError("patient et hopital sont requis pour ce type.")

        return attrs