import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';

const TYPES = [
  { value: 'consultation', label: 'Consultation de routine' },
  { value: 'suivi', label: 'Consultation de suivi' },
  { value: 'urgence', label: 'Urgence' },
  { value: 'visite', label: 'Visite à domicile' },
  { value: 'teleconsultation', label: 'Téléconsultation' },
];

const NouveauCompteRendu = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'consultation',
    motif: '',
    observations: '',
    diagnostic: '',
    traitement: '',
    recommandations: '',
  });

  useEffect(() => {
    api.getDoctorPatients()
      .then(setPatients)
      .catch(() => setError('Impossible de charger la liste des patients.'));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId) { setError('Veuillez sélectionner un patient.'); return; }
    setSaving(true);
    setError(null);
    try {
      await api.createCompteRendu({
        patient: parseInt(formData.patientId),
        date: formData.date,
        type: formData.type,
        motif: formData.motif,
        observations: formData.observations,
        diagnostic: formData.diagnostic,
        traitement: formData.traitement,
        recommandations: formData.recommandations,
      });
      navigate('/medecin/comptes-rendus');
    } catch (err) {
      setError(err.message || 'Erreur lors de la création.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />Retour aux comptes rendus
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Nouveau compte rendu médical</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Informations générales</h3>
          </div>
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient *</label>
              <select name="patientId" value={formData.patientId} onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                required>
                <option value="">-- Sélectionner un patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Date *</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="date" name="date" value={formData.date} onChange={handleChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    required />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Type *</label>
                <select name="type" value={formData.type} onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required>
                  {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Motif *</label>
                <input type="text" name="motif" value={formData.motif} onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Ex: Suivi de traitement, Douleur aiguë..." required />
              </div>
            </div>
          </div>

          {[
            { key: 'observations', label: 'Observations médicales', rows: 5, placeholder: 'Observations cliniques, symptômes...' },
            { key: 'diagnostic', label: 'Diagnostic', rows: 2, placeholder: 'Ex: Hypertension artérielle stade 1' },
            { key: 'traitement', label: 'Traitement prescrit', rows: 4, placeholder: 'Médicaments, posologie, durée...' },
            { key: 'recommandations', label: 'Recommandations', rows: 4, placeholder: 'Conseils, examens à prévoir...' },
          ].map(field => (
            <div key={field.key}>
              <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{field.label}</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <textarea name={field.key} rows={field.rows} value={formData[field.key]}
                  onChange={handleChange} placeholder={field.placeholder}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md" />
              </div>
            </div>
          ))}

          <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50 text-right">
            <button type="button" onClick={() => navigate(-1)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60">
              {saving ? 'Enregistrement...' : 'Enregistrer le compte rendu'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NouveauCompteRendu;