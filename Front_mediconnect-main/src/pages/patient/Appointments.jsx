import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppointmentQRModal from '../../components/AppointmentQRModal';
import {
  CalendarIcon, ClockIcon, UserCircleIcon,
  MagnifyingGlassIcon, PlusIcon, TrashIcon,
  VideoCameraIcon, MapPinIcon, StarIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [qrModalAppointment, setQrModalAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await api.getAppointments();
        setAppointments(data);
      } catch (err) {
        setError('Impossible de charger les rendez-vous.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) return;
    try {
      await api.cancelAppointment(id);
      setAppointments(prev =>
        prev.map(rdv => rdv.id === id ? { ...rdv, status: 'cancelled' } : rdv)
      );
    } catch (err) {
      alert('Erreur lors de l\'annulation.');
    }
  };

  // ============================================================
  // Rejoindre la consultation vidéo/audio
  // Emmène le patient vers la salle d'attente (CallRoom).
  // Si le médecin n'a pas encore démarré, le patient patiente
  // là-bas et sera automatiquement connecté dès que ce sera prêt.
  // ============================================================
  const handleJoinCall = (rdv) => {
    navigate(`/patient/consultation-video/${rdv.id}`, {
      state: {
        otherPartyName: rdv.doctor_full_name || rdv.doctor_name || 'Médecin',
      },
    });
  };



  const getStatusLabel = (status) => {
    const labels = {
      'pending': 'En attente',
      'confirmed': 'Confirmé',
      'cancelled': 'Annulé',
      'completed': 'Terminé',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredAppointments = appointments
    .filter(rdv => {
      if (activeTab === 'upcoming') {
        return rdv.status === 'pending' || rdv.status === 'confirmed';
      } else {
        return rdv.status === 'completed' || rdv.status === 'cancelled';
      }
    })
    .filter(rdv => {
      if (!search) return true;
      return (
        rdv.doctor_name.toLowerCase().includes(search.toLowerCase()) ||
        rdv.doctor_specialty.toLowerCase().includes(search.toLowerCase()) ||
        rdv.reason.toLowerCase().includes(search.toLowerCase())
      );
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rendez-vous</h1>
          <p className="mt-1 text-sm text-gray-500">Gérez vos rendez-vous passés et à venir</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/patient/rendez-vous/nouveau"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Nouveau rendez-vous
          </Link>
        </div>
      </div>

      {/* Recherche */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
              placeholder="Rechercher un médecin, une spécialité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`${activeTab === 'upcoming'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            À venir
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`${activeTab === 'past'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Passés / Annulés
          </button>
        </nav>
      </div>

      {/* Contenu */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
          <p className="ml-4 text-gray-500">Chargement...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          {error}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((rdv) => (
                <li key={rdv.id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                          <CalendarIcon className="h-6 w-6 text-teal-600" />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                              {rdv.doctor_name}
                            </h3>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rdv.status)}`}>
                              {getStatusLabel(rdv.status)}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            <div className="flex items-center">
                              <UserCircleIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                              {rdv.doctor_specialty}
                            </div>
                            <div className="flex items-center mt-1">
                              <ClockIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                              {new Date(rdv.date).toLocaleDateString('fr-FR', {
                                weekday: 'long', day: 'numeric',
                                month: 'long', year: 'numeric'
                              })} à {rdv.time.slice(0, 5)}
                            </div>
                            <div className="flex items-center mt-1">
                              {rdv.type === 'video' ? (
                                <>
                                  <VideoCameraIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                                  Visioconférence
                                </>
                              ) : (
                                <>
                                  <MapPinIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                                  Présentiel
                                </>
                              )}
                            </div>
                            {rdv.reason && rdv.reason !== 'Non précisé' && (
                              <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                                <span className="font-medium">Motif : </span>{rdv.reason}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Rejoindre la consultation en ligne (vidéo/audio), uniquement si confirmé */}
                        {rdv.type === 'video' && rdv.status === 'confirmed' && (
                          <button
                            onClick={() => handleJoinCall(rdv)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                          >
                            <VideoCameraIcon className="-ml-0.5 mr-2 h-4 w-4" />
                            Rejoindre la consultation
                          </button>
                        )}
                        {rdv.type !== 'video' && rdv.status === 'confirmed' && (
                          <button
                            onClick={() => setQrModalAppointment(rdv)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700"
                          >
                            Mon code d'accès
                          </button>
                        )}
                        {(rdv.status === 'pending' || rdv.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancel(rdv.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                          >
                            <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" />
                            Annuler
                          </button>
                        )}
                        {rdv.status === 'completed' && (
                          <Link
                            to="/patient/avis"
                            state={{
                              consultation: {
                                id: rdv.id,
                                appointmentId: rdv.id,
                                doctor: {
                                  id: rdv.doctor,
                                  name: rdv.doctor_full_name || rdv.doctor_name || 'Médecin',
                                  specialty: rdv.doctor_specialization || rdv.doctor_specialty || '',
                                  avatar: '/api/placeholder/100/100',
                                },
                                date: new Date(rdv.date).toLocaleDateString('fr-FR', {
                                  day: 'numeric', month: 'long', year: 'numeric'
                                }),
                                time: rdv.time ? rdv.time.slice(0, 5) : '',
                                type: rdv.type === 'video' ? 'En ligne' : 'Présentiel',
                              }
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            <StarIcon className="-ml-0.5 mr-2 h-4 w-4" />
                            Donner un avis
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-12 text-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Aucun rendez-vous {activeTab === 'upcoming' ? 'à venir' : 'passé'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'upcoming'
                    ? 'Commencez par planifier un nouveau rendez-vous.'
                    : 'Aucun rendez-vous passé pour le moment.'}
                </p>
                {activeTab === 'upcoming' && (
                  <div className="mt-6">
                    <Link
                      to="/patient/rendez-vous/nouveau"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                      Nouveau rendez-vous
                    </Link>
                  </div>
                )}
              </li>
            )}
          </ul>
          <AppointmentQRModal
            appointment={qrModalAppointment}
            onClose={() => setQrModalAppointment(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Appointments;