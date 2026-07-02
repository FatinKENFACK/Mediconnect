import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  UserGroupIcon, MagnifyingGlassIcon, CheckCircleIcon,
  XCircleIcon, ClockIcon, EyeIcon, BuildingOfficeIcon,
  MapPinIcon, PhoneIcon, ExclamationTriangleIcon,
  StarIcon, AcademicCapIcon, BriefcaseIcon,
} from '@heroicons/react/24/outline';

// ============================================================
// COMPOSANT PRINCIPAL : DoctorManagement
// ============================================================
const DoctorManagement = () => {
  const [doctors, setDoctors]                 = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [searchQuery, setSearchQuery]         = useState('');
  const [filterStatus, setFilterStatus]       = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [selectedDoctor, setSelectedDoctor]   = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus]             = useState('');
  const [statusReason, setStatusReason]       = useState('');
  const [specialties, setSpecialties]         = useState([]);

  // ============================================================
  // CHARGEMENT
  // ============================================================
  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminDoctors();
      const list = Array.isArray(data) ? data : data.results || [];
      setDoctors(list);

      // Extraire les spécialités uniques pour le filtre
      const specs = [...new Set(list.map(d => d.specialization).filter(Boolean))];
      setSpecialties(specs);
    } catch (err) {
      console.error('Erreur chargement médecins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDoctors(); }, []);

  // ============================================================
  // BADGE STATUT
  // ============================================================
  const getStatusBadge = (doctor) => {
    if (doctor.is_verified) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          Vérifié
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
        En attente
      </span>
    );
  };

  // ============================================================
  // BADGE DISPONIBILITÉ
  // ============================================================
  const getAvailabilityBadge = (isAvailable) => {
    if (isAvailable) {
      return (
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          Disponible
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
        Indisponible
      </span>
    );
  };

  // ============================================================
  // CHANGEMENT DE STATUT (vérification / suspension)
  // ============================================================
  const handleStatusChange = (doctor, action) => {
    setSelectedDoctor(doctor);
    setNewStatus(action === 'verify' ? 'verified' : 'suspended');
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedDoctor) return;
    try {
      // ✅ Le backend attend exactement 'activate' ou 'deactivate'
      const action = newStatus === 'verified' ? 'activate' : 'deactivate';
      await api.updateDoctorStatus(selectedDoctor.id, action);
      setDoctors(prev => prev.map(d =>
        d.id === selectedDoctor.id
          ? { ...d, is_verified: newStatus === 'verified' }
          : d
      ));
      setShowStatusModal(false);
      setSelectedDoctor(null);
      setStatusReason('');
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
    }
  };

  // ============================================================
  // FILTRAGE
  // ============================================================
  const filteredDoctors = doctors.filter(doctor => {
    const fullName = `${doctor.first_name || ''} ${doctor.last_name || ''}`.toLowerCase();
    const email    = (doctor.email || '').toLowerCase();
    const spec     = (doctor.specialization || '').toLowerCase();

    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      spec.includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (filterStatus === 'verified')   matchesStatus = doctor.is_verified === true;
    if (filterStatus === 'pending')    matchesStatus = doctor.is_verified === false;

    const matchesSpecialty =
      filterSpecialty === 'all' || doctor.specialization === filterSpecialty;

    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  // ============================================================
  // STATS
  // ============================================================
  const stats = {
    total:    doctors.length,
    verified: doctors.filter(d => d.is_verified).length,
    pending:  doctors.filter(d => !d.is_verified).length,
    available: doctors.filter(d => d.is_available).length,
  };

  // ============================================================
  // HELPERS
  // ============================================================
  const getDoctorName = (doctor) =>
    `Dr. ${doctor.first_name || ''} ${doctor.last_name || ''}`.trim();

  const formatFee = (fee) =>
    fee ? `${Number(fee).toLocaleString('fr-FR')} XAF` : '—';

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6">

      {/* ====== HEADER ====== */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des médecins</h1>
        <p className="text-gray-600 mt-2">Vérifiez et gérez les comptes médecins de la plateforme</p>
      </div>

      {/* ====== STATS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total médecins', value: stats.total,     color: 'bg-blue-500',   icon: UserGroupIcon },
          { label: 'Vérifiés',       value: stats.verified,  color: 'bg-green-500',  icon: CheckCircleIcon },
          { label: 'En attente',     value: stats.pending,   color: 'bg-yellow-500', icon: ClockIcon },
          { label: 'Disponibles',    value: stats.available, color: 'bg-purple-500', icon: BriefcaseIcon },
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

      {/* ====== FILTRES ====== */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1 sm:max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un médecin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="verified">Vérifiés</option>
            <option value="pending">En attente</option>
          </select>
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les spécialités</option>
            {specialties.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ====== TABLEAU ====== */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-3 text-sm text-gray-500">Chargement des médecins...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="p-12 text-center">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">Aucun médecin trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Médecin', 'Spécialité', 'Hôpital', 'Statut', 'Disponibilité', 'Tarifs', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">

                    {/* Médecin */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          {doctor.profile_picture ? (
                            <img
                              src={`http://localhost:8000${doctor.profile_picture}`}
                              className="h-10 w-10 rounded-full object-cover"
                              alt=""
                            />
                          ) : (
                            <span className="text-blue-700 font-semibold text-sm">
                              {(doctor.first_name?.[0] || '') + (doctor.last_name?.[0] || '')}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{getDoctorName(doctor)}</p>
                          <p className="text-xs text-gray-500">{doctor.email || '—'}</p>
                          {doctor.experience_years > 0 && (
                            <p className="text-xs text-gray-400">{doctor.experience_years} ans d'expérience</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Spécialité */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <AcademicCapIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        {doctor.specialization || '—'}
                      </div>
                      {doctor.license_number && (
                        <p className="text-xs text-gray-400 mt-1">N° {doctor.license_number}</p>
                      )}
                    </td>

                    {/* Hôpital */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <BuildingOfficeIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate max-w-[120px]">
                          {doctor.hospital_name || '—'}
                        </span>
                      </div>
                    </td>

                    {/* Statut vérification */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(doctor)}
                    </td>

                    {/* Disponibilité */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getAvailabilityBadge(doctor.is_available)}
                    </td>

                    {/* Tarifs */}
                    <td className="px-6 py-4">
                      <div className="text-xs text-gray-600 space-y-0.5">
                        <div>🏥 {formatFee(doctor.fee_in_person)}</div>
                        <div>📹 {formatFee(doctor.fee_video)}</div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setSelectedDoctor(doctor); setShowDetailsModal(true); }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Voir les détails"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {!doctor.is_verified ? (
                          <button
                            onClick={() => handleStatusChange(doctor, 'verify')}
                            className="text-green-600 hover:text-green-800"
                            title="Vérifier et activer"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(doctor, 'deactivate')}
                            className="text-red-600 hover:text-red-800"
                            title="Suspendre"
                          >
                            <XCircleIcon className="h-5 w-5" />
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

      {/* ====== MODAL DÉTAILS ====== */}
      {showDetailsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-lg bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Détails — {getDoctorName(selectedDoctor)}
              </h3>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Avatar + statuts */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {selectedDoctor.profile_picture ? (
                  <img src={`http://localhost:8000${selectedDoctor.profile_picture}`}
                    className="h-16 w-16 object-cover" alt="" />
                ) : (
                  <span className="text-blue-700 font-bold text-xl">
                    {(selectedDoctor.first_name?.[0] || '') + (selectedDoctor.last_name?.[0] || '')}
                  </span>
                )}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{getDoctorName(selectedDoctor)}</p>
                <p className="text-sm text-gray-500">{selectedDoctor.specialization}</p>
                <div className="flex gap-2 mt-2">
                  {getStatusBadge(selectedDoctor)}
                  {getAvailabilityBadge(selectedDoctor.is_available)}
                </div>
              </div>
            </div>

            {/* Infos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {[
                ['Email',            selectedDoctor.email || '—'],
                ['Téléphone',        selectedDoctor.phone || '—'],
                ['N° de licence',    selectedDoctor.license_number || '—'],
                ['Expérience',       selectedDoctor.experience_years ? `${selectedDoctor.experience_years} ans` : '—'],
                ['Langues',          selectedDoctor.languages || '—'],
                ['Hôpital',          selectedDoctor.hospital_name || '—'],
                ['Tarif présentiel', formatFee(selectedDoctor.fee_in_person)],
                ['Tarif vidéo',      formatFee(selectedDoctor.fee_video)],
                ['Inscrit le',       selectedDoctor.created_at
                  ? new Date(selectedDoctor.created_at).toLocaleDateString('fr-FR') : '—'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="font-medium text-gray-500">{label}</p>
                  <p className="text-gray-900">{value}</p>
                </div>
              ))}
            </div>

            {/* Bio */}
            {selectedDoctor.bio && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="font-medium text-gray-500 mb-1">Biographie</p>
                <p className="text-sm text-gray-700">{selectedDoctor.bio}</p>
              </div>
            )}

            {/* Actions dans la modal */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Fermer
              </button>
              {!selectedDoctor.is_verified ? (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleStatusChange(selectedDoctor, 'verify');
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  ✅ Vérifier ce médecin
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleStatusChange(selectedDoctor, 'deactivate');
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  🚫 Suspendre
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====== MODAL CONFIRMATION STATUT ====== */}
      {showStatusModal && selectedDoctor && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {newStatus === 'verified' ? 'Vérifier' : 'Suspendre'} le médecin
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
                  <strong>{newStatus === 'verified' ? 'vérifier et activer' : 'suspendre'}</strong>{' '}
                  le compte de <strong>{getDoctorName(selectedDoctor)}</strong>.
                  {newStatus === 'verified' && (
                    <span className="block mt-1 text-yellow-700">
                      Ce médecin pourra ensuite recevoir des rendez-vous et être visible par les patients.
                    </span>
                  )}
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
                    newStatus === 'verified'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {newStatus === 'verified' ? '✅ Vérifier' : '🚫 Suspendre'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorManagement;