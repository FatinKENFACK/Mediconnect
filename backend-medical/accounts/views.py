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
    UserProfileSerializer,
    DoctorProfileSerializer,
    HospitalServiceSerializer,
)
from .models import Hospital, Doctor, HospitalService
from .permissions import IsAdminRole, IsHospitalRole
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


# ===================== INSCRIPTION HÔPITAL =====================
class HospitalRegisterView(generics.CreateAPIView):
    serializer_class = HospitalRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            "success": True,
            "message": "Votre demande d'inscription a été envoyée. Un administrateur validera votre compte sous 24-48h.",
            "pending": True,
        }, status=status.HTTP_201_CREATED)


# ===================== INSCRIPTION MÉDECIN =====================
class DoctorRegisterView(generics.CreateAPIView):
    serializer_class = DoctorRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
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


# ===================== PROFILS =====================
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
    serializer_class = DoctorProfileSerializer

    def get_object(self):
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
    serializer_class = DoctorProfileSerializer

    def get_queryset(self):
        return Doctor.objects.filter(is_available=True, is_verified=True)


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        current_password = request.data.get('current_password', '')
        new_password = request.data.get('new_password', '')
        confirm_password = request.data.get('confirm_password', '')

        if not current_password or not new_password or not confirm_password:
            return Response({'error': 'Tous les champs sont requis.'}, status=400)

        user = request.user

        if not user.check_password(current_password):
            return Response({'error': 'Le mot de passe actuel est incorrect.'}, status=400)

        if new_password != confirm_password:
            return Response({'error': 'Les mots de passe ne correspondent pas.'}, status=400)

        from django.contrib.auth.password_validation import validate_password
        from django.core.exceptions import ValidationError
        try:
            validate_password(new_password, user)
        except ValidationError as e:
            return Response({'error': ' '.join(e.messages)}, status=400)

        user.set_password(new_password)
        user.save()

        return Response({'success': True, 'message': 'Mot de passe mis à jour avec succès.'})


# ===================== ADMIN =====================
class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        today = datetime.date.today()
        now = timezone.now()

        total_hospitals = Hospital.objects.count()
        active_hospitals = Hospital.objects.filter(user__is_active=True, is_verified=True).count()
        pending_hospitals = Hospital.objects.filter(user__is_active=False).count()
        total_doctors = Doctor.objects.count()
        total_patients = User.objects.filter(role='patient').count()

        total_appointments = Appointment.objects.count()
        today_appointments = Appointment.objects.filter(date=today).count()
        pending_appointments = Appointment.objects.filter(status='pending').count()

        recent_rdv = Appointment.objects.select_related(
            'patient', 'doctor__user'
        ).order_by('-created_at')[:10]

        recent_activities = []
        for rdv in recent_rdv:
            patient_name = f"{rdv.patient.first_name} {rdv.patient.last_name}"
            doctor_name = (
                f"Dr. {rdv.doctor.user.first_name} {rdv.doctor.user.last_name}"
                if rdv.doctor else rdv.doctor_name or 'Médecin inconnu'
            )
            delta = now - rdv.created_at
            if delta.days > 0:
                time_str = f"Il y a {delta.days}j"
            elif delta.seconds >= 3600:
                time_str = f"Il y a {delta.seconds // 3600}h"
            else:
                time_str = f"Il y a {delta.seconds // 60} min"

            status_labels = {
                'pending': 'En attente',
                'confirmed': 'Confirmé',
                'cancelled': 'Annulé',
                'completed': 'Terminé',
            }

            recent_activities.append({
                'id': rdv.id,
                'type': 'appointment',
                'message': f"RDV {status_labels.get(rdv.status, rdv.status)} — {patient_name} avec {doctor_name}",
                'time': time_str,
                'status': rdv.status,
            })

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
                'id': f"h-{h.id}",
                'type': 'hospital',
                'message': f"Nouvel hôpital inscrit — {h.name} ({h.city})",
                'time': time_str,
                'status': 'verified' if h.is_verified else 'pending',
            })

        recent_activities = recent_activities[:10]

        alerts = []
        if pending_hospitals > 0:
            alerts.append({
                'id': 'pending-hospitals',
                'level': 'warning',
                'message': f"{pending_hospitals} hôpital(ux) en attente de validation",
                'action': 'Voir les hôpitaux',
                'link': '/admin/hopitaux',
            })

        if pending_appointments > 5:
            alerts.append({
                'id': 'pending-appointments',
                'level': 'warning',
                'message': f"{pending_appointments} rendez-vous en attente de confirmation",
                'action': 'Voir les RDV',
                'link': '/admin/rendez-vous',
            })

        unverified_doctors = Doctor.objects.filter(is_verified=False).count()
        if unverified_doctors > 0:
            alerts.append({
                'id': 'unverified-doctors',
                'level': 'info',
                'message': f"{unverified_doctors} médecin(s) non encore vérifié(s)",
                'action': 'Voir les médecins',
                'link': '/admin/medecins',
            })

        if pending_hospitals > 5 or pending_appointments > 20:
            system_health = 'critical'
        elif pending_hospitals > 0 or pending_appointments > 5:
            system_health = 'warning'
        else:
            system_health = 'good'

        return Response({
            'total_hospitals': total_hospitals,
            'active_hospitals': active_hospitals,
            'pending_hospitals': pending_hospitals,
            'total_doctors': total_doctors,
            'total_patients': total_patients,
            'total_appointments': total_appointments,
            'today_appointments': today_appointments,
            'pending_appointments': pending_appointments,
            'recent_activities': recent_activities,
            'system_alerts': alerts,
            'system_health': system_health,
        })


class AdminHospitalListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    serializer_class = HospitalProfileSerializer

    def get_queryset(self):
        return Hospital.objects.all().order_by('-created_at')


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


class AdminDoctorListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
    serializer_class = DoctorProfileSerializer

    def get_queryset(self):
        return Doctor.objects.all().order_by('-created_at')


class AdminDoctorStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def patch(self, request, pk):
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


# ===================== PUBLIC =====================
class PublicHospitalListView(generics.ListAPIView):
    serializer_class = HospitalProfileSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Hospital.objects.filter(is_verified=True, user__is_active=True)
        
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(city__icontains=city)

        hospital_type = self.request.query_params.get('type', None)
        if hospital_type:
            queryset = queryset.filter(hospital_type=hospital_type)

        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset


class PublicHospitalDetailView(generics.RetrieveAPIView):
    serializer_class = HospitalProfileSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Hospital.objects.filter(is_verified=True, user__is_active=True)


# ===================== HÔPITAL =====================
class HospitalAppointmentsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsHospitalRole]

    def get(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response({'error': 'Profil hôpital introuvable'}, status=403)

        from appointments.serializers import AppointmentSerializer
        appointments = Appointment.objects.filter(
            doctor__hospital=hospital
        ).select_related('patient', 'doctor__user').order_by('-date', '-time')

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)


class HospitalDoctorsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsHospitalRole]

    def get(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response({'error': 'Profil hôpital introuvable'}, status=403)

        doctors = Doctor.objects.filter(hospital=hospital).select_related('user')
        serializer = DoctorProfileSerializer(doctors, many=True)
        return Response(serializer.data)


class HospitalStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsHospitalRole]

    def get(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response({'error': 'Profil hôpital introuvable'}, status=403)

        doctors = Doctor.objects.filter(hospital=hospital)
        doctor_ids = doctors.values_list('id', flat=True)
        today = datetime.date.today()

        all_rdv = Appointment.objects.filter(doctor_id__in=doctor_ids)

        return Response({
            'totalDoctors': doctors.count(),  # camelCase pour le frontend
            'verified_doctors': doctors.filter(is_verified=True).count(),
            'totalAppointments': all_rdv.count(),
            'todayAppointments': all_rdv.filter(date=today).count(),
            'pendingAppointments': all_rdv.filter(status='pending').count(),
            'confirmedAppointments': all_rdv.filter(status='confirmed').count(),
            'completedAppointments': all_rdv.filter(status='completed').count(),
            'cancelledAppointments': all_rdv.filter(status='cancelled').count(),
        })


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


# ===================== SERVICES HOSPITALIERS =====================
class HospitalServicesView(APIView):
    """Liste et création des services hospitaliers"""
    permission_classes = [permissions.IsAuthenticated, IsHospitalRole]

    def get(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response(
                {'error': 'Profil hôpital introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )

        services = HospitalService.objects.filter(hospital=hospital).order_by('-created_at')
        serializer = HospitalServiceSerializer(services, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response(
                {'error': 'Profil hôpital introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = HospitalServiceSerializer(data=request.data)
        if serializer.is_valid():
            service = serializer.save(hospital=hospital)
            return Response(
                HospitalServiceSerializer(service).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HospitalServiceDetailView(APIView):
    """Détail, modification et suppression d'un service hospitalier"""
    permission_classes = [permissions.IsAuthenticated, IsHospitalRole]

    def get_object(self, pk, hospital):
        try:
            return HospitalService.objects.get(id=pk, hospital=hospital)
        except HospitalService.DoesNotExist:
            return None

    def get(self, request, pk):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response(
                {'error': 'Profil hôpital introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )

        service = self.get_object(pk, hospital)
        if not service:
            return Response(
                {'error': 'Service non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = HospitalServiceSerializer(service)
        return Response(serializer.data)

    def patch(self, request, pk):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response(
                {'error': 'Profil hôpital introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )

        service = self.get_object(pk, hospital)
        if not service:
            return Response(
                {'error': 'Service non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = HospitalServiceSerializer(service, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response(
                {'error': 'Profil hôpital introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )

        service = self.get_object(pk, hospital)
        if not service:
            return Response(
                {'error': 'Service non trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )

        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ===================== ADMIN — ABONNEMENTS =====================
# accounts/views.py

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsAdminRole
from .models import Subscription
from .serializers import SubscriptionSerializer
import logging

logger = logging.getLogger(__name__)

# ===================== ADMIN — Liste abonnements =====================
class AdminSubscriptionListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        try:
            # Vérifier que l'utilisateur est admin
            if request.user.role != 'admin':
                return Response(
                    {'error': 'Accès réservé aux administrateurs'},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Récupérer tous les abonnements avec les relations
            subscriptions = Subscription.objects.select_related(
                'hospital', 
                'hospital__user'
            ).all().order_by('-created_at')

            # Sérialiser les données
            serializer = SubscriptionSerializer(subscriptions, many=True, context={'request': request})
            
            return Response({
                'success': True,
                'count': subscriptions.count(),
                'subscriptions': serializer.data
            })
            
        except Exception as e:
            logger.error(f"Erreur dans AdminSubscriptionListView: {str(e)}")
            return Response(
                {'error': 'Erreur lors du chargement des abonnements'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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
            allowed = ['plan', 'status', 'billing_cycle', 'price', 'start_date', 'end_date', 'auto_renew']
            for field in allowed:
                if field in request.data:
                    setattr(subscription, field, request.data[field])

        subscription.save()
        return Response(SubscriptionSerializer(subscription).data)


# accounts/views.py

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .permissions import IsHospitalRole
from .models import Hospital, Subscription
from .serializers import SubscriptionSerializer
from django.utils import timezone
import datetime

# ===================== ABONNEMENTS HÔPITAL =====================

class HospitalSubscriptionStatusView(APIView):
    """Vérifie le statut de l'abonnement de l'hôpital connecté"""
    permission_classes = [IsAuthenticated, IsHospitalRole]

    def get(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response(
                {'error': 'Profil hôpital introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            subscription = Subscription.objects.get(hospital=hospital)
            return Response({
                'hasSubscription': True,
                'planName': subscription.plan,
                'planId': subscription.plan,
                'status': subscription.status,
                'endDate': subscription.end_date,
                'isActive': subscription.status == 'active'
            })
        except Subscription.DoesNotExist:
            return Response({
                'hasSubscription': False,
                'planName': None,
                'planId': None,
                'status': None,
                'endDate': None,
                'isActive': False
            })


class HospitalSubscriptionView(APIView):
    """Récupère les détails complets de l'abonnement"""
    permission_classes = [IsAuthenticated, IsHospitalRole]

    def get(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response(
                {'error': 'Profil hôpital introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            subscription = Subscription.objects.get(hospital=hospital)
            
            # Récupérer les statistiques d'utilisation
            from accounts.models import Doctor
            from appointments.models import Appointment
            
            doctors_count = Doctor.objects.filter(hospital=hospital).count()
            today = timezone.now().date()
            consultations_count = Appointment.objects.filter(
                doctor__hospital=hospital,
                date__month=today.month,
                date__year=today.year
            ).count()
            
            # Définir les limites selon le plan
            plan_limits = {
                'basic': {'doctors': 5, 'consultations': 100},
                'professional': {'doctors': 20, 'consultations': 500},
                'enterprise': {'doctors': 999, 'consultations': 9999}
            }
            limits = plan_limits.get(subscription.plan, {'doctors': 999, 'consultations': 9999})
            
            # Définir les fonctionnalités selon le plan
            plan_features = {
                'basic': [
                    'Jusqu\'à 5 médecins',
                    '100 consultations/mois',
                    'Messagerie de base',
                    'Tableau de bord simple',
                    'Support email'
                ],
                'professional': [
                    'Jusqu\'à 20 médecins',
                    '500 consultations/mois',
                    'Messagerie avancée',
                    'Consultations vidéo illimitées',
                    'Statistiques détaillées',
                    'Gestion des rendez-vous',
                    'Support prioritaire'
                ],
                'enterprise': [
                    'Médecins illimités',
                    'Consultations illimitées',
                    'Toutes les fonctionnalités',
                    'API personnalisée',
                    'Intégrations avancées',
                    'Support dédié 24/7',
                    'Formation personnalisée',
                    'Marketing et promotion'
                ]
            }
            features = plan_features.get(subscription.plan, [])
            
            return Response({
                'planId': subscription.plan,
                'planName': subscription.get_plan_display(),
                'price': subscription.price,
                'duration': 'mois',
                'status': subscription.status,
                'endDate': subscription.end_date,
                'doctorsUsed': doctors_count,
                'doctorsLimit': limits['doctors'],
                'consultationsUsed': consultations_count,
                'consultationsLimit': limits['consultations'],
                'features': features,
                'startDate': subscription.start_date,
                'autoRenew': subscription.auto_renew,
                'billingCycle': subscription.billing_cycle
            })
        except Subscription.DoesNotExist:
            return Response(
                {'error': 'Aucun abonnement trouvé'},
                status=status.HTTP_404_NOT_FOUND
            )


class HospitalSubscriptionUpdateView(APIView):
    """Met à jour ou crée un abonnement"""
    permission_classes = [IsAuthenticated, IsHospitalRole]

    def post(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response(
                {'error': 'Profil hôpital introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )

        plan_id = request.data.get('planId')
        billing_cycle = request.data.get('billingCycle', 'monthly')

        if not plan_id:
            return Response(
                {'error': 'Le plan est requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prix des plans
        plan_prices = {
            'basic': 50000,
            'professional': 150000,
            'enterprise': 500000
        }
        
        # Durée en mois selon le cycle
        duration_months = 12 if billing_cycle == 'yearly' else 1
        price = plan_prices.get(plan_id, 0) * duration_months

        try:
            subscription = Subscription.objects.get(hospital=hospital)
            # Mettre à jour l'abonnement existant
            subscription.plan = plan_id
            subscription.price = price
            subscription.billing_cycle = billing_cycle
            subscription.status = 'active'
            subscription.start_date = timezone.now().date()
            subscription.end_date = timezone.now().date() + datetime.timedelta(days=30 * duration_months)
            subscription.auto_renew = True
            subscription.save()
            
            return Response({
                'success': True,
                'message': f'Abonnement mis à jour vers {plan_id}',
                'subscription': SubscriptionSerializer(subscription).data
            })
        except Subscription.DoesNotExist:
            # Créer un nouvel abonnement
            subscription = Subscription.objects.create(
                hospital=hospital,
                plan=plan_id,
                price=price,
                billing_cycle=billing_cycle,
                status='active',
                start_date=timezone.now().date(),
                end_date=timezone.now().date() + datetime.timedelta(days=30 * duration_months),
                auto_renew=True
            )
            
            return Response({
                'success': True,
                'message': f'Abonnement {plan_id} créé avec succès',
                'subscription': SubscriptionSerializer(subscription).data
            }, status=status.HTTP_201_CREATED)


class HospitalSubscriptionCancelView(APIView):
    """Annule l'abonnement de l'hôpital"""
    permission_classes = [IsAuthenticated, IsHospitalRole]

    def post(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response(
                {'error': 'Profil hôpital introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            subscription = Subscription.objects.get(hospital=hospital)
            subscription.status = 'cancelled'
            subscription.auto_renew = False
            subscription.save()
            
            return Response({
                'success': True,
                'message': 'Abonnement annulé avec succès. Il restera actif jusqu\'à la fin de la période en cours.'
            })
        except Subscription.DoesNotExist:
            return Response(
                {'error': 'Aucun abonnement actif à annuler'},
                status=status.HTTP_404_NOT_FOUND
            )


class HospitalPaymentHistoryView(APIView):
    """Récupère l'historique des paiements de l'hôpital"""
    permission_classes = [IsAuthenticated, IsHospitalRole]

    def get(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response(
                {'error': 'Profil hôpital introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Pour l'instant, retourner des données mockées
        # À remplacer par un vrai modèle Payment quand il sera créé
        mock_payments = [
            {
                'id': 1,
                'date': (timezone.now() - datetime.timedelta(days=30)).date(),
                'amount': 150000,
                'plan': 'Professional',
                'status': 'completed',
                'method': 'Carte de crédit',
                'transactionId': f'TXN-{timezone.now().year}-001'
            },
            {
                'id': 2,
                'date': (timezone.now() - datetime.timedelta(days=60)).date(),
                'amount': 150000,
                'plan': 'Professional',
                'status': 'completed',
                'method': 'Carte de crédit',
                'transactionId': f'TXN-{timezone.now().year}-002'
            }
        ]
        
        return Response(mock_payments)


class HospitalPaymentCreateView(APIView):
    """Crée un paiement pour l'abonnement"""
    permission_classes = [IsAuthenticated, IsHospitalRole]

    def post(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response(
                {'error': 'Profil hôpital introuvable'},
                status=status.HTTP_404_NOT_FOUND
            )

        plan_id = request.data.get('planId')
        amount = request.data.get('amount')
        payment_method = request.data.get('paymentMethod', 'card')

        if not plan_id or not amount:
            return Response(
                {'error': 'Plan et montant requis'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Simuler la création d'un paiement
        # À remplacer par une vraie intégration de paiement
        return Response({
            'success': True,
            'transactionId': f'TXN-{timezone.now().year}-{timezone.now().strftime("%m%d")}-{timezone.now().timestamp()}',
            'amount': amount,
            'planId': plan_id,
            'status': 'pending',
            'message': 'Paiement en attente de confirmation'
        })