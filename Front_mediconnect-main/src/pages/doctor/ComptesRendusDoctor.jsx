import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon, UserCircleIcon, CalendarIcon,
  MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const ComptesRendusDoctor = () => {
  const [comptesRendus, setComptesRendus] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('tous');
  const [dateFilter, setDateFilter] = useState('toutes');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [crs, pts] = await Promise.all([
          api.getComptesRendus(),
          api.getDoctorPatients(),
        ]);
        setComptesRendus(crs);
        setPatients(pts);
      } catch {
        setError('Erreur lors du chargement des comptes rendus.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce compte rendu ?')) return;
    setDeleting(id);
    try {
      await api.deleteCompteRendu(id);
      setComptesRendus(prev => prev.filter(cr => cr.id !== id));
    } catch {
      alert('Erreur lors de la suppression.');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = comptesRendus.filter(cr => {
    const s = searchTerm.toLowerCase();
    const matchSearch = s === '' ||
      (cr.motif || '').toLowerCase().includes(s) ||
      (cr.patient_name || '').toLowerCase().includes(s) ||
      (cr.observations || '').toLowerCase().includes(s);

    const matchPatient = selectedPatient === 'tous' ||
      String(cr.patient) === selectedPatient;

    const now = Date.now();
    const crDate = new Date(cr.date).getTime();
    const matchDate =
      dateFilter === 'toutes' ? true :
      dateFilter === '7j' ? crDate >= now - 7 * 86400000 :
      dateFilter === '30j' ? crDate >= now - 30 * 86400000 :
      dateFilter === 'mois' ? cr.date?.startsWith(new Date().toISOString().substring(0, 7)) :
      true;

    return matchSearch && matchPatient && matchDate;
  });

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric'
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
          <h1 className="text-2xl font-bold text-gray-900">Comptes rendus médicaux</h1>
          <p className="mt-1 text-sm text-gray-500">Consultez et gérez les comptes rendus de vos patients</p>
        </div>
        <Link to="/medecin/comptes-rendus/nouveau"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Nouveau compte rendu
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      {/* Filtres */}
      <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rechercher</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Patient, motif ou observations"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient</label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedPatient}
              onChange={e => setSelectedPatient(e.target.value)}
            >
              <option value="tous">Tous les patients</option>
              {patients.map(p => (
                <option key={p.id} value={String(p.id)}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Période</label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
            >
              <option value="toutes">Toutes les dates</option>
              <option value="7j">7 derniers jours</option>
              <option value="30j">30 derniers jours</option>
              <option value="mois">Ce mois-ci</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun compte rendu</h3>
            <p className="mt-1 text-sm text-gray-500">Aucun compte rendu ne correspond à vos critères.</p>
            <div className="mt-6">
              <Link to="/medecin/comptes-rendus/nouveau"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Nouveau compte rendu
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtered.map(cr => (
              <li key={cr.id} className="hover:bg-gray-50 px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserCircleIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{cr.motif}</h3>
                      <p className="text-sm text-gray-500">
                        {cr.patient_name} • {cr.type_label}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{formatDate(cr.date)}</div>
                </div>

                {cr.observations && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 line-clamp-2">{cr.observations}</p>
                  </div>
                )}

                <div className="mt-4 flex justify-end space-x-3">
                  <Link to={`/medecin/comptes-rendus/${cr.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <EyeIcon className="h-4 w-4 mr-1.5" />Voir
                  </Link>
                  <Link to={`/medecin/comptes-rendus/modifier/${cr.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <PencilIcon className="h-4 w-4 mr-1.5" />Modifier
                  </Link>
                  <button onClick={() => handleDelete(cr.id)} disabled={deleting === cr.id}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50">
                    <TrashIcon className="h-4 w-4 mr-1.5" />
                    {deleting === cr.id ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ComptesRendusDoctor;