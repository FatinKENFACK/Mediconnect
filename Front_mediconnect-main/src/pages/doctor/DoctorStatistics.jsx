import React, { useState, useEffect } from 'react';
import {
  UserGroupIcon, CalendarIcon, CurrencyDollarIcon,
  StarIcon, ClockIcon, VideoCameraIcon,
  ArrowUpIcon, ArrowDownIcon, ArrowPathIcon,
  InformationCircleIcon, ArrowDownTrayIcon, TableCellsIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement, PointElement, LineElement,
} from 'chart.js';
import api from '../../services/api';

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend,
);

// ============================================================
// HELPERS
// ============================================================
const formatNumber = (num) =>
  (num ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const Evolution = ({ value }) => {
  if (value === null || value === undefined) return null;
  const pos = value >= 0;
  return (
    <span className={`inline-flex items-center text-sm font-medium ${pos ? 'text-green-600' : 'text-red-600'}`}>
      {pos ? <ArrowUpIcon className="h-3.5 w-3.5 mr-0.5" /> : <ArrowDownIcon className="h-3.5 w-3.5 mr-0.5" />}
      {Math.abs(value)}%
    </span>
  );
};

// Palettes graphiques
const PIE_BG     = ['rgba(59,130,246,.7)','rgba(16,185,129,.7)','rgba(245,158,11,.7)','rgba(99,102,241,.7)','rgba(236,72,153,.7)'];
const PIE_BORDER = ['rgb(59,130,246)','rgb(16,185,129)','rgb(245,158,11)','rgb(99,102,241)','rgb(236,72,153)'];

// ============================================================
// SKELETONS
// ============================================================
const SkeletonCard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
      <div className="h-4 w-12 bg-gray-100 rounded"></div>
    </div>
    <div className="h-7 bg-gray-200 rounded w-24 mb-1"></div>
    <div className="h-4 bg-gray-100 rounded w-20"></div>
  </div>
);

const SkeletonChart = ({ h = 'h-80' }) => (
  <div className={`${h} bg-gray-100 rounded-lg animate-pulse flex items-center justify-center`}>
    <p className="text-gray-400 text-sm">Chargement du graphique…</p>
  </div>
);

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
export default function DoctorStatistics() {
  const [timeRange,  setTimeRange]  = useState('mois');
  const [activeTab,  setActiveTab]  = useState('general');
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [data,       setData]       = useState(null);

  // ============================================================
  // CHARGEMENT
  // ============================================================
  const loadStats = async (range) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getDoctorStats(range);
      setData(result);
    } catch (err) {
      console.error('Erreur stats:', err);
      setError('Impossible de charger les statistiques.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStats(timeRange); }, [timeRange]);

  // ============================================================
  // DONNÉES GRAPHIQUES (construites depuis la réponse API)
  // ============================================================
  const consultationsChartData = data ? {
    labels: data.consultations_par_mois.labels,
    datasets: [{
      label: 'Consultations',
      data:  data.consultations_par_mois.data,
      borderColor: 'rgb(59,130,246)',
      backgroundColor: 'rgba(59,130,246,0.1)',
      tension: 0.3, fill: true,
    }],
  } : null;

  const revenusChartData = data ? {
    labels: data.revenus_par_mois.labels,
    datasets: [{
      label: 'Revenus (XAF)',
      data:  data.revenus_par_mois.data,
      backgroundColor: 'rgba(16,185,129,0.7)',
      borderColor: 'rgb(16,185,129)',
      borderWidth: 1,
    }],
  } : null;

  const typesChartData = data && data.types_consultation.labels.length > 0 ? {
    labels: data.types_consultation.labels,
    datasets: [{
      data: data.types_consultation.data,
      backgroundColor: PIE_BG,
      borderColor: PIE_BORDER,
      borderWidth: 1,
    }],
  } : null;

  const ageChartData = data ? {
    labels: data.age_groups.labels,
    datasets: [{
      label: 'Patients',
      data:  data.age_groups.data,
      backgroundColor: PIE_BG,
      borderColor: PIE_BORDER,
      borderWidth: 1,
    }],
  } : null;

  const statutsChartData = data && data.statuts.labels.length > 0 ? {
    labels: data.statuts.labels,
    datasets: [{
      label: 'Rendez-vous',
      data:  data.statuts.data,
      backgroundColor: [
        'rgba(16,185,129,.7)', 'rgba(59,130,246,.7)',
        'rgba(245,158,11,.7)', 'rgba(239,68,68,.7)',
      ],
      borderColor: [
        'rgb(16,185,129)', 'rgb(59,130,246)',
        'rgb(245,158,11)', 'rgb(239,68,68)',
      ],
      borderWidth: 1,
    }],
  } : null;

  // Options graphiques
  const lineOpts = {
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text: 'Consultations par mois' } },
    scales: { y: { beginAtZero: true } },
  };
  const barOpts = (text) => ({
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text } },
    scales: { y: { beginAtZero: true } },
  });
  const pieOpts = (text) => ({
    responsive: true,
    plugins: { legend: { position: 'bottom' }, title: { display: true, text } },
  });

  // ============================================================
  // RENDER : carte stat individuelle
  // ============================================================
  const StatCard = ({ title, value, evolution, icon: Icon, bgColor, link }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${bgColor} rounded-md p-3`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-semibold text-gray-900">{value}</span>
                <Evolution value={evolution} />
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {link && (
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
          <p className="text-sm font-medium text-blue-600">{link}</p>
        </div>
      )}
    </div>
  );

  // ============================================================
  // RENDER PRINCIPAL
  // ============================================================
  return (
    <div className="space-y-6">

      {/* ====== HEADER ====== */}
      <div className="pb-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord statistique</h1>
            <p className="mt-1 text-sm text-gray-500">
              Visualisez et analysez les performances de votre activité médicale
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadStats(timeRange)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <div className="flex rounded-md shadow-sm border border-gray-300 overflow-hidden">
              {[
                { key: 'semaine', label: 'Semaine' },
                { key: 'mois',    label: 'Mois' },
                { key: 'annee',   label: 'Année' },
              ].map(({ key, label }, i, arr) => (
                <button
                  key={key}
                  onClick={() => setTimeRange(key)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    timeRange === key ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                  } ${i < arr.length - 1 ? 'border-r border-gray-300' : ''}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ====== ERREUR ====== */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => loadStats(timeRange)} className="ml-auto text-sm text-red-700 underline">
            Réessayer
          </button>
        </div>
      )}

      {/* ====== STAT CARDS ====== */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? [1,2,3,4].map(i => <SkeletonCard key={i} />) : data && (
          <>
            <StatCard
              title="Patients actifs"
              value={formatNumber(data.patients)}
              evolution={data.evolution_patients}
              icon={UserGroupIcon}
              bgColor="bg-blue-500"
              link="Voir la liste des patients"
            />
            <StatCard
              title="Consultations"
              value={formatNumber(data.consultations)}
              evolution={data.evolution_consultations}
              icon={ClockIcon}
              bgColor="bg-green-500"
              link="Voir le calendrier"
            />
            <StatCard
              title={`Revenus ${timeRange === 'mois' ? 'mensuels' : timeRange === 'semaine' ? 'hebdo' : 'annuels'}`}
              value={`${formatNumber(data.revenus)} XAF`}
              evolution={data.evolution_revenus}
              icon={CurrencyDollarIcon}
              bgColor="bg-yellow-500"
              link="Voir les détails financiers"
            />
            <StatCard
              title="Taux d'occupation"
              value={`${data.taux_occupation}%`}
              icon={CalendarIcon}
              bgColor="bg-purple-500"
              link="Voir la disponibilité"
            />
          </>
        )}
      </div>

      {/* ====== NOTE MOYENNE ====== */}
      {!loading && data?.avg_rating && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <StarIcon className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm font-medium text-amber-800">
            Note moyenne :{' '}
            <span className="text-lg font-bold">{data.avg_rating} / 5</span>
            <span className="text-amber-600 font-normal ml-2">
              ({data.nb_reviews} avis approuvé{data.nb_reviews > 1 ? 's' : ''})
            </span>
          </p>
        </div>
      )}

      {/* ====== ONGLETS ====== */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'general',       label: "Vue d'ensemble" },
            { id: 'patients',      label: 'Patients' },
            { id: 'consultations', label: 'Consultations' },
            { id: 'finances',      label: 'Finances' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ====== CONTENU ONGLETS ====== */}
      <div className="bg-white shadow rounded-lg p-6">

        {/* Vue d'ensemble */}
        {activeTab === 'general' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Activité par mois</h3>
              {loading ? <SkeletonChart /> :
               consultationsChartData
                ? <div className="h-80"><Line data={consultationsChartData} options={lineOpts} /></div>
                : <p className="text-sm text-gray-500 text-center py-16">Aucune donnée disponible</p>
              }
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Types de consultation</h3>
                {loading ? <SkeletonChart h="h-72" /> :
                 typesChartData
                  ? <div className="h-72"><Pie data={typesChartData} options={pieOpts('Types de consultation')} /></div>
                  : <p className="text-sm text-gray-500 text-center py-12">Aucune donnée</p>
                }
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tranches d'âge des patients</h3>
                {loading ? <SkeletonChart h="h-72" /> :
                 ageChartData
                  ? <div className="h-72"><Doughnut data={ageChartData} options={pieOpts("Tranches d'âge")} /></div>
                  : <p className="text-sm text-gray-500 text-center py-12">Aucune donnée</p>
                }
              </div>
            </div>
          </div>
        )}

        {/* Patients */}
        {activeTab === 'patients' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par tranche d'âge</h3>
            {loading ? <SkeletonChart h="h-96" /> :
             ageChartData
              ? <div className="h-96"><Bar data={ageChartData} options={barOpts("Patients par tranche d'âge")} /></div>
              : <p className="text-sm text-gray-500 text-center py-20">Aucune donnée disponible</p>
            }
          </div>
        )}

        {/* Consultations */}
        {activeTab === 'consultations' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution mensuelle</h3>
              {loading ? <SkeletonChart /> :
               consultationsChartData
                ? <div className="h-80"><Line data={consultationsChartData} options={lineOpts} /></div>
                : <p className="text-sm text-gray-500 text-center py-16">Aucune donnée disponible</p>
              }
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par statut</h3>
              {loading ? <SkeletonChart h="h-64" /> :
               statutsChartData
                ? <div className="h-64"><Bar data={statutsChartData} options={barOpts('Statuts des rendez-vous')} /></div>
                : <p className="text-sm text-gray-500 text-center py-12">Aucune donnée disponible</p>
              }
            </div>
          </div>
        )}

        {/* Finances */}
        {activeTab === 'finances' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenus mensuels (XAF)</h3>
            {loading ? <SkeletonChart h="h-96" /> :
             revenusChartData
              ? <div className="h-96"><Bar data={revenusChartData} options={barOpts('Revenus par mois (XAF)')} /></div>
              : <p className="text-sm text-gray-500 text-center py-20">Aucune donnée disponible</p>
            }
          </div>
        )}
      </div>

      {/* ====== RÉSUMÉ ====== */}
      {!loading && data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-3">
              <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-medium text-gray-900">Revenu total</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(data.revenus)} XAF</p>
            <p className="text-sm text-gray-500 mt-1">
              {timeRange === 'mois' ? 'Ce mois' : timeRange === 'semaine' ? 'Cette semaine' : 'Cette année'}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-3">
              <UserGroupIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Total patients</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatNumber(data.patients)}</p>
            <p className="text-sm text-gray-500 mt-1">Patients uniques suivis</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-3">
              <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
              <h3 className="font-medium text-gray-900">Note moyenne</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {data.avg_rating ? `${data.avg_rating} / 5` : '—'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {data.nb_reviews > 0 ? `${data.nb_reviews} avis approuvé${data.nb_reviews > 1 ? 's' : ''}` : 'Aucun avis'}
            </p>
          </div>
        </div>
      )}

      {/* ====== INSIGHTS ====== */}
      {!loading && data && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Analyse de votre activité</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {data.consultations} consultation{data.consultations > 1 ? 's' : ''} enregistrée{data.consultations > 1 ? 's' : ''} au total</li>
                <li>• {data.patients} patient{data.patients > 1 ? 's' : ''} unique{data.patients > 1 ? 's' : ''} suivi{data.patients > 1 ? 's' : ''}</li>
                <li>• Taux d'occupation de {data.taux_occupation}%</li>
                {data.avg_rating && <li>• Note de satisfaction : {data.avg_rating}/5 ({data.nb_reviews} avis)</li>}
                {data.evolution_revenus > 0 && (
                  <li>• Vos revenus ont augmenté de {data.evolution_revenus}% par rapport à la période précédente</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ====== EXPORT ====== */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Exporter les données</h3>
            <p className="mt-1 text-sm text-gray-500">
              Téléchargez vos données au format Excel ou PDF.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <TableCellsIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Excel
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" />
              PDF
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}