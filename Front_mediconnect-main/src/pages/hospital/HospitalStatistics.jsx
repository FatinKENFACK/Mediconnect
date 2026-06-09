import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon, UserGroupIcon, CalendarIcon,
  CheckCircleIcon, XCircleIcon, ClockIcon, ArrowPathIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const HospitalStatistics = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHospitalStats();
      setStats(data);
    } catch {
      setError('Erreur lors du chargement des statistiques.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const cards = [
    { label: 'Total médecins',    value: stats?.total_doctors        ?? 0, color: 'bg-blue-500',   icon: UserGroupIcon },
    { label: 'Médecins vérifiés', value: stats?.verified_doctors     ?? 0, color: 'bg-green-500',  icon: CheckCircleIcon },
    { label: 'Total RDV',         value: stats?.total_appointments   ?? 0, color: 'bg-purple-500', icon: CalendarIcon },
    { label: "RDV aujourd'hui",   value: stats?.today_appointments   ?? 0, color: 'bg-indigo-500', icon: CalendarIcon },
    { label: 'RDV confirmés',     value: stats?.confirmed_appointments ?? 0, color: 'bg-teal-500', icon: CheckCircleIcon },
    { label: 'RDV en attente',    value: stats?.pending_appointments ?? 0, color: 'bg-yellow-500', icon: ClockIcon },
    { label: 'RDV terminés',      value: stats?.completed_appointments ?? 0, color: 'bg-blue-400', icon: CheckCircleIcon },
    { label: 'RDV annulés',       value: stats?.cancelled_appointments ?? 0, color: 'bg-red-500',  icon: XCircleIcon },
  ];

  const total = stats?.total_appointments || 0;
  const completed = stats?.completed_appointments || 0;
  const cancelled = stats?.cancelled_appointments || 0;
  const nonCancelled = total - cancelled;

  const completionRate    = nonCancelled > 0 ? Math.round((completed / nonCancelled) * 100) : 0;
  const cancellationRate  = total > 0 ? Math.round((cancelled / total) * 100) : 0;
  const verificationRate  = (stats?.total_doctors || 0) > 0
    ? Math.round(((stats?.verified_doctors || 0) / stats.total_doctors) * 100) : 0;

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-500 mt-1 text-sm">Vue d'ensemble des performances de votre établissement</p>
        </div>
        <button onClick={load} disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={load} className="text-sm text-red-700 underline">Réessayer</button>
        </div>
      )}

      {/* Cartes stats */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-10"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map(c => (
            <div key={c.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className={`${c.color} p-3 rounded-lg`}>
                  <c.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">{c.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Taux calculés */}
      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Taux de complétion',
              value: completionRate,
              color: 'bg-green-500',
              textColor: 'text-green-600',
              description: 'RDV terminés / RDV non annulés',
            },
            {
              title: "Taux d'annulation",
              value: cancellationRate,
              color: 'bg-red-500',
              textColor: 'text-red-600',
              description: 'RDV annulés / Total RDV',
            },
            {
              title: 'Taux de vérification',
              value: verificationRate,
              color: 'bg-blue-500',
              textColor: 'text-blue-600',
              description: 'Médecins vérifiés / Total médecins',
            },
          ].map(r => (
            <div key={r.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-1">{r.title}</h2>
              <p className="text-xs text-gray-500 mb-4">{r.description}</p>
              <div className="flex items-center justify-between mb-2">
                <div className="w-full bg-gray-100 rounded-full h-3 mr-4">
                  <div className={`${r.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${r.value}%` }} />
                </div>
                <span className={`text-2xl font-bold ${r.textColor} flex-shrink-0`}>{r.value}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Résumé texte */}
      {!loading && stats && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-blue-900 mb-2">Résumé</h2>
          <p className="text-sm text-blue-800">
            Votre établissement compte <strong>{stats.total_doctors}</strong> médecin{stats.total_doctors > 1 ? 's' : ''} dont{' '}
            <strong>{stats.verified_doctors}</strong> vérifié{stats.verified_doctors > 1 ? 's' : ''}.{' '}
            Depuis le début, <strong>{stats.total_appointments}</strong> rendez-vous ont été enregistrés,
            avec <strong>{stats.today_appointments}</strong> aujourd'hui.{' '}
            {stats.pending_appointments > 0 && (
              <span className="text-yellow-700 font-medium">
                ⚠️ {stats.pending_appointments} rendez-vous en attente de confirmation.
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default HospitalStatistics;