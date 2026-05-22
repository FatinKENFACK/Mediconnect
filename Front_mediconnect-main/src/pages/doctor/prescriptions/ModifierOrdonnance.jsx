import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../../services/api';

const ModifierOrdonnance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [medicaments, setMedicaments] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getPrescriptions()
      .then(data => {
        const found = data.find(p => String(p.id) === String(id));
        if (!found) { setError('Ordonnance introuvable.'); return; }
        setPatientName(found.patient_name);
        setDate(found.date);
        setMedicaments(found.items.map(i => ({ nom: i.nom, posologie: i.posologie, duree: i.duree })));
        setInstructions(found.notes || '');
        setStatus(found.status);
      })
      .catch(() => setError('Erreur lors du chargement.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddMedicament = () => {
    setMedicaments([...medicaments, { nom: '', posologie: '', duree: '' }]);
  };

  const handleRemoveMedicament = (index) => {
    setMedicaments(medicaments.filter((_, i) => i !== index));
  };

  const handleMedicamentChange = (index, field, value) => {
    const updated = [...medicaments];
    updated[index][field] = value;
    setMedicaments(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.updatePrescription(id, {
        date,
        notes: instructions,
        status,
        items: medicaments,
      });
      navigate('/medecin/prescriptions');
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cette ordonnance définitivement ?')) return;
    try {
      await api.deletePrescription(id);
      navigate('/medecin/prescriptions');
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />Retour aux prescriptions
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Modifier l'ordonnance</h1>
        <p className="mt-1 text-sm text-gray-500">Numéro d'ordonnance : #{id}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label className="block text-sm font-medium text-gray-700">Patient</label>
              <input type="text" value={patientName} disabled
                className="mt-1 block w-full border border-gray-200 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-600 sm:text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <select value={status} onChange={e => setStatus(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="active">En cours</option>
                <option value="expired">Expirée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>

          {/* Médicaments */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Médicaments</h3>
              <button type="button" onClick={handleAddMedicament}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200">
                <PlusIcon className="h-4 w-4 mr-1" />Ajouter un médicament
              </button>
            </div>
            <div className="space-y-4">
              {medicaments.map((med, index) => (
                <div key={index} className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-12 border border-gray-200 rounded-md p-4">
                  <div className="sm:col-span-5">
                    <label className="block text-sm font-medium text-gray-700">Médicament</label>
                    <input type="text" value={med.nom}
                      onChange={e => handleMedicamentChange(index, 'nom', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">Posologie</label>
                    <input type="text" value={med.posologie}
                      onChange={e => handleMedicamentChange(index, 'posologie', e.target.value)}
                      placeholder="Ex: 1 comprimé matin et soir"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Durée</label>
                    <input type="text" value={med.duree}
                      onChange={e => handleMedicamentChange(index, 'duree', e.target.value)}
                      placeholder="Ex: 7 jours"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required />
                  </div>
                  <div className="sm:col-span-1 flex items-end">
                    <button type="button" onClick={() => handleRemoveMedicament(index)}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-md text-red-700 bg-red-100 hover:bg-red-200">
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700">Instructions supplémentaires</label>
            <textarea rows={4} value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="Instructions particulières pour le patient..."
              className="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <button type="button" onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200">
            Supprimer l'ordonnance
          </button>
          <div className="flex space-x-3">
            <button type="button" onClick={() => navigate('/medecin/prescriptions')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60">
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModifierOrdonnance;