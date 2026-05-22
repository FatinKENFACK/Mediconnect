import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserCircleIcon,
  VideoCameraIcon,
  MapPinIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const NewAppointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const data = await api.getDoctors();
        const list = Array.isArray(data) ? data : data.results || [];
        const formatted = list.map(d => ({
          id: d.id,
          name: `Dr. ${d.first_name} ${d.last_name}`,
          specialty: d.specialization,
          rating: 4.8,
          experience: `${d.experience_years} ans`,
          nextAvailable: 'Sur rendez-vous',
          phone: d.phone || 'Non renseigné',
          hospital: 'Mediconnet',
          consultationFee: `${d.fee_in_person} XAF`,
          languages: d.languages ? d.languages.split(',') : ['Français'],
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await api.createAppointment({
        doctor: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
        doctor_specialty: selectedDoctor.specialty,
        date: selectedDate,
        time: selectedTime + ':00',
        type: appointmentType,
        reason: reason || 'Non précisé',
    });
    navigate('/patient/rendez-vous');
  } catch (err) {
    setError(err.message || 'Erreur lors de la création du rendez-vous');
  } finally {
    setLoading(false);
  }
};

const getStepIcon = (stepNumber) => {
  const icons = {
    1: <UserCircleIcon className="h-4 w-4" />,
    2: <CalendarIcon className="h-4 w-4" />,
    3: <CheckCircleIcon className="h-4 w-4" />
  };
  return icons[stepNumber];
};

const getStepTitle = (stepNumber) => {
  const titles = {
    1: 'Choix du médecin',
    2: 'Date et type',
    3: 'Confirmation'
  };
  return titles[stepNumber];
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
};

return (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <div className="max-w-4xl mx-auto p-4 md:p-8">

      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="group flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200">
          <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Retour</span>
        </button>
        <div className="mt-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Nouveau rendez-vous</h1>
          <p className="mt-2 text-gray-600">Réservez votre consultation en quelques clics</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${step >= stepNumber ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 bg-white text-gray-400'
                  }`}>
                  {step > stepNumber ? <CheckCircleIcon className="h-6 w-6" /> : getStepIcon(stepNumber)}
                </div>
                <span className={`mt-2 text-sm font-medium ${step >= stepNumber ? 'text-blue-600' : 'text-gray-400'}`}>
                  {getStepTitle(stepNumber)}
                </span>
              </div>
              {stepNumber < 3 && (
                <div className="flex-1 h-0.5 mx-4 relative">
                  <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
                  <div className={`absolute inset-0 bg-blue-600 rounded-full transition-all duration-300 ${step > stepNumber ? 'w-full' : 'w-0'}`}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Step 1: Doctor Selection */}
        {step === 1 && (
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisissez votre médecin</h2>
              <p className="text-gray-600">Sélectionnez un professionnel de santé adapté à vos besoins</p>
            </div>

            {loadingDoctors ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <UserCircleIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
                <p>Aucun médecin disponible pour le moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {doctors.map((doctor) => (
                  <div key={doctor.id} onClick={() => { setSelectedDoctor(doctor); setStep(2); }} className="group cursor-pointer">
                    <div className="flex flex-col md:flex-row items-start md:items-center p-6 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 bg-white hover:bg-blue-50/20">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <UserCircleIcon className="h-16 w-16 text-gray-400" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">{doctor.name}</h3>
                            <p className="text-gray-600 mt-1">{doctor.specialty}</p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                              <span className="mr-1">★</span>{doctor.rating}
                              <span className="ml-1 text-blue-600">({doctor.experience})</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{doctor.hospital}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <ClockIcon className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{doctor.nextAvailable}</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm font-medium text-blue-600">
                          Consultation : {doctor.consultationFee}
                        </div>
                      </div>
                      <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 mt-4 md:mt-0 md:ml-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex">
                <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-800">Tous nos médecins sont certifiés et disposent d'une expérience significative dans leur domaine.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Date, Time & Type */}
        {step === 2 && selectedDoctor && (
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <UserCircleIcon className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDoctor.name}</h2>
                  <p className="text-gray-600">{selectedDoctor.specialty}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <div className="flex items-center mb-4">
                    <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Sélectionnez une date</h3>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-4 text-lg border-2 border-blue-100 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
                    />
                    {selectedDate && (
                      <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                        <p className="text-blue-800 font-medium">{formatDate(selectedDate)}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-4">
                    <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Choisissez un horaire</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <button key={time} type="button" onClick={() => setSelectedTime(time)}
                        className={`py-3 px-4 rounded-xl text-center transition-all duration-300 ${selectedTime === time
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white border-2 border-gray-100 hover:border-blue-300'
                          }`}>
                        <span className={`font-medium ${selectedTime === time ? 'text-white' : 'text-gray-900'}`}>{time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Type de consultation</h3>
                <div className="space-y-4">
                  <button type="button" onClick={() => setAppointmentType('video')}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 ${appointmentType === 'video' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-300'
                      }`}>
                    <div className="flex items-start">
                      <div className={`p-3 rounded-lg mr-4 ${appointmentType === 'video' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <VideoCameraIcon className={`h-6 w-6 ${appointmentType === 'video' ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Consultation vidéo</h4>
                        <p className="text-sm text-gray-600 mt-1">En ligne, depuis chez vous</p>
                      </div>
                    </div>
                  </button>

                  <button type="button" onClick={() => setAppointmentType('in-person')}
                    className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 ${appointmentType === 'in-person' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-blue-300'
                      }`}>
                    <div className="flex items-start">
                      <div className={`p-3 rounded-lg mr-4 ${appointmentType === 'in-person' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <MapPinIcon className={`h-6 w-6 ${appointmentType === 'in-person' ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">En cabinet</h4>
                        <p className="text-sm text-gray-600 mt-1">Consultation au cabinet médical</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="space-y-4 mt-8">
                  <button type="button" onClick={() => setStep(1)}
                    className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50">
                    ← Changer de médecin
                  </button>
                  <button type="button" onClick={() => setStep(3)}
                    disabled={!selectedDate || !selectedTime || !appointmentType}
                    className="w-full py-4 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Continuer vers la confirmation
                    <ChevronRightIcon className="inline-block h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Détails de la consultation</h2>
              <p className="text-gray-600">Vérifiez les informations et ajoutez des précisions si nécessaire</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Motif de la consultation <span className="text-red-500">*</span>
                  </label>
                  <textarea rows={5}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 bg-white resize-none"
                    placeholder="Décrivez brièvement la raison de votre consultation..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>
                )}

                <div className="mt-8">
                  <button type="button" onClick={() => setStep(2)}
                    className="py-3 px-4 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50">
                    ← Modifier les détails
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl border border-blue-100 overflow-hidden">
                  <div className="bg-blue-600 px-6 py-4">
                    <h3 className="text-lg font-bold text-white">Récapitulatif</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Médecin</p>
                      <p className="font-semibold text-gray-900">{selectedDoctor?.name}</p>
                      <p className="text-sm text-gray-600">{selectedDoctor?.specialty}</p>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon className="h-5 w-5 mr-3 text-blue-500" />
                      <div>
                        <p className="font-medium">{formatDate(selectedDate)}</p>
                        <p className="text-sm">{selectedTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      {appointmentType === 'video'
                        ? <VideoCameraIcon className="h-5 w-5 mr-3 text-blue-500" />
                        : <MapPinIcon className="h-5 w-5 mr-3 text-blue-500" />
                      }
                      <p className="font-medium">
                        {appointmentType === 'video' ? 'Consultation vidéo' : 'Consultation en cabinet'}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-blue-100 flex justify-between">
                      <span className="text-gray-600">Frais</span>
                      <span className="font-semibold text-blue-600">{selectedDoctor?.consultationFee}</span>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 px-4 bg-green-500 text-white font-bold text-lg rounded-xl hover:bg-green-600 disabled:opacity-50 flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 mr-3" />
                  {loading ? 'Enregistrement...' : 'Confirmer le rendez-vous'}
                </button>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-start">
                    <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">Vous recevrez une confirmation après validation du rendez-vous.</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">Étape {step} sur 3 • Vos données sont sécurisées et confidentielles</p>
      </div>
    </div>
  </div>
);
};

export default NewAppointment;