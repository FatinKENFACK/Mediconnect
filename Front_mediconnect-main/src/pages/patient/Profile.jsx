import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserCircleIcon, PencilIcon, MapPinIcon, ShieldCheckIcon,
  ArrowLeftIcon, CameraIcon, CheckIcon, ChevronRightIcon,
  DocumentTextIcon, IdentificationIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const [userData, setUserData] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    address: '', city: '', region: '', postal_code: '',
    date_of_birth: '', gender: '', profile_picture: null
  });
  const [formData, setFormData] = useState({ ...userData });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await api.getProfile();
        setUserData(data);
        setFormData(data);
      } catch (err) {
        setError('Impossible de charger le profil.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profile_picture: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const response = await api.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || '',
        address: formData.address || '',
        city: formData.city || '',
        region: formData.region || '',
        postal_code: formData.postal_code || '',
        date_of_birth: formData.date_of_birth || '',
        gender: formData.gender || '',
        ...(formData.profile_picture instanceof File && { profile_picture: formData.profile_picture })
      });

      setUserData(response.user);
      setFormData(response.user);
      setPreviewImage(null);

      // Mettre à jour le localStorage
      localStorage.setItem('user', JSON.stringify(response.user));

      setIsEditing(false);
      setSuccess('Profil mis à jour avec succès !');
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setPreviewImage(null);
    setIsEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

const profileImageSrc = previewImage ||
    (userData.profile_picture
      ? userData.profile_picture.startsWith('http')
        ? userData.profile_picture
        : `http://localhost:8000${userData.profile_picture}`
      : null);
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Retour
        </button>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-medium">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* En-tête */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 sm:px-8 md:px-10">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="relative">
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
                  {profileImageSrc ? (
                    <img src={profileImageSrc} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                      <UserCircleIcon className="h-16 w-16 text-blue-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 rounded-full p-2 text-white shadow-md cursor-pointer">
                    <CameraIcon className="h-4 w-4" />
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                  </label>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {userData.first_name} {userData.last_name}
                </h1>
                <p className="text-blue-100 text-sm">{userData.email}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 bg-opacity-20 text-blue-100">
                    <ShieldCheckIcon className="h-3.5 w-3.5 mr-1" />
                    Compte vérifié
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 bg-opacity-20 text-green-100">
                    <CheckIcon className="h-3.5 w-3.5 mr-1" />
                    Actif
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50">
                  <PencilIcon className="-ml-1 mr-2 h-4 w-4" />
                  Modifier le profil
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button onClick={handleCancel}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Annuler
                  </button>
                  <button onClick={handleSubmit} disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Détails */}
        <div className="px-6 py-8 sm:px-8 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Informations personnelles */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <IdentificationIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Informations personnelles
                  </h3>
                </div>
                <div className="p-6">
                  {isEditing ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                        <input type="text" name="first_name" value={formData.first_name || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input type="text" name="last_name" value={formData.last_name || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" value={formData.email || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input type="tel" name="phone" value={formData.phone || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                        <input type="date" name="date_of_birth" value={formData.date_of_birth || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                        <select name="gender" value={formData.gender || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                          <option value="">Sélectionner</option>
                          <option value="male">Homme</option>
                          <option value="female">Femme</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nom complet</p>
                        <p className="text-gray-900">{userData.first_name} {userData.last_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-blue-600">{userData.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Téléphone</p>
                        <p className="text-gray-900">{userData.phone || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date de naissance</p>
                        <p className="text-gray-900">
                          {userData.date_of_birth
                            ? new Date(userData.date_of_birth).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
                            : 'Non renseignée'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Genre</p>
                        <p className="text-gray-900">
                          {userData.gender === 'male' ? 'Homme' : userData.gender === 'female' ? 'Femme' : userData.gender === 'other' ? 'Autre' : 'Non renseigné'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Adresse */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Adresse
                  </h3>
                </div>
                <div className="p-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                        <input type="text" name="address" value={formData.address || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                          <input type="text" name="city" value={formData.city || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
                          <input type="text" name="region" value={formData.region || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                        <input type="text" name="postal_code" value={formData.postal_code || ''}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-gray-900">{userData.address || 'Non renseignée'}</p>
                      <p className="text-gray-900">{userData.city} {userData.region}</p>
                      <p className="text-gray-600">{userData.postal_code}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Colonne droite */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Documents importants
                  </h3>
                </div>
                <div className="p-6">
                  <Link to="/patient/documents" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                    Voir tous les documents
                    <ChevronRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex">
                  <ShieldCheckIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Vos données sont sécurisées</h3>
                    <p className="mt-2 text-sm text-blue-700">
                      Nous utilisons un chiffrement de bout en bout pour protéger vos informations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;