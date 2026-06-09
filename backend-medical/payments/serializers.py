from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    hospital_name  = serializers.CharField(source='hospital.name',  read_only=True)
    hospital_email = serializers.CharField(source='hospital.email', read_only=True)
    hospital_id    = serializers.IntegerField(source='hospital.id', read_only=True)
    date           = serializers.SerializerMethodField()
    time           = serializers.SerializerMethodField()

    class Meta:
        model  = Payment
        fields = [
            'id', 'hospital_id', 'hospital_name', 'hospital_email',
            'amount', 'processing_fee', 'net_amount', 'currency',
            'status', 'method', 'payment_type', 'description',
            'transaction_id', 'invoice_id',
            'failure_reason', 'refunded', 'refund_date', 'refund_reason',
            'date', 'time', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'net_amount', 'created_at', 'updated_at']

    def get_date(self, obj):
        return obj.created_at.strftime('%Y-%m-%d')

    def get_time(self, obj):
        return obj.created_at.strftime('%H:%M:%S')