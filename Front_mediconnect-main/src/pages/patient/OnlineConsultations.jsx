import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  VideoCameraIcon, ClockIcon, CalendarIcon, UserCircleIcon,
  PhoneIcon, ArrowPathIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

// ============================================================
// Page dédiée aux consultations en ligne (vidéo/audio uniquement)
// Différente de "Mes rendez-vous" qui liste TOUS les RDV
// (vidéo + présentiel). Ici, uniquement le type='video'.
// ============================================================
const OnlineConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await api.getAppointments();
      const onlineOnly = data.filter(
        (rdv) => rdv.type === 'video' && ['pending', 'confirmed'].includes(rdv.status)
      );
      setConsultations(onlineOnly);
    } catch (err) {
      setError('Impossible de charger les consultations en ligne.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleJoinCall = (rdv) => {
    navigate(`/patient/consultation-video/${rdv.id}`, {
      state: {
        otherPartyName: rdv.doctor_full_name || rdv.doctor_name || 'Médecin',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultations en ligne</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vos consultations vidéo et audio à venir
          </p>
        </div>
        <button
          onClick={fetchConsultations}
          className="mt-4 sm:mt-0 inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowPathIcon className="h-4 w-4 mr-1.5" />
          Actualiser
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          <p className="ml-4 text-gray-500">Chargement...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
          {error}
        </div>
      ) : consultations.length === 0 ? (
        <div className="bg-white shadow sm:rounded-lg text-center py-16">
          <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">
            Aucune consultation en ligne programmée
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Prenez un rendez-vous en ligne pour le voir apparaître ici.
          </p>
          <div className="mt-6">
            <Link
              to="/patient/rendez-vous/nouveau"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Prendre un rendez-vous en ligne
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {consultations.map((rdv) => (
              <li key={rdv.id} className="hover:bg-gray-50">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <VideoCameraIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                          {rdv.doctor_full_name || rdv.doctor_name}
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            rdv.status === 'confirmed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-yellow-50 text-yellow-700'
                          }`}>
                            {rdv.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                          </span>
                        </h3>
                        <div className="mt-1 text-sm text-gray-500 space-y-1">
                          <div className="flex items-center">
                            <UserCircleIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                            {rdv.doctor_specialization || rdv.doctor_specialty}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                            {new Date(rdv.date).toLocaleDateString('fr-FR', {
                              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            })} à {rdv.time?.slice(0, 5)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {rdv.status === 'confirmed' ? (
                        <button
                          onClick={() => handleJoinCall(rdv)}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                        >
                          <VideoCameraIcon className="-ml-1 mr-2 h-4 w-4" />
                          Rejoindre la consultation
                        </button>
                      ) : (
                        <span className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-500">
                          <ClockIcon className="-ml-1 mr-2 h-4 w-4" />
                          En attente de confirmation
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OnlineConsultations;