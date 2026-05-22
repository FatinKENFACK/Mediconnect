from rest_framework import serializers
from .models import MedicalHistory, Allergy, Medication, MedicalDocument


# ============================================================
# SERIALIZER : Antécédent médical
# Convertit les données Python en JSON et vice versa
# ============================================================
class MedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalHistory
        fields = [
            'id',          
            'condition',    
            'date',         
            'status',       
            'notes',        
            'created_at'    
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================
# SERIALIZER : Allergie
# ============================================================
class AllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergy
        fields = [
            'id',
            'name',         
            'type',         
            'severity',     
            'notes',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================
# SERIALIZER : Médicament
# ============================================================
class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = [
            'id',
            'name',         
            'dosage',       
            'frequency',    
            'start_date',   
            'end_date',    
            'prescriber',   
            'notes',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================================
# SERIALIZER : Document médical
# Gère aussi l'upload de fichiers
# ============================================================
class MedicalDocumentSerializer(serializers.ModelSerializer):

    # Ce champ calcule automatiquement l'URL complète du fichier
    # Ex: http://localhost:8000/media/medical_docs/mon_fichier.pdf
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = MedicalDocument
        fields = [
            'id',
            'name',         
            'type',         
            'file',        
            'file_url',     
            'size',        
            'created_at'
        ]
        read_only_fields = ['id', 'file_url', 'created_at']
        # 'file' est uniquement pour l'upload, on ne le retourne pas dans la réponse
        extra_kwargs = {
            'file': {'write_only': True}
        }

    # Méthode qui construit l'URL complète du fichier
    # 'obj' est l'instance du document médical
    def get_file_url(self, obj):
        # Vérifie que le fichier existe avant de construire l'URL
        if obj.file:
            # request est passé dans le contexte du serializer
            # Il permet de construire l'URL absolue (avec http://localhost:8000)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None