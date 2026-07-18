import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon, ArrowDownTrayIcon, CalendarIcon,
  UserCircleIcon, ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const MedicalBooklet = () => {
  const [comptesRendus, setComptesRendus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getMyComptesRendus();
        setComptesRendus(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Impossible de charger vos carnets médicaux.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = async (cr) => {
    setDownloadingId(cr.id);
    try {
      await api.downloadCompteRenduPDF(cr.id, cr.patient_name?.split(' ').pop() || 'patient');
    } catch (err) {
      alert(err.message || 'Erreur lors du téléchargement.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon carnet médical</h1>
        <p className="mt-1 text-sm text-gray-500">
          Téléchargez les comptes-rendus de vos consultations, authentifiés et vérifiables.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">{error}</div>
      ) : comptesRendus.length === 0 ? (
        <div className="bg-white shadow sm:rounded-lg text-center py-16">
          <ClipboardDocumentCheckIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">Aucun carnet médical disponible</h3>
          <p className="mt-1 text-sm text-gray-500">
            Vos comptes-rendus apparaîtront ici après vos consultations.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {comptesRendus.map((cr) => (
              <li key={cr.id} className="hover:bg-gray-50 transition-colors">
                <div className="px-4 py-5 sm:px-6 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                      <DocumentTextIcon className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-base font-medium text-gray-900">
                        {cr.type_label || 'Consultation'}
                      </h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(cr.date).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <UserCircleIcon className="h-4 w-4" />
                          {cr.doctor_name}
                        </span>
                      </div>
                      {cr.motif && (
                        <p className="mt-1 text-sm text-gray-400 truncate max-w-md">{cr.motif}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(cr)}
                    disabled={downloadingId === cr.id}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
                  >
                    {downloadingId === cr.id ? (
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

export default MedicalBooklet;