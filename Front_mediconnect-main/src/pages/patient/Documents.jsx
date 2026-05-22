import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  MagnifyingGlassIcon as SearchIcon,
  FunnelIcon as FilterIcon,
  PlusIcon,
  DocumentChartBarIcon as DocumentReportIcon,
  PhotoIcon as PhotographIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Alias pour la compatibilité
const DocumentIcon = DocumentTextIcon;
const DownloadIcon = ArrowDownTrayIcon;

const Documents = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importedFiles, setImportedFiles] = useState([]);
  
  // Données factices pour les documents
  const documents = [
    {
      id: 1,
      name: 'Compte-rendu consultation du 15/12/2023',
      type: 'Compte-rendu',
      date: '15/12/2023',
      size: '2.4 MB',
      category: 'consultations',
      doctor: 'Dr. Martin Dupont',
      format: 'PDF'
    },
    {
      id: 2,
      name: 'Résultats analyse sanguine',
      type: 'Résultats de laboratoire',
      date: '10/12/2023',
      size: '1.8 MB',
      category: 'analyses',
      doctor: 'Laboratoire Biomédical',
      format: 'PDF'
    },
    {
      id: 3,
      name: 'Radiographie du genou droit',
      type: 'Imagerie médicale',
      date: '05/12/2023',
      size: '4.7 MB',
      category: 'imagerie',
      doctor: 'Dr. Sophie Martin',
      format: 'DICOM'
    },
    {
      id: 4,
      name: 'Ordonnance du 01/12/2023',
      type: 'Ordonnance',
      date: '01/12/2023',
      size: '1.2 MB',
      category: 'ordonnances',
      doctor: 'Dr. Martin Dupont',
      format: 'PDF'
    },
    {
      id: 5,
      name: 'Échographie abdominale',
      type: 'Imagerie médicale',
      date: '20/11/2023',
      size: '3.5 MB',
      category: 'imagerie',
      doctor: 'Dr. Jean Lefebvre',
      format: 'DICOM'
    },
    {
      id: 6,
      name: 'Compte-rendu opératoire',
      type: 'Compte-rendu',
      date: '10/11/2023',
      size: '2.1 MB',
      category: 'consultations',
      doctor: 'Dr. Sophie Martin',
      format: 'PDF'
    },
  ];

  const filters = [
    { id: 'all', name: 'Tous les documents', count: documents.length },
    { id: 'consultations', name: 'Comptes-rendus', count: documents.filter(doc => doc.category === 'consultations').length },
    { id: 'analyses', name: 'Analyses', count: documents.filter(doc => doc.category === 'analyses').length },
    { id: 'imagerie', name: 'Imagerie', count: documents.filter(doc => doc.category === 'imagerie').length },
    { id: 'ordonnances', name: 'Ordonnances', count: documents.filter(doc => doc.category === 'ordonnances').length },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = activeFilter === 'all' || doc.category === activeFilter;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleDocumentSelection = (id) => {
    setSelectedDocuments(prev => 
      prev.includes(id) 
        ? prev.filter(docId => docId !== id)
        : [...prev, id]
    );
  };

  const selectAllDocuments = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'Résultats de laboratoire':
        return <DocumentReportIcon className="h-5 w-5 text-blue-500" />;
      case 'Imagerie médicale':
        return <PhotographIcon className="h-5 w-5 text-green-500" />;
      case 'Ordonnance':
        return <DocumentDuplicateIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <DocumentIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents médicaux</h1>
          <p className="mt-1 text-sm text-gray-500">
            Consultez et gérez tous vos documents médicaux en un seul endroit
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            type="button"
            onClick={() => navigate('/patient/documents/nouveau')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Nouveau document
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Importer
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                file,
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type.split('/').pop().toUpperCase(),
                date: new Date().toLocaleDateString(),
                status: 'Nouveau'
              }));
              setImportedFiles(files);
              setShowImportDialog(true);
            }}
          />
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Rechercher
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Rechercher un document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FilterIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  id="filter"
                  name="filter"
                  className="focus:ring-primary-500 focus:border-primary-500 h-full py-0 pl-10 pr-8 border-gray-300 bg-transparent text-gray-500 sm:text-sm rounded-md"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                >
                  {filters.map((filter) => (
                    <option key={filter.id} value={filter.id}>
                      {filter.name} ({filter.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="select-all"
                name="select-all"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={selectedDocuments.length > 0 && selectedDocuments.length === filteredDocuments.length}
                onChange={selectAllDocuments}
              />
              <label htmlFor="select-all" className="ml-2 text-sm text-gray-700">
                {selectedDocuments.length > 0 
                  ? `${selectedDocuments.length} sélectionné${selectedDocuments.length > 1 ? 's' : ''}` 
                  : 'Tout sélectionner'}
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md ${
                  selectedDocuments.length > 0 ? 'text-gray-700 bg-white' : 'text-gray-300 bg-gray-50 cursor-not-allowed'
                }`}
                disabled={selectedDocuments.length === 0}
              >
                <DownloadIcon className="-ml-0.5 mr-2 h-4 w-4" />
                Télécharger
              </button>
              <button
                type="button"
                className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md ${
                  selectedDocuments.length > 0 ? 'text-white bg-red-600 hover:bg-red-700' : 'text-gray-300 bg-gray-200 cursor-not-allowed'
                }`}
                disabled={selectedDocuments.length === 0}
              >
                <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden">
          {filteredDocuments.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <li key={document.id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center">
                      <input
                        id={`document-${document.id}`}
                        name={`document-${document.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={selectedDocuments.includes(document.id)}
                        onChange={() => toggleDocumentSelection(document.id)}
                      />
                      <div className="ml-4 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          {getDocumentIcon(document.type)}
                        </div>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-primary-600 truncate">
                            {document.name}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {document.format}
                            </p>
                          </div>
                        </div>
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <DocumentTextIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {document.type}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <UserIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {document.doctor}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {document.date}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <button
                          type="button"
                          className="inline-flex items-center p-1.5 border border-gray-300 rounded-full shadow-sm text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          title="Télécharger"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-gray-400 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="Supprimer"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery 
                  ? 'Aucun document ne correspond à votre recherche.'
                  : activeFilter === 'all'
                    ? 'Commencez par importer vos premiers documents.'
                    : `Aucun document dans la catégorie "${filters.find(f => f.id === activeFilter)?.name || ''}".`}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Importer des documents
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'importation */}
      {showImportDialog && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Importer des documents
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Les fichiers suivants seront importés dans votre espace documents :
                    </p>
                    <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                      {importedFiles.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-3">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.size} • {file.type}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setImportedFiles(importedFiles.filter(f => f.id !== file.id));
                            }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                  onClick={() => {
                    // Ici, vous pouvez ajouter la logique pour traiter les fichiers
                    console.log('Fichiers à importer :', importedFiles);
                    // Rediriger vers la page de nouveau document avec les fichiers présélectionnés
                    navigate('/patient/documents/nouveau', { 
                      state: { importedFiles } 
                    });
                    setShowImportDialog(false);
                  }}
                >
                  Importer {importedFiles.length} fichier{importedFiles.length > 1 ? 's' : ''}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => {
                    setShowImportDialog(false);
                    setImportedFiles([]);
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fonction utilitaire pour formater la taille des fichiers
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default Documents;
