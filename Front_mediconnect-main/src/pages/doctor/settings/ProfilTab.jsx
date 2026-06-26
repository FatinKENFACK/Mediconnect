import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import {
  UserCircleIcon, PhotoIcon, CheckCircleIcon,
  ChatBubbleLeftRightIcon, MapPinIcon, PhoneIcon,
} from '@heroicons/react/24/outline';

// ============================================================
// LANGUES DISPONIBLES
// ============================================================
const AVAILABLE_LANGUAGES = ['Français', 'Anglais', 'Bassa', 'Ewondo', 'Douala', 'Bamiléké'];

// ============================================================
// COMPOSANT : ProfilTab — connecté au modèle Doctor réel
// ============================================================
const ProfilTab = () => {
  const [isEditing, setIsEditing]   = useState(false);
  const [loading, setLoading]       = useState(true);
  const [isSaving, setIsSaving]     = useState(false);
  const [error, setError]           = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [avatar, setAvatar]         = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '',
    bio: '', languages: [],
    specialization: '', experienceYears: '', licenseNumber: '',
    feeInPerson: '', feeVideo: '', feeFollowup: '',
  });
  const [savedData, setSavedData] = useState(null);

  // ============================================================
  // CHARGEMENT
  // ============================================================
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.getDoctorProfile();
        const mapped = {
          firstName:       data.first_name || '',
          lastName:        data.last_name  || '',
          email:           data.email      || '',
          phone:           data.phone      || '',
          address:         data.address    || '',
          bio:             data.bio        || '',
          languages:       data.languages ? data.languages.split(',').map(l => l.trim()).filter(Boolean) : [],
          specialization:  data.specialization || '',
          experienceYears: String(data.experience_years || ''),
          licenseNumber:   data.license_number || '',
          feeInPerson:     String(data.fee_in_person || '5000'),
          feeVideo:        String(data.fee_video || '6000'),
          feeFollowup:     String(data.fee_followup || '3000'),
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
      } catch {
        setError('Impossible de charger le profil.');
      } finally {
        setLoading(false);
      }
    };
    load();
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
      await api.updateDoctorProfile({
        specialization:   formData.specialization,
        experience_years: parseInt(formData.experienceYears) || 0,
        bio:               formData.bio,
        languages:         formData.languages.join(','),
        fee_in_person:     parseInt(formData.feeInPerson) || 0,
        fee_video:         parseInt(formData.feeVideo) || 0,
        fee_followup:      parseInt(formData.feeFollowup) || 0,
      });

      const profileUpdate = {
        first_name: formData.firstName,
        last_name:  formData.lastName,
        phone:      formData.phone,
        address:    formData.address,
      };
      if (avatarFile) profileUpdate.profile_picture = avatarFile;
      await api.updateProfile(profileUpdate);

      setSavedData({ ...formData });
      setSuccessMessage('Profil mis à jour avec succès !');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
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
    <div className="space-y-4 animate-pulse">
      <div className="h-24 bg-gray-100 rounded-lg"></div>
      <div className="h-10 bg-gray-100 rounded"></div>
      <div className="h-10 bg-gray-100 rounded"></div>
    </div>
  );

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6">

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}
      {successMessage && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <CheckCircleIcon className="h-4 w-4" /> {successMessage}
        </div>
      )}

      {/* Photo + bouton modifier */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatar ? (
              <img src={avatar} alt="Profil" className="h-20 w-20 rounded-full object-cover border-4 border-blue-50" />
            ) : (
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-bold text-xl">
                  {(formData.firstName?.[0] || '') + (formData.lastName?.[0] || '')}
                </span>
              </div>
            )}
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700">
                <PhotoIcon className="h-4 w-4" />
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </label>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Dr. {formData.firstName} {formData.lastName}</h3>
            <p className="text-sm text-gray-500">{formData.specialization || 'Spécialité non renseignée'}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">
              Annuler
            </button>
            <button onClick={handleSave} disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 flex items-center gap-2">
              {isSaving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              Enregistrer
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            Modifier
          </button>
        )}
      </div>

      {/* Bio */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center mb-2">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mr-2" />
          <h4 className="text-base font-medium text-gray-900">À propos de moi</h4>
        </div>
        <textarea
          rows={4} value={formData.bio} disabled={!isEditing}
          onChange={e => setField('bio', e.target.value)}
          placeholder="Présentez votre parcours et votre approche médicale..."
          className="w-full text-sm border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>

      {/* Identité */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <input type="text" value={formData.firstName} disabled={!isEditing}
            onChange={e => setField('firstName', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input type="text" value={formData.lastName} disabled={!isEditing}
            onChange={e => setField('lastName', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={formData.email} disabled
            className="w-full text-sm border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <PhoneIcon className="h-4 w-4 inline mr-1" />Téléphone
          </label>
          <input type="tel" value={formData.phone} disabled={!isEditing}
            onChange={e => setField('phone', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPinIcon className="h-4 w-4 inline mr-1" />Adresse
          </label>
          <input type="text" value={formData.address} disabled={!isEditing}
            onChange={e => setField('address', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
        </div>
      </div>

      {/* Professionnel */}
      <div className="border-t border-gray-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
          <input type="text" value={formData.specialization} disabled={!isEditing}
            onChange={e => setField('specialization', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Années d'expérience</label>
          <input type="number" value={formData.experienceYears} disabled={!isEditing}
            onChange={e => setField('experienceYears', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de licence</label>
          <input type="text" value={formData.licenseNumber} disabled
            className="w-full text-sm border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-500 font-mono" />
        </div>
      </div>

      {/* Tarifs */}
      <div className="border-t border-gray-200 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Présentiel (XAF)</label>
          <input type="number" value={formData.feeInPerson} disabled={!isEditing}
            onChange={e => setField('feeInPerson', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vidéo (XAF)</label>
          <input type="number" value={formData.feeVideo} disabled={!isEditing}
            onChange={e => setField('feeVideo', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Suivi (XAF)</label>
          <input type="number" value={formData.feeFollowup} disabled={!isEditing}
            onChange={e => setField('feeFollowup', e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500" />
        </div>
      </div>

      {/* Langues */}
      <div className="border-t border-gray-200 pt-6">
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
              <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{lang}</span>
            )) : <p className="text-sm text-gray-400">Aucune langue renseignée</p>}
          </div>
        )}
      </div>

    </div>
  );
};

export default ProfilTab;