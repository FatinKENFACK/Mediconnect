import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarIcon, ClockIcon, UserGroupIcon, VideoCameraIcon,
  MagnifyingGlassIcon, DocumentTextIcon, CheckCircleIcon,
  XMarkIcon, EyeIcon, ArrowDownIcon, EnvelopeIcon,
  PhoneIcon, MapPinIcon, CurrencyDollarIcon, ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// HELPERS
// ============================================================
const getStatusColor = (status) => {
  switch (status) {
    case 'completed':  return 'bg-green-100 text-green-800';
    case 'cancelled':  return 'bg-red-100 text-red-800';
    case 'confirmed':  return 'bg-blue-100 text-blue-800';
    case 'pending':    return 'bg-yellow-100 text-yellow-800';
    default:           return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status) => {
  const map = {
    completed: 'Terminée',
    cancelled: 'Annulée',
    confirmed: 'Confirmée',
    pending:   'En attente',
  };
  return map[status] || status;
};

const getTypeColor = (type) =>
  type === 'video' ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800';

const getTypeLabel = (type) =>
  type === 'video' ? 'Visioconférence' : 'Présentiel';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

const formatPrice = (price) => {
  if (!price) return '—';
  return `${Number(price).toLocaleString('fr-FR')} XAF`;
};

// ============================================================
// COMPOSANT : Skeleton loader
// ============================================================
const SkeletonRow = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-5 bg-gray-200 rounded w-40"></div>
      <div className="h-5 bg-gray-100 rounded w-20"></div>
      <div className="h-5 bg-gray-100 rounded w-20"></div>
    </div>
    <div className="grid grid-cols-4 gap-4 mb-4">
      {[1,2,3,4].map(i => <div key={i} className="h-4 bg-gray-100 rounded"></div>)}
    </div>
    <div className="h-16 bg-gray-50 rounded-lg"></div>
  </div>
);

// ============================================================
// COMPOSANT : Modal détails consultation
// ============================================================
const DetailModal = ({ consultation, onClose }) => {
  if (!consultation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header modal */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Détails de la consultation</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Infos patient + consultation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                Informations patient
              </h3>
              <dl className="space-y-2 text-sm">
                {[
                  ['Nom',       consultation.patient_name],
                  ['Email',     consultation.patient_email],
                  ['Téléphone', consultation.patient_phone],
                  ['Âge',       consultation.patient_age ? `${consultation.patient_age} ans` : '—'],
                  ['Genre',     consultation.patient_gender === 'male' ? 'Homme'
                              : consultation.patient_gender === 'female' ? 'Femme' : '—'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label} :</span>
                    <span className="font-medium text-gray-900">{value || '—'}</span>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                Informations consultation
              </h3>
              <dl className="space-y-2 text-sm">
                {[
                  ['Date',    formatDate(consultation.date)],
                  ['Heure',   consultation.time ? consultation.time.slice(0, 5) : '—'],
                  ['Durée',   consultation.duration || '30 min'],
                  ['Type',    getTypeLabel(consultation.type)],
                  ['Lieu',    consultation.location || '—'],
                  ['Tarif',   formatPrice(consultation.price)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label} :</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Statut :</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                    {getStatusLabel(consultation.status)}
                  </span>
                </div>
              </dl>
            </div>
          </div>

          {/* Compte-rendu médical */}
          {consultation.compte_rendu && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                Compte-rendu médical
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[
                  ['Motif',           consultation.compte_rendu.motif],
                  ['Diagnostic',      consultation.compte_rendu.diagnostic],
                  ['Observations',    consultation.compte_rendu.observations],
                  ['Traitement',      consultation.compte_rendu.traitement],
                  ['Recommandations', consultation.compte_rendu.recommandations],
                ].filter(([, v]) => v).map(([label, value]) => (
                  <div key={label} className={label === 'Recommandations' || label === 'Observations' ? 'md:col-span-2' : ''}>
                    <span className="font-medium text-gray-700">{label} :</span>
                    <p className="text-gray-600 mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Motif du RDV (si pas de compte-rendu) */}
          {!consultation.compte_rendu && consultation.reason && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                Motif de la consultation
              </h3>
              <p className="text-sm text-gray-600">{consultation.reason}</p>
            </div>
          )}

          {/* Prescription */}
          {consultation.prescription && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                Prescription #{consultation.prescription.id}
              </h3>
              {consultation.prescription.items?.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-100">
                      <th className="pb-2 font-medium">Médicament</th>
                      <th className="pb-2 font-medium">Posologie</th>
                      <th className="pb-2 font-medium">Durée</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {consultation.prescription.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 font-medium text-gray-900">{item.nom}</td>
                        <td className="py-2 text-gray-600">{item.posologie}</td>
                        <td className="py-2 text-gray-600">{item.duree}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-500">Aucun médicament listé.</p>
              )}
              {consultation.prescription.notes && (
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Notes :</span> {consultation.prescription.notes}
                </p>
              )}
            </div>
          )}

        </div>

        {/* Footer modal */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL : ConsultationHistory
// ============================================================
export default function ConsultationHistory() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  // Pagination
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]     = useState(0);
  const PER_PAGE = 10;

  // Filtres
  const [search,      setSearch]      = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType,   setFilterType]   = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Modal
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  // ============================================================
  // CHARGEMENT
  // ============================================================
  const loadHistory = useCallback(async (currentPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        page:     currentPage,
        per_page: PER_PAGE,
      };
      if (search)                        filters.search = search;
      if (filterStatus !== 'all')        filters.status = filterStatus;
      if (filterType   !== 'all')        filters.type   = filterType;
      if (filterPeriod !== 'all')        filters.period = filterPeriod;

      const data = await api.getDoctorConsultationHistory(filters);

      setConsultations(data.results || []);
      setTotal(data.count || 0);
      setTotalPages(data.pages || 1);
      setPage(currentPage);
    } catch (err) {
      console.error('Erreur historique:', err);
      setError('Impossible de charger l\'historique. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterType, filterPeriod]);

  // Rechargement quand les filtres changent (reset page 1)
  useEffect(() => {
    loadHistory(1);
  }, [search, filterStatus, filterType, filterPeriod]);

  // ============================================================
  // STATS LOCALES (calculées depuis les données chargées)
  // ============================================================
  const stats = {
    total,
    completed: consultations.filter(c => c.status === 'completed').length,
    video:     consultations.filter(c => c.type === 'video').length,
    inPerson:  consultations.filter(c => c.type !== 'video').length,
    totalRevenue: consultations
      .filter(c => c.status === 'completed')
      .reduce((sum, c) => sum + (Number(c.price) || 0), 0),
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="space-y-6">

      {/* ====== HEADER ====== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historique des consultations</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {total > 0 ? `${total} consultation${total > 1 ? 's' : ''} au total` : 'Aucune consultation'}
            </p>
          </div>
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-gray-500">Terminées</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {(stats.totalRevenue / 1000).toFixed(1)}k
              </p>
              <p className="text-xs text-gray-500">XAF</p>
            </div>
          </div>
        </div>
      </div>

      {/* ====== STATS CARDS ====== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: total,           icon: CalendarIcon,    bg: 'bg-blue-100',   ico: 'text-blue-600' },
          { label: 'Terminées', value: stats.completed, icon: CheckCircleIcon, bg: 'bg-green-100',  ico: 'text-green-600' },
          { label: 'Visio', value: stats.video,      icon: VideoCameraIcon, bg: 'bg-purple-100', ico: 'text-purple-600' },
          { label: 'Présentiel', value: stats.inPerson, icon: UserGroupIcon,  bg: 'bg-teal-100',   ico: 'text-teal-600' },
        ].map(({ label, value, icon: Icon, bg, ico }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${bg}`}>
                <Icon className={`h-5 w-5 ${ico}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ====== FILTRES ====== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Recherche */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Recherche</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom patient, motif..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="completed">Terminé</option>
              <option value="confirmed">Confirmé</option>
              <option value="cancelled">Annulé</option>
              <option value="pending">En attente</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="presentiel">Présentiel</option>
              <option value="video">Visioconférence</option>
            </select>
          </div>

          {/* Période */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Période</label>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les périodes</option>
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="90days">90 derniers jours</option>
              <option value="1year">1 an</option>
            </select>
          </div>
        </div>
      </div>

      {/* ====== ERREUR ====== */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={() => loadHistory(page)}
            className="ml-auto text-sm text-red-700 underline hover:no-underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ====== LISTE ====== */}
      <div className="space-y-4">

        {/* Skeleton */}
        {loading && [1,2,3].map(i => <SkeletonRow key={i} />)}

        {/* Vide */}
        {!loading && consultations.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900">Aucune consultation trouvée</h3>
            <p className="text-sm text-gray-500 mt-1">
              {search || filterStatus !== 'all' || filterType !== 'all' || filterPeriod !== 'all'
                ? 'Modifiez vos filtres pour voir plus de résultats.'
                : 'Vous n\'avez pas encore de consultations enregistrées.'}
            </p>
          </div>
        )}

        {/* Résultats */}
        {!loading && consultations.map((consultation) => (
          <div key={consultation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">

            {/* Ligne 1 : patient + badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="font-semibold text-gray-900">{consultation.patient_name}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                {getStatusLabel(consultation.status)}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(consultation.type)}`}>
                {getTypeLabel(consultation.type)}
              </span>
              {consultation.compte_rendu && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  ✓ Compte-rendu
                </span>
              )}
              {consultation.prescription && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  ✓ Ordonnance
                </span>
              )}
            </div>

            {/* Ligne 2 : date / heure / lieu / durée / tarif */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1.5">
                <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{formatDate(consultation.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>
                  {consultation.time ? consultation.time.slice(0, 5) : '--:--'}
                  {consultation.duration && ` · ${consultation.duration}`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{consultation.location || '—'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CurrencyDollarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span>{formatPrice(consultation.price)}</span>
              </div>
              {consultation.patient_phone && (
                <div className="flex items-center gap-1.5">
                  <PhoneIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{consultation.patient_phone}</span>
                </div>
              )}
            </div>

            {/* Résumé médical (compte-rendu si dispo, sinon motif) */}
            <div className="p-3 bg-gray-50 rounded-lg text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="font-medium text-gray-700">Motif : </span>
                  <span className="text-gray-600">{consultation.reason || '—'}</span>
                </div>
                {consultation.compte_rendu?.diagnostic && (
                  <div>
                    <span className="font-medium text-gray-700">Diagnostic : </span>
                    <span className="text-gray-600">{consultation.compte_rendu.diagnostic}</span>
                  </div>
                )}
                {consultation.compte_rendu?.traitement && (
                  <div className="sm:col-span-2">
                    <span className="font-medium text-gray-700">Traitement : </span>
                    <span className="text-gray-600">{consultation.compte_rendu.traitement}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                {consultation.patient_email && (
                  <span className="flex items-center gap-1">
                    <EnvelopeIcon className="h-3.5 w-3.5" />
                    {consultation.patient_email}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedConsultation(consultation)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <EyeIcon className="h-3.5 w-3.5" />
                  Détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ====== PAGINATION ====== */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500">
            Page {page} sur {totalPages} · {total} résultat{total > 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => loadHistory(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Précédent
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = page <= 3 ? i + 1 : page - 2 + i;
              if (p < 1 || p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => loadHistory(p)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    p === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => loadHistory(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* ====== MODAL DÉTAILS ====== */}
      {selectedConsultation && (
        <DetailModal
          consultation={selectedConsultation}
          onClose={() => setSelectedConsultation(null)}
        />
      )}

    </div>
  );
}