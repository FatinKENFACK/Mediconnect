import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  CalendarIcon,
  PhoneIcon,
  VideoCameraIcon,
  CurrencyEuroIcon,
  AcademicCapIcon,
  LanguageIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const specialties = [
  'Médecine générale',
  'Cardiologie',
  'Dermatologie',
  'Pédiatrie',
  'Gynécologie',
  'Ophtalmologie',
  'ORL',
  'Radiologie',
  'Neurologie',
  'Psychiatrie',
  'Rhumatologie',
  'Endocrinologie'
];



export default function SearchDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [consultationType, setConsultationType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await api.getDoctors();
        const list = Array.isArray(data) ? data : data.results || [];
        const formatted = list.map(d => ({
          id: d.id,
          name: `Dr. ${d.first_name} ${d.last_name}`,
          specialty: d.specialization || '',
          avatar: d.profile_picture
            ? `http://localhost:8000${d.profile_picture}`
            : null,
          rating: 4.8,
          reviews: 0,
          experience: `${d.experience_years} ans`,
          consultationFee: d.fee_in_person,
          languages: d.languages ? d.languages.split(',') : ['Français'],
          consultationTypes: ['Présentiel', 'En ligne'],
          availability: 'Sur rendez-vous',
          nextSlot: 'À définir',
          address: 'Mediconnet',
          distance: 'N/A',
          verified: d.is_verified,
          bio: d.bio || '',
        }));
        setDoctors(formatted);
      } catch (err) {
        console.error('Erreur chargement médecins:', err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    loadDoctors();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Rechercher un médecin
        </h1>
        <p className="text-gray-600">
          Trouvez le professionnel de santé adapté à vos besoins
        </p>
      </div>

      {/* Barre de recherche principale */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, spécialité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les spécialités</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FunnelIcon className="h-5 w-5" />
            Filtres
          </button>
        </div>

        {/* Filtres avancés */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de consultation
                </label>
                <select
                  value={consultationType}
                  onChange={(e) => setConsultationType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous les types</option>
                  <option value="En ligne">En ligne</option>
                  <option value="Présentiel">Présentiel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix maximum: {priceRange.max}€
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trier par
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="relevance">Pertinence</option>
                  <option value="rating">Meilleures notes</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Résultats */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          {filteredDoctors.length} médecin{filteredDoctors.length > 1 ? 's' : ''} trouvé{filteredDoctors.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-6">
        {loadingDoctors ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredDoctors.map(doctor => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Photo et infos principales */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  {doctor.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                      <CheckCircleIcon className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Informations détaillées */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                      {doctor.verified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Vérifié
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3">{doctor.specialty}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="font-medium text-gray-900">{doctor.rating}</span>
                        <span>({doctor.reviews} avis)</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {doctor.experience}
                      </div>

                      <div className="flex items-center gap-1">
                        <CurrencyEuroIcon className="h-4 w-4" />
                        {doctor.consultationFee} consultation
                      </div>

                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        {doctor.distance}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {doctor.consultationTypes.map(type => (
                        <span key={type} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {type === 'En ligne' ? <VideoCameraIcon className="h-3 w-3 mr-1" /> : <CalendarIcon className="h-3 w-3 mr-1" />}
                          {type}
                        </span>
                      ))}

                      {doctor.languages.map(lang => (
                        <span key={lang} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          <LanguageIcon className="h-3 w-3 mr-1" />
                          {lang}
                        </span>
                      ))}
                    </div>

                    <div className="text-sm text-gray-600">
                      <p className="mb-1">
                        <span className="font-medium">Disponibilité:</span> {doctor.availability}
                      </p>
                      <p>
                        <span className="font-medium">Prochain créneau:</span> {doctor.nextSlot}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:ml-4">
                    <Link
                      to={`/patient/medecin/${doctor.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                      Voir le profil
                    </Link>
                    <Link
                      to={`/patient/rendez-vous/nouveau?doctor=${doctor.id}`}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                    >
                      Prendre RDV
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <VideoCameraIcon className="h-4 w-4 inline mr-1" />
                      Consultation vidéo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun médecin trouvé
          </h3>
          <p className="text-gray-600">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
}
