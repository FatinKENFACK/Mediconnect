import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import {
  VideoCameraIcon,
  CalendarIcon,
  UserIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  PencilIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { format, parseISO, isBefore, isAfter, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

function ConsultationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [reportDate, setReportDate] = useState('');
  const [reportTime, setReportTime] = useState('');

  // Fonction pour charger les données de la consultation
  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        setLoading(true);
        // On récupère tous les RDV et on filtre par id
        const data = await api.getDoctorAppointments();
        const found = data.find(c => String(c.id) === String(id));

        if (!found) {
          setConsultation(null);
          return;
        }

        // On adapte la structure au format attendu par le composant
        setConsultation({
          id: found.id,
          patient: {
            name: found.patient_name || 'Patient inconnu',
            age: '',
            email: '',
            phone: '',
            address: '',
          },
          doctor: {
            name: found.doctor_full_name || '',
            specialty: found.doctor_specialization || '',
          },
          date: `${found.date}T${found.time || '08:00:00'}`,
          type: found.type,
          status: found.status,
          notes: found.reason || '',
          duration: 30,
          meetingUrl: '',
          documents: [],
        });

        const nextDay = addDays(new Date(), 1);
        setReportDate(nextDay.toISOString().split('T')[0]);
        setReportTime('14:00');

      } catch (error) {
        console.error('Erreur chargement consultation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [id]);

  // Gestion du report de consultation
  const handleReport = async (e) => {
    e.preventDefault();
    try {
      await api.updateAppointmentStatus(consultation.id, 'pending');
      setConsultation(prev => ({
        ...prev,
        date: `${reportDate}T${reportTime}:00`,
        status: 'pending',
      }));
      setActionSuccess({ type: 'success', message: 'Consultation reportée avec succès' });
      setShowReportModal(false);
    } catch {
      setActionSuccess({ type: 'error', message: 'Erreur lors du report' });
    }
  };

  // Gestion de l'annulation de consultation
  const handleCancel = async () => {
    try {
      await api.updateAppointmentStatus(consultation.id, 'cancelled');
      setConsultation(prev => ({ ...prev, status: 'cancelled' }));
      setActionSuccess({ type: 'success', message: 'Consultation annulée avec succès' });
      setShowCancelModal(false);
    } catch {
      setActionSuccess({ type: 'error', message: "Erreur lors de l'annulation" });
    }
  };

  // Vérifier si la consultation est passée
  const isPastConsultation = consultation && isBefore(parseISO(consultation.date), new Date());
  // Vérifier si la consultation peut être annulée (au moins 24h avant)
  const canCancel = consultation && isAfter(parseISO(consultation.date), new Date(Date.now() + 24 * 60 * 60 * 1000));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex justify-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-red-800">Consultation non trouvée</h3>
          <p className="mt-1 text-sm text-red-700">La consultation demandée n'existe pas ou vous n'avez pas les droits pour y accéder.</p>
          <div className="mt-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeftIcon className="-ml-1 mr-2 h-4 w-4" />
              Retour aux consultations
            </button>
          </div>
        </div>
      </div>
    );
  }

  const consultationDate = parseISO(consultation.date);
  const formattedDate = format(consultationDate, 'EEEE d MMMM yyyy', { locale: fr });
  const formattedTime = format(consultationDate, 'HH:mm');
  const isVideoConsultation = consultation.type === 'video';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      {/* En-tête avec bouton retour et titre */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Retour aux consultations
        </button>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Détails de la consultation</h1>
            <p className="mt-1 text-sm text-gray-500">
              Consultation {isVideoConsultation ? 'en visio' : 'en présentiel'} • {formattedDate}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {consultation.status === 'planifiée' && !isPastConsultation && (
              <>
                {isVideoConsultation && (
                  <button
                    onClick={() => window.open(consultation.meetingUrl, '_blank')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <VideoCameraIcon className="-ml-1 mr-2 h-4 w-4" />
                    Rejoindre la consultation
                  </button>
                )}
                <button
                  onClick={() => setShowReportModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <CalendarIcon className="-ml-1 mr-2 h-4 w-4" />
                  Reporter
                </button>
                {canCancel && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    <XMarkIcon className="-ml-1 mr-2 h-4 w-4" />
                    Annuler
                  </button>
                )}
              </>
            )}
            <button
              onClick={() => navigate(`/medecin/consultations/${id}/modifier`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <PencilIcon className="-ml-1 mr-2 h-4 w-4" />
              Modifier
            </button>
          </div>
        </div>
      </div>

      {/* Bannière d'état */}
      {consultation.status === 'annulée' && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Cette consultation a été annulée.
              </p>
            </div>
          </div>
        </div>
      )}

      {consultation.status === 'reportée' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Cette consultation a été reportée au {formattedDate} à {formattedTime}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grille d'informations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche - Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carte patient */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Informations du patient
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Nom complet</h4>
                  <p className="mt-1 text-sm text-gray-900">{consultation.patient.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Âge</h4>
                  <p className="mt-1 text-sm text-gray-900">{consultation.patient.age} ans</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="mt-1 text-sm text-blue-600">{consultation.patient.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Téléphone</h4>
                  <p className="mt-1 text-sm text-gray-900">{consultation.patient.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Adresse</h4>
                  <p className="mt-1 text-sm text-gray-900">{consultation.patient.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Détails de la consultation */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Détails de la consultation
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formattedDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Heure</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formattedTime}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Durée</dt>
                    <dd className="mt-1 text-sm text-gray-900">{consultation.duration} minutes</dd>
                  </div>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {isVideoConsultation ? 'Consultation en vidéo' : 'Consultation en présentiel'}
                  </dd>
                </div>

                {isVideoConsultation && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Lien de la consultation</dt>
                    <dd className="mt-1 text-sm">
                      <a
                        href={consultation.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {consultation.meetingUrl}
                      </a>
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-sm font-medium text-gray-500">Médecin traitant</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {consultation.doctor.name} - {consultation.doctor.specialty}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                    {consultation.notes || 'Aucune note pour cette consultation.'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Colonne de droite - Actions rapides et documents */}
        <div className="space-y-6">
          {/* Statut et actions rapides */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Statut et actions
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Statut</h4>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${consultation.status === 'planifiée' ? 'bg-blue-100 text-blue-800' :
                      consultation.status === 'terminée' ? 'bg-green-100 text-green-800' :
                        consultation.status === 'annulée' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                    </span>
                  </div>
                </div>

                {consultation.status === 'planifiée' && !isPastConsultation && (
                  <div className="space-y-3">
                    {isVideoConsultation && (
                      <button
                        onClick={() => window.open(consultation.meetingUrl, '_blank')}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <VideoCameraIcon className="-ml-1 mr-2 h-4 w-4" />
                        Rejoindre maintenant
                      </button>
                    )}

                    <button
                      onClick={() => setShowReportModal(true)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <CalendarIcon className="-ml-1 mr-2 h-4 w-4" />
                      Reporter la consultation
                    </button>

                    {canCancel && (
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        <XMarkIcon className="-ml-1 mr-2 h-4 w-4" />
                        Annuler la consultation
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Documents associés */}
          {consultation.documents && consultation.documents.length > 0 && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Documents
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <ul className="space-y-3">
                  {consultation.documents.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">Ajouté le {format(parseISO(doc.date), 'dd/MM/yyyy')}</p>
                        </div>
                      </div>
                      <a
                        href={`/documents/${doc.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Télécharger
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Ajouter un document
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de report de consultation */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
                onClick={() => setShowReportModal(false)}
              ></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
              >
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Reporter la consultation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Sélectionnez une nouvelle date et une nouvelle heure pour cette consultation.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleReport} className="mt-5">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="report-date" className="block text-sm font-medium text-gray-700">
                        Nouvelle date
                      </label>
                      <div className="mt-1">
                        <input
                          type="date"
                          id="report-date"
                          value={reportDate}
                          onChange={(e) => setReportDate(e.target.value)}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                          min={format(new Date(), 'yyyy-MM-dd')}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="report-time" className="block text-sm font-medium text-gray-700">
                        Nouvelle heure
                      </label>
                      <div className="mt-1">
                        <input
                          type="time"
                          id="report-time"
                          value={reportTime}
                          onChange={(e) => setReportTime(e.target.value)}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm transition-colors duration-200"
                    >
                      Confirmer le report
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReportModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm transition-colors duration-200"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal d'annulation de consultation */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
                onClick={() => setShowCancelModal(false)}
              ></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
              >
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <XMarkIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Annuler la consultation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Êtes-vous sûr de vouloir annuler cette consultation ? Cette action est irréversible.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm transition-colors duration-200"
                  >
                    Oui, annuler
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm transition-colors duration-200"
                  >
                    Non, garder la consultation
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification de succès/erreur */}
      <AnimatePresence>
        {actionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-4 right-4 max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden ${actionSuccess.type === 'success' ? 'bg-green-50' : 'bg-red-50'
              }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {actionSuccess.type === 'success' ? (
                    <CheckIcon className="h-5 w-5 text-green-400" />
                  ) : (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                  )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className={`text-sm font-medium ${actionSuccess.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                    {actionSuccess.message}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    onClick={() => setActionSuccess(null)}
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Fermer</span>
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default ConsultationDetail;