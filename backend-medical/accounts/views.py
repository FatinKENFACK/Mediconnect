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
from .permissions import IsAdminRole, IsHospitalRole
from .models import Hospital, Doctor
from django.contrib.auth import get_user_model
from appointments.models import Appointment
from django.utils import timezone
import datetime

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
# ===================== ADMIN — Stats globales =====================
class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        

        User = get_user_model()
        today = datetime.date.today()
        now = timezone.now()

        # ---- Compteurs principaux ----
        total_hospitals   = Hospital.objects.count()
        active_hospitals  = Hospital.objects.filter(user__is_active=True, is_verified=True).count()
        pending_hospitals = Hospital.objects.filter(user__is_active=False).count()
        total_doctors     = Doctor.objects.count()
        total_patients    = User.objects.filter(role='patient').count()

        # ---- Compteurs RDV ----
        total_appointments   = Appointment.objects.count()
        today_appointments   = Appointment.objects.filter(date=today).count()
        pending_appointments = Appointment.objects.filter(status='pending').count()

        # ---- Activités récentes (20 derniers RDV toutes actions confondues) ----
        recent_rdv = Appointment.objects.select_related(
            'patient', 'doctor__user'
        ).order_by('-created_at')[:10]

        recent_activities = []
        for rdv in recent_rdv:
            patient_name = f"{rdv.patient.first_name} {rdv.patient.last_name}"
            doctor_name  = (
                f"Dr. {rdv.doctor.user.first_name} {rdv.doctor.user.last_name}"
                if rdv.doctor else rdv.doctor_name or 'Médecin inconnu'
            )
            # Calcul du temps écoulé
            delta = now - rdv.created_at
            if delta.days > 0:
                time_str = f"Il y a {delta.days}j"
            elif delta.seconds >= 3600:
                time_str = f"Il y a {delta.seconds // 3600}h"
            else:
                time_str = f"Il y a {delta.seconds // 60} min"

            status_labels = {
                'pending':   'En attente',
                'confirmed': 'Confirmé',
                'cancelled': 'Annulé',
                'completed': 'Terminé',
            }

            recent_activities.append({
                'id':      rdv.id,
                'type':    'appointment',
                'message': f"RDV {status_labels.get(rdv.status, rdv.status)} — {patient_name} avec {doctor_name}",
                'time':    time_str,
                'status':  rdv.status,
            })

        # Ajouter les hôpitaux récemment inscrits
        recent_hospitals = Hospital.objects.select_related('user').order_by('-created_at')[:5]
        for h in recent_hospitals:
            delta = now - h.created_at
            if delta.days > 0:
                time_str = f"Il y a {delta.days}j"
            elif delta.seconds >= 3600:
                time_str = f"Il y a {delta.seconds // 3600}h"
            else:
                time_str = f"Il y a {delta.seconds // 60} min"

            recent_activities.append({
                'id':      f"h-{h.id}",
                'type':    'hospital',
                'message': f"Nouvel hôpital inscrit — {h.name} ({h.city})",
                'time':    time_str,
                'status':  'verified' if h.is_verified else 'pending',
            })

        # Trier par ordre chronologique (les plus récents d'abord)
        # On garde les 10 premières activités
        recent_activities = recent_activities[:10]

        # ---- Alertes système ----
        alerts = []

        # Hôpitaux en attente de validation
        if pending_hospitals > 0:
            alerts.append({
                'id':      'pending-hospitals',
                'level':   'warning',
                'message': f"{pending_hospitals} hôpital(ux) en attente de validation",
                'action':  'Voir les hôpitaux',
                'link':    '/admin/hopitaux',
            })

        # RDV en attente depuis plus de 24h
        if pending_appointments > 5:
            alerts.append({
                'id':      'pending-appointments',
                'level':   'warning',
                'message': f"{pending_appointments} rendez-vous en attente de confirmation",
                'action':  'Voir les RDV',
                'link':    '/admin/rendez-vous',
            })

        # Médecins non vérifiés
        unverified_doctors = Doctor.objects.filter(is_verified=False).count()
        if unverified_doctors > 0:
            alerts.append({
                'id':      'unverified-doctors',
                'level':   'info',
                'message': f"{unverified_doctors} médecin(s) non encore vérifié(s)",
                'action':  'Voir les médecins',
                'link':    '/admin/medecins',
            })

        # ---- Santé système ----
        # Logique simple : critique si beaucoup d'éléments en attente
        if pending_hospitals > 5 or pending_appointments > 20:
            system_health = 'critical'
        elif pending_hospitals > 0 or pending_appointments > 5:
            system_health = 'warning'
        else:
            system_health = 'good'

        return Response({
            # Compteurs existants
            'total_hospitals':    total_hospitals,
            'active_hospitals':   active_hospitals,
            'pending_hospitals':  pending_hospitals,
            'total_doctors':      total_doctors,
            'total_patients':     total_patients,

            # Nouveaux compteurs
            'total_appointments':   total_appointments,
            'today_appointments':   today_appointments,
            'pending_appointments': pending_appointments,

            # Activités et alertes
            'recent_activities': recent_activities,
            'system_alerts':     alerts,
            'system_health':     system_health,
        })


# ===================== ADMIN — Liste hôpitaux =====================
class AdminHospitalListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    serializer_class = HospitalProfileSerializer

    def get_queryset(self):
        return Hospital.objects.all().order_by('-created_at')


# ===================== ADMIN — Activer/Désactiver hôpital =====================
class AdminHospitalStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

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
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    serializer_class = DoctorProfileSerializer

    def get_queryset(self):
        from .models import Doctor
        return Doctor.objects.all().order_by('-created_at')


# ===================== ADMIN — Activer/Désactiver médecin =====================
class AdminDoctorStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

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


# Vue pour récupérer tous les RDV de l'hôpital connecté
class HospitalAppointmentsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response({'error': 'Profil hôpital introuvable'}, status=403)

        from appointments.models import Appointment
        from appointments.serializers import AppointmentSerializer

        # RDV de tous les médecins de cet hôpital
        appointments = Appointment.objects.filter(
            doctor__hospital=hospital
        ).select_related('patient', 'doctor__user').order_by('-date', '-time')

        from appointments.serializers import AppointmentSerializer
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)


# ===================== HÔPITAL — Ses propres médecins =====================
class HospitalDoctorsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsHospitalRole]

    def get(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response({'error': 'Profil hôpital introuvable'}, status=403)

        doctors = Doctor.objects.filter(
            hospital=hospital
        ).select_related('user')
        serializer = DoctorProfileSerializer(doctors, many=True)
        return Response(serializer.data)


## ===================== HÔPITAL — Stats du dashboard =====================

class HospitalStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsHospitalRole]

    def get(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response({'error': 'Profil hôpital introuvable'}, status=403)

        from appointments.models import Appointment
        import datetime

        doctors = Doctor.objects.filter(hospital=hospital)
        doctor_ids = doctors.values_list('id', flat=True)
        today = datetime.date.today()

        all_rdv = Appointment.objects.filter(doctor_id__in=doctor_ids)

        return Response({
            # Médecins
            'total_doctors':        doctors.count(),
            'verified_doctors':     doctors.filter(is_verified=True).count(),

            # RDV globaux
            'total_appointments':   all_rdv.count(),
            'today_appointments':   all_rdv.filter(date=today).count(),

            # RDV par statut — NOUVEAUX CHAMPS utilisés par HospitalStatistics
            'pending_appointments':   all_rdv.filter(status='pending').count(),
            'confirmed_appointments': all_rdv.filter(status='confirmed').count(),
            'completed_appointments': all_rdv.filter(status='completed').count(),
            'cancelled_appointments': all_rdv.filter(status='cancelled').count(),
        })
    

class HospitalServiceListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsHospitalRole]
 
    def get_hospital(self, request):
        try:
            return request.user.hospital
        except Exception:
            return None
 
    def get(self, request):
        hospital = self.get_hospital(request)
        if not hospital:
            return Response({'error': 'Profil hôpital introuvable'}, status=403)
        from .models import Service
        from .serializers import ServiceSerializer
        services = Service.objects.filter(hospital=hospital)
        return Response(ServiceSerializer(services, many=True).data)
 
    def post(self, request):
        hospital = self.get_hospital(request)
        if not hospital:
            return Response({'error': 'Profil hôpital introuvable'}, status=403)
        from .serializers import ServiceSerializer
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(hospital=hospital)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
 
 

class HospitalServiceDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsHospitalRole]
 
    def get_object(self, pk, request):
        from .models import Service
        try:
            service = Service.objects.get(pk=pk)
            if service.hospital != request.user.hospital:
                return None
            return service
        except Service.DoesNotExist:
            return None
 
    def get(self, request, pk):
        from .serializers import ServiceSerializer
        service = self.get_object(pk, request)
        if not service:
            return Response({'error': 'Service introuvable'}, status=404)
        return Response(ServiceSerializer(service).data)
 
    def patch(self, request, pk):
        from .serializers import ServiceSerializer
        service = self.get_object(pk, request)
        if not service:
            return Response({'error': 'Service introuvable'}, status=404)
        serializer = ServiceSerializer(service, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
 
    def delete(self, request, pk):
        service = self.get_object(pk, request)
        if not service:
            return Response({'error': 'Service introuvable'}, status=404)
        service.delete()
        return Response(status=204)


# ===================== ADMIN — Liste abonnements =====================
class AdminSubscriptionListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        from .models import Subscription
        from .serializers import SubscriptionSerializer
        subscriptions = Subscription.objects.select_related(
            'hospital'
        ).all().order_by('-created_at')
        serializer = SubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)


# ===================== ADMIN — Modifier statut abonnement =====================
class AdminSubscriptionStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def patch(self, request, pk):
        from .models import Subscription
        from .serializers import SubscriptionSerializer
        try:
            subscription = Subscription.objects.get(pk=pk)
        except Subscription.DoesNotExist:
            return Response({'error': 'Abonnement introuvable'}, status=404)

        action = request.data.get('action')
        if action == 'activate':
            subscription.status = 'active'
        elif action == 'suspend':
            subscription.status = 'suspended'
        elif action == 'cancel':
            subscription.status = 'cancelled'
        else:
            # Mise à jour directe des champs
            allowed = ['plan', 'status', 'billing_cycle', 'price',
                       'start_date', 'end_date', 'auto_renew']
            for field in allowed:
                if field in request.data:
                    setattr(subscription, field, request.data[field])

        subscription.save()
        return Response(SubscriptionSerializer(subscription).data)


class ChangePasswordView(APIView):
    """Permet à l'utilisateur connecté de changer son mot de passe."""
    permission_classes = [permissions.IsAuthenticated]
 
    def post(self, request):
        current_password = request.data.get('current_password', '')
        new_password     = request.data.get('new_password', '')
        confirm_password = request.data.get('confirm_password', '')
 
        if not current_password or not new_password or not confirm_password:
            return Response({'error': 'Tous les champs sont requis.'}, status=400)
 
        user = request.user
 
        # Vérifie l'ancien mot de passe
        if not user.check_password(current_password):
            return Response({'error': 'Le mot de passe actuel est incorrect.'}, status=400)
 
        # Vérifie la confirmation
        if new_password != confirm_password:
            return Response({'error': 'Les mots de passe ne correspondent pas.'}, status=400)
 
        # Valide la robustesse du nouveau mot de passe (règles Django)
        from django.contrib.auth.password_validation import validate_password
        from django.core.exceptions import ValidationError
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({'error': ' '.join(e.messages)}, status=400)
 
        # Met à jour le mot de passe
        user.set_password(new_password)
        user.save()
 
class ChangePasswordView(APIView):
    """Permet à l'utilisateur connecté de changer son mot de passe."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        current_password = request.data.get('current_password', '')
        new_password     = request.data.get('new_password', '')
        confirm_password = request.data.get('confirm_password', '')

        if not current_password or not new_password or not confirm_password:
            return Response({'error': 'Tous les champs sont requis.'}, status=400)

        user = request.user

        # Vérifie l'ancien mot de passe
        if not user.check_password(current_password):
            return Response({'error': 'Le mot de passe actuel est incorrect.'}, status=400)

        # Vérifie la confirmation
        if new_password != confirm_password:
            return Response({'error': 'Les mots de passe ne correspondent pas.'}, status=400)

        # Valide la robustesse du nouveau mot de passe (règles Django)
        from django.contrib.auth.password_validation import validate_password
        from django.core.exceptions import ValidationError
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({'error': ' '.join(e.messages)}, status=400)

        # Met à jour le mot de passe
        user.set_password(new_password)
        user.save()

        return Response({'success': True, 'message': 'Mot de passe mis à jour avec succès.'})


# ===================== HÔPITAL — Activer/Désactiver SES PROPRES médecins =====================
class HospitalDoctorStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsHospitalRole]

    def patch(self, request, pk):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response({'error': 'Profil hôpital introuvable'}, status=403)

        try:
            doctor = Doctor.objects.get(pk=pk)
        except Doctor.DoesNotExist:
            return Response({'error': 'Médecin non trouvé'}, status=404)

        #  Sécurité : l'hôpital ne peut gérer QUE ses propres médecins
        if doctor.hospital_id != hospital.id:
            return Response(
                {'error': "Vous ne pouvez gérer que les médecins rattachés à votre établissement."},
                status=403
            )

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






