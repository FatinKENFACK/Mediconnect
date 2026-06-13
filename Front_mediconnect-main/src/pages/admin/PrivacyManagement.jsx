import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  LockClosedIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
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

  const [accessLogs, setAccessLogs]       = useState([]);
  const [dataRequests, setDataRequests]   = useState([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // ============================================================
  // CHARGEMENT
  // ============================================================
  useEffect(() => {
    const loadAll = async () => {
      try {
        // Stats + paramètres
        const statsData = await api.getPrivacyStats();
        setPrivacySettings({
          dataEncryption: statsData.settings.data_encryption,
          anonymization:  statsData.settings.anonymization,
          accessLogs:     statsData.settings.access_logs,
          twoFactorAuth:  statsData.settings.two_factor_auth,
          sessionTimeout: statsData.settings.session_timeout,
          dataRetention:  statsData.settings.data_retention,
          gdprCompliant:  statsData.settings.gdpr_compliant,
          hipaaCompliant: statsData.settings.hipaa_compliant,
          auditFrequency: statsData.settings.audit_frequency,
        });

        // Logs d'accès
        const logsData = await api.getAccessLogs();
        setAccessLogs(logsData.logs || []);

        // Demandes de données
        const requestsData = await api.getDataRequests();
        setDataRequests(Array.isArray(requestsData) ? requestsData : []);

      } catch (err) {
        console.error('Erreur chargement privacy:', err);
      }
    };
    loadAll();
  }, []);

  // ============================================================
  // HELPERS
  // ============================================================
  const getStatusBadge = (status) => {
    const styles = {
      compliant:     'bg-green-100 text-green-800',
      minor_issues:  'bg-yellow-100 text-yellow-800',
      non_compliant: 'bg-red-100 text-red-800',
      approved:      'bg-green-100 text-green-800',
      pending:       'bg-yellow-100 text-yellow-800',
      completed:     'bg-blue-100 text-blue-800',
      rejected:      'bg-red-100 text-red-800'
    };
    const labels = {
      compliant:     'Conforme',
      minor_issues:  'Problèmes mineurs',
      non_compliant: 'Non conforme',
      approved:      'Approuvé',
      pending:       'En attente',
      completed:     'Terminé',
      rejected:      'Rejeté'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  // ============================================================
  // SAUVEGARDER LES PARAMÈTRES
  // ============================================================
  const handleSettingsUpdate = async () => {
    try {
      await api.updatePrivacySettings({
        data_encryption: privacySettings.dataEncryption,
        anonymization:   privacySettings.anonymization,
        access_logs:     privacySettings.accessLogs,
        two_factor_auth: privacySettings.twoFactorAuth,
        session_timeout: privacySettings.sessionTimeout,
        data_retention:  privacySettings.dataRetention,
        gdpr_compliant:  privacySettings.gdprCompliant,
        hipaa_compliant: privacySettings.hipaaCompliant,
        audit_frequency: privacySettings.auditFrequency,
      });
      setShowSettingsModal(false);
    } catch (err) {
      console.error('Erreur sauvegarde paramètres:', err);
    }
  };

  // ============================================================
  // STATS CALCULÉES
  // ============================================================
  const stats = {
    totalAccessLogs:  accessLogs.length,
    successfulAccess: accessLogs.filter(log => log.success).length,
    failedAccess:     accessLogs.filter(log => !log.success).length,
    pendingRequests:  dataRequests.filter(req => req.status === 'pending').length,
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6">

      {/* ====== HEADER ====== */}
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

      {/* ====== STATS CARDS ====== */}
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

      {/* ====== PARAMÈTRES ACTIFS ====== */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de confidentialité actifs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <LockClosedIcon className={`h-5 w-5 ${privacySettings.dataEncryption ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-sm text-gray-700">Chiffrement des données</span>
            <span className={`px-2 py-1 text-xs rounded-full ${privacySettings.dataEncryption ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {privacySettings.dataEncryption ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <EyeSlashIcon className={`h-5 w-5 ${privacySettings.anonymization ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-sm text-gray-700">Anonymisation</span>
            <span className={`px-2 py-1 text-xs rounded-full ${privacySettings.anonymization ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {privacySettings.anonymization ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <DocumentTextIcon className={`h-5 w-5 ${privacySettings.accessLogs ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-sm text-gray-700">Logs d'accès</span>
            <span className={`px-2 py-1 text-xs rounded-full ${privacySettings.accessLogs ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {privacySettings.accessLogs ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className={`h-5 w-5 ${privacySettings.gdprCompliant ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-sm text-gray-700">Conformité RGPD</span>
            <span className={`px-2 py-1 text-xs rounded-full ${privacySettings.gdprCompliant ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {privacySettings.gdprCompliant ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <ShieldCheckIcon className={`h-5 w-5 ${privacySettings.hipaaCompliant ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="text-sm text-gray-700">Conformité HIPAA</span>
            <span className={`px-2 py-1 text-xs rounded-full ${privacySettings.hipaaCompliant ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {privacySettings.hipaaCompliant ? 'Actif' : 'Inactif'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-5 w-5 text-yellow-600" />
            <span className="text-sm text-gray-700">Timeout de session</span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              {privacySettings.sessionTimeout} min
            </span>
          </div>
        </div>
      </div>

      {/* ====== LOGS D'ACCÈS ====== */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Logs d'accès récents</h2>
        </div>
        {accessLogs.length === 0 ? (
          <div className="p-12 text-center">
            <EyeIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Aucun log d'accès enregistré pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Utilisateur', 'Action', 'Ressource', 'Timestamp', 'Statut'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accessLogs.slice(0, 10).map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.user_name}</div>
                      <div className="text-sm text-gray-500">{log.user_type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{log.action}</div>
                      <div className="text-xs text-gray-500">{log.purpose}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{log.resource}</div>
                      {log.patient_id && (
                        <div className="text-xs text-gray-500">{log.patient_id}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(log.created_at).toLocaleString('fr-FR')}
                      </div>
                      {log.location && (
                        <div className="text-xs text-gray-500">{log.location}</div>
                      )}
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
        )}
      </div>

      {/* ====== DEMANDES DE DONNÉES ====== */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Demandes de données</h2>
        </div>
        {dataRequests.length === 0 ? (
          <div className="p-12 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Aucune demande de données pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Demandeur', 'Type', 'Date', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.requester_name}</div>
                      <div className="text-sm text-gray-500">{request.requester_email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {request.request_type?.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xs text-gray-500">{request.purpose}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.created_at?.split('T')[0]}
                      </div>
                      {request.response_date && (
                        <div className="text-xs text-gray-500">Réponse : {request.response_date}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                      {request.expiry_date && (
                        <div className="text-xs text-gray-500 mt-1">Expire : {request.expiry_date}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800" title="Voir">
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={async () => {
                                await api.updateDataRequest(request.id, 'approve');
                                setDataRequests(prev =>
                                  prev.map(r => r.id === request.id ? { ...r, status: 'approved' } : r)
                                );
                              }}
                              className="text-green-600 hover:text-green-800"
                              title="Approuver"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={async () => {
                                await api.updateDataRequest(request.id, 'reject');
                                setDataRequests(prev =>
                                  prev.map(r => r.id === request.id ? { ...r, status: 'rejected' } : r)
                                );
                              }}
                              className="text-red-600 hover:text-red-800"
                              title="Rejeter"
                            >
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
        )}
      </div>

      {/* ====== RAPPORTS DE CONFORMITÉ (à venir) ====== */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Rapports de conformité</h2>
        </div>
        <div className="p-12 text-center">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">Les rapports de conformité seront disponibles prochainement.</p>
          <p className="text-gray-400 text-xs mt-1">RGPD · HIPAA · Audit interne</p>
        </div>
      </div>

      {/* ====== MODAL PARAMÈTRES ====== */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Paramètres de confidentialité</h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">

              {/* Sécurité */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Paramètres de sécurité</h4>
                <div className="space-y-4">
                  {[
                    { key: 'dataEncryption', label: 'Chiffrement des données',        desc: 'Chiffrer toutes les données sensibles' },
                    { key: 'anonymization',  label: 'Anonymisation des données',      desc: 'Anonymiser les données pour les analyses' },
                    { key: 'accessLogs',     label: "Logs d'accès complets",          desc: "Enregistrer tous les accès aux données" },
                    { key: 'twoFactorAuth',  label: 'Authentification à deux facteurs',desc: 'Exiger 2FA pour les accès administrateurs' },
                  ].map(item => (
                    <div key={item.key}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={privacySettings[item.key]}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{item.label}</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1 ml-6">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rétention */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Rétention des données</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeout de session (minutes)
                    </label>
                    <input
                      type="number"
                      value={privacySettings.sessionTimeout}
                      onChange={(e) => setPrivacySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rétention des données (jours)
                    </label>
                    <input
                      type="number"
                      value={privacySettings.dataRetention}
                      onChange={(e) => setPrivacySettings(prev => ({ ...prev, dataRetention: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Conformité */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Conformité</h4>
                <div className="space-y-4">
                  {[
                    { key: 'gdprCompliant',  label: 'Conformité RGPD',  desc: 'Respecter les réglementations RGPD' },
                    { key: 'hipaaCompliant', label: 'Conformité HIPAA', desc: 'Respecter les normes HIPAA' },
                  ].map(item => (
                    <div key={item.key}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={privacySettings[item.key]}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{item.label}</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1 ml-6">{item.desc}</p>
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fréquence des audits
                    </label>
                    <select
                      value={privacySettings.auditFrequency}
                      onChange={(e) => setPrivacySettings(prev => ({ ...prev, auditFrequency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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