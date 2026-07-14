from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Hospital, Service


User = get_user_model()

class PatientRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'email', 'phone', 'date_of_birth',
            'gender', 'address', 'city', 'region', 'postal_code',
            'password', 'confirm_password'
        ]
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Les mots de passe ne correspondent pas.'
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User.objects.create_user(
            password=password,
            role='patient',
            **validated_data
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role', 'phone',
            'date_of_birth', 'gender', 'address', 'city', 'region',
            'postal_code', 'specialization', 'license_number', 'profile_picture'
        ]
        read_only_fields = ['role', 'specialization', 'license_number']
        extra_kwargs = {
            'email': {'required': False},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }


# ============================================================
# SERIALIZER : Inscription hôpital
# Gère la création du compte utilisateur + profil hôpital
# ============================================================
class HospitalRegisterSerializer(serializers.Serializer):

    # ---- Informations du compte utilisateur ----
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    # ---- Informations de l'établissement ----
    name = serializers.CharField(max_length=255, required=True)              # Nom de l'hôpital
    registration_number = serializers.CharField(max_length=100, required=True)  # Numéro d'enregistrement
    hospital_type = serializers.ChoiceField(choices=[
        ('public', 'Public'),
        ('private', 'Privé'),
        ('clinic', 'Clinique'),
        ('ngo', 'ONG'),
    ], required=True)
    phone = serializers.CharField(max_length=20, required=True)
    address = serializers.CharField(required=True)
    city = serializers.CharField(max_length=100, required=True)
    region = serializers.CharField(max_length=100, required=True)
    website = serializers.URLField(required=False, allow_blank=True)

    def validate(self, attrs):
        # Vérifie que les deux mots de passe correspondent
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Les mots de passe ne correspondent pas.'
            })
        return attrs

    def create(self, validated_data):
        # Importe Hospital ici pour éviter les imports circulaires
        from .models import Hospital

        # Sépare les données utilisateur des données hôpital
        password = validated_data.pop('password')
        validated_data.pop('confirm_password')

        # Extrait les champs spécifiques à l'hôpital
        hospital_data = {
            'name': validated_data.pop('name'),
            'registration_number': validated_data.pop('registration_number'),
            'hospital_type': validated_data.pop('hospital_type'),
            'phone': validated_data.pop('phone'),
            'address': validated_data.pop('address'),
            'city': validated_data.pop('city'),
            'region': validated_data.pop('region'),
            'website': validated_data.pop('website', ''),
            'email': validated_data.get('email'),
        }

        # Crée le compte utilisateur avec le rôle 'hospital'
        user = User.objects.create_user(
            email=validated_data['email'],
            password=password,
            role='hospital',
            first_name=hospital_data['name'],   # Nom de l'hôpital comme prénom
            last_name='',
            is_active=False,
        )

        # Crée le profil hôpital lié au compte
        Hospital.objects.create(user=user, **hospital_data)

        return user


# ============================================================
# SERIALIZER : Profil hôpital
# Pour afficher les informations de l'hôpital
# ============================================================
class HospitalProfileSerializer(serializers.ModelSerializer):
    # Nombre de médecins rattachés à cet hôpital
    total_doctors = serializers.SerializerMethodField()
    # Statut actif/inactif du compte utilisateur lié (pour les badges Actif/Suspendu)
    user_is_active = serializers.SerializerMethodField()
    # Plan d'abonnement actuel (pour le badge Basic/Professional/Enterprise)
    subscription_plan = serializers.SerializerMethodField()

    class Meta:
        model = Hospital
        fields = [
            'id', 'name', 'registration_number', 'registration_code', 'hospital_type',
            'address', 'city', 'region', 'phone', 'email',
            'website', 'is_verified', 'created_at',
            'total_doctors', 'user_is_active', 'subscription_plan',
        ]
        read_only_fields = [
            'id', 'is_verified', 'created_at', 'registration_number',
            'total_doctors', 'user_is_active', 'subscription_plan',
        ]

    def get_total_doctors(self, obj):
        return obj.doctors.count()

    def get_user_is_active(self, obj):
        return obj.user.is_active

    def get_subscription_plan(self, obj):
        try:
            return obj.subscription.plan
        except Exception:
            return None  
class DoctorProfileSerializer(serializers.ModelSerializer):
    from .models import Doctor

    # Champs du user intégrés
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    profile_picture = serializers.ImageField(source='user.profile_picture', read_only=True)

    class Meta:
        from .models import Doctor
        model = Doctor
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone',
            'specialization', 'license_number', 'experience_years',
            'bio', 'languages', 'fee_in_person', 'fee_video', 'fee_followup',
            'is_verified', 'is_available', 'profile_picture', 'created_at'
        ]
        read_only_fields = ['id', 'is_verified', 'created_at']

# Inscription du medeci
class DoctorRegisterSerializer(serializers.Serializer):
    # Informations personnelles
    first_name = serializers.CharField(max_length=150, required=True)
    last_name = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    phone = serializers.CharField(max_length=20, required=True)
    gender = serializers.CharField(max_length=20, required=False, allow_blank=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)

    # Informations professionnelles
    specialization = serializers.CharField(max_length=150, required=True)
    license_number = serializers.CharField(max_length=100, required=True)
    experience_years = serializers.IntegerField(required=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    languages = serializers.CharField(max_length=255, required=False, allow_blank=True)
    fee_in_person = serializers.IntegerField(required=True)
    fee_video = serializers.IntegerField(required=True)

    # Code hôpital
    hospital_code = serializers.CharField(max_length=20, required=True)

    def validate(self, attrs):
        # Vérifie les mots de passe
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Les mots de passe ne correspondent pas.'
            })

        # Vérifie que le code hôpital est valide
        from .models import Hospital
        try:
            hospital = Hospital.objects.get(registration_code=attrs['hospital_code'].upper())
            attrs['hospital_obj'] = hospital
        except Hospital.DoesNotExist:
            raise serializers.ValidationError({
                'hospital_code': 'Code hôpital invalide. Vérifiez le code fourni par votre établissement.'
            })

        return attrs

    def create(self, validated_data):
        from .models import Doctor

        password = validated_data.pop('password')
        validated_data.pop('confirm_password')
        hospital_code = validated_data.pop('hospital_code')
        hospital = validated_data.pop('hospital_obj')

        # Crée le compte utilisateur
        user = User.objects.create_user(
            email=validated_data['email'],
            password=password,
            role='doctor',
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone=validated_data.get('phone', ''),
            gender=validated_data.get('gender', ''),
            date_of_birth=validated_data.get('date_of_birth', None),
        )

        # Crée le profil médecin lié à l'hôpital
        Doctor.objects.create(
            user=user,
            hospital=hospital,
            specialization=validated_data['specialization'],
            license_number=validated_data['license_number'],
            experience_years=validated_data['experience_years'],
            bio=validated_data.get('bio', ''),
            languages=validated_data.get('languages', ''),
            fee_in_person=validated_data['fee_in_person'],
            fee_video=validated_data['fee_video'],
            is_available=True,
        )

        return user

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id', 'name', 'description', 'category',
            'consultation_fee', 'duration', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']