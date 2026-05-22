import React, { useState } from 'react';
import { 
  LockClosedIcon, 
  ShieldCheckIcon, 
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  QrCodeIcon,
  ClipboardDocumentIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const SecuriteTab = () => {
  const [currentStep, setCurrentStep] = useState('password');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Password updated:', formData);
        setIsSubmitting(false);
        setSuccessMessage('Votre mot de passe a été mis à jour avec succès.');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }, 1500);
    }
  };

  const handle2FAToggle = () => {
    if (is2FAEnabled) {
      // Disable 2FA
      setIs2FAEnabled(false);
      setSuccessMessage('L\'authentification à deux facteurs a été désactivée.');
    } else {
      // Start 2FA setup
      setIsSettingUp2FA(true);
      setCurrentStep('2fa-setup');
    }
  };

  const complete2FASetup = () => {
    setIs2FAEnabled(true);
    setIsSettingUp2FA(false);
    setCurrentStep('password');
    setSuccessMessage('L\'authentification à deux facteurs a été activée avec succès.');
  };

  const cancel2FASetup = () => {
    setIsSettingUp2FA(false);
    setCurrentStep('password');
  };

  const renderPasswordForm = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
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
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
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
                <p className="mt-2 text-sm text-red-600" id="current-password-error">
                  {errors.currentPassword}
                </p>
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
                <p className="mt-2 text-sm text-red-600" id="new-password-error">
                  {errors.newPassword}
                </p>
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
                <p className="mt-2 text-sm text-red-600" id="confirm-password-error">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
  );

  const render2FASetup = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Configuration de l'authentification à deux facteurs
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Suivez les étapes pour configurer l'authentification à deux facteurs.
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 p-4 rounded-lg">
              <div className="text-center text-xs text-gray-600">
                Code QR à scanner avec votre application d'authentification
              </div>
              <div className="mt-2 p-4 bg-white rounded">
                <div className="flex justify-center">
                  <div className="h-48 w-48 bg-gray-100 flex items-center justify-center text-gray-400">
                    [QR Code Placeholder]
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                OU entrez ce code manuellement :
                <div className="mt-1 font-mono text-sm bg-gray-100 p-2 rounded">
                  ABC1 23DE FGH4 56IJ
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">
              Code de vérification
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="verification-code"
                name="verificationCode"
                placeholder="Entrez le code à 6 chiffres"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={cancel2FASetup}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <XMarkIcon className="-ml-1 mr-2 h-5 w-5" />
              Annuler
            </button>
            <button
              type="button"
              onClick={complete2FASetup}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CheckCircleIcon className="-ml-1 mr-2 h-5 w-5" />
              Activer l'authentification à deux facteurs
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const render2FASection = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Authentification à deux facteurs (2FA)
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Ajoutez une couche de sécurité supplémentaire à votre compte.
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-base font-medium text-gray-900">
                Authentification à deux facteurs
              </h4>
              <p className="text-sm text-gray-500">
                {is2FAEnabled 
                  ? 'L\'authentification à deux facteurs est actuellement activée.'
                  : 'L\'authentification à deux facteurs est actuellement désactivée.'
                }
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handle2FAToggle}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${is2FAEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
            role="switch"
            aria-checked={is2FAEnabled}
          >
            <span className="sr-only">Activer l'authentification à deux facteurs</span>
            <span
              aria-hidden="true"
              className={`${is2FAEnabled ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
            ></span>
          </button>
        </div>

        {is2FAEnabled && (
          <div className="mt-6 bg-blue-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">L'authentification à deux facteurs est activée</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Votre compte est sécurisé avec l'authentification à deux facteurs. Vous devrez entrer un code de sécurité à chaque connexion.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-900">Méthodes de récupération</h4>
          <p className="mt-1 text-sm text-gray-500">
            Configurez des méthodes de récupération au cas où vous n'auriez pas accès à votre appareil d'authentification.
          </p>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100">
                  <DevicePhoneMobileIcon className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <h5 className="text-sm font-medium text-gray-900">Téléphone mobile</h5>
                  <p className="text-sm text-gray-500">+33 6 12 34 56 78</p>
                </div>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Modifier
              </button>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100">
                  <EnvelopeIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h5 className="text-sm font-medium text-gray-900">Email de récupération</h5>
                  <p className="text-sm text-gray-500">r*****@example.com</p>
                </div>
              </div>
              <button
                type="button"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveSessions = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Sessions actives
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Voici les appareils qui sont actuellement connectés à votre compte.
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">Windows 10</h4>
                <p className="text-sm text-gray-500">Chrome sur Windows • Dernière activité il y a 2 heures</p>
                <p className="text-xs text-gray-400">192.168.1.1 • Cet appareil</p>
              </div>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Déconnecter
            </button>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-900">iPhone 13</h4>
                <p className="text-sm text-gray-500">Safari sur iOS • Dernière activité il y a 1 jour</p>
                <p className="text-xs text-gray-400">192.168.1.2</p>
              </div>
            </div>
            <button
              type="button"
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Déconnecter
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowPathIcon className="-ml-1 mr-2 h-4 w-4" />
            Actualiser la liste des sessions
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {currentStep === 'password' ? (
        <>
          {renderPasswordForm()}
          {render2FASection()}
          {renderActiveSessions()}
        </>
      ) : (
        render2FASetup()
      )}
    </div>
  );
};

export default SecuriteTab;
