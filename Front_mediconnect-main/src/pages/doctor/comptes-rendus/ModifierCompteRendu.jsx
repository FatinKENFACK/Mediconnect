import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  XMarkIcon,
  UserCircleIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

// Données factices pour la démo
const compteRenduData = {
  id: '1',
  patient: {
    id: 1,
    nom: 'Jean Dupont',
    dateNaissance: '15/03/1985',
    numeroSecuriteSociale: '1 85 03 15 123 456 78'
  },
  date: '2023-12-15',
  type: 'suivi',
  motif: 'Suivi de traitement - Hypertension artérielle',
  observations: 'Le patient se plaint de maux de tête fréquents. La tension artérielle est à 14/9. Le patient suit bien son traitement mais doit améliorer son hygiène de vie.',
  diagnostic: 'Hypertension artérielle stade 1 contrôlée',
  traitement: 'Poursuite du traitement actuel : Amlodipine 10mg 1x/jour. Contrôle dans 3 mois.',
  recommandations: 'Réduire la consommation de sel, pratiquer une activité physique régulière (30 min/jour), limiter la consommation d\'alcool.'
};

const typesConsultation = [
  { value: 'consultation', label: 'Consultation de routine' },
  { value: 'suivi', label: 'Consultation de suivi' },
  { value: 'urgence', label: 'Urgence' },
  { value: 'visite', label: 'Visite à domicile' },
  { value: 'teleconsultation', label: 'Téléconsultation' },
];

const ModifierCompteRendu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    type: 'consultation',
    motif: '',
    observations: '',
    diagnostic: '',
    traitement: '',
    recommandations: ''
  });

  // Simuler le chargement des données du compte rendu
  useEffect(() => {
    // Dans une application réelle, on ferait un appel API pour récupérer les données
    const timer = setTimeout(() => {
      setFormData({
        patientId: compteRenduData.patient.id,
        date: compteRenduData.date,
        type: compteRenduData.type,
        motif: compteRenduData.motif,
        observations: compteRenduData.observations,
        diagnostic: compteRenduData.diagnostic,
        traitement: compteRenduData.traitement,
        recommandations: compteRenduData.recommandations
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de mise à jour ici
    console.log('Mise à jour du compte rendu :', { id, ...formData });
    // Redirection après mise à jour
    navigate(`/medecin/comptes-rendus/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Retour au compte rendu
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Modifier le compte rendu médical</h1>
        <p className="mt-1 text-sm text-gray-500">
          Numéro de compte rendu: {id}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Informations générales
            </h3>
          </div>
          
          <div className="px-4 py-5 sm:p-6 space-y-6">
            {/* Affichage des informations du patient en lecture seule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient
              </label>
              <div className="flex items-center bg-gray-50 p-3 rounded-md">
                <UserCircleIcon className="h-10 w-10 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{compteRenduData.patient.nom}</p>
                  <p className="text-xs text-gray-500">Né(e) le: {compteRenduData.patient.dateNaissance}</p>
                  <p className="text-xs text-gray-500">N° Sécurité Sociale: {compteRenduData.patient.numeroSecuriteSociale}</p>
                </div>
              </div>
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

          <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <button
              type="button"
              onClick={() => navigate(`/medecin/comptes-rendus/${id}`)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <div className="space-x-3">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer ce compte rendu ? Cette action est irréversible.')) {
                    // Logique de suppression ici
                    navigate('/medecin/comptes-rendus');
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Supprimer
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModifierCompteRendu;
