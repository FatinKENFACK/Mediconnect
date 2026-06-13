import React, { useState, useEffect } from 'react';
import {
  StarIcon, CheckCircleIcon, XCircleIcon, TrashIcon,
  MagnifyingGlassIcon, ClockIcon, ExclamationTriangleIcon,
  ArrowPathIcon, UserCircleIcon, BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import api from '../../services/api';

const ReviewManagement = () => {
  const [reviews, setReviews]         = useState([]);
  const [stats, setStats]             = useState({ total: 0, pending: 0, approved: 0, rejected: 0, average: 0 });
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [rejectModal, setRejectModal] = useState(null); // { id, reason }
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      if (filterRating !== 'all') filters.rating = filterRating;
      const data = await api.getAdminReviews(filters);
      setStats(data.stats || { total: 0, pending: 0, approved: 0, rejected: 0, average: 0 });
      setReviews(data.reviews || []);
    } catch {
      setError('Impossible de charger les avis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, [filterStatus, filterRating]);

  const showNotif = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await api.moderateReview(id, 'approve');
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
      setStats(prev => ({
        ...prev,
        approved: prev.approved + 1,
        pending: Math.max(0, prev.pending - 1),
      }));
      showNotif('success', 'Avis approuvé avec succès.');
    } catch {
      showNotif('error', 'Erreur lors de l\'approbation.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal?.reason?.trim()) return;
    setActionLoading(rejectModal.id);
    try {
      await api.moderateReview(rejectModal.id, 'reject', rejectModal.reason);
      setReviews(prev => prev.map(r =>
        r.id === rejectModal.id ? { ...r, status: 'rejected' } : r
      ));
      setStats(prev => ({
        ...prev,
        rejected: prev.rejected + 1,
        pending: Math.max(0, prev.pending - 1),
      }));
      showNotif('success', 'Avis rejeté.');
      setRejectModal(null);
    } catch {
      showNotif('error', 'Erreur lors du rejet.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet avis définitivement ?')) return;
    setActionLoading(id);
    try {
      await api.deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      showNotif('success', 'Avis supprimé.');
    } catch {
      showNotif('error', 'Erreur lors de la suppression.');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = reviews.filter(r => {
    const name = `${r.patient_name || ''} ${r.doctor_name || ''}`.toLowerCase();
    const matchSearch = searchQuery === '' || name.includes(searchQuery.toLowerCase()) ||
      (r.comment || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const renderStars = (rating) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <StarSolid key={i} className={`h-4 w-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );

  const statusBadge = (status) => {
    const map = {
      pending:  'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const labels = { pending: 'En attente', approved: 'Approuvé', rejected: 'Rejeté' };
    return (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 ${
          notification.type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success'
            ? <CheckCircleIcon className="h-5 w-5" />
            : <XCircleIcon className="h-5 w-5" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Modération des avis</h1>
          <p className="text-gray-500 mt-1 text-sm">Approuvez ou rejetez les avis des patients</p>
        </div>
        <button
          onClick={loadReviews}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total',       value: stats.total,    color: 'bg-blue-500' },
          { label: 'En attente',  value: stats.pending,  color: 'bg-yellow-500' },
          { label: 'Approuvés',   value: stats.approved, color: 'bg-green-500' },
          { label: 'Rejetés',     value: stats.rejected, color: 'bg-red-500' },
          { label: 'Note moyenne',value: stats.average,  color: 'bg-purple-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`${s.color} p-2 rounded-lg`}>
                <StarIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center text-red-700 text-sm gap-2">
            <ExclamationTriangleIcon className="h-5 w-5" />
            {error}
          </div>
          <button onClick={loadReviews} className="text-sm text-red-700 underline">Réessayer</button>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Rejetés</option>
          </select>
          <select
            value={filterRating}
            onChange={e => setFilterRating(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">Toutes les notes</option>
            {[5, 4, 3, 2, 1].map(n => (
              <option key={n} value={n}>{n} étoile{n > 1 ? 's' : ''}</option>
            ))}
          </select>
          <button
            onClick={() => { setSearchQuery(''); setFilterStatus('all'); setFilterRating('all'); }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Liste des avis */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-2/3"></div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <StarIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Aucun avis trouvé</p>
          </div>
        ) : filtered.map(review => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">

              {/* Patient + médecin */}
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 font-medium text-sm">
                    {(review.patient_name || '?').charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{review.patient_name}</p>
                  <p className="text-xs text-gray-500">
                    {review.doctor_name}
                    {review.doctor_specialization && ` · ${review.doctor_specialization}`}
                    {review.doctor_hospital && ` · ${review.doctor_hospital}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(review.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Note + statut */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {renderStars(review.rating)}
                <span className="text-sm font-medium text-gray-700">{review.rating}/5</span>
                {statusBadge(review.status)}
              </div>
            </div>

            {/* Commentaire */}
            {review.comment && (
              <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg">
                {review.comment}
              </p>
            )}

            {/* Raison de rejet */}
            {review.status === 'rejected' && review.rejection_reason && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-medium text-red-700">Raison du rejet :</p>
                <p className="text-sm text-red-600">{review.rejection_reason}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              {review.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApprove(review.id)}
                    disabled={actionLoading === review.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading === review.id
                      ? <div className="animate-spin h-3 w-3 border-b-2 border-white rounded-full"></div>
                      : <CheckCircleIcon className="h-3.5 w-3.5" />}
                    Approuver
                  </button>
                  <button
                    onClick={() => setRejectModal({ id: review.id, reason: '' })}
                    disabled={actionLoading === review.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-600 text-white text-xs font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                  >
                    <XCircleIcon className="h-3.5 w-3.5" />
                    Rejeter
                  </button>
                </>
              )}
              <button
                onClick={() => handleDelete(review.id)}
                disabled={actionLoading === review.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded-lg hover:bg-red-200 disabled:opacity-50 ml-auto"
              >
                <TrashIcon className="h-3.5 w-3.5" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal rejet */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rejeter cet avis</h3>
            <p className="text-sm text-gray-500 mb-4">Indiquez la raison du rejet (obligatoire).</p>
            <textarea
              value={rejectModal.reason}
              onChange={e => setRejectModal(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Ex : Contenu inapproprié, informations fausses..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-sm mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRejectModal(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectModal.reason.trim() || actionLoading === rejectModal.id}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;