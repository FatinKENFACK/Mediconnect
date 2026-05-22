import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  UserCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  PencilIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  SaveIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
  StarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function DoctorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [avatar, setAvatar] = useState('/api/placeholder/150/150');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: 'Martin',
      lastName: 'Tchinda',
      email: 'martin.tchinda@mediconnet.cm',
      phone: '+237 699 123 456',
      address: 'Avenue Charles Atangana, Yaoundé',
      city: 'Yaoundé',
      country: 'Cameroun',
      postalCode: 'BP 1234',
      dateOfBirth: '1975-03-15',
      gender: 'Homme',
      bio: 'Médecin généraliste avec 12 ans d\'expérience, passionné par la médecine préventive et l\'accompagnement des patients.',
      languages: ['Français', 'Anglais', 'Bassa', 'Ewondo']
    },
    professional: {
      speciality: 'Médecine générale',
      subSpecialities: ['Médecine interne', 'Cardiologie', 'Diabétologie'],
      experience: '12 ans',
      registrationNumber: 'CM-12345-67890',
      education: [
        {
          id: 1,
          degree: 'Doctorat en Médecine',
          institution: 'Université de Yaoundé I',
          year: '2012',
          description: 'Thèse sur les maladies cardiovasculaires en Afrique subsaharienne'
        },
        {
          id: 2,
          degree: 'Spécialisation en Médecine Interne',
          institution: 'Hôpital Central Yaoundé',
          year: '2015',
          description: 'Spécialisation en médecine interne avec focus sur les maladies chroniques'
        }
      ],
      certifications: [
        {
          id: 1,
          name: 'Certification ANSM',
          issuer: 'Agence Nationale de Sécurité du Médicament',
          year: '2018',
          validUntil: '2024'
        },
        {
          id: 2,
          name: 'ACLS Certified',
          issuer: 'American Heart Association',
          year: '2019',
          validUntil: '2024'
        },
        {
          id: 3,
          name: 'BLS Certified',
          issuer: 'American Heart Association',
          year: '2019',
          validUntil: '2024'
        }
      ],
      hospitalAffiliations: [
        {
          id: 1,
          name: 'Hôpital Central Yaoundé',
          role: 'Médecin généraliste',
          startDate: '2015',
          current: true
        },
        {
          id: 2,
          name: 'Clinique des Basseurs Douala',
          role: 'Consultant',
          startDate: '2018',
          current: true
        }
      ]
    },
    practice: {
      consultationTypes: ['Présentiel', 'Visioconférence'],
      consultationFees: {
        inPerson: '5000',
        video: '6000',
        followUp: '3000',
        emergency: '15000',
        homeVisit: '20000'
      },
      availability: {
        monday: { morning: true, afternoon: true, evening: false },
        tuesday: { morning: true, afternoon: true, evening: false },
        wednesday: { morning: true, afternoon: true, evening: false },
        thursday: { morning: true, afternoon: true, evening: false },
        friday: { morning: true, afternoon: true, evening: false },
        saturday: { morning: false, afternoon: false, evening: false },
        sunday: { morning: false, afternoon: false, evening: false }
      },
      consultationDuration: '30',
      advanceBooking: '7',
      paymentMethods: ['Espèces', 'Mobile Money', 'Carte bancaire', 'Assurance'],
      insuranceAccepted: [
        { name: 'CNPS', coverage: 'Complete' },
        { name: 'Mutuelle Santé', coverage: 'Partielle' },
        { name: 'Wazih Insurance', coverage: 'Complete' }
      ]
    },
    stats: {
      totalConsultations: 3456,
      totalPatients: 1890,
      averageRating: 4.8,
      totalReviews: 342,
      responseTime: '2 heures',
      yearsExperience: 12
    }
  });

  const tabs = [
    { id: 'personal', name: 'Informations personnelles', icon: UserCircleIcon },
    { id: 'professional', name: 'Informations professionnelles', icon: BriefcaseIcon },
    { id: 'practice', name: 'Pratique médicale', icon: ShieldCheckIcon },
    { id: 'stats', name: 'Statistiques', icon: ChartBarIcon }
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

  const handleAddEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: '',
      institution: '',
      year: '',
      description: ''
    };
    setFormData(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        education: [...prev.professional.education, newEducation]
      }
    }));
  };

  const handleRemoveEducation = (id) => {
    setFormData(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        education: prev.professional.education.filter(edu => edu.id !== id)
      }
    }));
  };

  const handleAddCertification = () => {
    const newCertification = {
      id: Date.now(),
      name: '',
      issuer: '',
      year: '',
      validUntil: ''
    };
    setFormData(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        certifications: [...prev.professional.certifications, newCertification]
      }
    }));
  };

  const handleRemoveCertification = (id) => {
    setFormData(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        certifications: prev.professional.certifications.filter(cert => cert.id !== id)
      }
    }));
  };

  const handleAddAffiliation = () => {
    const newAffiliation = {
      id: Date.now(),
      name: '',
      role: '',
      startDate: '',
      current: false
    };
    setFormData(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        hospitalAffiliations: [...prev.professional.hospitalAffiliations, newAffiliation]
      }
    }));
  };

  const handleRemoveAffiliation = (id) => {
    setFormData(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        hospitalAffiliations: prev.professional.hospitalAffiliations.filter(aff => aff.id !== id)
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    await api.updateDoctorProfile({
      specialization: formData.professional.speciality,
      experience_years: parseInt(formData.professional.experience) || 0,
      bio: formData.personalInfo.bio,
      languages: formData.personalInfo.languages.join(','),
      fee_in_person: parseInt(formData.practice.consultationFees.inPerson) || 0,
      fee_video: parseInt(formData.practice.consultationFees.video) || 0,
      fee_followup: parseInt(formData.practice.consultationFees.followUp) || 0,
    });

    // Mise à jour infos personnelles via updateProfile
    await api.updateProfile({
      first_name: formData.personalInfo.firstName,
      last_name: formData.personalInfo.lastName,
      phone: formData.personalInfo.phone,
      address: formData.personalInfo.address,
    });

    setSaveMessage('Profil mis à jour avec succès !');
    setIsEditing(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Réinitialiser les données (en pratique, on pourrait charger les données originales)
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvailabilityChange = (day, period, value) => {
    setFormData(prev => ({
      ...prev,
      practice: {
        ...prev.practice,
        availability: {
          ...prev.practice.availability,
          [day]: {
            ...prev.practice.availability[day],
            [period]: value
          }
        }
      }
    }));
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getDoctorProfile();
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            languages: data.languages ? data.languages.split(',') : [],
          },
          professional: {
            ...prev.professional,
            speciality: data.specialization || '',
            experience: String(data.experience_years || ''),
            registrationNumber: data.license_number || '',
          },
          practice: {
            ...prev.practice,
            consultationFees: {
              ...prev.practice.consultationFees,
              inPerson: String(data.fee_in_person || '5000'),
              video: String(data.fee_video || '6000'),
              followUp: String(data.fee_followup || '3000'),
            }
          },
        }));
        if (data.profile_picture) {
          setAvatar(data.profile_picture.startsWith('http')
            ? data.profile_picture
            : `http://localhost:8000${data.profile_picture}`);
        }
      } catch (err) {
        console.error('Erreur chargement profil médecin:', err);
      }
    };
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover border-4 border-blue-100"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <CameraIcon className="h-4 w-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dr. {formData.personalInfo.firstName} {formData.personalInfo.lastName}
                </h1>
                <p className="text-gray-600">{formData.professional.speciality}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Profil vérifié</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {saveMessage && (
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  {saveMessage}
                </div>
              )}

              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
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
                        Enregistrer
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Modifier
                </button>
              )}
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
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center">
                    <tab.icon className={`h-5 w-5 mr-2 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <input
                      type="text"
                      value={formData.personalInfo.firstName}
                      onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      value={formData.personalInfo.lastName}
                      onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.personalInfo.email}
                      onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.personalInfo.phone}
                      onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={formData.personalInfo.address}
                    onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Biographie</label>
                  <textarea
                    value={formData.personalInfo.bio}
                    onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            )}

            {/* Professional Information Tab */}
            {activeTab === 'professional' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations professionnelles</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité</label>
                    <input
                      type="text"
                      value={formData.professional.speciality}
                      onChange={(e) => handleInputChange('professional', 'speciality', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Années d'expérience</label>
                    <input
                      type="text"
                      value={formData.professional.experience}
                      onChange={(e) => handleInputChange('professional', 'experience', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sous-spécialités</label>
                  <div className="flex flex-wrap gap-2">
                    {(formData.professional.subSpecialities || []).map((speciality, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {speciality}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Langues parlées</label>
                  <div className="flex flex-wrap gap-2">
                    {(formData.personalInfo.languages || []).map((language, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Éducation</label>
                  <div className="space-y-3">
                    {formData.professional.education.map((edu, index) => (
                      <div key={edu.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{edu.degree}</p>
                            <p className="text-gray-600">{edu.institution}</p>
                            <p className="text-sm text-gray-500">{edu.year}</p>
                          </div>
                          <AcademicCapIcon className="h-5 w-5 text-blue-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Practice Information Tab */}
            {activeTab === 'practice' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pratique médicale</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Types de consultation</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.practice.consultationTypes.map((type, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tarifs (XAF)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Consultation présentiel</span>
                        <span className="font-medium">{formData.practice.consultationFees.inPerson}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Visioconférence</span>
                        <span className="font-medium">{formData.practice.consultationFees.video}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Suivi</span>
                        <span className="font-medium">{formData.practice.consultationFees.followUp}</span>
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Urgence</span>
                        <span className="font-medium text-red-600">{formData.practice.consultationFees.emergency}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Disponibilités</label>
                  <div className="space-y-2">
                    {Object.entries(formData.practice.availability).map(([day, times]) => {
                      const dayNames = {
                        monday: 'Lundi',
                        tuesday: 'Mardi',
                        wednesday: 'Mercredi',
                        thursday: 'Jeudi',
                        friday: 'Vendredi',
                        saturday: 'Samedi',
                        sunday: 'Dimanche'
                      };

                      return (
                        <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-700 w-20">{dayNames[day]}</span>
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={times.morning}
                                onChange={(e) => handleAvailabilityChange(day, 'morning', e.target.checked)}
                                disabled={!isEditing}
                                className="mr-2"
                              />
                              <span className="text-sm">Matin</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={times.afternoon}
                                onChange={(e) => handleAvailabilityChange(day, 'afternoon', e.target.checked)}
                                disabled={!isEditing}
                                className="mr-2"
                              />
                              <span className="text-sm">Après-midi</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={times.evening}
                                onChange={(e) => handleAvailabilityChange(day, 'evening', e.target.checked)}
                                disabled={!isEditing}
                                className="mr-2"
                              />
                              <span className="text-sm">Soir</span>
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques de performance</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <UserCircleIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{formData.stats.totalPatients.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Patients totaux</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-xl">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{formData.stats.totalConsultations.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Consultations</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-xl">
                    <div className="flex items-center">
                      <div className="p-3 bg-yellow-100 rounded-lg">
                        <StarIcon className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{formData.stats.averageRating}</p>
                        <p className="text-sm text-gray-600">Note moyenne ({formData.stats.totalReviews} avis)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-6 rounded-xl">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <ClockIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">{formData.stats.responseTime}</p>
                        <p className="text-sm text-gray-600">Temps de réponse moyen</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-6 rounded-xl">
                    <div className="flex items-center">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">98%</p>
                        <p className="text-sm text-gray-600">Taux de satisfaction</p>
                      </div>
                    </div>
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
