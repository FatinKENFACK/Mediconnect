import React, { useState } from 'react';
import api from '../../services/api';
import { useLocation, Link } from 'react-router-dom';
import {
  StarIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  UserCircleIcon,
  ClockIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  PaperAirplaneIcon,
  HandThumbUpIcon,
  HandThumbDownIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function Review() {
  const location = useLocation();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [anonymize, setAnonymize] = useState(false);
  const [recommend, setRecommend] = useState(null);
  const [aspects, setAspects] = useState({
    professionalism: 0,
    communication: 0,
    punctuality: 0,
    environment: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const consultation = location.state?.consultation || null;

  // Garde-fou — après tous les hooks
  if (!consultation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <StarIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Aucune consultation sélectionnée
        </h2>
        <p className="text-gray-500 mb-6">
          Pour donner un avis, accédez à vos rendez-vous terminés et cliquez sur "Donner un avis".
        </p>
        <Link
          to="/patient/rendez-vous"
          className="inline-flex items-center px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Voir mes rendez-vous
        </Link>
      </div>
    );
  }
  const validateForm = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = 'Veuillez sélectionner une note générale';
    }

    if (review.trim().length < 10) {
      newErrors.review = 'Votre avis doit contenir au moins 10 caractères';
    }

    if (review.trim().length > 1000) {
      newErrors.review = 'Votre avis ne doit pas dépasser 1000 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await api.createReview({
        doctor: consultation.doctor.id,
        appointment: consultation.appointmentId || null,
        rating: rating,
        comment: review,
      });
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: err.message || 'Erreur lors de la publication de l\'avis.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAspectRating = (aspect, value) => {
    setAspects(prev => ({
      ...prev,
      [aspect]: value
    }));
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Merci pour votre avis !
          </h1>

          <p className="text-gray-600 mb-8">
            Votre évaluation a été publiée avec succès. Elle aidera d'autres patients à faire leur choix.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Votre avis</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIconSolid
                    key={i}
                    className="h-5 w-5 text-yellow-400"
                  />
                ))}
              </div>
              <span className="font-medium">{rating}/5</span>
            </div>
            <p className="text-gray-700">{review}</p>
          </div>

          <div className="flex gap-4 justify-center">
            <Link
              to={`/patient/medecin/${consultation.doctor.id}`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voir le profil du médecin
            </Link>
            <Link
              to="/patient/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/patient/rendez-vous" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Retour aux rendez-vous
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Évaluer la consultation
        </h1>
        <p className="text-gray-600">
          Partagez votre expérience pour aider la communauté
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informations de la consultation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultation évaluée</h2>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={consultation.doctor.avatar}
                alt={consultation.doctor.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">{consultation.doctor.name}</h3>
                <p className="text-sm text-gray-600">{consultation.doctor.specialty}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">{consultation.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Heure:</span>
                <span className="font-medium text-gray-900">{consultation.time}</span>
              </div>
              <div className="flex items-center gap-3">
                {consultation.type === 'En ligne' ? (
                  <VideoCameraIcon className="h-4 w-4 text-gray-400" />
                ) : (
                  <UserCircleIcon className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-gray-900">{consultation.type}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Votre avis compte</p>
                  <p>Il aide d'autres patients à choisir le bon médecin et permet aux médecins d'améliorer leurs services.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire d'évaluation */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Note générale */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Note générale
                <span className="text-red-500 ml-1">*</span>
              </h2>

              <div className="flex items-center gap-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRating(i + 1)}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-colors"
                    >
                      <StarIcon
                        className={`h-8 w-8 ${i < (hoverRating || rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-400'
                          }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-lg font-medium text-gray-700">
                  {rating > 0 ? `${rating}/5` : 'Sélectionnez une note'}
                </span>
              </div>

              {errors.rating && (
                <p className="mt-2 text-sm text-red-600">{errors.rating}</p>
              )}

              <div className="mt-4 flex gap-4 text-sm text-gray-600">
                <span>1 = Très mécontent</span>
                <span>5 = Très satisfait</span>
              </div>
            </div>

            {/* Évaluation par aspects */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Évaluation détaillée
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Professionnalisme
                    </label>
                    <span className="text-sm text-gray-600">
                      {aspects.professionalism > 0 ? `${aspects.professionalism}/5` : 'Non noté'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAspectRating('professionalism', i + 1)}
                        className="p-1"
                      >
                        <StarIcon
                          className={`h-6 w-6 ${i < aspects.professionalism
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-400'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Communication
                    </label>
                    <span className="text-sm text-gray-600">
                      {aspects.communication > 0 ? `${aspects.communication}/5` : 'Non noté'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAspectRating('communication', i + 1)}
                        className="p-1"
                      >
                        <StarIcon
                          className={`h-6 w-6 ${i < aspects.communication
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-400'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Ponctualité
                    </label>
                    <span className="text-sm text-gray-600">
                      {aspects.punctuality > 0 ? `${aspects.punctuality}/5` : 'Non noté'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAspectRating('punctuality', i + 1)}
                        className="p-1"
                      >
                        <StarIcon
                          className={`h-6 w-6 ${i < aspects.punctuality
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-400'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Environnement
                    </label>
                    <span className="text-sm text-gray-600">
                      {aspects.environment > 0 ? `${aspects.environment}/5` : 'Non noté'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAspectRating('environment', i + 1)}
                        className="p-1"
                      >
                        <StarIcon
                          className={`h-6 w-6 ${i < aspects.environment
                            ? 'text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-400'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Commentaire détaillé */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Votre commentaire
                <span className="text-red-500 ml-1">*</span>
              </h2>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Décrivez votre expérience lors de cette consultation. Qu'est-ce qui s'est bien passé ? Qu'est-ce qui pourrait être amélioré ?"
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.review ? 'border-red-500' : 'border-gray-300'
                  }`}
              />

              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {review.length}/1000 caractères
                </span>
                {errors.review && (
                  <p className="text-sm text-red-600">{errors.review}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={anonymize}
                    onChange={(e) => setAnonymize(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Publier cet avis anonymement
                  </span>
                </label>
              </div>
            </div>

            {/* Recommandation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recommanderiez-vous ce médecin ?
              </h2>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRecommend(true)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-colors ${recommend === true
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                >
                  <HandThumbUpIcon className="h-5 w-5" />
                  Oui, je recommande
                </button>

                <button
                  type="button"
                  onClick={() => setRecommend(false)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg border-2 transition-colors ${recommend === false
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                >
                  <HandThumbDownIcon className="h-5 w-5" />
                  Non, je ne recommande pas
                </button>
              </div>
            </div>

            {/* Informations importantes */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Important</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Soyez honnête et objectif dans votre évaluation</li>
                    <li>Ne partagez pas d'informations médicales personnelles</li>
                    <li>Respectez la confidentialité et la vie privée</li>
                    <li>Les avis sont modérés avant publication</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="flex gap-4">
              {errors.submit && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.submit}
                </div>
              )}
              <Link
                to="/patient/rendez-vous"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-5 w-5" />
                    Publier mon avis
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
