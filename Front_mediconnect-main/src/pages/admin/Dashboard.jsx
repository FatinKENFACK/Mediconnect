import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  InformationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// COMPOSANT : Carte statistique
// ============================================================
const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

// ============================================================
// COMPOSANT : Skeleton loader
// ============================================================
const SkeletonCard = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-7 bg-gray-200 rounded w-16 mb-1"></div>
        <div className="h-3 bg-gray-100 rounded w-32"></div>
      </div>
      <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

// ============================================================
// COMPOSANT : Icône selon le type d'activité
// ============================================================
const ActivityIcon = ({ type, status }) => {
  if (type === 'hospital') {
    return (
      <div className="p-2 rounded-lg bg-blue-100">
        <BuildingOfficeIcon className="h-4 w-4 text-blue-600" />
      </div>
    );
  }
  const statusColors = {
    confirmed: 'bg-green-100',
    pending:   'bg-yellow-100',
    cancelled: 'bg-red-100',
    completed: 'bg-gray-100',
  };
  const iconColors = {
    confirmed: 'text-green-600',
    pending:   'text-yellow-600',
    cancelled: 'text-red-600',
    completed: 'text-gray-600',
  };
  return (
    <div className={`p-2 rounded-lg ${statusColors[status] || 'bg-gray-100'}`}>
      <CalendarIcon className={`h-4 w-4 ${iconColors[status] || 'text-gray-600'}`} />
    </div>
  );
};

// ============================================================
// COMPOSANT : Alerte système
// ============================================================
const AlertItem = ({ alert }) => {
  const config = {
    warning: {
      bg:   'bg-yellow-50 border-yellow-200',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-yellow-600',
      btnCls: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    },
    critical: {
      bg:   'bg-red-50 border-red-200',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-red-600',
      btnCls: 'bg-red-100 text-red-800 hover:bg-red-200',
    },
    info: {
      bg:   'bg-blue-50 border-blue-200',
      icon: InformationCircleIcon,
      iconColor: 'text-blue-600',
      btnCls: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    },
  };
  const c = config[alert.level] || config.info;
  const AlertIconComp = c.icon;

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg ${c.bg}`}>
      <div className="flex items-center">
        <AlertIconComp className={`h-5 w-5 ${c.iconColor} mr-3 flex-shrink-0`} />
        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
      </div>
      {alert.link && (
        <Link
          to={alert.link}
          className={`ml-4 px-3 py-1 text-sm rounded-lg flex-shrink-0 ${c.btnCls}`}
        >
          {alert.action || 'Voir'}
        </Link>
      )}
    </div>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL : AdminDashboard
// ============================================================
const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7j');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const [stats, setStats] = useState({
    totalHospitals:      0,
    activeHospitals:     0,
    pendingHospitals:    0,
    totalDoctors:        0,
    totalPatients:       0,
    totalAppointments:   0,
    todayAppointments:   0,
    pendingAppointments: 0,
    systemHealth:        'good',
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [systemAlerts, setSystemAlerts]         = useState([]);

  // ============================================================
  // CHARGEMENT
  // ============================================================
  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminStats();
      setStats({
        totalHospitals:      data.total_hospitals      || 0,
        activeHospitals:     data.active_hospitals     || 0,
        pendingHospitals:    data.pending_hospitals    || 0,
        totalDoctors:        data.total_doctors        || 0,
        totalPatients:       data.total_patients       || 0,
        totalAppointments:   data.total_appointments   || 0,
        todayAppointments:   data.today_appointments   || 0,
        pendingAppointments: data.pending_appointments || 0,
        systemHealth:        data.system_health        || 'good',
      });
      setRecentActivities(data.recent_activities || []);
      setSystemAlerts(data.system_alerts         || []);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Erreur chargement stats admin:', err);
      setError('Impossible de charger les statistiques. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // ============================================================
  // SANTÉ SYSTÈME
  // ============================================================
  const getHealthStatus = () => {
    switch (stats.systemHealth) {
      case 'good':
        return { color: 'green', text: 'Bon',      Icon: CheckCircleIcon };
      case 'warning':
        return { color: 'yellow', text: 'Attention', Icon: ExclamationTriangleIcon };
      case 'critical':
        return { color: 'red',    text: 'Critique',  Icon: ExclamationTriangleIcon };
      default:
        return { color: 'gray',   text: 'Inconnu',   Icon: ClockIcon };
    }
  };

  const health = getHealthStatus();
  const HealthIcon = health.Icon;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6">

      {/* ====== HEADER ====== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Vue d'ensemble de la plateforme MediConnect
            {lastRefresh && (
              <span className="ml-2 text-gray-400">
                · Mis à jour à {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadStats}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Dernières 24h</option>
            <option value="7j">Derniers 7 jours</option>
            <option value="30j">Derniers 30 jours</option>
            <option value="90j">Derniers 90 jours</option>
          </select>
        </div>
      </div>

      {/* ====== ERREUR ====== */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center text-red-700 text-sm">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            {error}
          </div>
          <button
            onClick={loadStats}
            className="text-sm text-red-700 underline hover:no-underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ====== ALERTES SYSTÈME (prioritaires, affichées en haut) ====== */}
      {!loading && systemAlerts.length > 0 && (
        <div className="space-y-3">
          {systemAlerts.map((alert) => (
            <AlertItem key={alert.id} alert={alert} />
          ))}
        </div>
      )}

      {/* ====== STATS PRINCIPALES ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Hôpitaux actifs"
              value={`${stats.activeHospitals} / ${stats.totalHospitals}`}
              subtitle={stats.pendingHospitals > 0 ? `${stats.pendingHospitals} en attente` : 'Tous validés'}
              icon={BuildingOfficeIcon}
              colorClass="bg-blue-500"
            />
            <StatCard
              title="Patients inscrits"
              value={stats.totalPatients.toLocaleString('fr-FR')}
              subtitle="Comptes patients actifs"
              icon={UserGroupIcon}
              colorClass="bg-green-500"
            />
            <StatCard
              title="Médecins inscrits"
              value={stats.totalDoctors.toLocaleString('fr-FR')}
              subtitle="Sur la plateforme"
              icon={UserGroupIcon}
              colorClass="bg-purple-500"
            />
            <StatCard
              title="RDV aujourd'hui"
              value={stats.todayAppointments}
              subtitle={`${stats.pendingAppointments} en attente · ${stats.totalAppointments} total`}
              icon={CalendarIcon}
              colorClass="bg-orange-500"
            />
          </>
        )}
      </div>

      {/* ====== SANTÉ SYSTÈME + ACTIVITÉS RÉCENTES ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Santé système */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Santé du système</h2>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-16 bg-gray-100 rounded-lg"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* État global */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <HealthIcon className={`h-5 w-5 text-${health.color}-500 mr-3`} />
                  <div>
                    <p className="font-medium text-gray-900">État global</p>
                    <p className="text-sm text-gray-500">Plateforme MediConnect</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full bg-${health.color}-100 text-${health.color}-800`}>
                  {health.text}
                </span>
              </div>

              {/* Métriques */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hôpitaux en attente</span>
                  <span className={stats.pendingHospitals > 0 ? 'text-yellow-600 font-medium' : 'text-green-600'}>
                    {stats.pendingHospitals > 0 ? `${stats.pendingHospitals} à valider` : '✓ Aucun'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">RDV en attente</span>
                  <span className={stats.pendingAppointments > 10 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                    {stats.pendingAppointments}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total utilisateurs</span>
                  <span className="text-gray-900 font-medium">
                    {(stats.totalPatients + stats.totalDoctors).toLocaleString('fr-FR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total rendez-vous</span>
                  <span className="text-gray-900 font-medium">
                    {stats.totalAppointments.toLocaleString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Activités récentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activités récentes</h2>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">Aucune activité récente</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-72">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <ActivityIcon type={activity.type} status={activity.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-snug">{activity.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ====== ACTIONS RAPIDES ====== */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/hopitaux"
            className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left group"
          >
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900 group-hover:text-blue-700">Gérer les hôpitaux</p>
            <p className="text-sm text-gray-500">
              {stats.pendingHospitals > 0
                ? `${stats.pendingHospitals} en attente`
                : 'Activer / désactiver'}
            </p>
          </Link>

          <Link
            to="/admin/medecins"
            className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors text-left group"
          >
            <UserGroupIcon className="h-6 w-6 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900 group-hover:text-purple-700">Gérer les médecins</p>
            <p className="text-sm text-gray-500">{stats.totalDoctors} médecins inscrits</p>
          </Link>

          <Link
            to="/admin/rendez-vous"
            className="p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors text-left group"
          >
            <CalendarIcon className="h-6 w-6 text-orange-600 mb-2" />
            <p className="font-medium text-gray-900 group-hover:text-orange-700">Rendez-vous</p>
            <p className="text-sm text-gray-500">
              {stats.pendingAppointments > 0
                ? `${stats.pendingAppointments} en attente`
                : `${stats.todayAppointments} aujourd'hui`}
            </p>
          </Link>

          <Link
            to="/admin/rapports"
            className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-left group"
          >
            <ChartBarIcon className="h-6 w-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900 group-hover:text-green-700">Rapports</p>
            <p className="text-sm text-gray-500">Analyser les performances</p>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;