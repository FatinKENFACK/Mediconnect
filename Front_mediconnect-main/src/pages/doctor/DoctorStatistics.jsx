import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ChartPieIcon,
  TrendingUpIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  StarIcon,
  ClockIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  FunnelIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function DoctorStatistics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [statsData, setStatsData] = useState({
    revenue: {
      current: 850000,
      previous: 720000,
      growth: 18.1,
      data: [
        { month: 'Jan', value: 650000 },
        { month: 'Fév', value: 720000 },
        { month: 'Mar', value: 680000 },
        { month: 'Avr', value: 750000 },
        { month: 'Mai', value: 820000 },
        { month: 'Juin', value: 850000 }
      ]
    },
    appointments: {
      current: 124,
      previous: 108,
      growth: 14.8,
      data: [
        { month: 'Jan', value: 98 },
        { month: 'Fév', value: 108 },
        { month: 'Mar', value: 95 },
        { month: 'Avr', value: 112 },
        { month: 'Mai', value: 118 },
        { month: 'Juin', value: 124 }
      ]
    },
    patients: {
      current: 156,
      previous: 142,
      growth: 9.9,
      data: [
        { month: 'Jan', value: 132 },
        { month: 'Fév', value: 142 },
        { month: 'Mar', value: 138 },
        { month: 'Avr', value: 145 },
        { month: 'Mai', value: 151 },
        { month: 'Juin', value: 156 }
      ]
    },
    satisfaction: {
      current: 4.8,
      previous: 4.6,
      growth: 4.3,
      data: [
        { month: 'Jan', value: 4.5 },
        { month: 'Fév', value: 4.6 },
        { month: 'Mar', value: 4.4 },
        { month: 'Avr', value: 4.7 },
        { month: 'Mai', value: 4.6 },
        { month: 'Juin', value: 4.8 }
      ]
    }
  });

  const [specialtyStats, setSpecialtyStats] = useState([
    { name: 'Cardiologie', appointments: 45, revenue: 320000, patients: 38, growth: 12.5 },
    { name: 'Médecine générale', appointments: 38, revenue: 228000, patients: 42, growth: 8.3 },
    { name: 'Consultations vidéo', appointments: 28, revenue: 168000, patients: 35, growth: 22.1 },
    { name: 'Urgences', appointments: 13, revenue: 134000, patients: 18, growth: -5.2 }
  ]);

  const [patientDemographics, setPatientDemographics] = useState([
    { age: '18-25', count: 12, percentage: 7.7 },
    { age: '26-35', count: 28, percentage: 17.9 },
    { age: '36-45', count: 35, percentage: 22.4 },
    { age: '46-55', count: 42, percentage: 26.9 },
    { age: '56-65', count: 28, percentage: 17.9 },
    { age: '65+', count: 11, percentage: 7.1 }
  ]);

  const [consultationTypes, setConsultationTypes] = useState([
    { type: 'Présentiel', count: 89, percentage: 71.8, averageDuration: 45, revenue: 534000 },
    { type: 'Visioconférence', count: 35, percentage: 28.2, averageDuration: 30, revenue: 316000 }
  ]);

  const periods = [
    { value: 'week', label: 'Semaine' },
    { value: 'month', label: 'Mois' },
    { value: 'quarter', label: 'Trimestre' },
    { value: 'year', label: 'Année' }
  ];

  const metrics = [
    { value: 'revenue', label: 'Revenus', icon: CurrencyDollarIcon },
    { value: 'appointments', label: 'Rendez-vous', icon: CalendarIcon },
    { value: 'patients', label: 'Patients', icon: UserGroupIcon },
    { value: 'satisfaction', label: 'Satisfaction', icon: StarIcon }
  ];

  const currentMetricData = statsData[selectedMetric];
  const MetricIcon = metrics.find(m => m.value === selectedMetric)?.icon || ChartBarIcon;

  const calculateTotalRevenue = () => {
    return specialtyStats.reduce((sum, specialty) => sum + specialty.revenue, 0);
  };

  const calculateAverageRating = () => {
    return currentMetricData.current;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
          <p className="text-gray-600 mt-2">Analysez vos performances et suivez votre activité</p>
        </div>

        {/* Period and Metric Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>{period.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Métrique</label>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {metrics.map(metric => (
                    <option key={metric.value} value={metric.value}>{metric.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <ArrowDownIcon className="h-4 w-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => {
            const data = statsData[metric.value];
            const Icon = metric.icon;
            return (
              <div key={metric.value} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className={`flex items-center text-sm ${
                    data.growth > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.growth > 0 ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {Math.abs(data.growth)}%
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value === 'revenue' ? `${(data.current / 1000).toFixed(0)}k XAF` : data.current}
                </p>
                <p className="text-sm text-gray-600">{metric.label}</p>
              </div>
            );
          })}
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Main Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {metrics.find(m => m.value === selectedMetric)?.label} - Tendance
              </h2>
              <MetricIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {currentMetricData.data.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-12 text-sm font-medium text-gray-600">{item.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-6 relative">
                      <div 
                        className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ 
                          width: `${(item.value / Math.max(...currentMetricData.data.map(d => d.value))) * 100}%` 
                        }}
                      >
                        <span className="text-xs text-white font-medium">
                          {selectedMetric === 'revenue' ? `${(item.value / 1000).toFixed(0)}k` : item.value}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Specialty Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance par spécialité</h2>
            <div className="space-y-4">
              {specialtyStats.map((specialty, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{specialty.name}</p>
                    <p className="text-sm text-gray-600">{specialty.appointments} rendez-vous</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{(specialty.revenue / 1000).toFixed(0)}k XAF</p>
                    <p className={`text-sm ${specialty.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {specialty.growth > 0 ? '+' : ''}{specialty.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Demographics and Consultation Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Patient Demographics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Démographie des patients</h2>
            <div className="space-y-3">
              {patientDemographics.map((demographic, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm font-medium text-gray-600">{demographic.age}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-4 relative">
                      <div 
                        className="bg-green-500 h-4 rounded-full"
                        style={{ width: `${demographic.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{demographic.count}</p>
                    <p className="text-xs text-gray-500">{demographic.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consultation Types */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Types de consultations</h2>
            <div className="space-y-4">
              {consultationTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      type.type === 'Présentiel' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {type.type === 'Présentiel' ? (
                        <UserGroupIcon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <VideoCameraIcon className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{type.type}</p>
                      <p className="text-sm text-gray-600">{type.count} consultations</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{type.percentage}%</p>
                    <p className="text-sm text-gray-600">{type.averageDuration}min en moyenne</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-medium text-gray-900">Revenu total</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{(calculateTotalRevenue() / 1000).toFixed(0)}k XAF</p>
            <p className="text-sm text-gray-600">Ce mois</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-medium text-gray-900">Temps moyen</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">42min</p>
            <p className="text-sm text-gray-600">Par consultation</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <StarIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-medium text-gray-900">Note moyenne</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{calculateAverageRating()}/5</p>
            <p className="text-sm text-gray-600">Basée sur 45 avis</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Analyse des performances</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>Les visioconférences ont une croissance de 22.1% ce mois-ci</li>
                <li>La cardiologie représente 37.6% de vos revenus</li>
                <li>La tranche d'âge 46-55 ans constitue votre principal segment de patients</li>
                <li>Votre note de satisfaction a augmenté de 4.3% ce trimestre</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
