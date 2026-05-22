import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  StarIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  BellIcon,
  ArrowRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [todayCount, setTodayCount] = useState(0);

  const [recentReviews] = useState([
    { id: 1, patientName: 'Thomas Fotsing', rating: 5, comment: 'Excellent médecin, très professionnel', date: '2024-12-15' },
    { id: 2, patientName: 'Marie Kengne', rating: 4, comment: "Bonne consultation, à l'écoute", date: '2024-12-14' },
  ]);

  const [notifications] = useState([
    { id: 1, title: 'Nouveau rendez-vous', message: 'M. Martin souhaite prendre rendez-vous', time: 'Il y a 5 min', type: 'appointment' },
    { id: 2, title: 'Message non lu', message: 'Vous avez un nouveau message', time: 'Il y a 1 heure', type: 'message' },
  ]);

  const [weeklyData] = useState([
    { day: 'Lun', appointments: 4, consultations: 3 },
    { day: 'Mar', appointments: 6, consultations: 5 },
    { day: 'Mer', appointments: 8, consultations: 7 },
    { day: 'Jeu', appointments: 5, consultations: 4 },
    { day: 'Ven', appointments: 7, consultations: 6 },
    { day: 'Sam', appointments: 3, consultations: 2 },
    { day: 'Dim', appointments: 2, consultations: 1 },
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const doctorData = await api.getDoctorProfile();
        setDoctor(doctorData);
      } catch (err) {
        setError("Profil médecin non trouvé. Contactez l'administrateur.");
      }

      try {
        const apptData = await api.getDoctorAppointmentsToday();
        setRecentAppointments(apptData.upcoming || []);
        setTodayCount(apptData.total || 0);
      } catch (err) {
        console.error('Erreur rendez-vous:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <UserCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dr. {user?.first_name} {user?.last_name}
              </h1>
              <div className="flex items-center space-x-3 mt-1">
                {doctor?.specialization && (
                  <span className="text-gray-500 text-sm">{doctor.specialization}</span>
                )}
                {doctor?.is_verified ? (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">✓ Vérifié</span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">⏳ En attente de vérification</span>
                )}
                {doctor?.is_available && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">🟢 Disponible</span>
                )}
              </div>
            </div>
          </div>

          {/* Infos rapides */}
          {doctor && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {doctor.experience_years > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Expérience</p>
                  <p className="text-sm font-medium text-gray-900">{doctor.experience_years} ans</p>
                </div>
              )}
              {doctor.fee_in_person > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Consultation</p>
                  <p className="text-sm font-medium text-gray-900">{doctor.fee_in_person.toLocaleString()} XAF</p>
                </div>
              )}
              {doctor.fee_video > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Vidéo</p>
                  <p className="text-sm font-medium text-gray-900">{doctor.fee_video.toLocaleString()} XAF</p>
                </div>
              )}
              {doctor.languages && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Langues</p>
                  <p className="text-sm font-medium text-gray-900">{doctor.languages}</p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
               {error}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{todayCount}</p>
                <p className="text-sm text-gray-600">Rendez-vous total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Patients total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">850k</p>
                <p className="text-sm text-gray-600">XAF ce mois</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <StarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-gray-600">Note moyenne</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            {/* Rendez-vous du jour */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Rendez-vous du jour</h2>
                <Link to="/medecin/rendez-vous" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Voir tout</Link>
              </div>
              <div className="space-y-4">
                {recentAppointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Aucun rendez-vous aujourd'hui</p>
                  </div>
                ) : (
                  recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${appointment.type === 'video' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          {appointment.type === 'video'
                            ? <VideoCameraIcon className="h-5 w-5 text-blue-600" />
                            : <UserGroupIcon className="h-5 w-5 text-green-600" />
                          }
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{appointment.patient_name}</p>
                          <p className="text-sm text-gray-500">{appointment.time} — {appointment.doctor_specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {appointment.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                        </span>
                        <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Activité hebdomadaire */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Activité hebdomadaire</h2>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                    <div className="flex-1 mx-4 flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-6">
                        <div className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2" style={{ width: `${(day.appointments / 10) * 100}%` }}>
                          <span className="text-xs text-white font-medium">{day.appointments}</span>
                        </div>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6">
                        <div className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2" style={{ width: `${(day.consultations / 10) * 100}%` }}>
                          <span className="text-xs text-white font-medium">{day.consultations}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center space-x-6 mt-4">
                  <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div><span className="text-sm text-gray-600">Rendez-vous</span></div>
                  <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div><span className="text-sm text-gray-600">Consultations</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar droite */}
          <div className="space-y-8">

            {/* Avis récents */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Avis récents</h2>
                <Link to="/medecin/avis" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Voir tout</Link>
              </div>
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">{review.patientName}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(review.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">{notifications.length}</span>
              </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start">
                    <div className={`p-2 rounded-lg mr-3 ${notification.type === 'appointment' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      {notification.type === 'appointment'
                        ? <CalendarIcon className="h-4 w-4 text-blue-600" />
                        : <BellIcon className="h-4 w-4 text-green-600" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h2>
              <div className="space-y-3">
                <Link to="/medecin/consultations/nouvelle" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <VideoCameraIcon className="h-4 w-4 mr-2" />Nouvelle consultation
                </Link>
                <Link to="/medecin/creer-patient" className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <UserGroupIcon className="h-4 w-4 mr-2" />Nouveau patient
                </Link>
                <Link to="/medecin/prescriptions/nouvelle" className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />Nouvelle ordonnance
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}