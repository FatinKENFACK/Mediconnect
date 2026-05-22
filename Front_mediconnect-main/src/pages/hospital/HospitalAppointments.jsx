import React, { useState, useEffect } from 'react';
import {
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  EyeIcon,
  FilterIcon,
  BellIcon,
  PhoneIcon,
  VideoCameraIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const HospitalAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('today');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDoctor, setFilterDoctor] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  useEffect(() => {
    const mockAppointments = [
      {
        id: 1,
        patient: 'Jean Dupont',
        patientEmail: 'jean.dupont@email.com',
        patientPhone: '+221 77 123 45 67',
        doctor: 'Dr. Martin Laurent',
        service: 'Cardiologie',
        date: '2024-01-15',
        time: '09:00',
        duration: '30 min',
        status: 'confirmed',
        type: 'in_person',
        notes: 'Patient hypertendu, contrôle de routine',
        location: 'Cabinet 201',
        paymentStatus: 'paid',
        consultationFee: 25000
      },
      {
        id: 2,
        patient: 'Marie Laurent',
        patientEmail: 'marie.laurent@email.com',
        patientPhone: '+221 77 234 56 78',
        doctor: 'Dr. Sophie Bernard',
        service: 'Pédiatrie',
        date: '2024-01-15',
        time: '10:30',
        duration: '45 min',
        status: 'pending',
        type: 'video',
        notes: 'Suivi pédiatrique pour enfant de 3 ans',
        location: 'Consultation vidéo',
        paymentStatus: 'pending',
        consultationFee: 20000
      },
      {
        id: 3,
        patient: 'Pierre Dubois',
        patientEmail: 'pierre.dubois@email.com',
        patientPhone: '+221 77 345 67 89',
        doctor: 'Dr. Pierre Dubois',
        service: 'Radiologie',
        date: '2024-01-15',
        time: '14:00',
        duration: '20 min',
        status: 'confirmed',
        type: 'in_person',
        notes: 'Radiographie thoracique',
        location: 'Service de radiologie',
        paymentStatus: 'paid',
        consultationFee: 15000
      },
      {
        id: 4,
        patient: 'Sophie Martin',
        patientEmail: 'sophie.martin@email.com',
        patientPhone: '+221 77 456 78 90',
        doctor: 'Dr. Marie Lefebvre',
        service: 'Gynécologie',
        date: '2024-01-16',
        time: '15:30',
        duration: '30 min',
        status: 'cancelled',
        type: 'in_person',
        notes: 'Annulé par le patient',
        location: 'Cabinet 305',
        paymentStatus: 'refunded',
        consultationFee: 22000
      },
      {
        id: 5,
        patient: 'Antoine Bernard',
        patientEmail: 'antoine.bernard@email.com',
        patientPhone: '+221 77 567 89 01',
        doctor: 'Dr. Martin Laurent',
        service: 'Cardiologie',
        date: '2024-01-16',
        time: '11:00',
        duration: '30 min',
        status: 'completed',
        type: 'in_person',
        notes: 'Consultation de suivi post-opératoire',
        location: 'Cabinet 201',
        paymentStatus: 'paid',
        consultationFee: 25000
      }
    ];
    setAppointments(mockAppointments);
  }, []);

  const doctors = ['Tous', 'Dr. Martin Laurent', 'Dr. Sophie Bernard', 'Dr. Pierre Dubois', 'Dr. Marie Lefebvre'];

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = filterDate === 'all' || 
                       (filterDate === 'today' && appointment.date === '2024-01-15') ||
                       (filterDate === 'week' && appointment.date >= '2024-01-15' && appointment.date <= '2024-01-21') ||
                       (filterDate === 'month' && appointment.date.startsWith('2024-01'));
    
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesDoctor = filterDoctor === 'all' || appointment.doctor === filterDoctor;
    
    return matchesSearch && matchesDate && matchesStatus && matchesDoctor;
  });

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === appointmentId 
        ? { ...appointment, status: newStatus }
        : appointment
    ));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: 'bg-green-100 text-green-800', label: 'Confirmé' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Annulé' },
      completed: { color: 'bg-blue-100 text-blue-800', label: 'Terminé' },
      no_show: { color: 'bg-gray-100 text-gray-800', label: 'Non présenté' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const statusConfig = {
      paid: { color: 'bg-green-100 text-green-800', label: 'Payé' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      refunded: { color: 'bg-red-100 text-red-800', label: 'Remboursé' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    today: appointments.filter(a => a.date === '2024-01-15').length
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion des rendez-vous</h1>
            <p className="text-gray-600 mt-2">Consultez et gérez les rendez-vous des médecins</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-500 p-3 rounded-lg">
              <XCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Annulés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un rendez-vous..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="confirmed">Confirmés</option>
            <option value="pending">En attente</option>
            <option value="cancelled">Annulés</option>
            <option value="completed">Terminés</option>
          </select>
          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {doctors.map(doctor => (
              <option key={doctor} value={doctor === 'Tous' ? 'all' : doctor}>
                {doctor}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterDate('today');
              setFilterStatus('all');
              setFilterDoctor('all');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Médecin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paiement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{appointment.patient}</div>
                      <div className="text-sm text-gray-500">{appointment.patientEmail}</div>
                      <div className="text-sm text-gray-500">{appointment.patientPhone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.doctor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.service}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{appointment.date}</div>
                    <div className="text-sm text-gray-500">{appointment.time} ({appointment.duration})</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {appointment.type === 'video' ? (
                        <VideoCameraIcon className="h-5 w-5 text-blue-500 mr-2" />
                      ) : (
                        <MapPinIcon className="h-5 w-5 text-green-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-900">
                        {appointment.type === 'video' ? 'Vidéo' : 'Présentiel'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {getPaymentBadge(appointment.paymentStatus)}
                      <div className="text-sm text-gray-500 mt-1">
                        {appointment.consultationFee.toLocaleString()} FCFA
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Voir détails"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleReschedule(appointment)}
                        className="p-1 text-yellow-600 hover:text-yellow-800"
                        title="Reprogrammer"
                      >
                        <ClockIcon className="h-5 w-5" />
                      </button>
                      {appointment.status === 'pending' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Confirmer"
                        >
                          <CheckCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Annuler"
                        >
                          <XCircleIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Détails du rendez-vous</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Patient</h4>
                <p className="text-gray-900">{selectedAppointment.patient}</p>
                <p className="text-sm text-gray-500">{selectedAppointment.patientEmail}</p>
                <p className="text-sm text-gray-500">{selectedAppointment.patientPhone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Médecin</h4>
                <p className="text-gray-900">{selectedAppointment.doctor}</p>
                <p className="text-sm text-gray-500">{selectedAppointment.service}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Date & Heure</h4>
                <p className="text-gray-900">{selectedAppointment.date}</p>
                <p className="text-gray-900">{selectedAppointment.time} ({selectedAppointment.duration})</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Lieu</h4>
                <p className="text-gray-900">{selectedAppointment.location}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Statut</h4>
                {getStatusBadge(selectedAppointment.status)}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Paiement</h4>
                {getPaymentBadge(selectedAppointment.paymentStatus)}
                <p className="text-sm text-gray-500 mt-1">
                  {selectedAppointment.consultationFee.toLocaleString()} FCFA
                </p>
              </div>
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-gray-700">Notes</h4>
                <p className="text-gray-900">{selectedAppointment.notes}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reprogrammer le rendez-vous</h3>
            <p className="text-gray-600 mb-4">Cette fonctionnalité sera disponible prochainement.</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalAppointments;
