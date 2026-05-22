import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  CreditCardIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  UserCircleIcon,
  ClockIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

export default function Payment() {
  const location = useLocation();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [errors, setErrors] = useState({});

  // Mock consultation data - en pratique, viendrait de l'état de navigation ou d'une API
  const consultation = location.state?.consultation || {
    id: 'CONS-2024-001',
    doctor: {
      name: 'Dr. Martin Dupont',
      specialty: 'Médecine générale',
      avatar: '/api/placeholder/100/100'
    },
    date: '15 Décembre 2023',
    time: '14:30',
    type: 'En ligne',
    duration: '30 minutes',
    price: 45,
    currency: 'EUR'
  };

  const validateForm = () => {
    const newErrors = {};

    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Numéro de carte invalide';
      }
      if (!cardName.trim()) {
        newErrors.cardName = 'Nom du titulaire requis';
      }
      if (!expiryDate || !expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
        newErrors.expiryDate = 'Date d\'expiration invalide (MM/AA)';
      }
      if (!cvv || cvv.length !== 3) {
        newErrors.cvv = 'CVV invalide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    // Simuler le traitement du paiement
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircleIconSolid className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Paiement réussi
          </h1>
          
          <p className="text-gray-600 mb-8">
            Votre consultation a été payée avec succès. Vous allez recevoir un email de confirmation.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Détails de la consultation</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Numéro de consultation:</span>
                <span className="font-medium">{consultation.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Médecin:</span>
                <span className="font-medium">{consultation.doctor.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date et heure:</span>
                <span className="font-medium">{consultation.date} à {consultation.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{consultation.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Montant payé:</span>
                <span className="font-semibold text-green-600">{consultation.price}€</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              to="/patient/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour au tableau de bord
            </Link>
            <Link
              to="/patient/rendez-vous"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Voir mes rendez-vous
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/patient/rendez-vous" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Retour aux rendez-vous
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Paiement de la consultation
        </h1>
        <p className="text-gray-600">
          Finalisez le paiement pour confirmer votre rendez-vous
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Récapitulatif de la consultation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <img
                src={consultation.doctor.avatar}
                alt={consultation.doctor.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">{consultation.doctor.name}</h3>
                <p className="text-sm text-gray-600">{consultation.doctor.specialty}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">{consultation.date}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Heure:</span>
                <span className="font-medium text-gray-900">{consultation.time}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                {consultation.type === 'En ligne' ? (
                  <VideoCameraIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <UserCircleIcon className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-900">{consultation.type}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Durée:</span>
                <span className="font-medium text-gray-900">{consultation.duration}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Consultation</span>
                <span className="font-medium">{consultation.price}€</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Frais de service</span>
                <span className="font-medium">0€</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-blue-600">{consultation.price}€</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Paiement sécurisé</p>
                  <p>Vos informations bancaires sont cryptées et protégées.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de paiement */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Méthode de paiement</h2>
            
            <form onSubmit={handlePayment}>
              {/* Choix du moyen de paiement */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCardIcon className="h-6 w-6" />
                  <span className="font-medium">Carte bancaire</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === 'transfer'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <BanknotesIcon className="h-6 w-6" />
                  <span className="font-medium">Virement bancaire</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-6">
                  {/* Informations de la carte */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de carte
                    </label>
                    <input
                      type="text"
                      value={formatCardNumber(cardNumber)}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      maxLength={19}
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du titulaire
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Jean Dupont"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.cardName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cardName && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        value={formatExpiryDate(expiryDate)}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/AA"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength={5}
                      />
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.cvv ? 'border-red-500' : 'border-gray-300'
                        }`}
                        maxLength={3}
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveCard"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                      Enregistrer cette carte pour mes prochains paiements
                    </label>
                  </div>
                </div>
              )}

              {paymentMethod === 'transfer' && (
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Informations de virement</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bénéficiaire:</span>
                        <span className="font-medium">Mediconnet Health Services</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">IBAN:</span>
                        <span className="font-medium">FR76 1234 5678 9012 3456 7890 123</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">BIC:</span>
                        <span className="font-medium">BNPAFRPPXXX</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Référence:</span>
                        <span className="font-medium">{consultation.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium">Important</p>
                        <p>Le virement peut prendre 1-3 jours ouvrables à apparaître. Votre consultation sera confirmée dès réception du paiement.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton de paiement */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="h-5 w-5" />
                      Payer {consultation.price}€
                    </>
                  )}
                </button>
              </div>

              {/* Mentions légales */}
              <div className="mt-6 text-xs text-gray-500 text-center">
                <p>
                  En confirmant ce paiement, vous acceptez nos{' '}
                  <a href="#" className="text-blue-600 hover:underline">conditions générales</a>{' '}
                  et notre{' '}
                  <a href="#" className="text-blue-600 hover:underline">politique de confidentialité</a>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
