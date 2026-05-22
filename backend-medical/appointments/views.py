from rest_framework import generics, permissions, status as drf_status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
import datetime
from accounts.models import Doctor
from django.contrib.auth import get_user_model

from .models import Appointment, DoctorAvailability, Prescription, PrescriptionItem
from .serializers import (
    AppointmentSerializer,
    DoctorAvailabilitySerializer,
    PrescriptionSerializer,
)


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