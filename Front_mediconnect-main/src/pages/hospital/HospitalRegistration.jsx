import { useAuth } from '../../contexts/AuthContext';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  UserGroupIcon,
  HeartIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const HospitalRegistration = () => {
  const { signupHospital } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    hospitalName: '', email: '', phone: '', website: '', address: '',
    city: '', country: 'Cameroun', postalCode: '', description: '',
    foundedYear: '', capacity: '', emergencyServices: false,
    password: '', confirmPassword: '',
    primaryServices: [], specializedServices: [], facilities: [],
    doctorsCount: '', nursesCount: '', specialistsCount: [], staffQualifications: [],
    licenseNumber: '', accreditationBody: '', accreditationNumber: '',
    insuranceCoverage: false, plan: 'professional',
    cardNumber: '', expiryDate: '', cvv: '', cardholderName: '', billingAddress: '',
    agreeToTerms: false, agreeToPrivacy: false, agreeToMedicalEthics: false
  });

  const totalSteps = 5;
  const steps = [
    { id: 1, title: 'Informations de base', icon: BuildingOfficeIcon },
    { id: 2, title: 'Services & Spécialités', icon: HeartIcon },
    { id: 3, title: 'Personnel médical', icon: UserGroupIcon },
    { id: 4, title: 'Agrément & Conformité', icon: ShieldCheckIcon },
    { id: 5, title: 'Abonnement', icon: CreditCardIcon }
  ];

  const services = {
    primary: ['Cardiologie', 'Pédiatrie', 'Radiologie', 'Gynécologie', 'Chirurgie générale', 'Urgences 24/7', 'Médecine interne', 'Dermatologie', 'Ophtalmologie', 'ORL'],
    specialized: ['Chirurgie cardiaque', 'Neurologie', 'Oncologie', 'Réanimation', 'Néphrologie', 'Endocrinologie', 'Rhumatologie', 'Gastro-entérologie'],
    facilities: ["Bloc opératoire moderne", "Service d'imagerie médicale", "Laboratoire d'analyses", "Pharmacie hospitalière", "Service d'urgence", "Hébergement patients", "Centre de rééducation", "Unité de soins palliatifs"]
  };

  const specialties = ['Cardiologie', 'Pédiatrie', 'Radiologie', 'Gynécologie', 'Chirurgie générale', 'Médecine interne', 'Dermatologie', 'Ophtalmologie', 'ORL', 'Neurologie', 'Oncologie'];
  const qualifications = ['Doctorat en Médecine', 'Spécialisation médicale', 'Master en santé publique', 'Certification en gestion hospitalière', 'Diplôme en soins infirmiers'];

  const plans = [
    { id: 'basic', name: 'Basic', price: 50000, duration: 'mois', features: ["Jusqu'à 5 médecins", "100 consultations/mois", "Messagerie de base", "Tableau de bord simple", "Support email"] },
    { id: 'professional', name: 'Professional', price: 150000, duration: 'mois', popular: true, features: ["Jusqu'à 20 médecins", "500 consultations/mois", "Messagerie avancée", "Consultations vidéo illimitées", "Statistiques détaillées", "Support prioritaire"] },
    { id: 'enterprise', name: 'Enterprise', price: 500000, duration: 'mois', features: ["Médecins illimités", "Consultations illimitées", "Toutes les fonctionnalités", "API personnalisée", "Support dédié 24/7", "Formation personnalisée"] }
  ];

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleServiceToggle = (service, category) => {
    setFormData(prev => {
      const current = prev[category] || [];
      const updated = current.includes(service) ? current.filter(s => s !== service) : [...current, service];
      return { ...prev, [category]: updated };
    });
  };

  const handleSpecialtyToggle = (specialty) => {
    setFormData(prev => {
      const current = prev.specialistsCount || [];
      const updated = current.includes(specialty) ? current.filter(s => s !== specialty) : [...current, specialty];
      return { ...prev, specialistsCount: updated };
    });
  };

  const handleQualificationToggle = (qualification) => {
    setFormData(prev => {
      const current = prev.staffQualifications || [];
      const updated = current.includes(qualification) ? current.filter(q => q !== qualification) : [...current, qualification];
      return { ...prev, staffQualifications: updated };
    });
  };

  const validateStep = (step) => {
    switch (step) {
      case 1: return formData.hospitalName && formData.email && formData.phone && formData.address && formData.password && formData.confirmPassword;
      case 2: return formData.primaryServices.length > 0;
      case 3: return formData.doctorsCount && formData.nursesCount;
      case 4: return formData.licenseNumber && formData.agreeToMedicalEthics;
      case 5: return formData.plan && formData.agreeToTerms && formData.agreeToPrivacy;
      default: return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      setError('');
    } else {
      setError('Veuillez remplir tous les champs obligatoires (*).');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      setError('Veuillez accepter les conditions obligatoires.');
      return;
    }
    try {
      setLoading(true);
      setError('');

      const response = await api.registerHospital({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.hospitalName,
        registrationNumber: formData.licenseNumber,
        hospitalType: 'clinic',
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        region: formData.country,
        website: formData.website || '',
      });

      // Compte en attente de validation
      if (response.pending) {
        setPending(true);
      }

    } catch (err) {
      setError(err.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'hôpital *</label>
                <input type="text" value={formData.hospitalName} onChange={(e) => handleInputChange('hospitalName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Clinique Saint-Jean" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="contact@clinique.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="+237 6XX XXX XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                <input type="text" value={formData.website} onChange={(e) => handleInputChange('website', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="www.clinique.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                <input type="text" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Rue de la Santé, Douala" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <input type="text" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Douala" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Année de fondation</label>
                <input type="text" value={formData.foundedYear} onChange={(e) => handleInputChange('foundedYear', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="1998" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacité (lits)</label>
                <input type="number" value={formData.capacity} onChange={(e) => handleInputChange('capacity', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="150" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Décrivez votre établissement..." />
            </div>
            <div className="flex items-center">
              <input type="checkbox" checked={formData.emergencyServices} onChange={(e) => handleInputChange('emergencyServices', e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <label className="ml-2 text-sm text-gray-700">Services d'urgence 24/7 disponibles</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                <input type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Minimum 8 caractères" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe *</label>
                <input type="password" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Répétez le mot de passe" />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Services principaux * (sélectionnez au moins 1)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {services.primary.map((service) => (
                  <label key={service} className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.primaryServices.includes(service)} onChange={() => handleServiceToggle(service, 'primaryServices')} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Services spécialisés</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {services.specialized.map((service) => (
                  <label key={service} className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.specializedServices.includes(service)} onChange={() => handleServiceToggle(service, 'specializedServices')} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Installations</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {services.facilities.map((facility) => (
                  <label key={facility} className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.facilities.includes(facility)} onChange={() => handleServiceToggle(facility, 'facilities')} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">{facility}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de médecins *</label>
                <input type="number" value={formData.doctorsCount} onChange={(e) => handleInputChange('doctorsCount', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="12" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'infirmiers *</label>
                <input type="number" value={formData.nursesCount} onChange={(e) => handleInputChange('nursesCount', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="25" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Spécialités médicales représentées</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {specialties.map((specialty) => (
                  <label key={specialty} className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.specialistsCount.includes(specialty)} onChange={() => handleSpecialtyToggle(specialty)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">{specialty}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Qualifications du personnel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {qualifications.map((qualification) => (
                  <label key={qualification} className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.staffQualifications.includes(qualification)} onChange={() => handleQualificationToggle(qualification)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">{qualification}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de licence *</label>
                <input type="text" value={formData.licenseNumber} onChange={(e) => handleInputChange('licenseNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="LIC-2024-CMR-001" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organisme d'agrément</label>
                <input type="text" value={formData.accreditationBody} onChange={(e) => handleInputChange('accreditationBody', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ministère de la Santé Publique" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro d'agrément</label>
                <input type="text" value={formData.accreditationNumber} onChange={(e) => handleInputChange('accreditationNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="ACC-2024-001" />
              </div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" checked={formData.insuranceCoverage} onChange={(e) => handleInputChange('insuranceCoverage', e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <label className="ml-2 text-sm text-gray-700">Couverture d'assurance responsabilité civile</label>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Documents requis</h3>
                  <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                    <li>Licence d'exploitation médicale</li>
                    <li>Certificat d'agrément</li>
                    <li>Assurance responsabilité civile</li>
                    <li>Diplômes et certifications du personnel</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <input type="checkbox" checked={formData.agreeToMedicalEthics} onChange={(e) => handleInputChange('agreeToMedicalEthics', e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-0.5" />
              <label className="ml-2 text-sm text-gray-700">J'engage mon établissement à respecter le code d'éthique médicale et les standards de qualité *</label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Choisissez votre abonnement</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div key={plan.id} className={`bg-white rounded-lg shadow-sm border-2 ${plan.popular ? 'border-blue-500' : 'border-gray-200'} overflow-hidden`}>
                    {plan.popular && <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">Le plus populaire</div>}
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h4>
                      <div className="text-center mb-4">
                        <span className="text-2xl font-bold text-gray-900">{plan.price.toLocaleString()}</span>
                        <span className="text-gray-500 text-sm"> FCFA/{plan.duration}</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => handleInputChange('plan', plan.id)} className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${formData.plan === plan.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
                        {formData.plan === plan.id ? '✓ Sélectionné' : 'Sélectionner'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de paiement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titulaire de la carte</label>
                  <input type="text" value={formData.cardholderName} onChange={(e) => handleInputChange('cardholderName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Jean Dupont" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte</label>
                  <input type="text" value={formData.cardNumber} onChange={(e) => handleInputChange('cardNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="1234 5678 9012 3456" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration</label>
                  <input type="text" value={formData.expiryDate} onChange={(e) => handleInputChange('expiryDate', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="MM/AA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input type="text" value={formData.cvv} onChange={(e) => handleInputChange('cvv', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="123" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <input type="checkbox" checked={formData.agreeToTerms} onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-0.5" />
                <label className="ml-2 text-sm text-gray-700">J'accepte les conditions générales d'utilisation *</label>
              </div>
              <div className="flex items-start">
                <input type="checkbox" checked={formData.agreeToPrivacy} onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded mt-0.5" />
                <label className="ml-2 text-sm text-gray-700">J'accepte la politique de confidentialité *</label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Page de confirmation en attente
  if (pending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <BuildingOfficeIcon className="h-10 w-10 text-yellow-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Demande envoyée !
          </h2>
          <p className="text-gray-600 mb-6">
            Votre demande d'inscription a été reçue avec succès. Un administrateur va examiner votre dossier et activer votre compte sous <strong>24 à 48 heures</strong>.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800">
               Vous recevrez une confirmation dès que votre compte sera activé.
            </p>
          </div>
          <div className="space-y-3">
            <a href="/connexion" className="block w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
              Retour à la connexion
            </a>
            <a href="/" className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <BuildingOfficeIcon className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Inscription Hôpital</h1>
          <p className="text-gray-600 mt-2">Rejoignez Mediconnet et proposez vos services médicaux en ligne</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-500'}`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <p className={`text-xs font-medium mt-1 hidden sm:block ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-right text-sm text-gray-500 mt-2">Étape {currentStep} / {totalSteps}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{steps[currentStep - 1].title}</h2>

          {renderStepContent()}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button onClick={prevStep} disabled={currentStep === 1} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Précédent
            </button>

            {currentStep === totalSteps ? (
              <button onClick={handleSubmit} disabled={!validateStep(currentStep) || loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                {loading ? (
                  <><svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Inscription en cours...</>
                ) : (
                  <>Terminer l'inscription<ArrowRightIcon className="h-5 w-5 ml-2" /></>
                )}
              </button>
            ) : (
              <button onClick={nextStep} disabled={!validateStep(currentStep)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
                Suivant<ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegistration;