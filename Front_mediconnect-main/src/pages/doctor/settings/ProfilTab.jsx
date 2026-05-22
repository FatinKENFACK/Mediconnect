import React, { useState } from 'react';
import { 
  UserCircleIcon, 
  PhotoIcon, 
  XMarkIcon, 
  PencilIcon, 
  CheckIcon,
  DocumentArrowUpIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeAltIcon,
  ClockIcon,
  VideoCameraIcon,
  HomeIcon,
  BuildingLibraryIcon,
  IdentificationIcon,
  AcademicCapIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const ProfilTab = ({ userData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    ...userData,
    // Informations d'identification
    profilePhoto: null,
    whatsappNumber: '',
    city: '',
    quarter: '',
    
    // Informations professionnelles
    registrationNumber: '', // Numéro d'inscription à l'Ordre
    specialty: 'Médecine générale',
    practiceLocation: '', // Hôpital public, Cabinet privé, etc.
    diplomaFile: null,
    professionalCardFile: null,
    identityDocumentFile: null,
    
    // Paramètres financiers
    mobileMoneyNumber: '',
    mobileMoneyProvider: 'Orange Money', // Orange Money ou MTN Mobile Money
    bankRIBFile: null,
    
    // Services et prestations
    practiceType: 'family', // 'family' ou 'specialist'
    teleconsultation: {
      enabled: false,
      video: true,
      audio: true,
      secureChat: true,
      ePrescription: true,
      triage: true
    },
    homeConsultation: {
      enabled: false,
      radius: 5, // km
      transportFees: 0,
      requiresThirdParty: false,
      portableEquipment: ''
    },
    clinicConsultation: {
      enabled: true,
      smartQueue: true,
      prioritySlots: true
    },
    specializedPrograms: {
      chronicFollowup: false,
      postnatalFollowup: false,
      preventiveCheckup: false
    },
    availability: {
      status: 'available', // available, busy, emergencyOnly
      preparationTime: 10, // minutes
      workingHours: [],
      delegationEnabled: false
    },
    
    // Conventions
    acceptedConventions: false
  });

  const [activeStep, setActiveStep] = useState(1);
  const steps = [
    { id: 1, name: 'Identification', icon: IdentificationIcon },
    { id: 2, name: 'Professionnel', icon: AcademicCapIcon },
    { id: 3, name: 'Financier', icon: BanknotesIcon },
    { id: 4, name: 'Services', icon: VideoCameraIcon },
    { id: 5, name: 'Disponibilité', icon: ClockIcon },
    { id: 6, name: 'Conventions', icon: ShieldCheckIcon }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1: // Identification
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {formData.profilePhoto ? (
                    <img src={URL.createObjectURL(formData.profilePhoto)} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <UserCircleIcon className="h-full w-full text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer p-2 text-white hover:text-blue-300">
                      <PhotoIcon className="h-6 w-6" />
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileChange(e, 'profilePhoto')}
                        accept="image/*"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium text-center">Dr. {formData.firstName} {formData.lastName}</h3>
              <p className="text-sm text-gray-500 text-center">{formData.specialty}</p>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">À propos de moi</h3>
              </div>
              <p className="mt-1 text-sm text-gray-500 mb-4">
                Présentez-vous en quelques mots à vos futurs patients. Parlez de votre expérience, votre approche médicale ou vos domaines d'expertise.
              </p>
              <div className="mt-2">
                <textarea
                  name="about"
                  rows={4}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md disabled:bg-gray-100"
                  placeholder="Par exemple : 'Médecin généraliste avec plus de 10 ans d'expérience, spécialisé dans le suivi des maladies chroniques et la médecine préventive. Je m'engage à offrir des soins personnalisés et à l'écoute de chaque patient.'"
                  value={formData.about || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.about ? formData.about.length : 0}/500 caractères
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Prénom *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Nom *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email professionnel *
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Numéro WhatsApp *
                  </div>
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="whatsappNumber"
                    id="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    placeholder="+237 6XX XXX XXX"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Pour la coordination rapide avec les patients</p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  <MapPinIcon className="h-4 w-4 inline mr-1" />
                  Ville *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="quarter" className="block text-sm font-medium text-gray-700">
                  Quartier *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="quarter"
                    id="quarter"
                    value={formData.quarter}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Professionnel
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                  Numéro d'inscription à l'Ordre (ex: ONMC) *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="registrationNumber"
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    placeholder="ONMC-XXXXX"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                  Spécialité *
                </label>
                <div className="mt-1">
                  <select
                    name="specialty"
                    id="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                  >
                    <option value="Médecine générale">Médecine générale</option>
                    <option value="Pédiatrie">Pédiatrie</option>
                    <option value="Gynécologie">Gynécologie</option>
                    <option value="Médecine interne">Médecine interne</option>
                    <option value="Cardiologie">Cardiologie</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="practiceLocation" className="block text-sm font-medium text-gray-700">
                  <BuildingOfficeIcon className="h-4 w-4 inline mr-1" />
                  Lieu d'exercice principal *
                </label>
                <div className="mt-1">
                  <select
                    name="practiceLocation"
                    id="practiceLocation"
                    value={formData.practiceLocation}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="hôpital_public">Hôpital public</option>
                    <option value="hôpital_confessionnel">Hôpital confessionnel (sous contrat DanAid)</option>
                    <option value="cabinet_privé">Cabinet privé</option>
                    <option value="clinique">Clinique privée</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Documents à télécharger *</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Copie du diplôme de Doctorat en médecine
                    </label>
                    <div className="flex items-center">
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'diplomaFile')}
                          disabled={!isEditing}
                        />
                        <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500">
                          <DocumentArrowUpIcon className="h-5 w-5 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formData.diplomaFile ? formData.diplomaFile.name : 'Télécharger le fichier'}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Carte professionnelle / Attestation d'inscription à l'Ordre
                    </label>
                    <div className="flex items-center">
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'professionalCardFile')}
                          disabled={!isEditing}
                        />
                        <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500">
                          <DocumentArrowUpIcon className="h-5 w-5 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formData.professionalCardFile ? formData.professionalCardFile.name : 'Télécharger le fichier'}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pièce d'identité (CNI ou Passeport)
                    </label>
                    <div className="flex items-center">
                      <label className="flex-1 cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'identityDocumentFile')}
                          disabled={!isEditing}
                        />
                        <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500">
                          <DocumentArrowUpIcon className="h-5 w-5 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formData.identityDocumentFile ? formData.identityDocumentFile.name : 'Télécharger le fichier'}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Financier
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Mobile Money (Paiement rapide)</h4>
                
                <div className="grid grid-cols-6 gap-4">
                  <div className="col-span-2">
                    <label htmlFor="mobileMoneyProvider" className="block text-sm font-medium text-gray-700">
                      Opérateur *
                    </label>
                    <div className="mt-1">
                      <select
                        name="mobileMoneyProvider"
                        id="mobileMoneyProvider"
                        value={formData.mobileMoneyProvider}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                      >
                        <option value="Orange Money">Orange Money</option>
                        <option value="MTN Mobile Money">MTN Mobile Money</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <label htmlFor="mobileMoneyNumber" className="block text-sm font-medium text-gray-700">
                      Numéro *
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="mobileMoneyNumber"
                        id="mobileMoneyNumber"
                        value={formData.mobileMoneyNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                        placeholder="6XX XXX XXX"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Pour les remboursements de consultations en 1h</p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Informations bancaires</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relevé d'Identité Bancaire (RIB) *
                  </label>
                  <div className="flex items-center">
                    <label className="flex-1 cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, 'bankRIBFile')}
                        disabled={!isEditing}
                      />
                      <div className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500">
                        <DocumentArrowUpIcon className="h-5 w-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formData.bankRIBFile ? formData.bankRIBFile.name : 'Télécharger le RIB'}
                        </span>
                      </div>
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Pour les virements de prestations importantes</p>
                </div>
              </div>
            </div>
          </div>
        );

     case 4: // Services et prestations
return (
  <div className="space-y-8">
    {/* Section d'introduction */}
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
      <div className="flex items-start">
        <VideoCameraIcon className="h-6 w-6 text-blue-600 mr-3 mt-1" />
        <div>
          <h4 className="text-lg font-medium text-gray-900">Configuration de vos services</h4>
          <p className="mt-2 text-sm text-gray-700">
            Configurez les différentes prestations que vous proposez via DanAid. 
            Ces paramètres déterminent votre visibilité et vos capacités sur la plateforme.
          </p>
        </div>
      </div>
    </div>

    {/* Type de médecin */}
    <div className="border rounded-lg p-6 hover:border-blue-300 transition-colors mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg">
            <UserGroupIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Type de pratique</h4>
            <p className="text-sm text-gray-500">Définissez votre type d'exercice principal</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <label className={`border rounded-lg p-6 cursor-pointer transition-colors ${
          formData.practiceType === 'family' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
        }`}>
          <div className="flex items-start">
            <input
              type="radio"
              name="practiceType"
              value="family"
              checked={formData.practiceType === 'family'}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
            />
            <div className="ml-3">
              <h5 className="text-lg font-medium text-gray-900">Médecin de famille</h5>
              <p className="mt-1 text-sm text-gray-600">
                Suivi global des patients, premier recours, orientation vers les spécialistes
              </p>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                  <span>Suivi longitudinal des patients</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                  <span>Accès aux dossiers partagés</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                  <span>Rémunération au forfait patient</span>
                </li>
              </ul>
            </div>
          </div>
        </label>

        <label className={`border rounded-lg p-6 cursor-pointer transition-colors ${
          formData.practiceType === 'specialist' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
        }`}>
          <div className="flex flex-col">
            <div className="flex items-start">
              <input
                type="radio"
                name="practiceType"
                value="specialist"
                checked={formData.practiceType === 'specialist'}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
              />
              <div className="ml-3">
                <h5 className="text-lg font-medium text-gray-900">Médecin spécialiste</h5>
                <p className="mt-1 text-sm text-gray-600">
                  Prise en charge spécialisée sur orientation ou consultation directe
                </p>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  <li className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                    <span>Expertise pointue dans votre domaine</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                    <span>Référencement dans l'annuaire des spécialistes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                    <span>Rémunération à l'acte</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {formData.practiceType === 'specialist' && (
              <div className="mt-4 ml-7">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spécialité principale
                </label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="cardiologie">Cardiologie</option>
                  <option value="dermatologie">Dermatologie</option>
                  <option value="gynecologie">Gynécologie</option>
                  <option value="pediatrie">Pédiatrie</option>
                  <option value="ophtalmologie">Ophtalmologie</option>
                  <option value="rhumatologie">Rhumatologie</option>
                  <option value="neurologie">Neurologie</option>
                  <option value="psychiatrie">Psychiatrie</option>
                  <option value="urologie">Urologie</option>
                  <option value="autre">Autre spécialité</option>
                </select>
              </div>
            )}
          </div>
        </label>
      </div>

      {formData.practiceType === 'specialist' && formData.specialty && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h5 className="text-sm font-medium text-blue-800">Configuration pour {formData.specialty}</h5>
          <p className="mt-1 text-sm text-blue-700">
            En tant que spécialiste en {formData.specialty}, vous serez visible dans l'annuaire des spécialistes et pourrez recevoir des demandes de consultation de la part des médecins généralistes.
          </p>
        </div>
      )}
    </div>

    {/* 1. Gestion des rendez-vous */}
    <div className="border rounded-lg p-6 hover:border-blue-300 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg">
            <ClockIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Gestion des rendez-vous</h4>
            <p className="text-sm text-gray-500">Configuration de votre agenda et disponibilités</p>
          </div>
        </div>
        <div className="text-sm font-medium text-blue-600">Toujours actif</div>
      </div>

      <div className="space-y-6 ml-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée standard des consultations (minutes)
            </label>
            <div className="mt-1">
              <select
                name="appointmentSettings.standardDuration"
                value={formData.appointmentSettings?.standardDuration || 30}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
              >
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Préavis minimum (heures)
            </label>
            <div className="mt-1">
              <select
                name="appointmentSettings.minimumNotice"
                value={formData.appointmentSettings?.minimumNotice || 2}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
              >
                <option value={1}>1 heure</option>
                <option value={2}>2 heures</option>
                <option value={4}>4 heures</option>
                <option value={12}>12 heures</option>
                <option value={24}>24 heures</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="appointmentSettings.allowOnlineBooking"
              checked={formData.appointmentSettings?.allowOnlineBooking || false}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">
              Permettre la prise de rendez-vous en ligne
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="appointmentSettings.allowCancellation"
              checked={formData.appointmentSettings?.allowCancellation || false}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">
              Permettre l'annulation par le patient (jusqu'à 24h avant)
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Créneaux ouverts pour réservation (jours à l'avance)
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="appointmentSettings.bookingWindow"
              value={formData.appointmentSettings?.bookingWindow || 7}
              onChange={handleInputChange}
              disabled={!isEditing}
              min="1"
              max="90"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>
    </div>

    {/* 2. Messagerie et chat médical */}
    <div className="border rounded-lg p-6 hover:border-green-300 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-green-100 p-2 rounded-lg">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Messagerie médicale</h4>
            <p className="text-sm text-gray-500">Communication sécurisée avec les patients</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="messaging.enabled"
            checked={formData.messaging?.enabled || false}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {formData.messaging?.enabled && (
        <div className="space-y-6 ml-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Délai de réponse maximum
              </label>
              <div className="mt-1">
                <select
                  name="messaging.maxResponseTime"
                  value={formData.messaging?.maxResponseTime || 24}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                >
                  <option value={2}>2 heures (Urgent)</option>
                  <option value={6}>6 heures</option>
                  <option value={12}>12 heures</option>
                  <option value={24}>24 heures</option>
                  <option value={48}>48 heures</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période de disponibilité du chat
              </label>
              <div className="mt-1">
                <select
                  name="messaging.availabilityPeriod"
                  value={formData.messaging?.availabilityPeriod || "working_hours"}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                >
                  <option value="24_7">24h/24 - 7j/7</option>
                  <option value="working_hours">Pendant les heures de travail</option>
                  <option value="custom">Personnalisé</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">Fonctionnalités activées</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="messaging.features.photoSharing"
                  checked={formData.messaging?.features?.photoSharing || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Partage de photos</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="messaging.features.fileSharing"
                  checked={formData.messaging?.features?.fileSharing || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Partage de fichiers</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="messaging.features.prescriptionRenewal"
                  checked={formData.messaging?.features?.prescriptionRenewal || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Renouvellement d'ordonnance</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="messaging.features.resultsDiscussion"
                  checked={formData.messaging?.features?.resultsDiscussion || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Discussion des résultats</span>
              </label>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note :</strong> Toutes les conversations sont sécurisées et archivées dans le dossier médical électronique du patient.
            </p>
          </div>
        </div>
      )}
    </div>

    {/* 3. Consultation en cabinet */}
    <div className="border rounded-lg p-6 hover:border-purple-300 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-purple-100 p-2 rounded-lg">
            <BuildingLibraryIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Consultation en cabinet</h4>
            <p className="text-sm text-gray-500">Configuration de votre pratique physique</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="clinicConsultation.enabled"
            checked={formData.clinicConsultation?.enabled || false}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {formData.clinicConsultation?.enabled && (
        <div className="space-y-6 ml-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacité d'accueil (patients/jour)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="clinicConsultation.dailyCapacity"
                  value={formData.clinicConsultation?.dailyCapacity || 20}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min="1"
                  max="100"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temps d'attente moyen (minutes)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="clinicConsultation.averageWaitTime"
                  value={formData.clinicConsultation?.averageWaitTime || 15}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min="0"
                  max="120"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">Services proposés en cabinet</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="clinicConsultation.services.ecg"
                  checked={formData.clinicConsultation?.services?.ecg || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Électrocardiogramme (ECG)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="clinicConsultation.services.smallSurgery"
                  checked={formData.clinicConsultation?.services?.smallSurgery || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Petite chirurgie</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="clinicConsultation.services.vaccination"
                  checked={formData.clinicConsultation?.services?.vaccination || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Vaccination</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="clinicConsultation.services.ultrasound"
                  checked={formData.clinicConsultation?.services?.ultrasound || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Échographie</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="clinicConsultation.services.labTests"
                  checked={formData.clinicConsultation?.services?.labTests || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Prélèvements labo</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="clinicConsultation.services.prenatal"
                  checked={formData.clinicConsultation?.services?.prenatal || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Suivi prénatal</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="clinicConsultation.smartQueue"
                checked={formData.clinicConsultation?.smartQueue || false}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">
                Activer la file d'attente intelligente
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="clinicConsultation.prioritySlots"
                checked={formData.clinicConsultation?.prioritySlots || false}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">
                Réserver des créneaux prioritaires DanAid
              </span>
            </label>
          </div>
        </div>
      )}
    </div>

    {/* 4. Consultations à domicile */}
    <div className="border rounded-lg p-6 hover:border-green-300 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-green-100 p-2 rounded-lg">
            <HomeIcon className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Consultations à domicile</h4>
            <p className="text-sm text-gray-500">Médecine mobile et interventions à domicile</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="homeConsultation.enabled"
            checked={formData.homeConsultation?.enabled || false}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {formData.homeConsultation?.enabled && (
        <div className="space-y-6 ml-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rayon d'intervention maximum (km)
              </label>
              <div className="mt-1">
                <select
                  name="homeConsultation.maxRadius"
                  value={formData.homeConsultation?.maxRadius || 10}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={15}>15 km</option>
                  <option value={20}>20 km</option>
                  <option value={50}>50 km</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frais de déplacement (FCFA)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="homeConsultation.transportFees"
                  value={formData.homeConsultation?.transportFees || 0}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  min="0"
                  step="500"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Délai minimum de réservation
              </label>
              <div className="mt-1">
                <select
                  name="homeConsultation.minimumBookingNotice"
                  value={formData.homeConsultation?.minimumBookingNotice || 24}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                >
                  <option value={2}>2 heures (Urgent)</option>
                  <option value={6}>6 heures</option>
                  <option value={12}>12 heures</option>
                  <option value={24}>24 heures</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plage horaire disponible
              </label>
              <div className="mt-1">
                <select
                  name="homeConsultation.timeSlot"
                  value={formData.homeConsultation?.timeSlot || "all_day"}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                >
                  <option value="morning">Matin (8h-12h)</option>
                  <option value="afternoon">Après-midi (14h-18h)</option>
                  <option value="evening">Soir (18h-22h)</option>
                  <option value="all_day">Toute la journée</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">Conditions et spécificités</h5>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="homeConsultation.conditions.requiresThirdParty"
                  checked={formData.homeConsultation?.conditions?.requiresThirdParty || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Exiger la présence d'un tiers</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="homeConsultation.conditions.parkingAvailable"
                  checked={formData.homeConsultation?.conditions?.parkingAvailable || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Parking nécessaire</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="homeConsultation.conditions.emergencyOnly"
                  checked={formData.homeConsultation?.conditions?.emergencyOnly || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Urgences uniquement</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matériel transportable disponible
            </label>
            <div className="mt-1">
              <textarea
                name="homeConsultation.portableEquipment"
                value={formData.homeConsultation?.portableEquipment || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={3}
                placeholder="Kit de suture, ECG portable, glucomètre, tensiomètre, nébuliseur, etc."
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>
      )}
    </div>

    {/* 5. Téléconsultation */}
    <div className="border rounded-lg p-6 hover:border-blue-300 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg">
            <VideoCameraIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Téléconsultation</h4>
            <p className="text-sm text-gray-500">Consultations médicales à distance</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="teleconsultation.enabled"
            checked={formData.teleconsultation?.enabled || false}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {formData.teleconsultation?.enabled && (
        <div className="space-y-6 ml-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée standard (minutes)
              </label>
              <div className="mt-1">
                <select
                  name="teleconsultation.duration"
                  value={formData.teleconsultation?.duration || 20}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                >
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Délai de confirmation
              </label>
              <div className="mt-1">
                <select
                  name="teleconsultation.confirmationTime"
                  value={formData.teleconsultation?.confirmationTime || 15}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                >
                  <option value={5}>5 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 heure</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">Modes de communication</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="teleconsultation.modes.video"
                  checked={formData.teleconsultation?.modes?.video || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Vidéo HD</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="teleconsultation.modes.audio"
                  checked={formData.teleconsultation?.modes?.audio || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Audio uniquement</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="teleconsultation.modes.text"
                  checked={formData.teleconsultation?.modes?.text || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Chat textuel</span>
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">Fonctionnalités avancées</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="teleconsultation.features.ePrescription"
                  checked={formData.teleconsultation?.features?.ePrescription || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">E-ordonnances sécurisées</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="teleconsultation.features.photoSharing"
                  checked={formData.teleconsultation?.features?.photoSharing || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Partage de photos médicales</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="teleconsultation.features.recording"
                  checked={formData.teleconsultation?.features?.recording || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Enregistrement (avec consentement)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="teleconsultation.features.triage"
                  checked={formData.teleconsultation?.features?.triage || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Questionnaire de pré-tri</span>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Conseil :</strong> Les téléconsultations sont idéales pour le suivi de maladies chroniques, les renouvellements d'ordonnance et les conseils médicaux non urgents.
            </p>
          </div>
        </div>
      )}
    </div>

    {/* 6. Programmes spécialisés */}
    <div className="border rounded-lg p-6 hover:border-purple-300 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="bg-purple-100 p-2 rounded-lg">
            <AcademicCapIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">Programmes de suivi spécialisés</h4>
            <p className="text-sm text-gray-500">Forfaits et suivis à long terme</p>
          </div>
        </div>
        <div className="text-sm font-medium text-blue-600">Optionnel</div>
      </div>

      <div className="space-y-6 ml-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="specializedPrograms.chronicFollowup"
                checked={formData.specializedPrograms?.chronicFollowup || false}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-700">Suivi chronique</span>
                <p className="text-xs text-gray-500 mt-1">
                  Diabète, HTA, asthme - Suivi mensuel avec tableau de bord
                </p>
              </div>
            </label>
          </div>

          <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="specializedPrograms.postnatalFollowup"
                checked={formData.specializedPrograms?.postnatalFollowup || false}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-700">Post-natal</span>
                <p className="text-xs text-gray-500 mt-1">
                  3 visites à domicile + 2 téléconsultations sur 1 mois
                </p>
              </div>
            </label>
          </div>

          <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="specializedPrograms.preventiveCheckup"
                checked={formData.specializedPrograms?.preventiveCheckup || false}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-700">Check-up préventif</span>
                <p className="text-xs text-gray-500 mt-1">
                  Bilan annuel complet pour les familles
                </p>
              </div>
            </label>
          </div>

          <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="specializedPrograms.weightManagement"
                checked={formData.specializedPrograms?.weightManagement || false}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-700">Gestion du poids</span>
                <p className="text-xs text-gray-500 mt-1">
                  Programme de 3 mois avec suivi nutritionnel
                </p>
              </div>
            </label>
          </div>

          <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="specializedPrograms.mentalHealth"
                checked={formData.specializedPrograms?.mentalHealth || false}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-700">Santé mentale</span>
                <p className="text-xs text-gray-500 mt-1">
                  Suivi psychologique et gestion du stress
                </p>
              </div>
            </label>
          </div>

          <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="specializedPrograms.smokingCessation"
                checked={formData.specializedPrograms?.smokingCessation || false}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
              />
              <div className="ml-3">
                <span className="text-sm font-medium text-gray-700">Sevrage tabagique</span>
                <p className="text-xs text-gray-500 mt-1">
                  Programme d'accompagnement sur 6 mois
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            <strong>Note :</strong> Chaque programme spécialisé donne droit à des honoraires supplémentaires et augmente votre visibilité auprès des patients concernés.
          </p>
        </div>
      </div>
    </div>

    {/* Récapitulatif visuel */}
    <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-gray-50">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Récapitulatif de vos services</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className={`p-3 rounded-lg ${formData.appointmentSettings ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Rendez-vous</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Configuration complète</p>
        </div>
        
        <div className={`p-3 rounded-lg ${formData.messaging?.enabled ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
          <div className="flex items-center">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Messagerie</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formData.messaging?.enabled ? 'Activée' : 'Désactivée'}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${formData.clinicConsultation?.enabled ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
          <div className="flex items-center">
            <BuildingLibraryIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Cabinet</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formData.clinicConsultation?.enabled ? 'Activé' : 'Désactivé'}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${formData.homeConsultation?.enabled ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
          <div className="flex items-center">
            <HomeIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Domicile</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formData.homeConsultation?.enabled ? 'Activé' : 'Désactivé'}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${formData.teleconsultation?.enabled ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
          <div className="flex items-center">
            <VideoCameraIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Téléconsultation</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formData.teleconsultation?.enabled ? 'Activée' : 'Désactivée'}
          </p>
        </div>
        
        <div className={`p-3 rounded-lg ${Object.values(formData.specializedPrograms || {}).some(v => v) ? 'bg-green-50 border border-green-200' : 'bg-gray-100'}`}>
          <div className="flex items-center">
            <AcademicCapIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Programmes</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {Object.values(formData.specializedPrograms || {}).filter(v => v).length} actifs
          </p>
        </div>
      </div>
    </div>
  </div>
);

      case 5: // Disponibilité
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="availability.status" className="block text-sm font-medium text-gray-700">
                  Statut de disponibilité
                </label>
                <div className="mt-1">
                  <select
                    name="availability.status"
                    id="availability.status"
                    value={formData.availability.status}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                  >
                    <option value="available">Disponible</option>
                    <option value="busy">Occupé</option>
                    <option value="emergencyOnly">Urgences uniquement</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="availability.preparationTime" className="block text-sm font-medium text-gray-700">
                  Temps de préparation entre rendez-vous (minutes)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="availability.preparationTime"
                    id="availability.preparationTime"
                    value={formData.availability.preparationTime}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="0"
                    max="60"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Pour finaliser la saisie du rapport médical</p>
              </div>

              <div className="sm:col-span-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="availability.delegationEnabled"
                    checked={formData.availability.delegationEnabled}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Permettre la délégation de compte à un assistant/infirmier
                  </span>
                </label>
              </div>

              <div className="sm:col-span-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Plages horaires de travail</h4>
                <div className="space-y-2">
                  {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'].map(day => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{day}</span>
                      <div className="flex space-x-2">
                        <input
                          type="time"
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-32 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                        />
                        <span className="text-gray-500">à</span>
                        <input
                          type="time"
                          disabled={!isEditing}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-32 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 6: // Conventions
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Conditions générales de "Médecin de famille DanAid"</h4>
                  <p className="mt-2 text-sm text-gray-700">
                    En validant ces conditions, vous acceptez le rôle de gatekeeper (médecin référent) dans le parcours de soins des patients DanAid. Vous vous engagez à orienter les patients dans le réseau de soins DanAid et à assurer leur suivi numérique.
                  </p>
                  
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-gray-700">
                      • Vous serez rémunéré pour le suivi numérique et la coordination des soins
                    </p>
                    <p className="text-sm text-gray-700">
                      • Vous devez respecter les délais de réponse définis (consultation sous 24h, urgences sous 2h)
                    </p>
                    <p className="text-sm text-gray-700">
                      • Vous vous engagez à utiliser la plateforme DanAid pour la prescription et le suivi
                    </p>
                    <p className="text-sm text-gray-700">
                      • Votre profil sera visible dans l'annuaire des médecins de famille DanAid
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  name="acceptedConventions"
                  checked={formData.acceptedConventions}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                  required
                />
                <span className="ml-3 text-sm text-gray-700">
                  Je certifie avoir lu et accepté les conditions générales de "Médecin de famille DanAid" et m'engage à remplir le rôle de médecin référent pour mes patients.
                </span>
              </label>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-yellow-800">
                <strong>Important :</strong> Votre compte sera soumis à vérification après soumission. Vous recevrez une confirmation par email et WhatsApp une fois votre profil validé et activé.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation par étapes */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                ${activeStep === step.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <step.icon className={`h-5 w-5 mr-2 ${activeStep === step.id ? 'text-blue-500' : 'text-gray-400'}`} />
              {step.name}
              <span className="ml-2 bg-gray-100 text-gray-900 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {step.id}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu de l'étape */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {steps.find(s => s.id === activeStep)?.name} - Médecin de famille DanAid
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {activeStep === 1 && "Identité civile et coordonnées pour apparaître dans l'annuaire"}
              {activeStep === 2 && "Vérification de votre légitimité d'exercice"}
              {activeStep === 3 && "Configuration des moyens de rémunération"}
              {activeStep === 4 && "Configuration de vos types de prestations"}
              {activeStep === 5 && "Gestion de votre disponibilité"}
              {activeStep === 6 && "Validation des conventions DanAid"}
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            {renderStepContent()}
          </div>

          {/* Navigation entre étapes */}
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
            <div className="flex justify-between">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Précédent
                </button>
              )}
              
              <div className="flex space-x-3 ml-auto">
                {activeStep < steps.length && (
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep + 1)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Suivant
                    <span className="ml-2">→</span>
                  </button>
                )}
                
                {activeStep === steps.length && isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <XMarkIcon className="-ml-1 mr-2 h-5 w-5" />
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                      Valider et soumettre
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {!isEditing && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PencilIcon className="-ml-1 mr-2 h-5 w-5" />
            Modifier le profil
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilTab;