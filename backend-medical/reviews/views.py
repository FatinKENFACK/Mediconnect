from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.utils import timezone

from .models import Review
from .serializers import ReviewSerializer, PublicReviewSerializer, AdminReviewSerializer
from accounts.permissions import IsAdminRole, IsHospitalRole


# ============================================================
# PATIENT — Créer un avis + voir ses avis
# POST /api/reviews/
# GET  /api/reviews/my/
# ============================================================

class PatientCreateReviewView(APIView):
    """Patient crée un avis sur un médecin."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Seuls les patients peuvent donner un avis.'}, status=403)

        serializer = ReviewSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(patient=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class PatientMyReviewsView(APIView):
    """Patient voit tous ses avis."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'patient':
            return Response({'error': 'Accès non autorisé.'}, status=403)

        reviews = Review.objects.filter(patient=request.user).select_related(
            'doctor__user', 'doctor__hospital'
        )
        return Response(ReviewSerializer(reviews, many=True).data)

    def delete(self, request, pk):
        """Patient supprime son propre avis (seulement si pending)."""
        try:
            review = Review.objects.get(pk=pk, patient=request.user)
        except Review.DoesNotExist:
            return Response({'error': 'Avis introuvable.'}, status=404)

        if review.status != 'pending':
            return Response(
                {'error': 'Vous ne pouvez supprimer qu\'un avis en attente de modération.'},
                status=400
            )
        review.delete()
        return Response(status=204)


# ============================================================
# PUBLIC — Avis approuvés d'un médecin
# GET /api/reviews/doctor/<doctor_id>/
# ============================================================

class DoctorPublicReviewsView(APIView):
    """Avis publics approuvés d'un médecin — accessible à tous."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, doctor_id):
        reviews = Review.objects.filter(
            doctor_id=doctor_id,
            status='approved'
        ).select_related('patient')

        # Stats
        total  = reviews.count()
        avg    = round(sum(r.rating for r in reviews) / total, 1) if total > 0 else 0
        dist   = {str(i): reviews.filter(rating=i).count() for i in range(1, 6)}

        return Response({
            'total':        total,
            'average':      avg,
            'distribution': dist,
            'reviews':      PublicReviewSerializer(reviews, many=True).data,
        })


# ============================================================
# MÉDECIN — Voir ses propres avis reçus
# GET /api/reviews/doctor/me/
# ============================================================

class DoctorMyReviewsView(APIView):
    """Médecin voit ses avis reçus."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role != 'doctor':
            return Response({'error': 'Accès non autorisé.'}, status=403)

        try:
            doctor = request.user.doctor
        except Exception:
            return Response({'error': 'Profil médecin introuvable.'}, status=403)

        reviews = Review.objects.filter(
            doctor=doctor,
            status='approved'
        ).select_related('patient')

        total = reviews.count()
        avg   = round(sum(r.rating for r in reviews) / total, 1) if total > 0 else 0
        dist  = {str(i): reviews.filter(rating=i).count() for i in range(1, 6)}

        return Response({
            'total':        total,
            'average':      avg,
            'distribution': dist,
            'reviews':      PublicReviewSerializer(reviews, many=True).data,
        })


# ============================================================
# HÔPITAL — Voir les avis de tous ses médecins
# GET /api/reviews/hospital/
# ============================================================

class HospitalReviewsView(APIView):
    """Hôpital voit les avis approuvés de tous ses médecins."""
    permission_classes = [permissions.IsAuthenticated, IsHospitalRole]

    def get(self, request):
        try:
            hospital = request.user.hospital
        except Exception:
            return Response({'error': 'Profil hôpital introuvable.'}, status=403)

        from accounts.models import Doctor
        doctor_ids = Doctor.objects.filter(hospital=hospital).values_list('id', flat=True)

        reviews = Review.objects.filter(
            doctor_id__in=doctor_ids,
            status='approved'
        ).select_related('patient', 'doctor__user')

        total = reviews.count()
        avg   = round(sum(r.rating for r in reviews) / total, 1) if total > 0 else 0

        return Response({
            'total':   total,
            'average': avg,
            'reviews': ReviewSerializer(reviews, many=True).data,
        })


# ============================================================
# ADMIN — Voir tous les avis + modérer
# GET    /api/reviews/admin/
# PATCH  /api/reviews/admin/<pk>/
# DELETE /api/reviews/admin/<pk>/
# ============================================================

class AdminReviewListView(APIView):
    """Admin voit tous les avis avec filtres."""
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        reviews = Review.objects.select_related(
            'patient', 'doctor__user', 'doctor__hospital'
        ).all()

        # Filtres query params
        status = request.query_params.get('status')
        if status:
            reviews = reviews.filter(status=status)

        doctor_id = request.query_params.get('doctor')
        if doctor_id:
            reviews = reviews.filter(doctor_id=doctor_id)

        rating = request.query_params.get('rating')
        if rating:
            reviews = reviews.filter(rating=rating)

        total   = reviews.count()
        pending  = Review.objects.filter(status='pending').count()
        approved = Review.objects.filter(status='approved').count()
        rejected = Review.objects.filter(status='rejected').count()
        all_approved = Review.objects.filter(status='approved')
        avg = round(
            sum(r.rating for r in all_approved) / all_approved.count(), 1
        ) if all_approved.count() > 0 else 0

        return Response({
            'stats': {
                'total':    total,
                'pending':  pending,
                'approved': approved,
                'rejected': rejected,
                'average':  avg,
            },
            'reviews': AdminReviewSerializer(reviews, many=True).data,
        })


class AdminReviewDetailView(APIView):
    """Admin modère ou supprime un avis."""
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_object(self, pk):
        try:
            return Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            return None

    def patch(self, request, pk):
        review = self.get_object(pk)
        if not review:
            return Response({'error': 'Avis introuvable.'}, status=404)

        action = request.data.get('action')

        if action == 'approve':
            review.status       = 'approved'
            review.rejection_reason = ''
            review.moderated_at = timezone.now()
            review.moderated_by = request.user
            review.save()
            return Response({'success': True, 'message': 'Avis approuvé.'})

        elif action == 'reject':
            reason = request.data.get('reason', '')
            if not reason:
                return Response({'error': 'Une raison de rejet est requise.'}, status=400)
            review.status           = 'rejected'
            review.rejection_reason = reason
            review.moderated_at     = timezone.now()
            review.moderated_by     = request.user
            review.save()
            return Response({'success': True, 'message': 'Avis rejeté.'})

        else:
            return Response({'error': 'Action invalide. Utilisez "approve" ou "reject".'}, status=400)

    def delete(self, request, pk):
        review = self.get_object(pk)
        if not review:
            return Response({'error': 'Avis introuvable.'}, status=404)
        review.delete()
        return Response(status=204)