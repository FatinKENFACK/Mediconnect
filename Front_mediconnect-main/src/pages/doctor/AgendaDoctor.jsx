import React, { useState } from 'react';
import { format, addDays, isToday, isSameDay, parseISO, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PlusIcon,
  VideoCameraIcon,
  UserCircleIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon as ClockIconSolid
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import CreateAppointmentModal from '../../components/appointments/CreateAppointmentModal';

const AgendaDoctor = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('day'); // 'day' or 'week'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Générer les jours de la semaine
  const days = [];
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }

  // Données de démonstration pour les rendez-vous
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: 'Jean Martin',
      type: 'Consultation de suivi',
      startTime: '09:00',
      endTime: '09:30',
      date: format(new Date().setHours(9, 0, 0, 0), 'yyyy-MM-dd'),
      status: 'confirmé',
      notes: 'Vérifier les résultats des analyses sanguines',
      phone: '06 12 34 56 78',
      email: 'jean.martin@example.com',
      address: '15 Rue de la Paix, 75002 Paris'
    },
    {
      id: 2,
      patient: 'Marie Dubois',
      type: 'Première consultation',
      startTime: '10:00',
      endTime: '11:00',
      date: format(new Date().setHours(10, 0, 0, 0), 'yyyy-MM-dd'),
      status: 'confirmé',
      notes: 'Nouveau patient - Douleurs thoraciques',
      phone: '06 23 45 67 89',
      email: 'marie.dubois@example.com',
      address: '22 Avenue des Champs-Élysées, 75008 Paris'
    },
    {
      id: 3,
      patient: 'Thomas Durand',
      type: 'Téléconsultation',
      startTime: '14:30',
      endTime: '15:00',
      date: format(addHours(new Date(), 24), 'yyyy-MM-dd'),
      status: 'confirmé',
      notes: 'Suivi traitement - Hypertension',
      phone: '06 34 56 78 90',
      email: 'thomas.durand@example.com',
      address: '10 Rue de Rivoli, 75004 Paris'
    },
  ]);

  // Filtrer les rendez-vous pour la date sélectionnée
  const filteredAppointments = appointments.filter(appt => 
    isSameDay(parseISO(appt.date), selectedDate)
  );

  // Générer les créneaux horaires
  const timeSlots = [];
  for (let hour = 8; hour < 20; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  // Obtenir les rendez-vous pour un créneau horaire spécifique
  const getAppointmentsForTimeSlot = (time) => {
    return filteredAppointments.filter(appt => appt.startTime <= time && appt.endTime > time);
  };

  // Navigation entre les jours/semaines
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

  // Formater la date pour l'affichage
  const formatDateDisplay = (date) => {
    return format(date, 'EEEE d MMMM yyyy', { locale: fr });
  };

  // Formater l'heure pour l'affichage
  const formatTimeDisplay = (time) => {
    const [hours, minutes] = time.split(':');
    return `${hours}h${minutes}`;
  };

  // Obtenir la classe de couleur en fonction du statut
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmé':
        return 'bg-green-100 text-green-800';
      case 'annulé':
        return 'bg-red-100 text-red-800';
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
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
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setView('day')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                view === 'day' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Jour
            </button>
            <button
              type="button"
              onClick={() => setView('week')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                view === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Semaine
            </button>
          </div>
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => navigateDate('prev')}
              className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(new Date())}
              className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Aujourd'hui
            </button>
            <button
              type="button"
              onClick={() => navigateDate('next')}
              className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Nouveau RDV
          </motion.button>
        </div>
      </div>

      {view === 'week' ? (
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100"
      >
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, dayIdx) => (
            <div key={dayIdx} className="bg-gray-100">
              <div className={`py-2 text-center text-sm font-medium ${
                isToday(day) ? 'bg-blue-600 text-white' : 'text-gray-900'
              }`}>
                {format(day, 'EEE', { locale: fr })}
              </div>
              <div className={`text-center text-sm p-2 ${
                isToday(day) ? 'font-bold text-blue-600' : 'text-gray-500'
              }`}>
                {format(day, 'd')}
              </div>
              <div className="h-32 overflow-y-auto p-1">
                {appointments
                  .filter(appt => isSameDay(parseISO(appt.date), day))
                  .map((appt, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mx-1 mb-1 p-2 text-xs bg-blue-50 rounded-lg border border-blue-100 overflow-hidden shadow-sm hover:shadow transition-shadow duration-200 cursor-pointer"
                    >
                      <div className="font-medium text-blue-800 truncate">{appt.patient}</div>
                      <div className="text-gray-500 text-[0.7rem] truncate">{appt.startTime} - {appt.endTime}</div>
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
      ) : (
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-100"
      >
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
            </h3>
          </div>
          <div className="bg-white overflow-hidden">
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
                          <div
                            key={apptIdx}
                            className={`absolute left-0 right-0 mx-1 p-2 rounded border-l-4 ${
                              appt.status === 'confirmé' 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-yellow-500 bg-yellow-50'
                            }`}
                            style={{
                              top: `${startPosition * 2}rem`,
                              height: `${duration * 2}rem`,
                            }}
                          >
                            <div className="font-medium text-sm">{appt.patient}</div>
                            <div className="text-xs text-gray-500">
                              {appt.startTime} - {appt.endTime}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Liste des rendez-vous du jour */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-lg overflow-hidden sm:rounded-xl border border-gray-100 mt-6"
      >
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Rendez-vous du {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
          </h3>
        </div>
        {filteredAppointments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <li key={appointment.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserCircleIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.patient}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.type}
                      </div>
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
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-150"
                    >
                      <VideoCameraIcon className="h-3 w-3 mr-1.5" />
                      Démarrer
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
                    >
                      <DocumentTextIcon className="h-3 w-3 mr-1.5" />
                      Dossier
                    </motion.button>
                  </div>
                </div>
                {appointment.notes && (
                  <div className="mt-3 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-300 p-3 rounded-r">
                    <p className="font-medium text-blue-800 flex items-center">
                      <DocumentTextIcon className="h-4 w-4 mr-1.5" />
                      Notes
                    </p>
                    <p className="mt-1">{appointment.notes}</p>
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-3">
                  {appointment.phone && (
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full">
                      <PhoneIcon className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-blue-500" />
                      <a href={`tel:${appointment.phone}`} className="hover:text-blue-600 hover:underline">
                        {appointment.phone}
                      </a>
                    </div>
                  )}
                  {appointment.email && (
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full">
                      <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-blue-500" />
                      <a href={`mailto:${appointment.email}`} className="hover:text-blue-600 hover:underline truncate max-w-[180px]">
                        {appointment.email}
                      </a>
                    </div>
                  )}
                  {appointment.address && (
                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full">
                      <MapPinIcon className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-blue-500" />
                      <span className="truncate max-w-[180px]">{appointment.address}</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 px-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <UserCircleIcon className="h-10 w-10 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Aucun rendez-vous</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              Aucun rendez-vous n'est prévu pour cette journée. Cliquez sur le bouton ci-dessous pour en ajouter un nouveau.
            </p>
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 mt-4"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Nouveau rendez-vous
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Modal de création de rendez-vous */}
      <CreateAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default AgendaDoctor;
