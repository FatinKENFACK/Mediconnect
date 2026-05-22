import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ServerIcon,
  FunnelIcon,
  PrinterIcon,
  EyeIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [reportData, setReportData] = useState({
    revenue: [],
    hospitals: [],
    users: [],
    subscriptions: [],
    performance: []
  });

  useEffect(() => {
    // Simuler le chargement des rapports disponibles
    setReports([
      {
        id: 'revenue-monthly',
        name: 'Rapport de revenus mensuel',
        description: 'Analyse détaillée des revenus par mois',
        category: 'financial',
        frequency: 'monthly',
        lastGenerated: '2024-03-01',
        format: ['pdf', 'excel'],
        icon: CurrencyDollarIcon,
        color: 'green',
        metrics: {
          totalRevenue: 12500000,
          growth: 15.2,
          subscriptions: 142,
          averageRevenue: 88028
        }
      },
      {
        id: 'hospital-performance',
        name: 'Performance des hôpitaux',
        description: 'Statistiques détaillées par hôpital',
        category: 'operational',
        frequency: 'monthly',
        lastGenerated: '2024-03-05',
        format: ['pdf', 'excel', 'csv'],
        icon: BuildingOfficeIcon,
        color: 'blue',
        metrics: {
          totalHospitals: 156,
          activeHospitals: 142,
          averagePatients: 293,
          topPerformer: 'Hôpital Principal de Dakar'
        }
      },
      {
        id: 'user-analytics',
        name: 'Analytique des utilisateurs',
        description: 'Tendances d\'utilisation et engagement',
        category: 'user',
        frequency: 'weekly',
        lastGenerated: '2024-03-10',
        format: ['pdf', 'csv'],
        icon: UserGroupIcon,
        color: 'purple',
        metrics: {
          totalUsers: 45678,
          activeUsers: 12450,
          newUsers: 234,
          retentionRate: 78.5
        }
      },
      {
        id: 'subscription-trends',
        name: 'Tendances des abonnements',
        description: 'Évolution des abonnements et plans',
        category: 'financial',
        frequency: 'monthly',
        lastGenerated: '2024-03-01',
        format: ['pdf', 'excel'],
        icon: ChartBarIcon,
        color: 'yellow',
        metrics: {
          totalSubscriptions: 142,
          newSubscriptions: 12,
          churnRate: 2.1,
          averageLifetime: 18.5
        }
      },
      {
        id: 'system-performance',
        name: 'Performance système',
        description: 'Métriques techniques et uptime',
        category: 'technical',
        frequency: 'daily',
        lastGenerated: '2024-03-25',
        format: ['pdf', 'json'],
        icon: ServerIcon,
        color: 'red',
        metrics: {
          uptime: 99.8,
          responseTime: 245,
          errorRate: 0.2,
          storageUsage: 67
        }
      },
      {
        id: 'patient-demographics',
        name: 'Démographie des patients',
        description: 'Analyse des données patients (anonymisées)',
        category: 'clinical',
        frequency: 'quarterly',
        lastGenerated: '2024-01-15',
        format: ['pdf', 'csv'],
        icon: UserGroupIcon,
        color: 'indigo',
        metrics: {
          totalPatients: 45678,
          averageAge: 34.2,
          genderDistribution: '52% F, 48% M',
          topSpecialties: ['Cardiologie', 'Médecine générale', 'Pédiatrie']
        }
      }
    ]);

    // Simuler le chargement des données de rapports
    setReportData({
      revenue: [
        { month: 'Jan', revenue: 10500000, subscriptions: 125 },
        { month: 'Fev', revenue: 11200000, subscriptions: 132 },
        { month: 'Mar', revenue: 12500000, subscriptions: 142 }
      ],
      hospitals: [
        { name: 'Hôpital Principal de Dakar', patients: 5600, consultations: 12400, revenue: 500000 },
        { name: 'Clinique Saint-Jean', patients: 1250, consultations: 3420, revenue: 150000 },
        { name: 'Polyclininique du Sénégal', patients: 450, consultations: 890, revenue: 50000 }
      ],
      users: [
        { type: 'Patients', count: 45678, growth: 12.3 },
        { type: 'Médecins', count: 1234, growth: 8.7 },
        { type: 'Admins', count: 12, growth: 0 }
      ],
      subscriptions: [
        { plan: 'Basic', count: 45, revenue: 2250000 },
        { plan: 'Professional', count: 85, revenue: 12750000 },
        { plan: 'Enterprise', count: 12, revenue: 6000000 }
      ],
      performance: [
        { metric: 'Uptime', value: 99.8, target: 99.5 },
        { metric: 'Response Time', value: 245, target: 300 },
        { metric: 'Error Rate', value: 0.2, target: 1.0 }
      ]
    });
  }, []);

  const getCategoryBadge = (category) => {
    const styles = {
      financial: 'bg-green-100 text-green-800',
      operational: 'bg-blue-100 text-blue-800',
      user: 'bg-purple-100 text-purple-800',
      technical: 'bg-red-100 text-red-800',
      clinical: 'bg-indigo-100 text-indigo-800'
    };
    const labels = {
      financial: 'Financier',
      operational: 'Opérationnel',
      user: 'Utilisateur',
      technical: 'Technique',
      clinical: 'Clinique'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[category]}`}>
        {labels[category]}
      </span>
    );
  };

  const getFrequencyBadge = (frequency) => {
    const styles = {
      daily: 'bg-orange-100 text-orange-800',
      weekly: 'bg-blue-100 text-blue-800',
      monthly: 'bg-green-100 text-green-800',
      quarterly: 'bg-purple-100 text-purple-800',
      yearly: 'bg-gray-100 text-gray-800'
    };
    const labels = {
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      yearly: 'Annuel'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[frequency]}`}>
        {labels[frequency]}
      </span>
    );
  };

  const handleGenerateReport = (reportId) => {
    // Logique de génération de rapport
    console.log(`Generating report: ${reportId}`);
  };

  const handlePreviewReport = (report) => {
    setSelectedReport(report);
    setShowPreviewModal(true);
  };

  const filteredReports = reports.filter(report => {
    // Filtrer par période si nécessaire
    return true;
  });

  const stats = {
    totalReports: reports.length,
    monthlyReports: reports.filter(r => r.frequency === 'monthly').length,
    weeklyReports: reports.filter(r => r.frequency === 'weekly').length,
    dailyReports: reports.filter(r => r.frequency === 'daily').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports et analyses</h1>
          <p className="text-gray-600 mt-2">Générez et analysez les performances du système</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Générer tout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total rapports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mensuels</p>
              <p className="text-2xl font-bold text-gray-900">{stats.monthlyReports}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hebdomadaires</p>
              <p className="text-2xl font-bold text-gray-900">{stats.weeklyReports}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-500 p-3 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Quotidiens</p>
              <p className="text-2xl font-bold text-gray-900">{stats.dailyReports}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Aperçu rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+15.2%</div>
            <p className="text-sm text-gray-600">Croissance revenus</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">142</div>
            <p className="text-sm text-gray-600">Abonnements actifs</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">99.8%</div>
            <p className="text-sm text-gray-600">Uptime système</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">245ms</div>
            <p className="text-sm text-gray-600">Temps de réponse</p>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const ReportIcon = report.icon;
          return (
            <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${report.color}-100`}>
                  <ReportIcon className={`h-6 w-6 text-${report.color}-600`} />
                </div>
                <div className="flex space-x-1">
                  {getCategoryBadge(report.category)}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                {getFrequencyBadge(report.frequency)}
                <span className="text-xs text-gray-500">Généré le {report.lastGenerated}</span>
              </div>
              
              {/* Key Metrics */}
              <div className="space-y-2 mb-4">
                {report.category === 'financial' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Revenu total</span>
                      <span className="font-medium text-gray-900">{(report.metrics.totalRevenue / 1000000).toFixed(1)}M FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Croissance</span>
                      <span className="font-medium text-green-600">+{report.metrics.growth}%</span>
                    </div>
                  </>
                )}
                {report.category === 'operational' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hôpitaux actifs</span>
                      <span className="font-medium text-gray-900">{report.metrics.activeHospitals}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Patients moyens</span>
                      <span className="font-medium text-gray-900">{report.metrics.averagePatients}</span>
                    </div>
                  </>
                )}
                {report.category === 'user' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Utilisateurs actifs</span>
                      <span className="font-medium text-gray-900">{report.metrics.activeUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Nouveaux</span>
                      <span className="font-medium text-blue-600">+{report.metrics.newUsers}</span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Available Formats */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xs text-gray-500">Formats:</span>
                <div className="flex space-x-1">
                  {report.format.map((format) => (
                    <span key={format} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {format.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePreviewReport(report)}
                  className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Aperçu
                </button>
                <button
                  onClick={() => handleGenerateReport(report.id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Générer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Aperçu: {selectedReport.name}</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Report Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Résumé du rapport</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Catégorie:</span>
                    <span className="ml-2">{getCategoryBadge(selectedReport.category)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Fréquence:</span>
                    <span className="ml-2">{getFrequencyBadge(selectedReport.frequency)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Dernière génération:</span>
                    <span className="ml-2 text-gray-900">{selectedReport.lastGenerated}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Formats disponibles:</span>
                    <span className="ml-2 text-gray-900">{selectedReport.format.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Sample Data Visualization */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Aperçu des données</h4>
                
                {selectedReport.category === 'financial' && (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Évolution des revenus</h5>
                      <div className="space-y-2">
                        {reportData.revenue.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{item.month}</span>
                            <div className="flex items-center space-x-4">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${(item.revenue / 15000000) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {(item.revenue / 1000000).toFixed(1)}M FCFA
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport.category === 'operational' && (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Top hôpitaux par performance</h5>
                      <div className="space-y-2">
                        {reportData.hospitals.map((hospital, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium text-gray-900">{hospital.name}</span>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">{hospital.patients} patients</div>
                              <div className="text-sm font-medium text-gray-900">{hospital.consultations.toLocaleString()} consultations</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport.category === 'user' && (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Distribution des utilisateurs</h5>
                      <div className="space-y-2">
                        {reportData.users.map((user, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{user.type}</span>
                            <div className="flex items-center space-x-4">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${(user.count / 45678) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {user.count.toLocaleString()} (+{user.growth}%)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedReport.category === 'technical' && (
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Métriques système</h5>
                      <div className="space-y-2">
                        {reportData.performance.map((metric, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{metric.metric}</span>
                            <div className="flex items-center space-x-4">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    metric.value >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                                  }`}
                                  style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900">{metric.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 border-t pt-4">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <PrinterIcon className="h-4 w-4 mr-2" />
                  Imprimer
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
