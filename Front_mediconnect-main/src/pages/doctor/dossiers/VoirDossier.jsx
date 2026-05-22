import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon, DocumentTextIcon, UserCircleIcon, CalendarIcon,
  ClipboardDocumentListIcon, DocumentMagnifyingGlassIcon,
  DocumentDuplicateIcon, ClipboardIcon, PlusIcon, PrinterIcon
} from '@heroicons/react/24/outline';
import api from '../../../services/api';

const VoirDossier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resume');
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        // Charger patients, RDV et prescriptions en parallèle
        const [patients, appts, prescs] = await Promise.all([
          api.getDoctorPatients(),
          api.getDoctorAppointments(),
          api.getPrescriptions(),
        ]);

        // Trouver le patient par id
        const found = patients.find(p => String(p.id) === String(id));
        if (!found) { setError('Patient introuvable.'); return; }
        setPatient(found);

        // Filtrer RDV et prescriptions pour ce patient
        setAppointments(appts.filter(a => String(a.patient) === String(id) ||
          String(a.patient_id) === String(id)));
        setPrescriptions(prescs.filter(p => String(p.patient) === String(id)));

      } catch (err) {
        setError('Erreur lors du chargement du dossier.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatDate = (d) => {
    if (!d) return 'N/A';
    return new Date(d).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      default: return 'En attente';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error || !patient) return (
    <div className="text-center py-12">
      <DocumentMagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{error || 'Dossier introuvable'}</h3>
      <div className="mt-6">
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
          Retour
        </button>
      </div>
    </div>
  );

  const lastAppt = appointments[0];
  const activePrescriptions = prescriptions.filter(p => p.status === 'active');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <nav className="flex mb-2">
            <button onClick={() => navigate('/medecin/dossiers')}
              className="text-sm text-gray-500 hover:text-gray-700">
              Dossiers
            </button>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-sm text-gray-700">{patient.name}</span>
          </nav>
          <h2 className="text-2xl font-bold text-gray-900">
            Dossier médical de {patient.name}
          </h2>
          <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-500">
            {patient.email && (
              <span className="flex items-center">
                <UserCircleIcon className="h-4 w-4 mr-1 text-gray-400" />
                {patient.email}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Link to={`/medecin/prescriptions/nouvelle`}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Nouvelle ordonnance
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'resume', label: 'Résumé' },
            { id: 'consultations', label: `Consultations (${appointments.length})` },
            { id: 'prescriptions', label: `Ordonnances (${prescriptions.length})` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Résumé */}
      {activeTab === 'resume' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Infos patient */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations patient</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nom complet</p>
                <p className="text-sm font-medium text-gray-900">{patient.name}</p>
              </div>
              {patient.email && (
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{patient.email}</p>
                </div>
              )}
              {patient.phone && (
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="text-sm font-medium text-gray-900">{patient.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Résumé activité */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Activité</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Consultations totales</span>
                <span className="text-lg font-bold text-blue-600">{appointments.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Ordonnances actives</span>
                <span className="text-lg font-bold text-green-600">{activePrescriptions.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Ordonnances totales</span>
                <span className="text-lg font-bold text-purple-600">{prescriptions.length}</span>
              </div>
              {lastAppt && (
                <div>
                  <p className="text-sm text-gray-500">Dernière consultation</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(lastAppt.date)} — {lastAppt.reason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Consultations */}
      {activeTab === 'consultations' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Historique des consultations</h3>
          </div>
          {appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CalendarIcon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              Aucune consultation enregistrée
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {appointments.map(appt => (
                <li key={appt.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">{appt.reason}</p>
                      <p className="text-sm text-gray-500">
                        {appt.type === 'video' ? 'Visioconférence' : 'Présentiel'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm text-gray-900">{formatDate(appt.date)} à {appt.time?.slice(0, 5)}</span>
                      <span className={`px-2 text-xs leading-5 font-semibold rounded-full ${getStatusBadge(appt.status)}`}>
                        {getStatusLabel(appt.status)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Tab Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Ordonnances</h3>
            <Link to="/medecin/prescriptions/nouvelle"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-1" />
              Nouvelle ordonnance
            </Link>
          </div>
          {prescriptions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <DocumentTextIcon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              Aucune ordonnance enregistrée
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {prescriptions.map(presc => (
                <li key={presc.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Ordonnance #{presc.id}
                      </p>
                      <p className="text-sm text-gray-500">{formatDate(presc.date)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 text-xs leading-5 font-semibold rounded-full ${
                        presc.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {presc.status === 'active' ? 'En cours' : 'Expirée'}
                      </span>
                      <Link to={`/medecin/prescriptions/modifier/${presc.id}`}
                        className="text-xs text-blue-600 hover:underline">
                        Modifier
                      </Link>
                    </div>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {presc.items.map(item => (
                      <li key={item.id} className="text-sm text-gray-700">
                        <span className="font-medium">{item.nom}</span> — {item.posologie} — {item.duree}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default VoirDossier;