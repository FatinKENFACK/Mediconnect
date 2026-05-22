import React, { useState, useEffect } from 'react';
import {
  LockClosedIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  KeyIcon,
  ServerIcon,
  Cog6ToothIcon,
  XCircleIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const PrivacyManagement = () => {
  const [privacySettings, setPrivacySettings] = useState({
    dataEncryption: true,
    anonymization: true,
    accessLogs: true,
    twoFactorAuth: false,
    sessionTimeout: 30,
    dataRetention: 365,
    gdprCompliant: true,
    hipaaCompliant: true,
    auditFrequency: 'monthly'
  });

  const [accessLogs, setAccessLogs] = useState([]);
  const [dataRequests, setDataRequests] = useState([]);
  const [complianceReports, setComplianceReports] = useState([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    // Simuler le chargement des logs d'accès
    setAccessLogs([
      {
        id: 1,
        user: 'Dr. Marie Sarr',
        userType: 'doctor',
        action: 'consultation',
        resource: 'patient_data',
        patientId: 'PAT-001',
        timestamp: '2024-03-25T14:30:00',
        ip: '192.168.1.100',
        location: 'Dakar, Sénégal',
        success: true,
        purpose: 'Consultation médicale'
      },
      {
        id: 2,
        user: 'Admin',
        userType: 'admin',
        action: 'export',
        resource: 'reports',
        timestamp: '2024-03-25T13:15:00',
        ip: '192.168.1.1',
        location: 'Dakar, Sénégal',
        success: true,
        purpose: 'Génération de rapport mensuel'
      },
      {
        id: 3,
        user: 'Dr. Aliou Ba',
        userType: 'doctor',
        action: 'modification',
        resource: 'patient_data',
        patientId: 'PAT-002',
        timestamp: '2024-03-25T11:45:00',
        ip: '192.168.1.102',
        location: 'Thiès, Sénégal',
        success: true,
        purpose: 'Mise à jour des informations patient'
      },
      {
        id: 4,
        user: 'Unknown',
        userType: 'unknown',
        action: 'access_denied',
        resource: 'patient_data',
        patientId: 'PAT-003',
        timestamp: '2024-03-25T10:30:00',
        ip: '192.168.1.200',
        location: 'Unknown',
        success: false,
        purpose: 'Tentative d\'accès non autorisé'
      },
      {
        id: 5,
        user: 'Clinique Saint-Jean',
        userType: 'hospital',
        action: 'bulk_export',
        resource: 'patient_records',
        timestamp: '2024-03-25T09:00:00',
        ip: '192.168.2.50',
        location: 'Dakar, Sénégal',
        success: true,
        purpose: 'Export pour analyse statistique'
      }
    ]);

    // Simuler les demandes de données
    setDataRequests([
      {
        id: 1,
        type: 'access_request',
        requester: 'Patient - Amadou Diallo',
        email: 'amadou.diallo@email.com',
        status: 'approved',
        requestDate: '2024-03-20',
        responseDate: '2024-03-22',
        dataRequested: ['dossiers médicaux', 'historique des consultations'],
        purpose: 'Transfert vers nouveau médecin',
        expiryDate: '2024-04-20'
      },
      {
        id: 2,
        type: 'deletion_request',
        requester: 'Patient - Fatou Ndiaye',
        email: 'fatou.ndiaye@email.com',
        status: 'pending',
        requestDate: '2024-03-24',
        responseDate: null,
        dataRequested: ['compte utilisateur', 'données personnelles'],
        purpose: 'Exercice du droit à l\'oubli',
        expiryDate: null
      },
      {
        id: 3,
        type: 'correction_request',
        requester: 'Patient - Moussa Fall',
        email: 'moussa.fall@email.com',
        status: 'completed',
        requestDate: '2024-03-18',
        responseDate: '2024-03-19',
        dataRequested: ['informations de contact'],
        purpose: 'Mise à jour des coordonnées',
        expiryDate: null
      }
    ]);

    // Simuler les rapports de conformité
    setComplianceReports([
      {
        id: 1,
        type: 'GDPR',
        title: 'Rapport de conformité RGPD - Mars 2024',
        status: 'compliant',
        generatedDate: '2024-03-01',
        nextReview: '2024-04-01',
        score: 98,
        issues: [],
        recommendations: ['Maintenir les pratiques actuelles']
      },
      {
        id: 2,
        type: 'HIPAA',
        title: 'Audit de sécurité HIPAA - Q1 2024',
        status: 'compliant',
        generatedDate: '2024-03-15',
        nextReview: '2024-06-15',
        score: 95,
        issues: ['Formation du personnel requise'],
        recommendations: ['Organiser une session de formation sur la confidentialité']
      },
      {
        id: 3,
        type: 'Internal',
        title: 'Audit interne de sécurité - Mars 2024',
        status: 'minor_issues',
        generatedDate: '2024-03-20',
        nextReview: '2024-04-20',
        score: 88,
        issues: ['Logs d\'accès incomplets', 'Mise à jour des politiques requise'],
        recommendations: ['Implémenter un logging complet', 'Réviser les politiques de confidentialité']
      }
    ]);
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      compliant: 'bg-green-100 text-green-800',
      minor_issues: 'bg-yellow-100 text-yellow-800',
      non_compliant: 'bg-red-100 text-red-800',
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
    };
    const labels = {
      compliant: 'Conforme',
      minor_issues: 'Problèmes mineurs',
      non_compliant: 'Non conforme',
      approved: 'Approuvé',
      pending: 'En attente',
      completed: 'Terminé',
      rejected: 'Rejeté'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSettingsUpdate = () => {
    // Logique de mise à jour des paramètres
    console.log('Updating privacy settings:', privacySettings);
    setShowSettingsModal(false);
  };

  const stats = {
    totalAccessLogs: accessLogs.length,
    successfulAccess: accessLogs.filter(log => log.success).length,
    failedAccess: accessLogs.filter(log => !log.success).length,
    pendingRequests: dataRequests.filter(req => req.status === 'pending').length,
    complianceScore: Math.round(complianceReports.reduce((sum, report) => sum + report.score, 0) / complianceReports.length)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Confidentialité des données</h1>
          <p className="text-gray-600 mt-2">Assurez la conformité et la protection des données médicales</p>
        </div>
        <button
          onClick={() => setShowSettingsModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Cog6ToothIcon className="h-5 w-5 mr-2" />
          Paramètres
        </button>
      </div>

      {/* Compliance Score */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Score de conformité global</h2>
            <p className="text-sm text-gray-600 mt-1">Basé sur les audits RGPD, HIPAA et internes</p>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(stats.complianceScore)}`}>
              {stats.complianceScore}%
            </div>
            <p className="text-sm text-gray-600">Excellent</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <EyeIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accès aux données</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAccessLogs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accès réussis</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successfulAccess}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-500 p-3 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Accès refusés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.failedAccess}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Demandes en attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de confidentialité actifs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <LockClosedIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-700">Chiffrement des données</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Actif</span>
          </div>
          <div className="flex items-center space-x-3">
            <EyeSlashIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-700">Anonymisation</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Actif</span>
          </div>
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-700">Logs d'accès</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Actif</span>
          </div>
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-700">Conformité RGPD</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Actif</span>
          </div>
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm text-gray-700">Conformité HIPAA</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Actif</span>
          </div>
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-5 w-5 text-yellow-600" />
            <span className="text-sm text-gray-700">Timeout de session</span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">{privacySettings.sessionTimeout} min</span>
          </div>
        </div>
      </div>

      {/* Recent Access Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Logs d'accès récents</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ressource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accessLogs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{log.user}</div>
                      <div className="text-sm text-gray-500">{log.userType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 capitalize">{log.action}</div>
                      <div className="text-xs text-gray-500">{log.purpose}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{log.resource}</div>
                    {log.patientId && (
                      <div className="text-xs text-gray-500">{log.patientId}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(log.timestamp).toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{log.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {log.success ? 'Succès' : 'Refusé'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Requests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Demandes de données</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demandeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.requester}</div>
                      <div className="text-sm text-gray-500">{request.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 capitalize">{request.type.replace('_', ' ')}</div>
                    <div className="text-xs text-gray-500">{request.purpose}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.requestDate}</div>
                    {request.responseDate && (
                      <div className="text-xs text-gray-500">Réponse: {request.responseDate}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                    {request.expiryDate && (
                      <div className="text-xs text-gray-500 mt-1">Expire: {request.expiryDate}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-800">
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Reports */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Rapports de conformité</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rapport
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complianceReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{report.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-lg font-bold ${getScoreColor(report.score)}`}>
                      {report.score}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{report.generatedDate}</div>
                    <div className="text-xs text-gray-500">Prochain: {report.nextReview}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                    {report.issues.length > 0 && (
                      <div className="text-xs text-yellow-600 mt-1">
                        {report.issues.length} issue(s)
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <DocumentArrowDownIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Paramètres de confidentialité</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Security Settings */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Paramètres de sécurité</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={privacySettings.dataEncryption}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, dataEncryption: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Chiffrement des données</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1 ml-6">Chiffrer toutes les données sensibles</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={privacySettings.anonymization}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, anonymization: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Anonymisation des données</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1 ml-6">Anonymiser les données pour les analyses</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={privacySettings.accessLogs}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, accessLogs: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Logs d'accès complets</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1 ml-6">Enregistrer tous les accès aux données</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={privacySettings.twoFactorAuth}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Authentification à deux facteurs</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1 ml-6">Exiger 2FA pour les accès administrateurs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Retention Settings */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Rétention des données</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeout de session (minutes)</label>
                    <input
                      type="number"
                      value={privacySettings.sessionTimeout}
                      onChange={(e) => setPrivacySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rétention des données (jours)</label>
                    <input
                      type="number"
                      value={privacySettings.dataRetention}
                      onChange={(e) => setPrivacySettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Compliance Settings */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Conformité</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={privacySettings.gdprCompliant}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, gdprCompliant: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Conformité RGPD</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1 ml-6">Respecter les réglementations RGPD</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={privacySettings.hipaaCompliant}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, hipaaCompliant: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Conformité HIPAA</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1 ml-6">Respecter les normes HIPAA</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence des audits</label>
                    <select
                      value={privacySettings.auditFrequency}
                      onChange={(e) => setPrivacySettings(prev => ({ ...prev, auditFrequency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuel</option>
                      <option value="quarterly">Trimestriel</option>
                      <option value="yearly">Annuel</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSettingsUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyManagement;
