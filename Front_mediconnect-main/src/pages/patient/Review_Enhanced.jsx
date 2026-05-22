import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  StarIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ShieldCheckIcon,
  ClockIcon,
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, HandThumbUpIcon as HandThumbUpIconSolid } from '@heroicons/react/24/solid';

export default function Review() {
  const location = useLocation();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [recommend, setRecommend] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [errors, setErrors] = useState({});

  // Mock consultation data avec contexte camerounais
  const consultation = location.state?.consultation || {
    id: 'CONS-2024-001',
    doctor: {
      name: 'Dr. Martin Tchinda',
      specialty: 'Médecine générale',
      avatar: '/api/placeholder/100/100',
      phone: '+237 699 123 456',
      hospital: 'Hôpital Central Yaoundé'
    },
    date: '15 Décembre 2023',
    time: '14:30',
    type: 'En ligne',
    duration: '30 minutes'
  };

  // Catégories d'évaluation spécifiques
  const ratingCategories = [
    { id: 'professionalism', label: 'Professionnalisme', description: 'Compétence et savoir-faire' },
    { id: 'communication', label: 'Communication', description: 'Clarté des explications' },
    { id: 'punctuality', label: 'Ponctualité', description: 'Respect des horaires' },
    { id: 'environment', label: 'Environnement', description: 'Propreté et confort' },
    { id: 'satisfaction', label: 'Satisfaction globale', description: 'Expérience générale' }
  ];

  const [categoryRatings, setCategoryRatings] = useState({
    professionalism: 0,
    communication: 0,
    punctuality: 0,
    environment: 0,
    satisfaction: 0
  });

  const validateForm = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = 'Veuillez attribuer une note générale';
    }

    if (Object.values(categoryRatings).some(r => r === 0)) {
      newErrors.categories = 'Veuillez évaluer toutes les catégories';
    }

    if (!comment.trim()) {
      newErrors.comment = 'Veuillez laisser un commentaire';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'Le commentaire doit contenir au moins 10 caractères';
    }

    if (!recommend) {
      newErrors.recommend = 'Veuillez indiquer si vous recommandez ce médecin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simuler la soumission
    setTimeout(() => {
      setIsSubmitting(false);
      setReviewComplete(true);
    }, 2000);
  };

  const handleCategoryRating = (category, value) => {
    setCategoryRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const getAverageRating = () => {
    const values = Object.values(categoryRatings);
    const validValues = values.filter(v => v > 0);
    if (validValues.length === 0) return 0;
    return validValues.reduce((a, b) => a + b, 0) / validValues.length;
  };

  if (reviewComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <StarIconSolid className="h-12 w-12 text-yellow-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Merci pour votre avis!</h2>
            <p className="text-gray-600 mb-6">
              Votre évaluation a été enregistrée et aidera d'autres patients à faire le bon choix.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-3">Résumé de votre avis</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Note générale</span>
                  <div className="flex items-center">
                    <StarIconSolid className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{rating}/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Recommandation</span>
                  <span className="font-medium text-green-600">
                    {recommend === 'yes' ? 'Oui' : 'Non'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Médecin</span>
                  <span className="font-medium">{consultation.doctor.name}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/patient/rendez-vous"
                className="block w-full px-4 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
              >
                Voir mes rendez-vous
              </Link>
              <Link
                to="/patient/dashboard"
                className="block w-full px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Retour au tableau de bord
              </Link>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-start space-x-3">
                <HeartIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Votre avis compte!</p>
                  <p>Il contribue à améliorer la qualité des soins au Cameroun.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/patient/rendez-vous"
                className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Retour
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Évaluer la consultation</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Review Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Votre évaluation</h2>
                <p className="mt-2 text-gray-600">
                  Partagez votre expérience pour aider la communauté
                </p>
              </div>
              
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Overall Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Note générale <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-colors"
                        >
                          <StarIcon
                            className={`h-8 w-8 ${
                              star <= (hoverRating || rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-3 text-sm text-gray-600">
                        {rating > 0 && `${rating}/5`}
                      </span>
                    </div>
                    {errors.rating && (
                      <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                    )}
                  </div>

                  {/* Category Ratings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Évaluation détaillée <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-4">
                      {ratingCategories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{category.label}</div>
                            <div className="text-sm text-gray-500">{category.description}</div>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => handleCategoryRating(category.id, star)}
                                className="p-1 transition-colors"
                              >
                                <StarIcon
                                  className={`h-6 w-6 ${
                                    star <= categoryRatings[category.id]
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.categories && (
                      <p className="mt-2 text-sm text-red-600">{errors.categories}</p>
                    )}
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre commentaire <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={5}
                      placeholder="Décrivez votre expérience avec ce médecin..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <div className="mt-1 text-sm text-gray-500">
                      {comment.length}/500 caractères
                    </div>
                    {errors.comment && (
                      <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
                    )}
                  </div>

                  {/* Recommendation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Recommanderiez-vous ce médecin? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-300 transition-colors">
                        <input
                          type="radio"
                          name="recommend"
                          value="yes"
                          checked={recommend === 'yes'}
                          onChange={(e) => setRecommend(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                          recommend === 'yes' ? 'border-green-600 bg-green-600' : 'border-gray-300'
                        }`}>
                          {recommend === 'yes' && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <HandThumbUpIcon className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-medium">Oui, je recommande</span>
                        </div>
                      </label>
                      
                      <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-red-300 transition-colors">
                        <input
                          type="radio"
                          name="recommend"
                          value="no"
                          checked={recommend === 'no'}
                          onChange={(e) => setRecommend(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                          recommend === 'no' ? 'border-red-600 bg-red-600' : 'border-gray-300'
                        }`}>
                          {recommend === 'no' && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <HandThumbDownIcon className="h-5 w-5 text-red-600 mr-2" />
                          <span className="font-medium">Non</span>
                        </div>
                      </label>
                    </div>
                    {errors.recommend && (
                      <p className="mt-1 text-sm text-red-600">{errors.recommend}</p>
                    )}
                  </div>

                  {/* Anonymous Option */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                      Publier cet avis anonymement
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Envoi en cours...
                        </span>
                      ) : (
                        'Envoyer mon avis'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Consultation Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation évaluée</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{consultation.doctor.name}</h4>
                    <p className="text-sm text-gray-600">{consultation.doctor.specialty}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{consultation.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Heure</span>
                    <span className="font-medium">{consultation.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">{consultation.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Établissement</span>
                    <span className="font-medium">{consultation.doctor.hospital}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Guide */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h4 className="font-medium text-yellow-900 mb-3">Guide d'évaluation</h4>
              <div className="space-y-2 text-sm text-yellow-800">
                <div className="flex items-center">
                  <span className="font-medium mr-2">5 étoiles:</span>
                  <span>Excellent</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">4 étoiles:</span>
                  <span>Très bon</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">3 étoiles:</span>
                  <span>Bon</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">2 étoiles:</span>
                  <span>Moyen</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">1 étoile:</span>
                  <span>Mauvais</span>
                </div>
              </div>
            </div>

            {/* Privacy Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Confidentialité</h4>
                  <p className="text-sm text-blue-800">
                    Votre avis sera publié de manière anonyme si vous le souhaitez. 
                    Les informations personnelles ne seront jamais partagées.
                  </p>
                </div>
              </div>
            </div>

            {/* Current Rating Preview */}
            {rating > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h4 className="font-medium text-gray-900 mb-3">Votre note actuelle</h4>
                <div className="flex items-center justify-center mb-2">
                  <StarIconSolid className="h-8 w-8 text-yellow-400" />
                  <span className="ml-2 text-2xl font-bold text-gray-900">{rating}</span>
                  <span className="text-gray-500">/5</span>
                </div>
                {getAverageRating() > 0 && (
                  <div className="text-center text-sm text-gray-600">
                    Moyenne détaillée: {getAverageRating().toFixed(1)}/5
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
