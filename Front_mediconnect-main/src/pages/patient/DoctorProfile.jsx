import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  PhoneIcon,
  VideoCameraIcon,
  CurrencyEuroIcon,
  AcademicCapIcon,
  LanguageIcon,
  CheckCircleIcon,
  UserCircleIcon,
  BriefcaseIcon,
  TrophyIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Données mock pour le profil médecin
const doctorData = {
  1: {
    id: 1,
    name: 'Dr. Martin Dupont',
    specialty: 'Médecine générale',
    avatar: '/api/placeholder/200/200',
    rating: 4.8,
    reviews: 124,
    experience: '15 ans',
    consultationFee: 45,
    languages: ['Français', 'Anglais'],
    consultationTypes: ['En ligne', 'Présentiel'],
    address: '123 Rue de la Santé, 75000 Paris',
    distance: '2.3 km',
    verified: true,
    education: 'Université Paris Descartes',
    hospitalAffiliation: 'Hôpital Saint-Louis',
    description: 'Le Dr. Martin Dupont est un médecin généraliste expérimenté, spécialisé dans la médecine familiale et la prévention. Il prend le temps d\'écouter ses patients et offre des soins personnalisés.',
    specialties: ['Médecine familiale', 'Médecine préventive', 'Vaccination', 'Bilan de santé'],
    certifications: ['Certification en médecine générale', 'Formation en médecine d\'urgence'],
    availability: {
      monday: ['09:00-12:00', '14:00-18:00'],
      tuesday: ['09:00-12:00', '14:00-18:00'],
      wednesday: ['09:00-12:00', '14:00-18:00'],
      thursday: ['09:00-12:00', '14:00-18:00'],
      friday: ['09:00-12:00', '14:00-17:00'],
      saturday: [],
      sunday: []
    },
    nextAvailableSlots: [
      { date: '2024-01-15', time: '14:30', type: 'Présentiel' },
      { date: '2024-01-15', time: '15:00', type: 'En ligne' },
      { date: '2024-01-16', time: '09:00', type: 'Présentiel' },
      { date: '2024-01-16', time: '10:30', type: 'En ligne' }
    ]
  }
};

const reviews = [
  {
    id: 1,
    patientName: 'Marie L.',
    rating: 5,
    date: '15 Déc 2023',
    comment: 'Excellent médecin, très à l\'écoute et professionnel. Prend le temps d\'expliquer les choses clairement.',
    consultationType: 'Présentiel',
    helpful: 12
  },
  {
    id: 2,
    patientName: 'Jean M.',
    rating: 4,
    date: '08 Déc 2023',
    comment: 'Très bonne consultation en ligne. Le Dr. Dupont est compétent et rassurant.',
    consultationType: 'En ligne',
    helpful: 8
  },
  {
    id: 3,
    patientName: 'Sophie B.',
    rating: 5,
    date: '01 Déc 2023',
    comment: 'Je consulte le Dr. Dupont depuis plusieurs années. Je le recommande vivement.',
    consultationType: 'Présentiel',
    helpful: 15
  }
];

export default function DoctorProfile() {
  const { doctorId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const doctor = doctorData[doctorId];

  if (!doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Médecin non trouvé</h2>
          <p className="text-gray-600 mb-4">Le profil du médecin que vous recherchez n\'est pas disponible.</p>
          <Link to="/patient/recherche-medecins" className="text-blue-600 hover:text-blue-700">
            Retour à la recherche
          </Link>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    // Logique de réservation
    setShowBookingModal(false);
    // Rediriger vers la page de confirmation
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header avec retour */}
      <div className="mb-6">
        <Link to="/patient/recherche-medecins" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Retour à la recherche
        </Link>
      </div>

      {/* Carte principale du profil */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Photo et infos principales */}
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              {doctor.verified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
                  {doctor.verified && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Profil vérifié
                    </span>
                  )}
                </div>
                
                <p className="text-lg text-gray-600 mb-3">{doctor.specialty}</p>
                
                <p className="text-gray-700 mb-4">{doctor.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <StarIconSolid className="h-5 w-5 text-yellow-400" />
                    <div>
                      <span className="font-semibold text-gray-900">{doctor.rating}</span>
                      <span className="text-gray-500 ml-1">({doctor.reviews} avis)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{doctor.experience}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CurrencyEuroIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{doctor.consultationFee}€</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{doctor.distance}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {doctor.consultationTypes.map(type => (
                    <span key={type} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                      {type === 'En ligne' ? <VideoCameraIcon className="h-4 w-4 mr-1" /> : <CalendarIcon className="h-4 w-4 mr-1" />}
                      {type}
                    </span>
                  ))}
                  
                  {doctor.languages.map(lang => (
                    <span key={lang} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                      <LanguageIcon className="h-4 w-4 mr-1" />
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 lg:ml-4">
                <button
                  onClick={handleBooking}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Prendre rendez-vous
                </button>
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  <VideoCameraIcon className="h-4 w-4 inline mr-2" />
                  Consultation vidéo
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  <HeartIcon className="h-4 w-4 inline mr-2" />
                  Ajouter aux favoris
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'availability', 'reviews', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'overview' && 'Aperçu'}
                {tab === 'availability' && 'Disponibilités'}
                {tab === 'reviews' && 'Avis patients'}
                {tab === 'about' && 'Parcours'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  Adresse et contact
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>{doctor.address}</p>
                  <p className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    +33 1 23 45 67 89
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BriefcaseIcon className="h-5 w-5 mr-2" />
                  Spécialités
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.specialties.map(specialty => (
                    <span key={specialty} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                  Établissement
                </h3>
                <p className="text-gray-700">{doctor.hospitalAffiliation}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrophyIcon className="h-5 w-5 mr-2" />
                  Certifications
                </h3>
                <ul className="space-y-1 text-gray-700">
                  {doctor.certifications.map(cert => (
                    <li key={cert} className="flex items-center">
                      <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochains créneaux disponibles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {doctor.nextAvailableSlots.map((slot, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{slot.date}</span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {slot.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{slot.time}</p>
                    <button
                      onClick={() => handleBooking()}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      Réserver
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h4 className="font-medium text-gray-900 mb-4">Horaires habituels</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(doctor.availability).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium text-gray-700 capitalize">
                        {day === 'monday' && 'Lundi'}
                        {day === 'tuesday' && 'Mardi'}
                        {day === 'wednesday' && 'Mercredi'}
                        {day === 'thursday' && 'Jeudi'}
                        {day === 'friday' && 'Vendredi'}
                        {day === 'saturday' && 'Samedi'}
                        {day === 'sunday' && 'Dimanche'}
                      </span>
                      <span className="text-gray-600">
                        {hours.length > 0 ? hours.join(', ') : 'Fermé'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Avis des patients</h3>
                <div className="flex items-center gap-2">
                  <StarIconSolid className="h-5 w-5 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{doctor.rating}</span>
                  <span className="text-gray-500">({doctor.reviews} avis)</span>
                </div>
              </div>

              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{review.patientName}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIconSolid
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{review.date}</span>
                          <span className="flex items-center">
                            {review.consultationType === 'En ligne' ? (
                              <VideoCameraIcon className="h-3 w-3 mr-1" />
                            ) : (
                              <CalendarIcon className="h-3 w-3 mr-1" />
                            )}
                            {review.consultationType}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                        <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        Répondre
                      </button>
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                        Utile ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-2" />
                  Formation
                </h3>
                <p className="text-gray-700">{doctor.education}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BriefcaseIcon className="h-5 w-5 mr-2" />
                  Expérience professionnelle
                </h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">Médecin généraliste</h4>
                    <p className="text-gray-600">Cabinet médical privé - Paris</p>
                    <p className="text-sm text-gray-500">2015 - Présent</p>
                  </div>
                  <div className="border-l-4 border-gray-300 pl-4">
                    <h4 className="font-medium text-gray-900">Interne en médecine générale</h4>
                    <p className="text-gray-600">Hôpital Saint-Louis - Paris</p>
                    <p className="text-sm text-gray-500">2012 - 2015</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de réservation */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmer le rendez-vous</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une heure</option>
                  {doctor.nextAvailableSlots.map((slot, index) => (
                    <option key={index} value={slot.time}>
                      {slot.time}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de consultation</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner un type</option>
                  {doctor.consultationTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
