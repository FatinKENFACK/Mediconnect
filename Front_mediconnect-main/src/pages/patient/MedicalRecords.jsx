import React, { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, PlusIcon, PencilIcon, TrashIcon,
  ArrowDownTrayIcon, ExclamationCircleIcon,
  MagnifyingGlassIcon, XMarkIcon, CheckIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// COMPOSANT MODAL — Formulaire réutilisable pour ajouter/modifier
// Affiché quand l'utilisateur clique sur "Ajouter" ou "Modifier"
// ============================================================
const Modal = ({ title, onClose, onSubmit, children, saving }) => (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    {/* Fond sombre derrière la modal */}
    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
    <div className="flex min-h-full items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        {/* En-tête de la modal */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        {/* Contenu du formulaire passé en children */}
        <div className="space-y-4">{children}</div>
        {/* Boutons d'action */}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 text-sm font-medium">
            Annuler
          </button>
          <button onClick={onSubmit} disabled={saving}
            className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 text-sm font-medium disabled:opacity-50">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================
const MedicalRecords = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // ---- États pour les données du backend ----
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [documents, setDocuments] = useState([]);

  // ---- États pour le chargement ----
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ---- États pour les modals ----
  // showModal indique quelle modal est ouverte (null = aucune)
  const [showModal, setShowModal] = useState(null);
  // editItem contient l'élément en cours de modification (null = création)
  const [editItem, setEditItem] = useState(null);

  // ---- État du formulaire ----
  const [formData, setFormData] = useState({});

  // ============================================================
  // CHARGEMENT DES DONNÉES
  // useEffect se déclenche une fois au montage du composant
  // Il charge toutes les données du patient depuis le backend
  // ============================================================
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        // On charge toutes les données en parallèle avec Promise.all
        // C'est plus rapide que de les charger une par une
        const [history, allerg, meds, docs] = await Promise.all([
          api.getMedicalHistory(),
          api.getAllergies(),
          api.getMedications(),
          api.getMedicalDocuments(),
        ]);
        setMedicalHistory(history);
        setAllergies(allerg);
        setMedications(meds);
        setDocuments(docs);
      } catch (err) {
        setError('Impossible de charger le dossier médical.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ============================================================
  // GESTION DU FORMULAIRE
  // ============================================================

  // Met à jour le formData quand l'utilisateur saisit quelque chose
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      // Si c'est un input file, on stocke le fichier lui-même
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Ouvre la modal pour ajouter un nouvel élément
  const openAddModal = (type) => {
    setEditItem(null);      // Pas d'élément en édition = mode création
    setFormData({});        // Formulaire vide
    setShowModal(type);     // Ouvre la modal du bon type
  };

  // Ouvre la modal pour modifier un élément existant
  const openEditModal = (type, item) => {
    setEditItem(item);      // Stocke l'élément à modifier
    setFormData(item);      // Pré-remplit le formulaire avec les données existantes
    setShowModal(type);     // Ouvre la modal
  };

  // Ferme la modal et réinitialise les états
  const closeModal = () => {
    setShowModal(null);
    setEditItem(null);
    setFormData({});
  };

  // Affiche un message de succès pendant 3 secondes
  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  // ============================================================
  // ACTIONS CRUD — Antécédents médicaux
  // ============================================================
  const handleSaveMedicalHistory = async () => {
    try {
      setSaving(true);
      if (editItem) {
        // Mode modification : on envoie un PATCH avec l'ID
        const updated = await api.updateMedicalHistory(editItem.id, formData);
        // Met à jour la liste en remplaçant l'ancien élément par le nouveau
        setMedicalHistory(prev => prev.map(h => h.id === editItem.id ? updated : h));
        showSuccess('Antécédent modifié avec succès');
      } else {
        // Mode création : on envoie un POST
        const created = await api.createMedicalHistory(formData);
        // Ajoute le nouvel élément au début de la liste
        setMedicalHistory(prev => [created, ...prev]);
        showSuccess('Antécédent ajouté avec succès');
      }
      closeModal();
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedicalHistory = async (id) => {
    if (!window.confirm('Supprimer cet antécédent ?')) return;
    try {
      await api.deleteMedicalHistory(id);
      // Retire l'élément supprimé de la liste
      setMedicalHistory(prev => prev.filter(h => h.id !== id));
      showSuccess('Antécédent supprimé');
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  // ============================================================
  // ACTIONS CRUD — Allergies
  // ============================================================
  const handleSaveAllergy = async () => {
    try {
      setSaving(true);
      if (editItem) {
        const updated = await api.updateAllergy(editItem.id, formData);
        setAllergies(prev => prev.map(a => a.id === editItem.id ? updated : a));
        showSuccess('Allergie modifiée avec succès');
      } else {
        const created = await api.createAllergy(formData);
        setAllergies(prev => [created, ...prev]);
        showSuccess('Allergie ajoutée avec succès');
      }
      closeModal();
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAllergy = async (id) => {
    if (!window.confirm('Supprimer cette allergie ?')) return;
    try {
      await api.deleteAllergy(id);
      setAllergies(prev => prev.filter(a => a.id !== id));
      showSuccess('Allergie supprimée');
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  // ============================================================
  // ACTIONS CRUD — Médicaments
  // ============================================================
  const handleSaveMedication = async () => {
    try {
      setSaving(true);
      if (editItem) {
        const updated = await api.updateMedication(editItem.id, formData);
        setMedications(prev => prev.map(m => m.id === editItem.id ? updated : m));
        showSuccess('Médicament modifié avec succès');
      } else {
        const created = await api.createMedication(formData);
        setMedications(prev => [created, ...prev]);
        showSuccess('Médicament ajouté avec succès');
      }
      closeModal();
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedication = async (id) => {
    if (!window.confirm('Supprimer ce médicament ?')) return;
    try {
      await api.deleteMedication(id);
      setMedications(prev => prev.filter(m => m.id !== id));
      showSuccess('Médicament supprimé');
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  // ============================================================
  // ACTIONS — Documents médicaux
  // ============================================================
  const handleUploadDocument = async () => {
    try {
      setSaving(true);
      const created = await api.uploadMedicalDocument(formData);
      setDocuments(prev => [created, ...prev]);
      showSuccess('Document uploadé avec succès');
      closeModal();
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Supprimer ce document ?')) return;
    try {
      await api.deleteMedicalDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
      showSuccess('Document supprimé');
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  // ============================================================
  // RENDU — Vue d'ensemble
  // ============================================================
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Antécédents médicaux', count: medicalHistory.length, color: 'bg-blue-100 text-blue-600', tab: 'medical-history' },
          { label: 'Allergies', count: allergies.length, color: 'bg-red-100 text-red-600', tab: 'allergies' },
          { label: 'Médicaments', count: medications.length, color: 'bg-green-100 text-green-600', tab: 'medications' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${item.color} rounded-lg p-3`}>
                <DocumentTextIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              </div>
            </div>
            <button onClick={() => setActiveTab(item.tab)}
              className="mt-4 text-sm font-medium text-teal-600 hover:text-teal-700">
              Voir tout →
            </button>
          </div>
        ))}
      </div>

      {/* Derniers documents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Derniers documents</h3>
          <button onClick={() => setActiveTab('documents')}
            className="text-sm font-medium text-teal-600 hover:text-teal-700">
            Voir tout →
          </button>
        </div>
        <ul className="divide-y divide-gray-100">
          {documents.slice(0, 3).map((doc) => (
            <li key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-6 w-6 text-teal-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.type} • {doc.size} • {new Date(doc.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              {doc.file_url && (
                <a href={doc.file_url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                  Télécharger
                </a>
              )}
            </li>
          ))}
          {documents.length === 0 && (
            <li className="px-6 py-8 text-center text-gray-500 text-sm">Aucun document</li>
          )}
        </ul>
      </div>
    </div>
  );

  // ============================================================
  // RENDU — Antécédents médicaux
  // ============================================================
  const renderMedicalHistory = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Antécédents médicaux</h3>
        <button onClick={() => openAddModal('history')}
          className="inline-flex items-center px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
          <PlusIcon className="h-4 w-4 mr-1" /> Ajouter
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Condition', 'Date', 'Statut', 'Notes', 'Actions'].map(h => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {medicalHistory.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.condition}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'en_cours' ? 'bg-yellow-100 text-yellow-800' :
                  item.status === 'resolu' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {item.status === 'en_cours' ? 'En cours' : item.status === 'resolu' ? 'Résolu' : 'Chronique'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.notes || '—'}</td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => openEditModal('history', item)} className="text-blue-600 hover:text-blue-800 mr-3">
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteMedicalHistory(item.id)} className="text-red-600 hover:text-red-800">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
          {medicalHistory.length === 0 && (
            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">Aucun antécédent</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // ============================================================
  // RENDU — Allergies
  // ============================================================
  const renderAllergies = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Allergies</h3>
        <button onClick={() => openAddModal('allergy')}
          className="inline-flex items-center px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
          <PlusIcon className="h-4 w-4 mr-1" /> Ajouter
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Allergie', 'Type', 'Gravité', 'Notes', 'Actions'].map(h => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {allergies.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500 capitalize">{item.type}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.severity === 'severe' ? 'bg-red-100 text-red-800' :
                  item.severity === 'moderee' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {item.severity === 'severe' ? 'Sévère' : item.severity === 'moderee' ? 'Modérée' : 'Légère'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.notes || '—'}</td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => openEditModal('allergy', item)} className="text-blue-600 hover:text-blue-800 mr-3">
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteAllergy(item.id)} className="text-red-600 hover:text-red-800">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
          {allergies.length === 0 && (
            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">Aucune allergie</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // ============================================================
  // RENDU — Médicaments
  // ============================================================
  const renderMedications = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Médicaments</h3>
        <button onClick={() => openAddModal('medication')}
          className="inline-flex items-center px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
          <PlusIcon className="h-4 w-4 mr-1" /> Ajouter
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Médicament', 'Dosage', 'Fréquence', 'Début', 'Prescrit par', 'Actions'].map(h => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {medications.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.dosage}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.frequency}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.start_date}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.prescriber}</td>
              <td className="px-6 py-4 text-right">
                <button onClick={() => openEditModal('medication', item)} className="text-blue-600 hover:text-blue-800 mr-3">
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button onClick={() => handleDeleteMedication(item.id)} className="text-red-600 hover:text-red-800">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
          {medications.length === 0 && (
            <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">Aucun médicament</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // ============================================================
  // RENDU — Documents
  // ============================================================
  const renderDocuments = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Documents médicaux</h3>
        <button onClick={() => openAddModal('document')}
          className="inline-flex items-center px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">
          <PlusIcon className="h-4 w-4 mr-1" /> Importer
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Nom', 'Type', 'Taille', 'Date', 'Actions'].map(h => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 capitalize">{doc.type}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{doc.size}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(doc.created_at).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                {doc.file_url && (
                  <a href={doc.file_url} target="_blank" rel="noreferrer"
                    className="text-teal-600 hover:text-teal-800">
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </a>
                )}
                <button onClick={() => handleDeleteDocument(doc.id)} className="text-red-600 hover:text-red-800">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
          {documents.length === 0 && (
            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">Aucun document</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // ============================================================
  // RENDU PRINCIPAL
  // ============================================================
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dossier médical</h1>
        <p className="mt-1 text-sm text-gray-500">Consultez et gérez vos informations médicales</p>
      </div>

      {/* Messages succès / erreur */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm flex items-center gap-2">
          <CheckIcon className="h-5 w-5" /> {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center gap-2">
          <ExclamationCircleIcon className="h-5 w-5" /> {error}
        </div>
      )}

      {/* Onglets de navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'overview', label: 'Vue d\'ensemble' },
            { key: 'medical-history', label: 'Antécédents' },
            { key: 'allergies', label: 'Allergies' },
            { key: 'medications', label: 'Médicaments' },
            { key: 'documents', label: 'Documents' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu selon l'onglet actif */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'medical-history' && renderMedicalHistory()}
          {activeTab === 'allergies' && renderAllergies()}
          {activeTab === 'medications' && renderMedications()}
          {activeTab === 'documents' && renderDocuments()}
        </>
      )}

      {/* ============================================================
          MODALS — Formulaires d'ajout/modification
          showModal détermine quelle modal est affichée
      ============================================================ */}

      {/* Modal Antécédent médical */}
      {showModal === 'history' && (
        <Modal
          title={editItem ? 'Modifier l\'antécédent' : 'Ajouter un antécédent'}
          onClose={closeModal}
          onSubmit={handleSaveMedicalHistory}
          saving={saving}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
            <input type="text" name="condition" value={formData.condition || ''}
              onChange={handleFormChange}
              placeholder="Ex: Hypertension artérielle"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input type="date" name="date" value={formData.date || ''}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
            <select name="status" value={formData.status || 'en_cours'}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500">
              <option value="en_cours">En cours</option>
              <option value="resolu">Résolu</option>
              <option value="chronique">Chronique</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" value={formData.notes || ''}
              onChange={handleFormChange} rows={3}
              placeholder="Notes supplémentaires..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
          </div>
        </Modal>
      )}

      {/* Modal Allergie */}
      {showModal === 'allergy' && (
        <Modal
          title={editItem ? 'Modifier l\'allergie' : 'Ajouter une allergie'}
          onClose={closeModal}
          onSubmit={handleSaveAllergy}
          saving={saving}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'allergène *</label>
            <input type="text" name="name" value={formData.name || ''}
              onChange={handleFormChange}
              placeholder="Ex: Pénicilline"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select name="type" value={formData.type || ''}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500">
              <option value="">Sélectionner</option>
              <option value="medicament">Médicament</option>
              <option value="aliment">Aliment</option>
              <option value="environnement">Environnement</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gravité *</label>
            <select name="severity" value={formData.severity || ''}
              onChange={handleFormChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500">
              <option value="">Sélectionner</option>
              <option value="legere">Légère</option>
              <option value="moderee">Modérée</option>
              <option value="severe">Sévère</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" value={formData.notes || ''}
              onChange={handleFormChange} rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
          </div>
        </Modal>
      )}

      {/* Modal Médicament */}
      {showModal === 'medication' && (
        <Modal
          title={editItem ? 'Modifier le médicament' : 'Ajouter un médicament'}
          onClose={closeModal}
          onSubmit={handleSaveMedication}
          saving={saving}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input type="text" name="name" value={formData.name || ''}
                onChange={handleFormChange}
                placeholder="Ex: Lisinopril"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
              <input type="text" name="dosage" value={formData.dosage || ''}
                onChange={handleFormChange}
                placeholder="Ex: 10mg"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence *</label>
            <input type="text" name="frequency" value={formData.frequency || ''}
              onChange={handleFormChange}
              placeholder="Ex: 1 fois/jour"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
              <input type="date" name="start_date" value={formData.start_date || ''}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input type="date" name="end_date" value={formData.end_date || ''}
                onChange={handleFormChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Médecin prescripteur *</label>
            <input type="text" name="prescriber" value={formData.prescriber || ''}
              onChange={handleFormChange}
              placeholder="Ex: Dr. Martin"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" value={formData.notes || ''}
              onChange={handleFormChange} rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
          </div>
        </Modal>
      )}

      {/* Modal Document */}
      {showModal === 'document' && (
        <Modal
          title="Importer un document"
          onClose={closeModal}
          onSubmit={handleUploadDocument}
          saving={saving}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du document *</label>
            <input type="text" name="name" value={formData.name || ''}
              onChange={handleFormChange}
              placeholder="Ex: Analyse sanguine complète"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
            <select name="type" value={formData.type || ''}
              onChange={handleFormChange}
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
            <input type="file" name="file"
              onChange={handleFormChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
            <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG, DOC acceptés</p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MedicalRecords;