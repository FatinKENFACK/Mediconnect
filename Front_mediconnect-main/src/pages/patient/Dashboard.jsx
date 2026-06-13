import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon, ClockIcon, DocumentTextIcon, UserGroupIcon,
  VideoCameraIcon, ArrowLongRightIcon, PlusIcon, BellIcon,
  MagnifyingGlassIcon, ChatBubbleLeftRightIcon, ChevronRightIcon,
  DocumentArrowDownIcon, UserCircleIcon, ChartBarIcon,
  ChatBubbleOvalLeftIcon, MapPinIcon, StarIcon, CreditCardIcon,
  BuildingOfficeIcon, ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// ACTIONS RAPIDES (statique — pas besoin de backend)
// ============================================================
const quickActions = [
  { id: 1, title: 'Prendre RDV', description: 'Nouvelle consultation', icon: CalendarIcon, iconColor: 'text-blue-600', bgColor: 'bg-blue-50', link: '/patient/rendez-vous/nouveau' },
  { id: 2, title: 'Rechercher médecin', description: 'Par spécialité', icon: UserGroupIcon, iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50', link: '/patient/recherche-medecins' },
  { id: 3, title: 'Consultation vidéo', description: 'Démarrer une visio', icon: VideoCameraIcon, iconColor: 'text-purple-600', bgColor: 'bg-purple-50', link: '/patient/consultation-video' },
  { id: 4, title: 'Dossier médical', description: 'Historique santé', icon: DocumentArrowDownIcon, iconColor: 'text-amber-600', bgColor: 'bg-amber-50', link: '/patient/dossiers-medicaux' },
  { id: 5, title: 'Messagerie', description: 'Messages médecins', icon: ChatBubbleLeftRightIcon, iconColor: 'text-red-600', bgColor: 'bg-red-50', link: '/patient/messages' },
  { id: 6, title: 'Hôpitaux', description: 'Proches de moi', icon: BuildingOfficeIcon, iconColor: 'text-indigo-600', bgColor: 'bg-indigo-50', link: '/patient/recherche-hopitaux' },
  { id: 7, title: 'Paiement', description: 'Payer consultation', icon: CreditCardIcon, iconColor: 'text-green-600', bgColor: 'bg-green-50', link: '/patient/paiement' },
  { id: 8, title: 'Mon profil', description: 'Modifier infos', icon: UserCircleIcon, iconColor: 'text-gray-600', bgColor: 'bg-gray-50', link: '/patient/profil' },
];

// ============================================================
// COMPOSANT : Skeleton loader
// ============================================================
const SkeletonStatCard = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
      <div className="h-6 w-12 bg-gray-100 rounded-full"></div>
    </div>
    <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
    <div className="h-7 bg-gray-200 rounded w-16 mb-1"></div>
    <div className="h-3 bg-gray-100 rounded w-32"></div>
  </div>
);

// ============================================================
// COMPOSANT PRINCIPAL : Dashboard Patient
// ============================================================
const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // ---- RDV ----
  const [prochainRdv, setProchainRdv] = useState(null);
  const [rdvList, setRdvList] = useState([]);
  const [loadingRdv, setLoadingRdv] = useState(true);

  // ---- Documents ----
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [totalDocsPending, setTotalDocsPending] = useState(0);

  // ---- Messages ----
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState(true);

  // ============================================================
  // CHARGEMENT : RDV
  // ============================================================
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
        console.error('Erreur chargement RDV:', err);
      } finally {
        setLoadingRdv(false);
      }
    };
    fetchRdv();
  }, []);

  // ============================================================
  // CHARGEMENT : Documents médicaux
  // ============================================================
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await api.getMedicalDocuments();
        // Les 3 plus récents pour l'affichage
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          : [];
        setDocuments(sorted.slice(0, 3));
        setTotalDocsPending(sorted.length);
      } catch (err) {
        console.error('Erreur chargement documents:', err);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDocs();
  }, []);

  // ============================================================
  // CHARGEMENT : Messages non lus
  // GET /api/messaging/conversations/ → on somme les unread_count
  // ============================================================
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await api.getConversations();
        const conversations = Array.isArray(data) ? data : data.results || [];
        const total = conversations.reduce(
          (sum, conv) => sum + (conv.unread_count || 0), 0
        );
        setUnreadMessages(total);
      } catch (err) {
        console.error('Erreur chargement messages:', err);
        setUnreadMessages(0);
      } finally {
        setLoadingMsg(false);
      }
    };
    fetchMessages();
  }, []);

  // ============================================================
  // STATS CARDS (dynamiques)
  // ============================================================
  const loading = loadingRdv || loadingDocs || loadingMsg;

  const statsCards = [
    {
      id: 1,
      name: 'Prochain RDV',
      value: prochainRdv
        ? new Date(prochainRdv.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Aucun RDV',
      subValue: prochainRdv
        ? `${prochainRdv.time.slice(0, 5)} • ${prochainRdv.doctor_name || prochainRdv.doctor_full_name}`
        : 'Prenez un rendez-vous',
      icon: CalendarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/patient/rendez-vous',
    },
    {
      id: 2,
      name: 'Documents médicaux',
      value: totalDocsPending,
      subValue: totalDocsPending === 0 ? 'Aucun document' : `${totalDocsPending} fichier${totalDocsPending > 1 ? 's' : ''} enregistré${totalDocsPending > 1 ? 's' : ''}`,
      icon: DocumentTextIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/patient/documents',
    },
    {
      id: 3,
      name: 'Messages non lus',
      value: unreadMessages,
      subValue: unreadMessages === 0 ? 'Aucun nouveau message' : `${unreadMessages} message${unreadMessages > 1 ? 's' : ''} non lu${unreadMessages > 1 ? 's' : ''}`,
      icon: BellIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      link: '/patient/messages',
    },
    {
      id: 4,
      name: 'Consultations à venir',
      value: rdvList.length,
      subValue: rdvList.length > 0 ? `${rdvList.length} programmée${rdvList.length > 1 ? 's' : ''}` : 'Aucune prévue',
      icon: ChartBarIcon,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      link: '/patient/rendez-vous',
    },
  ];

  // ============================================================
  // HELPER : formatage date document
  // ============================================================
  const formatDocDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  // ============================================================
  // HELPER : type → label couleur document
  // ============================================================
  const docTypeLabel = (type) => {
    const map = {
      'compte_rendu': { label: 'Compte-rendu', cls: 'bg-blue-100 text-blue-800' },
      'ordonnance': { label: 'Ordonnance', cls: 'bg-amber-100 text-amber-800' },
      'analyse': { label: 'Analyse', cls: 'bg-purple-100 text-purple-800' },
      'radio': { label: 'Radio', cls: 'bg-indigo-100 text-indigo-800' },
      'autre': { label: 'Autre', cls: 'bg-gray-100 text-gray-800' },
    };
    return map[type] || { label: type || 'Document', cls: 'bg-gray-100 text-gray-800' };
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-8 p-4 md:p-6">

      {/* ====== HEADER ====== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">
              {(user?.first_name?.[0] || '') + (user?.last_name?.[0] || '') || '?'}
            </span>
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
        <div className="relative max-w-md w-full lg:w-auto">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Rechercher un document, un médecin..."
            className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* ====== STATS CARDS ====== */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? [1, 2, 3, 4].map(i => <SkeletonStatCard key={i} />)
          : statsCards.map((stat) => (
            <Link
              key={stat.id}
              to={stat.link}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-teal-200 transition-all duration-200 p-6 block"
            >
              <div className="flex items-start justify-between">
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                {/* Badge rouge si messages non lus */}
                {stat.id === 3 && unreadMessages > 0 && (
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-500 text-white text-xs font-bold">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.subValue && (
                  <p className="mt-1 text-sm text-gray-500 truncate">{stat.subValue}</p>
                )}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs text-teal-600 font-medium">Voir →</span>
              </div>
            </Link>
          ))
        }
      </div>

      {/* ====== RDV + ACTIONS RAPIDES ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Prochains rendez-vous */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Prochains rendez-vous</h2>
              <p className="mt-1 text-sm text-gray-500">Vos consultations programmées</p>
            </div>
            <Link to="/patient/rendez-vous" className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
              Voir tout <ChevronRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {loadingRdv ? (
              <div className="p-6 space-y-4 animate-pulse">
                {[1, 2].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>)}
              </div>
            ) : rdvList.length > 0 ? rdvList.map((rdv) => (
              <div key={rdv.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-teal-100 p-3 rounded-xl">
                    <CalendarIcon className="h-6 w-6 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {rdv.doctor_full_name || rdv.doctor_name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4 flex-shrink-0" />
                          <span>
                            {new Date(rdv.date).toLocaleDateString('fr-FR', {
                              day: 'numeric', month: 'long', year: 'numeric',
                            })} à {rdv.time ? rdv.time.slice(0, 5) : '--:--'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {rdv.doctor_specialization || rdv.doctor_specialty || ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${rdv.type === 'video'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-teal-50 text-teal-700'
                          }`}>
                          {rdv.type === 'video'
                            ? <><VideoCameraIcon className="h-3 w-3" /> Vidéo</>
                            : <><MapPinIcon className="h-3 w-3" /> Présentiel</>
                          }
                        </span>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${rdv.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-yellow-50 text-yellow-700'
                          }`}>
                          {rdv.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4 flex-wrap">
                      <Link to="/patient/messages" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700">
                        <ChatBubbleOvalLeftIcon className="h-4 w-4" />
                        Envoyer un message
                      </Link>
                      <Link to="/patient/paiement" className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700">
                        <CreditCardIcon className="h-4 w-4" />
                        Payer
                      </Link>
                      <Link
                        to="/patient/avis"
                        state={{
                          consultation: {
                            id: rdv.id,
                            appointmentId: rdv.id,
                            doctor: {
                              id: rdv.doctor,
                              name: rdv.doctor_full_name || rdv.doctor_name || 'Médecin',
                              specialty: rdv.doctor_specialization || rdv.doctor_specialty || '',
                              avatar: '/api/placeholder/100/100',
                            },
                            date: new Date(rdv.date).toLocaleDateString('fr-FR', {
                              day: 'numeric', month: 'long', year: 'numeric'
                            }),
                            time: rdv.time ? rdv.time.slice(0, 5) : '',
                            type: rdv.type === 'video' ? 'En ligne' : 'Présentiel',
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        <StarIcon className="h-4 w-4" />
                        Avis
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">Aucun rendez-vous à venir</h3>
                <p className="mt-1 text-sm text-gray-500">Prenez votre premier rendez-vous</p>
                <div className="mt-6">
                  <Link
                    to="/patient/rendez-vous/nouveau"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                  >
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
            <p className="mt-1 text-sm text-gray-500">Accès rapide aux services</p>
          </div>
          <div className="p-4 space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.id}
                to={action.link}
                className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition-all duration-200"
              >
                <div className={`flex-shrink-0 ${action.bgColor} p-2 rounded-lg group-hover:scale-105 transition-transform duration-200`}>
                  <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-teal-700">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
                {/* Badge messages non lus sur l'action Messagerie */}
                {action.id === 5 && unreadMessages > 0 && (
                  <span className="flex-shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
                <ArrowLongRightIcon className="h-4 w-4 text-gray-300 group-hover:text-teal-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ====== DOCUMENTS MÉDICAUX (données réelles) ====== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Derniers documents médicaux</h2>
            <p className="mt-1 text-sm text-gray-500">Vos fichiers médicaux récents</p>
          </div>
          <Link to="/patient/documents" className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
            Voir tout <ChevronRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {loadingDocs ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>)}
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">Aucun document médical pour l'instant</p>
            <Link to="/patient/documents" className="mt-4 inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700">
              Ajouter un document →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {documents.map((doc) => {
              const typeInfo = docTypeLabel(doc.type);
              return (
                <div key={doc.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <DocumentTextIcon className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                            <span>{formatDocDate(doc.created_at)}</span>
                            {doc.size && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span>{doc.size}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.cls}`}>
                            {typeInfo.label}
                          </span>
                          {doc.file_url && (
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
                            >
                              <ArrowDownTrayIcon className="h-3 w-3" />
                              Télécharger
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ====== BANNIÈRE ====== */}
      <div className="bg-teal-600 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white">Votre santé, notre priorité</h2>
            <p className="mt-3 text-teal-100">
              Accédez à tous vos services de santé en un seul endroit.
            </p>
            <div className="mt-6">
              <Link
                to="/patient/rendez-vous/nouveau"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-600 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
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