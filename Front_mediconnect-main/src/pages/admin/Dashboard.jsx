import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  ChartBarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7j');
  const [stats, setStats] = useState({
    totalHospitals: 0,
    activeHospitals: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    systemHealth: 'good',
    lastBackup: null
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getAdminStats();
        setStats(prev => ({
          ...prev,
          totalHospitals: data.total_hospitals,
          activeHospitals: data.active_hospitals,
          pendingHospitals: data.pending_hospitals,
          totalDoctors: data.total_doctors,
          totalPatients: data.total_patients,
        }));
      } catch (err) {
        console.error('Erreur chargement stats admin:', err);
      }
    };
    loadStats();
  }, []);

  const getHealthStatus = () => {
    switch (stats.systemHealth) {
      case 'good':
        return { color: 'green', text: 'Bon', icon: CheckCircleIcon };
      case 'warning':
        return { color: 'yellow', text: 'Attention', icon: ExclamationTriangleIcon };
      case 'critical':
        return { color: 'red', text: 'Critique', icon: ExclamationTriangleIcon };
      default:
        return { color: 'gray', text: 'Inconnu', icon: ClockIcon };
    }
  };

  const healthStatus = getHealthStatus();

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
              {changeType === 'positive' ? (
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble de la plateforme Mediconnet</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Dernières 24h</option>
            <option value="7j">Derniers 7 jours</option>
            <option value="30j">Derniers 30 jours</option>
            <option value="90j">Derniers 90 jours</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Hôpitaux actifs"
          value={`${stats.activeHospitals}/${stats.totalHospitals}`}
          change="+12 cette semaine"
          changeType="positive"
          icon={BuildingOfficeIcon}
          color="blue"
        />
        <StatCard
          title="Patients totaux"
          value={stats.totalPatients.toLocaleString()}
          change="+234 aujourd'hui"
          changeType="positive"
          icon={UserGroupIcon}
          color="green"
        />
        <StatCard
          title="Médecins inscrits"
          value={stats.totalDoctors.toLocaleString()}
          change="+18 cette semaine"
          changeType="positive"
          icon={UserGroupIcon}
          color="purple"
        />
        <StatCard
          title="Revenu mensuel"
          value={`${(stats.monthlyRevenue / 1000000).toFixed(1)}M FCFA`}
          change="+15% vs mois dernier"
          changeType="positive"
          icon={CurrencyDollarIcon}
          color="yellow"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Abonnements actifs"
          value={stats.activeSubscriptions}
          change="+5 ce mois"
          changeType="positive"
          icon={CreditCardIcon}
          color="blue"
        />
        <StatCard
          title="Paiements en attente"
          value={stats.pendingPayments}
          change="-3 vs hier"
          changeType="positive"
          icon={ClockIcon}
          color="orange"
        />
        <StatCard
          title="Revenu total"
          value={`${(stats.totalRevenue / 1000000).toFixed(1)}M FCFA`}
          change="+25% cette année"
          changeType="positive"
          icon={ChartBarIcon}
          color="green"
        />
      </div>

      {/* System Health & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Santé du système</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <healthStatus.icon className={`h-5 w-5 text-${healthStatus.color}-500 mr-3`} />
                <div>
                  <p className="font-medium text-gray-900">État global</p>
                  <p className="text-sm text-gray-600">Système opérationnel</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full bg-${healthStatus.color}-100 text-${healthStatus.color}-800`}>
                {healthStatus.text}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Dernière sauvegarde</span>
                <span className="text-gray-900">
                  {stats.lastBackup ? `Il y a ${Math.floor((Date.now() - stats.lastBackup) / (1000 * 60 * 60))} heures` : 'Jamais'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Espace disque</span>
                <span className="text-green-600">67% utilisé</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Uptime</span>
                <span className="text-green-600">99.8%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Temps de réponse</span>
                <span className="text-green-600">245ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activités récentes</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-${activity.color}-100`}>
                  <activity.icon className={`h-4 w-4 text-${activity.color}-600`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alertes système</h2>
          <div className="space-y-3">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200">
                  Voir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Gérer les hôpitaux</p>
            <p className="text-sm text-gray-600">Activer/désactiver des comptes</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <CreditCardIcon className="h-6 w-6 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">Vérifier les paiements</p>
            <p className="text-sm text-gray-600">Historique des transactions</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ChartBarIcon className="h-6 w-6 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">Générer un rapport</p>
            <p className="text-sm text-gray-600">Analyser les performances</p>
          </button>
          <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-600 mb-2" />
            <p className="font-medium text-gray-900">Sauvegarder les données</p>
            <p className="text-sm text-gray-600">Protection des données</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;