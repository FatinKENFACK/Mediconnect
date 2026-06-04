import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CalendarIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';

const TYPES = [
  { value: 'consultation', label: 'Consultation de routine' },
  { value: 'suivi', label: 'Consultation de suivi' },
  { value: 'urgence', label: 'Urgence' },
  { value: 'visite', label: 'Visite à domicile' },
  { value: 'teleconsultation', label: 'Téléconsultation' },
];

const ModifierCompteRendu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    date: '',
    type: 'consultation',
    motif: '',
    observations: '',
    diagnostic: '',
    traitement: '',
    recommandations: '',
  });

  useEffect(() => {
    api.getCompteRendu(id)
      .then(data => {
        setPatientName(data.patient_name);
        setFormData({
          date: data.date,
          type: data.type,
          motif: data.motif,
          observations: data.observations || '',
          diagnostic: data.diagnostic || '',
          traitement: data.traitement || '',
          recommandations: data.recommandations || '',
        });
      })
      .catch(() => setError('Compte rendu introuvable.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.updateCompteRendu(id, formData);
      navigate(`/medecin/comptes-rendus/${id}`);
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Supprimer ce compte rendu définitivement ?')) return;
    try {
      await api.deleteCompteRendu(id);
      navigate('/medecin/comptes-rendus');
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />Retour au compte rendu
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Modifier le compte rendu</h1>
        <p className="mt-1 text-sm text-gray-500">Numéro : #{id}</p>
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
            {/* Patient (lecture seule) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient</label>
              <div className="flex items-center bg-gray-50 p-3 rounded-md mt-1">
                <UserCircleIcon className="h-10 w-10 text-gray-400 mr-3" />
                <p className="text-sm font-medium text-gray-900">{patientName}</p>
              </div>
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
                  required />
              </div>
            </div>
          </div>

          {[
            { key: 'observations', label: 'Observations médicales', rows: 5 },
            { key: 'diagnostic', label: 'Diagnostic', rows: 2 },
            { key: 'traitement', label: 'Traitement prescrit', rows: 4 },
            { key: 'recommandations', label: 'Recommandations', rows: 4 },
          ].map(field => (
            <div key={field.key}>
              <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{field.label}</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <textarea name={field.key} rows={field.rows} value={formData[field.key]}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md" />
              </div>
            </div>
          ))}

          <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <button type="button" onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
              Supprimer
            </button>
            <div className="space-x-3">
              <button type="button" onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                Annuler
              </button>
              <button type="submit" disabled={saving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60">
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModifierCompteRendu;