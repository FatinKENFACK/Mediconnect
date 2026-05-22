import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BuildingOfficeIcon, CameraIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const HospitalProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    basic: {
      name: 'Clinique Hôpital Saint-Jean',
      email: 'contact@clinique-saint-jean.com',
      phone: '+221 33 825 45 67',
      website: 'www.clinique-saint-jean.com',
      address: '123 Avenue de la Santé, Dakar, Sénégal',
      description: 'La Clinique Hôpital Saint-Jean est un établissement de santé moderne offrant des soins médicaux de haute qualité avec une équipe de professionnels expérimentés.',
      foundedYear: '1998',
      capacity: 150,
      emergency: true,
      emergencyPhone: '+221 33 825 45 68'
    },
    services: {
      primaryServices: [
        'Cardiologie',
        'Pédiatrie',
        'Radiologie',
        'Gynécologie',
        'Chirurgie générale',
        'Urgences 24/7'
      ],
      specializedServices: [
        'Chirurgie cardiaque',
        'Neurologie',
        'Oncologie',
        'Médecine interne',
        'Réanimation'
      ],
      facilities: [
        'Bloc opératoire moderne',
        'Service d\'imagerie médicale',
        'Laboratoire d\'analyses',
        'Pharmacie hospitalière',
        'Service d\'urgence',
        'Hébergement patients'
      ]
    },
    operating: {
      monday: { open: '08:00', close: '20:00', closed: false },
      tuesday: { open: '08:00', close: '20:00', closed: false },
      wednesday: { open: '08:00', close: '20:00', closed: false },
      thursday: { open: '08:00', close: '20:00', closed: false },
      friday: { open: '08:00', close: '20:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '12:00', closed: false }
    },
    contact: {
      administrativeEmail: 'admin@clinique-saint-jean.com',
      medicalEmail: 'medical@clinique-saint-jean.com',
      appointmentPhone: '+221 33 825 45 69',
      informationPhone: '+221 33 825 45 67',
      fax: '+221 33 825 45 70',
      socialMedia: {
        facebook: 'facebook.com/cliniquesaintjean',
        twitter: '@cliniquesaintjean',
        linkedin: 'linkedin.com/company/clinique-saint-jean'
      }
    }
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      operating: {
        ...prev.operating,
        [day]: {
          ...prev.operating[day],
          [field]: value
        }
      }
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceToggle = (service, category) => {
    setFormData(prev => {
      const services = [...prev.services[category]];
      const index = services.indexOf(service);
      if (index > -1) {
        services.splice(index, 1);
      } else {
        services.push(service);
      }
      return {
        ...prev,
        services: {
          ...prev.services,
          [category]: services
        }
      };
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.updateHospitalProfile({
        name: formData.basic.name,
        phone: formData.basic.phone,
        address: formData.basic.address,
        website: formData.basic.website || '',
      });
      setIsEditing(false);
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 3000);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Réinitialiser les données si nécessaire
  };

  const tabs = [
    { id: 'basic', label: 'Informations générales', icon: BuildingOfficeIcon },
    { id: 'services', label: 'Services & Installations', icon: CheckCircleIcon },
    { id: 'operating', label: 'Horaires d\'ouverture', icon: ClockIcon },
    { id: 'contact', label: 'Coordonnées', icon: EnvelopeIcon }
  ];

  const weekDays = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  const allServices = {
    primaryServices: [
      'Cardiologie', 'Pédiatrie', 'Radiologie', 'Gynécologie',
      'Chirurgie générale', 'Urgences 24/7', 'Médecine interne',
      'Dermatologie', 'Ophtalmologie', 'ORL'
    ],
    specializedServices: [
      'Chirurgie cardiaque', 'Neurologie', 'Oncologie', 'Réanimation',
      'Néphrologie', 'Endocrinologie', 'Rhumatologie', 'Gastro-entérologie'
    ],
    facilities: [
      'Bloc opératoire moderne', 'Service d\'imagerie médicale', 'Laboratoire d\'analyses',
      'Pharmacie hospitalière', 'Service d\'urgence', 'Hébergement patients',
      'Centre de rééducation', 'Unité de soins palliatifs'
    ]
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getHospitalProfile();
        setFormData(prev => ({
          ...prev,
          basic: {
            ...prev.basic,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            website: data.website || '',
            address: data.address || '',
          }
        }));
      } catch (err) {
        console.error('Erreur chargement profil hôpital:', err);
      }
    };
    loadProfile();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profil de l'hôpital</h1>
          <p className="text-gray-600 mt-2">Gérez les informations de votre établissement</p>
        </div>

        {/* Avatar Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="h-24 w-24 bg-blue-500 rounded-full flex items-center justify-center">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="h-24 w-24 rounded-full object-cover" />
                ) : (
                  <BuildingOfficeIcon className="h-12 w-12 text-white" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
                  <CameraIcon className="h-4 w-4 text-white" />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{formData.basic.name}</h2>
              <p className="text-gray-600">Établissement de santé privé</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Actif
                </span>
                <span className="text-sm text-gray-500">Capacité: {formData.basic.capacity} lits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mb-6">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Modifier le profil
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </span>
                ) : (
                  'Enregistrer'
                )}
              </button>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Basic Information */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'hôpital</label>
                    <input
                      type="text"
                      value={formData.basic.name}
                      onChange={(e) => handleInputChange('basic', 'name', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.basic.email}
                      onChange={(e) => handleInputChange('basic', 'email', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.basic.phone}
                      onChange={(e) => handleInputChange('basic', 'phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                    <input
                      type="text"
                      value={formData.basic.website}
                      onChange={(e) => handleInputChange('basic', 'website', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                    <input
                      type="text"
                      value={formData.basic.address}
                      onChange={(e) => handleInputChange('basic', 'address', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Année de fondation</label>
                    <input
                      type="text"
                      value={formData.basic.foundedYear}
                      onChange={(e) => handleInputChange('basic', 'foundedYear', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacité (lits)</label>
                    <input
                      type="number"
                      value={formData.basic.capacity}
                      onChange={(e) => handleInputChange('basic', 'capacity', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone d'urgence</label>
                    <input
                      type="tel"
                      value={formData.basic.emergencyPhone}
                      onChange={(e) => handleInputChange('basic', 'emergencyPhone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.basic.description}
                    onChange={(e) => handleInputChange('basic', 'description', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.basic.emergency}
                    onChange={(e) => handleInputChange('basic', 'emergency', e.target.checked)}
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  />
                  <label className="ml-2 text-sm text-gray-700">Service d'urgence disponible 24/7</label>
                </div>
              </div>
            )}

            {/* Services */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Services principaux</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allServices.primaryServices.map((service) => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.services.primaryServices.includes(service)}
                          onChange={() => handleServiceToggle(service, 'primaryServices')}
                          disabled={!isEditing}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Services spécialisés</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allServices.specializedServices.map((service) => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.services.specializedServices.includes(service)}
                          onChange={() => handleServiceToggle(service, 'specializedServices')}
                          disabled={!isEditing}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Installations</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {allServices.facilities.map((facility) => (
                      <label key={facility} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.services.facilities.includes(facility)}
                          onChange={() => handleServiceToggle(facility, 'facilities')}
                          disabled={!isEditing}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Operating Hours */}
            {activeTab === 'operating' && (
              <div className="space-y-4">
                {weekDays.map((day) => (
                  <div key={day.key} className="flex items-center space-x-4">
                    <div className="w-24">
                      <label className="block text-sm font-medium text-gray-700">{day.label}</label>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.operating[day.key].closed}
                        onChange={(e) => handleOperatingHoursChange(day.key, 'closed', e.target.checked)}
                        disabled={!isEditing}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <span className="ml-2 text-sm text-gray-700">Fermé</span>
                    </label>
                    {!formData.operating[day.key].closed && (
                      <>
                        <input
                          type="time"
                          value={formData.operating[day.key].open}
                          onChange={(e) => handleOperatingHoursChange(day.key, 'open', e.target.value)}
                          disabled={!isEditing}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                        <span className="text-gray-500">à</span>
                        <input
                          type="time"
                          value={formData.operating[day.key].close}
                          onChange={(e) => handleOperatingHoursChange(day.key, 'close', e.target.value)}
                          disabled={!isEditing}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Contact */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email administratif</label>
                    <input
                      type="email"
                      value={formData.contact.administrativeEmail}
                      onChange={(e) => handleInputChange('contact', 'administrativeEmail', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email médical</label>
                    <input
                      type="email"
                      value={formData.contact.medicalEmail}
                      onChange={(e) => handleInputChange('contact', 'medicalEmail', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone rendez-vous</label>
                    <input
                      type="tel"
                      value={formData.contact.appointmentPhone}
                      onChange={(e) => handleInputChange('contact', 'appointmentPhone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone information</label>
                    <input
                      type="tel"
                      value={formData.contact.informationPhone}
                      onChange={(e) => handleInputChange('contact', 'informationPhone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fax</label>
                    <input
                      type="tel"
                      value={formData.contact.fax}
                      onChange={(e) => handleInputChange('contact', 'fax', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Réseaux sociaux</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                      <input
                        type="text"
                        value={formData.contact.socialMedia.facebook}
                        onChange={(e) => handleInputChange('contact', 'socialMedia', { ...formData.contact.socialMedia, facebook: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                      <input
                        type="text"
                        value={formData.contact.socialMedia.twitter}
                        onChange={(e) => handleInputChange('contact', 'socialMedia', { ...formData.contact.socialMedia, twitter: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <input
                        type="text"
                        value={formData.contact.socialMedia.linkedin}
                        onChange={(e) => handleInputChange('contact', 'socialMedia', { ...formData.contact.socialMedia, linkedin: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center">
              <CheckCircleIcon className="h-12 w-12 text-green-500" />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Profil mis à jour</h3>
                <p className="text-sm text-gray-600 mt-1">Les modifications ont été enregistrées avec succès.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalProfile;
