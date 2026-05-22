import React, { useState } from 'react';
import { 
  UserGroupIcon,
  ClockIcon,
  CurrencyEuroIcon,
  CalendarIcon,
  ChartBarIcon,
  ChartPieIcon,
  TableCellsIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const StatistiquesDoctor = () => {
  const [timeRange, setTimeRange] = useState('mois');
  const [activeTab, setActiveTab] = useState('general');

  // Données de démonstration pour les statistiques
  const stats = {
    patients: 124,
    consultations: 347,
    revenus: 12540,
    tauxOccupation: 78,
    evolutionPatients: 12.5,
    evolutionConsultations: 8.3,
    evolutionRevenus: 15.2,
  };

  // Données pour le graphique des consultations par mois
  const consultationsData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Consultations',
        data: [25, 32, 28, 35, 40, 45, 42, 38, 35, 45, 50, 55],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Données pour le graphique des revenus par mois
  const revenusData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
    datasets: [
      {
        label: 'Revenus (€)',
        data: [1200, 1500, 1350, 1650, 1800, 2000, 1950, 1850, 1750, 2100, 2300, 2500],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Données pour le graphique en secteurs des types de consultation
  const typesConsultationData = {
    labels: ['Consultation standard', 'Suivi', 'Urgence', 'Téléconsultation', 'Bilan'],
    datasets: [
      {
        data: [45, 20, 15, 15, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(236, 72, 153, 0.7)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Données pour le graphique des tranches d'âge des patients
  const ageGroupsData = {
    labels: ['0-18', '19-30', '31-45', '46-60', '61+'],
    datasets: [
      {
        label: 'Nombre de patients',
        data: [15, 35, 40, 25, 15],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options pour les graphiques
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Consultations par mois',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenus par mois (€)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Répartition des types de consultation',
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Tranches d\'âge des patients',
      },
    },
  };

  // Fonction pour formater les nombres avec séparateur de milliers
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Fonction pour afficher l'évolution avec une flèche et une couleur appropriée
  const renderEvolution = (value) => {
    const isPositive = value >= 0;
    return (
      <span className={`inline-flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <ArrowUpIcon className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 mr-1" />
        )}
        {Math.abs(value)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord statistique</h1>
            <p className="mt-1 text-sm text-gray-500">
              Visualisez et analysez les performances de votre activité médicale
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setTimeRange('semaine')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  timeRange === 'semaine' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Semaine
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('mois')}
                className={`px-4 py-2 text-sm font-medium ${
                  timeRange === 'mois' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Mois
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('annee')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  timeRange === 'annee' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Année
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Patients actifs</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{formatNumber(stats.patients)}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold">
                      {renderEvolution(stats.evolutionPatients)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Voir la liste des patients
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Consultations</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{formatNumber(stats.consultations)}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold">
                      {renderEvolution(stats.evolutionConsultations)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Voir le calendrier
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <CurrencyEuroIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Revenus {timeRange === 'mois' ? 'mensuels' : timeRange === 'semaine' ? 'hebdomadaires' : 'annuels'}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{formatNumber(stats.revenus)} €</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold">
                      {renderEvolution(stats.evolutionRevenus)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Voir les détails financiers
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Taux d'occupation</dt>
                  <dd>
                    <div className="text-2xl font-semibold text-gray-900">{stats.tauxOccupation}%</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Voir la disponibilité
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation des onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'patients'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Patients
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'consultations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Consultations
          </button>
          <button
            onClick={() => setActiveTab('finances')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'finances'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Finances
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === 'general' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Activité récente</h3>
              <div className="h-80">
                <Line data={consultationsData} options={lineChartOptions} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition des types de consultation</h3>
                <div className="h-80">
                  <Pie data={typesConsultationData} options={pieChartOptions} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tranches d'âge des patients</h3>
                <div className="h-80">
                  <Doughnut data={ageGroupsData} options={doughnutChartOptions} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistiques des patients</h3>
            <div className="h-96">
              <Bar data={ageGroupsData} options={barChartOptions} />
            </div>
          </div>
        )}

        {activeTab === 'consultations' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des consultations</h3>
            <div className="h-96">
              <Line data={consultationsData} options={lineChartOptions} />
            </div>
          </div>
        )}

        {activeTab === 'finances' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenus mensuels</h3>
            <div className="h-96">
              <Bar data={revenusData} options={barChartOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Section d'exportation */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Exporter les données</h3>
            <p className="mt-1 text-sm text-gray-500">
              Téléchargez vos données au format Excel ou PDF pour une analyse plus approfondie.
            </p>
          </div>
          <div className="mt-4 sm:mt-0
          flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <TableCellsIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Exporter en Excel
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" />
              Exporter en PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistiquesDoctor;
