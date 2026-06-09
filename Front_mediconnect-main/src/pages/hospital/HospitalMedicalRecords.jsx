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
  FilterIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const HospitalMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  
 
  useEffect(() => {
    const loadRecords = async () => {
      try {
        const data = await api.getHospitalPatientRecords();
        setRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur chargement dossiers:', err);
        setRecords([]);
      }
    };
    loadRecords();
  }, []);

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesDoctor = filterDoctor === 'all' || record.doctor === filterDoctor;

    return matchesSearch && matchesStatus && matchesDoctor;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Actif' },
      archived: { color: 'bg-gray-100 text-gray-800', label: 'Archivé' },
      emergency: { color: 'bg-red-100 text-red-800', label: 'Urgence' }
    };

    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getDocumentIcon = (type) => {
    const iconMap = {
      consultation: DocumentTextIcon,
      analysis: DocumentTextIcon,
      prescription: DocumentTextIcon,
      certificate: ShieldCheckIcon,
      vaccination: CheckCircleIcon,
      radiology: DocumentTextIcon,
      report: DocumentTextIcon,
      followup: ClockIcon
    };
    return iconMap[type] || DocumentTextIcon;
  };

  const stats = {
    total: records.length,
    active: records.filter(r => r.status === 'active').length,
    archived: records.filter(r => r.status === 'archived').length,
    totalDocuments: records.reduce((sum, r) => sum + r.documents.length, 0)
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleDownloadDocument = (document) => {
    // Simuler le téléchargement
    console.log('Téléchargement du document:', document.name);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dossiers médicaux</h1>
            <p className="text-gray-600 mt-2">Consultez les dossiers médicaux des patients</p>
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouveau dossier
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FolderIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total dossiers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dossiers actifs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-gray-500 p-3 rounded-lg">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Dossiers archivés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.archived}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total documents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{record.patient.name}</h3>
                  <p className="text-sm text-gray-600">{record.patient.dateOfBirth}</p>
                  <p className="text-sm text-gray-600">Groupe: {record.patient.bloodType}</p>
                </div>
              </div>
              {getStatusBadge(record.status)}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <UserCircleIcon className="h-4 w-4 mr-2 text-gray-400" />
                {record.doctor}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                Dernière visite: {record.lastVisit}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DocumentTextIcon className="h-4 w-4 mr-2 text-gray-400" />
                {record.documents.length} documents
              </div>
            </div>

            {/* Allergies */}
            {record.patient.allergies.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Allergies</h4>
                <div className="flex flex-wrap gap-1">
                  {record.patient.allergies.map((allergy, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Chronic Diseases */}
            {record.patient.chronicDiseases.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Maladies chroniques</h4>
                <div className="flex flex-wrap gap-1">
                  {record.patient.chronicDiseases.map((disease, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      {disease}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                onClick={() => handleViewDetails(record)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Voir détails
              </button>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-800">
                  <DocumentArrowDownIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-medium text-gray-900 mb-6">Dossier médical - {selectedRecord.patient.name}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Informations patient</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Nom:</span>
                    <span className="text-sm text-gray-900">{selectedRecord.patient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <span className="text-sm text-gray-900">{selectedRecord.patient.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Téléphone:</span>
                    <span className="text-sm text-gray-900">{selectedRecord.patient.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Date de naissance:</span>
                    <span className="text-sm text-gray-900">{selectedRecord.patient.dateOfBirth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Groupe sanguin:</span>
                    <span className="text-sm text-gray-900">{selectedRecord.patient.bloodType}</span>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Informations médicales</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Médecin:</span>
                    <span className="text-sm text-gray-900">{selectedRecord.doctor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Service:</span>
                    <span className="text-sm text-gray-900">{selectedRecord.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Dernière visite:</span>
                    <span className="text-sm text-gray-900">{selectedRecord.lastVisit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Statut:</span>
                    {getStatusBadge(selectedRecord.status)}
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Signes vitaux</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Pression artérielle:</span>
                    <p className="text-sm text-gray-900">{selectedRecord.vitalSigns.bloodPressure}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Fréquence cardiaque:</span>
                    <p className="text-sm text-gray-900">{selectedRecord.vitalSigns.heartRate} bpm</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Poids:</span>
                    <p className="text-sm text-gray-900">{selectedRecord.vitalSigns.weight}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Taille:</span>
                    <p className="text-sm text-gray-900">{selectedRecord.vitalSigns.height}</p>
                  </div>
                </div>
              </div>

              {/* Treatments */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Traitements en cours</h4>
                {selectedRecord.treatments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRecord.treatments.map((treatment, index) => (
                      <div key={index} className="border-l-4 border-blue-400 pl-3">
                        <p className="text-sm font-medium text-gray-900">{treatment.name}</p>
                        <p className="text-sm text-gray-600">{treatment.dosage}</p>
                        <p className="text-xs text-gray-500">Début: {treatment.started}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Aucun traitement en cours</p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-2">Notes médicales</h4>
              <p className="text-sm text-gray-700">{selectedRecord.notes}</p>
            </div>

            {/* Documents */}
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Documents</h4>
              <div className="space-y-2">
                {selectedRecord.documents.map((doc) => {
                  const IconComponent = getDocumentIcon(doc.type);
                  return (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <IconComponent className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.date}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownloadDocument(doc)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                      >
                        <DocumentArrowDownIcon className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalMedicalRecords;
