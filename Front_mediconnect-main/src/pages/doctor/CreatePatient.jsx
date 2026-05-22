import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlusIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  IdentificationIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function CreatePatient() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      gender: '',
      nationality: 'Camerounaise',
      maritalStatus: '',
      profession: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      region: '',
      postalCode: ''
    },
    medicalInfo: {
      bloodType: '',
      allergies: '',
      chronicDiseases: '',
      medications: '',
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
        email: ''
      },
      insurance: {
        hasInsurance: false,
        provider: '',
        policyNumber: '',
        expiryDate: ''
      }
    },
    preferences: {
      preferredLanguage: 'Français',
      communicationMethod: 'email',
      appointmentReminders: true,
      smsReminders: false,
      emailReminders: true
    }
  });

  const tabs = [
    { id: 'personal', name: 'Informations personnelles', icon: UserCircleIcon },
    { id: 'medical', name: 'Informations médicales', icon: IdentificationIcon },
    { id: 'preferences', name: 'Préférences', icon: CalendarIcon }
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    // Validate personal info
    if (!formData.personalInfo.firstName.trim()) errors.push('Le prénom est requis');
    if (!formData.personalInfo.lastName.trim()) errors.push('Le nom est requis');
    if (!formData.personalInfo.dateOfBirth) errors.push('La date de naissance est requise');
    if (!formData.personalInfo.gender) errors.push('Le genre est requis');
    if (!formData.personalInfo.email.trim()) errors.push('L\'email est requis');
    if (!formData.personalInfo.phone.trim()) errors.push('Le téléphone est requis');
    if (!formData.personalInfo.address.trim()) errors.push('L\'adresse est requise');
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.personalInfo.email)) {
      errors.push('L\'email n\'est pas valide');
    }
    
    // Validate phone format (Cameroon)
    const phoneRegex = /^\+237[236]\d{7}$/;
    if (!phoneRegex.test(formData.personalInfo.phone)) {
      errors.push('Le téléphone doit être au format +237 XXX XXX XXX');
    }
    
    return errors;
  };

  const handleSave = async () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      setSaveMessage(errors[0]);
      setTimeout(() => setSaveMessage(''), 5000);
      return;
    }
    
    setIsSaving(true);
    setSaveMessage('');
    
    // Simuler la sauvegarde
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Patient créé avec succès!');
      
      // Rediriger vers la liste des patients après 2 secondes
      setTimeout(() => {
        navigate('/medecin/dossiers');
      }, 2000);
    }, 2000);
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/medecin/dossiers')}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Créer un nouveau patient</h1>
                <p className="text-gray-600 mt-1">Ajoutez un nouveau patient à votre dossier</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {saveMessage && (
                <div className={`flex items-center px-3 py-2 rounded-lg ${
                  saveMessage.includes('succès') 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-red-600 bg-red-50'
                }`}>
                  {saveMessage.includes('succès') ? (
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                  )}
                  {saveMessage}
                </div>
              )}
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Créer le patient
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <tab.icon className={`h-5 w-5 mr-2 ${
                      activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    {tab.name}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Personal Information Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <input
                      type="text"
                      value={formData.personalInfo.firstName}
                      onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez le prénom"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input
                      type="text"
                      value={formData.personalInfo.lastName}
                      onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez le nom"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance *</label>
                    <input
                      type="date"
                      value={formData.personalInfo.dateOfBirth}
                      onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {formData.personalInfo.dateOfBirth && (
                      <p className="text-xs text-gray-500 mt-1">
                        Âge: {calculateAge(formData.personalInfo.dateOfBirth)} ans
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lieu de naissance</label>
                    <input
                      type="text"
                      value={formData.personalInfo.placeOfBirth}
                      onChange={(e) => handleInputChange('personalInfo', 'placeOfBirth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez le lieu de naissance"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Genre *</label>
                    <select
                      value={formData.personalInfo.gender}
                      onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nationalité</label>
                    <input
                      type="text"
                      value={formData.personalInfo.nationality}
                      onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pièce d'identité</label>
                    <input
                      type="text"
                      value={formData.personalInfo.identificationCard}
                      onChange={(e) => handleInputChange('personalInfo', 'identificationCard', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Situation matrimoniale</label>
                    <select
                      value={formData.personalInfo.maritalStatus}
                      onChange={(e) => handleInputChange('personalInfo', 'maritalStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="single">Célibataire</option>
                      <option value="married">Marié(e)</option>
                      <option value="divorced">Divorcé(e)</option>
                      <option value="widowed">Veuf(ve)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profession</label>
                    <input
                      type="text"
                      value={formData.personalInfo.profession}
                      onChange={(e) => handleInputChange('personalInfo', 'profession', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez la profession"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="exemple@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      value={formData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+237 XXX XXX XXX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                    <input
                      type="text"
                      value={formData.personalInfo.address}
                      onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez l'adresse complète"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                    <input
                      type="text"
                      value={formData.personalInfo.city}
                      onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez la ville"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Région</label>
                    <select
                      value={formData.personalInfo.region}
                      onChange={(e) => handleInputChange('personalInfo', 'region', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="adamawa">Adamaoua</option>
                      <option value="centre">Centre</option>
                      <option value="est">Est</option>
                      <option value="extreme-nord">Extrême-Nord</option>
                      <option value="littoral">Littoral</option>
                      <option value="nord">Nord</option>
                      <option value="nord-ouest">Nord-Ouest</option>
                      <option value="ouest">Ouest</option>
                      <option value="sud">Sud</option>
                      <option value="sud-ouest">Sud-Ouest</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                    <input
                      type="text"
                      value={formData.personalInfo.postalCode}
                      onChange={(e) => handleInputChange('personalInfo', 'postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Entrez le code postal"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Medical Information Tab */}
            {activeTab === 'medical' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations médicales</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Groupe sanguin</label>
                    <select
                      value={formData.medicalInfo.bloodType}
                      onChange={(e) => handleInputChange('medicalInfo', 'bloodType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                    <textarea
                      value={formData.medicalInfo.allergies}
                      onChange={(e) => handleInputChange('medicalInfo', 'allergies', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Listez les allergies connues..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maladies chroniques</label>
                    <textarea
                      value={formData.medicalInfo.chronicDiseases}
                      onChange={(e) => handleInputChange('medicalInfo', 'chronicDiseases', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Listez les maladies chroniques..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Médicaments actuels</label>
                    <textarea
                      value={formData.medicalInfo.medications}
                      onChange={(e) => handleInputChange('medicalInfo', 'medications', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Listez les médicaments actuels..."
                    />
                  </div>
                </div>
                
                {/* Emergency Contact */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Contact d'urgence</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                      <input
                        type="text"
                        value={formData.medicalInfo.emergencyContact.name}
                        onChange={(e) => handleNestedInputChange('medicalInfo', 'emergencyContact', 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nom du contact d'urgence"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
                      <input
                        type="text"
                        value={formData.medicalInfo.emergencyContact.relationship}
                        onChange={(e) => handleNestedInputChange('medicalInfo', 'emergencyContact', 'relationship', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Conjoint, Parent, Frère/Soeur..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={formData.medicalInfo.emergencyContact.phone}
                        onChange={(e) => handleNestedInputChange('medicalInfo', 'emergencyContact', 'phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+237 XXX XXX XXX"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.medicalInfo.emergencyContact.email}
                        onChange={(e) => handleNestedInputChange('medicalInfo', 'emergencyContact', 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="email@exemple.com"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Insurance */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Assurance maladie</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="hasInsurance"
                        checked={formData.medicalInfo.insurance.hasInsurance}
                        onChange={(e) => handleNestedInputChange('medicalInfo', 'insurance', 'hasInsurance', e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="hasInsurance" className="text-sm font-medium text-gray-700">
                        Le patient a une assurance maladie
                      </label>
                    </div>
                    
                    {formData.medicalInfo.insurance.hasInsurance && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Assureur</label>
                          <input
                            type="text"
                            value={formData.medicalInfo.insurance.provider}
                            onChange={(e) => handleNestedInputChange('medicalInfo', 'insurance', 'provider', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nom de l'assureur"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de police</label>
                          <input
                            type="text"
                            value={formData.medicalInfo.insurance.policyNumber}
                            onChange={(e) => handleNestedInputChange('medicalInfo', 'insurance', 'policyNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Numéro de police"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration</label>
                          <input
                            type="date"
                            value={formData.medicalInfo.insurance.expiryDate}
                            onChange={(e) => handleNestedInputChange('medicalInfo', 'insurance', 'expiryDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Préférences de communication</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Langue préférée</label>
                    <select
                      value={formData.preferences.preferredLanguage}
                      onChange={(e) => handleInputChange('preferences', 'preferredLanguage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Français">Français</option>
                      <option value="Anglais">Anglais</option>
                      <option value="Bassa">Bassa</option>
                      <option value="Ewondo">Ewondo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Méthode de communication préférée</label>
                    <select
                      value={formData.preferences.communicationMethod}
                      onChange={(e) => handleInputChange('preferences', 'communicationMethod', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Téléphone</option>
                      <option value="sms">SMS</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="appointmentReminders"
                      checked={formData.preferences.appointmentReminders}
                      onChange={(e) => handleInputChange('preferences', 'appointmentReminders', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="appointmentReminders" className="text-sm font-medium text-gray-700">
                      Activer les rappels de rendez-vous
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="smsReminders"
                      checked={formData.preferences.smsReminders}
                      onChange={(e) => handleInputChange('preferences', 'smsReminders', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="smsReminders" className="text-sm font-medium text-gray-700">
                      Recevoir les rappels par SMS
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="emailReminders"
                      checked={formData.preferences.emailReminders}
                      onChange={(e) => handleInputChange('preferences', 'emailReminders', e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="emailReminders" className="text-sm font-medium text-gray-700">
                      Recevoir les rappels par email
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
