from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    # Infos patient
    patient_name  = serializers.SerializerMethodField()

    # Infos médecin
    doctor_name         = serializers.SerializerMethodField()
    doctor_specialization = serializers.SerializerMethodField()
    doctor_hospital     = serializers.SerializerMethodField()

    class Meta:
        model  = Review
        fields = [
            'id',
            'patient', 'patient_name',
            'doctor',  'doctor_name', 'doctor_specialization', 'doctor_hospital',
            'appointment',
            'rating', 'comment',
            'status', 'rejection_reason',
            'moderated_at', 'moderated_by',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'patient', 'status', 'rejection_reason',
            'moderated_at', 'moderated_by',
            'created_at', 'updated_at',
        ]

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}"

    def get_doctor_specialization(self, obj):
        return obj.doctor.specialization

    def get_doctor_hospital(self, obj):
        if obj.doctor.hospital:
            return obj.doctor.hospital.name
        return None

    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("La note doit être entre 1 et 5.")
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        if not request:
            return attrs

        doctor      = attrs.get('doctor')
        appointment = attrs.get('appointment')

        # Vérifier que le patient n'a pas déjà donné un avis à ce médecin
        if Review.objects.filter(patient=request.user, doctor=doctor).exists():
            raise serializers.ValidationError(
                "Vous avez déjà donné un avis pour ce médecin."
            )

        # Vérifier que le rendez-vous est terminé et appartient au patient
        if appointment:
            if appointment.patient != request.user:
                raise serializers.ValidationError(
                    "Ce rendez-vous ne vous appartient pas."
                )
            if appointment.status != 'completed':
                raise serializers.ValidationError(
                    "Vous ne pouvez donner un avis que pour une consultation terminée."
                )
            if appointment.doctor != doctor:
                raise serializers.ValidationError(
                    "Ce rendez-vous ne correspond pas au médecin sélectionné."
                )

        return attrs


# Serializer allégé pour l'affichage public (sans infos sensibles)
class PublicReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model  = Review
        fields = ['id', 'patient_name', 'rating', 'comment', 'created_at']

    def get_patient_name(self, obj):
        # On affiche seulement le prénom + initiale du nom pour la vie privée
        first = obj.patient.first_name or ''
        last  = obj.patient.last_name or ''
        return f"{first} {last[0]}." if last else first


# Serializer pour la modération admin
class AdminReviewSerializer(serializers.ModelSerializer):
    patient_name          = serializers.SerializerMethodField()
    doctor_name           = serializers.SerializerMethodField()
    doctor_specialization = serializers.SerializerMethodField()
    doctor_hospital       = serializers.SerializerMethodField()

    class Meta:
        model  = Review
        fields = [
            'id',
            'patient', 'patient_name',
            'doctor',  'doctor_name', 'doctor_specialization', 'doctor_hospital',
            'appointment',
            'rating', 'comment',
            'status', 'rejection_reason',
            'moderated_at', 'moderated_by',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'patient', 'created_at', 'updated_at']

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_doctor_name(self, obj):
        return f"Dr. {obj.doctor.user.first_name} {obj.doctor.user.last_name}"

    def get_doctor_specialization(self, obj):
        return obj.doctor.specialization

    def get_doctor_hospital(self, obj):
        if obj.doctor.hospital:
            return obj.doctor.hospital.name
        return None