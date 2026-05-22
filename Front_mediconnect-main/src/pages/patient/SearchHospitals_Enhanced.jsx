import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  StarIcon,
  PhoneIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  TruckIcon,
  HeartIcon,
  CalendarIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';



const SearchHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDistance, setSelectedDistance] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [sortedHospitals, setSortedHospitals] = useState(hospitals);

  const specialties = [
    'Cardiologie', 'Pédiatrie', 'Urgences', 'Maternité', 'Chirurgie',
    'Traumatologie', 'Neurologie', 'Dermatologie', 'Ophtalmologie',
    'ORL', 'Gynécologie', 'Obstétrique', 'Néonatalogie', 'Orthopédie'
  ];

  const types = ['Hôpital public', 'Clinique privée', 'Spécialisé'];
  const distances = ['< 2 km', '< 5 km', '< 10 km', 'Toutes'];

  useEffect(() => {
    const loadHospitals = async () => {
      try {
        const data = await api.getPublicHospitals();
        const list = Array.isArray(data) ? data : data.results || [];
        const formatted = list.map(h => ({
          id: h.id,
          name: h.name,
          type: h.hospital_type === 'public' ? 'Hôpital public'
            : h.hospital_type === 'clinic' ? 'Clinique privée'
              : h.hospital_type === 'ngo' ? 'ONG'
                : 'Privé',
          address: h.address,
          city: h.city,
          phone: h.phone,
          email: h.email,
          website: h.website || '',
          rating: 4.5,
          reviews: 0,
          distance: 'N/A',
          estimatedTime: 'N/A',
          emergency: false,
          emergencyWaitTime: 'N/A',
          specialties: [],
          services: [],
          capacity: 0,
          doctors: 0,
          public: h.hospital_type === 'public',
          parking: false,
          accessibility: false,
          coordinates: { lat: 0, lng: 0 },
          image: null,
        }));
        setHospitals(formatted);
      } catch (err) {
        console.error('Erreur chargement hôpitaux:', err);
      } finally {
        setLoadingHospitals(false);
      }
    };
    loadHospitals();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => console.log('Error getting location:', error)
      );
    }
  }, []);

  useEffect(() => {
    let filtered = hospitals;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(hospital =>
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by specialty
    if (selectedSpecialty) {
      filtered = filtered.filter(hospital =>
        hospital.specialties.includes(selectedSpecialty)
      );
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(hospital => hospital.type === selectedType);
    }

    // Filter by distance
    if (selectedDistance && selectedDistance !== 'Toutes') {
      const maxDistance = parseInt(selectedDistance.split(' ')[1]);
      filtered = filtered.filter(hospital => {
        const distance = parseFloat(hospital.distance);
        return distance < maxDistance;
      });
    }

    // Sort by distance
    filtered.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    setSortedHospitals(filtered);
  }, [searchQuery, selectedSpecialty, selectedType, selectedDistance]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('');
    setSelectedType('');
    setSelectedDistance('');
  };

  const getDistanceColor = (distance) => {
    const dist = parseFloat(distance);
    if (dist < 3) return 'text-green-600 bg-green-50';
    if (dist < 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/patient/dashboard"
                className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowRightIcon className="h-5 w-5 mr-2 rotate-180" />
                Retour
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Rechercher un hôpital</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, adresse ou spécialité..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <FunnelIcon className="h-5 w-5 mr-2" />
              Filtres
              {(selectedSpecialty || selectedType || selectedDistance) && (
                <span className="ml-2 px-2 py-1 bg-teal-600 text-white text-xs rounded-full">
                  {[selectedSpecialty, selectedType, selectedDistance].filter(Boolean).length}
                </span>
              )}
            </button>

            {userLocation && (
              <button className="inline-flex items-center px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                <MapPinIcon className="h-5 w-5 mr-2" />
                Ma position
              </button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Toutes les spécialités</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type d'établissement</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Tous les types</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
                  <select
                    value={selectedDistance}
                    onChange={(e) => setSelectedDistance(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {distances.map(distance => (
                      <option key={distance} value={distance}>{distance}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Effacer les filtres
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {sortedHospitals.length} hôpitaux trouvés
            </h2>
            <p className="text-gray-600 mt-1">
              {userLocation ? 'Proches de votre position' : 'À Yaoundé et Douala'}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ShieldCheckIcon className="h-5 w-5" />
            <span>Établissements vérifiés</span>
          </div>
        </div>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 gap-6">
          {loadingHospitals ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
            </div>
          ) : sortedHospitals.map((hospital) => (
            <div key={hospital.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col lg:flex-row">
                {/* Image */}
                <div className="lg:w-80 h-48 lg:h-auto">
                  <img
                    src={hospital.image}
                    alt={hospital.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${hospital.public ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                          {hospital.type}
                        </span>
                        {hospital.emergency && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center">
                            <HeartIcon className="h-3 w-3 mr-1" />
                            Urgences 24/7
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2">{hospital.name}</h3>

                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span>{hospital.address}</span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="font-medium">{hospital.rating}</span>
                          <span className="text-gray-500 ml-1">({hospital.reviews} avis)</span>
                        </div>

                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDistanceColor(hospital.distance)}`}>
                          {hospital.distance}
                        </div>

                        <div className="flex items-center text-gray-500">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          <span>{hospital.estimatedTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col space-y-2">
                      <Link
                        to={`/patient/hopital/${hospital.id}`}
                        className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors text-center"
                      >
                        Voir les détails
                      </Link>

                      <a
                        href={`tel:${hospital.phone}`}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors text-center"
                      >
                        Appeler
                      </a>

                      <a
                        href={`https://maps.google.com/?q=${hospital.coordinates.lat},${hospital.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors text-center"
                      >
                        Itinéraire
                      </a>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Spécialités principales</h4>
                    <div className="flex flex-wrap gap-2">
                      {hospital.specialties.slice(0, 4).map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {specialty}
                        </span>
                      ))}
                      {hospital.specialties.length > 4 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          +{hospital.specialties.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Services disponibles</h4>
                    <div className="flex flex-wrap gap-2">
                      {hospital.services.slice(0, 3).map((service, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600">
                          <CheckCircleIcon className="h-3 w-3 text-green-500 mr-1" />
                          {service}
                        </div>
                      ))}
                      {hospital.services.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{hospital.services.length - 3} services
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Emergency Info */}
                  {hospital.emergency && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-red-800">
                          <HeartIcon className="h-5 w-5 mr-2" />
                          <span className="font-medium">Service d'urgence</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-red-600 font-medium">
                            Attente: {hospital.emergencyWaitTime}
                          </div>
                          <a href={`tel:${hospital.emergency}`} className="text-xs text-red-600 hover:underline">
                            {hospital.emergency}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Side Info */}
                <div className="lg:w-64 bg-gray-50 p-6 border-l border-gray-200">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{hospital.capacity}</div>
                      <div className="text-sm text-gray-600">Lits disponibles</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{hospital.doctors}</div>
                      <div className="text-sm text-gray-600">Médecins</div>
                    </div>

                    <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                      {hospital.parking && (
                        <div className="flex items-center">
                          <TruckIcon className="h-4 w-4 mr-1" />
                          Parking
                        </div>
                      )}
                      {hospital.accessibility && (
                        <div className="flex items-center">
                          <HeartIcon className="h-4 w-4 mr-1" />
                          Accès PMR
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">Contact principal</div>
                      <a href={`tel:${hospital.phone}`} className="text-lg font-semibold text-teal-600 hover:text-teal-700">
                        {hospital.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {sortedHospitals.length === 0 && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun hôpital trouvé</h3>
            <p className="text-gray-600 mb-4">
              Essayez d'élargir vos critères de recherche
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchHospitals;
