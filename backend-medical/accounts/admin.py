# accounts/admin.py
# Remplace ton fichier accounts/admin.py existant par ceci

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import CustomUser, Hospital, Doctor, Subscription, Service


# ============================================================
# ADMIN : CustomUser
# ============================================================
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display  = ('email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff', 'date_joined')
    list_filter   = ('role', 'is_active', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering      = ('-date_joined',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Informations personnelles'), {'fields': (
            'first_name', 'last_name', 'phone',
            'date_of_birth', 'gender', 'address',
            'city', 'region', 'postal_code', 'profile_picture',
        )}),
        (_('Rôle & Statut'), {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
        (_('Dates'), {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )

    # Actions rapides
    actions = ['activate_users', 'deactivate_users', 'set_role_admin']

    @admin.action(description='✅ Activer les utilisateurs sélectionnés')
    def activate_users(self, request, queryset):
        queryset.update(is_active=True)
        self.message_user(request, f"{queryset.count()} utilisateur(s) activé(s).")

    @admin.action(description='🚫 Désactiver les utilisateurs sélectionnés')
    def deactivate_users(self, request, queryset):
        queryset.update(is_active=False)
        self.message_user(request, f"{queryset.count()} utilisateur(s) désactivé(s).")

    @admin.action(description='👑 Mettre le rôle Admin')
    def set_role_admin(self, request, queryset):
        queryset.update(role='admin')
        self.message_user(request, f"{queryset.count()} utilisateur(s) promu(s) admin.")


# ============================================================
# ADMIN : Hospital
# ============================================================
@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display  = ('name', 'get_email', 'city', 'hospital_type', 'is_verified', 'registration_code', 'created_at')
    list_filter   = ('is_verified', 'hospital_type', 'city')
    search_fields = ('name', 'user__email', 'registration_code')
    ordering      = ('-created_at',)
    readonly_fields = ('registration_code', 'created_at')

    # Actions pour valider/invalider un hôpital
    actions = ['verify_hospitals', 'unverify_hospitals']

    @admin.action(description='✅ Valider les hôpitaux sélectionnés')
    def verify_hospitals(self, request, queryset):
        queryset.update(is_verified=True)
        # Activer aussi les comptes utilisateur associés
        for hospital in queryset:
            hospital.user.is_active = True
            hospital.user.save()
        self.message_user(request, f"{queryset.count()} hôpital(aux) validé(s).")

    @admin.action(description='🚫 Invalider les hôpitaux sélectionnés')
    def unverify_hospitals(self, request, queryset):
        queryset.update(is_verified=False)
        self.message_user(request, f"{queryset.count()} hôpital(aux) invalidé(s).")

    def get_email(self, obj):
        return obj.user.email if obj.user else '—'
    get_email.short_description = 'Email'


# ============================================================
# ADMIN : Doctor
# ============================================================
@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display  = ('get_full_name', 'get_email', 'specialization', 'get_hospital', 'is_verified', 'created_at')
    list_filter   = ('is_verified', 'specialization')
    search_fields = ('user__first_name', 'user__last_name', 'user__email', 'license_number')
    ordering      = ('-created_at',)

    actions = ['verify_doctors', 'unverify_doctors']

    @admin.action(description='✅ Vérifier les médecins sélectionnés')
    def verify_doctors(self, request, queryset):
        queryset.update(is_verified=True)
        self.message_user(request, f"{queryset.count()} médecin(s) vérifié(s).")

    @admin.action(description='🚫 Invalider les médecins sélectionnés')
    def unverify_doctors(self, request, queryset):
        queryset.update(is_verified=False)
        self.message_user(request, f"{queryset.count()} médecin(s) invalidé(s).")

    def get_full_name(self, obj):
        return f"Dr. {obj.user.first_name} {obj.user.last_name}" if obj.user else '—'
    get_full_name.short_description = 'Nom'

    def get_email(self, obj):
        return obj.user.email if obj.user else '—'
    get_email.short_description = 'Email'

    def get_hospital(self, obj):
        return obj.hospital.name if obj.hospital else '—'
    get_hospital.short_description = 'Hôpital'


# ============================================================
# ADMIN : Subscription
# ============================================================
@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('hospital', 'plan', 'status', 'billing_cycle', 'price', 'start_date', 'end_date')
    list_filter  = ('plan', 'status', 'billing_cycle')
    search_fields = ('hospital__name',)


# ============================================================
# ADMIN : Service
# ============================================================
@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'hospital', 'category', 'consultation_fee', 'is_active')
    list_filter  = ('is_active', 'category')
    search_fields = ('name', 'hospital__name')