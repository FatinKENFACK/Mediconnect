import React, { useState, useEffect } from 'react';
import { 
  StarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  FlagIcon,
  TrashIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function DoctorReviews() {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      patientName: 'Thomas Fotsing',
      patientEmail: 'thomas.fotsing@email.com',
      patientAvatar: '/api/placeholder/40/40',
      consultationId: 'CONS-2024-001',
      consultationDate: '2024-12-10',
      consultationType: 'presentiel',
      specialty: 'Médecine générale',
      rating: 5,
      title: 'Excellente consultation',
      content: 'Le Dr. Tchinda est très professionnel et à l\'écoute. Il a pris le temps de bien expliquer mon diagnostic et de répondre à toutes mes questions. Je recommande vivement!',
      categories: {
        professionalism: 5,
        communication: 5,
        punctuality: 5,
        knowledge: 5,
        environment: 5
      },
      helpful: 15,
      status: 'published',
      createdAt: '2024-12-11T10:30:00Z',
      reply: null,
      reported: false
    },
    {
      id: 2,
      patientName: 'Marie Kengne',
      patientEmail: 'marie.kengne@email.com',
      patientAvatar: '/api/placeholder/40/40',
      consultationId: 'CONS-2024-002',
      consultationDate: '2024-12-08',
      consultationType: 'video',
      specialty: 'Médecine générale',
      rating: 4,
      title: 'Bonne consultation en ligne',
      content: 'La visioconférence s\'est bien déroulée. Le médecin a été clair dans ses explications. J\'aurais aimé avoir un peu plus de temps pour poser des questions.',
      categories: {
        professionalism: 5,
        communication: 4,
        punctuality: 5,
        knowledge: 4,
        environment: 4
      },
      helpful: 12,
      status: 'published',
      createdAt: '2024-12-09T14:15:00Z',
      reply: {
        content: 'Merci pour votre avis Marie. Je note votre retour concernant le temps et m\'efforcerai d\'accorder plus de temps lors de nos prochaines consultations. N\'hésitez pas si vous avez d\'autres questions.',
        createdAt: '2024-12-09T16:00:00Z'
      },
      reported: false
    },
    {
      id: 3,
      patientName: 'Jean Mballa',
      patientEmail: 'jean.mballa@email.com',
      patientAvatar: '/api/placeholder/40/40',
      consultationId: 'CONS-2024-003',
      consultationDate: '2024-12-05',
      consultationType: 'presentiel',
      specialty: 'Cardiologie',
      rating: 5,
      title: 'Très satisfait',
      content: 'Consultation cardiologique très complète. Le Dr. Tchinda a pris le temps d\'analyser mes résultats et de m\'expliquer en détail mon traitement. Suivi prévu dans 2 semaines.',
      categories: {
        professionalism: 5,
        communication: 5,
        punctuality: 5,
        knowledge: 5,
        environment: 5
      },
      helpful: 18,
      status: 'published',
      createdAt: '2024-12-06T09:45:00Z',
      reply: null,
      reported: false
    },
    {
      id: 4,
      patientName: 'Utilisateur anonyme',
      patientEmail: 'anonymous@email.com',
      patientAvatar: '/api/placeholder/40/40',
      consultationId: 'CONS-2024-004',
      consultationDate: '2024-12-01',
      consultationType: 'video',
      specialty: 'Médecine générale',
      rating: 2,
      title: 'Déçu de la consultation',
      content: 'Connexion de mauvaise qualité, consultation interrompue plusieurs fois. Le médecin semblait pressé et n\'a pas répondu clairement à mes questions.',
      categories: {
        professionalism: 2,
        communication: 2,
        punctuality: 3,
        knowledge: 3,
        environment: 2
      },
      helpful: 3,
      status: 'pending',
      createdAt: '2024-12-02T11:20:00Z',
      reply: null,
      reported: false
    }
  ];

  useEffect(() => {
    setReviews(mockReviews);
    setFilteredReviews(mockReviews);
  }, []);

  useEffect(() => {
    let filtered = reviews;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(review => 
        review.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating));
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(review => review.status === filterStatus);
    }

    setFilteredReviews(filtered);
  }, [reviews, searchQuery, filterRating, filterStatus]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderCategoryStars = (category, rating) => {
    const categoryNames = {
      professionalism: 'Professionnalisme',
      communication: 'Communication',
      punctuality: 'Ponctualité',
      knowledge: 'Connaissances',
      environment: 'Environnement'
    };

    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{categoryNames[category]}</span>
        <div className="flex items-center">
          {Array.from({ length: 5 }, (_, i) => (
            <StarIcon
              key={i}
              className={`h-3 w-3 ${
                i < rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-gray-600">({rating}/5)</span>
        </div>
      </div>
    );
  };

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    
    // Simuler l'envoi de la réponse
    setTimeout(() => {
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? {
                ...review,
                reply: {
                  content: replyText,
                  createdAt: new Date().toISOString()
                }
              }
            : review
        )
      );
      
      setReplyText('');
      setSelectedReview(null);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleStatusUpdate = (reviewId, newStatus) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId ? { ...review, status: newStatus } : review
      )
    );
  };

  const handleReport = (reviewId) => {
    setReviews(prev => 
      prev.map(review => 
        review.id === reviewId ? { ...review, reported: true } : review
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: reviews.length,
    published: reviews.filter(r => r.status === 'published').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    fiveStar: reviews.filter(r => r.rating === 5).length,
    fourStar: reviews.filter(r => r.rating === 4).length,
    threeStar: reviews.filter(r => r.rating === 3).length,
    twoStar: reviews.filter(r => r.rating === 2).length,
    oneStar: reviews.filter(r => r.rating === 1).length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Avis des patients</h1>
              <p className="text-gray-600 mt-1">Gérez et répondez aux évaluations des patients</p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total avis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
                <p className="text-sm text-gray-600">Publiés</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-sm text-gray-600">En attente</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <StarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.fiveStar}</p>
                <p className="text-sm text-gray-600">5 étoiles</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.twoStar + stats.oneStar}</p>
                <p className="text-sm text-gray-600">⩽2 étoiles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un avis..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Note</label>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Toutes les notes</option>
                <option value="5">5 étoiles</option>
                <option value="4">4 étoiles</option>
                <option value="3">3 étoiles</option>
                <option value="2">2 étoiles</option>
                <option value="1">1 étoile</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="published">Publié</option>
                <option value="pending">En attente</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun avis trouvé</h3>
              <p className="text-gray-600">Aucun avis ne correspond à vos critères de recherche.</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={review.patientAvatar}
                      alt={review.patientName}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{review.patientName}</h3>
                      <p className="text-sm text-gray-600">{review.patientEmail}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(review.status)}`}>
                      {review.status === 'published' && 'Publié'}
                      {review.status === 'pending' && 'En attente'}
                      {review.status === 'rejected' && 'Rejeté'}
                    </span>
                    
                    <button
                      onClick={() => handleReport(review.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        review.reported 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                      }`}
                      disabled={review.reported}
                    >
                      <FlagIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 font-medium text-gray-900">{review.rating}/5</span>
                    </div>
                    
                    <span className="text-sm text-gray-500">
                      Consultation du {new Date(review.consultationDate).toLocaleDateString('fr-FR')}
                    </span>
                    
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      review.consultationType === 'video' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {review.consultationType === 'video' ? 'Visioconférence' : 'Présentiel'}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                  <p className="text-gray-700 mb-3">{review.content}</p>
                  
                  {/* Category Ratings */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Évaluation détaillée</h5>
                    <div className="space-y-2">
                      {Object.entries(review.categories).map(([category, rating]) => (
                        <div key={category}>
                          {renderCategoryStars(category, rating)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Reply Section */}
                {review.reply ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                    <div className="flex items-center mb-2">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800">Votre réponse</span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.reply.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Répondu le {new Date(review.reply.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ) : selectedReview === review.id ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Rédigez votre réponse..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setSelectedReview(null)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleReply(review.id)}
                        disabled={isSubmitting || !replyText.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Envoi...
                          </>
                        ) : (
                          <>
                            <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-600 mr-2" />
                            Répondre
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedReview(review.id)}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Répondre à cet avis
                  </button>
                )}
                
                {/* Actions for pending reviews */}
                {review.status === 'pending' && (
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => handleStatusUpdate(review.id, 'published')}
                      className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Approuver
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(review.id, 'rejected')}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Rejeter
                    </button>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{review.helpful} personnes ont trouvé cet avis utile</span>
                    <span>•</span>
                    <span>Consultation #{review.consultationId}</span>
                  </div>
                  
                  {review.reported && (
                    <span className="text-sm text-red-600 flex items-center">
                      <FlagIcon className="h-4 w-4 mr-1" />
                      Signalé
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
