import React, { useState, useEffect } from 'react';
import {
  ClockIcon, CalendarIcon, CheckCircleIcon, XCircleIcon,
  UserGroupIcon, BuildingOfficeIcon, ArrowPathIcon,
  ChevronDownIcon, ChevronUpIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// CONSTANTES
// ============================================================
const WEEK_DAYS = [
  { key: 0, label: 'Lundi' },
  { key: 1, label: 'Mardi' },
  { key: 2, label: 'Mercredi' },
  { key: 3, label: 'Jeudi' },
  { key: 4, label: 'Vendredi' },
  { key: 5, label: 'Samedi' },
  { key: 6, label: 'Dimanche' },
];

const CONSULTATION_TYPE_LABELS = {
  in_person: 'Présentiel',
  video:     'Vidéo',
  both:      'Présentiel & Vidéo',
};

// ============================================================
// COMPOSANT : Grille des jours d'un médecin
// ============================================================
const DoctorAvailabilityGrid = ({ availabilities }) => {
  // Construire un set des jours actifs
  const activeDays = new Set(
    availabilities
      .filter(a => a.is_active)
      .map(a => a.day_of_week)
  );

  return (
    <div className="grid grid-cols-7 gap-1 text-xs">
      {WEEK_DAYS.map(day => {
        const isActive = activeDays.has(day.key);
        // Trouver les créneaux de ce jour
        const slots = availabilities.filter(
          a => a.day_of_week === day.key && a.is_active
        );
        return (
          <div key={day.key}
            className={`text-center p-1.5 rounded-lg ${
              isActive ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-100'
            }`}>
            <p className={`font-semibold ${isActive ? 'text-green-700' : 'text-gray-400'}`}>
              {day.label.slice(0, 3)}
            </p>
            <div className="mt-1 flex justify-center">
              {isActive
                ? <CheckCircleIcon className="h-3.5 w-3.5 text-green-500" />
                : <XCircleIcon className="h-3.5 w-3.5 text-gray-300" />}
            </div>
            {isActive && slots.length > 0 && (
              <p className="text-gray-500 mt-0.5 leading-tight">
                {slots[0].start_time?.slice(0, 5)}
                <br />
                {slots[0].end_time?.slice(0, 5)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// COMPOSANT : Carte médecin avec ses disponibilités
// ============================================================
const DoctorCard = ({ doctor, availabilities, loading }) => {
  const [expanded, setExpanded] = useState(false);

  const activeDays  = availabilities.filter(a => a.is_active).length;
  const totalSlots  = availabilities.length;
  const hasVideo    = availabilities.some(a => a.consultation_type === 'video' || a.consultation_type === 'both');
  const hasInPerson = availabilities.some(a => a.consultation_type === 'in_person' || a.consultation_type === 'both');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* En-tête médecin */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              {doctor.profile_picture ? (
                <img src={`http://localhost:8000${doctor.profile_picture}`}
                  className="h-11 w-11 rounded-full object-cover" alt="" />
              ) : (
                <span className="text-blue-700 font-semibold text-sm">
                  {(doctor.first_name?.[0] || '') + (doctor.last_name?.[0] || '')}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Dr. {doctor.first_name} {doctor.last_name}
              </p>
              <p className="text-xs text-gray-500">{doctor.specialization || '—'}</p>
            </div>
          </div>

          {/* Badge statut */}
          <div className="flex flex-col items-end gap-1">
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
              doctor.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
            }`}>
              {doctor.is_available ? '🟢 Disponible' : '🔴 Indisponible'}
            </span>
            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
              doctor.is_verified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {doctor.is_verified ? '✓ Vérifié' : '⏳ En attente'}
            </span>
          </div>
        </div>

        {/* Résumé disponibilités */}
        {loading ? (
          <div className="mt-4 h-10 bg-gray-100 rounded animate-pulse"></div>
        ) : totalSlots === 0 ? (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700 text-center">
              ⚠️ Aucune disponibilité configurée par ce médecin
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {/* Stats rapides */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                {activeDays} jour{activeDays > 1 ? 's' : ''} / semaine
              </span>
              {hasVideo && (
                <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">📹 Vidéo</span>
              )}
              {hasInPerson && (
                <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full">🏥 Présentiel</span>
              )}
            </div>

            {/* Grille des jours */}
            <DoctorAvailabilityGrid availabilities={availabilities} />

            {/* Tarifs */}
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
              {doctor.fee_in_person > 0 && (
                <span>Présentiel : <span className="font-medium text-gray-700">{Number(doctor.fee_in_person).toLocaleString('fr-FR')} XAF</span></span>
              )}
              {doctor.fee_video > 0 && (
                <span>Vidéo : <span className="font-medium text-gray-700">{Number(doctor.fee_video).toLocaleString('fr-FR')} XAF</span></span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Détail des créneaux (expandable) */}
      {!loading && totalSlots > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-5 py-2.5 border-t border-gray-100 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-xs text-gray-600 font-medium transition-colors">
            <span>Voir le détail des créneaux ({totalSlots})</span>
            {expanded
              ? <ChevronUpIcon className="h-4 w-4" />
              : <ChevronDownIcon className="h-4 w-4" />}
          </button>

          {expanded && (
            <div className="px-5 pb-5 pt-3 border-t border-gray-100">
              <div className="space-y-2">
                {availabilities.map(slot => (
                  <div key={slot.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs ${
                      slot.is_active ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100 opacity-60'
                    }`}>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-700 w-20">
                        {WEEK_DAYS.find(d => d.key === slot.day_of_week)?.label || '—'}
                      </span>
                      <span className="text-gray-600">
                        {slot.start_time?.slice(0, 5)} → {slot.end_time?.slice(0, 5)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full font-medium ${
                        slot.consultation_type === 'video'
                          ? 'bg-purple-100 text-purple-700'
                          : slot.consultation_type === 'in_person'
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {CONSULTATION_TYPE_LABELS[slot.consultation_type] || slot.consultation_type}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${slot.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
const HospitalAvailability = () => {
  const [doctors, setDoctors]                   = useState([]);
  const [availabilitiesMap, setAvailabilitiesMap] = useState({}); // { doctorId: [slots] }
  const [loadingDoctors, setLoadingDoctors]     = useState(true);
  const [loadingAvailabilities, setLoadingAvailabilities] = useState({});
  const [error, setError]                       = useState(null);
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [filterVerified, setFilterVerified]     = useState('all');
  const [searchQuery, setSearchQuery]           = useState('');

  // ============================================================
  // CHARGEMENT DES MÉDECINS DE L'HÔPITAL
  // ============================================================
  const loadDoctors = async () => {
    setLoadingDoctors(true);
    setError(null);
    try {
      const data = await api.getHospitalDoctors();
      const list = Array.isArray(data) ? data : [];
      setDoctors(list);
      // Charger les disponibilités de chaque médecin en parallèle
      loadAllAvailabilities(list);
    } catch {
      setError('Impossible de charger les médecins.');
    } finally {
      setLoadingDoctors(false);
    }
  };

  // ============================================================
  // CHARGEMENT DES DISPONIBILITÉS DE TOUS LES MÉDECINS
  // On utilise l'endpoint public doctor/<id> car l'hôpital
  // n'a pas d'endpoint dédié pour les disponibilités de ses médecins
  // ============================================================
  const loadAllAvailabilities = async (doctorList) => {
    const newMap = {};
    const loadingState = {};

    doctorList.forEach(d => { loadingState[d.id] = true; });
    setLoadingAvailabilities(loadingState);

    await Promise.allSettled(
      doctorList.map(async (doctor) => {
        try {
          const data = await api.getDoctorAvailabilitiesByDoctor(doctor.id);
          newMap[doctor.id] = Array.isArray(data) ? data : [];
        } catch {
          newMap[doctor.id] = [];
        } finally {
          setLoadingAvailabilities(prev => ({ ...prev, [doctor.id]: false }));
        }
      })
    );

    setAvailabilitiesMap(newMap);
  };

  useEffect(() => { loadDoctors(); }, []);

  // ============================================================
  // FILTRES
  // ============================================================
  const filtered = doctors.filter(d => {
    const name = `${d.first_name || ''} ${d.last_name || ''}`.toLowerCase();
    const matchSearch = !searchQuery ||
      name.includes(searchQuery.toLowerCase()) ||
      (d.specialization || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchAvail =
      filterAvailability === 'all' ||
      (filterAvailability === 'available' && d.is_available) ||
      (filterAvailability === 'unavailable' && !d.is_available);
    const matchVerified =
      filterVerified === 'all' ||
      (filterVerified === 'verified' && d.is_verified) ||
      (filterVerified === 'pending' && !d.is_verified);
    return matchSearch && matchAvail && matchVerified;
  });

  // ============================================================
  // STATS GLOBALES
  // ============================================================
  const stats = {
    total:       doctors.length,
    available:   doctors.filter(d => d.is_available).length,
    verified:    doctors.filter(d => d.is_verified).length,
    configured:  doctors.filter(d => (availabilitiesMap[d.id]?.length || 0) > 0).length,
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Disponibilités</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Vue d'ensemble des disponibilités des médecins de votre établissement
          </p>
        </div>
        <button onClick={loadDoctors} disabled={loadingDoctors}
          className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
          <ArrowPathIcon className={`h-4 w-4 ${loadingDoctors ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={loadDoctors} className="text-sm text-red-700 underline">Réessayer</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total médecins',    value: stats.total,      color: 'bg-blue-500',   icon: UserGroupIcon },
          { label: 'Disponibles',       value: stats.available,  color: 'bg-green-500',  icon: CheckCircleIcon },
          { label: 'Vérifiés',          value: stats.verified,   color: 'bg-indigo-500', icon: BuildingOfficeIcon },
          { label: 'Planning configuré',value: stats.configured, color: 'bg-teal-500',   icon: CalendarIcon },
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <input type="text" placeholder="Rechercher un médecin..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            <ClockIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <select value={filterAvailability} onChange={e => setFilterAvailability(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option value="all">Toutes les disponibilités</option>
            <option value="available">Disponibles</option>
            <option value="unavailable">Indisponibles</option>
          </select>
          <select value={filterVerified} onChange={e => setFilterVerified(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option value="all">Tous les statuts</option>
            <option value="verified">Vérifiés</option>
            <option value="pending">En attente</option>
          </select>
          <button onClick={() => { setSearchQuery(''); setFilterAvailability('all'); setFilterVerified('all'); }}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Grille médecins */}
      {loadingDoctors ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-100 rounded w-20"></div>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[1,2,3,4,5,6,7].map(j => (
                  <div key={j} className="h-14 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">
            {doctors.length === 0
              ? 'Aucun médecin rattaché à votre établissement'
              : 'Aucun médecin correspond à votre recherche'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                availabilities={availabilitiesMap[doctor.id] || []}
                loading={loadingAvailabilities[doctor.id] === true}
              />
            ))}
          </div>

          {/* Note info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <span className="font-medium">ℹ️ Note :</span> Les disponibilités sont configurées par chaque médecin depuis son propre dashboard.
              En tant qu'hôpital, vous avez une vue en lecture seule de leur planning.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default HospitalAvailability;