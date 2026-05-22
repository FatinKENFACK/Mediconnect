import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  VideoCameraIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  UserIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function DoctorAppointments() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  // Mock appointments data
  const mockAppointments = [

  ];

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await api.getDoctorAppointments();
        const list = Array.isArray(data) ? data : data.results || [];
        setAppointments(list);
        setFilteredAppointments(list);
      } catch (err) {
        console.error('Erreur chargement rendez-vous:', err);
      }
    };
    loadAppointments();
  }, []);

  useEffect(() => {
    let filtered = appointments;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(apt =>
        (apt.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(apt => apt.type === filterType);
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(apt => apt.date === selectedDate);
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchQuery, filterStatus, filterType, selectedDate]);

  const tabs = [
    { id: 'upcoming', name: 'À venir', count: appointments.filter(a => ['confirmed', 'pending'].includes(a.status)).length },
    { id: 'today', name: 'Aujourd\'hui', count: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length },
    { id: 'completed', name: 'Terminés', count: appointments.filter(a => a.status === 'completed').length },
    { id: 'cancelled', name: 'Annulés', count: appointments.filter(a => a.status === 'cancelled').length }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return CheckCircleIcon;
      case 'pending': return ClockIcon;
      case 'completed': return CheckCircleIcon;
      case 'cancelled': return XMarkIcon;
      default: return ClockIcon;
    }
  };

  const getTypeIcon = (type) => {
    return type === 'video' ? VideoCameraIcon : UserGroupIcon;
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await api.updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
    }
  };

  const handleStartConsultation = (appointmentId) => {
    // Rediriger vers la page de consultation
    window.location.href = `/medecin/consultations/${appointmentId}`;
  };

  const handleSendReminder = (appointmentId) => {
    // Simuler l'envoi d'un rappel
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, reminderSent: true } : apt
      )
    );
  };

  const getTabAppointments = () => {
    switch (activeTab) {
      case 'upcoming':
        return filteredAppointments.filter(a => ['confirmed', 'pending'].includes(a.status));
      case 'today':
        return filteredAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]);
      case 'completed':
        return filteredAppointments.filter(a => a.status === 'completed');
      case 'cancelled':
        return filteredAppointments.filter(a => a.status === 'cancelled');
      default:
        return filteredAppointments;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mes rendez-vous</h1>
              <p className="text-gray-600 mt-1">Gérez vos consultations et planifications</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Aujourd'hui</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un patient..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="confirmed">Confirmé</option>
                <option value="pending">En attente</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous les types</option>
                <option value="presentiel">Présentiel</option>
                <option value="video">Visioconférence</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.name}
                  {tab.count > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {getTabAppointments().length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous trouvé</h3>
              <p className="text-gray-600">
                {activeTab === 'upcoming' && 'Vous n\'avez pas de rendez-vous à venir.'}
                {activeTab === 'today' && 'Vous n\'avez pas de rendez-vous aujourd\'hui.'}
                {activeTab === 'completed' && 'Vous n\'avez pas de rendez-vous terminés.'}
                {activeTab === 'cancelled' && 'Vous n\'avez pas de rendez-vous annulés.'}
              </p>
            </div>
          ) : (
            getTabAppointments().map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center">
                        {React.createElement(getTypeIcon(appointment.type), { className: 'h-5 w-5 text-gray-400 mr-2' })}
                        <span className="font-medium text-gray-900">{appointment.patient_name}</span>
                      </div>

                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status === 'confirmed' && 'Confirmé'}
                        {appointment.status === 'pending' && 'En attente'}
                        {appointment.status === 'completed' && 'Terminé'}
                        {appointment.status === 'cancelled' && 'Annulé'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        <span>{new Date(appointment.date).toLocaleDateString('fr-FR')}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span>{appointment.time}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span>{appointment.duration}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span>{appointment.location}</span>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-medium">Motif:</span> {appointment.reason}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Notes:</span> {appointment.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          <span>{appointment.patient_name}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          <span>{appointment.patientPhone}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <span className="font-medium">{appointment.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {appointment.status === 'confirmed' && (
                      <>
                        <button
                          onClick={() => handleStartConsultation(appointment.id)}
                          className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <VideoCameraIcon className="h-4 w-4 mr-2" />
                          Démarrer
                        </button>

                        {!appointment.reminderSent && (
                          <button
                            onClick={() => handleSendReminder(appointment.id)}
                            className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
                          >
                            <ClockIcon className="h-4 w-4 mr-2" />
                            Rappeler
                          </button>
                        )}
                      </>
                    )}

                    {appointment.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                          className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Accepter
                        </button>

                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Refuser
                        </button>
                      </div>
                    )}

                    {appointment.status === 'completed' && appointment.prescription && (
                      <Link
                        to={`/medecin/prescriptions/${appointment.prescription}`}
                        className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                      >
                        <ArrowRightIcon className="h-4 w-4 mr-2" />
                        Voir ordonnance
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
