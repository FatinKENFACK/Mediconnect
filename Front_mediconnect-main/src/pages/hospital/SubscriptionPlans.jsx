import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, yearly
  const [isComparing, setIsComparing] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Idéal pour les petits établissements',
      price: { monthly: 50000, yearly: 500000 },
      currency: 'FCFA',
      color: 'gray',
      features: [
        { name: 'Jusqu\'à 5 médecins', included: true },
        { name: '100 consultations/mois', included: true },
        { name: 'Messagerie de base', included: true },
        { name: 'Tableau de bord simple', included: true },
        { name: 'Support email', included: true },
        { name: 'Consultations vidéo', included: false },
        { name: 'Statistiques avancées', included: false },
        { name: 'API personnalisée', included: false },
        { name: 'Support prioritaire', included: false },
        { name: 'Formation personnalisée', included: false }
      ],
      limitations: [
        'Pas de consultations vidéo',
        'Pas de statistiques avancées',
        'Support limité'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Parfait pour les établissements en croissance',
      price: { monthly: 150000, yearly: 1500000 },
      currency: 'FCFA',
      color: 'blue',
      popular: true,
      features: [
        { name: 'Jusqu\'à 20 médecins', included: true },
        { name: '500 consultations/mois', included: true },
        { name: 'Messagerie avancée', included: true },
        { name: 'Consultations vidéo illimitées', included: true },
        { name: 'Statistiques détaillées', included: true },
        { name: 'Gestion des rendez-vous', included: true },
        { name: 'Support prioritaire', included: true },
        { name: 'API personnalisée', included: false },
        { name: 'Intégrations avancées', included: false },
        { name: 'Support dédié 24/7', included: false },
        { name: 'Formation personnalisée', included: false },
        { name: 'Marketing et promotion', included: false }
      ],
      limitations: [
        'Fonctionnalités marketing limitées'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Solution complète pour les grands hôpitaux',
      price: { monthly: 500000, yearly: 5000000 },
      currency: 'FCFA',
      color: 'purple',
      features: [
        { name: 'Médecins illimités', included: true },
        { name: 'Consultations illimitées', included: true },
        { name: 'Toutes les fonctionnalités', included: true },
        { name: 'API personnalisée', included: true },
        { name: 'Intégrations avancées', included: true },
        { name: 'Support dédié 24/7', included: true },
        { name: 'Formation personnalisée', included: true },
        { name: 'Marketing et promotion', included: true },
        { name: 'Hébergement dédié', included: true },
        { name: 'Sauvegarde automatique', included: true },
        { name: 'SLA garanti', included: true },
        { name: 'Compte manager dédié', included: true },
        { name: 'Développement personnalisé', included: true }
      ],
      limitations: []
    }
  ];

  const additionalFeatures = [
    {
      icon: CalendarIcon,
      title: 'Gestion des rendez-vous',
      description: 'Planification automatique, rappels, et gestion des disponibilités'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Messagerie sécurisée',
      description: 'Communication instantanée avec les patients et partage de documents'
    },
    {
      icon: VideoCameraIcon,
      title: 'Téléconsultations',
      description: 'Consultations vidéo HD avec partage d\'écran et enregistrement'
    },
    {
      icon: DocumentTextIcon,
      title: 'Dossiers médicaux',
      description: 'Gestion complète des dossiers patients avec historique médical'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Sécurité et conformité',
      description: 'Chiffrement de bout en bout et conformité RGPD/HIPAA'
    },
    {
      icon: GlobeAltIcon,
      title: 'Multilingue',
      description: 'Interface disponible en plusieurs langues (Français, Anglais, Wolof)'
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Marie Lefebvre',
      role: 'Directrice, Clinique Saint-Jean',
      content: 'Mediconnet a transformé notre gestion des rendez-vous. Nous avons gagné 40% de temps administratif.',
      rating: 5,
      plan: 'Professional'
    },
    {
      name: 'Dr. Martin Laurent',
      role: 'Cardiologue, Hôpital Principal',
      content: 'Les consultations vidéo nous ont permis de continuer à soigner nos patients pendant la pandémie.',
      rating: 5,
      plan: 'Enterprise'
    },
    {
      name: 'Dr. Sophie Bernard',
      role: 'Pédiatre, Cabinet Médical',
      content: 'Simple, efficace et abordable. Le plan Starter était parfait pour démarrer notre cabinet.',
      rating: 5,
      plan: 'Starter'
    }
  ];

  const faqs = [
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Oui, vous pouvez passer à un plan supérieur à tout moment. Le changement sera effectif immédiatement et vous serez facturé au prorata. Pour passer à un plan inférieur, le changement prendra effet au début du prochain cycle de facturation.'
    },
    {
      question: 'Y a-t-il un engagement minimum ?',
      answer: 'Non, vous pouvez résilier votre abonnement à tout moment. Aucun frais d\'annulation ou engagement minimum. Vous serez facturé jusqu\'à la fin de votre cycle de facturation en cours.'
    },
    {
      question: 'Comment fonctionne la facturation ?',
      answer: 'La facturation est mensuelle ou annuelle selon votre choix. Vous pouvez payer par carte de crédit, virement bancaire ou mobile money. Les factures sont envoyées automatiquement 5 jours avant la date d\'échéance.'
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Oui, toutes vos données sont chiffrées de bout en bout et stockées sur des serveurs sécurisés. Nous respectons pleinement le RGPD et les réglementations sur la protection des données de santé.'
    },
    {
      question: 'Puis-je essayer avant de m\'engager ?',
      answer: 'Oui, nous offrons une période d\'essai de 14 jours sur tous nos plans. Aucune carte de crédit n\'est requise pour commencer l\'essai.'
    },
    {
      question: 'Qu\'en est-il du support technique ?',
      answer: 'Le support est inclus dans tous nos plans. Le plan Starter offre un support par email, Professional inclut le support prioritaire, et Enterprise bénéficie d\'un support dédié 24/7.'
    }
  ];

  const getPlanIcon = (planId) => {
    const iconMap = {
      'basic': <BuildingOfficeIcon className={`h-8 w-8 text-gray-600`} />,
      'professional': <ShieldCheckIcon className={`h-8 w-8 text-blue-600`} />,
      'enterprise': <ShieldCheckIcon className={`h-8 w-8 text-purple-600`} />
    };
    return iconMap[planId] || <BuildingOfficeIcon className={`h-8 w-8 text-gray-600`} />;
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    // Créer une copie sérialisable du plan sans les icônes
    const serializablePlan = {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      color: plan.color,
      popular: plan.popular,
      features: plan.features,
      limitations: plan.limitations
    };
    navigate('/hopital/abonnement/paiement', { state: { plan: serializablePlan, billingCycle } });
  };

  const getPlanStyle = (plan) => {
    const baseStyle = 'relative rounded-2xl p-8 transition-all duration-300 hover:shadow-xl';
    const colorStyles = {
      gray: 'bg-white border-2 border-gray-200 hover:border-gray-300',
      blue: 'bg-white border-2 border-blue-500 hover:border-blue-600',
      purple: 'bg-white border-2 border-purple-500 hover:border-purple-600'
    };
    
    return `${baseStyle} ${colorStyles[plan.color]}`;
  };

  const getButtonStyle = (plan) => {
    const baseStyle = 'w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200';
    const colorStyles = {
      gray: 'bg-gray-800 text-white hover:bg-gray-900',
      blue: 'bg-blue-600 text-white hover:bg-blue-700',
      purple: 'bg-purple-600 text-white hover:bg-purple-700'
    };
    
    return `${baseStyle} ${colorStyles[plan.color]}`;
  };

  const calculateSavings = (plan) => {
    const monthlyTotal = plan.price.monthly * 12;
    const yearlyPrice = plan.price.yearly;
    const savings = monthlyTotal - yearlyPrice;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choisissez votre abonnement
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des tarifs transparents et adaptés à vos besoins. Commencez gratuitement et passez à un plan supérieur quand vous le souhaitez.
            </p>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Annuel
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Économisez 17%
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} className={getPlanStyle(plan)}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                    Le plus populaire
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-lg ${plan.color.replace('bg-', 'bg-').replace('500', '100')} mb-4`}>
                  {getPlanIcon(plan.id)}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-4">
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-gray-500 line-through mb-2">
                      {plan.price.monthly.toLocaleString()} {plan.currency}/mois
                    </div>
                  )}
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {billingCycle === 'monthly' 
                        ? plan.price.monthly.toLocaleString()
                        : Math.round(plan.price.yearly / 12).toLocaleString()
                      }
                    </span>
                    <span className="text-gray-600 ml-2">
                      {plan.currency}/{billingCycle === 'monthly' ? 'mois' : 'mois (annuel)'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-green-600 mt-2">
                      Économisez {calculateSavings(plan).amount.toLocaleString()} {plan.currency}/an
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    {feature.included ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-3 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              {plan.limitations.length > 0 && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Limitations</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gray-400 mr-2">-</span>
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => handlePlanSelect(plan)}
                className={getButtonStyle(plan)}
              >
                {selectedPlan?.id === plan.id ? 'Sélectionné' : 'Choisir ce plan'}
                {selectedPlan?.id !== plan.id && <ArrowRightIcon className="h-5 w-5 ml-2 inline" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Features */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités incluses dans tous les plans
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tout ce dont vous avez besoin pour gérer votre établissement médical efficacement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex p-3 bg-blue-100 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ce que nos clients en disent
            </h2>
            <p className="text-xl text-gray-600">
              Rejoignez des centaines d\'établissements qui font confiance à Mediconnet
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">Plan {testimonial.plan}</span>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-medium text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce que vous devez savoir sur nos abonnements
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à moderniser votre pratique médicale ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Rejoignez des centaines d\'établissements qui ont déjà transformé leur gestion avec Mediconnet
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/hopital/inscription')}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Commencer l'essai gratuit
              </button>
              <button
                onClick={() => navigate('/hopital/abonnement/demo')}
                className="px-8 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                Demander une démo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
