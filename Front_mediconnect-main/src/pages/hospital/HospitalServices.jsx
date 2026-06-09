import React, { useState, useEffect } from 'react';
import {
  HeartIcon, PlusIcon, PencilIcon, TrashIcon,
  MagnifyingGlassIcon, CheckCircleIcon, ClockIcon,
  CurrencyDollarIcon, UserGroupIcon, XCircleIcon,
  ArrowPathIcon, PowerIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// MODAL SUPPRESSION
// ============================================================
const DeleteModal = ({ service, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mx-auto mb-4">
        <TrashIcon className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 text-center">Supprimer ce service ?</h3>
      <p className="mt-2 text-sm text-gray-500 text-center">
        Vous êtes sur le point de supprimer{' '}
        <span className="font-medium text-gray-900">{service?.name}</span>.
        Cette action est irréversible.
      </p>
      <div className="mt-6 flex gap-3">
        <button onClick={onCancel} disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Annuler
        </button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading
            ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            : <TrashIcon className="h-4 w-4" />}
          Supprimer
        </button>
      </div>
    </div>
  </div>
);

// ============================================================
// MODAL AJOUT / MODIFICATION
// ============================================================
const ServiceModal = ({ service, onSave, onCancel, loading }) => {
  const [form, setForm] = useState({
    name:             service?.name             || '',
    description:      service?.description      || '',
    category:         service?.category         || '',
    consultation_fee: service?.consultation_fee || 0,
    duration:         service?.duration         || '30 min',
    is_active:        service?.is_active        ?? true,
  });
  const [errors, setErrors] = useState({});

  const categories = [
    'Consultation générale', 'Spécialités médicales', 'Chirurgie',
    'Imagerie médicale', 'Laboratoire', 'Soins intensifs',
    'Urgences', 'Prévention et dépistage', 'Rééducation',
    'Santé mentale', 'Autres',
  ];

  const validate = () => {
    const e = {};
    if (!form.name)             e.name = 'Le nom est requis';
    if (!form.category)         e.category = 'La catégorie est requise';
    if (form.consultation_fee <= 0) e.consultation_fee = 'Le tarif doit être supérieur à 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {service ? 'Modifier le service' : 'Ajouter un service'}
          </h3>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du service *</label>
            <input type="text" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Cardiologie"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-400' : 'border-gray-300'}`} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
            <select value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-400' : 'border-gray-300'}`}>
              <option value="">Sélectionner</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3} placeholder="Description du service..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarif (XAF) *</label>
              <input type="number" value={form.consultation_fee}
                onChange={e => setForm(p => ({ ...p, consultation_fee: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.consultation_fee ? 'border-red-400' : 'border-gray-300'}`} />
              {errors.consultation_fee && <p className="text-red-500 text-xs mt-1">{errors.consultation_fee}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
              <input type="text" value={form.duration}
                onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                placeholder="30 min"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.is_active}
              onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            Service actif
          </label>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onCancel} disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm disabled:opacity-50">
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50 flex items-center gap-2">
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
            {service ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
const HospitalServices = () => {
  const [services, setServices]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [searchQuery, setSearchQuery]         = useState('');
  const [filterStatus, setFilterStatus]       = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [deleteLoading, setDeleteLoading]     = useState(false);
  const [saveLoading, setSaveLoading]         = useState(false);
  const [togglingId, setTogglingId]           = useState(null);
  const [notification, setNotification]       = useState(null);

  // ---- Chargement ----
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHospitalServices();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      setError('Impossible de charger les services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ---- Notification ----
  const showNotif = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // ---- Ajouter / Modifier ----
  const openAdd  = () => { setSelectedService(null); setShowServiceModal(true); };
  const openEdit = (s) => { setSelectedService(s); setShowServiceModal(true); };

  const handleSave = async (formData) => {
    setSaveLoading(true);
    try {
      if (selectedService) {
        const updated = await api.updateHospitalService(selectedService.id, formData);
        setServices(prev => prev.map(s => s.id === selectedService.id ? updated : s));
        showNotif('success', 'Service mis à jour.');
      } else {
        const created = await api.createHospitalService(formData);
        setServices(prev => [created, ...prev]);
        showNotif('success', 'Service ajouté avec succès.');
      }
      setShowServiceModal(false);
      setSelectedService(null);
    } catch (err) {
      showNotif('error', err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaveLoading(false);
    }
  };

  // ---- Toggle activer/désactiver ----
  const handleToggle = async (service) => {
    setTogglingId(service.id);
    try {
      const updated = await api.updateHospitalService(service.id, { is_active: !service.is_active });
      setServices(prev => prev.map(s => s.id === service.id ? updated : s));
      showNotif('success', updated.is_active ? 'Service activé.' : 'Service désactivé.');
    } catch {
      showNotif('error', 'Erreur lors de la mise à jour.');
    } finally {
      setTogglingId(null);
    }
  };

  // ---- Supprimer ----
  const openDelete = (s) => { setSelectedService(s); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.deleteHospitalService(selectedService.id);
      setServices(prev => prev.filter(s => s.id !== selectedService.id));
      showNotif('success', `Service "${selectedService.name}" supprimé.`);
      setShowDeleteModal(false);
      setSelectedService(null);
    } catch {
      showNotif('error', 'Erreur lors de la suppression.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ---- Filtres ----
  const filtered = services.filter(s => {
    const matchSearch = !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && s.is_active) ||
      (filterStatus === 'inactive' && !s.is_active);
    return matchSearch && matchStatus;
  });

  const stats = {
    total:    services.length,
    active:   services.filter(s => s.is_active).length,
    inactive: services.filter(s => !s.is_active).length,
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="p-6 space-y-6">

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
      {showDeleteModal && (
        <DeleteModal
          service={selectedService}
          onConfirm={confirmDelete}
          onCancel={() => { setShowDeleteModal(false); setSelectedService(null); }}
          loading={deleteLoading}
        />
      )}
      {showServiceModal && (
        <ServiceModal
          service={selectedService}
          onSave={handleSave}
          onCancel={() => { setShowServiceModal(false); setSelectedService(null); }}
          loading={saveLoading}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 mt-1 text-sm">Gérez les services médicaux de votre établissement</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <PlusIcon className="h-4 w-4" />
            Ajouter un service
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total services',    value: stats.total,    color: 'bg-blue-500',   icon: HeartIcon },
          { label: 'Services actifs',   value: stats.active,   color: 'bg-green-500',  icon: CheckCircleIcon },
          { label: 'Services inactifs', value: stats.inactive, color: 'bg-yellow-500', icon: ClockIcon },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`${s.color} p-3 rounded-lg`}>
                <s.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Rechercher un service..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
          <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Grille */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 animate-pulse">
              <div className="h-36 bg-gray-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">
            {services.length === 0
              ? 'Aucun service ajouté — cliquez sur "Ajouter un service" pour commencer'
              : 'Aucun service correspond à votre recherche'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(service => (
            <div key={service.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Bannière */}
              <div className={`h-36 flex items-center justify-center ${
                service.is_active
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                  : 'bg-gradient-to-br from-gray-300 to-gray-400'
              }`}>
                <HeartIcon className="h-14 w-14 text-white opacity-80" />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-base font-semibold text-gray-900">{service.name}</h3>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {service.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>

                {service.category && (
                  <p className="text-xs text-blue-600 font-medium mb-2">{service.category}</p>
                )}

                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {service.description || 'Aucune description'}
                </p>

                <div className="space-y-1.5 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                    <span>{Number(service.consultation_fee).toLocaleString('fr-FR')} XAF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-gray-400" />
                    <span>{service.duration || '—'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleToggle(service)}
                    disabled={togglingId === service.id}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-1 ${
                      service.is_active
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}>
                    {togglingId === service.id
                      ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                      : <PowerIcon className="h-3.5 w-3.5" />}
                    {service.is_active ? 'Désactiver' : 'Activer'}
                  </button>
                  <button onClick={() => openEdit(service)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Modifier">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => openDelete(service)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg" title="Supprimer">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer compteur */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-center">
          {filtered.length} service{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
          {filtered.length !== services.length && ` sur ${services.length} au total`}
        </p>
      )}
    </div>
  );
};

export default HospitalServices;