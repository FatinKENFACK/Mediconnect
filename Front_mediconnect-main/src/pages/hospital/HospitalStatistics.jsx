import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  TrendingUpIcon,
  UserGroupIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

const HospitalStatistics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedService, setSelectedService] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const periods = [
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' },
    { value: 'year', label: 'Cette année' }
  ];

  const services = [
    { value: 'all', label: 'Tous les services' },
    { value: 'cardiology', label: 'Cardiologie' },
    { value: 'pediatrics', label: 'Pédiatrie' },
    { value: 'radiology', label: 'Radiologie' },
    { value: 'gynecology', label: 'Gynécologie' },
    { value: 'emergency', label: 'Urgences' }
  ];

  const [stats, setStats] = useState({
    totalConsultations: 1247,
    totalRevenue: 31425000,
    averageConsultationTime: 28,
    patientSatisfaction: 4.6,
    newPatients: 156,
    returningPatients: 1091,
    cancelledAppointments: 23,
    noShowRate: 1.8,
    occupancyRate: 78,
    emergencyVisits: 89,
    videoConsultations: 234
  });

  const [consultationsTrend, setConsultationsTrend] = useState([
    { period: 'Jan', consultations: 1023, revenue: 25800000 },
    { period: 'Fév', consultations: 1156, revenue: 29100000 },
    { period: 'Mar', consultations: 1289, revenue: 32600000 },
    { period: 'Avr', consultations: 1247, revenue: 31425000 }
  ]);

  const [servicesStats, setServicesStats] = useState([
    {
      name: 'Cardiologie',
      consultations: 312,
      revenue: 7800000,
      satisfaction: 4.8,
      growth: 12.5,
      averageTime: 25,
      doctors: 3
    },
    {
      name: 'Pédiatrie',
      consultations: 289,
      revenue: 5780000,
      satisfaction: 4.9,
      growth: 8.3,
      averageTime: 35,
      doctors: 2
    },
    {
      name: 'Radiologie',
      consultations: 234,
      revenue: 3510000,
      satisfaction: 4.5,
      growth: -2.1,
      averageTime: 20,
      doctors: 2
    },
    {
      name: 'Gynécologie',
      consultations: 198,
      revenue: 4356000,
      satisfaction: 4.7,
      growth: 15.2,
      averageTime: 30,
      doctors: 2
    },
    {
      name: 'Urgences',
      consultations: 156,
      revenue: 4680000,
      satisfaction: 4.3,
      growth: 5.7,
      averageTime: 15,
      doctors: 3
    },
    {
      name: 'Laboratoire',
      consultations: 89,
      revenue: 1780000,
      satisfaction: 4.4,
      growth: 3.2,
      averageTime: 15,
      doctors: 1
    }
  ]);

  const [doctorStats, setDoctorStats] = useState([
    {
      name: 'Dr. Martin Laurent',
      service: 'Cardiologie',
      consultations: 156,
      revenue: 3900000,
      satisfaction: 4.8,
      averageTime: 25,
      newPatients: 23
    },
    {
      name: 'Dr. Sophie Bernard',
      service: 'Pédiatrie',
      consultations: 142,
      revenue: 2840000,
      satisfaction: 4.9,
      averageTime: 35,
      newPatients: 18
    },
    {
      name: 'Dr. Marie Lefebvre',
      service: 'Gynécologie',
      consultations: 98,
      revenue: 2156000,
      satisfaction: 4.7,
      averageTime: 30,
      newPatients: 15
    },
    {
      name: 'Dr. Pierre Dubois',
      service: 'Radiologie',
      consultations: 117,
      revenue: 1755000,
      satisfaction: 4.5,
      averageTime: 20,
      newPatients: 12
    }
  ]);

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? (
      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  const formatPercentage = (value) => {
    return value.toFixed(1) + '%';
  };

  useEffect(() => {
    // Simuler le chargement des données selon la période et le service sélectionnés
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [selectedPeriod, selectedService]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Statistiques des consultations</h1>
            <p className="text-gray-600 mt-2">Analysez l'utilisation des services et les performances</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {services.map(service => (
                <option key={service.value} value={service.value}>
                  {service.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total consultations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalConsultations.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {getGrowthIcon(8.5)}
                <span className={`text-sm ml-1 ${getGrowthColor(8.5)}`}>+8.5%</span>
              </div>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenu total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <div className="flex items-center mt-2">
                {getGrowthIcon(12.3)}
                <span className={`text-sm ml-1 ${getGrowthColor(12.3)}`}>+12.3%</span>
              </div>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Satisfaction patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.patientSatisfaction}/5</p>
              <div className="flex items-center mt-2">
                {getGrowthIcon(0.2)}
                <span className={`text-sm ml-1 ${getGrowthColor(0.2)}`}>+0.2</span>
              </div>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <StarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux d'occupation</p>
              <p className="text-2xl font-bold text-gray-900">{formatPercentage(stats.occupancyRate)}</p>
              <div className="flex items-center mt-2">
                {getGrowthIcon(5.1)}
                <span className={`text-sm ml-1 ${getGrowthColor(5.1)}`}>+5.1%</span>
              </div>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Consultations Trend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Évolution des consultations</h2>
        <div className="space-y-4">
          {consultationsTrend.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-16">
                  <p className="text-sm font-medium text-gray-900">{item.period}</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{item.consultations} consultations</p>
                  <p className="text-sm text-gray-600">{formatCurrency(item.revenue)}</p>
                </div>
              </div>
              <div className="text-right">
                {index > 0 && (
                  <div className="flex items-center">
                    {(() => {
                      const growth = ((item.consultations - consultationsTrend[index - 1].consultations) / consultationsTrend[index - 1].consultations) * 100;
                      return (
                        <>
                          {getGrowthIcon(growth)}
                          <span className={`text-sm ml-1 ${getGrowthColor(growth)}`}>
                            {growth >= 0 ? '+' : ''}{formatPercentage(growth)}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Services Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance par service</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satisfaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Croissance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temps moyen
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {servicesStats.map((service, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.doctors} médecins</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service.consultations}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(service.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.floor(service.satisfaction) ? 'text-current' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-900">{service.satisfaction}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getGrowthIcon(service.growth)}
                      <span className={`text-sm ml-1 ${getGrowthColor(service.growth)}`}>
                        {service.growth >= 0 ? '+' : ''}{formatPercentage(service.growth)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                      {service.averageTime} min
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Doctors */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Médecins les plus performants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctorStats.map((doctor, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.service}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.floor(doctor.satisfaction) ? 'text-current' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-900">{doctor.satisfaction}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Consultations:</span>
                  <span className="ml-2 font-medium text-gray-900">{doctor.consultations}</span>
                </div>
                <div>
                  <span className="text-gray-600">Revenu:</span>
                  <span className="ml-2 font-medium text-gray-900">{formatCurrency(doctor.revenue)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Temps moyen:</span>
                  <span className="ml-2 font-medium text-gray-900">{doctor.averageTime} min</span>
                </div>
                <div>
                  <span className="text-gray-600">Nouveaux patients:</span>
                  <span className="ml-2 font-medium text-gray-900">{doctor.newPatients}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalStatistics;
