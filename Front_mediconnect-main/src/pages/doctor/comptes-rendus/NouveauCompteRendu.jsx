import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  PlusIcon, 
  XMarkIcon,
  UserCircleIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const NouveauCompteRendu = () => {
  const navigate = useNavigate();
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    type: 'consultation',
    motif: '',
    observations: '',
    diagnostic: '',
    traitement: '',
    recommandations: ''
  });

  // Liste de patients factice pour la démo
  const patients = [
    { id: 1, nom: 'Jean Dupont', dateNaissance: '15/03/1985' },
    { id: 2, nom: 'Marie Martin', dateNaissance: '22/07/1990' },
    { id: 3, nom: 'Pierre Durand', dateNaissance: '05/11/1978' },
  ];

  const typesConsultation = [
    { value: 'consultation', label: 'Consultation de routine' },
    { value: 'suivi', label: 'Consultation de suivi' },
    { value: 'urgence', label: 'Urgence' },
    { value: 'visite', label: 'Visite à domicile' },
    { value: 'teleconsultation', label: 'Téléconsultation' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de soumission ici
    console.log('Nouveau compte rendu :', formData);
    // Redirection après soumission
    navigate('/medecin/comptes-rendus');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Retour aux comptes rendus
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Nouveau compte rendu médical</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Informations générales
            </h3>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            {/* Sélection du patient */}
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                Patient *
              </label>
              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                required
              >
                <option value="">Sélectionner un patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.nom} (né(e) le {patient.dateNaissance})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date de la consultation *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type de consultation *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  {typesConsultation.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="motif" className="block text-sm font-medium text-gray-700">
                  Motif de consultation *
                </label>
                <input
                  type="text"
                  name="motif"
                  id="motif"
                  value={formData.motif}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Ex: Suivi de traitement, Douleur aiguë, etc."
                  required
                />
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Observations médicales
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <label htmlFor="observations" className="sr-only">
              Observations
            </label>
            <textarea
              id="observations"
              name="observations"
              rows={5}
              value={formData.observations}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Décrivez les observations cliniques, les symptômes, les antécédents pertinents..."
            />
          </div>

          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Diagnostic
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <label htmlFor="diagnostic" className="sr-only">
              Diagnostic
            </label>
            <input
              type="text"
              name="diagnostic"
              id="diagnostic"
              value={formData.diagnostic}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Ex: Hypertension artérielle stade 1"
            />
          </div>

          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Traitement prescrit
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <label htmlFor="traitement" className="sr-only">
              Traitement
            </label>
            <textarea
              id="traitement"
              name="traitement"
              rows={4}
              value={formData.traitement}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Détaillez le traitement prescrit, les médicaments, la posologie, la durée..."
            />
          </div>

          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recommandations
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <label htmlFor="recommandations" className="sr-only">
              Recommandations
            </label>
            <textarea
              id="recommandations"
              name="recommandations"
              rows={4}
              value={formData.recommandations}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Conseils d'hygiène de vie, examens complémentaires à prévoir, date de la prochaine consultation..."
            />
          </div>

          <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50 text-right">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enregistrer le compte rendu
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NouveauCompteRendu;
