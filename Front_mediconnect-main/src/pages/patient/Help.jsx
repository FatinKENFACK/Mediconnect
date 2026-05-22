import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CreditCardIcon,
  CalendarIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BuildingOfficeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [contactMethod, setContactMethod] = useState('');

  const categories = [
    {
      id: 'getting-started',
      name: 'Premiers pas',
      icon: UserCircleIcon,
      color: 'blue',
      articles: [
        {
          id: 'create-account',
          title: 'Créer un compte patient',
          content: 'Pour créer votre compte, cliquez sur "S\'inscrire" et remplissez le formulaire avec vos informations personnelles. Vous aurez besoin de votre pièce d\'identité et d\'une adresse email valide.',
          tags: ['inscription', 'compte', 'début']
        },
        {
          id: 'first-appointment',
          title: 'Prendre mon premier rendez-vous',
          content: 'Naviguez vers "Rendez-vous" puis "Prendre RDV". Choisissez votre médecin, sélectionnez une date et confirmez votre réservation. Le paiement peut être effectué en ligne ou sur place.',
          tags: ['rendez-vous', 'premier', 'réservation']
        },
        {
          id: 'profile-setup',
          title: 'Configurer mon profil',
          content: 'Accédez à "Mon profil" pour mettre à jour vos informations personnelles, ajouter votre historique médical et configurer vos préférences de notification.',
          tags: ['profil', 'configuration', 'personnel']
        }
      ]
    },
    {
      id: 'appointments',
      name: 'Rendez-vous',
      icon: CalendarIcon,
      color: 'green',
      articles: [
        {
          id: 'book-appointment',
          title: 'Comment réserver un rendez-vous',
          content: 'Choisissez votre spécialité, sélectionnez un médecin disponible, puis choisissez la date et l\'heure qui vous conviennent. Vous recevrez une confirmation par SMS.',
          tags: ['réservation', 'rendez-vous', 'médecin']
        },
        {
          id: 'cancel-appointment',
          title: 'Annuler ou décaler un rendez-vous',
          content: 'Dans "Mes rendez-vous", cliquez sur le rendez-vous concerné et sélectionnez "Annuler" ou "Décaler". Respectez un délai de 24h pour éviter des frais.',
          tags: ['annulation', 'décalage', 'modification']
        },
        {
          id: 'video-consultation',
          title: 'Consultation par visioconférence',
          content: 'Pour une consultation en ligne, assurez-vous d\'avoir une connexion internet stable. Le lien vous sera envoyé 30 minutes avant le rendez-vous.',
          tags: ['visio', 'consultation', 'en ligne']
        }
      ]
    },
    {
      id: 'payment',
      name: 'Paiement',
      icon: CreditCardIcon,
      color: 'purple',
      articles: [
        {
          id: 'payment-methods',
          title: 'Méthodes de paiement acceptées',
          content: 'Nous acceptons les cartes bancaires (Visa, Mastercard), Mobile Money (Orange Money, MTN Mobile Money), les virements bancaires et les paiements par QR code.',
          tags: ['paiement', 'mobile money', 'carte']
        },
        {
          id: 'mobile-money',
          title: 'Payer avec Mobile Money',
          content: 'Sélectionnez Mobile Money, entrez votre numéro (+237 6XX XXX XXX), confirmez le paiement via USSD avec votre code PIN.',
          tags: ['mobile money', 'orange', 'mtn']
        },
        {
          id: 'refunds',
          title: 'Politique de remboursement',
          content: 'En cas d\'annulation 24h avant, vous serez remboursé intégralement. Après ce délai, des frais de 25% peuvent s\'appliquer.',
          tags: ['remboursement', 'annulation', 'frais']
        }
      ]
    },
    {
      id: 'technical',
      name: 'Support technique',
      icon: VideoCameraIcon,
      color: 'red',
      articles: [
        {
          id: 'connection-issues',
          title: 'Problèmes de connexion',
          content: 'Vérifiez votre connexion internet, redémarrez votre navigateur et videz le cache. Pour les visios, testez votre caméra et microphone.',
          tags: ['connexion', 'internet', 'visio']
        },
        {
          id: 'mobile-app',
          title: 'Application mobile',
          content: 'Téléchargez notre application sur Google Play ou App Store. Connectez-vous avec les mêmes identifiants que sur le site.',
          tags: ['mobile', 'application', 'smartphone']
        },
        {
          id: 'browser-compatibility',
          title: 'Navigateurs compatibles',
          content: 'Nous recommandons Chrome, Firefox, Safari ou Edge versions récentes. Évitez Internet Explorer qui n\'est plus supporté.',
          tags: ['navigateur', 'compatibilité', 'chrome']
        }
      ]
    },
    {
      id: 'medical',
      name: 'Services médicaux',
      icon: BuildingOfficeIcon,
      color: 'teal',
      articles: [
        {
          id: 'find-doctor',
          title: 'Trouver un médecin spécialiste',
          content: 'Utilisez la recherche par spécialité, localisation ou nom. Vous pouvez filtrer par disponibilité, langue parlée et tarifs.',
          tags: ['médecin', 'spécialiste', 'recherche']
        },
        {
          id: 'medical-records',
          title: 'Accéder à mon dossier médical',
          content: 'Dans "Dossiers médicaux", consultez votre historique, téléchargez vos ordonnances et partagez vos documents avec d\'autres professionnels.',
          tags: ['dossier', 'ordonnance', 'historique']
        },
        {
          id: 'emergency',
          title: 'Cas d\'urgence',
          content: 'Pour les urgences vitales, appelez le 1510 (SAMU Cameroun) ou rendez-vous à l\'hôpital le plus proche. Notre service d\'urgence est disponible 24/7.',
          tags: ['urgence', 'samu', 'hôpital']
        }
      ]
    }
  ];

  const filteredCategories = categories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
    )
  })).filter(category => category.articles.length > 0);

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const getCategoryColor = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      teal: 'bg-teal-50 text-teal-700 border-teal-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/patient/dashboard"
                className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowRightIcon className="h-5 w-5 mr-2 rotate-180" />
                Retour
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Centre d'aide</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une réponse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-600">
                {filteredCategories.reduce((total, cat) => total + cat.articles.length, 0)} résultat(s) trouvé(s)
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link
            to="/patient/rendez-vous/nouveau"
            className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Prendre RDV
          </Link>
          <a
            href="tel:+237242000123"
            className="flex items-center justify-center p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <PhoneIcon className="h-5 w-5 mr-2" />
            Appeler
          </a>
          <a
            href="mailto:support@mediconnet.cm"
            className="flex items-center justify-center p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            Email
          </a>
          <Link
            to="/patient/messages"
            className="flex items-center justify-center p-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
            Chat
          </Link>
        </div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(category.color)}`}>
                        <category.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    {expandedCategory === category.id ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  {expandedCategory === category.id && (
                    <div className="border-t border-gray-100">
                      {category.articles.map((article) => (
                        <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <h3 className="font-medium text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-3">{article.content}</p>
                          <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredCategories.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <QuestionMarkCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
                <p className="text-gray-600 mb-4">
                  Essayez d'autres mots-clés ou contactez notre support
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                >
                  Effacer la recherche
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contactez le support</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <PhoneIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Téléphone</div>
                    <div className="text-sm text-gray-600">+237 242 000 123</div>
                    <div className="text-xs text-gray-500">Lun-Ven: 8h-18h</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <EnvelopeIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Email</div>
                    <div className="text-sm text-gray-600">support@mediconnet.cm</div>
                    <div className="text-xs text-gray-500">Réponse sous 24h</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Chat en direct</div>
                    <div className="text-sm text-gray-600">Disponible 24/7</div>
                    <div className="text-xs text-gray-500">Réponse instantanée</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment préférez-vous être contacté?
                </label>
                <select
                  value={contactMethod}
                  onChange={(e) => setContactMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Sélectionner...</option>
                  <option value="phone">Par téléphone</option>
                  <option value="email">Par email</option>
                  <option value="chat">Par chat</option>
                </select>
              </div>
            </div>

            {/* Emergency Info */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-red-900 mb-2">Urgences médicales</h4>
                  <p className="text-sm text-red-800 mb-3">
                    Pour les urgences vitales, contactez immédiatement:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-red-800">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      <span className="font-medium">1510 - SAMU Cameroun</span>
                    </div>
                    <div className="flex items-center text-red-800">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      <span className="font-medium">133 - Pompiers</span>
                    </div>
                    <div className="flex items-center text-red-800">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      <span className="font-medium">112 - Numéro d'urgence européen</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Topics */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sujets populaires</h3>
              <div className="space-y-2">
                {[
                  'Comment créer un compte?',
                  'Paiement Mobile Money',
                  'Annuler un rendez-vous',
                  'Consultation par visio',
                  'Trouver un spécialiste'
                ].map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(topic.toLowerCase().split('?')[0])}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* App Info */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-200">
              <div className="flex items-center space-x-3 mb-4">
                <GlobeAltIcon className="h-6 w-6 text-teal-600" />
                <h4 className="font-medium text-teal-900">Application mobile</h4>
              </div>
              <p className="text-sm text-teal-800 mb-4">
                Téléchargez notre application pour accéder à tous vos services de santé où que vous soyez.
              </p>
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-black text-white text-sm rounded-lg">
                  App Store
                </button>
                <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg">
                  Google Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
