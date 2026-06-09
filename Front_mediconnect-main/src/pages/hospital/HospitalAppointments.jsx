import React, { useState, useEffect } from 'react';
import {
  CalendarIcon, UserGroupIcon, ClockIcon,
  CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon,
  EyeIcon, VideoCameraIcon, MapPinIcon, ArrowPathIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// HELPERS
// ============================================================
const StatusBadge = ({ status }) => {
  const map = {
    confirmed: { label: 'Confirmé',   cls: 'bg-green-100 text-green-800' },
    pending:   { label: 'En attente', cls: 'bg-yellow-100 text-yellow-800' },
    cancelled: { label: 'Annulé',     cls: 'bg-red-100 text-red-800' },
    completed: { label: 'Terminé',    cls: 'bg-blue-100 text-blue-800' },
    no_show:   { label: 'Absent',     cls: 'bg-gray-100 text-gray-800' },
  };
  const s = map[status] || map.pending;
  return <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>{s.label}</span>;
};

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ============================================================
// MODAL DÉTAILS
// ============================================================
const DetailsModal = ({ rdv, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Détails du rendez-vous</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <XCircleIcon className="h-6 w-6" />
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">Patient</p>
          <p className="font-medium text-gray-900">{rdv.patient_name}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">Médecin</p>
          <p className="font-medium text-gray-900">{rdv.doctor_full_name || rdv.doctor_name}</p>
          <p className="text-gray-500">{rdv.doctor_specialization || rdv.doctor_specialty}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">Date & Heure</p>
          <p className="font-medium text-gray-900">{formatDate(rdv.date)}</p>
          <p className="text-gray-500">{rdv.time ? rdv.time.slice(0, 5) : '—'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">Type</p>
          <p className="font-medium text-gray-900">{rdv.type === 'video' ? '📹 Vidéo' : '🏥 Présentiel'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">Statut</p>
          <StatusBadge status={rdv.status} />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">Motif</p>
          <p className="text-gray-700">{rdv.reason || '—'}</p>
        </div>
      </div>
      <div className="p-6 border-t border-gray-200 flex justify-end">
        <button onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          Fermer
        </button>
      </div>
    </div>
  </div>
);

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
const HospitalAppointments = () => {
  const [appointments, setAppointments]   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [searchQuery, setSearchQuery]     = useState('');
  const [filterDate, setFilterDate]       = useState('all');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [filterDoctor, setFilterDoctor]   = useState('all');
  const [selectedRdv, setSelectedRdv]     = useState(null);
  const [togglingId, setTogglingId]       = useState(null);
  const [notification, setNotification]   = useState(null);

  // ---- Chargement ----
  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHospitalAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      setError('Impossible de charger les rendez-vous.');
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

  // ---- Changer statut ----
  const handleStatusChange = async (rdv, newStatus) => {
    setTogglingId(rdv.id);
    try {
      await api.updateAppointmentStatus(rdv.id, newStatus);
      setAppointments(prev =>
        prev.map(a => a.id === rdv.id ? { ...a, status: newStatus } : a)
      );
      showNotif('success', `Statut mis à jour : ${newStatus}`);
    } catch {
      showNotif('error', 'Erreur lors de la mise à jour.');
    } finally {
      setTogglingId(null);
    }
  };

  // ---- Filtres ----
  const today = new Date().toISOString().split('T')[0];
  const weekEnd = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const monthStr = today.slice(0, 7);

  const doctors = ['all', ...new Set(
    appointments.map(a => a.doctor_full_name || a.doctor_name).filter(Boolean)
  )];

  const filtered = appointments.filter(a => {
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = !searchQuery ||
      (a.patient_name || '').toLowerCase().includes(searchLower) ||
      (a.doctor_full_name || a.doctor_name || '').toLowerCase().includes(searchLower) ||
      (a.doctor_specialization || a.doctor_specialty || '').toLowerCase().includes(searchLower);
    const matchDate =
      filterDate === 'all' ||
      (filterDate === 'today' && a.date === today) ||
      (filterDate === 'week' && a.date >= today && a.date <= weekEnd) ||
      (filterDate === 'month' && a.date.startsWith(monthStr));
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchDoctor = filterDoctor === 'all' ||
      (a.doctor_full_name || a.doctor_name) === filterDoctor;
    return matchSearch && matchDate && matchStatus && matchDoctor;
  });

  // ---- Stats calculées depuis données réelles ----
  const stats = {
    total:     appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending:   appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
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

      {/* Modal */}
      {selectedRdv && <DetailsModal rdv={selectedRdv} onClose={() => setSelectedRdv(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rendez-vous</h1>
          <p className="text-gray-500 mt-1 text-sm">Consultations de tous les médecins de l'établissement</p>
        </div>
        <button onClick={load} disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={load} className="text-sm text-red-700 underline">Réessayer</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total',      value: stats.total,     color: 'bg-blue-500',   icon: CalendarIcon },
          { label: 'Confirmés',  value: stats.confirmed, color: 'bg-green-500',  icon: CheckCircleIcon },
          { label: 'En attente', value: stats.pending,   color: 'bg-yellow-500', icon: ClockIcon },
          { label: 'Terminés',   value: stats.completed, color: 'bg-indigo-500', icon: CheckCircleIcon },
          { label: 'Annulés',    value: stats.cancelled, color: 'bg-red-500',    icon: XCircleIcon },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`${s.color} p-2.5 rounded-lg`}>
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

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Rechercher..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterDate} onChange={e => setFilterDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option value="all">Tous les statuts</option>
            <option value="confirmed">Confirmés</option>
            <option value="pending">En attente</option>
            <option value="completed">Terminés</option>
            <option value="cancelled">Annulés</option>
          </select>
          <select value={filterDoctor} onChange={e => setFilterDoctor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            {doctors.map(d => (
              <option key={d} value={d}>{d === 'all' ? 'Tous les médecins' : d}</option>
            ))}
          </select>
          <button onClick={() => { setSearchQuery(''); setFilterDate('all'); setFilterStatus('all'); setFilterDoctor('all'); }}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Patient', 'Médecin', 'Date & Heure', 'Type', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <CalendarIcon className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-sm">Aucun rendez-vous trouvé</p>
                    </td>
                  </tr>
                ) : filtered.map(rdv => (
                  <tr key={rdv.id} className="hover:bg-gray-50 transition-colors">
                    {/* Patient */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-teal-700 font-medium text-xs">
                            {(rdv.patient_name || '?').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{rdv.patient_name || '—'}</p>
                      </div>
                    </td>

                    {/* Médecin */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{rdv.doctor_full_name || rdv.doctor_name || '—'}</p>
                      <p className="text-xs text-gray-500">{rdv.doctor_specialization || rdv.doctor_specialty || ''}</p>
                    </td>

                    {/* Date & heure */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-900">{formatDate(rdv.date)}</p>
                      <p className="text-xs text-gray-500">{rdv.time ? rdv.time.slice(0, 5) : '—'}</p>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rdv.type === 'video' ? 'bg-purple-50 text-purple-700' : 'bg-teal-50 text-teal-700'
                      }`}>
                        {rdv.type === 'video'
                          ? <><VideoCameraIcon className="h-3 w-3" /> Vidéo</>
                          : <><MapPinIcon className="h-3 w-3" /> Présentiel</>}
                      </span>
                    </td>

                    {/* Statut */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={rdv.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedRdv(rdv)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Détails">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {rdv.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(rdv, 'confirmed')}
                            disabled={togglingId === rdv.id}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50" title="Confirmer">
                            {togglingId === rdv.id
                              ? <div className="animate-spin h-4 w-4 border-b-2 border-green-600 rounded-full"></div>
                              : <CheckCircleIcon className="h-4 w-4" />}
                          </button>
                        )}
                        {rdv.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(rdv, 'cancelled')}
                            disabled={togglingId === rdv.id}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50" title="Annuler">
                            {togglingId === rdv.id
                              ? <div className="animate-spin h-4 w-4 border-b-2 border-red-600 rounded-full"></div>
                              : <XCircleIcon className="h-4 w-4" />}
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

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              {filtered.length} rendez-vous affiché{filtered.length > 1 ? 's' : ''}
              {filtered.length !== appointments.length && ` sur ${appointments.length} au total`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalAppointments;