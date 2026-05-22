import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  ClockIcon,
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const AddAvailability = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Informations générales
    title: '',
    description: '',
    service: '',
    doctor: '',
    location: '',
    
    // Période
    startDate: '',
    endDate: '',
    isRecurring: false,
    recurringType: 'weekly', // weekly, monthly, custom
    recurringDays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'],
    
    // Créneaux horaires
    timeSlots: [
      {
        id: 1,
        startTime: '08:00',
        endTime: '09:00',
        maxPatients: 4,
        breakTime: 0
      }
    ],
    
    // Configuration
    consultationDuration: 30,
    bufferTime: 5,
    maxPatientsPerSlot: 1,
    requireConfirmation: true,
    allowOnlineBooking: true,
    allowEmergencyBooking: false,
    
    // Notifications
    notificationSettings: {
      emailReminder: true,
      smsReminder: false,
      reminderTime: 24, // heures avant
      notifyOnBooking: true,
      notifyOnCancellation: true
    },
    
    // Restrictions
    restrictions: {
      minAdvanceBooking: 24, // heures
      maxAdvanceBooking: 720, // heures (30 jours)
      cancellationDeadline: 24, // heures
      allowSameDay: false,
      allowWeekend: false
    },
    
    // Statut
    status: 'active',
    priority: 'normal' // low, normal, high
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    'Consultation générale',
    'Cardiologie',
    'Pédiatrie',
    'Radiologie',
    'Laboratoire',
    'Urgences',
    'Chirurgie',
    'Gynécologie',
    'ORL',
    'Dermatologie',
    'Ophtalmologie',
    'Psychiatrie'
  ];

  const doctors = [
    'Dr. Martin Laurent',
    'Dr. Sophie Bernard',
    'Dr. Pierre Dubois',
    'Dr. Marie Lefebvre',
    'Dr. Antoine Martin',
    'Dr. Isabelle Laurent'
  ];

  const locations = [
    'Bâtiment A - 1er étage',
    'Bâtiment A - 2ème étage',
    'Bâtiment B - Rez-de-chaussée',
    'Bâtiment B - 1er étage',
    'Bloc opératoire',
    'Service d\'urgence',
    'Laboratoire',
    'Service de radiologie'
  ];

  const daysOfWeek = [
    { value: 'lundi', label: 'Lundi' },
    { value: 'mardi', label: 'Mardi' },
    { value: 'mercredi', label: 'Mercredi' },
    { value: 'jeudi', label: 'Jeudi' },
    { value: 'vendredi', label: 'Vendredi' },
    { value: 'samedi', label: 'Samedi' },
    { value: 'dimanche', label: 'Dimanche' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => {
      const currentDays = prev.recurringDays || [];
      const updatedDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];
      return {
        ...prev,
        recurringDays: updatedDays
      };
    });
  };

  const addTimeSlot = () => {
    const newSlot = {
      id: Date.now(),
      startTime: '',
      endTime: '',
      maxPatients: 4,
      breakTime: 0
    };
    
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newSlot]
    }));
  };

  const updateTimeSlot = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map(slot => 
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const removeTimeSlot = (id) => {
    if (formData.timeSlots.length > 1) {
      setFormData(prev => ({
        ...prev,
        timeSlots: prev.timeSlots.filter(slot => slot.id !== id)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = 'Le titre est requis';
    if (!formData.service) newErrors.service = 'Le service est requis';
    if (!formData.doctor) newErrors.doctor = 'Le médecin est requis';
    if (!formData.location) newErrors.location = 'La localisation est requise';
    if (!formData.startDate) newErrors.startDate = 'La date de début est requise';
    if (!formData.endDate) newErrors.endDate = 'La date de fin est requise';
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.dateRange = 'La date de début doit être antérieure à la date de fin';
    }
    if (formData.isRecurring && formData.recurringDays.length === 0) {
      newErrors.recurringDays = 'Sélectionnez au moins un jour pour la récurrence';
    }

    // Valider les créneaux horaires
    const timeSlotErrors = [];
    formData.timeSlots.forEach((slot, index) => {
      if (!slot.startTime) {
        timeSlotErrors.push(`Le créneau ${index + 1} doit avoir une heure de début`);
      }
      if (!slot.endTime) {
        timeSlotErrors.push(`Le créneau ${index + 1} doit avoir une heure de fin`);
      }
      if (slot.startTime && slot.endTime && slot.startTime >= slot.endTime) {
        timeSlotErrors.push(`L'heure de fin du créneau ${index + 1} doit être postérieure à l'heure de début`);
      }
    });

    if (timeSlotErrors.length > 0) {
      newErrors.timeSlots = timeSlotErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simuler l'envoi des données
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Données de disponibilité:', formData);
      
      // Rediriger vers la page des disponibilités
      navigate('/hopital/disponibilites');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la disponibilité:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/hopital/disponibilites')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ajouter une disponibilité</h1>
            <p className="text-gray-600 mt-2">Configurez les créneaux horaires pour les consultations</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Informations générales */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations générales</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Consultations cardiologiques - Dr. Laurent"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Consultations spécialisées en cardiologie pour le diagnostic et le suivi des maladies cardiovasculaires."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service *</label>
              <select
                value={formData.service}
                onChange={(e) => handleInputChange('service', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.service ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez un service</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
              {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Médecin *</label>
              <select
                value={formData.doctor}
                onChange={(e) => handleInputChange('doctor', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.doctor ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez un médecin</option>
                {doctors.map(doctor => (
                  <option key={doctor} value={doctor}>{doctor}</option>
                ))}
              </select>
              {errors.doctor && <p className="text-red-500 text-sm mt-1">{errors.doctor}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Localisation *</label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez une localisation</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          </div>
        </div>

        {/* Période */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Période</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>
          </div>
          
          {errors.dateRange && <p className="text-red-500 text-sm mt-2">{errors.dateRange}</p>}
          
          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Disponibilité récurrente</span>
            </label>
          </div>
          
          {formData.isRecurring && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de récurrence</label>
                <select
                  value={formData.recurringType}
                  onChange={(e) => handleInputChange('recurringType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                  <option value="custom">Personnalisé</option>
                </select>
              </div>
              
              {formData.recurringType === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jours de la semaine *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {daysOfWeek.map(day => (
                      <label key={day.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.recurringDays.includes(day.value)}
                          onChange={() => handleDayToggle(day.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{day.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.recurringDays && <p className="text-red-500 text-sm mt-1">{errors.recurringDays}</p>}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Créneaux horaires */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Créneaux horaires</h2>
            <button
              type="button"
              onClick={addTimeSlot}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Ajouter un créneau
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.timeSlots.map((slot, index) => (
              <div key={slot.id} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heure de début *</label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(slot.id, 'startTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heure de fin *</label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateTimeSlot(slot.id, 'endTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Patients max</label>
                    <input
                      type="number"
                      value={slot.maxPatients}
                      onChange={(e) => updateTimeSlot(slot.id, 'maxPatients', parseInt(e.target.value))}
                      min="1"
                      max="20"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pause (min)</label>
                    <input
                      type="number"
                      value={slot.breakTime}
                      onChange={(e) => updateTimeSlot(slot.id, 'breakTime', parseInt(e.target.value))}
                      min="0"
                      max="60"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    {formData.timeSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(slot.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {errors.timeSlots && (
            <div className="mt-4">
              {errors.timeSlots.map((error, index) => (
                <p key={index} className="text-red-500 text-sm">{error}</p>
              ))}
            </div>
          )}
        </div>

        {/* Configuration */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée consultation (min)</label>
              <input
                type="number"
                value={formData.consultationDuration}
                onChange={(e) => handleInputChange('consultationDuration', parseInt(e.target.value))}
                min="5"
                max="180"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Temps de buffer (min)</label>
              <input
                type="number"
                value={formData.bufferTime}
                onChange={(e) => handleInputChange('bufferTime', parseInt(e.target.value))}
                min="0"
                max="60"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patients par créneau</label>
              <input
                type="number"
                value={formData.maxPatientsPerSlot}
                onChange={(e) => handleInputChange('maxPatientsPerSlot', parseInt(e.target.value))}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.requireConfirmation}
                onChange={(e) => handleInputChange('requireConfirmation', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Nécessite une confirmation</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.allowOnlineBooking}
                onChange={(e) => handleInputChange('allowOnlineBooking', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Autoriser la réservation en ligne</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.allowEmergencyBooking}
                onChange={(e) => handleInputChange('allowEmergencyBooking', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Autoriser les réservations d'urgence</span>
            </label>
          </div>
        </div>

        {/* Restrictions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Restrictions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Réservation minimum (heures avant)</label>
              <input
                type="number"
                value={formData.restrictions.minAdvanceBooking}
                onChange={(e) => handleNestedInputChange('restrictions', 'minAdvanceBooking', parseInt(e.target.value))}
                min="0"
                max="168"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Réservation maximum (heures avant)</label>
              <input
                type="number"
                value={formData.restrictions.maxAdvanceBooking}
                onChange={(e) => handleNestedInputChange('restrictions', 'maxAdvanceBooking', parseInt(e.target.value))}
                min="24"
                max="8760"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Délai d'annulation (heures avant)</label>
              <input
                type="number"
                value={formData.restrictions.cancellationDeadline}
                onChange={(e) => handleNestedInputChange('restrictions', 'cancellationDeadline', parseInt(e.target.value))}
                min="0"
                max="168"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.restrictions.allowSameDay}
                onChange={(e) => handleNestedInputChange('restrictions', 'allowSameDay', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Autoriser les réservations le jour même</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.restrictions.allowWeekend}
                onChange={(e) => handleNestedInputChange('restrictions', 'allowWeekend', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Autoriser les réservations le week-end</span>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rappel (heures avant)</label>
              <input
                type="number"
                value={formData.notificationSettings.reminderTime}
                onChange={(e) => handleNestedInputChange('notificationSettings', 'reminderTime', parseInt(e.target.value))}
                min="1"
                max="168"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.notificationSettings.emailReminder}
                onChange={(e) => handleNestedInputChange('notificationSettings', 'emailReminder', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Rappel par email</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.notificationSettings.smsReminder}
                onChange={(e) => handleNestedInputChange('notificationSettings', 'smsReminder', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Rappel par SMS</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.notificationSettings.notifyOnBooking}
                onChange={(e) => handleNestedInputChange('notificationSettings', 'notifyOnBooking', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Notifier lors de la réservation</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.notificationSettings.notifyOnCancellation}
                onChange={(e) => handleNestedInputChange('notificationSettings', 'notifyOnCancellation', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Notifier lors de l'annulation</span>
            </label>
          </div>
        </div>

        {/* Statut */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Statut</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="draft">Brouillon</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Basse</option>
                <option value="normal">Normale</option>
                <option value="high">Haute</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/hopital/disponibilites')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enregistrement...
              </>
            ) : (
              'Ajouter la disponibilité'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAvailability;
