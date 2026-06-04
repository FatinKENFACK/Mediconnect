import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  VideoCameraIcon,
  FolderIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  UserGroupIcon,
  ClockIcon,
  ClipboardDocumentCheckIcon,
  ChartPieIcon,
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// COMPOSANT : Badge de statut RDV
// ============================================================
const StatusBadge = ({ status }) => {
  const config = {
    confirmed: { label: 'Confirmé', cls: 'bg-green-100 text-green-800' },
    pending:   { label: 'En attente', cls: 'bg-yellow-100 text-yellow-800' },
    cancelled: { label: 'Annulé', cls: 'bg-red-100 text-red-800' },
    completed: { label: 'Terminé', cls: 'bg-gray-100 text-gray-800' },
  };
  const s = config[status] || config.pending;
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL : DashboardDoctor
// ============================================================
const DashboardDoctor = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // ---- État du profil médecin ----
  const [doctor, setDoctor] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ---- État des stats et RDV ----
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    confirmed: 0,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState(null);

  // ============================================================
  // CHARGEMENT DES DONNÉES AU MONTAGE
  // ============================================================
  useEffect(() => {
    const loadAll = async () => {
      try {
        // 1. Profil médecin
        const profileData = await api.getDoctorProfile();
        setDoctor(profileData);
      } catch (err) {
        console.error('Erreur profil médecin:', err);
        // Fallback sur localStorage si le profil échoue
        const userLocal = JSON.parse(localStorage.getItem('user') || '{}');
        setDoctor(userLocal);
      } finally {
        setLoadingProfile(false);
      }

      try {
        // 2. Stats + RDV à venir (un seul appel)
        const statsData = await api.getDoctorAppointmentsToday();
        setStats({
          total:     statsData.total || 0,
          today:     statsData.today || 0,
          pending:   statsData.pending || 0,
          confirmed: statsData.confirmed || 0,
        });
        setUpcomingAppointments(statsData.upcoming || []);
      } catch (err) {
        console.error('Erreur stats médecin:', err);
        setError('Impossible de charger les statistiques.');
      } finally {
        setLoadingStats(false);
      }
    };

    loadAll();
  }, []);

  // ============================================================
  // CHANGER LE STATUT D'UN RDV
  // ============================================================
  const handleStatusChange = async (rdvId, newStatus) => {
    try {
      await api.updateAppointmentStatus(rdvId, newStatus);
      // Mettre à jour localement sans recharger toute la page
      setUpcomingAppointments(prev =>
        prev.map(rdv => rdv.id === rdvId ? { ...rdv, status: newStatus } : rdv)
      );
      // Recalculer les compteurs
      setStats(prev => {
        const updated = { ...prev };
        if (newStatus === 'confirmed') {
          updated.confirmed += 1;
          updated.pending = Math.max(0, updated.pending - 1);
        } else if (newStatus === 'cancelled') {
          updated.pending = Math.max(0, updated.pending - 1);
        }
        return updated;
      });
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  // ============================================================
  // DÉCONNEXION
  // ============================================================
  const handleLogout = () => {
    api.logout();
    navigate('/connexion');
  };

  // ============================================================
  // NAVIGATION SIDEBAR
  // ============================================================
  const navigation = [
    { name: 'Tableau de bord',  href: '/medecin',                  icon: ChartBarIcon,           current: location.pathname === '/medecin' },
    { name: 'Agenda',           href: '/medecin/agenda',            icon: CalendarIcon,            current: location.pathname.includes('agenda') },
    { name: 'Disponibilités',   href: '/medecin/disponibilites',    icon: ClockIcon,               current: location.pathname.includes('disponibilites') },
    { name: 'Consultations',    href: '/medecin/consultations',     icon: VideoCameraIcon,         current: location.pathname.includes('consultations') },
    { name: 'Dossiers patients',href: '/medecin/dossiers',          icon: FolderIcon,              current: location.pathname.includes('dossiers') },
    { name: 'Comptes-rendus',   href: '/medecin/comptes-rendus',    icon: DocumentTextIcon,        current: location.pathname.includes('comptes-rendus') },
    { name: 'Prescriptions',    href: '/medecin/prescriptions',     icon: ClipboardDocumentCheckIcon, current: location.pathname.includes('prescriptions') },
    { name: 'Messagerie',       href: '/medecin/messagerie',        icon: ChatBubbleLeftRightIcon, current: location.pathname.includes('messagerie') },
    { name: 'Statistiques',     href: '/medecin/statistiques',      icon: ChartPieIcon,            current: location.pathname.includes('statistiques') },
  ];

  // ============================================================
  // SKELETON LOADER (pendant le chargement)
  // ============================================================
  const SkeletonCard = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-3/4"></div>
    </div>
  );

  // ============================================================
  // CARDS STATISTIQUES (depuis le backend)
  // ============================================================
  const statCards = [
    {
      name: "RDV aujourd'hui",
      value: stats.today,
      icon: CalendarIcon,
      color: 'blue',
      description: 'consultations ce jour',
    },
    {
      name: 'En attente',
      value: stats.pending,
      icon: ClockIcon,
      color: 'yellow',
      description: 'à confirmer',
    },
    {
      name: 'Confirmés',
      value: stats.confirmed,
      icon: CheckCircleIcon,
      color: 'green',
      description: 'rendez-vous validés',
    },
    {
      name: 'Total RDV',
      value: stats.total,
      icon: ChartBarIcon,
      color: 'purple',
      description: 'depuis le début',
    },
  ];

  const colorMap = {
    blue:   { bg: 'bg-blue-100',   icon: 'text-blue-600',   value: 'text-blue-700' },
    yellow: { bg: 'bg-yellow-100', icon: 'text-yellow-600', value: 'text-yellow-700' },
    green:  { bg: 'bg-green-100',  icon: 'text-green-600',  value: 'text-green-700' },
    purple: { bg: 'bg-purple-100', icon: 'text-purple-600', value: 'text-purple-700' },
  };

  // ============================================================
  // NOM D'AFFICHAGE DU MÉDECIN
  // ============================================================
  const doctorDisplayName = doctor
    ? `Dr. ${doctor.first_name || ''} ${doctor.last_name || ''}`.trim()
    : 'Dr. ...';

  const doctorSpecialty = doctor?.specialization || '';

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-100">

      {/* ====== SIDEBAR ====== */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-30 w-64 bg-white shadow-lg transition duration-200 ease-in-out`}>
        <div className="flex flex-col h-full">

          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 bg-blue-600 text-white">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 mr-2" />
              <span className="text-xl font-semibold">Médecin</span>
            </div>
            <button className="md:hidden text-white" onClick={() => setSidebarOpen(false)}>
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-200 ${
                  item.current
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${item.current ? 'text-blue-500' : 'text-gray-400'}`} />
                {item.name}
                {/* Badge messagerie */}
                {item.name === 'Messagerie' && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    {stats.pending > 0 ? stats.pending : ''}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Profil médecin dans la sidebar */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {doctor?.profile_picture ? (
                  <img
                    src={`http://localhost:8000${doctor.profile_picture}`}
                    className="h-10 w-10 rounded-full object-cover"
                    alt="Profil"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-700 font-semibold text-sm">
                      {(doctor?.first_name?.[0] || '') + (doctor?.last_name?.[0] || '')}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{doctorDisplayName}</p>
                <p className="text-xs text-gray-500 truncate">{doctorSpecialty}</p>
              </div>
              <div className="flex items-center space-x-1 ml-1">
                <Link to="/medecin/parametres" className="text-gray-400 hover:text-gray-600">
                  <Cog6ToothIcon className="h-5 w-5" />
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500" title="Se déconnecter">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====== HEADER MOBILE ====== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-lg font-semibold text-gray-900">MediConnect</div>
          <div className="w-6"></div>
        </div>
      </div>

      {/* ====== CONTENU PRINCIPAL ====== */}
      <div className="md:ml-64 pt-16 md:pt-0">
        <main className="p-4 md:p-8">

          {/* En-tête */}
          <div className="pb-5 border-b border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
                {loadingProfile ? (
                  <div className="h-4 bg-gray-200 rounded w-48 mt-1 animate-pulse"></div>
                ) : (
                  <p className="mt-1 text-sm text-gray-500">
                    Bienvenue, {doctorDisplayName}
                    {doctorSpecialty && ` • ${doctorSpecialty}`}
                  </p>
                )}
              </div>
              <div className="flex space-x-3">
                <Link
                  to="/medecin/consultations"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <VideoCameraIcon className="-ml-1 mr-2 h-4 w-4" />
                  Nouvelle consultation
                </Link>
                <Link
                  to="/medecin/agenda"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <CalendarIcon className="-ml-1 mr-2 h-4 w-4" />
                  Agenda
                </Link>
              </div>
            </div>
          </div>

          {/* Alerte erreur */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* ====== STATISTIQUES (données réelles) ====== */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {loadingStats
              ? [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
              : statCards.map((stat) => {
                  const c = colorMap[stat.color];
                  return (
                    <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 p-2 rounded-lg ${c.bg}`}>
                            <stat.icon className={`h-6 w-6 ${c.icon}`} />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                            <p className={`text-2xl font-bold ${c.value}`}>{stat.value}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-5 py-2">
                        <p className="text-xs text-gray-500">{stat.description}</p>
                      </div>
                    </div>
                  );
                })
            }
          </div>

          {/* ====== PROCHAINS RDV (données réelles) ====== */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Prochains rendez-vous</h2>
              <Link to="/medecin/agenda" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Voir tout →
              </Link>
            </div>

            {loadingStats ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="p-12 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-3 text-sm text-gray-500">Aucun rendez-vous à venir</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {upcomingAppointments.map((rdv) => (
                  <li key={rdv.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      {/* Infos patient */}
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-700 font-medium text-sm">
                            {(rdv.patient_name || '?').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{rdv.patient_name}</p>
                          <p className="text-xs text-gray-500">{rdv.reason || 'Consultation'}</p>
                        </div>
                      </div>

                      {/* Date + heure */}
                      <div className="flex items-center text-sm text-gray-600 space-x-2">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        <span>
                          {new Date(rdv.date).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                        <ClockIcon className="h-4 w-4 text-gray-400 ml-1" />
                        <span>{rdv.time ? rdv.time.slice(0, 5) : '--:--'}</span>
                      </div>

                      {/* Type + statut */}
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rdv.type === 'video'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {rdv.type === 'video' ? '📹 Vidéo' : '🏥 Présentiel'}
                        </span>
                        <StatusBadge status={rdv.status} />
                      </div>

                      {/* Actions rapides */}
                      <div className="flex items-center gap-2">
                        {rdv.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(rdv.id, 'confirmed')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700"
                              title="Confirmer"
                            >
                              <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                              Confirmer
                            </button>
                            <button
                              onClick={() => handleStatusChange(rdv.id, 'cancelled')}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                              title="Annuler"
                            >
                              <XCircleIcon className="h-3.5 w-3.5 mr-1" />
                              Annuler
                            </button>
                          </>
                        )}
                        {rdv.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(rdv.id, 'completed')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <DocumentTextIcon className="h-3.5 w-3.5 mr-1" />
                            Terminer
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ====== INFO PROFIL MÉDECIN ====== */}
          {!loadingProfile && doctor && (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Mon profil</h2>
                <Link to="/medecin/parametres" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Modifier →
                </Link>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Spécialité</p>
                  <p className="font-medium text-gray-900">{doctor.specialization || '—'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Expérience</p>
                  <p className="font-medium text-gray-900">
                    {doctor.experience_years ? `${doctor.experience_years} ans` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Tarif présentiel</p>
                  <p className="font-medium text-gray-900">
                    {doctor.fee_in_person ? `${Number(doctor.fee_in_person).toLocaleString()} XAF` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Statut</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    doctor.is_verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doctor.is_verified ? '✓ Vérifié' : '⏳ En attente'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ====== CONTENU DYNAMIQUE (sous-routes) ====== */}
          <Outlet />

        </main>
      </div>
    </div>
  );
};

export default DashboardDoctor;