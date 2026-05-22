import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams, Link } from 'react-router-dom';
import {
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CalendarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const HospitalDetail = () => {
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const { hospitalId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  console.log('HospitalDetail - hospitalId:', hospitalId);

  const tabs = [
    { id: 'overview', name: 'Aperçu', icon: BuildingOfficeIcon },
    { id: 'services', name: 'Services', icon: HeartIcon },
    { id: 'specialties', name: 'Spécialités', icon: UserGroupIcon },
    { id: 'contact', name: 'Contact', icon: PhoneIcon }
  ];

  useEffect(() => {
    const loadHospital = async () => {
      try {
        setLoading(true);

        const response = await api.getPublicHospitalDetail(hospitalId);

        // IMPORTANT :
        // Si ton api retourne response.data
        // on récupère automatiquement les données
        const data = response.data || response;

        setHospital({
          id: data.id,
          name: data.name || 'Nom indisponible',
          type:
            data.hospital_type === 'public'
              ? 'Hôpital public'
              : data.hospital_type === 'clinic'
              ? 'Clinique privée'
              : 'Privé',
          address: data.address || 'Adresse indisponible',
          phone: data.phone || 'Non disponible',
          email: data.email || '',
          website: data.website || '',
          rating: 4.5,
          reviews: 0,
          specialties: data.specialties || [],
          services: data.services || [],
          doctors: data.doctors || 0,
          beds: data.beds || 0,
          established: data.created_at
            ? new Date(data.created_at).getFullYear()
            : 'N/A',
          distance: 'N/A',
          estimatedTime: 'N/A',
          emergency: data.emergency || false,
          coordinates: {
            lat: data.latitude || 0,
            lng: data.longitude || 0,
          },

          // Image fallback pour éviter le crash
          image:
            data.image ||
            'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1600&auto=format&fit=crop',
        });
      } catch (err) {
        console.error('Erreur chargement hôpital:', err);
        setHospital(null);
      } finally {
        setLoading(false);
      }
    };

    if (hospitalId) {
      loadHospital();
    }
  }, [hospitalId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Hôpital non trouvé
          </h1>

          <p className="text-gray-600 mb-8">
            L'hôpital que vous recherchez n'existe pas.
          </p>

          <Link
            to="/patient/recherche-hopitaux"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
          >
            Retour à la recherche
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/patient/recherche-hopitaux"
                className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowRightIcon className="h-5 w-5 mr-2 rotate-180" />
                Retour aux hôpitaux
              </Link>
            </div>

            <h1 className="text-xl font-semibold text-gray-900">
              {hospital.name}
            </h1>

            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 md:h-80">
        <img
          src={hospital.image}
          alt={hospital.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                {hospital.type}
              </span>

              <div className="flex items-center">
                <StarIcon className="h-5 w-5 text-yellow-400" />

                <span className="ml-1 text-sm font-medium">
                  {hospital.rating}
                </span>

                <span className="ml-1 text-sm text-gray-300">
                  ({hospital.reviews} avis)
                </span>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {hospital.name}
            </h1>

            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1" />
                {hospital.address}
              </div>

              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {hospital.estimatedTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
            <HeartIcon className="h-5 w-5 mr-2" />
            Urgences
          </button>

          <Link
            to="/patient/rendez-vous/nouveau"
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Prendre RDV
          </Link>

          <a
            href={`tel:${hospital.phone}`}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <PhoneIcon className="h-5 w-5 mr-2" />
            Appeler
          </a>

          <a
            href={`https://maps.google.com/?q=${hospital.coordinates.lat},${hospital.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
          >
            <MapPinIcon className="h-5 w-5 mr-2" />
            Itinéraire
          </a>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
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
                <tab.icon
                  className={`h-5 w-5 mr-2 ${
                    activeTab === tab.id
                      ? 'text-blue-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />

                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    À propos
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    {hospital.name} est un{' '}
                    {hospital.type.toLowerCase()} de référence au Cameroun.
                    Établi en {hospital.established}, notre établissement met à
                    votre disposition {hospital.beds} lits et une équipe de{' '}
                    {hospital.doctors} professionnels de santé dévoués pour vous
                    offrir les meilleurs soins médicaux.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Nos services
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hospital.services.length > 0 ? (
                    hospital.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center p-4 bg-gray-50 rounded-xl"
                      >
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />

                        <span className="text-gray-700">{service}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Aucun service disponible.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'specialties' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Spécialités médicales
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hospital.specialties.length > 0 ? (
                    hospital.specialties.map((specialty, index) => (
                      <div
                        key={index}
                        className="flex items-center p-4 bg-blue-50 rounded-xl"
                      >
                        <HeartIcon className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />

                        <span className="text-gray-700 font-medium">
                          {specialty}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Aucune spécialité disponible.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions rapides
              </h3>

              <div className="space-y-3">
                <Link
                  to="/patient/rendez-vous/nouveau"
                  className="block w-full text-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Prendre rendez-vous
                </Link>

                <a
                  href={`tel:${hospital.phone}`}
                  className="block w-full text-center px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  Appeler maintenant
                </a>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />

                <div>
                  <h4 className="font-medium text-blue-900 mb-2">
                    Certifié et accrédité
                  </h4>

                  <p className="text-sm text-blue-800">
                    Cet hôpital est agréé par le Ministère de la Santé du
                    Cameroun et respecte les normes internationales de qualité.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetail;