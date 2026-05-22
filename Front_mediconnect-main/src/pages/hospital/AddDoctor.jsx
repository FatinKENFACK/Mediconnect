import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  CameraIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AddDoctor = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'homme',
    address: '',
    city: '',
    country: 'Sénégal',
    photo: null,
    photoPreview: null,
    
    // Informations professionnelles
    speciality: '',
    subSpecialities: [],
    licenseNumber: '',
    registrationNumber: '',
    experience: '',
    languages: ['Français'],
    biography: '',
    
    // Éducation et formation
    education: [
      {
        degree: '',
        institution: '',
        year: '',
        country: ''
      }
    ],
    
    // Expérience professionnelle
    experienceHistory: [
      {
        hospital: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false
      }
    ],
    
    // Compétences et certifications
    skills: [],
    certifications: [
      {
        name: '',
        issuingOrganization: '',
        issueDate: '',
        expiryDate: '',
        certificateFile: null
      }
    ],
    
    // Disponibilité
    availability: {
      monday: { morning: true, afternoon: true, evening: false },
      tuesday: { morning: true, afternoon: true, evening: false },
      wednesday: { morning: true, afternoon: true, evening: false },
      thursday: { morning: true, afternoon: true, evening: false },
      friday: { morning: true, afternoon: true, evening: false },
      saturday: { morning: false, afternoon: false, evening: false },
      sunday: { morning: false, afternoon: false, evening: false }
    },
    
    // Consultation
    consultationDuration: 30,
    consultationPrice: 15000,
    onlineConsultation: true,
    homeConsultation: false,
    
    // Documents
    cvFile: null,
    diplomaFile: null,
    licenseFile: null,
    
    // Statut
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specialities = [
    'Cardiologie', 'Pédiatrie', 'Radiologie', 'Gynécologie', 
    'Chirurgie générale', 'Médecine interne', 'Dermatologie',
    'Ophtalmologie', 'ORL', 'Neurologie', 'Oncologie',
    'Psychiatrie', 'Anesthésiologie', 'Urgence', 'Réanimation'
  ];

  const subSpecialities = {
    'Cardiologie': ['Cardiologie interventionnelle', 'Électrophysiologie', 'Échocardiographie'],
    'Pédiatrie': ['Néonatalogie', 'Pédiatrie générale', 'Pédopsychiatrie'],
    'Radiologie': ['Radiologie interventionnelle', 'Imagerie médicale', 'Médecine nucléaire'],
    'Chirurgie générale': ['Chirurgie laparoscopique', 'Chirurgie vasculaire', 'Chirurgie thoracique']
  };

  const languages = ['Français', 'Anglais', 'Wolof', 'Pulaar', 'Sérère', 'Diola', 'Mandinka', 'Arabe'];

  const skills = [
    'Ultrasonographie', 'Échocardiographie', 'Endoscopie', 'Laparoscopie',
    'Réanimation', 'Urgences', 'Soins intensifs', 'Médecine d\'urgence',
    'Téléconsultation', 'Recherche clinique', 'Enseignement médical'
  ];

  const totalSteps = 4;
  const steps = [
    { id: 1, title: 'Informations personnelles', icon: UserCircleIcon },
    { id: 2, title: 'Formation et expérience', icon: AcademicCapIcon },
    { id: 3, title: 'Compétences et disponibilité', icon: BriefcaseIcon },
    { id: 4, title: 'Documents et validation', icon: DocumentTextIcon }
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [field]: file,
          [`${field}Preview`]: reader.result
        }));
      };
      reader.readAsDataURL(file);
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

  const handleEducationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '', country: '' }]
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      experienceHistory: prev.experienceHistory.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experienceHistory: [...prev.experienceHistory, { 
        hospital: '', position: '', startDate: '', endDate: '', current: false 
      }]
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experienceHistory: prev.experienceHistory.filter((_, i) => i !== index)
    }));
  };

  const handleCertificationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { 
        name: '', issuingOrganization: '', issueDate: '', expiryDate: '', certificateFile: null 
      }]
    }));
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
        if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
        if (!formData.email) newErrors.email = 'L\'email est requis';
        if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
        if (!formData.speciality) newErrors.speciality = 'La spécialité est requise';
        if (!formData.licenseNumber) newErrors.licenseNumber = 'Le numéro de licence est requis';
        break;
      case 2:
        if (!formData.education.some(edu => edu.degree && edu.institution)) {
          newErrors.education = 'Au moins une formation est requise';
        }
        break;
      case 3:
        if (formData.consultationPrice <= 0) newErrors.consultationPrice = 'Le prix doit être supérieur à 0';
        break;
      case 4:
        if (!formData.cvFile) newErrors.cvFile = 'Le CV est requis';
        if (!formData.diplomaFile) newErrors.diplomaFile = 'Le diplôme est requis';
        if (!formData.licenseFile) newErrors.licenseFile = 'La licence est requise';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    try {
      // Simuler l'envoi des données
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Données du médecin:', formData);
      
      // Rediriger vers la liste des médecins
      navigate('/hopital/medecins');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du médecin:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Informations personnelles et professionnelles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Martin"
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Laurent"
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="martin.laurent@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+221 77 123 45 67"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité *</label>
                <select
                  value={formData.speciality}
                  onChange={(e) => handleInputChange('speciality', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.speciality ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionnez une spécialité</option>
                  {specialities.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                {errors.speciality && <p className="text-red-500 text-sm mt-1">{errors.speciality}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de licence *</label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="MED-2024-001"
                />
                {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Biographie</label>
              <textarea
                value={formData.biography}
                onChange={(e) => handleInputChange('biography', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Décrivez votre expérience, votre approche médicale et vos domaines d'expertise..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                  {formData.photoPreview ? (
                    <img src={formData.photoPreview} alt="Preview" className="h-20 w-20 rounded-full object-cover" />
                  ) : (
                    <UserCircleIcon className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('photo', e.target.files[0])}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer flex items-center"
                  >
                    <CameraIcon className="h-4 w-4 mr-2" />
                    Choisir une photo
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Formation et expérience</h3>
            
            {/* Éducation */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Formation académique</h4>
                <button
                  type="button"
                  onClick={addEducation}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Ajouter une formation
                </button>
              </div>
              
              {formData.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Diplôme</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Doctorat en Médecine"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Université Cheikh Anta Diop"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Année</label>
                      <input
                        type="text"
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2015"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                      <input
                        type="text"
                        value={edu.country}
                        onChange={(e) => handleEducationChange(index, 'country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Sénégal"
                      />
                    </div>
                  </div>
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              ))}
              {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
            </div>
            
            {/* Expérience professionnelle */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Expérience professionnelle</h4>
                <button
                  type="button"
                  onClick={addExperience}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Ajouter une expérience
                </button>
              </div>
              
              {formData.experienceHistory.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Établissement</label>
                      <input
                        type="text"
                        value={exp.hospital}
                        onChange={(e) => handleExperienceChange(index, 'hospital', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Hôpital Principal de Dakar"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Poste</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Médecin Cardiologue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date de début</label>
                      <input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date de fin</label>
                      <input
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Poste actuel</span>
                    </label>
                  </div>
                  {formData.experienceHistory.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Compétences et disponibilité</h3>
            
            {/* Compétences */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Compétences techniques</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skills.map((skill) => (
                  <label key={skill} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.skills.includes(skill)}
                      onChange={() => handleMultiSelect('skills', skill)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Langues */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Langues parlées</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {languages.map((lang) => (
                  <label key={lang} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(lang)}
                      onChange={() => handleMultiSelect('languages', lang)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{lang}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Consultation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée consultation (min)</label>
                <input
                  type="number"
                  value={formData.consultationDuration}
                  onChange={(e) => handleInputChange('consultationDuration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tarif consultation (FCFA)</label>
                <input
                  type="number"
                  value={formData.consultationPrice}
                  onChange={(e) => handleInputChange('consultationPrice', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.consultationPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="15000"
                />
                {errors.consultationPrice && <p className="text-red-500 text-sm mt-1">{errors.consultationPrice}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Années d'expérience</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>
            </div>
            
            {/* Types de consultation */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Types de consultation</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.onlineConsultation}
                    onChange={(e) => handleInputChange('onlineConsultation', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Consultation en ligne</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.homeConsultation}
                    onChange={(e) => handleInputChange('homeConsultation', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Consultation à domicile</span>
                </label>
              </div>
            </div>
            
            {/* Disponibilité */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Disponibilité hebdomadaire</h4>
              <div className="space-y-2">
                {Object.entries(formData.availability).map(([day, times]) => (
                  <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {day === 'monday' ? 'Lundi' : 
                       day === 'tuesday' ? 'Mardi' :
                       day === 'wednesday' ? 'Mercredi' :
                       day === 'thursday' ? 'Jeudi' :
                       day === 'friday' ? 'Vendredi' :
                       day === 'saturday' ? 'Samedi' : 'Dimanche'}
                    </span>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={times.morning}
                          onChange={(e) => handleInputChange('availability', {
                            ...formData.availability,
                            [day]: { ...times, morning: e.target.checked }
                          })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-1 text-sm text-gray-700">Matin</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={times.afternoon}
                          onChange={(e) => handleInputChange('availability', {
                            ...formData.availability,
                            [day]: { ...times, afternoon: e.target.checked }
                          })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-1 text-sm text-gray-700">Après-midi</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={times.evening}
                          onChange={(e) => handleInputChange('availability', {
                            ...formData.availability,
                            [day]: { ...times, evening: e.target.checked }
                          })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-1 text-sm text-gray-700">Soir</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Documents et validation</h3>
            
            {/* Documents requis */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CV *</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileChange('cvFile', e.target.files[0])}
                    className="hidden"
                    id="cv-upload"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer flex items-center"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    {formData.cvFile ? formData.cvFile.name : 'Choisir un fichier'}
                  </label>
                  {errors.cvFile && <p className="text-red-500 text-sm">{errors.cvFile}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diplôme *</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('diplomaFile', e.target.files[0])}
                    className="hidden"
                    id="diploma-upload"
                  />
                  <label
                    htmlFor="diploma-upload"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer flex items-center"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    {formData.diplomaFile ? formData.diplomaFile.name : 'Choisir un fichier'}
                  </label>
                  {errors.diplomaFile && <p className="text-red-500 text-sm">{errors.diplomaFile}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Licence médicale *</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange('licenseFile', e.target.files[0])}
                    className="hidden"
                    id="license-upload"
                  />
                  <label
                    htmlFor="license-upload"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer flex items-center"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    {formData.licenseFile ? formData.licenseFile.name : 'Choisir un fichier'}
                  </label>
                  {errors.licenseFile && <p className="text-red-500 text-sm">{errors.licenseFile}</p>}
                </div>
              </div>
            </div>
            
            {/* Certifications */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-medium text-gray-900">Certifications additionnelles</h4>
                <button
                  type="button"
                  onClick={addCertification}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Ajouter une certification
                </button>
              </div>
              
              {formData.certifications.map((cert, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la certification</label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Certificat en Réanimation"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organisme émetteur</label>
                      <input
                        type="text"
                        value={cert.issuingOrganization}
                        onChange={(e) => handleCertificationChange(index, 'issuingOrganization', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ministère de la Santé"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date d'émission</label>
                      <input
                        type="date"
                        value={cert.issueDate}
                        onChange={(e) => handleCertificationChange(index, 'issueDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration</label>
                      <input
                        type="date"
                        value={cert.expiryDate}
                        onChange={(e) => handleCertificationChange(index, 'expiryDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  {formData.certifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Résumé */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-blue-900 mb-2">Résumé du profil</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Nom:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Spécialité:</strong> {formData.speciality}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Téléphone:</strong> {formData.phone}</p>
                <p><strong>Tarif consultation:</strong> {formData.consultationPrice.toLocaleString()} FCFA</p>
                <p><strong>Consultation en ligne:</strong> {formData.onlineConsultation ? 'Oui' : 'Non'}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/hopital/medecins')}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ajouter un médecin</h1>
            <p className="text-gray-600 mt-2">Créez le profil d'un nouveau médecin pour votre établissement</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-500'
              }`}>
                <step.icon className="h-5 w-5" />
              </div>
              <div className="ml-3 hidden sm:block">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
              {step.id < totalSteps && (
                <div className={`hidden sm:block w-full h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          
          {currentStep === totalSteps ? (
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
                'Enregistrer le médecin'
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              Suivant
              <ArrowLeftIcon className="h-5 w-5 ml-2 rotate-180" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
