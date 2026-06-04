import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon, PrinterIcon, ArrowDownTrayIcon,
  UserCircleIcon, CalendarIcon
} from '@heroicons/react/24/outline';
import api from '../../../services/api';

const VoirCompteRendu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cr, setCr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getCompteRendu(id)
      .then(setCr)
      .catch(() => setError('Compte rendu introuvable.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    if (!cr) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Compte Rendu #${cr.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        h1 { color: #1d4ed8; }
        h2 { color: #374151; font-size: 16px; margin-top: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
        p { font-size: 14px; color: #374151; }
        .footer { margin-top: 60px; text-align: right; }
      </style></head><body>
      <h1>Compte Rendu Médical #${cr.id}</h1>
      <p><strong>Patient :</strong> ${cr.patient_name}</p>
      <p><strong>Médecin :</strong> ${cr.doctor_name}</p>
      <p><strong>Date :</strong> ${new Date(cr.date).toLocaleDateString('fr-FR')}</p>
      <p><strong>Type :</strong> ${cr.type_label}</p>
      <p><strong>Motif :</strong> ${cr.motif}</p>
      ${cr.observations ? `<h2>Observations</h2><p>${cr.observations}</p>` : ''}
      ${cr.diagnostic ? `<h2>Diagnostic</h2><p>${cr.diagnostic}</p>` : ''}
      ${cr.traitement ? `<h2>Traitement</h2><p>${cr.traitement}</p>` : ''}
      ${cr.recommandations ? `<h2>Recommandations</h2><p>${cr.recommandations}</p>` : ''}
      <div class="footer"><p>Signature du médecin</p><br/><br/>___________________</div>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error || !cr) return (
    <div className="text-center py-12">
      <p className="text-gray-500">{error || 'Introuvable'}</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 hover:underline text-sm">Retour</button>
    </div>
  );

  const sections = [
    { label: 'Observations médicales', value: cr.observations },
    { label: 'Diagnostic', value: cr.diagnostic },
    { label: 'Traitement prescrit', value: cr.traitement },
    { label: 'Recommandations', value: cr.recommandations },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />Retour aux comptes rendus
        </button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compte rendu médical</h1>
            <p className="mt-1 text-sm text-gray-500">Numéro : #{cr.id}</p>
          </div>
          <div className="flex space-x-3">
            <button onClick={handlePrint}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <PrinterIcon className="h-4 w-4 mr-1.5" />Imprimer
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Infos générales */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Informations générales</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                {new Date(cr.date).toLocaleDateString('fr-FR')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{cr.type_label}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Motif</dt>
              <dd className="mt-1 text-sm text-gray-900">{cr.motif}</dd>
            </div>
          </div>
        </div>

        {/* Patient */}
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Patient</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <UserCircleIcon className="h-12 w-12 text-gray-400 mr-4" />
            <div>
              <h4 className="text-lg font-medium text-gray-900">{cr.patient_name}</h4>
              <p className="text-sm text-gray-500">Médecin : {cr.doctor_name}</p>
            </div>
          </div>
        </div>

        {/* Sections médicales */}
        {sections.map(s => s.value ? (
          <div key={s.label}>
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{s.label}</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-sm text-gray-900 whitespace-pre-line">{s.value}</p>
            </div>
          </div>
        ) : null)}

        <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50 text-right">
          <button onClick={() => navigate(-1)}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
            Retour
          </button>
          <button onClick={() => navigate(`/medecin/comptes-rendus/modifier/${id}`)}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoirCompteRendu;