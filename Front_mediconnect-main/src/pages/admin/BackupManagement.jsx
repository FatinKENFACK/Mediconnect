import React, { useState, useEffect } from 'react';
import {
  ServerIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  ShieldCheckIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

const BackupManagement = () => {
  const [backups, setBackups] = useState([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [backupSettings, setBackupSettings] = useState({
    frequency: 'daily',
    time: '02:00',
    retention: 30,
    compression: true,
    encryption: true,
    location: 'cloud'
  });

  useEffect(() => {
    // Simuler le chargement des sauvegardes
    setBackups([
      {
        id: 1,
        name: 'backup_2024_03_25_02_00',
        type: 'automatic',
        status: 'completed',
        size: '2.3 GB',
        date: '2024-03-25',
        time: '02:00:00',
        duration: '12 min 34 sec',
        location: 'cloud',
        compression: true,
        encryption: true,
        databases: ['patients', 'doctors', 'hospitals', 'appointments', 'payments'],
        files: 15420,
        checksum: 'a1b2c3d4e5f6',
        createdBy: 'System',
        restored: false
      },
      {
        id: 2,
        name: 'backup_2024_03_24_02_00',
        type: 'automatic',
        status: 'completed',
        size: '2.1 GB',
        date: '2024-03-24',
        time: '02:00:00',
        duration: '10 min 15 sec',
        location: 'cloud',
        compression: true,
        encryption: true,
        databases: ['patients', 'doctors', 'hospitals', 'appointments', 'payments'],
        files: 14890,
        checksum: 'f6e5d4c3b2a1',
        createdBy: 'System',
        restored: false
      },
      {
        id: 3,
        name: 'manual_backup_march_23',
        type: 'manual',
        status: 'completed',
        size: '2.5 GB',
        date: '2024-03-23',
        time: '15:30:00',
        duration: '15 min 45 sec',
        location: 'local',
        compression: true,
        encryption: true,
        databases: ['patients', 'doctors', 'hospitals', 'appointments', 'payments'],
        files: 16200,
        checksum: 'z9y8x7w6v5u4',
        createdBy: 'Admin',
        restored: false
      },
      {
        id: 4,
        name: 'backup_2024_03_22_02_00',
        type: 'automatic',
        status: 'failed',
        size: '0 GB',
        date: '2024-03-22',
        time: '02:00:00',
        duration: '3 min 12 sec',
        location: 'cloud',
        compression: true,
        encryption: true,
        databases: [],
        files: 0,
        checksum: null,
        createdBy: 'System',
        restored: false,
        error: 'Connection timeout to cloud storage'
      },
      {
        id: 5,
        name: 'weekly_backup_2024_03_20',
        type: 'scheduled',
        status: 'completed',
        size: '2.8 GB',
        date: '2024-03-20',
        time: '01:00:00',
        duration: '18 min 20 sec',
        location: 'both',
        compression: true,
        encryption: true,
        databases: ['patients', 'doctors', 'hospitals', 'appointments', 'payments', 'logs'],
        files: 18750,
        checksum: 'm1n2b3v4c5x6',
        createdBy: 'System',
        restored: false
      }
    ]);
  }, []);

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      in_progress: 'bg-blue-100 text-blue-800',
      scheduled: 'bg-yellow-100 text-yellow-800'
    };
    const labels = {
      completed: 'Terminé',
      failed: 'Échoué',
      in_progress: 'En cours',
      scheduled: 'Programmé'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      automatic: 'bg-blue-100 text-blue-800',
      manual: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-purple-100 text-purple-800'
    };
    const labels = {
      automatic: 'Automatique',
      manual: 'Manuel',
      scheduled: 'Programmé'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[type]}`}>
        {labels[type]}
      </span>
    );
  };

  const getLocationBadge = (location) => {
    const styles = {
      cloud: 'bg-green-100 text-green-800',
      local: 'bg-orange-100 text-orange-800',
      both: 'bg-blue-100 text-blue-800'
    };
    const labels = {
      cloud: 'Cloud',
      local: 'Local',
      both: 'Cloud + Local'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[location]}`}>
        {labels[location]}
      </span>
    );
  };

  const handleCreateBackup = (settings) => {
    setIsCreatingBackup(true);
    setShowCreateModal(false);
    
    // Simuler la création de sauvegarde
    setTimeout(() => {
      const newBackup = {
        id: backups.length + 1,
        name: `manual_backup_${new Date().toISOString().split('T')[0].replace(/-/g, '_')}`,
        type: 'manual',
        status: 'completed',
        size: '2.4 GB',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
        duration: '14 min 20 sec',
        location: settings.location,
        compression: settings.compression,
        encryption: settings.encryption,
        databases: ['patients', 'doctors', 'hospitals', 'appointments', 'payments'],
        files: 15600,
        checksum: 'new_backup_checksum',
        createdBy: 'Admin',
        restored: false
      };
      
      setBackups(prev => [newBackup, ...prev]);
      setIsCreatingBackup(false);
    }, 5000);
  };

  const handleRestoreBackup = (backup) => {
    setSelectedBackup(backup);
    setShowRestoreModal(true);
  };

  const confirmRestore = () => {
    // Logique de restauration
    console.log(`Restoring backup: ${selectedBackup.name}`);
    setShowRestoreModal(false);
    setSelectedBackup(null);
  };

  const stats = {
    total: backups.length,
    completed: backups.filter(b => b.status === 'completed').length,
    failed: backups.filter(b => b.status === 'failed').length,
    totalSize: backups.filter(b => b.status === 'completed').reduce((sum, b) => {
      const size = parseFloat(b.size);
      return sum + size;
    }, 0),
    lastBackup: backups.find(b => b.status === 'completed')?.date || null
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des sauvegardes</h1>
          <p className="text-gray-600 mt-2">Protégez et restaurez les données de la plateforme</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={isCreatingBackup}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isCreatingBackup ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Création en cours...
            </>
          ) : (
            <>
              <CloudArrowUpIcon className="h-5 w-5 mr-2" />
              Nouvelle sauvegarde
            </>
          )}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <ServerIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total sauvegardes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Réussies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-500 p-3 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Échouées</p>
              <p className="text-2xl font-bold text-gray-900">{stats.failed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <FolderIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Espace utilisé</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSize.toFixed(1)} GB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de sauvegarde automatique</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence</label>
            <select
              value={backupSettings.frequency}
              onChange={(e) => setBackupSettings(prev => ({ ...prev, frequency: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Quotidien</option>
              <option value="weekly">Hebdomadaire</option>
              <option value="monthly">Mensuel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Heure</label>
            <input
              type="time"
              value={backupSettings.time}
              onChange={(e) => setBackupSettings(prev => ({ ...prev, time: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rétention (jours)</label>
            <input
              type="number"
              value={backupSettings.retention}
              onChange={(e) => setBackupSettings(prev => ({ ...prev, retention: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-6 mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={backupSettings.compression}
              onChange={(e) => setBackupSettings(prev => ({ ...prev, compression: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Compression</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={backupSettings.encryption}
              onChange={(e) => setBackupSettings(prev => ({ ...prev, encryption: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Chiffrement</span>
          </label>
        </div>
      </div>

      {/* Backups List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sauvegarde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taille
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{backup.name}</div>
                      <div className="text-sm text-gray-500">Créé par {backup.createdBy}</div>
                      {backup.duration && (
                        <div className="text-xs text-gray-400">Durée: {backup.duration}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(backup.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(backup.status)}
                    {backup.error && (
                      <div className="text-xs text-red-600 mt-1">{backup.error}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{backup.size}</div>
                    {backup.files > 0 && (
                      <div className="text-xs text-gray-500">{backup.files.toLocaleString()} fichiers</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getLocationBadge(backup.location)}
                    <div className="flex items-center mt-1 space-x-2">
                      {backup.compression && (
                        <span className="text-xs text-green-600">Compressé</span>
                      )}
                      {backup.encryption && (
                        <span className="text-xs text-blue-600">Chiffré</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{backup.date}</div>
                    <div className="text-xs text-gray-500">{backup.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {backup.status === 'completed' && (
                        <>
                          <button
                            onClick={() => handleRestoreBackup(backup)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Restaurer"
                          >
                            <CloudArrowDownIcon className="h-5 w-5" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-800"
                            title="Télécharger"
                          >
                            <DocumentArrowDownIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                      {backup.status === 'failed' && (
                        <button
                          className="text-orange-600 hover:text-orange-800"
                          title="Réessayer"
                        >
                          <PlayIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Backup Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Créer une sauvegarde</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la sauvegarde</label>
                <input
                  type="text"
                  placeholder="backup_2024_03_25_manual"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location de stockage</label>
                <select
                  value={backupSettings.location}
                  onChange={(e) => setBackupSettings(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cloud">Cloud uniquement</option>
                  <option value="local">Local uniquement</option>
                  <option value="both">Cloud + Local</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bases de données à inclure</label>
                <div className="space-y-2">
                  {['patients', 'doctors', 'hospitals', 'appointments', 'payments'].map((db) => (
                    <label key={db} className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{db}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Compression</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={true}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Chiffrement</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleCreateBackup(backupSettings)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Créer la sauvegarde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Restore Modal */}
      {showRestoreModal && selectedBackup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Restaurer la sauvegarde</h3>
              <button
                onClick={() => setShowRestoreModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Attention</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>La restauration remplacera toutes les données actuelles par celles de la sauvegarde du <strong>{selectedBackup.date}</strong>.</p>
                      <p>Cette action est irréversible. Assurez-vous d'avoir une sauvegarde récente avant de continuer.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nom de la sauvegarde</p>
                  <p className="text-sm text-gray-900">{selectedBackup.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Taille</p>
                  <p className="text-sm text-gray-900">{selectedBackup.size}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-sm text-gray-900">{selectedBackup.date} à {selectedBackup.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Fichiers</p>
                  <p className="text-sm text-gray-900">{selectedBackup.files.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Bases de données incluses</p>
                <div className="flex flex-wrap gap-2">
                  {selectedBackup.databases.map((db, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                      {db}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRestoreModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmRestore}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Restaurer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupManagement;
