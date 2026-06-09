import React, { useState, useEffect } from 'react';
import {
  BuildingOfficeIcon, CameraIcon, ClockIcon,
  CheckCircleIcon, EnvelopeIcon, ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// COMPOSANT : Champ de formulaire réutilisable
// ============================================================
const Field = ({ label, value, onChange, disabled, type = 'text', placeholder = '' }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
    />
  </div>
);

// ============================================================
// COMPOSANT PRINCIPAL : HospitalProfile
// ============================================================
const HospitalProfile = () => {
  const [isEditing, setIsEditing]           = useState(false);
  const [isLoading, setIsLoading]           = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [activeTab, setActiveTab]           = useState('basic');
  const [notification, setNotification]     = useState(null);

  // ---- Données du profil (chargées depuis le backend) ----
  const [profile, setProfile] = useState(null);

  // ---- Données du formulaire (modifiables) ----
  const [formData, setFormData] = useState({
    name:              '',
    email:             '',
    phone:             '',
    website:           '',
    address:           '',
    city:              '',
    region:            '',
    hospital_type:     '',
    registration_number: '',
    registration_code:   '',
    is_verified:         false,
  });

  // ---- Données sauvegardées (pour annulation) ----
  const [savedData, setSavedData] = useState(null);

  // ---- Photo ----
  const [avatarPreview, setAvatarPreview] = useState(null);

  // ---- Horaires (locaux, pas encore en backend) ----
  const [horaires, setHoraires] = useState({
    monday:    { open: '08:00', close: '20:00', closed: false },
    tuesday:   { open: '08:00', close: '20:00', closed: false },
    wednesday: { open: '08:00', close: '20:00', closed: false },
    thursday:  { open: '08:00', close: '20:00', closed: false },
    friday:    { open: '08:00', close: '20:00', closed: false },
    saturday:  { open: '09:00', close: '18:00', closed: false },
    sunday:    { open: '09:00', close: '12:00', closed: true  },
  });

  const weekDays = [
    { key: 'monday',    label: 'Lundi' },
    { key: 'tuesday',   label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday',  label: 'Jeudi' },
    { key: 'friday',    label: 'Vendredi' },
    { key: 'saturday',  label: 'Samedi' },
    { key: 'sunday',    label: 'Dimanche' },
  ];

  const hospitalTypes = {
    public:  'Public',
    private: 'Privé',
    clinic:  'Clinique',
    ngo:     'ONG',
  };

  const tabs = [
    { id: 'basic',     label: 'Informations générales', icon: BuildingOfficeIcon },
    { id: 'operating', label: "Horaires d'ouverture",   icon: ClockIcon },
    { id: 'contact',   label: 'Coordonnées',            icon: EnvelopeIcon },
  ];

  // ============================================================
  // CHARGEMENT DU PROFIL
  // ============================================================
  useEffect(() => {
    const load = async () => {
      setLoadingProfile(true);
      try {
        const data = await api.getHospitalProfile();
        setProfile(data);
        const mapped = {
          name:                data.name              || '',
          email:               data.email             || '',
          phone:               data.phone             || '',
          website:             data.website           || '',
          address:             data.address           || '',
          city:                data.city              || '',
          region:              data.region            || '',
          hospital_type:       data.hospital_type     || '',
          registration_number: data.registration_number || '',
          registration_code:   data.registration_code   || '',
          is_verified:         data.is_verified         || false,
        };
        setFormData(mapped);
        setSavedData(mapped);
      } catch (err) {
        showNotif('error', 'Impossible de charger le profil hôpital.');
      } finally {
        setLoadingProfile(false);
      }
    };
    load();
  }, []);

  // ============================================================
  // NOTIFICATION
  // ============================================================
  const showNotif = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  // ============================================================
  // CHAMP UNIQUE
  // ============================================================
  const setField = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  // ============================================================
  // SAUVEGARDER
  // ============================================================
  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.updateHospitalProfile({
        name:    formData.name,
        phone:   formData.phone,
        address: formData.address,
        city:    formData.city,
        region:  formData.region,
        website: formData.website || '',
      });
      setSavedData({ ...formData });
      setIsEditing(false);
      showNotif('success', 'Profil mis à jour avec succès.');
    } catch (err) {
      showNotif('error', err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // ANNULER
  // ============================================================
  const handleCancel = () => {
    if (savedData) setFormData({ ...savedData });
    setIsEditing(false);
  };

  // ============================================================
  // PHOTO
  // ============================================================
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ============================================================
  // HORAIRES
  // ============================================================
  const setHoraire = (day, field, value) =>
    setHoraires(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));

  // ============================================================
  // SKELETON
  // ============================================================
  if (loadingProfile) return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-64"></div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-6">
        <div className="h-24 w-24 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-100 rounded w-32"></div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-100 rounded"></div>)}
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* ====== NOTIFICATION ====== */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 ${
          notification.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success'
            ? <CheckCircleIcon className="h-5 w-5 text-green-600" />
            : <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />}
          {notification.message}
        </div>
      )}

      {/* ====== HEADER ====== */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profil de l'hôpital</h1>
        <p className="text-gray-500 mt-1 text-sm">Gérez les informations de votre établissement</p>
      </div>

      {/* ====== CARD AVATAR ====== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative flex-shrink-0">
            <div className="h-24 w-24 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Logo" className="h-24 w-24 object-cover" />
              ) : (
                <BuildingOfficeIcon className="h-12 w-12 text-white" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 p-1.5 rounded-full cursor-pointer hover:bg-blue-700">
                <CameraIcon className="h-4 w-4 text-white" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{formData.name || 'Hôpital'}</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              {hospitalTypes[formData.hospital_type] || 'Établissement de santé'}
              {formData.city && ` · ${formData.city}`}
              {formData.region && `, ${formData.region}`}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                formData.is_verified
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {formData.is_verified ? '✓ Vérifié' : '⏳ En attente de validation'}
              </span>
              {formData.registration_code && (
                <span className="text-xs text-gray-500">
                  Code : <span className="font-mono font-medium text-gray-700">{formData.registration_code}</span>
                </span>
              )}
            </div>
          </div>

          {/* Boutons action */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Modifier le profil
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {isLoading && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
                  {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ====== ONGLETS ====== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tab bar */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu onglets */}
        <div className="p-6">

          {/* ======== ONGLET : Informations générales ======== */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Nom de l'hôpital"
                  value={formData.name} onChange={v => setField('name', v)}
                  disabled={!isEditing} placeholder="Clinique Saint-Jean" />

                <Field label="Email" type="email"
                  value={formData.email} onChange={v => setField('email', v)}
                  disabled={true}
                  placeholder="contact@hopital.com" />

                <Field label="Téléphone"
                  value={formData.phone} onChange={v => setField('phone', v)}
                  disabled={!isEditing} placeholder="+237 6XX XXX XXX" />

                <Field label="Site web"
                  value={formData.website} onChange={v => setField('website', v)}
                  disabled={!isEditing} placeholder="www.hopital.com" />

                <Field label="Adresse"
                  value={formData.address} onChange={v => setField('address', v)}
                  disabled={!isEditing} placeholder="123 Rue de la Santé" />

                <Field label="Ville"
                  value={formData.city} onChange={v => setField('city', v)}
                  disabled={!isEditing} placeholder="Douala" />

                <Field label="Région"
                  value={formData.region} onChange={v => setField('region', v)}
                  disabled={!isEditing} placeholder="Littoral" />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type d'établissement</label>
                  <select
                    value={formData.hospital_type}
                    onChange={e => setField('hospital_type', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  >
                    <option value="">Sélectionner</option>
                    {Object.entries(hospitalTypes).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Champs lecture seule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Numéro d'enregistrement</label>
                  <p className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono text-gray-700">
                    {formData.registration_number || '—'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Code hôpital (pour les médecins)</label>
                  <p className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm font-mono font-medium text-blue-700">
                    {formData.registration_code || '—'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Partagez ce code aux médecins lors de leur inscription.
                  </p>
                </div>
              </div>

              {!isEditing && (
                <div className="text-xs text-gray-400 pt-2">
                  L'email et le numéro d'enregistrement ne peuvent pas être modifiés.
                </div>
              )}
            </div>
          )}

          {/* ======== ONGLET : Horaires ======== */}
          {activeTab === 'operating' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-4">
                Définissez les horaires d'ouverture de votre établissement.
              </p>
              {weekDays.map(({ key, label }) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 w-24 flex-shrink-0">{label}</span>
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={horaires[key].closed}
                      onChange={e => setHoraire(key, 'closed', e.target.checked)}
                      disabled={!isEditing}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    Fermé
                  </label>
                  {!horaires[key].closed && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={horaires[key].open}
                        onChange={e => setHoraire(key, 'open', e.target.value)}
                        disabled={!isEditing}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      <span className="text-gray-400 text-sm">à</span>
                      <input
                        type="time"
                        value={horaires[key].close}
                        onChange={e => setHoraire(key, 'close', e.target.value)}
                        disabled={!isEditing}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                    </div>
                  )}
                  {horaires[key].closed && (
                    <span className="text-sm text-gray-400 italic">Fermé ce jour</span>
                  )}
                </div>
              ))}
              {!isEditing && (
                <p className="text-xs text-gray-400 pt-2">
                  Cliquez sur "Modifier le profil" pour changer les horaires.
                </p>
              )}
            </div>
          )}

          {/* ======== ONGLET : Coordonnées ======== */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Email principal"
                  value={formData.email} onChange={v => setField('email', v)}
                  disabled={true} type="email" />

                <Field label="Téléphone principal"
                  value={formData.phone} onChange={v => setField('phone', v)}
                  disabled={!isEditing} />

                <Field label="Site web"
                  value={formData.website} onChange={v => setField('website', v)}
                  disabled={!isEditing} placeholder="https://www.hopital.com" />

                <Field label="Adresse complète"
                  value={formData.address} onChange={v => setField('address', v)}
                  disabled={!isEditing} />

                <Field label="Ville"
                  value={formData.city} onChange={v => setField('city', v)}
                  disabled={!isEditing} />

                <Field label="Région"
                  value={formData.region} onChange={v => setField('region', v)}
                  disabled={!isEditing} />
              </div>

              {!isEditing && (
                <p className="text-xs text-gray-400">
                  Cliquez sur "Modifier le profil" pour mettre à jour vos coordonnées.
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default HospitalProfile;