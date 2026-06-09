import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon, CalendarIcon, BuildingOfficeIcon,
  UserGroupIcon, ArrowPathIcon, ExclamationTriangleIcon,
  CheckCircleIcon, ClockIcon, XCircleIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// COMPOSANT : Carte stat
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
// COMPOSANT PRINCIPAL : Reports
// ============================================================
const Reports = () => {
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [lastRefresh, setLastRefresh]   = useState(null);
  const [stats, setStats]               = useState(null);
  const [activities, setActivities]     = useState([]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminStats();
      setStats(data);
      setActivities(data.recent_activities || []);
      setLastRefresh(new Date());
    } catch {
      setError('Impossible de charger les données. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // ============================================================
  // CALCULS DÉRIVÉS
  // ============================================================
  const tauxActivation = stats
    ? stats.total_hospitals > 0
      ? Math.round((stats.active_hospitals / stats.total_hospitals) * 100)
      : 0
    : 0;

  const tauxAttente = stats
    ? stats.total_appointments > 0
      ? Math.round((stats.pending_appointments / stats.total_appointments) * 100)
      : 0
    : 0;

  const totalUsers = stats
    ? (stats.total_patients || 0) + (stats.total_doctors || 0)
    : 0;

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6">

      {/* ====== HEADER ====== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports et analyses</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Vue d'ensemble des performances de la plateforme
            {lastRefresh && (
              <span className="ml-2 text-gray-400">
                · Mis à jour à {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* ====== ERREUR ====== */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center text-red-700 text-sm">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            {error}
          </div>
          <button onClick={loadData} className="text-sm text-red-700 underline">
            Réessayer
          </button>
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
              value={`${stats?.active_hospitals ?? 0} / ${stats?.total_hospitals ?? 0}`}
              subtitle={`${tauxActivation}% taux d'activation`}
              icon={BuildingOfficeIcon}
              colorClass="bg-blue-500"
            />
            <StatCard
              title="Total utilisateurs"
              value={totalUsers.toLocaleString('fr-FR')}
              subtitle={`${stats?.total_patients ?? 0} patients · ${stats?.total_doctors ?? 0} médecins`}
              icon={UserGroupIcon}
              colorClass="bg-purple-500"
            />
            <StatCard
              title="Total rendez-vous"
              value={(stats?.total_appointments ?? 0).toLocaleString('fr-FR')}
              subtitle={`${stats?.today_appointments ?? 0} aujourd'hui`}
              icon={CalendarIcon}
              colorClass="bg-green-500"
            />
            <StatCard
              title="RDV en attente"
              value={stats?.pending_appointments ?? 0}
              subtitle={`${tauxAttente}% du total`}
              icon={ClockIcon}
              colorClass="bg-orange-500"
            />
          </>
        )}
      </div>

      {/* ====== 2 BLOCS : Indicateurs + Activités ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Indicateurs clés */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Indicateurs clés</h2>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                {
                  label: 'Hôpitaux vérifiés',
                  value: stats?.active_hospitals ?? 0,
                  total: stats?.total_hospitals ?? 0,
                  color: 'bg-blue-500',
                },
                {
                  label: 'Hôpitaux en attente',
                  value: stats?.pending_hospitals ?? 0,
                  total: stats?.total_hospitals ?? 0,
                  color: 'bg-yellow-500',
                },
                {
                  label: 'RDV confirmés',
                  value: (stats?.total_appointments ?? 0) - (stats?.pending_appointments ?? 0),
                  total: stats?.total_appointments ?? 0,
                  color: 'bg-green-500',
                },
                {
                  label: 'RDV en attente',
                  value: stats?.pending_appointments ?? 0,
                  total: stats?.total_appointments ?? 0,
                  color: 'bg-orange-500',
                },
                {
                  label: 'Médecins inscrits',
                  value: stats?.total_doctors ?? 0,
                  total: totalUsers,
                  color: 'bg-purple-500',
                },
              ].map((item) => {
                const pct = item.total > 0
                  ? Math.round((item.value / item.total) * 100)
                  : 0;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-medium text-gray-900">
                        {item.value.toLocaleString('fr-FR')}
                        <span className="text-gray-400 ml-1">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Activités récentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activités récentes</h2>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8">
              <ClockIcon className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">Aucune activité récente</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-80">
              {activities.map((activity) => {
                const statusColors = {
                  confirmed: 'bg-green-100 text-green-600',
                  pending:   'bg-yellow-100 text-yellow-600',
                  cancelled: 'bg-red-100 text-red-600',
                  completed: 'bg-gray-100 text-gray-600',
                  verified:  'bg-blue-100 text-blue-600',
                };
                const cls = statusColors[activity.status] || 'bg-gray-100 text-gray-600';
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${cls.split(' ')[0]}`}>
                      {activity.type === 'hospital'
                        ? <BuildingOfficeIcon className={`h-4 w-4 ${cls.split(' ')[1]}`} />
                        : <CalendarIcon className={`h-4 w-4 ${cls.split(' ')[1]}`} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 leading-snug">{activity.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ====== TABLEAU RÉCAPITULATIF ====== */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Récapitulatif plateforme</h2>

        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Métrique', 'Valeur', 'Statut'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  {
                    label: 'Hôpitaux actifs',
                    value: `${stats?.active_hospitals ?? 0} / ${stats?.total_hospitals ?? 0}`,
                    ok: (stats?.pending_hospitals ?? 0) === 0,
                    okText: 'Tous validés',
                    koText: `${stats?.pending_hospitals ?? 0} en attente`,
                  },
                  {
                    label: 'Médecins inscrits',
                    value: (stats?.total_doctors ?? 0).toLocaleString('fr-FR'),
                    ok: true,
                    okText: 'Sur la plateforme',
                    koText: '',
                  },
                  {
                    label: 'Patients inscrits',
                    value: (stats?.total_patients ?? 0).toLocaleString('fr-FR'),
                    ok: true,
                    okText: 'Comptes actifs',
                    koText: '',
                  },
                  {
                    label: 'Rendez-vous aujourd\'hui',
                    value: stats?.today_appointments ?? 0,
                    ok: (stats?.pending_appointments ?? 0) < 10,
                    okText: 'Flux normal',
                    koText: `${stats?.pending_appointments ?? 0} en attente`,
                  },
                  {
                    label: 'Total rendez-vous',
                    value: (stats?.total_appointments ?? 0).toLocaleString('fr-FR'),
                    ok: true,
                    okText: 'Depuis le début',
                    koText: '',
                  },
                ].map((row) => (
                  <tr key={row.label} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{row.label}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{row.value}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        row.ok ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {row.ok
                          ? <><CheckCircleIcon className="h-3 w-3" />{row.okText}</>
                          : <><ClockIcon className="h-3 w-3" />{row.koText}</>
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Reports;