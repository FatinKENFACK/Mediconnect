import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  CalendarIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  ClockIcon,
  VideoCameraIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const HospitalDashboard = () => {
  const { user } = useAuth();
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats] = useState({
    totalDoctors: 12,
    totalPatients: 1248,
    todayAppointments: 8,
    pendingReviews: 5,
    unreadMessages: 3,
    monthlyRevenue: 45600,
    upcomingAppointments: [
      { id: 1, patient: 'Jean Dupont', doctor: 'Dr. Martin', time: '09:00', service: 'Cardiologie' },
      { id: 2, patient: 'Marie Laurent', doctor: 'Dr. Bernard', time: '10:30', service: 'Pédiatrie' },
      { id: 3, patient: 'Pierre Dubois', doctor: 'Dr. Petit', time: '14:00', service: 'Radiologie' },
    ]
  });

  const [recentActivities] = useState([
    { id: 1, type: 'appointment', message: 'Nouveau rendez-vous avec Dr. Martin', time: 'Il y a 5 min', icon: CalendarIcon },
    { id: 2, type: 'review', message: 'Nouvel avis laissé par Patient Jean Dupont', time: 'Il y a 1h', icon: StarIcon },
    { id: 3, type: 'message', message: 'Message reçu de Patient Marie Laurent', time: 'Il y a 2h', icon: ChatBubbleLeftRightIcon },
    { id: 4, type: 'doctor', message: "Dr. Sophie Bernard a rejoint l'équipe", time: 'Il y a 3h', icon: UserGroupIcon },
    { id: 5, type: 'payment', message: 'Paiement reçu pour consultation', time: 'Il y a 4h', icon: CurrencyDollarIcon },
  ]);

  const [topServices] = useState([
    { name: 'Cardiologie', consultations: 156, growth: 8.2 },
    { name: 'Pédiatrie', consultations: 142, growth: 12.1 },
    { name: 'Radiologie', consultations: 98, growth: 5.7 },
    { name: 'Gynécologie', consultations: 87, growth: 9.3 },
  ]);

  useEffect(() => {
    const loadHospitalProfile = async () => {
      try {
        const data = await api.getHospitalProfile();
        setHospital(data);
      } catch (err) {
        console.error('Erreur chargement profil hôpital:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHospitalProfile();
  }, []);

  const statCards = [
    { title: 'Médecins actifs', value: stats.totalDoctors, icon: UserGroupIcon, color: 'bg-blue-500', link: '/hopital/medecins' },
    { title: 'Patients totaux', value: stats.totalPatients.toLocaleString(), icon: BuildingOfficeIcon, color: 'bg-green-500', link: '/hopital/dossiers-patients' },
    { title: "Rendez-vous aujourd'hui", value: stats.todayAppointments, icon: CalendarIcon, color: 'bg-purple-500', link: '/hopital/rendez-vous' },
    { title: 'Avis en attente', value: stats.pendingReviews, icon: StarIcon, color: 'bg-yellow-500', link: '/hopital/avis' },
    { title: 'Messages non lus', value: stats.unreadMessages, icon: ChatBubbleLeftRightIcon, color: 'bg-indigo-500', link: '/hopital/messagerie' },
    { title: 'Revenu mensuel', value: `${stats.monthlyRevenue.toLocaleString()} FCFA`, icon: CurrencyDollarIcon, color: 'bg-pink-500', link: '/hopital/statistiques' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header avec infos réelles */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {hospital?.name || user?.first_name || 'Tableau de bord'}
            </h1>
            <div className="flex items-center space-x-4 mt-1">
              {hospital?.city && (
                <p className="text-gray-500 text-sm">📍 {hospital.city}, {hospital.region}</p>
              )}
              {hospital?.hospital_type && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full capitalize">
                  {hospital.hospital_type}
                </span>
              )}
              {hospital?.is_verified ? (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">✓ Vérifié</span>
              ) : (
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">⏳ En attente de vérification</span>
              )}
            </div>
          </div>
        </div>

        {/* Infos de contact */}
        {hospital && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {hospital.phone && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Téléphone</p>
                <p className="text-sm font-medium text-gray-900">{hospital.phone}</p>
              </div>
            )}
            {hospital.email && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{hospital.email}</p>
              </div>
            )}
            {hospital.address && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">Adresse</p>
                <p className="text-sm font-medium text-gray-900">{hospital.address}</p>
              </div>
            )}
            {hospital.registration_number && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">N° Enregistrement</p>
                <p className="text-sm font-medium text-gray-900">{hospital.registration_number}</p>
              </div>
            )}
            {hospital.registration_code && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-500 font-medium">🔑 Code d'inscription médecin</p>
                <p className="text-lg font-bold text-blue-700 tracking-widest">{hospital.registration_code}</p>
                <p className="text-xs text-blue-400 mt-1">À transmettre à vos médecins</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link key={index} to={stat.link} className="block">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Rendez-vous d'aujourd'hui</h2>
              <p className="text-sm text-gray-600 mt-1">{stats.upcomingAppointments.length} consultations prévues</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {stats.upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CalendarIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patient}</p>
                        <p className="text-sm text-gray-600">{appointment.doctor} - {appointment.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                      <button className="text-sm text-blue-600 hover:text-blue-800 mt-1">Voir détails</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/hopital/rendez-vous" className="text-blue-600 hover:text-blue-800 font-medium">
                  Voir tous les rendez-vous
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Activités récentes</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <activity.icon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Services les plus consultés</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.consultations} consultations</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(service.consultations / 156) * 100}%` }} />
                    </div>
                  </div>
                  <p className={`ml-4 text-sm font-medium ${service.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {service.growth > 0 ? '+' : ''}{service.growth}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Actions rapides</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link to="/hopital/ajouter-medecin" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <UserGroupIcon className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 text-center">Ajouter un médecin</span>
              </Link>
              <Link to="/hopital/rendez-vous" className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <CalendarIcon className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 text-center">Rendez-vous</span>
              </Link>
              <Link to="/hopital/ajouter-service" className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <HeartIcon className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 text-center">Ajouter un service</span>
              </Link>
              <Link to="/hopital/consultations-video" className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                <VideoCameraIcon className="h-8 w-8 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900 text-center">Consultation vidéo</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;