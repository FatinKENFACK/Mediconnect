import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  BuildingOfficeIcon, MagnifyingGlassIcon, CheckCircleIcon,
  XCircleIcon, ClockIcon, EyeIcon, UserGroupIcon,
  MapPinIcon, ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const HospitalManagement = () => {
  const [hospitals, setHospitals]             = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [searchQuery, setSearchQuery]         = useState('');
  const [filterStatus, setFilterStatus]       = useState('all');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus]             = useState('');
  const [statusReason, setStatusReason]       = useState('');

  // ============================================================
  // CHARGEMENT
  // ============================================================
  const loadHospitals = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminHospitals();
      const list = Array.isArray(data) ? data : data.results || [];
      setHospitals(list);
    } catch (err) {
      console.error('Erreur chargement hôpitaux:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadHospitals(); }, []);

  // ============================================================
  // BADGE STATUT
  // ✅ CORRECTION : reçoit l'objet hospital entier, pas hospital.status
  // ============================================================
  const getStatusBadge = (hospital) => {
    // Le backend peut renvoyer is_verified directement sur l'objet hospital
    // ou hospital.user?.is_active pour le statut du compte utilisateur
    const isVerified = hospital?.is_verified;
    const isActive   = hospital?.user_is_active !== false; // champ plat du serializer

    if (isVerified && isActive) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Actif</span>;
    } else if (!isVerified) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">En attente</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Suspendu</span>;
    }
  };

  // ============================================================
  // BADGE PLAN
  // ============================================================
  const getPlanBadge = (plan) => {
    const styles = {
      basic:        'bg-gray-100 text-gray-800',
      professional: 'bg-blue-100 text-blue-800',
      enterprise:   'bg-purple-100 text-purple-800',
    };
    const label = plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : '—';
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[plan] || 'bg-gray-100 text-gray-800'}`}>
        {label}
      </span>
    );
  };

  // ============================================================
  // CHANGEMENT DE STATUT
  // ============================================================
  const handleStatusChange = (hospital, action) => {
    setSelectedHospital(hospital);
    setNewStatus(action === 'activate' ? 'active' : 'suspended');
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedHospital) return;
    try {
      const action = newStatus === 'active' ? 'activate' : 'deactivate';
      await api.updateHospitalStatus(selectedHospital.id, action);
      // Mettre à jour localement
      setHospitals(prev => prev.map(h =>
        h.id === selectedHospital.id
          ? { ...h, is_verified: newStatus === 'active', user_is_active: newStatus === 'active' }
          : h
      ));
      setShowStatusModal(false);
      setSelectedHospital(null);
      setStatusReason('');
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
    }
  };

  // ============================================================
  // FILTRAGE
  // ============================================================
  const filteredHospitals = hospitals.filter(hospital => {
    const name  = (hospital.name  || '').toLowerCase();
    const email = (hospital.email || '').toLowerCase();
    const matchesSearch = name.includes(searchQuery.toLowerCase()) ||
                          email.includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (filterStatus === 'active')  matchesStatus = hospital.is_verified && hospital.user_is_active !== false;
    if (filterStatus === 'pending') matchesStatus = !hospital.is_verified;
    if (filterStatus === 'suspended') matchesStatus = hospital.is_verified && hospital.user_is_active === false;

    return matchesSearch && matchesStatus;
  });

  // ============================================================
  // STATS
  // ============================================================
  const stats = {
    total:     hospitals.length,
    active:    hospitals.filter(h => h.is_verified && h.user_is_active !== false).length,
    suspended: hospitals.filter(h => h.is_verified && h.user_is_active === false).length,
    pending:   hospitals.filter(h => !h.is_verified).length,
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des hôpitaux</h1>
        <p className="text-gray-600 mt-2">Activez ou désactivez les comptes hospitaliers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total hôpitaux', value: stats.total,     color: 'bg-blue-500',   icon: BuildingOfficeIcon },
          { label: 'Actifs',         value: stats.active,    color: 'bg-green-500',  icon: CheckCircleIcon },
          { label: 'Suspendus',      value: stats.suspended, color: 'bg-red-500',    icon: XCircleIcon },
          { label: 'En attente',     value: stats.pending,   color: 'bg-yellow-500', icon: ClockIcon },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un hôpital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="suspended">Suspendus</option>
            <option value="pending">En attente</option>
          </select>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-3 text-sm text-gray-500">Chargement des hôpitaux...</p>
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="p-12 text-center">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">Aucun hôpital trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Hôpital', 'Statut', 'Plan', 'Médecins', 'Contact', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHospitals.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-gray-50">

                    {/* Nom + localisation */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{hospital.name}</div>
                      <div className="text-sm text-gray-500">{hospital.email}</div>
                      <div className="text-xs text-gray-400 flex items-center mt-1">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        {hospital.city || '—'}
                      </div>
                    </td>

                    {/* ✅ CORRECTION : passe l'objet hospital entier */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(hospital)}
                    </td>

                    {/* Plan abonnement */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {hospital.subscription_plan
                        ? getPlanBadge(hospital.subscription_plan)
                        : <span className="text-xs text-gray-400">—</span>
                      }
                    </td>

                    {/* Médecins */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {hospital.total_doctors ?? hospital.doctors_count ?? '—'}
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-500">{hospital.phone || '—'}</div>
                      <div className="text-xs text-gray-500">{hospital.registration_code || '—'}</div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => { setSelectedHospital(hospital); setShowDetailsModal(true); }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Voir les détails"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {hospital.is_verified ? (
                          <button
                            onClick={() => handleStatusChange(hospital, 'deactivate')}
                            className="text-red-600 hover:text-red-800"
                            title="Suspendre"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(hospital, 'activate')}
                            className="text-green-600 hover:text-green-800"
                            title="Valider et activer"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
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

      {/* Modal détails */}
      {showDetailsModal && selectedHospital && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Détails — {selectedHospital.name}</h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Nom',                selectedHospital.name],
                ['Email',              selectedHospital.email],
                ['Téléphone',          selectedHospital.phone || '—'],
                ['Ville',              selectedHospital.city || '—'],
                ['Région',             selectedHospital.region || '—'],
                ['Type',               selectedHospital.hospital_type || '—'],
                ['Numéro enreg.',      selectedHospital.registration_number || '—'],
                ['Code invitation',    selectedHospital.registration_code || '—'],
                ['Vérifié',            selectedHospital.is_verified ? 'Oui' : 'Non'],
                ['Inscrit le',         selectedHospital.created_at
                  ? new Date(selectedHospital.created_at).toLocaleDateString('fr-FR')
                  : '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="font-medium text-gray-500">{label}</p>
                  <p className="text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation statut */}
      {showStatusModal && selectedHospital && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {newStatus === 'active' ? 'Activer' : 'Suspendre'} l'hôpital
              </h3>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Vous êtes sur le point de{' '}
                  <strong>{newStatus === 'active' ? 'valider et activer' : 'suspendre'}</strong>{' '}
                  l'hôpital <strong>{selectedHospital.name}</strong>.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison (optionnel)
                </label>
                <textarea
                  value={statusReason}
                  onChange={(e) => setStatusReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Expliquez la raison de cette action..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmStatusChange}
                  className={`px-4 py-2 rounded-lg text-white ${
                    newStatus === 'active' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {newStatus === 'active' ? 'Activer' : 'Suspendre'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HospitalManagement;