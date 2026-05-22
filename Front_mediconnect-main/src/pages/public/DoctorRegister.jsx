import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser, FaEnvelope, FaLock, FaCheck, FaCheckCircle,
  FaEye, FaEyeSlash, FaStethoscope, FaShieldAlt,
  FaPhone, FaArrowRight, FaArrowLeft, FaUserCircle,
  FaHospital, FaIdCard, FaHeartbeat
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const DoctorRegister = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1: Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',

    // Étape 2: Informations professionnelles
    specialization: '',
    licenseNumber: '',
    experienceYears: '',
    bio: '',
    languages: '',

    // Étape 3: Tarifs
    feeInPerson: '5000',
    feeVideo: '6000',

    // Étape 4: Code hôpital + mot de passe
    hospitalCode: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { signupDoctor } = useAuth();
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'Informations personnelles', icon: FaUserCircle },
    { id: 2, title: 'Profil professionnel', icon: FaStethoscope },
    { id: 3, title: 'Tarifs', icon: FaHeartbeat },
    { id: 4, title: 'Compte & Hôpital', icon: FaHospital },
  ];

  const specializations = [
    'Médecine générale', 'Cardiologie', 'Pédiatrie', 'Gynécologie',
    'Dermatologie', 'Neurologie', 'Ophtalmologie', 'ORL',
    'Orthopédie', 'Psychiatrie', 'Radiologie', 'Chirurgie générale',
    'Urologie', 'Endocrinologie', 'Oncologie', 'Autre'
  ];

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
      if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
      if (!formData.email.trim()) newErrors.email = "L'email est requis";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email invalide';
      if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
      if (!formData.gender) newErrors.gender = 'Le genre est requis';
    }

    if (step === 2) {
      if (!formData.specialization) newErrors.specialization = 'La spécialisation est requise';
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "Le numéro de licence est requis";
      if (!formData.experienceYears) newErrors.experienceYears = "L'expérience est requise";
      else if (isNaN(formData.experienceYears) || parseInt(formData.experienceYears) < 0)
        newErrors.experienceYears = 'Valeur invalide';
    }

    if (step === 3) {
      if (!formData.feeInPerson) newErrors.feeInPerson = 'Le tarif présentiel est requis';
      if (!formData.feeVideo) newErrors.feeVideo = 'Le tarif vidéo est requis';
    }

    if (step === 4) {
      if (!formData.hospitalCode.trim()) newErrors.hospitalCode = "Le code hôpital est requis";
      if (!formData.password) newErrors.password = 'Le mot de passe est requis';
      else if (formData.password.length < 8) newErrors.password = 'Minimum 8 caractères';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmez le mot de passe';
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      if (!formData.acceptTerms) newErrors.acceptTerms = "Acceptez les conditions d'utilisation";
      if (!formData.acceptPrivacy) newErrors.acceptPrivacy = 'Acceptez la politique de confidentialité';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    try {
      setLoading(true);
      setErrors({});
      await signupDoctor(formData);
    } catch (error) {
      setErrors({ general: error.message || 'Une erreur est survenue' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mb-4">
            <FaStethoscope className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Inscription Médecin</h2>
          <p className="mt-2 text-gray-600">Rejoignez Mediconnet et proposez vos consultations en ligne</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.id ? <FaCheck /> : <step.icon />}
                  </div>
                  <span className={`mt-1 text-xs font-medium hidden sm:block ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 mb-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Étape 1 : Informations personnelles */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Informations personnelles</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <input type="text" name="firstName" value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="Martin" />
                    {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input type="text" name="lastName" value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="Tchinda" />
                    {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input type="email" name="email" value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="docteur@email.com" />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input type="tel" name="phone" value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="+237 6XX XXX XXX" />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Genre *</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                      <option value="">Sélectionner</option>
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                      <option value="other">Autre</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Étape 2 : Profil professionnel */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Profil professionnel</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spécialisation *</label>
                    <select name="specialization" value={formData.specialization} onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.specialization ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}>
                      <option value="">Sélectionner</option>
                      {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.specialization && <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de licence *</label>
                    <input type="text" name="licenseNumber" value={formData.licenseNumber}
                      onChange={handleChange}
                      className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.licenseNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="CMR-DOC-12345" />
                    {errors.licenseNumber && <p className="mt-1 text-sm text-red-600">{errors.licenseNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Années d'expérience *</label>
                    <input type="number" name="experienceYears" value={formData.experienceYears}
                      onChange={handleChange} min="0" max="50"
                      className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.experienceYears ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                      placeholder="5" />
                    {errors.experienceYears && <p className="mt-1 text-sm text-red-600">{errors.experienceYears}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Langues parlées</label>
                    <input type="text" name="languages" value={formData.languages}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                      placeholder="Français, Anglais, Bassa" />
                    <p className="mt-1 text-xs text-gray-400">Séparées par des virgules</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Biographie</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4}
                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Décrivez votre parcours, vos spécialités et votre approche médicale..." />
                </div>
              </div>
            )}

            {/* Étape 3 : Tarifs */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Tarifs de consultation</h3>
                <p className="text-sm text-gray-500">Définissez vos tarifs en Francs CFA (XAF)</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <label className="block text-sm font-semibold text-blue-800 mb-2">
                      Consultation présentiel (XAF) *
                    </label>
                    <input type="number" name="feeInPerson" value={formData.feeInPerson}
                      onChange={handleChange} min="0"
                      className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 bg-white ${errors.feeInPerson ? 'border-red-300' : 'border-blue-200'}`}
                      placeholder="5000" />
                    {errors.feeInPerson && <p className="mt-1 text-sm text-red-600">{errors.feeInPerson}</p>}
                    <p className="mt-2 text-xs text-blue-600">Tarif pour une consultation en cabinet</p>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <label className="block text-sm font-semibold text-purple-800 mb-2">
                      Consultation vidéo (XAF) *
                    </label>
                    <input type="number" name="feeVideo" value={formData.feeVideo}
                      onChange={handleChange} min="0"
                      className={`w-full px-3 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 bg-white ${errors.feeVideo ? 'border-red-300' : 'border-purple-200'}`}
                      placeholder="6000" />
                    {errors.feeVideo && <p className="mt-1 text-sm text-red-600">{errors.feeVideo}</p>}
                    <p className="mt-2 text-xs text-purple-600">Tarif pour une consultation en visioconférence</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm text-gray-600">
                    💡 Ces tarifs seront affichés aux patients lors de la prise de rendez-vous. Vous pourrez les modifier à tout moment depuis votre profil.
                  </p>
                </div>
              </div>
            )}

            {/* Étape 4 : Compte & Hôpital */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Compte & Rattachement hôpital</h3>

                {/* Code hôpital */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <FaHospital className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-blue-800">Code hôpital</h4>
                  </div>
                  <p className="text-sm text-blue-700 mb-4">
                    Saisissez le code unique fourni par votre établissement de santé.
                    Ce code se trouve dans le tableau de bord de l'hôpital.
                  </p>
                  <input type="text" name="hospitalCode" value={formData.hospitalCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 text-center text-xl font-bold tracking-widest uppercase bg-white ${errors.hospitalCode ? 'border-red-300' : 'border-blue-300'}`}
                    placeholder="ABC12DEF"
                    maxLength={8} />
                  {errors.hospitalCode && <p className="mt-1 text-sm text-red-600">{errors.hospitalCode}</p>}
                </div>

                {/* Mot de passe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} name="password"
                        value={formData.password} onChange={handleChange}
                        className={`w-full px-3 py-3 pr-10 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        placeholder="Minimum 8 caractères" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe *</label>
                    <div className="relative">
                      <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword"
                        value={formData.confirmPassword} onChange={handleChange}
                        className={`w-full px-3 py-3 pr-10 border rounded-xl focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                        placeholder="Répétez le mot de passe" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {showConfirmPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>

                {/* Récapitulatif */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Récapitulatif</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">Nom :</span> <span className="font-medium">{formData.firstName} {formData.lastName}</span></div>
                    <div><span className="text-gray-500">Email :</span> <span className="font-medium">{formData.email}</span></div>
                    <div><span className="text-gray-500">Spécialisation :</span> <span className="font-medium">{formData.specialization}</span></div>
                    <div><span className="text-gray-500">Expérience :</span> <span className="font-medium">{formData.experienceYears} ans</span></div>
                    <div><span className="text-gray-500">Présentiel :</span> <span className="font-medium">{formData.feeInPerson} XAF</span></div>
                    <div><span className="text-gray-500">Vidéo :</span> <span className="font-medium">{formData.feeVideo} XAF</span></div>
                  </div>
                </div>

                {/* Conditions */}
                <div className="space-y-3">
                  <div className={`flex items-start p-4 rounded-xl border ${errors.acceptTerms ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                    <input type="checkbox" name="acceptTerms" id="acceptTerms"
                      checked={formData.acceptTerms} onChange={handleChange}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded mt-0.5" />
                    <label htmlFor="acceptTerms" className="ml-3 text-sm text-gray-700">
                      J'accepte les <a href="#" className="text-blue-600 font-semibold">conditions d'utilisation</a> *
                    </label>
                  </div>
                  {errors.acceptTerms && <p className="text-sm text-red-600">{errors.acceptTerms}</p>}

                  <div className={`flex items-start p-4 rounded-xl border ${errors.acceptPrivacy ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                    <input type="checkbox" name="acceptPrivacy" id="acceptPrivacy"
                      checked={formData.acceptPrivacy} onChange={handleChange}
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded mt-0.5" />
                    <label htmlFor="acceptPrivacy" className="ml-3 text-sm text-gray-700">
                      J'accepte la <a href="#" className="text-blue-600 font-semibold">politique de confidentialité</a> *
                    </label>
                  </div>
                  {errors.acceptPrivacy && <p className="text-sm text-red-600">{errors.acceptPrivacy}</p>}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button type="button" onClick={prevStep} disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 border rounded-xl font-medium transition-all ${
                  currentStep === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>
                <FaArrowLeft className="mr-2" /> Précédent
              </button>

              {currentStep < 4 ? (
                <button type="button" onClick={nextStep}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all">
                  Suivant <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  className={`flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-medium transition-all ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-green-700'}`}>
                  {loading ? (
                    <><svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>Inscription en cours...</>
                  ) : (
                    <><FaCheck className="mr-2" />Créer mon compte</>
                  )}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link to="/connexion" className="font-semibold text-blue-600 hover:text-blue-500">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <FaShieldAlt className="text-green-500" />
              <span>Inscription sécurisée</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaLock className="text-blue-500" />
              <span>Données protégées</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaHeartbeat className="text-red-500" />
              <span>Soins de qualité</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;