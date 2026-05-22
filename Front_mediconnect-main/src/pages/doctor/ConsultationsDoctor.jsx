import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  VideoCameraIcon, UserCircleIcon, ClockIcon, CalendarIcon,
  CheckCircleIcon, XCircleIcon, ClockIcon as ClockIconSolid,
  PlusIcon, MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const ConsultationsDoctor = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [dateFilter, setDateFilter] = useState('toutes');

  useEffect(() => {
    api.getDoctorAppointments()
      .then(data => setConsultations(data))
      .catch(() => setError('Erreur lors du chargement des consultations.'))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const filtered = consultations.filter(c => {
    const matchSearch = searchTerm === '' ||
      (c.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.reason || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'tous' || c.status === statusFilter;

    const matchDate =
      dateFilter === 'toutes' ? true :
      dateFilter === "aujourd'hui" ? c.date === today :
      dateFilter === 'futures' ? c.date >= today :
      dateFilter === 'passees' ? c.date < today : true;

    return matchSearch && matchStatus && matchDate;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending':   return 'bg-yellow-100 text-yellow-800';
      default:          return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminée';
      case 'confirmed': return 'Confirmée';
      case 'cancelled': return 'Annulée';
      case 'pending':   return 'En attente';
      default:          return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'confirmed': return <ClockIconSolid className="h-4 w-4 text-blue-500" />;
      case 'cancelled': return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case 'pending':   return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      default:          return null;
    }
  };

  const handleStart = async (id) => {
    try {
      await api.updateAppointmentStatus(id, 'confirmed');
      setConsultations(prev =>
        prev.map(c => c.id === id ? { ...c, status: 'confirmed' } : c)
      );
    } catch {
      alert('Erreur lors du démarrage de la consultation.');
    }
  };

  const handleComplete = async (id) => {
    try {
      await api.updateAppointmentStatus(id, 'completed');
      setConsultations(prev =>
        prev.map(c => c.id === id ? { ...c, status: 'completed' } : c)
      );
    } catch {
      alert('Erreur lors de la mise à jour.');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Annuler cette consultation ?')) return;
    try {
      await api.updateAppointmentStatus(id, 'cancelled');
      setConsultations(prev =>
        prev.map(c => c.id === id ? { ...c, status: 'cancelled' } : c)
      );
    } catch {
      alert('Erreur lors de l\'annulation.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
          <p className="mt-1 text-sm text-gray-500">Gérez vos consultations passées et à venir</p>
        </div>
        <Link to="/medecin/consultations/nouvelle"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Nouvelle consultation
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      {/* Filtres */}
      <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rechercher</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Nom du patient ou motif"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="tous">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmées</option>
              <option value="completed">Terminées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Période</label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            >
              <option value="toutes">Toutes les dates</option>
              <option value="aujourd'hui">Aujourd'hui</option>
              <option value="futures">À venir</option>
              <option value="passees">Passées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune consultation</h3>
            <p className="mt-1 text-sm text-gray-500">Aucune consultation ne correspond à vos critères.</p>
            <div className="mt-6">
              <Link to="/medecin/consultations/nouvelle"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Nouvelle consultation
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtered.map(c => (
              <li key={c.id} className="hover:bg-gray-50 px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserCircleIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{c.patient_name}</div>
                      <div className="text-sm text-gray-500">{c.reason}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm text-gray-900">
                      {new Date(c.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                      <span className="text-gray-500"> à {c.time?.slice(0, 5)}</span>
                    </div>
                    <span className={`mt-1 px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadge(c.status)}`}>
                      {getStatusIcon(c.status)}
                      {getStatusLabel(c.status)}
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center text-sm text-gray-500 gap-4">
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                    {c.type === 'video' ? 'Vidéo' : c.type === 'in-person' ? 'Présentiel' : c.type}
                  </div>
                  {c.type === 'video' && (
                    <div className="flex items-center text-blue-600">
                      <VideoCameraIcon className="h-4 w-4 mr-1" />
                      Visioconférence
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-3 flex justify-end space-x-3">
                  {c.status === 'pending' && (
                    <>
                      <button onClick={() => handleStart(c.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        <VideoCameraIcon className="h-3 w-3 mr-1" />
                        Démarrer
                      </button>
                      <button onClick={() => handleCancel(c.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                        Annuler
                      </button>
                    </>
                  )}
                  {c.status === 'confirmed' && (
                    <button onClick={() => handleComplete(c.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Marquer terminée
                    </button>
                  )}
                  <Link to={`/medecin/consultations/${c.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Voir les détails
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConsultationsDoctor;