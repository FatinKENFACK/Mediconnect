import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  FolderIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  CalendarIcon,
  DocumentTextIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  PlusIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const HospitalMedicalRecords = () => {
  const [records, setRecords]                 = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [searchQuery, setSearchQuery]         = useState('');
  const [filterStatus, setFilterStatus]       = useState('all');
  const [filterDoctor, setFilterDoctor]       = useState('all');
  const [selectedRecord, setSelectedRecord]   = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const loadRecords = async () => {
      setLoading(true);
      try {
        const data = await api.getHospitalPatientRecords();
        setRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur chargement dossiers:', err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    loadRecords();
  }, []);

  // ============================================================
  // FILTRAGE —  sécurisé avec optional chaining
  // ============================================================
  const filteredRecords = records.filter(record => {
    const patientName  = record.patient?.name  || record.patient_name  || '';
    const patientEmail = record.patient?.email || record.patient_email || '';
    const service      = record.service || '';

    const matchesSearch =
      patientName.toLowerCase().includes(searchQuery.toLowerCase())  ||
      patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesDoctor = filterDoctor === 'all' || record.doctor === filterDoctor;

    return matchesSearch && matchesStatus && matchesDoctor;
  });

  // ============================================================
  // STATS —  documents?.length sécurisé
  // ============================================================
  const stats = {
    total:          records.length,
    active:         records.filter(r => r.status === 'active').length,
    archived:       records.filter(r => r.status === 'archived').length,
    totalDocuments: records.reduce((sum, r) => sum + (r.documents?.length || 0), 0),
  };

  // ============================================================
  // HELPERS
  // ============================================================
  const getStatusBadge = (status) => {
    const config = {
      active:    { color: 'bg-green-100 text-green-800', label: 'Actif' },
      archived:  { color: 'bg-gray-100 text-gray-800',   label: 'Archivé' },
      emergency: { color: 'bg-red-100 text-red-800',     label: 'Urgence' },
    };
    const c = config[status] || config.active;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>
        {c.label}
      </span>
    );
  };

  const getDocumentIcon = (type) => {
    const map = {
      consultation: DocumentTextIcon,
      analysis:     DocumentTextIcon,
      prescription: DocumentTextIcon,
      certificate:  ShieldCheckIcon,
      vaccination:  CheckCircleIcon,
      radiology:    DocumentTextIcon,
      report:       DocumentTextIcon,
      followup:     ClockIcon,
    };
    return map[type] || DocumentTextIcon;
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="p-6">

      {/* ====== HEADER ====== */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dossiers médicaux</h1>
          <p className="text-gray-600 mt-2">Consultez les dossiers médicaux des patients</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouveau dossier
        </button>
      </div>

      {/* ====== STATS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total dossiers',    value: stats.total,          color: 'bg-blue-500',   icon: FolderIcon },
          { label: 'Dossiers actifs',   value: stats.active,         color: 'bg-green-500',  icon: CheckCircleIcon },
          { label: 'Dossiers archivés', value: stats.archived,       color: 'bg-gray-500',   icon: ClockIcon },
          { label: 'Total documents',   value: stats.totalDocuments, color: 'bg-purple-500', icon: DocumentTextIcon },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ====== FILTRES ====== */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un dossier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="archived">Archivé</option>
            <option value="emergency">Urgence</option>
          </select>
        </div>
      </div>

      {/* ====== LISTE DOSSIERS ====== */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FolderIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">
            {records.length === 0
              ? 'Aucun dossier médical pour le moment.'
              : 'Aucun dossier ne correspond à votre recherche.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record) => {
            //  Accès sécurisés à patient
            const patientName     = record.patient?.name     || record.patient_name     || 'Patient';
            const patientDob      = record.patient?.dateOfBirth || record.patient_dob   || '—';
            const patientBlood    = record.patient?.bloodType   || record.blood_type    || '—';
            const allergies       = record.patient?.allergies       || [];
            const chronicDiseases = record.patient?.chronicDiseases || [];
            const documents       = record.documents || [];

            return (
              <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <UserCircleIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-base font-semibold text-gray-900">{patientName}</h3>
                      <p className="text-xs text-gray-500">{patientDob}</p>
                      <p className="text-xs text-gray-500">Groupe : {patientBlood}</p>
                    </div>
                  </div>
                  {getStatusBadge(record.status)}
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <UserCircleIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    {record.doctor || '—'}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    Dernière visite : {record.lastVisit || record.last_visit || '—'}
                  </div>
                  <div className="flex items-center gap-2">
                    <DocumentTextIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    {documents.length} document{documents.length > 1 ? 's' : ''}
                  </div>
                </div>

                {/*  Allergies — sécurisé */}
                {allergies.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-1">Allergies</h4>
                    <div className="flex flex-wrap gap-1">
                      {allergies.map((a, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/*  Maladies chroniques — sécurisé */}
                {chronicDiseases.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-gray-700 mb-1">Maladies chroniques</h4>
                    <div className="flex flex-wrap gap-1">
                      {chronicDiseases.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleViewDetails(record)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Voir détails
                  </button>
                  <button className="p-1.5 text-gray-500 hover:text-gray-700">
                    <DocumentArrowDownIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ====== MODAL DÉTAILS ====== */}
      {showDetailsModal && selectedRecord && (() => {
        const patientName     = selectedRecord.patient?.name        || selectedRecord.patient_name  || 'Patient';
        const patientEmail    = selectedRecord.patient?.email       || selectedRecord.patient_email || '—';
        const patientPhone    = selectedRecord.patient?.phone       || selectedRecord.patient_phone || '—';
        const patientDob      = selectedRecord.patient?.dateOfBirth || selectedRecord.patient_dob   || '—';
        const patientBlood    = selectedRecord.patient?.bloodType   || selectedRecord.blood_type    || '—';
        const vitalSigns      = selectedRecord.vitalSigns           || {};
        const treatments      = selectedRecord.treatments           || [];
        const documents       = selectedRecord.documents            || [];

        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Dossier médical — {patientName}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Infos patient */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-base font-semibold text-gray-900 mb-3">Informations patient</h4>
                  <dl className="space-y-2 text-sm">
                    {[
                      ['Nom',             patientName],
                      ['Email',           patientEmail],
                      ['Téléphone',       patientPhone],
                      ['Date naissance',  patientDob],
                      ['Groupe sanguin',  patientBlood],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-gray-500 font-medium">{label} :</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </dl>
                </div>

                {/* Infos médicales */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-base font-semibold text-gray-900 mb-3">Informations médicales</h4>
                  <dl className="space-y-2 text-sm">
                    {[
                      ['Médecin',        selectedRecord.doctor      || '—'],
                      ['Service',        selectedRecord.service     || '—'],
                      ['Dernière visite',selectedRecord.lastVisit   || selectedRecord.last_visit || '—'],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-gray-500 font-medium">{label} :</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Statut :</span>
                      {getStatusBadge(selectedRecord.status)}
                    </div>
                  </dl>
                </div>

                {/* Signes vitaux */}
                {Object.keys(vitalSigns).length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-base font-semibold text-gray-900 mb-3">Signes vitaux</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {vitalSigns.bloodPressure && (
                        <div>
                          <span className="text-gray-500 text-xs">Pression artérielle</span>
                          <p className="font-medium">{vitalSigns.bloodPressure}</p>
                        </div>
                      )}
                      {vitalSigns.heartRate && (
                        <div>
                          <span className="text-gray-500 text-xs">Fréq. cardiaque</span>
                          <p className="font-medium">{vitalSigns.heartRate} bpm</p>
                        </div>
                      )}
                      {vitalSigns.weight && (
                        <div>
                          <span className="text-gray-500 text-xs">Poids</span>
                          <p className="font-medium">{vitalSigns.weight}</p>
                        </div>
                      )}
                      {vitalSigns.height && (
                        <div>
                          <span className="text-gray-500 text-xs">Taille</span>
                          <p className="font-medium">{vitalSigns.height}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Traitements */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-base font-semibold text-gray-900 mb-3">Traitements en cours</h4>
                  {treatments.length > 0 ? (
                    <div className="space-y-2">
                      {treatments.map((t, i) => (
                        <div key={i} className="border-l-4 border-blue-400 pl-3 text-sm">
                          <p className="font-medium text-gray-900">{t.name}</p>
                          <p className="text-gray-600">{t.dosage}</p>
                          {t.started && <p className="text-xs text-gray-400">Début : {t.started}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Aucun traitement en cours</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedRecord.notes && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-base font-semibold text-gray-900 mb-2">Notes médicales</h4>
                  <p className="text-sm text-gray-700">{selectedRecord.notes}</p>
                </div>
              )}

              {/* Documents — sécurisé */}
              {documents.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-base font-semibold text-gray-900 mb-3">Documents</h4>
                  <div className="space-y-2">
                    {documents.map((doc, i) => {
                      const IconComponent = getDocumentIcon(doc.type);
                      return (
                        <div key={doc.id || i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.date}</p>
                            </div>
                          </div>
                          <button className="p-1.5 text-blue-600 hover:text-blue-800">
                            <DocumentArrowDownIcon className="h-5 w-5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default HospitalMedicalRecords;