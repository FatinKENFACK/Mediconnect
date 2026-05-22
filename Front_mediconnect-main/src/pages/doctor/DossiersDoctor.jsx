import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCircleIcon, MagnifyingGlassIcon, DocumentTextIcon,
  CalendarIcon, EnvelopeIcon, PhoneIcon, PlusIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const DossiersDoctor = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nom');

  useEffect(() => {
    api.getDoctorPatients()
      .then(data => setPatients(data))
      .catch(() => setError('Erreur lors du chargement des patients.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients
    .filter(p => {
      const s = searchTerm.toLowerCase();
      return (p.name || '').toLowerCase().includes(s) ||
             (p.email || '').toLowerCase().includes(s) ||
             (p.phone || '').includes(s);
    })
    .sort((a, b) => {
      if (sortBy === 'nom') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dossiers patients</h1>
          <p className="mt-1 text-sm text-gray-500">Gérez les dossiers médicaux de vos patients</p>
        </div>
        <Link to="/medecin/creer-patient"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Nouveau patient
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      {/* Filtres */}
      <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rechercher un patient</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Nom, email ou téléphone"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Trier par</label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="nom">Nom (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun patient trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">Aucun patient ne correspond à vos critères.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtered.map(patient => (
              <li key={patient.id} className="hover:bg-gray-50">
                <Link to={`/medecin/dossiers/${patient.id}`} className="block">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCircleIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-blue-600">{patient.name}</div>
                          <div className="text-sm text-gray-500">Patient</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">Voir le dossier →</div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4">
                      {patient.email && (
                        <div className="flex items-center text-sm text-gray-500">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                          {patient.email}
                        </div>
                      )}
                      {patient.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <PhoneIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                          {patient.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DossiersDoctor;