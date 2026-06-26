# ============================================================
# search/views.py
# ============================================================

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth import get_user_model
from django.db.models import Q

from accounts.permissions import IsAdminRole, IsHospitalRole
from accounts.models import Hospital, Doctor
from appointments.models import Appointment, Prescription

User = get_user_model()


def build_result(rtype, id, title, subtitle, link, extra=None):
    """Construit un résultat de recherche standardisé."""
    result = {
        'type':     rtype,
        'id':       id,
        'title':    title,
        'subtitle': subtitle,
        'link':     link,
    }
    if extra:
        result.update(extra)
    return result


# ============================================================
# PATIENT — Cherche médecins + hôpitaux
# GET /api/search/patient/?q=...
# ============================================================
class PatientSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Accès non autorisé.'}, status=403)

        q = request.query_params.get('q', '').strip()
        if not q or len(q) < 2:
            return Response({'results': [], 'count': 0})

        results = []

        # ---- Médecins (vérifiés et disponibles uniquement) ----
        doctors = Doctor.objects.filter(
            is_verified=True,
            is_available=True,
        ).filter(
            Q(user__first_name__icontains=q) |
            Q(user__last_name__icontains=q) |
            Q(specialization__icontains=q)
        ).select_related('user', 'hospital')[:8]

        for d in doctors:
            results.append(build_result(
                'doctor', d.id,
                f"Dr. {d.user.first_name} {d.user.last_name}",
                f"{d.specialization} · {d.hospital.name if d.hospital else ''}",
                f"/patient/medecin/{d.id}",
                {'specialization': d.specialization}
            ))

        # ---- Hôpitaux (vérifiés uniquement) ----
        hospitals = Hospital.objects.filter(
            is_verified=True,
            user__is_active=True,
        ).filter(
            Q(name__icontains=q) | Q(city__icontains=q)
        )[:5]

        for h in hospitals:
            results.append(build_result(
                'hospital', h.id, h.name,
                f"{h.city}, {h.region}",
                f"/patient/hopital/{h.id}",
            ))

        return Response({'results': results, 'count': len(results)})


# ============================================================
# MÉDECIN — Cherche ses patients + RDV + prescriptions
# GET /api/search/doctor/?q=...
# ============================================================
class DoctorSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'doctor':
            return Response({'error': 'Accès non autorisé.'}, status=403)

        try:
            doctor = request.user.doctor
        except Exception:
            return Response({'error': 'Profil médecin introuvable.'}, status=403)

        q = request.query_params.get('q', '').strip()
        if not q or len(q) < 2:
            return Response({'results': [], 'count': 0})

        results = []

        # ---- Patients (ceux ayant eu RDV avec ce médecin) ----
        patient_ids = Appointment.objects.filter(
            doctor=doctor
        ).values_list('patient_id', flat=True).distinct()

        patients = User.objects.filter(
            id__in=patient_ids
        ).filter(
            Q(first_name__icontains=q) | Q(last_name__icontains=q) | Q(email__icontains=q)
        )[:8]

        for p in patients:
            results.append(build_result(
                'patient', p.id,
                f"{p.first_name} {p.last_name}",
                p.email,
                f"/medecin/dossiers/{p.id}",
            ))

        # ---- Rendez-vous ----
        appointments = Appointment.objects.filter(
            doctor=doctor
        ).filter(
            Q(patient__first_name__icontains=q) |
            Q(patient__last_name__icontains=q) |
            Q(reason__icontains=q)
        ).select_related('patient')[:6]

        for a in appointments:
            results.append(build_result(
                'appointment', a.id,
                f"RDV — {a.patient.first_name} {a.patient.last_name}",
                f"{a.date} à {a.time.strftime('%H:%M') if a.time else ''} · {a.get_status_display() if hasattr(a, 'get_status_display') else a.status}",
                f"/medecin/agenda?rdv={a.id}",
            ))

        # ---- Prescriptions ----
        prescriptions = Prescription.objects.filter(
            doctor=doctor
        ).filter(
            Q(patient__first_name__icontains=q) | Q(patient__last_name__icontains=q)
        ).select_related('patient')[:5]

        for p in prescriptions:
            results.append(build_result(
                'prescription', p.id,
                f"Prescription — {p.patient.first_name} {p.patient.last_name}",
                f"{p.date}",
                f"/medecin/prescriptions/{p.id}",
            ))

        return Response({'results': results, 'count': len(results)})


# ============================================================
# HÔPITAL — Cherche ses médecins + RDV
# GET /api/search/hospital/?q=...
# ============================================================
class HospitalSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsHospitalRole]

    def get(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response({'error': 'Profil hôpital introuvable.'}, status=403)

        q = request.query_params.get('q', '').strip()
        if not q or len(q) < 2:
            return Response({'results': [], 'count': 0})

        results = []

        # ---- Médecins de l'hôpital ----
        doctors = Doctor.objects.filter(
            hospital=hospital
        ).filter(
            Q(user__first_name__icontains=q) |
            Q(user__last_name__icontains=q) |
            Q(specialization__icontains=q)
        ).select_related('user')[:8]

        for d in doctors:
            results.append(build_result(
                'doctor', d.id,
                f"Dr. {d.user.first_name} {d.user.last_name}",
                d.specialization,
                f"/hopital/medecins?id={d.id}",
            ))

        # ---- RDV des médecins de l'hôpital ----
        doctor_ids = Doctor.objects.filter(hospital=hospital).values_list('id', flat=True)
        appointments = Appointment.objects.filter(
            doctor_id__in=doctor_ids
        ).filter(
            Q(patient__first_name__icontains=q) | Q(patient__last_name__icontains=q)
        ).select_related('patient', 'doctor__user')[:8]

        for a in appointments:
            results.append(build_result(
                'appointment', a.id,
                f"RDV — {a.patient.first_name} {a.patient.last_name}",
                f"Dr. {a.doctor.user.last_name if a.doctor else ''} · {a.date}",
                f"/hopital/rendez-vous?id={a.id}",
            ))

        return Response({'results': results, 'count': len(results)})


# ============================================================
# ADMIN — Cherche partout : hôpitaux, médecins, patients
# GET /api/search/admin/?q=...
# ============================================================
class AdminSearchView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        q = request.query_params.get('q', '').strip()
        if not q or len(q) < 2:
            return Response({'results': [], 'count': 0})

        results = []

        # ---- Hôpitaux ----
        hospitals = Hospital.objects.filter(
            Q(name__icontains=q) | Q(email__icontains=q) | Q(city__icontains=q)
        )[:6]
        for h in hospitals:
            results.append(build_result(
                'hospital', h.id, h.name,
                f"{h.email} · {h.city}",
                f"/admin/hopitaux?id={h.id}",
            ))

        # ---- Médecins ----
        doctors = Doctor.objects.filter(
            Q(user__first_name__icontains=q) |
            Q(user__last_name__icontains=q) |
            Q(specialization__icontains=q)
        ).select_related('user', 'hospital')[:6]
        for d in doctors:
            results.append(build_result(
                'doctor', d.id,
                f"Dr. {d.user.first_name} {d.user.last_name}",
                f"{d.specialization} · {d.hospital.name if d.hospital else ''}",
                f"/admin/medecins?id={d.id}",
            ))

        # ---- Patients ----
        patients = User.objects.filter(
            role='patient'
        ).filter(
            Q(first_name__icontains=q) | Q(last_name__icontains=q) | Q(email__icontains=q)
        )[:6]
        for p in patients:
            results.append(build_result(
                'patient', p.id,
                f"{p.first_name} {p.last_name}",
                p.email,
                f"/admin/patients?id={p.id}",
            ))

        return Response({'results': results, 'count': len(results)})