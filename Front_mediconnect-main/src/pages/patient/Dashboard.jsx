import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarIcon, ClockIcon, DocumentTextIcon, UserGroupIcon,
  VideoCameraIcon, ArrowLongRightIcon, PlusIcon, BellIcon,
  MagnifyingGlassIcon, ChatBubbleLeftRightIcon, ChevronRightIcon,
  DocumentArrowDownIcon, UserCircleIcon, ChartBarIcon,
  ChatBubbleOvalLeftIcon, MapPinIcon, StarIcon, CreditCardIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const stats = [
  { 
    id: 1, 
    name: 'Prochain RDV', 
    value: '15 Déc 2023', 
    subValue: '09:00 • Dr. Martin',
    icon: CalendarIcon, 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50',
    trend: { value: '+2.6%', type: 'increase' }
  },
  { 
    id: 2, 
    name: 'Documents en attente', 
    value: '2', 
    subValue: 'À signer',
    icon: DocumentTextIcon, 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50',
    trend: { value: '+0.5%', type: 'increase' }
  },
  { 
    id: 3, 
    name: 'Messages non lus', 
    value: '3', 
    subValue: 'Dans la messagerie',
    icon: BellIcon, 
    color: 'text-amber-600', 
    bgColor: 'bg-amber-50',
    trend: { value: '-0.1%', type: 'decrease' }
  },
  { 
    id: 4, 
    name: 'Consultations cette semaine', 
    value: '1', 
    subValue: 'Prochaine dans 2 jours',
    icon: ChartBarIcon, 
    color: 'text-emerald-600', 
    bgColor: 'bg-emerald-50',
    trend: { value: '+12%', type: 'increase' }
  },
];

const appointments = [
  { 
    id: 1, 
    name: 'Consultation de suivi', 
    date: '15 Déc 2023', 
    time: '09:00', 
    doctor: 'Dr. Martin', 
    type: 'En ligne', 
    status: 'Confirmé',
    avatarColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  { 
    id: 2, 
    name: 'Examen médical', 
    date: '20 Déc 2023', 
    time: '14:30', 
    doctor: 'Dr. Lefebvre', 
    type: 'Présentiel', 
    status: 'Confirmé',
    avatarColor: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
];

const documents = [
  { 
    id: 1, 
    name: 'Compte-rendu consultation', 
    date: '10 Déc 2023', 
    type: 'PDF', 
    size: '2.4 MB',
    status: 'À consulter',
    statusColor: 'bg-blue-100 text-blue-800'
  },
  { 
    id: 2, 
    name: 'Résultats analyse sanguine', 
    date: '5 Déc 2023', 
    type: 'PDF', 
    size: '1.8 MB',
    status: 'Consulté',
    statusColor: 'bg-gray-100 text-gray-800'
  },
  { 
    id: 3, 
    name: 'Ordonnance médicale', 
    date: '3 Déc 2023', 
    type: 'PDF', 
    size: '1.2 MB',
    status: 'À signer',
    statusColor: 'bg-amber-100 text-amber-800'
  },
];

const quickActions = [
  {
    id: 1,
    title: 'Prendre RDV',
    description: 'Nouvelle consultation',
    icon: CalendarIcon,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    link: '/patient/rendez-vous/nouveau',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    title: 'Rechercher médecin',
    description: 'Par spécialité',
    icon: UserGroupIcon,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    link: '/patient/recherche-medecins',
    gradient: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 3,
    title: 'Consultation vidéo',
    description: 'Démarrer une visio',
    icon: VideoCameraIcon,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    link: '/patient/consultation-video',
    gradient: 'from-purple-500 to-purple-600'
  },
  {
    id: 4,
    title: 'Dossier médical',
    description: 'Historique santé',
    icon: DocumentArrowDownIcon,
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    link: '/patient/dossiers-medicaux',
    gradient: 'from-amber-500 to-amber-600'
  },
  {
    id: 5,
    title: 'Messagerie',
    description: 'Messages médecins',
    icon: ChatBubbleLeftRightIcon,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-50',
    link: '/patient/messages',
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 6,
    title: 'Hôpitaux',
    description: 'Proches de moi',
    icon: BuildingOfficeIcon,
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    link: '/patient/recherche-hopitaux',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 7,
    title: 'Paiement',
    description: 'Payer consultation',
    icon: CreditCardIcon,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
    link: '/patient/paiement',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 8,
    title: 'Mon profil',
    description: 'Modifier infos',
    icon: UserCircleIcon,
    iconColor: 'text-gray-600',
    bgColor: 'bg-gray-50',
    link: '/patient/profil',
    gradient: 'from-gray-500 to-gray-600'
  }
];

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [prochainRdv, setProchainRdv] = useState(null);
  const [rdvList, setRdvList] = useState([]);

  useEffect(() => {
    const fetchRdv = async () => {
      try {
        const data = await api.getAppointments();
        const aujourd_hui = new Date().toISOString().split('T')[0];
        const rdvAVenir = data
          .filter(rdv =>
            (rdv.status === 'pending' || rdv.status === 'confirmed') &&
            rdv.date >= aujourd_hui
          )
          .sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.time.localeCompare(b.time);
          });
        setRdvList(rdvAVenir.slice(0, 2));
        if (rdvAVenir.length > 0) setProchainRdv(rdvAVenir[0]);
      } catch (err) {
        console.error('Erreur chargement RDV', err);
      }
    };
    fetchRdv();
  }, []);

  const stats = [
    { 
      id: 1, 
      name: 'Prochain RDV', 
      value: prochainRdv
        ? new Date(prochainRdv.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Aucun RDV',
      subValue: prochainRdv
        ? `${prochainRdv.time.slice(0, 5)} • ${prochainRdv.doctor_name}`
        : 'Prenez un rendez-vous',
      icon: CalendarIcon, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      trend: { value: '+2.6%', type: 'increase' }
    },
    { 
      id: 2, 
      name: 'Documents en attente', 
      value: '2', 
      subValue: 'À signer',
      icon: DocumentTextIcon, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50',
      trend: { value: '+0.5%', type: 'increase' }
    },
    { 
      id: 3, 
      name: 'Messages non lus', 
      value: '3', 
      subValue: 'Dans la messagerie',
      icon: BellIcon, 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-50',
      trend: { value: '-0.1%', type: 'decrease' }
    },
    { 
      id: 4, 
      name: 'Consultations cette semaine', 
      value: rdvList.length.toString(), 
      subValue: rdvList.length > 0 ? `${rdvList.length} à venir` : 'Aucune prévue',
      icon: ChartBarIcon, 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50',
      trend: { value: '+12%', type: 'increase' }
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
              <UserCircleIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Bonjour, {user?.first_name} {user?.last_name} 
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Bienvenue sur votre espace personnel de santé
              </p>
            </div>
          </div>
        </div>
        <div className="relative max-w-md w-full lg:w-auto">
          <div className="relative flex items-center">
            <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Rechercher un document, un médecin..."
              className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 p-6">
            <div className="flex items-start justify-between">
              <div className={`${stat.bgColor} p-3 rounded-xl`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${stat.trend.type === 'increase' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {stat.trend.value}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
              {stat.subValue && <p className="mt-1 text-sm text-gray-500">{stat.subValue}</p>}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-500">Mis à jour à l'instant</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prochains rendez-vous */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Prochains rendez-vous</h2>
                <p className="mt-1 text-sm text-gray-500">Vos consultations programmées</p>
              </div>
              <Link to="/patient/rendez-vous" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
                Voir tout <ChevronRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {rdvList.length > 0 ? rdvList.map((rdv) => (
              <div key={rdv.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-teal-100 p-3 rounded-xl">
                    <CalendarIcon className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{rdv.doctor_name}</h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4" />
                          <span>
                            {new Date(rdv.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à {rdv.time.slice(0, 5)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{rdv.doctor_specialty}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                          {rdv.type === 'video' ? (
                            <><VideoCameraIcon className="h-3 w-3" /> Vidéo</>
                          ) : (
                            <><MapPinIcon className="h-3 w-3" /> Présentiel</>
                          )}
                        </span>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${rdv.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700'}`}>
                          {rdv.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <Link to="/patient/messages" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700">
                        <ChatBubbleOvalLeftIcon className="h-4 w-4" />
                        Envoyer un message
                      </Link>
                      <Link to="/patient/paiement" className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700">
                        <CreditCardIcon className="h-4 w-4" />
                        Payer
                      </Link>
                      <Link to="/patient/avis" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700">
                        <StarIcon className="h-4 w-4" />
                        Donner un avis
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">Aucun rendez-vous à venir</h3>
                <p className="mt-1 text-sm text-gray-500">Prenez votre premier rendez-vous pour commencer</p>
                <div className="mt-6">
                  <Link to="/patient/rendez-vous/nouveau" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700">
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    Nouveau rendez-vous
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Actions rapides</h2>
            <p className="mt-1 text-sm text-gray-500">Accès rapide aux services principaux</p>
          </div>
          <div className="p-6 space-y-4">
            {quickActions.map((action) => (
              <Link key={action.id} to={action.link} className="group relative flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                <div className={`flex-shrink-0 ${action.bgColor} p-3 rounded-lg group-hover:scale-105 transition-transform duration-200`}>
                  <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{action.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{action.description}</p>
                </div>
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
                    <ArrowLongRightIcon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Derniers documents - statique pour l'instant */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Derniers documents</h2>
              <p className="mt-1 text-sm text-gray-500">Vos fichiers médicaux récents</p>
            </div>
            <Link to="/patient/documents" className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700">
              Voir tout <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {documents.map((document) => (
            <div key={document.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <DocumentTextIcon className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 truncate">{document.name}</h3>
                      <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                        <span>{document.date}</span>
                        <span className="text-gray-300">•</span>
                        <span>{document.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${document.statusColor}`}>{document.status}</span>
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{document.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bannière */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white">Votre santé, notre priorité</h2>
            <p className="mt-3 text-primary-100">
              Accédez à tous vos services de santé en un seul endroit.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link to="/patient/rendez-vous/nouveau" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary-600 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200">
                <PlusIcon className="h-5 w-5" />
                Nouvelle consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;