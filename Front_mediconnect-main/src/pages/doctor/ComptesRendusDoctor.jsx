import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon,
  UserCircleIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const comptesRendus = [
  {
    id: 1,
    patientId: 1,
    patientName: 'Jean Martin',
    date: '2023-06-10',
    type: 'Consultation de suivi',
    title: 'Suivi hypertension artérielle',
    content: 'Le patient présente une tension artérielle bien contrôlée sous traitement. Pas de plainte particulière. Renouvellement du traitement pour 3 mois.',
    documents: ['Bilan sanguin', 'ECG']
  },
  {
    id: 2,
    patientId: 2,
    patientName: 'Marie Dubois',
    date: '2023-06-08',
    type: 'Première consultation',
    title: 'Bilan de santé annuel',
    content: 'Bilan de santé complet avec analyses sanguines. Résultats dans les normes. Recommandations hygiéno-diététiques données.',
    documents: ['Bilan sanguin complet']
  },
  {
    id: 3,
    patientId: 1,
    patientName: 'Jean Martin',
    date: '2023-03-15',
    type: 'Consultation de suivi',
    title: 'Contrôle tensionnel',
    content: 'Tension légèrement élevée. Ajustement du traitement. Nouvelle consultation prévue dans 1 mois.',
    documents: []
  },
  {
    id: 4,
    patientId: 4,
    patientName: 'Sophie Lambert',
    date: '2023-05-20',
    type: 'Téléconsultation',
    title: 'Suivi post-opératoire',
    content: 'Bonne évolution post-opératoire. Cicatrisation normale. Pas de douleur résiduelle. Reprise du travail autorisée.',
    documents: ['Compte rendu opératoire']
  },
  {
    id: 5,
    patientId: 5,
    patientName: 'Thomas Leroy',
    date: '2023-04-10',
    type: 'Consultation spécialisée',
    title: 'Bilan cardiologique',
    content: 'Bilan cardiologique complet. Résultats rassurants. Pas de signe d\'ischémie. Poursuite du traitement actuel.',
    documents: ['ECG', 'Echocardiographie', 'Test d\'effort']
  }
];

const ComptesRendusDoctor = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('toutes');
  const [selectedPatient, setSelectedPatient] = useState('tous');

  // Liste des patients uniques pour le filtre
  const patients = [...new Set(comptesRendus.map(cr => cr.patientId))].map(id => {
    const cr = comptesRendus.find(c => c.patientId === id);
    return { id: cr.patientId, name: cr.patientName };
  });

  const filteredComptesRendus = comptesRendus.filter(cr => {
    const matchesSearch = cr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        cr.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        cr.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPatient = selectedPatient === 'tous' || cr.patientId === parseInt(selectedPatient);
    
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const matchesDate = dateFilter === 'toutes' ||
                       (dateFilter === '7j' && new Date(cr.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                       (dateFilter === '30j' && new Date(cr.date) >= thirtyDaysAgo) ||
                       (dateFilter === 'mois' && cr.date.startsWith(today.substring(0, 7)));
    
    return matchesSearch && matchesPatient && matchesDate;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Comptes rendus médicaux</h1>
            <p className="mt-1 text-sm text-gray-500">
              Consultez et gérez les comptes rendus de vos patients
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/medecin/comptes-rendus/nouveau"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Nouveau compte rendu
            </Link>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Rechercher
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Patient, titre ou contenu"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="patient-filter" className="block text-sm font-medium text-gray-700">
                Patient
              </label>
              <select
                id="patient-filter"
                name="patient-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="tous">Tous les patients</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700">
                Période
              </label>
              <select
                id="date-filter"
                name="date-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="toutes">Toutes les dates</option>
                <option value="7j">7 derniers jours</option>
                <option value="30j">30 derniers jours</option>
                <option value="mois">Ce mois-ci</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des comptes rendus */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredComptesRendus.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredComptesRendus.map((cr) => (
              <li key={cr.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCircleIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{cr.title}</h3>
                          <p className="text-sm text-gray-500">
                            {cr.patientName} • {cr.type}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="text-sm text-gray-500">
                        {formatDate(cr.date)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {cr.content}
                    </p>
                  </div>
                  {cr.documents.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {cr.documents.map((doc, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <DocumentTextIcon className="mr-1 h-3 w-3" />
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-4 flex justify-end space-x-3">
                    <Link
                      to={`/medecin/comptes-rendus/${cr.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <EyeIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                      Voir
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ArrowDownTrayIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                      Télécharger
                    </button>
                    <Link
                      to={`/medecin/comptes-rendus/modifier/${cr.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PencilIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                      Modifier
                    </Link>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <TrashIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun compte rendu</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun compte rendu ne correspond à vos critères de recherche.
            </p>
            <div className="mt-6">
              <Link
                to="/medecin/comptes-rendus/nouveau"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Nouveau compte rendu
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComptesRendusDoctor;
