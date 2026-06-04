import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon, UserGroupIcon, CalendarIcon,
  CheckCircleIcon, XCircleIcon, ClockIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const HospitalStatistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getHospitalStats()
      .then(setStats)
      .catch(() => setError('Erreur lors du chargement des statistiques.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="p-6">
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
    </div>
  );

  const cards = [
    { label: 'Total médecins', value: stats?.total_doctors || 0, color: 'bg-blue-500', icon: UserGroupIcon },
    { label: 'Médecins vérifiés', value: stats?.verified_doctors || 0, color: 'bg-green-500', icon: CheckCircleIcon },
    { label: 'Total RDV', value: stats?.total_appointments || 0, color: 'bg-purple-500', icon: CalendarIcon },
    { label: "RDV aujourd'hui", value: stats?.today_appointments || 0, color: 'bg-indigo-500', icon: CalendarIcon },
    { label: 'RDV confirmés', value: stats?.confirmed_appointments || 0, color: 'bg-teal-500', icon: CheckCircleIcon },
    { label: 'RDV en attente', value: stats?.pending_appointments || 0, color: 'bg-yellow-500', icon: ClockIcon },
    { label: 'RDV terminés', value: stats?.completed_appointments || 0, color: 'bg-blue-400', icon: CheckCircleIcon },
    { label: 'RDV annulés', value: stats?.cancelled_appointments || 0, color: 'bg-red-500', icon: XCircleIcon },
  ];

  const totalNonCancelled = (stats?.total_appointments || 0) - (stats?.cancelled_appointments || 0);
  const completionRate = totalNonCancelled > 0
    ? Math.round(((stats?.completed_appointments || 0) / totalNonCancelled) * 100)
    : 0;
  const cancellationRate = (stats?.total_appointments || 0) > 0
    ? Math.round(((stats?.cancelled_appointments || 0) / stats.total_appointments) * 100)
    : 0;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-600 mt-2">Vue d'ensemble des performances de votre établissement</p>
      </div>

      {/* Cartes stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center">
              <div className={`${c.color} p-3 rounded-lg`}>
                <c.icon className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">{c.label}</p>
                <p className="text-2xl font-bold text-gray-900">{c.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Taux calculés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Taux de complétion</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">RDV terminés / RDV non annulés</span>
            <span className="text-2xl font-bold text-green-600">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-green-500 h-3 rounded-full transition-all"
              style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Taux d'annulation</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">RDV annulés / Total RDV</span>
            <span className="text-2xl font-bold text-red-600">{cancellationRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-red-500 h-3 rounded-full transition-all"
              style={{ width: `${cancellationRate}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalStatistics;