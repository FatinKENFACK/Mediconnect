import React, { useState } from 'react';
import api from '../../../services/api';
import { CheckCircleIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// ============================================================
// COMPOSANT : SecuriteTab — changement de mot de passe réel
// ============================================================
const SecuriteTab = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError]   = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Le mot de passe actuel est requis';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setApiError('');

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await api.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      setSuccessMessage('Votre mot de passe a été mis à jour avec succès.');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setApiError(err.message || 'Erreur lors de la mise à jour du mot de passe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Changer de mot de passe
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Mettez à jour le mot de passe que vous utilisez pour vous connecter à votre compte.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">

          {successMessage && (
            <div className="mb-6 rounded-md bg-green-50 p-4">
              <div className="flex">
                <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                <p className="ml-3 text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          )}

          {apiError && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
                <p className="ml-3 text-sm font-medium text-red-800">{apiError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                Mot de passe actuel
              </label>
              <div className="mt-1">
                <input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.currentPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.currentPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                Nouveau mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.newPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirmer le nouveau mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Mise à jour...
                  </>
                ) : 'Mettre à jour le mot de passe'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-medium">ℹ️ Note :</span> L'authentification à deux facteurs et la gestion des sessions actives seront disponibles dans une prochaine mise à jour.
        </p>
      </div>
    </div>
  );
};

export default SecuriteTab;