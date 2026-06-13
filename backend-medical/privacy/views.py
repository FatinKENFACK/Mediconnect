from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.utils import timezone
from accounts.permissions import IsAdminRole
from .models import AccessLog, DataRequest, PrivacySettings
from .serializers import (
    AccessLogSerializer,
    DataRequestSerializer,
    PrivacySettingsSerializer,
)


# ============================================================
# LOGS D'ACCÈS
# ============================================================
class AccessLogListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        logs = AccessLog.objects.all()[:50]
        stats = {
            'total':   AccessLog.objects.count(),
            'success': AccessLog.objects.filter(success=True).count(),
            'failed':  AccessLog.objects.filter(success=False).count(),
        }
        return Response({
            'stats': stats,
            'logs':  AccessLogSerializer(logs, many=True).data,
        })

    def post(self, request):
        serializer = AccessLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


# ============================================================
# DEMANDES DE DONNÉES
# ============================================================
class DataRequestListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        requests = DataRequest.objects.all()
        status_filter = request.query_params.get('status')
        if status_filter:
            requests = requests.filter(status=status_filter)
        return Response(DataRequestSerializer(requests, many=True).data)

    def post(self, request):
        serializer = DataRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class DataRequestDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_object(self, pk):
        try:
            return DataRequest.objects.get(pk=pk)
        except DataRequest.DoesNotExist:
            return None

    def patch(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({'error': 'Demande introuvable.'}, status=404)

        action = request.data.get('action')
        if action == 'approve':
            obj.status        = 'approved'
            obj.response_date = timezone.now().date()
        elif action == 'reject':
            obj.status        = 'rejected'
            obj.response_date = timezone.now().date()
            obj.admin_notes   = request.data.get('reason', '')
        elif action == 'complete':
            obj.status        = 'completed'
            obj.response_date = timezone.now().date()
        else:
            serializer = DataRequestSerializer(obj, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)

        obj.save()
        return Response(DataRequestSerializer(obj).data)

    def delete(self, request, pk):
        obj = self.get_object(pk)
        if not obj:
            return Response({'error': 'Demande introuvable.'}, status=404)
        obj.delete()
        return Response(status=204)


# ============================================================
# PARAMÈTRES DE CONFIDENTIALITÉ
# ============================================================
class PrivacySettingsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get_or_create_settings(self):
        obj, _ = PrivacySettings.objects.get_or_create(pk=1)
        return obj

    def get(self, request):
        obj = self.get_or_create_settings()
        return Response(PrivacySettingsSerializer(obj).data)

    def patch(self, request):
        obj        = self.get_or_create_settings()
        serializer = PrivacySettingsSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


# ============================================================
# STATS GLOBALES CONFIDENTIALITÉ
# ============================================================
class PrivacyStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        settings_obj, _ = PrivacySettings.objects.get_or_create(pk=1)

        return Response({
            'access_logs': {
                'total':   AccessLog.objects.count(),
                'success': AccessLog.objects.filter(success=True).count(),
                'failed':  AccessLog.objects.filter(success=False).count(),
            },
            'data_requests': {
                'total':    DataRequest.objects.count(),
                'pending':  DataRequest.objects.filter(status='pending').count(),
                'approved': DataRequest.objects.filter(status='approved').count(),
                'rejected': DataRequest.objects.filter(status='rejected').count(),
                'completed':DataRequest.objects.filter(status='completed').count(),
            },
            'settings': PrivacySettingsSerializer(settings_obj).data,
        })