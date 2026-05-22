import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const DAYS = [
  { value: 0, label: 'Lundi' },
  { value: 1, label: 'Mardi' },
  { value: 2, label: 'Mercredi' },
  { value: 3, label: 'Jeudi' },
  { value: 4, label: 'Vendredi' },
  { value: 5, label: 'Samedi' },
  { value: 6, label: 'Dimanche' },
];

const CONSULTATION_TYPES = [
  { value: 'consultation', label: 'Consultation' },
  { value: 'urgence', label: 'Urgence' },
  { value: 'video', label: 'Visioconférence' },
  { value: 'chirurgie', label: 'Chirurgie' },
];

const TEMPLATES = [
  {
    label: 'Standard',
    description: 'Lun–Ven : 8h–12h, 14h–18h',
    periods: [0,1,2,3,4].flatMap(day => [
      { day_of_week: day, start_time: '08:00', end_time: '12:00', consultation_type: 'consultation' },
      { day_of_week: day, start_time: '14:00', end_time: '18:00', consultation_type: 'consultation' },
    ]),
  },
  {
    label: 'Demi-journée',
    description: 'Lun–Ven : 8h–12h',
    periods: [0,1,2,3,4].map(day => (
      { day_of_week: day, start_time: '08:00', end_time: '12:00', consultation_type: 'consultation' }
    )),
  },
  {
    label: 'Week-end inclus',
    description: 'Tous les jours : 8h–12h',
    periods: [0,1,2,3,4,5,6].map(day => (
      { day_of_week: day, start_time: '08:00', end_time: '12:00', consultation_type: 'consultation' }
    )),
  },
];

export default function DoctorAvailability() {
  // availabilities groupées par jour : { 0: [...periods], 1: [...], ... }
  const [grouped, setGrouped] = useState(() =>
    Object.fromEntries(DAYS.map(d => [d.value, []]))
  );
  const [disabledDays, setDisabledDays] = useState(new Set([6])); // Dimanche désactivé par défaut
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Formulaire d'ajout de créneau
  const [addingDay, setAddingDay] = useState(null);
  const [newPeriod, setNewPeriod] = useState({ start_time: '', end_time: '', consultation_type: 'consultation' });

  // -------- Chargement initial --------
  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      setLoading(true);
      const data = await api.getDoctorAvailabilities();
      // Regrouper par jour
      const g = Object.fromEntries(DAYS.map(d => [d.value, []]));
      data.forEach(item => {
        if (g[item.day_of_week] !== undefined) {
          g[item.day_of_week].push(item);
        }
      });
      setGrouped(g);

      // Jours sans aucun créneau → marqués désactivés
      const disabled = new Set(
        DAYS.map(d => d.value).filter(d => g[d].length === 0)
      );
      setDisabledDays(disabled);
    } catch (err) {
      setError('Erreur lors du chargement des disponibilités.');
    } finally {
      setLoading(false);
    }
  };

  // -------- Toggle jour --------
  const toggleDay = (dayValue) => {
    setDisabledDays(prev => {
      const next = new Set(prev);
      if (next.has(dayValue)) {
        next.delete(dayValue); // Activer le jour
      } else {
        next.add(dayValue);    // Désactiver le jour
      }
      return next;
    });
  };

  // -------- Ajouter un créneau localement --------
  const handleAddPeriod = (dayValue) => {
    if (!newPeriod.start_time || !newPeriod.end_time) return;
    setGrouped(prev => ({
      ...prev,
      [dayValue]: [
        ...prev[dayValue],
        { ...newPeriod, day_of_week: dayValue, _local: true, _tempId: Date.now() }
      ]
    }));
    setNewPeriod({ start_time: '', end_time: '', consultation_type: 'consultation' });
    setAddingDay(null);
  };

  // -------- Supprimer un créneau localement --------
  const handleRemovePeriod = (dayValue, index) => {
    setGrouped(prev => ({
      ...prev,
      [dayValue]: prev[dayValue].filter((_, i) => i !== index)
    }));
  };

  // -------- Appliquer un template --------
  const applyTemplate = (template) => {
    const g = Object.fromEntries(DAYS.map(d => [d.value, []]));
    template.periods.forEach(p => {
      g[p.day_of_week].push({ ...p, _local: true, _tempId: Date.now() + Math.random() });
    });
    setGrouped(g);
    // Jours actifs = ceux qui ont des créneaux
    const active = new Set(template.periods.map(p => p.day_of_week));
    const disabled = new Set(DAYS.map(d => d.value).filter(d => !active.has(d)));
    setDisabledDays(disabled);
  };

  // -------- Sauvegarde complète --------
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      // On n'envoie que les créneaux des jours actifs
      const toSave = DAYS
        .filter(d => !disabledDays.has(d.value))
        .flatMap(d => grouped[d.value].map(p => ({
          day_of_week: p.day_of_week,
          start_time: p.start_time,
          end_time: p.end_time,
          consultation_type: p.consultation_type,
        })));

      await api.saveDoctorAvailabilities(toSave);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await fetchAvailabilities(); // Rechargement depuis le backend
    } catch (err) {
      setError('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setSaving(false);
    }
  };

  // -------- Stats --------
  const stats = {
    activeDays: DAYS.filter(d => !disabledDays.has(d.value)).length,
    totalPeriods: Object.values(grouped).flat().length,
    totalHours: Object.values(grouped).flat().reduce((sum, p) => {
      const s = new Date(`2000-01-01T${p.start_time}`);
      const e = new Date(`2000-01-01T${p.end_time}`);
      return sum + (e - s) / 3600000;
    }, 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des disponibilités...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Disponibilités</h1>
            <p className="text-gray-600 mt-1">Gérez vos horaires de disponibilité</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-sm"
          >
            {saving ? (
              <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>Sauvegarde...</>
            ) : (
              <><CheckCircleIcon className="h-4 w-4 mr-2" />Sauvegarder</>
            )}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <XMarkIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
            <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
            Disponibilités sauvegardées avec succès !
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Jours actifs', value: stats.activeDays, icon: CalendarIcon, color: 'blue' },
            { label: 'Heures/semaine', value: `${stats.totalHours.toFixed(0)}h`, icon: ClockIcon, color: 'green' },
            { label: 'Créneaux', value: stats.totalPeriods, icon: CheckCircleIcon, color: 'purple' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center">
              <div className={`p-3 bg-${s.color}-100 rounded-lg mr-4`}>
                <s.icon className={`h-5 w-5 text-${s.color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Planning */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Planning hebdomadaire</h2>

          <div className="space-y-4">
            {DAYS.map(day => {
              const isDisabled = disabledDays.has(day.value);
              const periods = grouped[day.value] || [];

              return (
                <div
                  key={day.value}
                  className={`border rounded-lg p-4 transition-colors ${isDisabled ? 'border-gray-100 bg-gray-50' : 'border-gray-200 bg-white'}`}
                >
                  {/* En-tête du jour */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-medium ${isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                        {day.label}
                      </h3>
                      {isDisabled && (
                        <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-500 rounded-full">
                          Indisponible
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleDay(day.value)}
                      className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                        isDisabled
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {isDisabled ? 'Activer' : 'Désactiver'}
                    </button>
                  </div>

                  {/* Créneaux */}
                  {!isDisabled && (
                    <div className="space-y-2">
                      {periods.length === 0 && (
                        <p className="text-sm text-gray-400 italic">Aucun créneau défini</p>
                      )}
                      {periods.map((period, idx) => (
                        <div key={period.id || period._tempId || idx} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                          <div className="flex items-center gap-3">
                            <ClockIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {period.start_time} – {period.end_time}
                            </span>
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                              {CONSULTATION_TYPES.find(t => t.value === period.consultation_type)?.label || period.consultation_type}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemovePeriod(day.value, idx)}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      {/* Formulaire d'ajout */}
                      {addingDay === day.value ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="time"
                              value={newPeriod.start_time}
                              onChange={e => setNewPeriod({ ...newPeriod, start_time: e.target.value })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <span className="text-gray-500 text-sm">à</span>
                            <input
                              type="time"
                              value={newPeriod.end_time}
                              onChange={e => setNewPeriod({ ...newPeriod, end_time: e.target.value })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <select
                              value={newPeriod.consultation_type}
                              onChange={e => setNewPeriod({ ...newPeriod, consultation_type: e.target.value })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              {CONSULTATION_TYPES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleAddPeriod(day.value)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                            >
                              Ajouter
                            </button>
                            <button
                              onClick={() => { setAddingDay(null); setNewPeriod({ start_time: '', end_time: '', consultation_type: 'consultation' }); }}
                              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingDay(day.value)}
                          className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mt-1"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Ajouter un créneau
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Templates */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Modèles rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TEMPLATES.map(t => (
              <button
                key={t.label}
                onClick={() => applyTemplate(t)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 text-left transition-colors"
              >
                <h3 className="font-medium text-gray-900 mb-1">{t.label}</h3>
                <p className="text-sm text-gray-500">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Comment ça fonctionne</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Définissez vos créneaux par jour, puis cliquez sur <strong>Sauvegarder</strong></li>
                <li>Les patients verront vos disponibilités lors de la prise de rendez-vous</li>
                <li>Les modèles rapides remplacent le planning actuel</li>
                <li>Désactiver un jour supprime ses créneaux de la vue patients</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}