from rest_framework import serializers
from .models import AccessLog, DataRequest, PrivacySettings


class AccessLogSerializer(serializers.ModelSerializer):
    class Meta:
        model  = AccessLog
        fields = [
            'id', 'user_name', 'user_type', 'action', 'resource',
            'patient_id', 'purpose', 'ip_address', 'location',
            'success', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class DataRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model  = DataRequest
        fields = [
            'id', 'requester_name', 'requester_email',
            'request_type', 'status', 'data_requested',
            'purpose', 'expiry_date', 'response_date',
            'admin_notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PrivacySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model  = PrivacySettings
        fields = [
            'id', 'data_encryption', 'anonymization', 'access_logs',
            'two_factor_auth', 'session_timeout', 'data_retention',
            'gdpr_compliant', 'hipaa_compliant', 'audit_frequency',
            'updated_at',
        ]
        read_only_fields = ['id', 'updated_at']