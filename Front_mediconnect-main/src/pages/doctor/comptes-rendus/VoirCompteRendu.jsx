import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ClockIcon,
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
  date: '15/12/2023',
  type: 'Consultation de suivi',
  motif: 'Suivi de traitement - Hypertension artérielle',
  observations: 'Le patient se plaint de maux de tête fréquents. La tension artérielle est à 14/9. Le patient suit bien son traitement mais doit améliorer son hygiène de vie.',
  diagnostic: 'Hypertension artérielle stade 1 contrôlée',
  traitement: 'Poursuite du traitement actuel : Amlodipine 10mg 1x/jour. Contrôle dans 3 mois.',
  recommandations: 'Réduire la consommation de sel, pratiquer une activité physique régulière (30 min/jour), limiter la consommation d\'alcool.'
};

const VoirCompteRendu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const compteRendu = compteRenduData; // Dans une vraie app, on ferait un appel API avec l'ID

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compte rendu médical</h1>
            <p className="mt-1 text-sm text-gray-500">
              Numéro de compte rendu: {compteRendu.id}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <PrinterIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
              Imprimer
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
              Télécharger
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Informations générales
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                {compteRendu.date}
              </dd>
            </div>
            <div className="sm:col-span-4">
              <dt className="text-sm font-medium text-gray-500">Type de consultation</dt>
              <dd className="mt-1 text-sm text-gray-900">{compteRendu.type}</dd>
            </div>
            <div className="sm:col-span-6">
              <dt className="text-sm font-medium text-gray-500">Motif de consultation</dt>
              <dd className="mt-1 text-sm text-gray-900">{compteRendu.motif}</dd>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Détails du patient
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <UserCircleIcon className="h-12 w-12 text-gray-400" />
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900">{compteRendu.patient.nom}</h4>
              <div className="mt-1 text-sm text-gray-500">
                <p>Né(e) le: {compteRendu.patient.dateNaissance}</p>
                <p>N° Sécurité Sociale: {compteRendu.patient.numeroSecuriteSociale}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Observations médicales
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-900 whitespace-pre-line">
            {compteRendu.observations}
          </p>
        </div>

        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Diagnostic
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-900">
            {compteRendu.diagnostic}
          </p>
        </div>

        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Traitement prescrit
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-900 whitespace-pre-line">
            {compteRendu.traitement}
          </p>
        </div>

        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recommandations
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-900 whitespace-pre-line">
            {compteRendu.recommandations}
          </p>
        </div>

        <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50 text-right">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retour
          </button>
          <button
            type="button"
            onClick={() => navigate(`/medecin/comptes-rendus/modifier/${id}`)}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Modifier le compte rendu
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoirCompteRendu;
