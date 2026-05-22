import React, { useState, useEffect } from 'react';
import {
  StarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  CalendarIcon,
  CheckCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const HospitalReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mockReviews = [
      {
        id: 1,
        patient: 'Jean Dupont',
        patientEmail: 'jean.dupont@email.com',
        rating: 5,
        title: 'Excellent service',
        comment: 'Professionnalisme exceptionnel de toute l\'équipe. Le personnel est très attentif et les installations sont modernes. Je recommande vivement cet hôpital.',
        date: '2024-01-15',
        service: 'Cardiologie',
        doctor: 'Dr. Martin Laurent',
        status: 'published',
        response: null,
        helpful: 12,
        verified: true
      },
      {
        id: 2,
        patient: 'Marie Laurent',
        patientEmail: 'marie.laurent@email.com',
        rating: 4,
        title: 'Bonne expérience',
        comment: 'Service de qualité, personnel compétent. Seul petit point négatif : temps d\'attente un peu long pour le rendez-vous.',
        date: '2024-01-12',
        service: 'Pédiatrie',
        doctor: 'Dr. Sophie Bernard',
        status: 'published',
        response: null,
        helpful: 8,
        verified: true
      },
      {
        id: 3,
        patient: 'Pierre Dubois',
        patientEmail: 'pierre.dubois@email.com',
        rating: 3,
        title: 'Service correct',
        comment: 'Le service était correct mais pourrait être amélioré au niveau de l\'accueil et de la communication.',
        date: '2024-01-10',
        service: 'Radiologie',
        doctor: 'Dr. Pierre Dubois',
        status: 'pending',
        response: null,
        helpful: 3,
        verified: false
      },
      {
        id: 4,
        patient: 'Sophie Martin',
        patientEmail: 'sophie.martin@email.com',
        rating: 5,
        title: 'Exceptionnel',
        comment: 'Une expérience médicale des plus positives. Le Dr. Lefebvre est excellente et le personnel est très professionnel.',
        date: '2024-01-08',
        service: 'Gynécologie',
        doctor: 'Dr. Marie Lefebvre',
        status: 'published',
        response: 'Merci beaucoup pour votre avis positif. Nous sommes ravis que votre expérience ait été excellente.',
        helpful: 15,
        verified: true
      },
      {
        id: 5,
        patient: 'Antoine Bernard',
        patientEmail: 'antoine.bernard@email.com',
        rating: 2,
        title: 'Décevant',
        comment: 'Temps d\'attente très long et personnel peu disponible. Les installations sont vieillissantes.',
        date: '2024-01-05',
        service: 'Urgences',
        doctor: 'Service d\'urgence',
        status: 'reported',
        response: null,
        helpful: 1,
        verified: false
      }
    ];
    setReviews(mockReviews);
  }, []);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    
    return matchesSearch && matchesRating && matchesStatus;
  });

  const handleResponse = (review) => {
    setSelectedReview(review);
    setResponseText(review.response || '');
    setShowResponseModal(true);
  };

  const submitResponse = async () => {
    setIsLoading(true);
    // Simuler l'envoi de la réponse
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setReviews(prev => prev.map(review => 
      review.id === selectedReview.id 
        ? { ...review, response: responseText, status: 'published' }
        : review
    ));
    
    setIsLoading(false);
    setShowResponseModal(false);
    setSelectedReview(null);
    setResponseText('');
  };

  const updateReviewStatus = (reviewId, newStatus) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, status: newStatus }
        : review
    ));
  };

  const deleteReview = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarSolid
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', label: 'Publié' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      reported: { color: 'bg-red-100 text-red-800', label: 'Signalé' },
      hidden: { color: 'bg-gray-100 text-gray-800', label: 'Masqué' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const stats = {
    total: reviews.length,
    published: reviews.filter(r => r.status === 'published').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    reported: reviews.filter(r => r.status === 'reported').length,
    averageRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des avis</h1>
            <p className="text-gray-600 mt-2">Consultez et répondez aux avis laissés par les patients</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total avis</p>
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
              <p className="text-sm font-medium text-gray-600">Publiés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-500 p-3 rounded-lg">
              <FlagIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Signalés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reported}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <StarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un avis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les notes</option>
            <option value="5">5 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="2">2 étoiles</option>
            <option value="1">1 étoile</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="pending">En attente</option>
            <option value="reported">Signalés</option>
            <option value="hidden">Masqués</option>
          </select>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterRating('all');
              setFilterStatus('all');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">{review.patient}</h3>
                    {review.verified && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" title="Patient vérifié" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{review.patientEmail}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-500">{review.date}</span>
                    <span className="text-sm text-gray-500">{review.service}</span>
                    <span className="text-sm text-gray-500">{review.doctor}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(review.status)}
                <div className="flex space-x-1">
                  {review.status === 'published' ? (
                    <button
                      onClick={() => updateReviewStatus(review.id, 'hidden')}
                      className="p-2 text-yellow-600 hover:text-yellow-800"
                      title="Masquer"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => updateReviewStatus(review.id, 'published')}
                      className="p-2 text-green-600 hover:text-green-800"
                      title="Publier"
                    >
                      <CheckCircleIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-900 mb-2">{review.title}</h4>
              {renderStars(review.rating)}
            </div>

            <p className="text-gray-700 mb-4">{review.comment}</p>

            {review.response && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-blue-800">Réponse de l'hôpital</span>
                </div>
                <p className="text-blue-700">{review.response}</p>
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {review.helpful} personnes ont trouvé cet avis utile
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Répondre à l'avis</h3>
              <div className="mt-2 p-4 bg-gray-50 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-gray-900">{selectedReview.patient}</span>
                  {renderStars(selectedReview.rating)}
                </div>
                <p className="text-gray-700">{selectedReview.comment}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Votre réponse</label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Rédigez votre réponse..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedReview(null);
                  setResponseText('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={submitResponse}
                disabled={isLoading || !responseText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Envoi...' : 'Envoyer la réponse'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalReviews;
