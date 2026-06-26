import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  UserCircleIcon, ShieldCheckIcon, PencilIcon, CameraIcon,
  CheckCircleIcon, ExclamationTriangleIcon, BriefcaseIcon,
  ClockIcon, StarIcon, ChartBarIcon, XMarkIcon, PlusIcon,
} from '@heroicons/react/24/outline';

// ============================================================
// LANGUES DISPONIBLES
// ============================================================
const AVAILABLE_LANGUAGES = ['Français', 'Anglais', 'Bassa', 'Ewondo', 'Douala', 'Bamiléké', 'Arabe'];

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export default function DoctorProfile() {
  const [isEditing, setIsEditing]   = useState(false);
  const [activeTab, setActiveTab]   = useState('personal');
  const [avatar, setAvatar]         = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [isSaving, setIsSaving]     = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError]           = useState(null);

  // ---- Données réelles du profil ----
  const [profile, setProfile] = useState(null);

  // ---- Formulaire modifiable ----
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '',
    bio: '', languages: [],
    specialization: '', experienceYears: '', licenseNumber: '',
    feeInPerson: '', feeVideo: '', feeFollowup: '',
    isVerified: false, isAvailable: false,
  });
  const [savedData, setSavedData] = useState(null);

  // ---- Stats réelles (RDV) ----
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const tabs = [
    { id: 'personal',     name: 'Informations personnelles', icon: UserCircleIcon },
    { id: 'professional', name: 'Informations professionnelles', icon: BriefcaseIcon },
    { id: 'practice',     name: 'Tarifs & disponibilité', icon: ShieldCheckIcon },
    { id: 'stats',        name: 'Statistiques', icon: ChartBarIcon },
  ];

  // ============================================================
  // CHARGEMENT
  // ============================================================
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getDoctorProfile();
        setProfile(data);

        const mapped = {
          firstName:       data.first_name || '',
          lastName:        data.last_name  || '',
          email:           data.email      || '',
          phone:           data.phone      || '',
          address:         data.address    || '',
          bio:             data.bio        || '',
          languages:       data.languages ? data.languages.split(',').map(l => l.trim()).filter(Boolean) : [],
          specialization:  data.specialization   || '',
          experienceYears: String(data.experience_years || ''),
          licenseNumber:   data.license_number   || '',
          feeInPerson:     String(data.fee_in_person  || '5000'),
          feeVideo:        String(data.fee_video      || '6000'),
          feeFollowup:     String(data.fee_followup   || '3000'),
          isVerified:      data.is_verified  || false,
          isAvailable:     data.is_available || false,
        };
        setFormData(mapped);
        setSavedData(mapped);

        if (data.profile_picture) {
          setAvatar(
            data.profile_picture.startsWith('http')
              ? data.profile_picture
              : `http://localhost:8000${data.profile_picture}`
          );
        }
      } catch (err) {
        setError('Impossible de charger le profil.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // ---- Stats réelles depuis les RDV ----
  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true);
      try {
        const data = await api.getDoctorAppointmentsToday();
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, []);

  // ============================================================
  // HELPERS
  // ============================================================
  const setField = (field, value) => setFormData(p => ({ ...p, [field]: value }));

  const toggleLanguage = (lang) => {
    setFormData(p => ({
      ...p,
      languages: p.languages.includes(lang)
        ? p.languages.filter(l => l !== lang)
        : [...p.languages, lang],
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  // ============================================================
  // SAUVEGARDE
  // ============================================================
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      // 1. Mise à jour profil médecin (specialization, fees, bio...)
      await api.updateDoctorProfile({
        specialization:   formData.specialization,
        experience_years: parseInt(formData.experienceYears) || 0,
        bio:               formData.bio,
        languages:         formData.languages.join(','),
        fee_in_person:     parseInt(formData.feeInPerson) || 0,
        fee_video:         parseInt(formData.feeVideo) || 0,
        fee_followup:      parseInt(formData.feeFollowup) || 0,
      });

      // 2. Mise à jour infos utilisateur (nom, téléphone, adresse, photo)
      const profileUpdate = {
        first_name: formData.firstName,
        last_name:  formData.lastName,
        phone:      formData.phone,
        address:    formData.address,
      };
      if (avatarFile) {
        profileUpdate.profile_picture = avatarFile;
      }
      await api.updateProfile(profileUpdate);

      setSavedData({ ...formData });
      setSaveMessage('Profil mis à jour avec succès !');
      setIsEditing(false);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (savedData) setFormData({ ...savedData });
    setIsEditing(false);
  };

  // ============================================================
  // SKELETON
  // ============================================================
  if (loading) return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6 animate-pulse">
        <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
          <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-100 rounded w-32"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded"></div>)}
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Erreur */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {avatar ? (
                  <img src={avatar} alt="Profil" className="h-20 w-20 rounded-full object-cover border-4 border-blue-100" />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-blue-100 border-4 border-blue-50 flex items-center justify-center">
                    <span className="text-blue-700 font-bold text-2xl">
                      {(formData.firstName?.[0] || '') + (formData.lastName?.[0] || '')}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <CameraIcon className="h-4 w-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dr. {formData.firstName} {formData.lastName}
                </h1>
                <p className="text-gray-600">{formData.specialization || 'Spécialité non renseignée'}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <ShieldCheckIcon className={`h-4 w-4 ${formData.isVerified ? 'text-green-500' : 'text-yellow-500'}`} />
                  <span className={`text-sm ${formData.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {formData.isVerified ? 'Profil vérifié' : 'En attente de vérification'}
                  </span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    formData.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {formData.isAvailable ? '🟢 Disponible' : '🔴 Indisponible'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {saveMessage && (
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg text-sm">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  {saveMessage}
                </div>
              )}

              {isEditing ? (
                <div className="flex space-x-2">
                  <button onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Annuler
                  </button>
                  <button onClick={handleSave} disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center text-sm">
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
                <button onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm">
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Modifier
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}>
                  <div className="flex items-center">
                    <tab.icon className={`h-5 w-5 mr-2 ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'}`} />
                    {tab.name}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">

            {/* ======== ONGLET : Personnel ======== */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <input type="text" value={formData.firstName}
                      onChange={e => setField('firstName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input type="text" value={formData.lastName}
                      onChange={e => setField('lastName', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" value={formData.email} disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500" />
                    <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                    <input type="tel" value={formData.phone}
                      onChange={e => setField('phone', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                  <input type="text" value={formData.address}
                    onChange={e => setField('address', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Biographie</label>
                  <textarea value={formData.bio}
                    onChange={e => setField('bio', e.target.value)}
                    disabled={!isEditing} rows={4}
                    placeholder="Présentez votre parcours et votre approche médicale..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Langues parlées</label>
                  {isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_LANGUAGES.map(lang => (
                        <button key={lang} type="button" onClick={() => toggleLanguage(lang)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            formData.languages.includes(lang)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}>
                          {lang}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.languages.length > 0 ? formData.languages.map((lang, i) => (
                        <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {lang}
                        </span>
                      )) : (
                        <p className="text-sm text-gray-400">Aucune langue renseignée</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ======== ONGLET : Professionnel ======== */}
            {activeTab === 'professional' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations professionnelles</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité</label>
                    <input type="text" value={formData.specialization}
                      onChange={e => setField('specialization', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Années d'expérience</label>
                    <input type="number" value={formData.experienceYears}
                      onChange={e => setField('experienceYears', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de licence</label>
                    <input type="text" value={formData.licenseNumber} disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 font-mono" />
                    <p className="text-xs text-gray-400 mt-1">Le numéro de licence ne peut pas être modifié.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ======== ONGLET : Tarifs & disponibilité ======== */}
            {activeTab === 'practice' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tarifs de consultation</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Présentiel (XAF)</label>
                    <input type="number" value={formData.feeInPerson}
                      onChange={e => setField('feeInPerson', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vidéo (XAF)</label>
                    <input type="number" value={formData.feeVideo}
                      onChange={e => setField('feeVideo', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Suivi (XAF)</label>
                    <input type="number" value={formData.feeFollowup}
                      onChange={e => setField('feeFollowup', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">ℹ️ Disponibilités hebdomadaires</span> — gérez votre planning détaillé (jours, créneaux, type de consultation) dans la page{' '}
                    <a href="/medecin/disponibilites" className="underline font-medium">Disponibilités</a>.
                  </p>
                </div>
              </div>
            )}

            {/* ======== ONGLET : Statistiques (réelles) ======== */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques de performance</h3>

                {loadingStats ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                    {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>)}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-blue-50 p-6 rounded-xl">
                        <div className="flex items-center">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <ChartBarIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-900">{stats?.total ?? 0}</p>
                            <p className="text-sm text-gray-600">RDV au total</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-6 rounded-xl">
                        <div className="flex items-center">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <CheckCircleIcon className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-900">{stats?.confirmed ?? 0}</p>
                            <p className="text-sm text-gray-600">Confirmés</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-6 rounded-xl">
                        <div className="flex items-center">
                          <div className="p-3 bg-yellow-100 rounded-lg">
                            <ClockIcon className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-900">{stats?.pending ?? 0}</p>
                            <p className="text-sm text-gray-600">En attente</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-6 rounded-xl">
                        <div className="flex items-center">
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <StarIcon className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <p className="text-2xl font-bold text-gray-900">{stats?.today ?? 0}</p>
                            <p className="text-sm text-gray-600">Aujourd'hui</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">ℹ️ Note :</span> Les avis patients et la note moyenne seront disponibles ici une fois le module Avis connecté à votre profil.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}