from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from .serializers import (
    DoctorRegisterSerializer,
    HospitalRegisterSerializer,
    PatientRegisterSerializer,
    HospitalProfileSerializer,
    UserLoginSerializer,
    UserProfileSerializer
)
from .models import Hospital
from .serializers import DoctorProfileSerializer
from rest_framework.permissions import IsAdminUser


User = get_user_model()

# ===================== INSCRIPTION PATIENT =====================
class PatientRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = PatientRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Génération des tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            "success": True,
            "message": "Compte patient créé avec succès",
            "user": UserProfileSerializer(user).data,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }
        }, status=status.HTTP_201_CREATED)


# =================vue de l'hoptital===================
class HospitalRegisterView(generics.CreateAPIView):
    serializer_class = HospitalRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Génère les tokens JWT pour connecter l'hôpital directement
        refresh = RefreshToken.for_user(user)

        # Récupère le profil hôpital créé
        hospital = Hospital.objects.get(user=user)

        return Response({
            "success": True,
            "message": "Votre demande d'inscription a été envoyée. Un administrateur validera votre compte sous 24-48h.",
            "pending": True,
        }, status=status.HTTP_201_CREATED)
    
# ===================== CONNEXION =====================
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data['email'])
        except User.DoesNotExist:
            return Response({
                "success": False,
                "error": "Email ou mot de passe incorrect"
            }, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(serializer.validated_data['password']):
            return Response({
                "success": False,
                "error": "Email ou mot de passe incorrect"
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return Response({
                "success": False,
                "error": "Votre compte est en attente de validation par un administrateur. Vous recevrez une confirmation sous 24-48h."
            }, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)

        return Response({
            "success": True,
            "user": UserProfileSerializer(user).data,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }
        })

# ===================== PROFIL UTILISATEUR =====================
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # Mettre à jour le localStorage côté client via la réponse
        return Response({
            "success": True,
            "user": serializer.data
        })
    

class HospitalProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = HospitalProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return Hospital.objects.get(user=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True, "hospital": serializer.data})
    

class DoctorProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        return DoctorProfileSerializer

    def get_object(self):
        from .models import Doctor
        return Doctor.objects.get(user=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True, "doctor": serializer.data})
    


class DoctorListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from .models import Doctor
        from .serializers import DoctorProfileSerializer
        doctors = Doctor.objects.filter(is_available=True, is_verified=True)
        serializer = DoctorProfileSerializer(doctors, many=True)
        return Response(serializer.data)
    
class DoctorRegisterView(generics.CreateAPIView):
    serializer_class = DoctorRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        from .serializers import DoctorRegisterSerializer
        serializer = DoctorRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "success": True,
            "message": "Compte médecin créé avec succès",
            "user": UserProfileSerializer(user).data,
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token)
            }
        }, status=status.HTTP_201_CREATED)



# ===================== ADMIN — Stats globales =====================
class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get(self, request):
        from .models import Hospital, Doctor
        from django.contrib.auth import get_user_model
        User = get_user_model()

        total_hospitals = Hospital.objects.count()
        active_hospitals = Hospital.objects.filter(user__is_active=True, is_verified=True).count()
        pending_hospitals = Hospital.objects.filter(user__is_active=False).count()
        total_doctors = Doctor.objects.count()
        total_patients = User.objects.filter(role='patient').count()

        return Response({
            'total_hospitals': total_hospitals,
            'active_hospitals': active_hospitals,
            'pending_hospitals': pending_hospitals,
            'total_doctors': total_doctors,
            'total_patients': total_patients,
        })


# ===================== ADMIN — Liste hôpitaux =====================
class AdminHospitalListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    serializer_class = HospitalProfileSerializer

    def get_queryset(self):
        return Hospital.objects.all().order_by('-created_at')


# ===================== ADMIN — Activer/Désactiver hôpital =====================
class AdminHospitalStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def patch(self, request, pk):
        try:
            hospital = Hospital.objects.get(pk=pk)
            action = request.data.get('action')

            if action == 'activate':
                hospital.user.is_active = True
                hospital.is_verified = True
                hospital.user.save()
                hospital.save()
                return Response({'success': True, 'message': 'Hôpital activé avec succès'})
            elif action == 'deactivate':
                hospital.user.is_active = False
                hospital.user.save()
                return Response({'success': True, 'message': 'Hôpital désactivé avec succès'})
            else:
                return Response({'error': 'Action invalide'}, status=400)
        except Hospital.DoesNotExist:
            return Response({'error': 'Hôpital non trouvé'}, status=404)


# ===================== ADMIN — Liste médecins =====================
class AdminDoctorListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    serializer_class = DoctorProfileSerializer

    def get_queryset(self):
        from .models import Doctor
        return Doctor.objects.all().order_by('-created_at')


# ===================== ADMIN — Activer/Désactiver médecin =====================
class AdminDoctorStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def patch(self, request, pk):
        from .models import Doctor
        try:
            doctor = Doctor.objects.get(pk=pk)
            action = request.data.get('action')

            if action == 'activate':
                doctor.user.is_active = True
                doctor.is_verified = True
                doctor.user.save()
                doctor.save()
                return Response({'success': True, 'message': 'Médecin activé avec succès'})
            elif action == 'deactivate':
                doctor.user.is_active = False
                doctor.user.save()
                return Response({'success': True, 'message': 'Médecin désactivé avec succès'})
            else:
                return Response({'error': 'Action invalide'}, status=400)
        except Doctor.DoesNotExist:
            return Response({'error': 'Médecin non trouvé'}, status=404)


# Liste publique des hôpitaux vérifiés
class PublicHospitalListView(generics.ListAPIView):
    serializer_class = HospitalProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Hospital.objects.filter(
            is_verified=True,
            user__is_active=True
        )
        # Filtre par ville
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(city__icontains=city)

        # Filtre par type
        hospital_type = self.request.query_params.get('type', None)
        if hospital_type:
            queryset = queryset.filter(hospital_type=hospital_type)

        # Recherche par nom
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset


# Détail d'un hôpital public
class PublicHospitalDetailView(generics.RetrieveAPIView):
    serializer_class = HospitalProfileSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Hospital.objects.filter(is_verified=True, user__is_active=True)