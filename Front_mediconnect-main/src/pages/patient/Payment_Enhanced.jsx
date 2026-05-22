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
  VideoCameraIcon,
  QrCodeIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon
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

  // Mock consultation data avec contexte camerounais
  const consultation = location.state?.consultation || {
    id: 'CONS-2024-001',
    doctor: {
      name: 'Dr. Martin Tchinda',
      specialty: 'Médecine générale',
      avatar: '/api/placeholder/100/100',
      phone: '+237 699 123 456'
    },
    date: '15 Décembre 2023',
    time: '14:30',
    type: 'En ligne',
    duration: '30 minutes',
    price: 5000,
    currency: 'XAF',
    hospital: 'Hôpital Central Yaoundé'
  };

  // Méthodes de paiement populaires au Cameroun
  const paymentMethods = [
    {
      id: 'card',
      name: 'Carte bancaire',
      icon: CreditCardIcon,
      description: 'Visa, Mastercard, UBA',
      color: 'blue'
    },
    {
      id: 'mobile',
      name: 'Mobile Money',
      icon: PhoneIcon,
      description: 'Orange Money, MTN Mobile Money',
      color: 'green'
    },
    {
      id: 'bank',
      name: 'Virement bancaire',
      icon: BuildingOfficeIcon,
      description: 'Vers un compte bancaire',
      color: 'purple'
    },
    {
      id: 'qr',
      name: 'QR Code',
      icon: QrCodeIcon,
      description: 'Scanner pour payer',
      color: 'orange'
    }
  ];

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
    }, 3000);
  };

  const getMethodColor = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-500 text-blue-700',
      green: 'bg-green-50 border-green-500 text-green-700',
      purple: 'bg-purple-50 border-purple-500 text-purple-700',
      orange: 'bg-orange-50 border-orange-500 text-orange-700'
    };
    return colors[color] || colors.blue;
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIconSolid className="h-12 w-12 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement réussi!</h2>
            <p className="text-gray-600 mb-6">
              Votre paiement de {consultation.price.toLocaleString()} {consultation.currency} a été traité avec succès.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-3">Détails de la transaction</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Référence</span>
                  <span className="font-medium">TXN-{Date.now()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{new Date().toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant</span>
                  <span className="font-medium text-green-600">{consultation.price.toLocaleString()} {consultation.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Méthode</span>
                  <span className="font-medium">{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/patient/rendez-vous"
                className="block w-full px-4 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
              >
                Voir mes rendez-vous
              </Link>
              <Link
                to="/patient/dashboard"
                className="block w-full px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Retour au tableau de bord
              </Link>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Reçu envoyé par email</p>
                  <p>Un reçu détaillé a été envoyé à votre adresse email.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/patient/rendez-vous"
                className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Retour
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Paiement de consultation</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Méthode de paiement</h2>
                <p className="mt-2 text-gray-600">Choisissez votre mode de paiement sécurisé</p>
              </div>
              
              <div className="p-6">
                {/* Payment Methods */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                        paymentMethod === method.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <method.icon className={`h-8 w-8 mx-auto mb-2 ${
                        paymentMethod === method.id ? 'text-teal-600' : 'text-gray-400'
                      }`} />
                      <div className="text-sm font-medium text-gray-900">{method.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{method.description}</div>
                    </button>
                  ))}
                </div>

                <form onSubmit={handlePayment}>
                  {/* Card Payment Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de carte
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                            placeholder="MM/AA"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                        />
                        <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                          Sauvegarder cette carte pour les prochains paiements
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Mobile Money Form */}
                  {paymentMethod === 'mobile' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Opérateur Mobile Money
                        </label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                          <option>Orange Money</option>
                          <option>MTN Mobile Money</option>
                          <option>Express Union Mobile</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de téléphone
                        </label>
                        <input
                          type="tel"
                          placeholder="+237 6XX XXX XXX"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <PhoneIcon className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div className="text-sm text-orange-800">
                            <p className="font-medium mb-1">Comment payer avec Mobile Money</p>
                            <ol className="list-decimal list-inside space-y-1">
                              <li>Entrez votre numéro Mobile Money</li>
                              <li>Vous recevrez un USSD pour confirmer</li>
                              <li>Confirmez avec votre code PIN</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Form */}
                  {paymentMethod === 'bank' && (
                    <div className="space-y-6">
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                        <h4 className="font-medium text-purple-900 mb-3">Coordonnées bancaires</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Banque:</span>
                            <span className="font-medium">Société Générale Cameroun</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Titulaire:</span>
                            <span className="font-medium">Mediconnet CM</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Compte:</span>
                            <span className="font-medium">011 234 5678 9000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">RIB:</span>
                            <span className="font-medium">CM00 01123 45678 9000 0000 000</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Référence de virement
                        </label>
                        <input
                          type="text"
                          placeholder="Entrez votre référence de virement"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <ExclamationTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Important</p>
                            <p>Le traitement peut prendre 24-48h. Gardez votre référence de virement.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QR Code Payment */}
                  {paymentMethod === 'qr' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-48 h-48 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                          <QrCodeIcon className="h-24 w-24 text-gray-400" />
                        </div>
                        <p className="text-gray-600 mb-4">Scannez ce QR code avec votre application mobile</p>
                      </div>

                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <QrCodeIcon className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div className="text-sm text-orange-800">
                            <p className="font-medium mb-1">Instructions</p>
                            <ol className="list-decimal list-inside space-y-1">
                              <li>Ouvrez votre application de paiement</li>
                              <li>Scannez le QR code ci-dessus</li>
                              <li>Vérifiez le montant et confirmez</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Traitement en cours...
                        </span>
                      ) : (
                        `Payer ${consultation.price.toLocaleString()} ${consultation.currency}`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Consultation Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{consultation.doctor.name}</h4>
                    <p className="text-sm text-gray-600">{consultation.doctor.specialty}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{consultation.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Heure</span>
                    <span className="font-medium">{consultation.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">{consultation.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Durée</span>
                    <span className="font-medium">{consultation.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Lieu</span>
                    <span className="font-medium">{consultation.hospital}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-teal-600">
                      {consultation.price.toLocaleString()} {consultation.currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <ShieldCheckIcon className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Paiement sécurisé</h4>
                  <p className="text-sm text-green-800">
                    Vos informations sont cryptées et protégées selon les normes bancaires internationales.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-medium text-blue-900 mb-3">Besoin d'aide?</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-blue-800">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  <span>+237 242 000 123</span>
                </div>
                <div className="flex items-center text-blue-800">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  <span>support@mediconnet.cm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
