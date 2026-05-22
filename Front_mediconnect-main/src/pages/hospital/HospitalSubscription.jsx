import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCardIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const HospitalSubscription = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 50000,
      duration: 'mois',
      description: 'Idéal pour les petits établissements',
      features: [
        'Jusqu\'à 5 médecins',
        '100 consultations/mois',
        'Messagerie de base',
        'Tableau de bord simple',
        'Support email'
      ],
      limitations: [
        'Pas de consultations vidéo',
        'Pas de statistiques avancées',
        'Support limité'
      ],
      icon: BuildingOfficeIcon,
      color: 'bg-gray-500',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 150000,
      duration: 'mois',
      description: 'Parfait pour les établissements en croissance',
      features: [
        'Jusqu\'à 20 médecins',
        '500 consultations/mois',
        'Messagerie avancée',
        'Consultations vidéo illimitées',
        'Statistiques détaillées',
        'Gestion des rendez-vous',
        'Support prioritaire'
      ],
      limitations: [
        'Fonctionnalités marketing limitées'
      ],
      icon: ShieldCheckIcon,
      color: 'bg-blue-500',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 500000,
      duration: 'mois',
      description: 'Solution complète pour les grands hôpitaux',
      features: [
        'Médecins illimités',
        'Consultations illimitées',
        'Toutes les fonctionnalités',
        'API personnalisée',
        'Intégrations avancées',
        'Support dédié 24/7',
        'Formation personnalisée',
        'Marketing et promotion'
      ],
      limitations: [],
      icon: RocketLaunchIcon,
      color: 'bg-purple-500',
      popular: false
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      date: '2024-01-15',
      amount: 150000,
      plan: 'Professional',
      status: 'completed',
      method: 'Carte de crédit',
      transactionId: 'TXN-2024-001'
    },
    {
      id: 2,
      date: '2023-12-15',
      amount: 150000,
      plan: 'Professional',
      status: 'completed',
      method: 'Carte de crédit',
      transactionId: 'TXN-2023-012'
    },
    {
      id: 3,
      date: '2023-11-15',
      amount: 50000,
      plan: 'Basic',
      status: 'completed',
      method: 'Carte de crédit',
      transactionId: 'TXN-2023-011'
    }
  ];

  useEffect(() => {
    // Simuler le chargement du plan actuel
    setCurrentPlan({
      id: 'professional',
      name: 'Professional',
      price: 150000,
      duration: 'mois',
      nextBillingDate: '2024-02-15',
      status: 'active',
      doctorsUsed: 12,
      doctorsLimit: 20,
      consultationsUsed: 234,
      consultationsLimit: 500,
      features: [
        'Jusqu\'à 20 médecins',
        '500 consultations/mois',
        'Messagerie avancée',
        'Consultations vidéo illimitées',
        'Statistiques détaillées',
        'Gestion des rendez-vous',
        'Support prioritaire'
      ]
    });
  }, []);

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const confirmUpgrade = async () => {
    setIsLoading(true);
    // Simuler le processus de mise à niveau
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentPlan({
      ...selectedPlan,
      status: 'active',
      nextBillingDate: '2024-02-15',
      doctorsUsed: 12,
      doctorsLimit: selectedPlan.id === 'basic' ? 5 : selectedPlan.id === 'professional' ? 20 : 999,
      consultationsUsed: 234,
      consultationsLimit: selectedPlan.id === 'basic' ? 100 : selectedPlan.id === 'professional' ? 500 : 999,
      features: selectedPlan.features
    });
    setIsLoading(false);
    setShowUpgradeModal(false);
    setSelectedPlan(null);
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowCancelModal(false);
    // Rediriger vers la page d'inscription ou afficher un message
  };

  const getUsagePercentage = (used, limit) => {
    return (used / limit) * 100;
  };

  const getFeatureIcon = (feature) => {
    const iconMap = {
      'médecins': UserGroupIcon,
      'consultations': CalendarIcon,
      'messagerie': ChatBubbleLeftRightIcon,
      'vidéo': VideoCameraIcon,
      'statistiques': ChartBarIcon,
      'rendez-vous': CalendarIcon,
      'support': InformationCircleIcon
    };
    
    for (const [key, icon] of Object.entries(iconMap)) {
      if (feature.toLowerCase().includes(key)) {
        return icon;
      }
    }
    return CheckCircleIcon;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Abonnement</h1>
          <p className="text-gray-600 mt-2">Gérez votre abonnement et vos facturations</p>
        </div>
        <Link
          to="/hopital/abonnement/plans"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Voir les plans d'abonnement
        </Link>
      </div>

      {/* Current Plan */}
      {currentPlan && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Plan actuel : {currentPlan.name}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-3xl font-bold text-gray-900">
                  {currentPlan.price.toLocaleString()} FCFA
                </span>
                <span className="text-gray-600">/ {currentPlan.duration}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  currentPlan.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentPlan.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Prochaine facturation</p>
              <p className="text-lg font-medium text-gray-900">{currentPlan.nextBillingDate}</p>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Médecins utilisés</span>
                <span className="text-sm text-gray-600">{currentPlan.doctorsUsed} / {currentPlan.doctorsLimit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${getUsagePercentage(currentPlan.doctorsUsed, currentPlan.doctorsLimit)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Consultations ce mois</span>
                <span className="text-sm text-gray-600">{currentPlan.consultationsUsed} / {currentPlan.consultationsLimit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${getUsagePercentage(currentPlan.consultationsUsed, currentPlan.consultationsLimit)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fonctionnalités incluses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentPlan.features.map((feature, index) => {
                const IconComponent = getFeatureIcon(feature);
                return (
                  <div key={index} className="flex items-center">
                    <IconComponent className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Annuler l'abonnement
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
              Mettre à jour les informations de paiement
            </button>
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Plans disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-white rounded-lg shadow-sm border-2 ${
              plan.popular ? 'border-blue-500' : 'border-gray-200'
            } overflow-hidden`}>
              {plan.popular && (
                <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium">
                    Le plus populaire
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className={`${plan.color} p-3 rounded-lg`}>
                    <plan.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{plan.name}</h3>
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price.toLocaleString()}</span>
                  <span className="text-gray-600">/{plan.duration}</span>
                </div>
                <p className="text-gray-600 text-center mb-6">{plan.description}</p>
                
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start">
                      <XCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={currentPlan?.id === plan.id}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    currentPlan?.id === plan.id
                      ? 'bg-gray-200 text-gray-800 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-800 text-white hover:bg-gray-900'
                  }`}
                >
                  {currentPlan?.id === plan.id ? 'Plan actuel' : 'Mettre à niveau'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Historique des paiements</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Méthode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.plan}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.amount.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.method}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status === 'completed' ? 'Complété' : 'Échoué'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.transactionId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Confirmer la mise à niveau</h3>
              <p className="text-gray-600 mt-2">
                Vous êtes sur le point de passer au plan {selectedPlan.name} pour {selectedPlan.price.toLocaleString()} FCFA/{selectedPlan.duration}.
              </p>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Résumé du plan</h4>
              <div className="space-y-2">
                {selectedPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  setSelectedPlan(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmUpgrade}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Traitement...' : 'Confirmer la mise à niveau'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Annuler l'abonnement</h3>
              <p className="text-gray-600 mt-2">
                Êtes-vous sûr de vouloir annuler votre abonnement ? Vous perdrez l'accès à toutes les fonctionnalités premium à la fin de la période de facturation.
              </p>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmCancel}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Traitement...' : 'Confirmer l\'annulation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalSubscription;
