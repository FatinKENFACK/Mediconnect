import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  PencilIcon,
  PlusIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const HospitalAvailability = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [availabilityData, setAvailabilityData] = useState({});

  useEffect(() => {
    const mockServices = [
      {
        id: 1,
        name: 'Cardiologie',
        doctors: ['Dr. Martin Laurent', 'Dr. Sophie Dubois'],
        currentSchedule: {
          monday: { open: '08:00', close: '18:00', closed: false },
          tuesday: { open: '08:00', close: '18:00', closed: false },
          wednesday: { open: '08:00', close: '18:00', closed: false },
          thursday: { open: '08:00', close: '18:00', closed: false },
          friday: { open: '08:00', close: '18:00', closed: false },
          saturday: { open: '09:00', close: '14:00', closed: false },
          sunday: { closed: true }
        },
        emergency: true,
        appointmentRequired: true,
        maxPatientsPerDay: 20,
        consultationDuration: 30
      },
      {
        id: 2,
        name: 'Pédiatrie',
        doctors: ['Dr. Sophie Bernard', 'Dr. Marie Petit'],
        currentSchedule: {
          monday: { open: '08:30', close: '19:00', closed: false },
          tuesday: { open: '08:30', close: '19:00', closed: false },
          wednesday: { open: '08:30', close: '19:00', closed: false },
          thursday: { open: '08:30', close: '19:00', closed: false },
          friday: { open: '08:30', close: '19:00', closed: false },
          saturday: { open: '09:00', close: '16:00', closed: false },
          sunday: { closed: true }
        },
        emergency: false,
        appointmentRequired: true,
        maxPatientsPerDay: 25,
        consultationDuration: 45
      },
      {
        id: 3,
        name: 'Urgences 24/7',
        doctors: ['Dr. Pierre Dubois', 'Dr. Antoine Martin', 'Dr. Isabelle Laurent'],
        currentSchedule: {
          monday: { open: '00:00', close: '23:59', closed: false },
          tuesday: { open: '00:00', close: '23:59', closed: false },
          wednesday: { open: '00:00', close: '23:59', closed: false },
          thursday: { open: '00:00', close: '23:59', closed: false },
          friday: { open: '00:00', close: '23:59', closed: false },
          saturday: { open: '00:00', close: '23:59', closed: false },
          sunday: { open: '00:00', close: '23:59', closed: false }
        },
        emergency: true,
        appointmentRequired: false,
        maxPatientsPerDay: 50,
        consultationDuration: 15
      },
      {
        id: 4,
        name: 'Radiologie',
        doctors: ['Dr. Pierre Dubois', 'Dr. Claire Martin'],
        currentSchedule: {
          monday: { open: '08:00', close: '20:00', closed: false },
          tuesday: { open: '08:00', close: '20:00', closed: false },
          wednesday: { open: '08:00', close: '20:00', closed: false },
          thursday: { open: '08:00', close: '20:00', closed: false },
          friday: { open: '08:00', close: '20:00', closed: false },
          saturday: { open: '09:00', close: '13:00', closed: false },
          sunday: { closed: true }
        },
        emergency: false,
        appointmentRequired: true,
        maxPatientsPerDay: 30,
        consultationDuration: 20
      },
      {
        id: 5,
        name: 'Laboratoire',
        doctors: ['Dr. Nathalie Bernard'],
        currentSchedule: {
          monday: { open: '07:00', close: '18:00', closed: false },
          tuesday: { open: '07:00', close: '18:00', closed: false },
          wednesday: { open: '07:00', close: '18:00', closed: false },
          thursday: { open: '07:00', close: '18:00', closed: false },
          friday: { open: '07:00', close: '18:00', closed: false },
          saturday: { open: '08:00', close: '12:00', closed: false },
          sunday: { closed: true }
        },
        emergency: true,
        appointmentRequired: false,
        maxPatientsPerDay: 40,
        consultationDuration: 15
      }
    ];
    setServices(mockServices);
    
    // Initialize availability data
    const initialData = {};
    mockServices.forEach(service => {
      initialData[service.id] = { ...service.currentSchedule };
    });
    setAvailabilityData(initialData);
  }, []);

  const weekDays = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  const handleEditSchedule = (service) => {
    setSelectedService(service);
    setAvailabilityData(prev => ({
      ...prev,
      [service.id]: { ...service.currentSchedule }
    }));
    setShowEditModal(true);
  };

  const handleScheduleChange = (serviceId, day, field, value) => {
    setAvailabilityData(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        [day]: {
          ...prev[serviceId][day],
          [field]: value
        }
      }
    }));
  };

  const saveSchedule = () => {
    // Simuler la sauvegarde
    setServices(prev => prev.map(service => 
      service.id === selectedService.id 
        ? { ...service, currentSchedule: availabilityData[selectedService.id] }
        : service
    ));
    setShowEditModal(false);
    setSelectedService(null);
  };

  const isServiceOpen = (service, day) => {
    const schedule = availabilityData[service.id]?.[day];
    return schedule && !schedule.closed;
  };

  const getServiceStatus = (service) => {
    const openDays = weekDays.filter(day => isServiceOpen(service, day.key)).length;
    const totalDays = weekDays.length;
    const percentage = (openDays / totalDays) * 100;
    
    if (percentage === 100) return { color: 'bg-green-100 text-green-800', label: 'Ouvert tous les jours' };
    if (percentage >= 5) return { color: 'bg-blue-100 text-blue-800', label: `${openDays}/${totalDays} jours` };
    if (percentage >= 3) return { color: 'bg-yellow-100 text-yellow-800', label: `${openDays}/${totalDays} jours` };
    return { color: 'bg-red-100 text-red-800', label: 'Limité' };
  };

  const stats = {
    totalServices: services.length,
    emergencyServices: services.filter(s => s.emergency).length,
    appointmentRequired: services.filter(s => s.appointmentRequired).length,
    averageDailyCapacity: services.reduce((sum, s) => sum + s.maxPatientsPerDay, 0) / services.length
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Disponibilités des services</h1>
          <p className="text-gray-600 mt-2">Définissez les horaires de disponibilité des services médicaux</p>
        </div>
        <Link
          to="/hopital/ajouter-disponibilite"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Ajouter une disponibilité
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total services</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-500 p-3 rounded-lg">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Services d\'urgence</p>
              <p className="text-2xl font-bold text-gray-900">{stats.emergencyServices}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rendez-vous requis</p>
              <p className="text-2xl font-bold text-gray-900">{stats.appointmentRequired}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Capacité moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(stats.averageDailyCapacity)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                <div className="flex items-center space-x-2 mt-2">
                  {service.emergency && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Urgence 24/7
                    </span>
                  )}
                  {service.appointmentRequired && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Rendez-vous requis
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleEditSchedule(service)}
                className="p-2 text-blue-600 hover:text-blue-800"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Status */}
            <div className="mb-4">
              {(() => {
                const status = getServiceStatus(service);
                return (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                );
              })()}
            </div>

            {/* Doctors */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Médecins disponibles</h4>
              <div className="flex flex-wrap gap-2">
                {service.doctors.map((doctor, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {doctor}
                  </span>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Horaires cette semaine</h4>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {weekDays.map((day) => {
                  const isOpen = isServiceOpen(service, day.key);
                  return (
                    <div
                      key={day.key}
                      className={`text-center p-2 rounded ${
                        isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <div className="font-medium">{day.label.substring(0, 3)}</div>
                      <div className="mt-1">
                        {isOpen ? (
                          <CheckCircleIcon className="h-3 w-3 mx-auto" />
                        ) : (
                          <XCircleIcon className="h-3 w-3 mx-auto" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Service Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Capacité journalière:</span>
                <span className="ml-2 font-medium text-gray-900">{service.maxPatientsPerDay} patients</span>
              </div>
              <div>
                <span className="text-gray-600">Durée consultation:</span>
                <span className="ml-2 font-medium text-gray-900">{service.consultationDuration} min</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Schedule Modal */}
      {showEditModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Modifier les horaires - {selectedService.name}
            </h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {weekDays.map((day) => {
                const schedule = availabilityData[selectedService.id]?.[day.key] || {};
                return (
                  <div key={day.key} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                    <div className="w-20">
                      <label className="block text-sm font-medium text-gray-700">{day.label}</label>
                    </div>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={schedule.closed || false}
                        onChange={(e) => handleScheduleChange(selectedService.id, day.key, 'closed', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Fermé</span>
                    </label>
                    
                    {!schedule.closed && (
                      <>
                        <input
                          type="time"
                          value={schedule.open || ''}
                          onChange={(e) => handleScheduleChange(selectedService.id, day.key, 'open', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">à</span>
                        <input
                          type="time"
                          value={schedule.close || ''}
                          onChange={(e) => handleScheduleChange(selectedService.id, day.key, 'close', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={saveSchedule}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalAvailability;
