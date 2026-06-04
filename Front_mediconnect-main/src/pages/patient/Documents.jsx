import React, { useState, useEffect, useRef } from 'react';
import {
  DocumentTextIcon, ArrowDownTrayIcon, TrashIcon,
  MagnifyingGlassIcon, FunnelIcon, PlusIcon,
  DocumentChartBarIcon, PhotoIcon, DocumentDuplicateIcon,
  ClockIcon, UserIcon, XMarkIcon, CheckIcon, ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const FILTERS = [
  { id: 'all', name: 'Tous les documents' },
  { id: 'analyse', name: 'Analyses' },
  { id: 'imagerie', name: 'Imagerie' },
  { id: 'ordonnance', name: 'Ordonnances' },
  { id: 'compte_rendu', name: 'Comptes-rendus' },
  { id: 'autre', name: 'Autres' },
];

const getDocumentIcon = (type) => {
  switch (type) {
    case 'analyse': return <DocumentChartBarIcon className="h-5 w-5 text-blue-500" />;
    case 'imagerie': return <PhotoIcon className="h-5 w-5 text-green-500" />;
    case 'ordonnance': return <DocumentDuplicateIcon className="h-5 w-5 text-yellow-500" />;
    default: return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
  }
};

const Documents = () => {
  const fileInputRef = useRef(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // Modal d'import
  const [showImportModal, setShowImportModal] = useState(false);
  const [importForm, setImportForm] = useState({ name: '', type: '', file: null });

  useEffect(() => {
    api.getMedicalDocuments()
      .then(setDocuments)
      .catch(() => setError('Impossible de charger les documents.'))
      .finally(() => setLoading(false));
  }, []);

  const showMsg = (msg, isError = false) => {
    if (isError) setError(msg);
    else setSuccess(msg);
    setTimeout(() => { setError(''); setSuccess(''); }, 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce document ?')) return;
    try {
      await api.deleteMedicalDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
      setSelectedDocuments(prev => prev.filter(i => i !== id));
      showMsg('Document supprimé.');
    } catch {
      showMsg('Erreur lors de la suppression.', true);
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Supprimer ${selectedDocuments.length} document(s) ?`)) return;
    for (const id of selectedDocuments) {
      try {
        await api.deleteMedicalDocument(id);
        setDocuments(prev => prev.filter(d => d.id !== id));
      } catch {}
    }
    setSelectedDocuments([]);
    showMsg('Documents supprimés.');
  };

  const handleUpload = async () => {
    if (!importForm.name || !importForm.type || !importForm.file) {
      showMsg('Veuillez remplir tous les champs.', true);
      return;
    }
    setUploading(true);
    try {
      const created = await api.uploadMedicalDocument(importForm);
      setDocuments(prev => [created, ...prev]);
      setShowImportModal(false);
      setImportForm({ name: '', type: '', file: null });
      showMsg('Document importé avec succès.');
    } catch (err) {
      showMsg(err.message || "Erreur lors de l'import.", true);
    } finally {
      setUploading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedDocuments(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filtered = documents.filter(doc => {
    const matchFilter = activeFilter === 'all' || doc.type === activeFilter;
    const matchSearch = searchQuery === '' ||
      (doc.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents médicaux</h1>
          <p className="mt-1 text-sm text-gray-500">Consultez et gérez tous vos documents médicaux</p>
        </div>
        <button onClick={() => setShowImportModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Importer un document
        </button>
      </div>

      {/* Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm flex items-center gap-2">
          <CheckIcon className="h-5 w-5" />{success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center gap-2">
          <ExclamationCircleIcon className="h-5 w-5" />{error}
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text"
              className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Rechercher un document..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <select
              className="h-full py-2 pl-3 pr-8 border-gray-300 bg-transparent text-gray-700 sm:text-sm rounded-md focus:ring-teal-500 focus:border-teal-500"
              value={activeFilter}
              onChange={e => setActiveFilter(e.target.value)}
            >
              {FILTERS.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-4 sm:px-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input type="checkbox"
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              checked={selectedDocuments.length > 0 && selectedDocuments.length === filtered.length}
              onChange={() => {
                if (selectedDocuments.length === filtered.length) setSelectedDocuments([]);
                else setSelectedDocuments(filtered.map(d => d.id));
              }}
            />
            <label className="text-sm text-gray-700">
              {selectedDocuments.length > 0 ? `${selectedDocuments.length} sélectionné(s)` : 'Tout sélectionner'}
            </label>
          </div>
          {selectedDocuments.length > 0 && (
            <button onClick={handleDeleteSelected}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
              <TrashIcon className="h-4 w-4 mr-1.5" />
              Supprimer ({selectedDocuments.length})
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun document trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Aucun document ne correspond à votre recherche.' : 'Importez votre premier document.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtered.map(doc => (
              <li key={doc.id} className="hover:bg-gray-50 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-4">
                  <input type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={() => toggleSelect(doc.id)}
                  />
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    {getDocumentIcon(doc.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-teal-600 truncate">{doc.name}</p>
                    <div className="mt-1 flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                        {doc.type}
                      </span>
                      {doc.size && (
                        <span>{doc.size}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.file_url && (
                      <a href={doc.file_url} target="_blank" rel="noreferrer"
                        className="p-1.5 border border-gray-300 rounded-full text-gray-400 hover:bg-gray-50 hover:text-teal-600">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </a>
                    )}
                    <button onClick={() => handleDelete(doc.id)}
                      className="p-1.5 border border-transparent rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal import */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowImportModal(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Importer un document</h3>
                <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du document *</label>
                  <input type="text" value={importForm.name}
                    onChange={e => setImportForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ex: Analyse sanguine complète"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select value={importForm.type}
                    onChange={e => setImportForm(p => ({ ...p, type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500">
                    <option value="">Sélectionner</option>
                    <option value="analyse">Résultats de laboratoire</option>
                    <option value="imagerie">Imagerie médicale</option>
                    <option value="ordonnance">Ordonnance</option>
                    <option value="compte_rendu">Compte-rendu</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fichier *</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={e => setImportForm(p => ({ ...p, file: e.target.files[0] }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                  <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG, DOC acceptés</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 text-sm font-medium">
                  Annuler
                </button>
                <button onClick={handleUpload} disabled={uploading}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 text-sm font-medium disabled:opacity-50">
                  {uploading ? 'Import en cours...' : 'Importer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;