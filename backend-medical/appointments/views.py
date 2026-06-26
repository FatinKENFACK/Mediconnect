from rest_framework import generics, permissions, status as drf_status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
import datetime
from accounts.models import Doctor
from django.contrib.auth import get_user_model
from accounts.models import Doctor

from .models import Appointment, DoctorAvailability, Prescription, PrescriptionItem
from .serializers import (
    AppointmentSerializer,
    DoctorAvailabilitySerializer,
    PrescriptionSerializer,
)

from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Count, Sum, Avg, Q
from datetime import timedelta, date
import calendar

from .models import Appointment, CompteRendu, Prescription
from .serializers import DoctorConsultationHistorySerializer   



# -------- APPOINTMENTS PATIENT --------

class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user)

    def perform_create(self, serializer):
        doctor_id = self.request.data.get('doctor')
        doctor = None
        if doctor_id:
            try:
                doctor = Doctor.objects.get(id=doctor_id)
            except Doctor.DoesNotExist:
                pass
        serializer.save(patient=self.request.user, doctor=doctor)


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(patient=self.request.user)

    def destroy(self, request, *args, **kwargs):
        appointment = self.get_object()
        appointment.status = 'cancelled'
        appointment.save()
        return Response({'message': 'Rendez-vous annulé'}, status=drf_status.HTTP_200_OK)


# -------- APPOINTMENTS MÉDECIN --------

class DoctorAppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            doctor = Doctor.objects.get(user=self.request.user)
        except Doctor.DoesNotExist:
            return Appointment.objects.none()

        queryset = Appointment.objects.filter(doctor=doctor)

        if self.request.query_params.get('today'):
            queryset = queryset.filter(date=datetime.date.today())

        if self.request.query_params.get('upcoming'):
            queryset = queryset.filter(
                date__gte=datetime.date.today(),
                status__in=['pending', 'confirmed']
            ).order_by('date', 'time')[:4]

        return queryset


class DoctorAppointmentStatsView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            doctor = Doctor.objects.get(user=request.user)
        except Doctor.DoesNotExist:
            return Response({'total': 0, 'upcoming': [], 'counts': {}})

        all_appointments = Appointment.objects.filter(doctor=doctor)
        upcoming = all_appointments.filter(
            date__gte=datetime.date.today(),
            status__in=['pending', 'confirmed']
        ).order_by('date', 'time')[:3]

        return Response({
            'total': all_appointments.count(),
            'today': all_appointments.filter(date=datetime.date.today()).count(),
            'pending': all_appointments.filter(status='pending').count(),
            'confirmed': all_appointments.filter(status='confirmed').count(),
            'upcoming': AppointmentSerializer(upcoming, many=True).data,
        })


class AppointmentStatusUpdateView(generics.UpdateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            doctor = Doctor.objects.get(user=self.request.user)
            return Appointment.objects.filter(doctor=doctor)
        except Doctor.DoesNotExist:
            return Appointment.objects.none()

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('status')
        if new_status not in ['confirmed', 'cancelled', 'completed']:
            return Response({'error': 'Statut invalide'}, status=drf_status.HTTP_400_BAD_REQUEST)
        instance.status = new_status
        instance.save()
        return Response(AppointmentSerializer(instance).data)


# -------- DISPONIBILITÉS MÉDECIN --------

class DoctorAvailabilityListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_doctor(self, request):
        try:
            return request.user.doctor
        except Exception:
            return None

    def get(self, request):
        doctor = self.get_doctor(request)
        if not doctor:
            return Response({'error': 'Profil médecin introuvable'}, status=403)
        availabilities = DoctorAvailability.objects.filter(doctor=doctor)
        return Response(DoctorAvailabilitySerializer(availabilities, many=True).data)

    def post(self, request):
        doctor = self.get_doctor(request)
        if not doctor:
            return Response({'error': 'Profil médecin introuvable'}, status=403)
        serializer = DoctorAvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(doctor=doctor)
            return Response(serializer.data, status=drf_status.HTTP_201_CREATED)
        return Response(serializer.errors, status=drf_status.HTTP_400_BAD_REQUEST)


class DoctorAvailabilityDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, request):
        try:
            availability = DoctorAvailability.objects.get(pk=pk)
            if availability.doctor != request.user.doctor:
                return None
            return availability
        except DoctorAvailability.DoesNotExist:
            return None

    def patch(self, request, pk):
        availability = self.get_object(pk, request)
        if not availability:
            return Response({'error': 'Introuvable ou non autorisé'}, status=404)
        serializer = DoctorAvailabilitySerializer(availability, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        availability = self.get_object(pk, request)
        if not availability:
            return Response({'error': 'Introuvable ou non autorisé'}, status=404)
        availability.delete()
        return Response(status=drf_status.HTTP_204_NO_CONTENT)


class DoctorAvailabilityBulkSaveView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            doctor = request.user.doctor
        except Exception:
            return Response({'error': 'Profil médecin introuvable'}, status=403)

        new_availabilities = request.data.get('availabilities', [])
        DoctorAvailability.objects.filter(doctor=doctor).delete()

        created = []
        for item in new_availabilities:
            serializer = DoctorAvailabilitySerializer(data=item)
            if serializer.is_valid():
                serializer.save(doctor=doctor)
                created.append(serializer.data)
            else:
                return Response(serializer.errors, status=400)

        return Response({'saved': len(created), 'availabilities': created})


# -------- PRESCRIPTIONS --------

class PrescriptionListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_doctor(self, request):
        try:
            return request.user.doctor
        except Exception:
            return None

    def get(self, request):
        doctor = self.get_doctor(request)
        if not doctor:
            return Response({'error': 'Profil médecin introuvable'}, status=403)

        queryset = Prescription.objects.filter(doctor=doctor)
        status_filter = request.query_params.get('status')
        patient_filter = request.query_params.get('patient')

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if patient_filter:
            queryset = queryset.filter(patient__id=patient_filter)

        return Response(PrescriptionSerializer(queryset, many=True).data)

    def post(self, request):
        doctor = self.get_doctor(request)
        if not doctor:
            return Response({'error': 'Profil médecin introuvable'}, status=403)

        serializer = PrescriptionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(doctor=doctor)
            return Response(serializer.data, status=drf_status.HTTP_201_CREATED)
        return Response(serializer.errors, status=400)


class PrescriptionDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, request):
        try:
            prescription = Prescription.objects.get(pk=pk)
            if prescription.doctor != request.user.doctor:
                return None
            return prescription
        except Exception:
            return None

    def get(self, request, pk):
        prescription = self.get_object(pk, request)
        if not prescription:
            return Response({'error': 'Introuvable ou non autorisé'}, status=404)
        return Response(PrescriptionSerializer(prescription).data)

    def patch(self, request, pk):
        prescription = self.get_object(pk, request)
        if not prescription:
            return Response({'error': 'Introuvable ou non autorisé'}, status=404)
        serializer = PrescriptionSerializer(prescription, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        prescription = self.get_object(pk, request)
        if not prescription:
            return Response({'error': 'Introuvable ou non autorisé'}, status=404)
        prescription.delete()
        return Response(status=drf_status.HTTP_204_NO_CONTENT)


class DoctorPatientsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            doctor = request.user.doctor
        except Exception:
            return Response({'error': 'Profil médecin introuvable'}, status=403)

        User = get_user_model()
        patient_ids = Appointment.objects.filter(
            doctor=doctor
        ).values_list('patient_id', flat=True).distinct()

        patients = User.objects.filter(id__in=patient_ids)
        data = [{'id': p.id, 'name': f"{p.first_name} {p.last_name}"} for p in patients]
        return Response(data)
    
from .models import Appointment, DoctorAvailability, Prescription, PrescriptionItem, CompteRendu
from .serializers import (
    AppointmentSerializer, DoctorAvailabilitySerializer,
    PrescriptionSerializer, CompteRenduSerializer
)

# -------- COMPTES-RENDUS --------

class CompteRenduListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_doctor(self, request):
        try:
            return request.user.doctor
        except Exception:
            return None

    def get(self, request):
        doctor = self.get_doctor(request)
        if not doctor:
            return Response({'error': 'Profil médecin introuvable'}, status=403)

        queryset = CompteRendu.objects.filter(doctor=doctor)
        patient_filter = request.query_params.get('patient')
        if patient_filter:
            queryset = queryset.filter(patient__id=patient_filter)

        return Response(CompteRenduSerializer(queryset, many=True).data)

    def post(self, request):
        doctor = self.get_doctor(request)
        if not doctor:
            return Response({'error': 'Profil médecin introuvable'}, status=403)

        serializer = CompteRenduSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(doctor=doctor)
            return Response(serializer.data, status=drf_status.HTTP_201_CREATED)
        return Response(serializer.errors, status=400)


class CompteRenduDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, request):
        try:
            cr = CompteRendu.objects.get(pk=pk)
            if cr.doctor != request.user.doctor:
                return None
            return cr
        except Exception:
            return None

    def get(self, request, pk):
        cr = self.get_object(pk, request)
        if not cr:
            return Response({'error': 'Introuvable ou non autorisé'}, status=404)
        return Response(CompteRenduSerializer(cr).data)

    def patch(self, request, pk):
        cr = self.get_object(pk, request)
        if not cr:
            return Response({'error': 'Introuvable ou non autorisé'}, status=404)
        serializer = CompteRenduSerializer(cr, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        cr = self.get_object(pk, request)
        if not cr:
            return Response({'error': 'Introuvable ou non autorisé'}, status=404)
        cr.delete()
        return Response(status=drf_status.HTTP_204_NO_CONTENT)

# -------- DOSSIERS PATIENTS (vue hôpital) --------

class HospitalPatientRecordsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response({'error': 'Profil hôpital introuvable'}, status=403)

        from accounts.models import Doctor
        from django.contrib.auth import get_user_model
        User = get_user_model()

        # Tous les médecins de l'hôpital
        doctor_ids = Doctor.objects.filter(
            hospital=hospital
        ).values_list('id', flat=True)

        # Tous les patients distincts ayant un RDV avec ces médecins
        patient_ids = Appointment.objects.filter(
            doctor_id__in=doctor_ids
        ).values_list('patient_id', flat=True).distinct()

        patients = User.objects.filter(id__in=patient_ids)

        result = []
        for patient in patients:
            # RDV du patient avec les médecins de l'hôpital
            rdvs = Appointment.objects.filter(
                patient=patient,
                doctor_id__in=doctor_ids
            ).order_by('-date')

            # Dernier RDV
            last_rdv = rdvs.first()

            # Comptes-rendus
            comptes_rendus = CompteRendu.objects.filter(
                patient=patient,
                doctor_id__in=doctor_ids
            ).order_by('-date')

            # Prescriptions
            prescriptions = Prescription.objects.filter(
                patient=patient,
                doctor_id__in=doctor_ids
            ).order_by('-date')

            result.append({
                'id': patient.id,
                'patient': {
                    'id':           patient.id,
                    'name':         f"{patient.first_name} {patient.last_name}",
                    'email':        patient.email,
                    'phone':        patient.phone or '',
                    'date_of_birth':str(patient.date_of_birth) if patient.date_of_birth else '',
                    'gender':       patient.gender or '',
                    'city':         patient.city or '',
                },
                'last_visit':        str(last_rdv.date) if last_rdv else None,
                'total_appointments':rdvs.count(),
                'total_records':     comptes_rendus.count(),
                'total_prescriptions':prescriptions.count(),
                'appointments': AppointmentSerializer(rdvs[:5], many=True).data,
                'comptes_rendus': CompteRenduSerializer(comptes_rendus[:3], many=True).data,
                'prescriptions':  PrescriptionSerializer(prescriptions[:3], many=True).data,
            })

        return Response(result)


from accounts.permissions import IsHospitalRole

class DoctorAvailabilityByIdView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsHospitalRole]

    def get(self, request, doctor_id):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response({'error': 'Profil hôpital introuvable'}, status=403)

        from accounts.models import Doctor
        try:
            doctor = Doctor.objects.get(id=doctor_id, hospital=hospital)
        except Doctor.DoesNotExist:
            return Response({'error': 'Médecin introuvable dans votre établissement'}, status=404)

        availabilities = DoctorAvailability.objects.filter(doctor=doctor)
        return Response(DoctorAvailabilitySerializer(availabilities, many=True).data)



# appointments/views.py  (ajouter ces vues à celles existantes)


# ============================================================
# VUE : Historique des consultations du médecin connecté
# GET /api/appointments/doctor/history/
# Paramètres query optionnels :
#   - search   : texte libre (nom patient, motif, diagnostic)
#   - status   : pending | confirmed | cancelled | completed
#   - type     : video | presentiel | in-person
#   - period   : 7days | 30days | 90days | 1year  (défaut : tout)
#   - page     : numéro de page (défaut 1)
#   - per_page : taille page (défaut 10, max 50)
# ============================================================
class DoctorConsultationHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Vérification rôle médecin
        if user.role != 'doctor':
            return Response(
                {"detail": "Accès réservé aux médecins."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Récupérer le profil Doctor
        try:
            doctor = user.doctor
        except Exception:
            return Response(
                {"detail": "Profil médecin introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )

        # ---- Queryset de base ----
        qs = Appointment.objects.filter(doctor=doctor).select_related(
            'patient', 'doctor', 'doctor__hospital'
        )

        # ---- Filtres ----
        search = request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(patient__first_name__icontains=search) |
                Q(patient__last_name__icontains=search)  |
                Q(reason__icontains=search)
            )

        filter_status = request.query_params.get('status', '')
        if filter_status and filter_status != 'all':
            qs = qs.filter(status=filter_status)

        filter_type = request.query_params.get('type', '')
        if filter_type and filter_type != 'all':
            if filter_type == 'presentiel':
                qs = qs.filter(type__in=['presentiel', 'in-person'])
            else:
                qs = qs.filter(type=filter_type)

        period = request.query_params.get('period', '')
        if period and period != 'all':
            today = date.today()
            period_map = {
                '7days':  today - timedelta(days=7),
                '30days': today - timedelta(days=30),
                '90days': today - timedelta(days=90),
                '1year':  today - timedelta(days=365),
            }
            start_date = period_map.get(period)
            if start_date:
                qs = qs.filter(date__gte=start_date)

        # ---- Tri : plus récent en premier ----
        qs = qs.order_by('-date', '-time')

        # ---- Pagination simple ----
        try:
            page     = max(1, int(request.query_params.get('page', 1)))
            per_page = min(50, max(1, int(request.query_params.get('per_page', 10))))
        except ValueError:
            page, per_page = 1, 10

        total  = qs.count()
        start  = (page - 1) * per_page
        end    = start + per_page
        subset = qs[start:end]

        serializer = DoctorConsultationHistorySerializer(subset, many=True)

        return Response({
            "count":    total,
            "page":     page,
            "per_page": per_page,
            "pages":    (total + per_page - 1) // per_page if total > 0 else 1,
            "results":  serializer.data,
        })


# ============================================================
# VUE : Statistiques du médecin connecté
# GET /api/appointments/doctor/stats/
# Paramètre query optionnel :
#   - range : semaine | mois | annee  (défaut : mois)
# ============================================================
class DoctorStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != 'doctor':
            return Response(
                {"detail": "Accès réservé aux médecins."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            doctor = user.doctor
        except Exception:
            return Response(
                {"detail": "Profil médecin introuvable."},
                status=status.HTTP_404_NOT_FOUND
            )

        time_range = request.query_params.get('range', 'mois')
        today      = date.today()

        # ---- Définir la période ----
        if time_range == 'semaine':
            start_date = today - timedelta(days=7)
        elif time_range == 'annee':
            start_date = date(today.year, 1, 1)
        else:  # mois (défaut)
            start_date = date(today.year, today.month, 1)

        # ---- Base querysets ----
        all_rdv      = Appointment.objects.filter(doctor=doctor)
        period_rdv   = all_rdv.filter(date__gte=start_date)
        completed    = all_rdv.filter(status='completed')
        period_done  = period_rdv.filter(status='completed')

        # ============================================================
        # 1. CHIFFRES CLÉS
        # ============================================================

        # Patients uniques (tous les temps)
        total_patients = all_rdv.values('patient').distinct().count()

        # Patients uniques sur la période
        period_patients = period_rdv.values('patient').distinct().count()

        # Consultations totales (tous statuts)
        total_consultations  = all_rdv.count()
        period_consultations = period_rdv.count()

        # Revenus : fee selon type × nb consultations terminées
        def calc_revenue(qs):
            revenue = 0
            for rdv in qs.select_related('doctor'):
                if rdv.doctor:
                    if rdv.type == 'video':
                        revenue += rdv.doctor.fee_video
                    else:
                        revenue += rdv.doctor.fee_in_person
            return revenue

        total_revenus  = calc_revenue(completed)
        period_revenus = calc_revenue(period_done)

        # Taux d'occupation : (consultations terminées + confirmées) / total × 100
        occupied = all_rdv.filter(status__in=['confirmed', 'completed']).count()
        taux_occupation = round((occupied / total_consultations * 100) if total_consultations > 0 else 0)

        # ---- Évolutions (vs période précédente) ----
        def evolution(current, previous):
            if previous == 0:
                return 100.0 if current > 0 else 0.0
            return round(((current - previous) / previous) * 100, 1)

        delta_days = (today - start_date).days or 1
        prev_start = start_date - timedelta(days=delta_days)
        prev_rdv   = all_rdv.filter(date__gte=prev_start, date__lt=start_date)

        prev_patients      = prev_rdv.values('patient').distinct().count()
        prev_consultations = prev_rdv.count()
        prev_revenus       = calc_revenue(prev_rdv.filter(status='completed'))

        evo_patients      = evolution(period_patients,      prev_patients)
        evo_consultations = evolution(period_consultations,  prev_consultations)
        evo_revenus       = evolution(period_revenus,        prev_revenus)

        # ============================================================
        # 2. GRAPHIQUE : Consultations par mois (année en cours)
        # ============================================================
        consultations_par_mois = []
        revenus_par_mois = []
        mois_labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
                       'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']

        for m in range(1, 13):
            rdv_mois = all_rdv.filter(date__year=today.year, date__month=m)
            consultations_par_mois.append(rdv_mois.count())

            done_mois = rdv_mois.filter(status='completed')
            revenus_par_mois.append(calc_revenue(done_mois))

        # ============================================================
        # 3. RÉPARTITION PAR TYPE
        # ============================================================
        types_data = {}
        for rdv in all_rdv.values('type').annotate(total=Count('id')):
            label = 'Visioconférence' if rdv['type'] == 'video' else 'Présentiel'
            types_data[label] = types_data.get(label, 0) + rdv['total']

        types_labels = list(types_data.keys())
        types_values = list(types_data.values())

        # ============================================================
        # 4. RÉPARTITION PAR STATUT
        # ============================================================
        statut_labels_map = {
            'completed': 'Terminé',
            'confirmed': 'Confirmé',
            'pending':   'En attente',
            'cancelled': 'Annulé',
        }
        statuts = {}
        for rdv in all_rdv.values('status').annotate(total=Count('id')):
            label = statut_labels_map.get(rdv['status'], rdv['status'])
            statuts[label] = rdv['total']

        # ============================================================
        # 5. TRANCHES D'ÂGE DES PATIENTS
        # ============================================================
        age_groups = {'0-18': 0, '19-30': 0, '31-45': 0, '46-60': 0, '61+': 0}

        patients_ids = all_rdv.values_list('patient_id', flat=True).distinct()
        from django.contrib.auth import get_user_model
        User = get_user_model()
        patients = User.objects.filter(id__in=patients_ids)

        for p in patients:
            if p.date_of_birth:
                age = today.year - p.date_of_birth.year - (
                    (today.month, today.day) < (p.date_of_birth.month, p.date_of_birth.day)
                )
                if age <= 18:
                    age_groups['0-18'] += 1
                elif age <= 30:
                    age_groups['19-30'] += 1
                elif age <= 45:
                    age_groups['31-45'] += 1
                elif age <= 60:
                    age_groups['46-60'] += 1
                else:
                    age_groups['61+'] += 1

        # ============================================================
        # 6. NOTE MOYENNE (reviews)
        # ============================================================
        try:
            from reviews.models import Review
            avg_rating = Review.objects.filter(
                doctor=doctor, status='approved'
            ).aggregate(avg=Avg('rating'))['avg']
            avg_rating = round(avg_rating, 1) if avg_rating else None
            nb_reviews = Review.objects.filter(doctor=doctor, status='approved').count()
        except Exception:
            avg_rating = None
            nb_reviews = 0

        # ============================================================
        # 7. RÉPONSE FINALE
        # ============================================================
        return Response({
            # Chiffres clés
            "patients":              total_patients,
            "consultations":         total_consultations,
            "revenus":               total_revenus,
            "taux_occupation":       taux_occupation,
            "evolution_patients":    evo_patients,
            "evolution_consultations": evo_consultations,
            "evolution_revenus":     evo_revenus,

            # Note
            "avg_rating":  avg_rating,
            "nb_reviews":  nb_reviews,

            # Graphiques
            "consultations_par_mois": {
                "labels": mois_labels,
                "data":   consultations_par_mois,
            },
            "revenus_par_mois": {
                "labels": mois_labels,
                "data":   revenus_par_mois,
            },
            "types_consultation": {
                "labels": types_labels,
                "data":   types_values,
            },
            "statuts": {
                "labels": list(statuts.keys()),
                "data":   list(statuts.values()),
            },
            "age_groups": {
                "labels": list(age_groups.keys()),
                "data":   list(age_groups.values()),
            },
        })
