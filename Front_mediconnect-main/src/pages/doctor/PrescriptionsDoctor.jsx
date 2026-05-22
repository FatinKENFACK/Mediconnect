import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon, UserCircleIcon, CalendarIcon,
  MagnifyingGlassIcon, PlusIcon, PrinterIcon,
  CheckCircleIcon, XCircleIcon, PencilIcon, TrashIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const PrescriptionsDoctor = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState('all');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [presData, patientsData] = await Promise.all([
        api.getPrescriptions(),
        api.getDoctorPatients(),
      ]);
      setPrescriptions(presData);
      setPatients(patientsData);
    } catch (err) {
      setError('Erreur lors du chargement des ordonnances.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette ordonnance ?')) return;
    setDeleting(id);
    try {
      await api.deletePrescription(id);
      setPrescriptions(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Erreur lors de la suppression.');
    } finally {
      setDeleting(null);
    }
  };

  const handlePrint = (prescription) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Ordonnance #${prescription.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #1d4ed8; } 
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
        th { background: #f3f4f6; }
        .footer { margin-top: 60px; text-align: right; }
      </style></head><body>
      <h1>Ordonnance Médicale</h1>
      <p><strong>Patient :</strong> ${prescription.patient_name}</p>
      <p><strong>Date :</strong> ${formatDate(prescription.date)}</p>
      <p><strong>Médecin :</strong> ${prescription.doctor_name}</p>
      <table>
        <thead><tr><th>Médicament</th><th>Posologie</th><th>Durée</th></tr></thead>
        <tbody>
          ${prescription.items.map(i => `<tr><td>${i.nom}</td><td>${i.posologie}</td><td>${i.duree}</td></tr>`).join('')}
        </tbody>
      </table>
      ${prescription.notes ? `<p><strong>Instructions :</strong> ${prescription.notes}</p>` : ''}
      <div class="footer"><p>Signature du médecin</p><br/><br/>___________________</div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const filtered = prescriptions.filter(p => {
    const matchSearch = searchTerm === '' ||
      p.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.notes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.items.some(i => i.nom.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchPatient = selectedPatient === 'all' || String(p.patient) === selectedPatient;
    return matchSearch && matchStatus && matchPatient;
  });

  const formatDate = (d) => new Date(d).toLocaleDateString('fr-FR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const getStatusBadge = (status) => {
    if (status === 'active') return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircleIcon className="h-3.5 w-3.5 mr-1 text-green-500" />En cours
      </span>
    );
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <XCircleIcon className="h-3.5 w-3.5 mr-1 text-gray-500" />Expirée
      </span>
    );
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Ordonnances</h1>
          <p className="mt-1 text-sm text-gray-500">Gérez et créez des ordonnances pour vos patients</p>
        </div>
        <Link
          to="/medecin/prescriptions/nouvelle"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Nouvelle ordonnance
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
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Patient ou médicament"
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
              <option value="all">Tous les patients</option>
              {patients.map(p => (
                <option key={p.id} value={String(p.id)}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">En cours</option>
              <option value="expired">Expirées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune ordonnance</h3>
            <p className="mt-1 text-sm text-gray-500">Aucune ordonnance ne correspond à vos critères.</p>
            <div className="mt-6">
              <Link to="/medecin/prescriptions/nouvelle"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />Nouvelle ordonnance
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtered.map(prescription => (
              <li key={prescription.id} className="hover:bg-gray-50 px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserCircleIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{prescription.patient_name}</h3>
                      <div className="flex items-center mt-1">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                        <span className="text-sm text-gray-500">{formatDate(prescription.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div>{getStatusBadge(prescription.status)}</div>
                </div>

                {/* Médicaments */}
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Médicaments prescrits :</h4>
                  <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                    {prescription.items.map(item => (
                      <li key={item.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="font-medium">{item.nom}</span>
                          <span className="text-gray-500 ml-2">{item.posologie}</span>
                        </div>
                        <span className="text-gray-500">{item.duree}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {prescription.notes && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium text-gray-700">Instructions :</h4>
                    <p className="mt-1 text-sm text-gray-600">{prescription.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => handlePrint(prescription)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PrinterIcon className="h-4 w-4 mr-1.5" />Imprimer
                  </button>
                  <Link
                    to={`/medecin/prescriptions/modifier/${prescription.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PencilIcon className="h-4 w-4 mr-1.5" />Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(prescription.id)}
                    disabled={deleting === prescription.id}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-1.5" />
                    {deleting === prescription.id ? 'Suppression...' : 'Supprimer'}
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

export default PrescriptionsDoctor;