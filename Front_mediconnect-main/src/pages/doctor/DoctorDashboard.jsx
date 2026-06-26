import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  CalendarIcon, UserGroupIcon, CurrencyDollarIcon,
  StarIcon, VideoCameraIcon, DocumentTextIcon,
  BellIcon, ArrowRightIcon, UserCircleIcon, ClockIcon,
} from '@heroicons/react/24/outline';

// ============================================================
// CONSTANTES
// ============================================================
const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function DoctorDashboard() {
  const { user } = useAuth();

  const [doctor, setDoctor]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // ---- RDV ----
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [todayCount, setTodayCount]   = useState(0);
  const [stats, setStats]             = useState({ total: 0, confirmed: 0, pending: 0, completed: 0 });

  // ---- Patients ----
  const [totalPatients, setTotalPatients] = useState(0);

  // ---- Revenus calculés ----
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  // ---- Activité hebdomadaire (calculée depuis les RDV) ----
  const [weeklyData, setWeeklyData] = useState(
    DAY_LABELS.map(day => ({ day, appointments: 0, consultations: 0 }))
  );

  // ---- Avis (module reviews) ----
  const [reviewsData, setReviewsData] = useState({ average: 0, total: 0, reviews: [] });
  const [loadingReviews, setLoadingReviews] = useState(true);

  // ============================================================
  // CHARGEMENT PRINCIPAL
  // ============================================================
  useEffect(() => {
    const loadData = async () => {
      // ---- Profil médecin ----
      try {
        const doctorData = await api.getDoctorProfile();
        setDoctor(doctorData);
      } catch {
        setError("Profil médecin non trouvé. Contactez l'administrateur.");
      }

      // ---- Stats + RDV à venir ----
      try {
        const apptData = await api.getDoctorAppointmentsToday();
        setRecentAppointments(apptData.upcoming || []);
        setTodayCount(apptData.today || 0);
        setStats({
          total:     apptData.total     || 0,
          confirmed: apptData.confirmed || 0,
          pending:   apptData.pending   || 0,
          completed: apptData.completed || 0,
        });
      } catch (err) {
        console.error('Erreur stats RDV:', err);
      }

      // ---- Tous les RDV (pour calculs : revenus, activité hebdo, patients uniques) ----
      try {
        const allAppointments = await api.getDoctorAppointments();
        const list = Array.isArray(allAppointments) ? allAppointments : [];

        // Patients uniques
        const uniquePatients = new Set(list.map(a => a.patient_name)).size;
        setTotalPatients(uniquePatients);

        // RDV en attente (remplace les notifications statiques)
        const pending = list
          .filter(a => a.status === 'pending')
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5);
        setPendingAppointments(pending);

        // Revenus du mois (RDV terminés ce mois-ci × tarif)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear  = now.getFullYear();

        const doctorData = await api.getDoctorProfile().catch(() => null);
        const feeInPerson = doctorData?.fee_in_person || 0;
        const feeVideo    = doctorData?.fee_video || 0;

        const revenue = list
          .filter(a => {
            const d = new Date(a.date);
            return a.status === 'completed' &&
                   d.getMonth() === currentMonth &&
                   d.getFullYear() === currentYear;
          })
          .reduce((sum, a) => sum + (a.type === 'video' ? feeVideo : feeInPerson), 0);
        setMonthlyRevenue(revenue);

        // Activité hebdomadaire (7 derniers jours)
        const weekMap = {};
        DAY_LABELS.forEach(d => { weekMap[d] = { appointments: 0, consultations: 0 }; });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);

        list.forEach(a => {
          const d = new Date(a.date);
          if (d >= sevenDaysAgo && d <= now) {
            const dayIndex = (d.getDay() + 6) % 7; // Lundi = 0
            const label = DAY_LABELS[dayIndex];
            weekMap[label].appointments += 1;
            if (a.status === 'completed') {
              weekMap[label].consultations += 1;
            }
          }
        });

        setWeeklyData(DAY_LABELS.map(day => ({ day, ...weekMap[day] })));

      } catch (err) {
        console.error('Erreur RDV complets:', err);
      } finally {
        setLoading(false);
      }

      // ---- Avis ----
      try {
        const reviews = await api.getDoctorMyReviews();
        setReviewsData(reviews);
      } catch (err) {
        console.error('Erreur avis:', err);
      } finally {
        setLoadingReviews(false);
      }
    };
    loadData();
  }, []);

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const maxWeekly = Math.max(...weeklyData.map(d => Math.max(d.appointments, d.consultations)), 1);

  // ============================================================
  // RENDER
  // ============================================================
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
                  <p className="text-sm font-medium text-gray-900">{Number(doctor.fee_in_person).toLocaleString('fr-FR')} XAF</p>
                </div>
              )}
              {doctor.fee_video > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Vidéo</p>
                  <p className="text-sm font-medium text-gray-900">{Number(doctor.fee_video).toLocaleString('fr-FR')} XAF</p>
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

        {/* ====== STATS GRID (données réelles) ====== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{totalPatients}</p>
                <p className="text-sm text-gray-600">Patients uniques</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {monthlyRevenue >= 1000
                    ? `${(monthlyRevenue / 1000).toFixed(0)}k`
                    : monthlyRevenue}
                </p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {loadingReviews ? '—' : (reviewsData.average || 0)}
                </p>
                <p className="text-sm text-gray-600">
                  Note moyenne {!loadingReviews && reviewsData.total > 0 && `(${reviewsData.total})`}
                </p>
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
                <h2 className="text-lg font-semibold text-gray-900">Prochains rendez-vous</h2>
                <Link to="/medecin/agenda" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Voir tout</Link>
              </div>
              <div className="space-y-4">
                {recentAppointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Aucun rendez-vous à venir</p>
                  </div>
                ) : (
                  recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${appointment.type === 'video' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          {appointment.type === 'video'
                            ? <VideoCameraIcon className="h-5 w-5 text-blue-600" />
                            : <UserGroupIcon className="h-5 w-5 text-green-600" />}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{appointment.patient_name}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            {' à '}{appointment.time ? appointment.time.slice(0, 5) : '--:--'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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

            {/* Activité hebdomadaire (calculée depuis les vrais RDV) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Activité des 7 derniers jours</h2>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                    <div className="flex-1 mx-4 flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-6">
                        <div
                          className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2 transition-all"
                          style={{ width: `${Math.max((day.appointments / maxWeekly) * 100, day.appointments > 0 ? 12 : 0)}%` }}
                        >
                          {day.appointments > 0 && (
                            <span className="text-xs text-white font-medium">{day.appointments}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-6">
                        <div
                          className="bg-green-500 h-6 rounded-full flex items-center justify-end pr-2 transition-all"
                          style={{ width: `${Math.max((day.consultations / maxWeekly) * 100, day.consultations > 0 ? 12 : 0)}%` }}
                        >
                          {day.consultations > 0 && (
                            <span className="text-xs text-white font-medium">{day.consultations}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center space-x-6 mt-4">
                  <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div><span className="text-sm text-gray-600">Rendez-vous</span></div>
                  <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div><span className="text-sm text-gray-600">Consultations terminées</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar droite */}
          <div className="space-y-8">

            {/* Avis récents (connectés au module reviews) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Avis récents</h2>
                <Link to="/medecin/avis" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Voir tout</Link>
              </div>

              {loadingReviews ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2].map(i => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
                  ))}
                </div>
              ) : reviewsData.reviews?.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <StarIcon className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Aucun avis pour l'instant</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviewsData.reviews?.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">{review.patient_name}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(review.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RDV en attente (remplace les notifications statiques) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">RDV en attente</h2>
                {pendingAppointments.length > 0 && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                    {pendingAppointments.length}
                  </span>
                )}
              </div>

              {pendingAppointments.length === 0 ? (
                <div className="text-center py-6 text-gray-400">
                  <ClockIcon className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Aucun RDV en attente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingAppointments.map((appt) => (
                    <Link
                      key={appt.id}
                      to="/medecin/agenda"
                      className="flex items-start hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
                    >
                      <div className="p-2 rounded-lg mr-3 bg-yellow-100">
                        <ClockIcon className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{appt.patient_name}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(appt.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          {' à '}{appt.time ? appt.time.slice(0, 5) : '--:--'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">À confirmer</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Actions rapides</h2>
              <div className="space-y-3">
                <Link to="/medecin/consultations/nouvelle" className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <VideoCameraIcon className="h-4 w-4 mr-2" />Nouvelle consultation
                </Link>
                <Link to="/medecin/dossiers" className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <UserGroupIcon className="h-4 w-4 mr-2" />Mes patients
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