import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  StarIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const SearchHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortedHospitals, setSortedHospitals] = useState([]);

  const types = ['Hôpital public', 'Clinique privée', 'ONG', 'Privé'];

  // Liste des spécialités calculée dynamiquement à partir des hôpitaux chargés
  // (plus de liste figée en dur — reflète les vraies spécialités disponibles)
  const availableSpecialties = Array.from(
    new Set(hospitals.flatMap(h => h.specialties))
  ).sort();

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
          rating: h.average_rating,          // null si aucun avis — géré à l'affichage
          reviews: h.total_reviews || 0,
          specialties: h.specialties || [],
          services: (h.services_list || []).map(s => s.name),
          doctors: h.total_doctors || 0,
          public: h.hospital_type === 'public',
        }));
        setHospitals(formatted);
      } catch (err) {
        console.error('Erreur chargement hôpitaux:', err);
      } finally {
        setLoadingHospitals(false);
      }
    };
    loadHospitals();
  }, []);

  useEffect(() => {
    let filtered = hospitals;

    if (searchQuery) {
      filtered = filtered.filter(hospital =>
        hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hospital.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(hospital =>
        hospital.specialties.includes(selectedSpecialty)
      );
    }

    if (selectedType) {
      filtered = filtered.filter(hospital => hospital.type === selectedType);
    }

    setSortedHospitals(filtered);
  }, [hospitals, searchQuery, selectedSpecialty, selectedType]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('');
    setSelectedType('');
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
              {(selectedSpecialty || selectedType) && (
                <span className="ml-2 px-2 py-1 bg-teal-600 text-white text-xs rounded-full">
                  {[selectedSpecialty, selectedType].filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Toutes les spécialités</option>
                    {availableSpecialties.map(specialty => (
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
                {/* Icône à la place d'une photo (aucune image stockée pour l'instant) */}
                <div className="lg:w-48 h-40 lg:h-auto bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                  <BuildingOfficeIcon className="h-16 w-16 text-teal-500" />
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
                    <div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${hospital.public ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                        {hospital.type}
                      </span>

                      <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">{hospital.name}</h3>

                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span>{hospital.address}, {hospital.city}</span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                          {hospital.rating !== null ? (
                            <>
                              <StarIconSolid className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="font-medium">{hospital.rating}</span>
                              <span className="text-gray-500 ml-1">({hospital.reviews} avis)</span>
                            </>
                          ) : (
                            <span className="text-gray-400 text-xs">Pas encore d'avis</span>
                          )}
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

                      {hospital.phone && (
                        <a
                          href={`tel:${hospital.phone}`}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors text-center"
                        >
                          Appeler
                        </a>
                      )}

                      {/* Itinéraire via recherche d'adresse textuelle — fonctionne sans coordonnées GPS stockées */}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hospital.address}, ${hospital.city}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors text-center"
                      >
                        Itinéraire
                      </a>
                    </div>
                  </div>

                  {/* Specialties */}
                  {hospital.specialties.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Spécialités disponibles</h4>
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
                  )}

                  {/* Services */}
                  {hospital.services.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Services proposés</h4>
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
                  )}
                </div>

                {/* Side Info — uniquement des données réelles */}
                <div className="lg:w-56 bg-gray-50 p-6 border-l border-gray-200 flex-shrink-0">
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{hospital.doctors}</div>
                      <div className="text-sm text-gray-600">Médecin{hospital.doctors > 1 ? 's' : ''}</div>
                    </div>

                    {hospital.phone && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600 mb-2">Contact principal</div>
                        <a href={`tel:${hospital.phone}`} className="text-lg font-semibold text-teal-600 hover:text-teal-700">
                          {hospital.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {!loadingHospitals && sortedHospitals.length === 0 && (
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