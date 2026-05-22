from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Hospital

# ===================== CUSTOM USER =====================
@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'is_staff']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-date_joined']

    fieldsets = (
        ('Connexion', {'fields': ('email', 'password')}),
        ('Informations personnelles', {'fields': ('first_name', 'last_name', 'phone', 'date_of_birth', 'gender', 'profile_picture')}),
        ('Localisation', {'fields': ('address', 'city', 'region', 'postal_code')}),
        ('Rôle & Médecin', {'fields': ('role', 'specialization', 'license_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
        }),
    )

# ===================== HOSPITAL =====================
@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'hospital_type', 'is_verified', 'created_at']
    list_filter = ['hospital_type', 'is_verified', 'city']
    search_fields = ['name', 'email', 'registration_number']
    ordering = ['-created_at']
    readonly_fields = ['created_at']

    fieldsets = (
        ('Établissement', {'fields': ('user', 'name', 'registration_number', 'hospital_type')}),
        ('Contact', {'fields': ('phone', 'email', 'website')}),
        ('Localisation', {'fields': ('address', 'city', 'region')}),
        ('Statut', {'fields': ('is_verified', 'created_at')}),
    )

    # Permet de valider un hôpital directement depuis la liste
    actions = ['valider_hopitaux', 'invalider_hopitaux']

    def valider_hopitaux(self, request, queryset):
        queryset.update(is_verified=True)
        self.message_user(request, f"{queryset.count()} hôpital(aux) validé(s) avec succès.")
    valider_hopitaux.short_description = "✅ Valider les hôpitaux sélectionnés"

    def invalider_hopitaux(self, request, queryset):
        queryset.update(is_verified=False)
        self.message_user(request, f"{queryset.count()} hôpital(aux) mis en attente.")
    invalider_hopitaux.short_description = "⏳ Mettre en attente les hôpitaux sélectionnés"


from .models import Doctor

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'specialization', 'hospital', 'is_verified', 'is_available', 'created_at']
    list_filter = ['is_verified', 'is_available', 'specialization']
    search_fields = ['user__first_name', 'user__last_name', 'license_number']
    ordering = ['-created_at']

    actions = ['valider_medecins']

    def valider_medecins(self, request, queryset):
        queryset.update(is_verified=True)
        self.message_user(request, f"{queryset.count()} médecin(s) validé(s).")
    valider_medecins.short_description = "✅ Valider les médecins sélectionnés"