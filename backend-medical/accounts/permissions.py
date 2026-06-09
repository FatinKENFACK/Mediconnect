from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):
    """Autorise is_staff=True OU role='admin'"""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.is_staff or getattr(request.user, 'role', None) == 'admin')
        )

class IsHospitalRole(BasePermission):
    """Autorise uniquement role='hospital'"""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request.user, 'role', None) == 'hospital'
        )

class IsDoctorRole(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'doctor'