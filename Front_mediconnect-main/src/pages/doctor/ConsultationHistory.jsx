import React, { useState, useEffect } from 'react';
import { 
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  VideoCameraIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowRightIcon,
  EyeIcon,
  ArrowDownIcon,
  FilterIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function ConsultationHistory() {
  const [consultations, setConsultations] = useState([]);
  const [filteredConsultations, setFilteredConsultations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Mock consultation history data
  const mockConsultations = [
    {
      id: 1,
      patientId: 'PAT-001',
      patientName: 'Thomas Fotsing',
      patientEmail: 'thomas.fotsing@email.com',
      patientPhone: '+237 677 888 999',
      patientAge: 32,
      patientGender: 'male',
      date: '2024-12-15',
      time: '14:30',
      duration: '30 minutes',
      type: 'presentiel',
      status: 'completed',
      specialty: 'Médecine générale',
      reason: 'Consultation de routine',
      diagnosis: 'Hypertension artérielle légère',
      symptoms: 'Maux de tête fréquents, fatigue',
      treatment: 'Prescription d\'antihypertenseurs, recommandation régime hyposodé',
      notes: 'Patient suit bien le traitement, pression contrôlée',
      location: 'Hôpital Central Yaoundé',
      price: '5000 XAF',
      paymentStatus: 'paid',
      paymentMethod: 'Mobile Money',
      followUpRequired: true,
      followUpDate: '2024-12-29',
      prescriptionId: 'PRES-2024-001',
      documents: ['Certificat médical', 'Résultats analyse'],
      createdAt: '2024-12-10T10:00:00Z',
      updatedAt: '2024-12-15T15:00:00Z'
    },
    {
      id: 2,
      patientId: 'PAT-002',
      patientName: 'Marie Kengne',
      patientEmail: 'marie.kengne@email.com',
      patientPhone: '+237 655 444 333',
      patientAge: 28,
      patientGender: 'female',
      date: '2024-12-10',
      time: '10:00',
      duration: '45 minutes',
      type: 'video',
      status: 'completed',
      specialty: 'Médecine générale',
      reason: 'Suivi diabète',
      diagnosis: 'Diabète type 2 bien contrôlé',
      symptoms: 'Glycémie stable, fatigue légère',
      treatment: 'Ajustement traitement metformine, recommandation exercice',
      notes: 'Patient motivé, bonne observance thérapeutique',
      location: 'Visioconférence',
      price: '6000 XAF',
      paymentStatus: 'paid',
      paymentMethod: 'Orange Money',
      followUpRequired: true,
      followUpDate: '2024-12-24',
      prescriptionId: 'PRES-2024-002',
      documents: ['Ordonnance', 'Note de suivi'],
      createdAt: '2024-12-08T14:00:00Z',
      updatedAt: '2024-12-10T10:45:00Z'
    },
    {
      id: 3,
      patientId: 'PAT-003',
      patientName: 'Jean Mballa',
      patientEmail: 'jean.mballa@email.com',
      patientPhone: '+237 699 777 666',
      patientAge: 45,
      patientGender: 'male',
      date: '2024-12-08',
      time: '11:00',
      duration: '60 minutes',
      type: 'presentiel',
      status: 'completed',
      specialty: 'Cardiologie',
      reason: 'Consultation cardiologique',
      diagnosis: 'Cardiopathie hypertensive',
      symptoms: 'Douleurs thoraciques, essoufflement à l\'effort',
      treatment: 'Bêtabloquants, IEC, recommandation coronarographie',
      notes: 'Patient stabilisé sous traitement, surveillance régulière',
      location: 'Clinique des Basseurs Douala',
      price: '8000 XAF',
      paymentStatus: 'paid',
      paymentMethod: 'Carte bancaire',
      followUpRequired: true,
      followUpDate: '2024-12-22',
      prescriptionId: 'PRES-2024-003',
      documents: ['ECG', 'Échocardiographie', 'Ordonnance'],
      createdAt: '2024-12-05T09:00:00Z',
      updatedAt: '2024-12-08T12:00:00Z'
    },
    {
      id: 4,
      patientId: 'PAT-004',
      patientName: 'Sophie Ngo',
      patientEmail: 'sophie.ngo@email.com',
      patientPhone: '+237 688 555 444',
      patientAge: 35,
      patientGender: 'female',
      date: '2024-12-05',
      time: '15:30',
      duration: '30 minutes',
      type: 'video',
      status: 'cancelled',
      specialty: 'Médecine générale',
      reason: 'Consultation pédiatrique',
      diagnosis: null,
      symptoms: null,
      treatment: null,
      notes: 'Annulation par patient 24h à l\'avance',
      location: 'Visioconférence',
      price: '6000 XAF',
      paymentStatus: 'refunded',
      paymentMethod: 'Orange Money',
      followUpRequired: false,
      followUpDate: null,
      prescriptionId: null,
      documents: [],
      createdAt: '2024-12-04T16:00:00Z',
      updatedAt: '2024-12-05T09:00:00Z'
    }
  ];

  useEffect(() => {
    setConsultations(mockConsultations);
    setFilteredConsultations(mockConsultations);
  }, []);

  useEffect(() => {
    let filtered = consultations;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(consultation => 
        consultation.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(consultation => consultation.status === filterStatus);
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(consultation => consultation.type === filterType);
    }

    // Filter by date range
    if (filterDateRange !== 'all') {
      const today = new Date();
      let startDate;
      
      switch (filterDateRange) {
        case '7days':
          startDate = new Date(today.setDate(today.getDate() - 7));
          break;
        case '30days':
          startDate = new Date(today.setDate(today.getDate() - 30));
          break;
        case '90days':
          startDate = new Date(today.setDate(today.getDate() - 90));
          break;
        case '1year':
          startDate = new Date(today.setFullYear(today.getFullYear() - 1));
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(consultation => 
          new Date(consultation.date) >= startDate
        );
      }
    }

    setFilteredConsultations(filtered);
  }, [consultations, searchQuery, filterStatus, filterType, filterDateRange]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'video' ? VideoCameraIcon : UserGroupIcon;
  };

  const getTypeColor = (type) => {
    return type === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setShowDetails(true);
  };

  const handleDownloadReport = (consultationId) => {
    // Simuler le téléchargement d'un rapport
    console.log('Téléchargement du rapport pour la consultation:', consultationId);
  };

  const stats = {
    total: consultations.length,
    completed: consultations.filter(c => c.status === 'completed').length,
    cancelled: consultations.filter(c => c.status === 'cancelled').length,
    video: consultations.filter(c => c.type === 'video').length,
    inPerson: consultations.filter(c => c.type === 'presentiel').length,
    totalRevenue: consultations
      .filter(c => c.status === 'completed' && c.paymentStatus === 'paid')
      .reduce((sum, c) => sum + parseInt(c.price.replace(/\D/g, '')), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Historique des consultations</h1>
              <p className="text-gray-600 mt-1">Consultez l'historique complet de vos consultations</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-sm text-gray-600">Terminées</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{(stats.totalRevenue / 1000).toFixed(1)}k</p>
                <p className="text-sm text-gray-600">XAF</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total consultations</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-gray-600">Consultations terminées</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <VideoCameraIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.video}</p>
                <p className="text-sm text-gray-600">Visioconférences</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.inPerson}</p>
                <p className="text-sm text-gray-600">Consultations présentielles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une consultation..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
                <option value="pending">En attente</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les types</option>
                <option value="presentiel">Présentiel</option>
                <option value="video">Visioconférence</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
              <select
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Toutes les périodes</option>
                <option value="7days">7 derniers jours</option>
                <option value="30days">30 derniers jours</option>
                <option value="90days">90 derniers jours</option>
                <option value="1year">1 an</option>
              </select>
            </div>
          </div>
        </div>

        {/* Consultations List */}
        <div className="space-y-4">
          {filteredConsultations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune consultation trouvée</h3>
              <p className="text-gray-600">Aucune consultation ne correspond à vos critères de recherche.</p>
            </div>
          ) : (
            filteredConsultations.map((consultation) => (
              <div key={consultation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center">
                        {React.createElement(getTypeIcon(consultation.type), { className: 'h-5 w-5 text-gray-400 mr-2' })}
                        <span className="font-medium text-gray-900">{consultation.patientName}</span>
                      </div>
                      
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(consultation.status)}`}>
                        {consultation.status === 'completed' && 'Terminée'}
                        {consultation.status === 'cancelled' && 'Annulée'}
                        {consultation.status === 'pending' && 'En attente'}
                      </span>
                      
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(consultation.type)}`}>
                        {consultation.type === 'video' ? 'Visioconférence' : 'Présentiel'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{new Date(consultation.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span>{consultation.time}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span>{consultation.duration}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span>{consultation.location}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Motif:</span>
                          <p className="text-gray-600">{consultation.reason}</p>
                        </div>
                        
                        <div>
                          <span className="font-medium text-gray-700">Spécialité:</span>
                          <p className="text-gray-600">{consultation.specialty}</p>
                        </div>
                        
                        {consultation.diagnosis && (
                          <div>
                            <span className="font-medium text-gray-700">Diagnostic:</span>
                            <p className="text-gray-600">{consultation.diagnosis}</p>
                          </div>
                        )}
                        
                        {consultation.treatment && (
                          <div>
                            <span className="font-medium text-gray-700">Traitement:</span>
                            <p className="text-gray-600">{consultation.treatment}</p>
                          </div>
                        )}
                      </div>
                      
                      {consultation.notes && (
                        <div className="mt-3">
                          <span className="font-medium text-gray-700">Notes:</span>
                          <p className="text-gray-600 text-sm">{consultation.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          <span>{consultation.patientEmail}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          <span>{consultation.patientPhone}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          <span>{consultation.price}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(consultation)}
                          className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Détails
                        </button>
                        
                        <button
                          onClick={() => handleDownloadReport(consultation.id)}
                          className="px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                        >
                          <ArrowDownIcon className="h-4 w-4 mr-2" />
                          Rapport
                        </button>
                        
                        {consultation.prescriptionId && (
                          <button
                            className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                          >
                            <DocumentTextIcon className="h-4 w-4 mr-2" />
                            Ordonnance
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Modal */}
        {showDetails && selectedConsultation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Détails de la consultation</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Informations patient</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nom:</span>
                        <span className="font-medium">{selectedConsultation.patientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedConsultation.patientEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Téléphone:</span>
                        <span className="font-medium">{selectedConsultation.patientPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Âge:</span>
                        <span className="font-medium">{selectedConsultation.patientAge} ans</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Genre:</span>
                        <span className="font-medium">{selectedConsultation.patientGender === 'male' ? 'Homme' : 'Femme'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Consultation Information */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Informations consultation</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{new Date(selectedConsultation.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Heure:</span>
                        <span className="font-medium">{selectedConsultation.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durée:</span>
                        <span className="font-medium">{selectedConsultation.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{selectedConsultation.type === 'video' ? 'Visioconférence' : 'Présentiel'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lieu:</span>
                        <span className="font-medium">{selectedConsultation.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Statut:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedConsultation.status)}`}>
                          {selectedConsultation.status === 'completed' && 'Terminée'}
                          {selectedConsultation.status === 'cancelled' && 'Annulée'}
                          {selectedConsultation.status === 'pending' && 'En attente'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Medical Details */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Détails médicaux</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Motif:</span>
                        <p className="text-gray-600 mt-1">{selectedConsultation.reason}</p>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Spécialité:</span>
                        <p className="text-gray-600 mt-1">{selectedConsultation.specialty}</p>
                      </div>
                      
                      {selectedConsultation.diagnosis && (
                        <div>
                          <span className="font-medium text-gray-700">Diagnostic:</span>
                          <p className="text-gray-600 mt-1">{selectedConsultation.diagnosis}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      {selectedConsultation.symptoms && (
                        <div>
                          <span className="font-medium text-gray-700">Symptômes:</span>
                          <p className="text-gray-600 mt-1">{selectedConsultation.symptoms}</p>
                        </div>
                      )}
                      
                      {selectedConsultation.treatment && (
                        <div>
                          <span className="font-medium text-gray-700">Traitement:</span>
                          <p className="text-gray-600 mt-1">{selectedConsultation.treatment}</p>
                        </div>
                      )}
                      
                      {selectedConsultation.notes && (
                        <div>
                          <span className="font-medium text-gray-700">Notes:</span>
                          <p className="text-gray-600 mt-1">{selectedConsultation.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Follow-up Information */}
                {selectedConsultation.followUpRequired && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Suivi requis</h3>
                    <p className="text-sm text-gray-700">
                      Un suivi est prévu pour le {new Date(selectedConsultation.followUpDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
                
                {/* Documents */}
                {selectedConsultation.documents && selectedConsultation.documents.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Documents</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedConsultation.documents.map((doc, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => handleDownloadReport(selectedConsultation.id)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <ArrowDownIcon className="h-4 w-4 mr-2" />
                    Télécharger le rapport
                  </button>
                  
                  {selectedConsultation.prescriptionId && (
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-2" />
                      Voir l'ordonnance
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
