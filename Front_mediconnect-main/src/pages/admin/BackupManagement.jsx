import React, { useState, useEffect } from 'react';
import {
  ServerIcon, CloudArrowUpIcon, CloudArrowDownIcon,
  CheckCircleIcon, XCircleIcon, ClockIcon,
  ExclamationTriangleIcon, DocumentArrowDownIcon,
  ShieldCheckIcon, ArrowPathIcon, TrashIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// HELPERS
// ============================================================
const StatusBadge = ({ status }) => {
  const map = {
    completed:   { label: 'Terminé',    cls: 'bg-green-100 text-green-800' },
    failed:      { label: 'Échoué',     cls: 'bg-red-100 text-red-800' },
    in_progress: { label: 'En cours',   cls: 'bg-blue-100 text-blue-800' },
  };
  const s = map[status] || map.completed;
  return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${s.cls}`}>{s.label}</span>;
};

const TypeBadge = ({ type }) => {
  const map = {
    automatic: { label: 'Automatique', cls: 'bg-blue-100 text-blue-800' },
    manual:    { label: 'Manuel',      cls: 'bg-gray-100 text-gray-800' },
  };
  const t = map[type] || map.automatic;
  return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${t.cls}`}>{t.label}</span>;
};

// ============================================================
// MODAL : Créer une sauvegarde
// ============================================================
const CreateModal = ({ onConfirm, onCancel, loading }) => {
  const [form, setForm] = useState({
    name:        '',
    compression: true,
    location:    'local',
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Nouvelle sauvegarde</h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom (optionnel)
            </label>
            <input type="text" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="ex: avant_mise_a_jour"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-gray-400 mt-1">
              Laissez vide pour un nom automatique avec la date.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stockage
            </label>
            <select value={form.location}
              onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
              <option value="local">Local (dossier backups/)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.compression}
              onChange={e => setForm(p => ({ ...p, compression: e.target.checked }))}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            Compression (.gz)
          </label>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-700">
              La sauvegarde inclut toutes les tables de la base de données.
              L'opération peut prendre quelques minutes.
            </p>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onCancel} disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm disabled:opacity-50">
            Annuler
          </button>
          <button onClick={() => onConfirm(form)} disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 flex items-center gap-2">
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {loading ? 'Création en cours...' : 'Créer la sauvegarde'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MODAL : Confirmer suppression
// ============================================================
const DeleteModal = ({ backup, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mx-auto mb-4">
        <TrashIcon className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 text-center">Supprimer cette sauvegarde ?</h3>
      <p className="text-sm text-gray-500 text-center mt-2">
        <span className="font-medium text-gray-700">{backup?.name}</span> sera définitivement supprimée.
      </p>
      <div className="mt-6 flex gap-3">
        <button onClick={onCancel} disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm disabled:opacity-50">
          Annuler
        </button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          Supprimer
        </button>
      </div>
    </div>
  </div>
);

// ============================================================
// MODAL : Paramètres automatiques
// ============================================================
const SettingsPanel = ({ settings, onChange }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">
      Paramètres de sauvegarde automatique
    </h2>
    <p className="text-xs text-gray-500 mb-4">
      Ces paramètres configurent les sauvegardes via <code>python manage.py dbbackup</code>.
      Pour automatiser, utilisez un cron job ou Celery Beat.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence recommandée</label>
        <select value={settings.frequency}
          onChange={e => onChange('frequency', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
          <option value="daily">Quotidien</option>
          <option value="weekly">Hebdomadaire</option>
          <option value="monthly">Mensuel</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Heure recommandée</label>
        <input type="time" value={settings.time}
          onChange={e => onChange('time', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rétention (jours)</label>
        <input type="number" value={settings.retention} min={1} max={365}
          onChange={e => onChange('retention', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>
    <div className="flex items-center gap-6 mt-4">
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={settings.compression}
          onChange={e => onChange('compression', e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        Compression
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={settings.encryption}
          onChange={e => onChange('encryption', e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        Chiffrement
      </label>
    </div>

    {/* Cron helper */}
    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
      <p className="text-xs font-medium text-gray-700 mb-1">
        Commande cron pour automatiser ({settings.frequency}) :
      </p>
      <code className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded block">
        {settings.frequency === 'daily'   && `0 ${settings.time.split(':')[0]} * * * cd /votre/projet && python manage.py dbbackup --compress`}
        {settings.frequency === 'weekly'  && `0 ${settings.time.split(':')[0]} * * 1 cd /votre/projet && python manage.py dbbackup --compress`}
        {settings.frequency === 'monthly' && `0 ${settings.time.split(':')[0]} 1 * * cd /votre/projet && python manage.py dbbackup --compress`}
      </code>
    </div>
  </div>
);

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
const BackupManagement = () => {
  const [backups, setBackups]               = useState([]);
  const [stats, setStats]                   = useState(null);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [createLoading, setCreateLoading]   = useState(false);
  const [deleteLoading, setDeleteLoading]   = useState(false);
  const [notification, setNotification]     = useState(null);
  const [autoSettings, setAutoSettings]     = useState({
    frequency:   'daily',
    time:        '02:00',
    retention:   30,
    compression: true,
    encryption:  true,
  });

  // ---- Chargement ----
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [listData, statsData] = await Promise.all([
        api.getBackups(),
        api.getBackupStats(),
      ]);
      setBackups(listData.backups || []);
      setStats(statsData);
    } catch {
      setError('Impossible de charger les sauvegardes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ---- Notification ----
  const showNotif = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // ---- Créer ----
  const handleCreate = async (form) => {
    setCreateLoading(true);
    try {
      const result = await api.createBackup({
        name:        form.name,
        compression: form.compression,
      });
      if (result.backup) {
        setBackups(prev => [result.backup, ...prev]);
      }
      setShowCreateModal(false);
      showNotif('success', 'Sauvegarde créée avec succès.');
      load(); // Rafraîchir les stats
    } catch (err) {
      showNotif('error', err.message || 'Erreur lors de la création.');
    } finally {
      setCreateLoading(false);
    }
  };

  // ---- Télécharger ----
  const handleDownload = async (backup) => {
    try {
      await api.downloadBackup(backup.name);
      showNotif('success', 'Téléchargement démarré.');
    } catch {
      showNotif('error', 'Erreur lors du téléchargement.');
    }
  };

  // ---- Supprimer ----
  const openDelete = (backup) => {
    setSelectedBackup(backup);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.deleteBackup(selectedBackup.name);
      setBackups(prev => prev.filter(b => b.name !== selectedBackup.name));
      showNotif('success', `Sauvegarde "${selectedBackup.name}" supprimée.`);
      setShowDeleteModal(false);
      setSelectedBackup(null);
      load();
    } catch {
      showNotif('error', 'Erreur lors de la suppression.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ---- Stats locales ----
  const localStats = {
    total:     backups.length,
    completed: backups.filter(b => b.status === 'completed').length,
    failed:    backups.filter(b => b.status === 'failed').length,
    totalSize: stats?.total_size || '0.00 GB',
    lastBackup: stats?.last_backup
      ? new Date(stats.last_backup).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })
      : 'Jamais',
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6 p-6">

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 ${
          notification.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success'
            ? <CheckCircleIcon className="h-5 w-5 text-green-600" />
            : <XCircleIcon className="h-5 w-5 text-red-600" />}
          {notification.message}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateModal
          onConfirm={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={createLoading}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          backup={selectedBackup}
          onConfirm={confirmDelete}
          onCancel={() => { setShowDeleteModal(false); setSelectedBackup(null); }}
          loading={deleteLoading}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sauvegardes</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Protégez les données de la plateforme MediConnect
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={createLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50">
            <CloudArrowUpIcon className="h-4 w-4" />
            Nouvelle sauvegarde
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={load} className="text-sm text-red-700 underline">Réessayer</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total sauvegardes', value: localStats.total,     icon: ServerIcon,       color: 'bg-blue-500' },
          { label: 'Réussies',          value: localStats.completed, icon: CheckCircleIcon,  color: 'bg-green-500' },
          { label: 'Échouées',          value: localStats.failed,    icon: XCircleIcon,      color: 'bg-red-500' },
          { label: 'Espace utilisé',    value: localStats.totalSize, icon: ShieldCheckIcon,  color: 'bg-purple-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`${s.color} p-3 rounded-lg`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dernière sauvegarde */}
      <div className={`p-4 rounded-xl border flex items-center gap-3 ${
        localStats.lastBackup === 'Jamais'
          ? 'bg-yellow-50 border-yellow-200'
          : 'bg-green-50 border-green-200'
      }`}>
        <ClockIcon className={`h-5 w-5 flex-shrink-0 ${
          localStats.lastBackup === 'Jamais' ? 'text-yellow-600' : 'text-green-600'
        }`} />
        <p className="text-sm">
          <span className="font-medium">Dernière sauvegarde : </span>
          {localStats.lastBackup}
        </p>
      </div>

      {/* Paramètres automatiques */}
      <SettingsPanel
        settings={autoSettings}
        onChange={(key, val) => setAutoSettings(p => ({ ...p, [key]: val }))}
      />

      {/* Liste des sauvegardes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Historique des sauvegardes</h2>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : backups.length === 0 ? (
          <div className="p-12 text-center">
            <ServerIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Aucune sauvegarde trouvée</p>
            <p className="text-gray-400 text-xs mt-1">
              Cliquez sur "Nouvelle sauvegarde" pour créer la première.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Fichier', 'Type', 'Statut', 'Taille', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {backups.map(backup => (
                  <tr key={backup.id} className="hover:bg-gray-50 transition-colors">
                    {/* Nom */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <ServerIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-mono font-medium text-gray-900 truncate max-w-xs">
                            {backup.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {backup.compression && (
                              <span className="text-xs text-blue-600">📦 Compressé</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <TypeBadge type={backup.type} />
                    </td>

                    {/* Statut */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={backup.status} />
                    </td>

                    {/* Taille */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{backup.size}</p>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{backup.date}</p>
                      <p className="text-xs text-gray-400">{backup.time}</p>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {backup.status === 'completed' && (
                          <button
                            onClick={() => handleDownload(backup)}
                            title="Télécharger"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                            <DocumentArrowDownIcon className="h-3.5 w-3.5" />
                            Télécharger
                          </button>
                        )}
                        <button
                          onClick={() => openDelete(backup)}
                          title="Supprimer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          <TrashIcon className="h-3.5 w-3.5" />
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && backups.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              {backups.length} sauvegarde{backups.length > 1 ? 's' : ''} · Espace total : {localStats.totalSize}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupManagement;