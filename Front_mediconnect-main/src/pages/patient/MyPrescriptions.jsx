import React, { useState, useEffect } from 'react';
import {
  ClipboardDocumentListIcon, ArrowDownTrayIcon, CalendarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const statusStyles = {
  active:    'bg-emerald-100 text-emerald-800',
  expired:   'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-800',
};
const statusLabels = {
  active: 'Active',
  expired: 'Expirée',
  cancelled: 'Annulée',
};

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getMyPrescriptions();
        setPrescriptions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Impossible de charger vos ordonnances.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = async (p) => {
    setDownloadingId(p.id);
    try {
      await api.downloadPrescriptionPDF(p.id, p.patient_name?.split(' ').pop() || 'patient');
    } catch (err) {
      alert(err.message || 'Erreur lors du téléchargement.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mes ordonnances</h1>
        <p className="mt-1 text-sm text-gray-500">
          Téléchargez vos ordonnances, authentifiées et vérifiables par un pharmacien.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">{error}</div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white shadow sm:rounded-lg text-center py-16">
          <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">Aucune ordonnance disponible</h3>
          <p className="mt-1 text-sm text-gray-500">
            Vos ordonnances apparaîtront ici après vos consultations.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {prescriptions.map((p) => (
              <li key={p.id} className="hover:bg-gray-50 transition-colors">
                <div className="px-4 py-5 sm:px-6 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
                        Ordonnance #{p.id}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[p.status] || 'bg-gray-100 text-gray-600'}`}>
                          {statusLabels[p.status] || p.status}
                        </span>
                      </h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(p.date).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <UserCircleIcon className="h-4 w-4" />
                          {p.doctor_name}
                        </span>
                      </div>
                      {p.items && p.items.length > 0 && (
                        <p className="mt-1 text-sm text-gray-400">
                          {p.items.length} médicament{p.items.length > 1 ? 's' : ''} prescrit{p.items.length > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(p)}
                    disabled={downloadingId === p.id}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {downloadingId === p.id ? (
                      <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                    ) : (
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    )}
                    Télécharger le PDF
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyPrescriptions;