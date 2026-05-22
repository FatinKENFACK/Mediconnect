import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  DocumentTextIcon,
  PhotoIcon,
  DocumentDuplicateIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';

const NewDocument = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    documentType: 'medical',
    date: new Date().toISOString().split('T')[0],
    tags: ''
  });

  const documentTypes = [
    { id: 'medical', name: 'Document médical', icon: DocumentTextIcon },
    { id: 'prescription', name: 'Ordonnance', icon: DocumentDuplicateIcon },
    { id: 'scan', name: 'Scan/Image', icon: PhotoIcon },
    { id: 'lab', name: 'Résultats de laboratoire', icon: DocumentDuplicateIcon },
    { id: 'other', name: 'Autre', icon: DocumentDuplicateIcon },
  ];

  const categories = [
    { id: 'consultation', name: 'Consultation' },
    { id: 'prescription', name: 'Ordonnance' },
    { id: 'lab', name: 'Analyses médicales' },
    { id: 'radiology', name: 'Imagerie médicale' },
    { id: 'report', name: 'Compte-rendu' },
    { id: 'billing', name: 'Facture' },
    { id: 'insurance', name: 'Assurance' },
    { id: 'other', name: 'Autre' },
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      status: 'pending'
    }));
    
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update file statuses
      setFiles(files.map(file => ({
        ...file,
        status: 'uploaded'
      })));
      
      // Show success message
      alert('Documents téléversés avec succès!');
      
      // Redirect to documents page after a short delay
      setTimeout(() => {
        navigate('/patient/documents');
      }, 1000);
      
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Une erreur est survenue lors du téléversement des fichiers.');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-900"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Retour
        </button>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">Nouveau document</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Téléverser des documents</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Ajoutez des documents médicaux, des analyses, des ordonnances, etc.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-6">
            {/* Document Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de document
              </label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {documentTypes.map((docType) => (
                  <div 
                    key={docType.id}
                    onClick={() => setFormData({...formData, documentType: docType.id})}
                    className={`relative rounded-lg border p-4 flex flex-col items-center cursor-pointer transition-colors ${
                      formData.documentType === docType.id 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <docType.icon 
                      className={`h-8 w-8 mb-2 ${
                        formData.documentType === docType.id 
                          ? 'text-indigo-600' 
                          : 'text-gray-400'
                      }`} 
                    />
                    <span className="text-sm font-medium text-gray-900 text-center">
                      {docType.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* File Upload Area */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fichiers à téléverser
              </label>
              <div 
                onClick={triggerFileInput}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <div className="space-y-1 text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                      <span>Téléverser un fichier</span>
                      <input 
                        ref={fileInputRef}
                        id="file-upload" 
                        name="file-upload" 
                        type="file" 
                        className="sr-only" 
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">ou glissez-déposez</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, JPG, PNG, DOCX jusqu'à 10MB
                  </p>
                </div>
              </div>
              
              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-3">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {file.status === 'uploaded' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Téléversé
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <XMarkIcon className="h-5 w-5" />
                          <span className="sr-only">Supprimer</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Document Details */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Titre du document <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date du document
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Mots-clés (séparés par des virgules)
                </label>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="ex: analyse, sang, docteur"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (optionnel)
              </label>
              <div className="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Ajoutez des détails sur ce document..."
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/patient/documents')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={files.length === 0 || uploading}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                files.length === 0 || uploading
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Téléversement...
                </>
              ) : (
                <>
                  <DocumentArrowUpIcon className="-ml-1 mr-2 h-5 w-5" />
                  Téléverser les documents
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDocument;
