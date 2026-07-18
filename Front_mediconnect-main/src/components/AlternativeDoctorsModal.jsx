import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XMarkIcon, UserCircleIcon, StarIcon, ClockIcon,
  ExclamationTriangleIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline';
import api from '../services/api';

// ============================================================
// Modal affichant des médecins alternatifs (même spécialisation,
// disponibles) quand un RDV reste non confirmé trop longtemps.
// ============================================================
const AlternativeDoctorsModal = ({ appointment, onClose }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!appointment) return;
    const fetchAlternatives = async () => {
      try {
        const data = await api.getAlternativeDoctors(appointment.id);
        setDoctors(data.doctors || []);
      } catch (err) {
        setError('Impossible de charger les médecins disponibles.');
      } finally {
        setLoading(false);
      }
    };
    fetchAlternatives();
  }, [appointment]);

  if (!appointment) return null;

  const handleChooseDoctor = (doctor) => {
    // Redirige vers la prise de RDV avec ce médecin déjà présélectionné,
    // pour ne pas faire recommencer toute la recherche au patient.
    navigate('/patient/rendez-vous/nouveau', {
      state: {
        preselectedDoctor: {
          id: doctor.id,
          name: `Dr. ${doctor.first_name} ${doctor.last_name}`,
          specialty: doctor.specialization,
          experience: `${doctor.experience_years} ans`,
          consultationFee: `${doctor.fee_in_person} XAF`,
        },
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Médecins disponibles</h3>
            <p className="text-sm text-gray-500">Même spécialité, disponibles dès maintenant</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          ) : doctors.length === 0 ? (
            <div className="text-center py-8">
              <UserCircleIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                Aucun autre médecin de cette spécialité n'est disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-xl p-4 hover:border-teal-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <UserCircleIcon className="h-7 w-7 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Dr. {doc.first_name} {doc.last_name}
                        </p>
                        <p className="text-sm text-gray-500">{doc.specialization}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <ClockIcon className="h-3.5 w-3.5" />
                            {doc.experience_years} ans d'expérience
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleChooseDoctor(doc)}
                      className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs font-medium rounded-lg hover:bg-teal-700"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Choisir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlternativeDoctorsModal;