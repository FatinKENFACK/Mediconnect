import React, { useState, useEffect } from 'react';
import { format, isToday, isSameDay, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ChevronLeftIcon, ChevronRightIcon, PlusIcon,
  VideoCameraIcon, UserCircleIcon, ClockIcon,
  MapPinIcon, PhoneIcon, EnvelopeIcon, DocumentTextIcon,
  CalendarIcon, ClockIcon as ClockIconSolid
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import api from '../../services/api';
import CreateAppointmentModal from '../../components/appointments/CreateAppointmentModal';

const AgendaDoctor = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('day');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Générer les jours de la semaine
  const days = [];
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }

  // -------- Chargement des RDV --------
  useEffect(() => {
    api.getDoctorAppointments()
      .then(data => {
        // Adapter le format backend → format agenda
        const formatted = data.map(appt => ({
          id: appt.id,
          patient: appt.patient_name || 'Patient',
          type: appt.type === 'video' ? 'Téléconsultation' :
                appt.type === 'in-person' ? 'Consultation présentielle' : appt.type,
          startTime: appt.time ? appt.time.slice(0, 5) : '08:00',
          endTime: appt.time
            ? `${String(parseInt(appt.time.slice(0, 2)) + (appt.time.slice(3, 5) === '30' ? 1 : 0)).padStart(2, '0')}:${appt.time.slice(3, 5) === '30' ? '00' : '30'}`
            : '08:30',
          date: appt.date,
          status: appt.status === 'confirmed' ? 'confirmé' :
                  appt.status === 'pending' ? 'en attente' :
                  appt.status === 'cancelled' ? 'annulé' : appt.status,
          notes: appt.reason || '',
          phone: '',
          email: '',
          address: '',
          appointmentId: appt.id,
        }));
        setAppointments(formatted);
      })
      .catch(err => console.error('Erreur chargement agenda:', err))
      .finally(() => setLoading(false));
  }, []);

  // Rafraîchir après création d'un RDV
  const handleModalClose = () => {
    setIsModalOpen(false);
    setLoading(true);
    api.getDoctorAppointments()
      .then(data => {
        const formatted = data.map(appt => ({
          id: appt.id,
          patient: appt.patient_name || 'Patient',
          type: appt.type === 'video' ? 'Téléconsultation' : 'Consultation présentielle',
          startTime: appt.time ? appt.time.slice(0, 5) : '08:00',
          endTime: appt.time
            ? `${String(parseInt(appt.time.slice(0, 2)) + (appt.time.slice(3, 5) === '30' ? 1 : 0)).padStart(2, '0')}:${appt.time.slice(3, 5) === '30' ? '00' : '30'}`
            : '08:30',
          date: appt.date,
          status: appt.status === 'confirmed' ? 'confirmé' :
                  appt.status === 'pending' ? 'en attente' :
                  appt.status === 'cancelled' ? 'annulé' : appt.status,
          notes: appt.reason || '',
          phone: '',
          email: '',
          address: '',
        }));
        setAppointments(formatted);
      })
      .finally(() => setLoading(false));
  };

  // Filtrer les RDV pour la date sélectionnée
  const filteredAppointments = appointments.filter(appt =>
    isSameDay(parseISO(appt.date), selectedDate)
  );

  // Créneaux horaires
  const timeSlots = [];
  for (let hour = 8; hour < 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  const getAppointmentsForTimeSlot = (time) => {
    return filteredAppointments.filter(appt =>
      appt.startTime <= time && appt.endTime > time
    );
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
    if (view === 'day') setSelectedDate(newDate);
  };

  const formatDateDisplay = (date) =>
    format(date, 'EEEE d MMMM yyyy', { locale: fr });

  const formatTimeDisplay = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}h${minutes}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmé': return 'bg-green-100 text-green-800';
      case 'annulé': return 'bg-red-100 text-red-800';
      case 'en attente': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.updateAppointmentStatus(id, newStatus);
      setAppointments(prev =>
        prev.map(a => a.id === id
          ? { ...a, status: newStatus === 'confirmed' ? 'confirmé' : newStatus === 'cancelled' ? 'annulé' : newStatus }
          : a
        )
      );
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut.');
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <CalendarIcon className="h-6 w-6 text-blue-600 mr-2" />
            Agenda médical
          </h2>
          <p className="mt-1 text-sm text-gray-500 flex items-center">
            <ClockIconSolid className="h-4 w-4 mr-1" />
            {formatDateDisplay(selectedDate)}
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {/* Toggle Jour/Semaine */}
          <div className="flex rounded-md shadow-sm">
            <button onClick={() => setView('day')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              Jour
            </button>
            <button onClick={() => setView('week')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
              Semaine
            </button>
          </div>
          {/* Navigation */}
          <div className="flex rounded-md shadow-sm">
            <button onClick={() => navigateDate('prev')}
              className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button onClick={() => { setSelectedDate(new Date()); setCurrentDate(new Date()); }}
              className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              Aujourd'hui
            </button>
            <button onClick={() => navigateDate('next')}
              className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Nouveau RDV
          </motion.button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Vue Semaine */}
      {!loading && view === 'week' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {days.map((day, dayIdx) => (
              <div key={dayIdx} className="bg-gray-100 cursor-pointer"
                onClick={() => { setSelectedDate(day); setView('day'); }}>
                <div className={`py-2 text-center text-sm font-medium ${isToday(day) ? 'bg-blue-600 text-white' : 'text-gray-900'}`}>
                  {format(day, 'EEE', { locale: fr })}
                </div>
                <div className={`text-center text-sm p-2 ${isToday(day) ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
                  {format(day, 'd')}
                </div>
                <div className="h-32 overflow-y-auto p-1">
                  {appointments
                    .filter(appt => isSameDay(parseISO(appt.date), day))
                    .map((appt, idx) => (
                      <motion.div key={idx}
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="mx-1 mb-1 p-2 text-xs bg-blue-50 rounded-lg border border-blue-100 shadow-sm hover:shadow cursor-pointer">
                        <div className="font-medium text-blue-800 truncate">{appt.patient}</div>
                        <div className="text-gray-500 text-[0.7rem]">{appt.startTime} - {appt.endTime}</div>
                        <div className="mt-1 text-[0.65rem] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full inline-block">
                          {appt.type}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Vue Jour */}
      {!loading && view === 'day' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-100">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </h3>
          </div>
          <div className="flex">
            <div className="w-20 flex-shrink-0 border-r border-gray-200">
              <div className="h-16 border-b border-gray-200"></div>
              {timeSlots.map((time, idx) => (
                <div key={idx} className="h-16 border-b border-gray-200 text-right pr-2 pt-1 text-sm text-gray-500">
                  {time}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div className="h-16 border-b border-gray-200"></div>
              {timeSlots.map((time, idx) => {
                const slotAppointments = getAppointmentsForTimeSlot(time);
                return (
                  <div key={idx} className="h-16 border-b border-gray-200 relative">
                    {slotAppointments.map((appt, apptIdx) => {
                      const startHour = parseInt(appt.startTime.split(':')[0]);
                      const startMinute = parseInt(appt.startTime.split(':')[1]);
                      const endHour = parseInt(appt.endTime.split(':')[0]);
                      const endMinute = parseInt(appt.endTime.split(':')[1]);
                      const startPosition = (startHour - 8) * 2 + (startMinute / 30);
                      const duration = (endHour - startHour) * 2 + (endMinute - startMinute) / 30;
                      return (
                        <div key={apptIdx}
                          className={`absolute left-0 right-0 mx-1 p-2 rounded border-l-4 ${
                            appt.status === 'confirmé' ? 'border-green-500 bg-green-50' :
                            appt.status === 'annulé' ? 'border-red-500 bg-red-50' :
                            'border-yellow-500 bg-yellow-50'
                          }`}
                          style={{ top: `${startPosition * 2}rem`, height: `${duration * 2}rem` }}>
                          <div className="font-medium text-sm truncate">{appt.patient}</div>
                          <div className="text-xs text-gray-500">{appt.startTime} - {appt.endTime}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Liste des RDV du jour */}
      {!loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg overflow-hidden sm:rounded-xl border border-gray-100">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Rendez-vous du {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredAppointments.length} RDV)
              </span>
            </h3>
          </div>

          {filteredAppointments.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredAppointments
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((appointment) => (
                  <li key={appointment.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCircleIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.patient}</div>
                          <div className="text-sm text-gray-500">{appointment.type}</div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="text-sm text-gray-900">
                          {formatTimeDisplay(appointment.startTime)} - {formatTimeDisplay(appointment.endTime)}
                        </div>
                        <div className="mt-1">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        {appointment.status === 'en attente' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                            <VideoCameraIcon className="h-3 w-3 mr-1.5" />
                            Confirmer
                          </motion.button>
                        )}
                        {appointment.status === 'confirmé' && (
                          <motion.button
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600">
                            <VideoCameraIcon className="h-3 w-3 mr-1.5" />
                            Démarrer
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                          <DocumentTextIcon className="h-3 w-3 mr-1.5" />
                          Dossier
                        </motion.button>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="mt-3 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-300 p-3 rounded-r">
                        <p className="font-medium text-blue-800 flex items-center">
                          <DocumentTextIcon className="h-4 w-4 mr-1.5" />
                          Motif
                        </p>
                        <p className="mt-1">{appointment.notes}</p>
                      </div>
                    )}
                  </li>
                ))}
            </ul>
          ) : (
            <div className="text-center py-12 px-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <UserCircleIcon className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
              <p className="mt-2 text-sm text-gray-500">
                Aucun rendez-vous prévu pour cette journée.
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="mt-6 inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Nouveau rendez-vous
              </motion.button>
            </div>
          )}
        </motion.div>
      )}

      <CreateAppointmentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default AgendaDoctor;