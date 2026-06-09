import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon, CalendarIcon, ClockIcon,
  CheckCircleIcon, XCircleIcon, PlusIcon,
  BuildingOfficeIcon, ChartBarIcon, ArrowPathIcon,
  VideoCameraIcon, MapPinIcon, ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// COMPOSANT : Carte statistique
// ============================================================
const StatCard = ({ title, value, subtitle, icon: Icon, colorBg, colorIcon, colorValue }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${colorValue || 'text-gray-900'}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl ${colorBg}`}>
        <Icon className={`h-7 w-7 ${colorIcon}`} />
      </div>
    </div>
  </div>
);

// ============================================================
// COMPOSANT : Skeleton loader
// ============================================================
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-3 bg-gray-100 rounded w-32"></div>
      </div>
      <div className="h-14 w-14 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);

// ============================================================
// COMPOSANT : Badge statut RDV
// ============================================================
const StatusBadge = ({ status }) => {
  const map = {
    confirmed: { label: 'Confirmé',   cls: 'bg-green-100 text-green-800' },
    pending:   { label: 'En attente', cls: 'bg-yellow-100 text-yellow-800' },
    cancelled: { label: 'Annulé',     cls: 'bg-red-100 text-red-800' },
    completed: { label: 'Terminé',    cls: 'bg-blue-100 text-blue-800' },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL : HospitalDashboard
// ============================================================
const HospitalDashboard = () => {
  const [stats, setStats]                   = useState(null);
  const [appointments, setAppointments]     = useState([]);
  const [doctors, setDoctors]               = useState([]);
  const [hospitalProfile, setHospitalProfile] = useState(null);
  const [loadingStats, setLoadingStats]     = useState(true);
  const [loadingRdv, setLoadingRdv]         = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [error, setError]                   = useState(null);
  const [lastRefresh, setLastRefresh]       = useState(null);

  // ============================================================
  // CHARGEMENT
  // ============================================================
  const loadAll = async () => {
    setLoadingStats(true);
    setLoadingRdv(true);
    setLoadingDoctors(true);
    setError(null);

    // 1. Profil hôpital
    try {
      const profile = await api.getHospitalProfile();
      setHospitalProfile(profile);
    } catch {}

    // 2. Stats dashboard
    try {
      const data = await api.getHospitalStats();
      setStats(data);
    } catch (err) {
      setError('Impossible de charger les statistiques.');
    } finally {
      setLoadingStats(false);
    }

    // 3. RDV récents
    try {
      const data = await api.getHospitalAppointments();
      const list = Array.isArray(data) ? data : [];
      // Trier par date desc, garder les 5 plus récents
      const sorted = list
        .sort((a, b) => {
          if (b.date !== a.date) return b.date.localeCompare(a.date);
          return b.time.localeCompare(a.time);
        })
        .slice(0, 5);
      setAppointments(sorted);
    } catch {
      setAppointments([]);
    } finally {
      setLoadingRdv(false);
    }

    // 4. Médecins de l'hôpital
    try {
      const data = await api.getHospitalDoctors();
      const list = Array.isArray(data) ? data : data.results || [];
      setDoctors(list.slice(0, 4)); // On affiche les 4 premiers
    } catch {
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }

    setLastRefresh(new Date());
  };

  useEffect(() => { loadAll(); }, []);

  // ============================================================
  // DONNÉES STATS
  // ============================================================
  const statCards = [
    {
      title:      'Médecins total',
      value:      stats?.total_doctors ?? '—',
      subtitle:   stats ? `${stats.verified_doctors} vérifiés` : '',
      icon:       UserGroupIcon,
      colorBg:    'bg-blue-50',
      colorIcon:  'text-blue-600',
      colorValue: 'text-blue-700',
    },
    {
      title:      "RDV aujourd'hui",
      value:      stats?.today_appointments ?? '—',
      subtitle:   'Consultations du jour',
      icon:       CalendarIcon,
      colorBg:    'bg-teal-50',
      colorIcon:  'text-teal-600',
      colorValue: 'text-teal-700',
    },
    {
      title:      'En attente',
      value:      stats?.pending_appointments ?? '—',
      subtitle:   'À confirmer',
      icon:       ClockIcon,
      colorBg:    'bg-yellow-50',
      colorIcon:  'text-yellow-600',
      colorValue: stats?.pending_appointments > 0 ? 'text-yellow-600' : 'text-gray-900',
    },
    {
      title:      'Total RDV',
      value:      stats?.total_appointments ?? '—',
      subtitle:   'Depuis le début',
      icon:       ChartBarIcon,
      colorBg:    'bg-purple-50',
      colorIcon:  'text-purple-600',
      colorValue: 'text-purple-700',
    },
  ];

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="p-6 space-y-6">

      {/* ====== HEADER ====== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {hospitalProfile?.name || 'Votre établissement'}
            {hospitalProfile?.city && ` · ${hospitalProfile.city}`}
            {lastRefresh && (
              <span className="ml-2 text-gray-400">
                · Mis à jour à {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAll}
            disabled={loadingStats}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <Link
            to="/hopital/ajouter-medecin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <PlusIcon className="h-4 w-4" />
            Ajouter un médecin
          </Link>
        </div>
      </div>

      {/* ====== ALERTE SI EN ATTENTE DE VALIDATION ====== */}
      {hospitalProfile && !hospitalProfile.is_verified && (
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Compte en attente de validation</p>
            <p className="text-sm text-yellow-700 mt-0.5">
              Votre établissement est en cours de vérification par un administrateur. Certaines fonctionnalités peuvent être limitées.
            </p>
          </div>
        </div>
      )}

      {/* ====== ERREUR ====== */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <XCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={loadAll} className="ml-auto text-sm text-red-700 underline">Réessayer</button>
        </div>
      )}

      {/* ====== STATS CARDS ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingStats
          ? [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
          : statCards.map(card => <StatCard key={card.title} {...card} />)
        }
      </div>

      {/* ====== RDV RÉCENTS + MÉDECINS ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Rendez-vous récents */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Rendez-vous récents</h2>
              <p className="text-sm text-gray-500 mt-0.5">Consultations de vos médecins</p>
            </div>
            <Link to="/hopital/rendez-vous" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Voir tout →
            </Link>
          </div>

          {loadingRdv ? (
            <div className="p-6 space-y-3 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>)}
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">Aucun rendez-vous pour l'instant</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {appointments.map(rdv => (
                <li key={rdv.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                    {/* Patient + médecin */}
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 font-medium text-sm">
                          {(rdv.patient_name || '?').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{rdv.patient_name || 'Patient'}</p>
                        <p className="text-xs text-gray-500">
                          {rdv.doctor_full_name || rdv.doctor_name || 'Médecin'}
                        </p>
                      </div>
                    </div>

                    {/* Date + heure */}
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {new Date(rdv.date).toLocaleDateString('fr-FR', {
                          day: 'numeric', month: 'short',
                        })}
                      </span>
                      <ClockIcon className="h-4 w-4 ml-1" />
                      <span>{rdv.time ? rdv.time.slice(0, 5) : '--:--'}</span>
                    </div>

                    {/* Type + statut */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rdv.type === 'video' ? 'bg-purple-50 text-purple-700' : 'bg-teal-50 text-teal-700'
                      }`}>
                        {rdv.type === 'video'
                          ? <><VideoCameraIcon className="h-3 w-3" /> Vidéo</>
                          : <><MapPinIcon className="h-3 w-3" /> Présentiel</>
                        }
                      </span>
                      <StatusBadge status={rdv.status} />
                    </div>

                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Médecins de l'hôpital */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Nos médecins</h2>
            <Link to="/hopital/medecins" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Voir tout →
            </Link>
          </div>

          {loadingDoctors ? (
            <div className="p-6 space-y-3 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-28 mb-1"></div>
                    <div className="h-3 bg-gray-100 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="p-8 text-center">
              <UserGroupIcon className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">Aucun médecin rattaché</p>
              <Link to="/hopital/ajouter-medecin"
                className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                <PlusIcon className="h-4 w-4" />
                Ajouter un médecin
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {doctors.map(doctor => (
                <li key={doctor.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      {doctor.profile_picture ? (
                        <img src={`http://localhost:8000${doctor.profile_picture}`}
                          className="h-10 w-10 rounded-full object-cover" alt="" />
                      ) : (
                        <span className="text-blue-700 font-medium text-sm">
                          {(doctor.first_name?.[0] || '') + (doctor.last_name?.[0] || '')}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        Dr. {doctor.first_name} {doctor.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{doctor.specialization || '—'}</p>
                    </div>
                    <span className={`flex-shrink-0 inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      doctor.is_verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {doctor.is_verified ? '✓' : '⏳'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Infos profil hôpital en bas */}
          {hospitalProfile && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                <p className="text-xs text-gray-500 truncate">
                  Code hôpital :{' '}
                  <span className="font-mono font-medium text-gray-700">
                    {hospitalProfile.registration_code || '—'}
                  </span>
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Partagez ce code aux médecins pour qu'ils s'inscrivent.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ====== ACTIONS RAPIDES ====== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/hopital/medecins"
            className="group p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all text-left">
            <UserGroupIcon className="h-6 w-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-gray-900 text-sm">Gérer les médecins</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats ? `${stats.total_doctors} médecin${stats.total_doctors > 1 ? 's' : ''}` : '—'}
            </p>
          </Link>

          <Link to="/hopital/rendez-vous"
            className="group p-4 border border-gray-200 rounded-xl hover:bg-teal-50 hover:border-teal-300 transition-all text-left">
            <CalendarIcon className="h-6 w-6 text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-gray-900 text-sm">Rendez-vous</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.pending_appointments > 0
                ? `${stats.pending_appointments} en attente`
                : "Voir l'agenda"}
            </p>
          </Link>

          <Link to="/hopital/profil"
            className="group p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all text-left">
            <BuildingOfficeIcon className="h-6 w-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-gray-900 text-sm">Profil de l'hôpital</p>
            <p className="text-xs text-gray-500 mt-1">Modifier les informations</p>
          </Link>

          <Link to="/hopital/ajouter-medecin"
            className="group p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all text-left">
            <PlusIcon className="h-6 w-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-gray-900 text-sm">Ajouter un médecin</p>
            <p className="text-xs text-gray-500 mt-1">Enregistrer un nouveau praticien</p>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default HospitalDashboard;