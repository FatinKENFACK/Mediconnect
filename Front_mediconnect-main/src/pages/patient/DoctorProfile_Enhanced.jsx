import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HeartIcon,
  UserGroupIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  PlayIcon,
  PauseIcon,
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  TrophyIcon,
  ShieldCheckIcon,
  VideoCameraIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

export default function DoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('presentiel');
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock doctor data avec contexte camerounais
  const doctor = {
    id: doctorId || '1',
    name: 'Dr. Martin Tchinda',
    specialty: 'Médecine générale',
    subspecialty: 'Médecine interne',
    experience: '12 ans',
    education: [
      {
        degree: 'Doctorat en Médecine',
        university: 'Université de Yaoundé I',
        year: '2012',
        country: 'Cameroun'
      },
      {
        degree: 'Spécialisation en Médecine Interne',
        university: 'Hôpital Central Yaoundé',
        year: '2015',
        country: 'Cameroun'
      }
    ],
    languages: ['Français', 'Anglais', 'Bassa', 'Ewondo'],
    hospitals: [
      {
        name: 'Hôpital Central Yaoundé',
        address: 'Avenue Charles Atangana, Yaoundé',
        type: 'Principal'
      },
      {
        name: 'Clinique des Basseurs Douala',
        address: 'Rue des Basseurs, Douala',
        type: 'Secondaire'
      }
    ],
    contact: {
      phone: '+237 699 123 456',
      email: 'martin.tchinda@mediconnet.cm',
      website: 'www.drtchinda-medecin.cm'
    },
    pricing: {
      consultation: '5000 XAF',
      video: '6000 XAF',
      followUp: '3000 XAF',
      emergency: '15000 XAF'
    },
    availability: {
      monday: { morning: true, afternoon: true, evening: false },
      tuesday: { morning: true, afternoon: true, evening: false },
      wednesday: { morning: true, afternoon: true, evening: false },
      thursday: { morning: true, afternoon: true, evening: false },
      friday: { morning: true, afternoon: true, evening: false },
      saturday: { morning: false, afternoon: false, evening: false },
      sunday: { morning: false, afternoon: false, evening: false }
    },
    stats: {
      consultations: 3456,
      patients: 1890,
      rating: 4.8,
      reviews: 342,
      responseTime: '2 heures'
    },
    specialties: [
      'Médecine générale',
      'Cardiologie',
      'Diabétologie',
      'Hypertension artérielle',
      'Maladies infectieuses',
      'Médecine préventive'
    ],
    services: [
      'Consultation en présentiel',
      'Consultation par visioconférence',
      'Suivi des maladies chroniques',
      'Bilans de santé',
      'Vaccination',
      'Certificats médicaux'
    ],
    achievements: [
      {
        title: 'Meilleur médecin généraliste 2023',
        organization: 'Association Médicale du Cameroun',
        year: 2023
      },
      {
        title: 'Prix d\'excellence en soins primaires',
        organization: 'Ministère de la Santé',
        year: 2022
      }
    ],
    image: 'https://images.unsplash.com/photo-1612369422597-49d9338abedd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    verified: true
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const tabs = [
    { id: 'overview', name: 'Aperçu', icon: UserGroupIcon },
    { id: 'availability', name: 'Disponibilités', icon: CalendarIcon },
    { id: 'reviews', name: 'Avis patients', icon: StarIcon },
    { id: 'career', name: 'Parcours', icon: AcademicCapIcon }
  ];

  const reviews = [
    {
      id: 1,
      patientName: 'Thomas F.',
      date: '10 Décembre 2023',
      rating: 5,
      comment: 'Excellent médecin, très professionnel et à l\'écoute. Prend le temps d\'expliquer les choses clairement.',
      helpful: 15
    },
    {
      id: 2,
      patientName: 'Marie K.',
      date: '5 Décembre 2023',
      rating: 4,
      comment: 'Très satisfait de ma consultation. Le Dr. Tchinda est compétent et gentil.',
      helpful: 12
    },
    {
      id: 3,
      patientName: 'Jean M.',
      date: '28 Novembre 2023',
      rating: 5,
      comment: 'Meilleur médecin que j\'ai consulté au Cameroun. Je recommande vivement!',
      helpful: 18
    }
  ];

  const handleBooking = () => {
    navigate('/patient/rendez-vous/nouveau', {
      state: {
        doctor: {
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty
        }
      }
    });
  };

  const handleVideoCall = () => {
    navigate('/patient/consultation-video', {
      state: {
        doctor: {
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty
        }
      }
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getAvailabilityColor = (available) => {
    return available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/patient/recherche-medecins"
                className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Retour
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Profil du médecin</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="flex flex-col lg:flex-row">
            {/* Image and Basic Info */}
            <div className="lg:w-96 h-64 lg:h-auto">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 p-6 lg:p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full flex items-center justify-center">
                      <UserGroupIcon className="h-8 w-8 text-white" />
                    </div>
                    {doctor.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                        <ShieldCheckIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{doctor.name}</h2>
                    <p className="text-gray-600">{doctor.specialty}</p>
                    <p className="text-sm text-gray-500">{doctor.subspecialty}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <BookmarkIcon className={`h-6 w-6 ${isBookmarked ? 'text-blue-600' : 'text-gray-400'}`} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ShareIcon className="h-6 w-6 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Rating and Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <div className="flex justify-center mb-2">
                    {renderStars(Math.floor(doctor.stats.rating))}
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{doctor.stats.rating}</div>
                  <div className="text-sm text-gray-600">{doctor.stats.reviews} avis</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <UserGroupIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{doctor.stats.patients.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Patients</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <CalendarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{doctor.stats.consultations.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Consultations</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <ClockIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{doctor.stats.responseTime}</div>
                  <div className="text-sm text-gray-600">Temps de réponse</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleBooking}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  Prendre RDV
                </button>
                <button
                  onClick={handleVideoCall}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
                >
                  <VideoCameraIcon className="h-5 w-5 mr-2" />
                  Visioconsultation
                </button>
                <a
                  href={`tel:${doctor.contact.phone}`}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
                >
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  Appeler
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <span>{doctor.contact.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    <span>{doctor.contact.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                    <span>{doctor.contact.website}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    <span>{doctor.hospitals[0].name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{doctor.hospitals[0].address}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <HeartIcon className="h-4 w-4 mr-2" />
                    <span>{doctor.experience} d'expérience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 mr-2 ${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* About */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">À propos</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Le Dr. {doctor.name} est un médecin généraliste expérimenté basé à Yaoundé. 
                    Avec {doctor.experience} d'expérience, il se spécialise dans le diagnostic 
                    et le traitement des maladies courantes ainsi que la médecine préventive. 
                    Il est passionné par son métier et s'engage à offrir des soins de qualité 
                    à tous ses patients.
                  </p>
                </div>

                {/* Specialties */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Spécialités médicales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {doctor.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center p-3 bg-blue-50 rounded-xl">
                        <CheckCircleIcon className="h-5 w-5 text-blue-600 mr-3" />
                        <span className="text-gray-700">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Services proposés</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {doctor.services.map((service, index) => (
                      <div key={index} className="flex items-center p-3 bg-green-50 rounded-xl">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Langues parlées</h3>
                  <div className="flex flex-wrap gap-3">
                    {doctor.languages.map((language, index) => (
                      <span key={index} className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Tarifs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Consultation présentiel</span>
                        <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{doctor.pricing.consultation}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Visioconsultation</span>
                        <VideoCameraIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{doctor.pricing.video}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Suivi</span>
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{doctor.pricing.followUp}</div>
                    </div>
                    <div className="bg-red-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Urgence</span>
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="text-2xl font-bold text-red-600">{doctor.pricing.emergency}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Horaires de consultation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(doctor.availability).map(([day, times]) => {
                      const dayNames = {
                        monday: 'Lundi',
                        tuesday: 'Mardi',
                        wednesday: 'Mercredi',
                        thursday: 'Jeudi',
                        friday: 'Vendredi',
                        saturday: 'Samedi',
                        sunday: 'Dimanche'
                      };
                      
                      return (
                        <div key={day} className="space-y-2">
                          <div className="font-medium text-gray-900">{dayNames[day]}</div>
                          <div className="flex space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(times.morning)}`}>
                              Matin
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(times.afternoon)}`}>
                              Aprés-midi
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(times.evening)}`}>
                              Soir
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Lieux de consultation</h3>
                  <div className="space-y-4">
                    {doctor.hospitals.map((hospital, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{hospital.name}</h4>
                            <p className="text-gray-600 text-sm mt-1">{hospital.address}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            hospital.type === 'Principal' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {hospital.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Avis des patients</h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(Math.floor(doctor.stats.rating))}
                      <span className="ml-2 text-lg font-medium text-gray-900">{doctor.stats.rating}</span>
                    </div>
                    <span className="text-gray-600">({doctor.stats.reviews} avis)</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="font-medium text-gray-900">{review.patientName}</div>
                          <div className="text-sm text-gray-500">{review.date}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-600">{review.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{review.comment}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <HeartIcon className="h-4 w-4 mr-1" />
                          <span>{review.helpful} personnes ont trouvé cet avis utile</span>
                        </div>
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          Signaler
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Tab */}
            {activeTab === 'career' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Formation et diplômes</h3>
                  <div className="space-y-4">
                    {doctor.education.map((edu, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                            <p className="text-gray-600 text-sm mt-1">{edu.university}</p>
                            <p className="text-gray-500 text-sm">{edu.country}</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {edu.year}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Récompenses et reconnaissances</h3>
                  <div className="space-y-4">
                    {doctor.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center p-4 bg-yellow-50 rounded-xl">
                        <TrophyIcon className="h-8 w-8 text-yellow-600 mr-4" />
                        <div>
                          <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                          <p className="text-gray-600 text-sm">{achievement.organization}</p>
                          <p className="text-gray-500 text-sm">{achievement.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
