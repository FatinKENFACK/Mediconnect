import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartIcon,
  PlusIcon,
  ArrowLeftIcon,
  XMarkIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  CameraIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const AddService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Informations de base
    name: '',
    category: '',
    description: '',
    shortDescription: '',
    image: null,
    imagePreview: null,
    
    // Tarification
    price: 0,
    priceType: 'fixed', // fixed, consultation, package
    insuranceCoverage: false,
    insurancePrice: 0,
    
    // Disponibilité
    duration: 30,
    availableDays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'],
    timeSlots: {
      morning: { start: '08:00', end: '12:00' },
      afternoon: { start: '14:00', end: '18:00' },
      evening: { start: '18:00', end: '20:00' }
    },
    
    // Équipement et ressources
    equipment: [],
    facilities: [],
    requirements: [],
    
    // Personnel
    requiredStaff: [],
    maxPatientsPerDay: 20,
    
    // Contact et localisation
    location: '',
    phone: '',
    email: '',
    website: '',
    
    // Options
    onlineBooking: true,
    emergencyService: false,
    homeService: false,
    
    // Documents
    brochureFile: null,
    images: [],
    
    // Statut
    status: 'active',
    featured: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Consultation générale',
    'Spécialités médicales',
    'Chirurgie',
    'Imagerie médicale',
    'Laboratoire',
    'Soins intensifs',
    'Urgences',
    'Prévention et dépistage',
    'Rééducation',
    'Santé mentale',
    'Médecine esthétique',
    'Autres'
  ];

  const equipmentOptions = [
    'Échographe', 'Radiographie', 'IRM', 'Scanner', 'Électrocardiographe',
    'Tensiomètre', 'Stéthoscope', 'Otoscope', 'Ophtalmoscope', 'Spiromètre',
    'Table d\'examen', 'Lit médicalisé', 'Chaise roulante', 'Défibrillateur',
    'Moniteur patient', 'Ventilateur', 'Incubateur', 'Banc d\'ophtalmologie'
  ];

  const facilityOptions = [
    'Salle d\'consultation', 'Salle d\'attente', 'Salle de repos',
    'Bloc opératoire', 'Salle de réveil', 'Laboratoire',
    'Salle de radiologie', 'Pharmacie', 'Cafétéria',
    'Parking', 'Accès PMR', 'Wifi', 'Climatisation'
  ];

  const staffOptions = [
    'Médecin', 'Infirmier', 'Aide-soignant', 'Secrétaire médical',
    'Technicien de laboratoire', 'Radiologue', 'Anesthésiste',
    'Kinésithérapeute', 'Psychologue', 'Diététicien'
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

  const handleFileChange = (field, file) => {
    if (file) {
      if (field === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            [field]: file,
            [`${field}Preview`]: reader.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: file
        }));
      }
    }
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || [];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return {
        ...prev,
        [field]: updated
      };
    });
  };

  const handleTimeSlotChange = (period, field, value) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: {
        ...prev.timeSlots,
        [period]: {
          ...prev.timeSlots[period],
          [field]: value
        }
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Le nom du service est requis';
    if (!formData.category) newErrors.category = 'La catégorie est requise';
    if (!formData.description) newErrors.description = 'La description est requise';
    if (formData.price <= 0) newErrors.price = 'Le prix doit être supérieur à 0';
    if (formData.duration <= 0) newErrors.duration = 'La durée doit être supérieure à 0';
    if (formData.maxPatientsPerDay <= 0) newErrors.maxPatientsPerDay = 'Le nombre maximum de patients doit être supérieur à 0';

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
      
      console.log('Données du service:', formData);
      
      // Rediriger vers la liste des services
      navigate('/hopital/services');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du service:', error);
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
            onClick={() => navigate('/hopital/services')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ajouter un service</h1>
            <p className="text-gray-600 mt-2">Créez un nouveau service médical pour votre établissement</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Informations de base */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations de base</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom du service *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Consultation cardiologique"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description courte</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) => handleInputChange('shortDescription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Consultation spécialisée en cardiologie"
              maxLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">Maximum 100 caractères</p>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description détaillée *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Décrivez en détail le service, les procédures, les bénéfices pour les patients..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          {/* Image */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image du service</label>
            <div className="flex items-center space-x-4">
              <div className="h-32 w-32 bg-gray-200 rounded-lg flex items-center justify-center">
                {formData.imagePreview ? (
                  <img src={formData.imagePreview} alt="Preview" className="h-32 w-32 rounded-lg object-cover" />
                ) : (
                  <HeartIcon className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('image', e.target.files[0])}
                  className="hidden"
                  id="service-image"
                />
                <label
                  htmlFor="service-image"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer flex items-center"
                >
                  <CameraIcon className="h-4 w-4 mr-2" />
                  Choisir une image
                </label>
                <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG (max 5MB)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tarification */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Tarification</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de tarification</label>
              <select
                value={formData.priceType}
                onChange={(e) => handleInputChange('priceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="fixed">Prix fixe</option>
                <option value="consultation">Par consultation</option>
                <option value="package">Forfait</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix (FCFA) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="15000"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prise en charge assurance</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.insuranceCoverage}
                  onChange={(e) => handleInputChange('insuranceCoverage', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Ce service est couvert par les assurances</span>
              </div>
            </div>
          </div>
          
          {formData.insuranceCoverage && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tarif assurance (FCFA)</label>
              <input
                type="number"
                value={formData.insurancePrice}
                onChange={(e) => handleInputChange('insurancePrice', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="12000"
              />
            </div>
          )}
        </div>

        {/* Disponibilité */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Disponibilité</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée (minutes) *</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.duration ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="30"
              />
              {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patients maximum par jour *</label>
              <input
                type="number"
                value={formData.maxPatientsPerDay}
                onChange={(e) => handleInputChange('maxPatientsPerDay', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.maxPatientsPerDay ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="20"
              />
              {errors.maxPatientsPerDay && <p className="text-red-500 text-sm mt-1">{errors.maxPatientsPerDay}</p>}
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Jours disponibles</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {daysOfWeek.map(day => (
                <label key={day.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.availableDays.includes(day.value)}
                    onChange={() => handleMultiSelect('availableDays', day.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{day.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Créneaux horaires</label>
            <div className="space-y-3">
              {Object.entries(formData.timeSlots).map(([period, times]) => (
                <div key={period} className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700 w-24">
                    {period === 'morning' ? 'Matin' : period === 'afternoon' ? 'Après-midi' : 'Soir'}
                  </span>
                  <input
                    type="time"
                    value={times.start}
                    onChange={(e) => handleTimeSlotChange(period, 'start', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">à</span>
                  <input
                    type="time"
                    value={times.end}
                    onChange={(e) => handleTimeSlotChange(period, 'end', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Équipement et installations */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Équipement et installations</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Équipement disponible</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {equipmentOptions.map(equipment => (
                <label key={equipment} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.equipment.includes(equipment)}
                    onChange={() => handleMultiSelect('equipment', equipment)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{equipment}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Installations</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {facilityOptions.map(facility => (
                <label key={facility} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => handleMultiSelect('facilities', facility)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{facility}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Personnel requis */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Personnel requis</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {staffOptions.map(staff => (
              <label key={staff} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.requiredStaff.includes(staff)}
                  onChange={() => handleMultiSelect('requiredStaff', staff)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{staff}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Options supplémentaires */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Options supplémentaires</h2>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.onlineBooking}
                onChange={(e) => handleInputChange('onlineBooking', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Réservation en ligne disponible</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.emergencyService}
                onChange={(e) => handleInputChange('emergencyService', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Service d'urgence</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.homeService}
                onChange={(e) => handleInputChange('homeService', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Service à domicile</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Mettre en avant sur la page d'accueil</span>
            </label>
          </div>
        </div>

        {/* Contact */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations de contact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bâtiment A, 1er étage"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+221 33 825 45 67"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="service@clinique.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="www.clinique.com/service"
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Documents</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brochure du service</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange('brochureFile', e.target.files[0])}
                className="hidden"
                id="brochure-upload"
              />
              <label
                htmlFor="brochure-upload"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer flex items-center"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                {formData.brochureFile ? formData.brochureFile.name : 'Choisir un fichier'}
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/hopital/services')}
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
              'Ajouter le service'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;
