from rest_framework import serializers
from .models import Appointment, DoctorAvailability
from .models import Appointment, DoctorAvailability, Prescription, PrescriptionItem,CompteRendu
from accounts.models import Doctor



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
            'date', 'time', 'type', 'reason', 'status', 'created_at',
            'call_type', 'call_status', 'call_room_name',
            'call_started_at', 'call_ended_at',
        ]
        read_only_fields = [
            'id', 'status', 'created_at',
            'call_status', 'call_room_name', 'call_started_at', 'call_ended_at',
        ]
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
    
from .models import Appointment, DoctorAvailability, Prescription, PrescriptionItem, CompteRendu

class CompteRenduSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    doctor_name = serializers.SerializerMethodField()
    type_label = serializers.CharField(source='get_type_display', read_only=True)

    class Meta:
        model = CompteRendu
        fields = [
            'id', 'doctor', 'patient', 'patient_name', 'doctor_name',
            'date', 'type', 'type_label', 'motif', 'observations',
            'diagnostic', 'traitement', 'recommandations',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'doctor', 'created_at', 'updated_at']

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}"





# ============================================================
# SERIALIZER : Item de prescription (lecture)
# ============================================================
class PrescriptionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = PrescriptionItem
        fields = ['id', 'nom', 'posologie', 'duree']


# ============================================================
# SERIALIZER : Prescription liée à une consultation (lecture)
# ============================================================
class PrescriptionReadSerializer(serializers.ModelSerializer):
    items = PrescriptionItemSerializer(many=True, read_only=True)

    class Meta:
        model  = Prescription
        fields = ['id', 'date', 'status', 'notes', 'items', 'created_at']


# ============================================================
# SERIALIZER : Compte-rendu lié à une consultation (lecture)
# ============================================================
class CompteRenduReadSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CompteRendu
        fields = [
            'id', 'date', 'type', 'motif',
            'observations', 'diagnostic', 'traitement',
            'recommandations', 'created_at',
        ]


# ============================================================
# SERIALIZER : Historique des consultations du médecin
# Combine Appointment + CompteRendu + Prescription
# ============================================================
class DoctorConsultationHistorySerializer(serializers.ModelSerializer):
    # Infos patient
    patient_name   = serializers.SerializerMethodField()
    patient_email  = serializers.SerializerMethodField()
    patient_phone  = serializers.SerializerMethodField()
    patient_age    = serializers.SerializerMethodField()
    patient_gender = serializers.SerializerMethodField()

    # Compte-rendu associé (OneToOne via related_name si tu l'ajoutes, sinon on cherche par patient+date)
    compte_rendu   = serializers.SerializerMethodField()

    # Prescription associée
    prescription   = serializers.SerializerMethodField()

    # Champs calculés
    location       = serializers.SerializerMethodField()
    price          = serializers.SerializerMethodField()
    duration       = serializers.SerializerMethodField()

    class Meta:
        model  = Appointment
        fields = [
            'id',
            'patient_name', 'patient_email', 'patient_phone',
            'patient_age', 'patient_gender',
            'date', 'time', 'type', 'status', 'reason',
            'duration', 'location', 'price',
            'compte_rendu', 'prescription',
            'created_at',
        ]

    # ---- Patient info ----
    def get_patient_name(self, obj):
        if obj.patient:
            return f"{obj.patient.first_name} {obj.patient.last_name}".strip()
        return "Patient inconnu"

    def get_patient_email(self, obj):
        return obj.patient.email if obj.patient else ""

    def get_patient_phone(self, obj):
        return obj.patient.phone if obj.patient else ""

    def get_patient_age(self, obj):
        if obj.patient and obj.patient.date_of_birth:
            from datetime import date
            today = date.today()
            dob   = obj.patient.date_of_birth
            return today.year - dob.year - (
                (today.month, today.day) < (dob.month, dob.day)
            )
        return None

    def get_patient_gender(self, obj):
        return obj.patient.gender if obj.patient else ""

    # ---- Compte-rendu ----
    def get_compte_rendu(self, obj):
        """
        Cherche un compte-rendu du même médecin pour ce patient à la même date.
        Si tu ajoutes un ForeignKey appointment → CompteRendu plus tard, simplifie ici.
        """
        try:
            cr = CompteRendu.objects.filter(
                doctor=obj.doctor,
                patient=obj.patient,
                date=obj.date,
            ).first()
            if cr:
                return CompteRenduReadSerializer(cr).data
        except Exception:
            pass
        return None

    # ---- Prescription ----
    def get_prescription(self, obj):
        try:
            pres = Prescription.objects.filter(
                doctor=obj.doctor,
                patient=obj.patient,
                date=obj.date,
            ).first()
            if pres:
                return PrescriptionReadSerializer(pres).data
        except Exception:
            pass
        return None

    # ---- Champs calculés ----
    def get_location(self, obj):
        if obj.type in ('video', 'teleconsultation'):
            return "Visioconférence"
        if obj.doctor and obj.doctor.hospital:
            return obj.doctor.hospital.name
        return "Cabinet médical"

    def get_price(self, obj):
        if not obj.doctor:
            return None
        if obj.type == 'video':
            return obj.doctor.fee_video
        return obj.doctor.fee_in_person

    def get_duration(self, obj):
        # Durée estimée selon le type de consultation
        durations = {
            'video':      '30 minutes',
            'in-person':  '30 minutes',
            'presentiel': '30 minutes',
        }
        return durations.get(obj.type, '30 minutes')












