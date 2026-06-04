import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon, PlusIcon, MagnifyingGlassIcon,
  TrashIcon, CheckCircleIcon, XCircleIcon, CalendarIcon,
  StarIcon, UserCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const HospitalDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    api.getAdminDoctors()
      .then(data => {
        const list = Array.isArray(data) ? data : data.results || [];
        setDoctors(list);
      })
      .catch(() => setError('Erreur lors du chargement des médecins.'))
      .finally(() => setLoading(false));
  }, []);

  // Spécialités uniques pour le filtre
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
    total: doctors.length,
    active: doctors.filter(d => d.is_verified).length,
    inactive: doctors.filter(d => !d.is_verified).length,
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Médecins</h1>
          <p className="text-gray-600 mt-2">Gérez les médecins de votre établissement</p>
        </div>
        <Link to="/hopital/ajouter-medecin"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter un médecin
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total médecins', value: stats.total, color: 'bg-blue-500', icon: UserGroupIcon },
          { label: 'Médecins vérifiés', value: stats.active, color: 'bg-green-500', icon: CheckCircleIcon },
          { label: 'Non vérifiés', value: stats.inactive, color: 'bg-yellow-500', icon: XCircleIcon },
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input type="text" placeholder="Rechercher un médecin..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="all">Tous les statuts</option>
            <option value="active">Vérifiés</option>
            <option value="inactive">Non vérifiés</option>
          </select>
          <select value={filterSpecialty} onChange={e => setFilterSpecialty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            {specialties.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'Toutes les spécialités' : s}</option>
            ))}
          </select>
          <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); setFilterSpecialty('all'); }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
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
                {['Médecin', 'Spécialité', 'Expérience', 'Tarif', 'Statut'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Aucun médecin trouvé
                  </td>
                </tr>
              ) : filtered.map(doctor => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
                        {doctor.profile_picture ? (
                          <img src={`http://localhost:8000${doctor.profile_picture}`}
                            className="h-10 w-10 rounded-full object-cover" alt="" />
                        ) : (
                          <span className="text-white font-medium text-sm">
                            {(doctor.first_name?.[0] || '') + (doctor.last_name?.[0] || '')}
                          </span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          Dr. {doctor.first_name} {doctor.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{doctor.email}</div>
                        {doctor.phone && (
                          <div className="text-sm text-gray-500">{doctor.phone}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.specialization || '—'}</div>
                    {doctor.license_number && (
                      <div className="text-xs text-gray-500">N° {doctor.license_number}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {doctor.experience_years ? `${doctor.experience_years} ans` : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {doctor.fee_in_person ? `${doctor.fee_in_person.toLocaleString()} XAF` : '—'}
                    </div>
                    {doctor.fee_video && (
                      <div className="text-xs text-gray-500">Vidéo: {doctor.fee_video.toLocaleString()} XAF</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doctor.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {doctor.is_verified ? '✓ Vérifié' : '⏳ En attente'}
                    </span>
                    {doctor.is_available !== undefined && (
                      <div className="mt-1">
                        <span className={`text-xs ${doctor.is_available ? 'text-green-600' : 'text-gray-500'}`}>
                          {doctor.is_available ? '🟢 Disponible' : '🔴 Indisponible'}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HospitalDoctors;