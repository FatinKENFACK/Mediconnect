import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const SubscriptionPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, billingCycle } = location.state || {};
  
  const [paymentData, setPaymentData] = useState({
    // Informations de facturation
    companyName: '',
    companyAddress: '',
    companyCity: '',
    companyCountry: 'Sénégal',
    companyPostalCode: '',
    companyPhone: '',
    companyEmail: '',
    companyTin: '', // Tax Identification Number
    
    // Méthode de paiement
    paymentMethod: 'card', // card, mobile_money, bank_transfer
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardholderName: '',
    
    // Mobile Money
    mobileOperator: 'orange', // orange, wave, free
    mobileNumber: '',
    mobilePin: '',
    
    // Virement bancaire
    bankName: '',
    bankAccount: '',
    bankAccountHolder: '',
    
    // Coordonnées facturation
    billingEmail: '',
    billingPhone: '',
    billingAddress: '',
    
    // Options
    autoRenew: true,
    paperInvoice: false,
    marketingConsent: false,
    
    // Validation
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const mobileOperators = [
    { value: 'orange', label: 'Orange Money', logo: 'orange' },
    { value: 'wave', label: 'Wave', logo: 'wave' },
    { value: 'free', label: 'Free Money', logo: 'free' }
  ];

  const banks = [
    'Banque Atlantique Sénégal',
    'Société Générale Sénégal',
    'BNP Paribas Sénégal',
    'Ecobank Sénégal',
    'UBA Sénégal',
    'NSIA Banque Sénégal',
    'Crédit Populaire du Sénégal',
    'Banque de Dakar'
  ];

  const steps = [
    { id: 1, title: 'Informations de facturation', icon: EnvelopeIcon },
    { id: 2, title: 'Méthode de paiement', icon: CreditCardIcon },
    { id: 3, title: 'Confirmation', icon: CheckCircleIcon }
  ];

  useEffect(() => {
    if (!plan) {
      navigate('/hopital/abonnement');
    }
  }, [plan, navigate]);

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!paymentData.companyName) newErrors.companyName = 'Le nom de l\'entreprise est requis';
        if (!paymentData.companyAddress) newErrors.companyAddress = 'L\'adresse est requise';
        if (!paymentData.companyCity) newErrors.companyCity = 'La ville est requise';
        if (!paymentData.companyPhone) newErrors.companyPhone = 'Le téléphone est requis';
        if (!paymentData.companyEmail) newErrors.companyEmail = 'L\'email est requis';
        if (!paymentData.billingEmail) newErrors.billingEmail = 'L\'email de facturation est requis';
        break;
      case 2:
        if (paymentData.paymentMethod === 'card') {
          if (!paymentData.cardNumber) newErrors.cardNumber = 'Le numéro de carte est requis';
          if (!paymentData.cardExpiry) newErrors.cardExpiry = 'La date d\'expiration est requise';
          if (!paymentData.cardCvv) newErrors.cardCvv = 'Le CVV est requis';
          if (!paymentData.cardholderName) newErrors.cardholderName = 'Le nom du titulaire est requis';
        } else if (paymentData.paymentMethod === 'mobile_money') {
          if (!paymentData.mobileNumber) newErrors.mobileNumber = 'Le numéro de mobile est requis';
          if (!paymentData.mobilePin) newErrors.mobilePin = 'Le PIN est requis';
        } else if (paymentData.paymentMethod === 'bank_transfer') {
          if (!paymentData.bankName) newErrors.bankName = 'La banque est requise';
          if (!paymentData.bankAccount) newErrors.bankAccount = 'Le numéro de compte est requis';
          if (!paymentData.bankAccountHolder) newErrors.bankAccountHolder = 'Le titulaire du compte est requis';
        }
        break;
      case 3:
        if (!paymentData.agreeToTerms) newErrors.agreeToTerms = 'Vous devez accepter les conditions générales';
        if (!paymentData.agreeToPrivacy) newErrors.agreeToPrivacy = 'Vous devez accepter la politique de confidentialité';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    if (!validateStep(3)) return;

    setIsProcessing(true);
    
    try {
      // Simuler le traitement du paiement
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setShowConfirmation(true);
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getMonthlyPrice = () => {
    if (!plan) return 0;
    return billingCycle === 'yearly' 
      ? Math.round(plan.price.yearly / 12)
      : plan.price.monthly;
  };

  const getTotalAmount = () => {
    if (!plan) return 0;
    return billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly;
  };

  const renderPaymentMethod = () => {
    switch (paymentData.paymentMethod) {
      case 'card':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte *</label>
              <input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration *</label>
                <input
                  type="text"
                  value={paymentData.cardExpiry}
                  onChange={(e) => handleInputChange('cardExpiry', formatExpiry(e.target.value))}
                  placeholder="MM/AA"
                  maxLength={5}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                <input
                  type="text"
                  value={paymentData.cardCvv}
                  onChange={(e) => handleInputChange('cardCvv', e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  maxLength={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.cardCvv ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.cardCvv && <p className="text-red-500 text-sm mt-1">{errors.cardCvv}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom du titulaire *</label>
              <input
                type="text"
                value={paymentData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                placeholder="Jean Dupont"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.cardholderName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <ShieldCheckIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Paiement sécurisé</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Vos informations de carte sont chiffrées et sécurisées. Nous utilisons la norme PCI-DSS pour la protection des données.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'mobile_money':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Opérateur mobile *</label>
              <div className="grid grid-cols-3 gap-4">
                {mobileOperators.map((operator) => (
                  <label key={operator.value} className="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      value={operator.value}
                      checked={paymentData.mobileOperator === operator.value}
                      onChange={(e) => handleInputChange('mobileOperator', e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full bg-${operator.logo}-100 flex items-center justify-center mb-2 ${
                        paymentData.mobileOperator === operator.value ? 'ring-2 ring-blue-500' : ''
                      }`}>
                        <DevicePhoneMobileIcon className={`h-6 w-6 text-${operator.logo}-600`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{operator.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone *</label>
              <input
                type="tel"
                value={paymentData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                placeholder="+221 77 123 45 67"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.mobileNumber && <p className="text-red-500 text-sm mt-1">{errors.mobileNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PIN Mobile Money *</label>
              <input
                type="password"
                value={paymentData.mobilePin}
                onChange={(e) => handleInputChange('mobilePin', e.target.value)}
                placeholder="****"
                maxLength={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.mobilePin ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.mobilePin && <p className="text-red-500 text-sm mt-1">{errors.mobilePin}</p>}
              <p className="text-xs text-gray-500 mt-1">Le PIN à 4 chiffres de votre compte mobile money</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <InformationCircleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Instructions Mobile Money</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Après validation, vous recevrez une notification sur votre téléphone pour confirmer le paiement.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'bank_transfer':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banque *</label>
              <select
                value={paymentData.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bankName ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez une banque</option>
                {banks.map(bank => (
                  <option key={bank} value={bank}>{bank}</option>
                ))}
              </select>
              {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de compte *</label>
              <input
                type="text"
                value={paymentData.bankAccount}
                onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                placeholder="12345678901234567890"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bankAccount ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.bankAccount && <p className="text-red-500 text-sm mt-1">{errors.bankAccount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titulaire du compte *</label>
              <input
                type="text"
                value={paymentData.bankAccountHolder}
                onChange={(e) => handleInputChange('bankAccountHolder', e.target.value)}
                placeholder="Jean Dupont"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.bankAccountHolder ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.bankAccountHolder && <p className="text-red-500 text-sm mt-1">{errors.bankAccountHolder}</p>}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <InformationCircleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Virement bancaire</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Après validation, vous recevrez les instructions de virement par email. L\'activation de l\'abonnement sera effective dès réception du paiement.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!plan) {
    return (
      <div className="p-6 text-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 bg-green-100 rounded-full mb-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Paiement réussi !</h2>
            <p className="text-gray-600 mb-6">
              Votre abonnement {plan.name} est maintenant actif. Vous allez recevoir une confirmation par email.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-left">
                <p className="text-sm text-gray-600">Plan: <span className="font-medium text-gray-900">{plan.name}</span></p>
                <p className="text-sm text-gray-600">Montant: <span className="font-medium text-gray-900">{getTotalAmount().toLocaleString()} FCFA</span></p>
                <p className="text-sm text-gray-600">Facturé: <span className="font-medium text-gray-900">{billingCycle === 'monthly' ? 'Mensuel' : 'Annuel'}</span></p>
              </div>
            </div>
            <button
              onClick={() => navigate('/hopital/tableau-de-bord')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Accéder au tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/hopital/abonnement')}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Retour aux plans
            </button>
            <div className="flex items-center space-x-2">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  <span className={`ml-2 text-sm ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                  {step.id < 3 && (
                    <div className={`w-full h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Résumé de la commande */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Résumé de l'abonnement</h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Plan: <span className="font-medium text-gray-900">{plan.name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Facturation: <span className="font-medium text-gray-900">{billingCycle === 'monthly' ? 'Mensuelle' : 'Annuelle'}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Prix: <span className="font-medium text-gray-900">{getMonthlyPrice().toLocaleString()} FCFA/mois</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total à payer</p>
              <p className="text-2xl font-bold text-gray-900">
                {getTotalAmount().toLocaleString()} FCFA
              </p>
              {billingCycle === 'yearly' && (
                <p className="text-sm text-green-600">
                  Économisez {((plan.price.monthly * 12) - plan.price.yearly).toLocaleString()} FCFA/an
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={(e) => e.preventDefault()}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations de facturation</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise *</label>
                    <input
                      type="text"
                      value={paymentData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.companyName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Clinique Saint-Jean"
                    />
                    {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      type="tel"
                      value={paymentData.companyPhone}
                      onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.companyPhone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+221 33 825 45 67"
                    />
                    {errors.companyPhone && <p className="text-red-500 text-sm mt-1">{errors.companyPhone}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={paymentData.companyEmail}
                      onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.companyEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="contact@clinique.com"
                    />
                    {errors.companyEmail && <p className="text-red-500 text-sm mt-1">{errors.companyEmail}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email de facturation *</label>
                    <input
                      type="email"
                      value={paymentData.billingEmail}
                      onChange={(e) => handleInputChange('billingEmail', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.billingEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="facturation@clinique.com"
                    />
                    {errors.billingEmail && <p className="text-red-500 text-sm mt-1">{errors.billingEmail}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                    <input
                      type="text"
                      value={paymentData.companyAddress}
                      onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.companyAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="123 Avenue de la Santé, Dakar"
                    />
                    {errors.companyAddress && <p className="text-red-500 text-sm mt-1">{errors.companyAddress}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                    <input
                      type="text"
                      value={paymentData.companyCity}
                      onChange={(e) => handleInputChange('companyCity', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.companyCity ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Dakar"
                    />
                    {errors.companyCity && <p className="text-red-500 text-sm mt-1">{errors.companyCity}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code postal</label>
                    <input
                      type="text"
                      value={paymentData.companyPostalCode}
                      onChange={(e) => handleInputChange('companyPostalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="12345"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Méthode de paiement</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <label className="relative">
                    <input
                      type="radio"
                      value="card"
                      checked={paymentData.paymentMethod === 'card'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                      paymentData.paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}>
                      <CreditCardIcon className="h-8 w-8 text-gray-600 mb-2" />
                      <h3 className="font-medium text-gray-900">Carte bancaire</h3>
                      <p className="text-sm text-gray-600">Visa, Mastercard, etc.</p>
                    </div>
                  </label>
                  
                  <label className="relative">
                    <input
                      type="radio"
                      value="mobile_money"
                      checked={paymentData.paymentMethod === 'mobile_money'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                      paymentData.paymentMethod === 'mobile_money' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}>
                      <DevicePhoneMobileIcon className="h-8 w-8 text-gray-600 mb-2" />
                      <h3 className="font-medium text-gray-900">Mobile Money</h3>
                      <p className="text-sm text-gray-600">Orange, Wave, Free</p>
                    </div>
                  </label>
                  
                  <label className="relative">
                    <input
                      type="radio"
                      value="bank_transfer"
                      checked={paymentData.paymentMethod === 'bank_transfer'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                      paymentData.paymentMethod === 'bank_transfer' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    }`}>
                      <BanknotesIcon className="h-8 w-8 text-gray-600 mb-2" />
                      <h3 className="font-medium text-gray-900">Virement bancaire</h3>
                      <p className="text-sm text-gray-600">Toutes les banques</p>
                    </div>
                  </label>
                </div>

                {renderPaymentMethod()}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Confirmation et options</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={paymentData.autoRenew}
                      onChange={(e) => handleInputChange('autoRenew', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Renouvellement automatique</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={paymentData.paperInvoice}
                      onChange={(e) => handleInputChange('paperInvoice', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Recevoir une facture papier</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={paymentData.marketingConsent}
                      onChange={(e) => handleInputChange('marketingConsent', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Recevoir des offres et actualités</span>
                  </label>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Conditions générales</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={paymentData.agreeToTerms}
                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        J'accepte les <a href="#" className="text-blue-600 hover:text-blue-800">conditions générales d'utilisation</a> *
                      </span>
                    </label>
                    {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}
                    
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        checked={paymentData.agreeToPrivacy}
                        onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        J'accepte la <a href="#" className="text-blue-600 hover:text-blue-800">politique de confidentialité</a> *
                      </span>
                    </label>
                    {errors.agreeToPrivacy && <p className="text-red-500 text-sm">{errors.agreeToPrivacy}</p>}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Récapitulatif final</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium text-gray-900">{plan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Facturation:</span>
                      <span className="font-medium text-gray-900">{billingCycle === 'monthly' ? 'Mensuelle' : 'Annuelle'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant:</span>
                      <span className="font-medium text-gray-900">{getTotalAmount().toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Méthode:</span>
                      <span className="font-medium text-gray-900">
                        {paymentData.paymentMethod === 'card' ? 'Carte bancaire' :
                         paymentData.paymentMethod === 'mobile_money' ? 'Mobile Money' : 'Virement bancaire'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  Suivant
                  <ArrowLeftIcon className="h-5 w-5 ml-2 rotate-180" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Traitement...
                    </>
                  ) : (
                    <>
                      {paymentData.paymentMethod === 'bank_transfer' ? 'Confirmer la commande' : 'Payer maintenant'}
                      {paymentData.paymentMethod !== 'bank_transfer' && <CreditCardIcon className="h-5 w-5 ml-2" />}
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPayment;
