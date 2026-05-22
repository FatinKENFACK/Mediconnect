from rest_framework import serializers
from .models import Appointment, DoctorAvailability
from .models import Appointment, DoctorAvailability, Prescription, PrescriptionItem



class AppointmentSerializer(serializers.ModelSerializer):
    # Infos patient lisibles
    patient_name = serializers.SerializerMethodField()
    # Infos médecin lisibles
    doctor_full_name = serializers.SerializerMethodField()
    doctor_specialization = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
        'id', 'doctor', 'patient_name', 'doctor_full_name',
        'doctor_specialization', 'doctor_name', 'doctor_specialty',
        'date', 'time', 'type', 'reason', 'status', 'created_at'
    ]
        read_only_fields = ['id', 'status', 'created_at']

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_doctor_full_name(self, obj):
        if obj.doctor:
            return f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}"
        return obj.doctor_name

    def get_doctor_specialization(self, obj):
        if obj.doctor:
            return obj.doctor.specialization
        return obj.doctor_specialty
    
class DoctorAvailabilitySerializer(serializers.ModelSerializer):
    day_label = serializers.CharField(source='get_day_of_week_display', read_only=True)
    type_label = serializers.CharField(source='get_consultation_type_display', read_only=True)

    class Meta:
        model = DoctorAvailability
        fields = [
            'id', 'day_of_week', 'day_label',
            'start_time', 'end_time',
            'consultation_type', 'type_label',
            'is_active', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'day_label', 'type_label']





class PrescriptionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionItem
        fields = ['id', 'nom', 'posologie', 'duree']


class PrescriptionSerializer(serializers.ModelSerializer):
    items = PrescriptionItemSerializer(many=True)
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Prescription
        fields = [
            'id', 'doctor', 'patient', 'patient_name', 'doctor_name',
            'date', 'status', 'notes', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'doctor', 'created_at', 'updated_at']

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}"

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        prescription = Prescription.objects.create(**validated_data)
        for item in items_data:
            PrescriptionItem.objects.create(prescription=prescription, **item)
        return prescription

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        # Mise à jour des champs simples
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        # Remplacement complet des items
        if items_data is not None:
            instance.items.all().delete()
            for item in items_data:
                PrescriptionItem.objects.create(prescription=instance, **item)
        return instance












