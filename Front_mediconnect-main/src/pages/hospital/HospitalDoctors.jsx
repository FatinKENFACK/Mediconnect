import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon, PlusIcon, MagnifyingGlassIcon,
  TrashIcon, CheckCircleIcon, XCircleIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const DeleteModal = ({ doctor, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mx-auto mb-4">
        <TrashIcon className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 text-center">Supprimer ce médecin ?</h3>
      <p className="mt-2 text-sm text-gray-500 text-center">
        Vous êtes sur le point de supprimer{' '}
        <span className="font-medium text-gray-900">Dr. {doctor?.first_name} {doctor?.last_name}</span>.
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

const HospitalDoctors = () => {
  const [doctors, setDoctors]                 = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [searchQuery, setSearchQuery]         = useState('');
  const [filterStatus, setFilterStatus]       = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor]   = useState(null);
  const [deleteLoading, setDeleteLoading]     = useState(false);
  const [togglingId, setTogglingId]           = useState(null);
  const [notification, setNotification]       = useState(null);

  useEffect(() => { loadDoctors(); }, []);

  const loadDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHospitalDoctors();
      setDoctors(Array.isArray(data) ? data : data.results || []);
    } catch {
      setError('Erreur lors du chargement des médecins.');
    } finally {
      setLoading(false);
    }
  };

  const showNotif = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // ============================================================
  // ✅ CORRECTION : utilise updateHospitalDoctorStatus
  // (route sécurisée /hospital/doctors/<id>/status/)
  // au lieu de updateDoctorStatus (route admin réservée -> 403)
  // ============================================================
  const handleToggleStatus = async (doctor) => {
    const action = doctor.is_verified ? 'deactivate' : 'activate';
    setTogglingId(doctor.id);
    try {
      await api.updateHospitalDoctorStatus(doctor.id, action);
      setDoctors(prev =>
        prev.map(d => d.id === doctor.id ? { ...d, is_verified: !d.is_verified } : d)
      );
      showNotif('success',
        action === 'activate'
          ? `Dr. ${doctor.first_name} ${doctor.last_name} activé avec succès`
          : `Dr. ${doctor.first_name} ${doctor.last_name} désactivé`
      );
    } catch (err) {
      showNotif('error', err.message || 'Erreur lors de la mise à jour du statut.');
    } finally {
      setTogglingId(null);
    }
  };

  const openDeleteModal  = (doctor) => { setSelectedDoctor(doctor); setShowDeleteModal(true); };

  // ============================================================
  // ✅ CORRECTION : même chose ici
  // ============================================================
  const handleDeleteConfirm = async () => {
    if (!selectedDoctor) return;
    setDeleteLoading(true);
    try {
      await api.updateHospitalDoctorStatus(selectedDoctor.id, 'deactivate');
      setDoctors(prev => prev.filter(d => d.id !== selectedDoctor.id));
      showNotif('success', `Dr. ${selectedDoctor.first_name} ${selectedDoctor.last_name} supprimé.`);
    } catch (err) {
      showNotif('error', err.message || 'Erreur lors de la suppression.');
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setSelectedDoctor(null);
    }
  };

  const specialties = ['all', ...new Set(doctors.map(d => d.specialization).filter(Boolean))];

  const filtered = doctors.filter(d => {
    const name = `${d.first_name || ''} ${d.last_name || ''}`.toLowerCase();
    const matchSearch = searchQuery === '' ||
      name.includes(searchQuery.toLowerCase()) ||
      (d.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.specialization || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && d.is_verified) ||
      (filterStatus === 'inactive' && !d.is_verified);
    const matchSpecialty = filterSpecialty === 'all' || d.specialization === filterSpecialty;
    return matchSearch && matchStatus && matchSpecialty;
  });

  const stats = {
    total:    doctors.length,
    active:   doctors.filter(d => d.is_verified).length,
    inactive: doctors.filter(d => !d.is_verified).length,
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6">
      {showDeleteModal && (
        <DeleteModal
          doctor={selectedDoctor}
          onConfirm={handleDeleteConfirm}
          onCancel={() => { setShowDeleteModal(false); setSelectedDoctor(null); }}
          loading={deleteLoading}
        />
      )}

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

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Médecins</h1>
          <p className="text-gray-600 mt-1">Gérez les médecins de votre établissement</p>
        </div>
        <Link to="/hopital/ajouter-medecin"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter un médecin
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={loadDoctors} className="text-sm text-red-700 underline">Réessayer</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total médecins',    value: stats.total,    color: 'bg-blue-500',   icon: UserGroupIcon },
          { label: 'Médecins vérifiés', value: stats.active,   color: 'bg-green-500',  icon: CheckCircleIcon },
          { label: 'Non vérifiés',      value: stats.inactive, color: 'bg-yellow-500', icon: XCircleIcon },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${s.color} p-3 rounded-lg`}>
                <s.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Rechercher un médecin..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
            <option value="all">Tous les statuts</option>
            <option value="active">Vérifiés</option>
            <option value="inactive">Non vérifiés</option>
          </select>
          <select value={filterSpecialty} onChange={e => setFilterSpecialty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm">
            {specialties.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'Toutes les spécialités' : s}</option>
            ))}
          </select>
          <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); setFilterSpecialty('all'); }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Médecin', 'Spécialité', 'Expérience', 'Tarif', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <UserGroupIcon className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm">Aucun médecin trouvé</p>
                  </td>
                </tr>
              ) : filtered.map(doctor => (
                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {doctor.profile_picture ? (
                          <img src={`http://localhost:8000${doctor.profile_picture}`}
                            className="h-10 w-10 rounded-full object-cover" alt="" />
                        ) : (
                          <span className="text-blue-700 font-medium text-sm">
                            {(doctor.first_name?.[0] || '') + (doctor.last_name?.[0] || '')}
                          </span>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Dr. {doctor.first_name} {doctor.last_name}</p>
                        <p className="text-xs text-gray-500">{doctor.email}</p>
                        {doctor.phone && <p className="text-xs text-gray-400">{doctor.phone}</p>}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">{doctor.specialization || '—'}</p>
                    {doctor.license_number && <p className="text-xs text-gray-400">N° {doctor.license_number}</p>}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">
                      {doctor.experience_years ? `${doctor.experience_years} ans` : '—'}
                    </p>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-900">
                      {doctor.fee_in_person ? `${Number(doctor.fee_in_person).toLocaleString('fr-FR')} XAF` : '—'}
                    </p>
                    {doctor.fee_video && (
                      <p className="text-xs text-gray-400">Vidéo : {Number(doctor.fee_video).toLocaleString('fr-FR')} XAF</p>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doctor.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doctor.is_verified ? '✓ Vérifié' : '⏳ En attente'}
                    </span>
                    {doctor.is_available !== undefined && (
                      <p className={`text-xs mt-1 ${doctor.is_available ? 'text-green-600' : 'text-gray-400'}`}>
                        {doctor.is_available ? '🟢 Disponible' : '🔴 Indisponible'}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(doctor)}
                        disabled={togglingId === doctor.id}
                        title={doctor.is_verified ? 'Désactiver' : 'Activer'}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                          doctor.is_verified
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}>
                        {togglingId === doctor.id
                          ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                          : <PowerIcon className="h-3.5 w-3.5" />}
                        {doctor.is_verified ? 'Désactiver' : 'Activer'}
                      </button>
                      <button
                        onClick={() => openDeleteModal(doctor)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors">
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
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              {filtered.length} médecin{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
              {filtered.length !== doctors.length && ` sur ${doctors.length} au total`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalDoctors;