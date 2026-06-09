import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon, AcademicCapIcon, BriefcaseIcon,
  ArrowLeftIcon, CameraIcon, DocumentTextIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const AddDoctor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    dateOfBirth: '', gender: 'homme',
    speciality: '', licenseNumber: '',
    experience: '', biography: '',
    languages: ['Français'],
    skills: [],
    consultationPrice: 15000,
    feeVideo: 18000,
    onlineConsultation: true,
    hospitalCode: '',
    photo: null, photoPreview: null,
    education: [{ degree: '', institution: '', year: '', country: '' }],
    experienceHistory: [{ hospital: '', position: '', startDate: '', endDate: '', current: false }],
    availability: {
      monday:    { morning: true,  afternoon: true,  evening: false },
      tuesday:   { morning: true,  afternoon: true,  evening: false },
      wednesday: { morning: true,  afternoon: true,  evening: false },
      thursday:  { morning: true,  afternoon: true,  evening: false },
      friday:    { morning: true,  afternoon: true,  evening: false },
      saturday:  { morning: false, afternoon: false, evening: false },
      sunday:    { morning: false, afternoon: false, evening: false },
    },
  });

  const [currentStep, setCurrentStep]   = useState(1);
  const [errors, setErrors]             = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState(null);
  const [success, setSuccess]           = useState(false);

  const totalSteps = 4;
  const steps = [
    { id: 1, title: 'Infos personnelles',    icon: UserCircleIcon },
    { id: 2, title: 'Formation & expérience', icon: AcademicCapIcon },
    { id: 3, title: 'Compétences',           icon: BriefcaseIcon },
    { id: 4, title: 'Finalisation',          icon: DocumentTextIcon },
  ];

  const specialities = [
    'Cardiologie','Pédiatrie','Radiologie','Gynécologie','Chirurgie générale',
    'Médecine interne','Dermatologie','Ophtalmologie','ORL','Neurologie',
    'Oncologie','Psychiatrie','Anesthésiologie','Urgence','Réanimation',
  ];

  const languages = ['Français','Anglais','Wolof','Pulaar','Sérère','Arabe'];
  const skillsList = [
    'Ultrasonographie','Échocardiographie','Endoscopie','Laparoscopie',
    'Réanimation','Urgences','Soins intensifs','Téléconsultation',
  ];

  const dayLabels = {
    monday:'Lundi', tuesday:'Mardi', wednesday:'Mercredi',
    thursday:'Jeudi', friday:'Vendredi', saturday:'Samedi', sunday:'Dimanche',
  };

  // ---- Handlers ----
  const set = (field, value) => {
    setFormData(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: '' }));
  };

  const handleFileChange = (field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData(p => ({ ...p, [field]: file, [`${field}Preview`]: reader.result }));
    reader.readAsDataURL(file);
  };

  const toggleList = (field, value) =>
    setFormData(p => ({
      ...p,
      [field]: p[field].includes(value) ? p[field].filter(i => i !== value) : [...p[field], value],
    }));

  const setEdu = (i, f, v) =>
    setFormData(p => ({ ...p, education: p.education.map((e, idx) => idx === i ? { ...e, [f]: v } : e) }));
  const addEdu = () => setFormData(p => ({ ...p, education: [...p.education, { degree:'', institution:'', year:'', country:'' }] }));
  const removeEdu = (i) => setFormData(p => ({ ...p, education: p.education.filter((_, idx) => idx !== i) }));

  const setExp = (i, f, v) =>
    setFormData(p => ({ ...p, experienceHistory: p.experienceHistory.map((e, idx) => idx === i ? { ...e, [f]: v } : e) }));
  const addExp = () => setFormData(p => ({ ...p, experienceHistory: [...p.experienceHistory, { hospital:'', position:'', startDate:'', endDate:'', current:false }] }));
  const removeExp = (i) => setFormData(p => ({ ...p, experienceHistory: p.experienceHistory.filter((_, idx) => idx !== i) }));

  // ---- Validation par étape ----
  const validateStep = (step) => {
    const e = {};
    if (step === 1) {
      if (!formData.firstName)    e.firstName    = 'Le prénom est requis';
      if (!formData.lastName)     e.lastName     = 'Le nom est requis';
      if (!formData.email)        e.email        = "L'email est requis";
      if (!formData.phone)        e.phone        = 'Le téléphone est requis';
      if (!formData.speciality)   e.speciality   = 'La spécialité est requise';
      if (!formData.licenseNumber)e.licenseNumber= 'Le numéro de licence est requis';
    }
    if (step === 2 && !formData.education.some(ed => ed.degree && ed.institution))
      e.education = 'Au moins une formation complète est requise';
    if (step === 3 && formData.consultationPrice <= 0)
      e.consultationPrice = 'Le tarif doit être supérieur à 0';
    if (step === 4 && !formData.hospitalCode)
      e.hospitalCode = 'Le code hôpital est requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => { if (validateStep(currentStep)) setCurrentStep(p => Math.min(p + 1, totalSteps)); };
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 1));

  // ---- Soumission connectée au backend ----
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Utilise api.registerDoctor qui appelle POST /api/accounts/register/doctor/
      await api.registerDoctor({
        firstName:       formData.firstName,
        lastName:        formData.lastName,
        email:           formData.email,
        password:        formData.password || 'Mediconnect2024!', // mot de passe temporaire
        confirmPassword: formData.password || 'Mediconnect2024!',
        phone:           formData.phone,
        gender:          formData.gender,
        dateOfBirth:     formData.dateOfBirth || null,
        specialization:  formData.speciality,
        licenseNumber:   formData.licenseNumber,
        experienceYears: parseInt(formData.experience) || 0,
        bio:             formData.biography,
        languages:       formData.languages.join(', '),
        feeInPerson:     formData.consultationPrice,
        feeVideo:        formData.feeVideo,
        hospitalCode:    formData.hospitalCode,
      });

      setSuccess(true);
      setTimeout(() => navigate('/hopital/medecins'), 2000);
    } catch (err) {
      setSubmitError(err.message || "Erreur lors de l'ajout du médecin. Vérifiez le code hôpital et les informations.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Rendu du contenu par étape ----
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Informations personnelles et professionnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label:'Prénom *',     field:'firstName',    type:'text',  placeholder:'Martin' },
                { label:'Nom *',        field:'lastName',     type:'text',  placeholder:'Laurent' },
                { label:'Email *',      field:'email',        type:'email', placeholder:'dr.martin@email.com' },
                { label:'Téléphone *',  field:'phone',        type:'tel',   placeholder:'+237 6XX XXX XXX' },
                { label:'Date de naissance', field:'dateOfBirth', type:'date', placeholder:'' },
                { label:'Numéro de licence *', field:'licenseNumber', type:'text', placeholder:'MED-2024-001' },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input type={type} value={formData[field]}
                    onChange={e => set(field, e.target.value)}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[field] ? 'border-red-400' : 'border-gray-300'}`} />
                  {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                <select value={formData.gender} onChange={e => set('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité *</label>
                <select value={formData.speciality} onChange={e => set('speciality', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.speciality ? 'border-red-400' : 'border-gray-300'}`}>
                  <option value="">Sélectionnez une spécialité</option>
                  {specialities.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.speciality && <p className="text-red-500 text-xs mt-1">{errors.speciality}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
              <textarea value={formData.biography} onChange={e => set('biography', e.target.value)}
                rows={3} placeholder="Décrivez votre expérience médicale..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo de profil</label>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.photoPreview
                    ? <img src={formData.photoPreview} className="h-16 w-16 object-cover" alt="" />
                    : <UserCircleIcon className="h-10 w-10 text-gray-400" />}
                </div>
                <label htmlFor="photo-upload"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer flex items-center text-sm">
                  <CameraIcon className="h-4 w-4 mr-2" />
                  Choisir une photo
                </label>
                <input type="file" id="photo-upload" accept="image/*"
                  onChange={e => handleFileChange('photo', e.target.files[0])} className="hidden" />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Formation et expérience</h3>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">Formation académique</h4>
                <button type="button" onClick={addEdu}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  + Ajouter
                </button>
              </div>
              {errors.education && <p className="text-red-500 text-sm mb-2">{errors.education}</p>}
              {formData.education.map((edu, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { label:'Diplôme',     field:'degree',      placeholder:'Doctorat en Médecine' },
                      { label:'Institution', field:'institution', placeholder:'Université de Yaoundé' },
                      { label:'Année',       field:'year',        placeholder:'2018' },
                      { label:'Pays',        field:'country',     placeholder:'Cameroun' },
                    ].map(({ label, field, placeholder }) => (
                      <div key={field}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                        <input type="text" value={edu[field]}
                          onChange={e => setEdu(i, field, e.target.value)}
                          placeholder={placeholder}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                      </div>
                    ))}
                  </div>
                  {formData.education.length > 1 && (
                    <button type="button" onClick={() => removeEdu(i)}
                      className="mt-2 text-red-500 text-xs hover:text-red-700">Supprimer</button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-800">Expérience professionnelle</h4>
                <button type="button" onClick={addExp}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  + Ajouter
                </button>
              </div>
              {formData.experienceHistory.map((exp, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Établissement</label>
                      <input type="text" value={exp.hospital} onChange={e => setExp(i, 'hospital', e.target.value)}
                        placeholder="Hôpital Central" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Poste</label>
                      <input type="text" value={exp.position} onChange={e => setExp(i, 'position', e.target.value)}
                        placeholder="Médecin Cardiologue" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Date début</label>
                      <input type="date" value={exp.startDate} onChange={e => setExp(i, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Date fin</label>
                      <input type="date" value={exp.endDate} onChange={e => setExp(i, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                    </div>
                  </div>
                  <label className="flex items-center mt-2 text-sm">
                    <input type="checkbox" checked={exp.current} onChange={e => setExp(i, 'current', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded mr-2" />
                    Poste actuel
                  </label>
                  {formData.experienceHistory.length > 1 && (
                    <button type="button" onClick={() => removeExp(i)}
                      className="mt-2 text-red-500 text-xs hover:text-red-700">Supprimer</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Compétences et disponibilité</h3>

            <div>
              <h4 className="font-medium text-gray-800 mb-3">Compétences techniques</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {skillsList.map(s => (
                  <label key={s} className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={formData.skills.includes(s)} onChange={() => toggleList('skills', s)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    {s}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-3">Langues parlées</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {languages.map(l => (
                  <label key={l} className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={formData.languages.includes(l)} onChange={() => toggleList('languages', l)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    {l}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarif présentiel (XAF) *</label>
                <input type="number" value={formData.consultationPrice}
                  onChange={e => set('consultationPrice', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${errors.consultationPrice ? 'border-red-400' : 'border-gray-300'}`} />
                {errors.consultationPrice && <p className="text-red-500 text-xs mt-1">{errors.consultationPrice}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarif vidéo (XAF)</label>
                <input type="number" value={formData.feeVideo}
                  onChange={e => set('feeVideo', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Années d'expérience</label>
                <input type="number" value={formData.experience}
                  onChange={e => set('experience', e.target.value)}
                  placeholder="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-3">Disponibilité hebdomadaire</h4>
              <div className="space-y-2">
                {Object.entries(formData.availability).map(([day, times]) => (
                  <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 w-24">{dayLabels[day]}</span>
                    <div className="flex gap-4">
                      {['morning','afternoon','evening'].map(period => (
                        <label key={period} className="flex items-center gap-1 text-xs text-gray-600">
                          <input type="checkbox" checked={times[period]}
                            onChange={e => set('availability', {
                              ...formData.availability,
                              [day]: { ...times, [period]: e.target.checked }
                            })}
                            className="h-3.5 w-3.5 text-blue-600 border-gray-300 rounded" />
                          {period === 'morning' ? 'Matin' : period === 'afternoon' ? 'A.midi' : 'Soir'}
                        </label>
                      ))}
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
            <h3 className="text-lg font-semibold text-gray-900">Finalisation et enregistrement</h3>

            {/* Code hôpital — requis par l'API */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-1">Code hôpital *</p>
              <p className="text-xs text-blue-700 mb-3">
                Le médecin sera rattaché à votre établissement via ce code. Trouvez-le dans les paramètres de votre hôpital.
              </p>
              <input type="text" value={formData.hospitalCode}
                onChange={e => set('hospitalCode', e.target.value.toUpperCase())}
                placeholder="EX: HOSP-ABCD-1234"
                className={`w-full px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 ${errors.hospitalCode ? 'border-red-400' : 'border-blue-300'}`} />
              {errors.hospitalCode && <p className="text-red-500 text-xs mt-1">{errors.hospitalCode}</p>}
            </div>

            {/* Mot de passe temporaire */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe temporaire</label>
              <input type="password" value={formData.password || ''}
                onChange={e => set('password', e.target.value)}
                placeholder="Laissez vide pour mot de passe par défaut"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
              <p className="text-xs text-gray-400 mt-1">
                Si vide, le mot de passe par défaut sera <code>Mediconnect2024!</code>. Le médecin devra le changer à sa première connexion.
              </p>
            </div>

            {/* Résumé */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Récapitulatif</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Nom :</span>
                  <span className="ml-2 font-medium">Dr. {formData.firstName} {formData.lastName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Spécialité :</span>
                  <span className="ml-2 font-medium">{formData.speciality || '—'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Email :</span>
                  <span className="ml-2 font-medium">{formData.email || '—'}</span>
                </div>
                <div>
                  <span className="text-gray-500">Tarif présentiel :</span>
                  <span className="ml-2 font-medium">{Number(formData.consultationPrice).toLocaleString('fr-FR')} XAF</span>
                </div>
                <div>
                  <span className="text-gray-500">Tarif vidéo :</span>
                  <span className="ml-2 font-medium">{Number(formData.feeVideo).toLocaleString('fr-FR')} XAF</span>
                </div>
                <div>
                  <span className="text-gray-500">Expérience :</span>
                  <span className="ml-2 font-medium">{formData.experience ? `${formData.experience} ans` : '—'}</span>
                </div>
              </div>
            </div>

            {/* Erreur soumission */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {submitError}
              </div>
            )}
          </div>
        );

      default: return null;
    }
  };

  // ---- Succès ----
  if (success) return (
    <div className="p-6 flex flex-col items-center justify-center min-h-96">
      <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <CheckCircleIcon className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Médecin ajouté avec succès !</h2>
      <p className="text-gray-500 text-sm mt-2">
        Dr. {formData.firstName} {formData.lastName} a été enregistré sur la plateforme.
      </p>
      <p className="text-gray-400 text-xs mt-1">Redirection en cours...</p>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex items-center">
        <button onClick={() => navigate('/hopital/medecins')} className="mr-4 p-2 text-gray-600 hover:text-gray-800">
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ajouter un médecin</h1>
          <p className="text-gray-500 mt-1">Créez le profil d'un nouveau médecin pour votre établissement</p>
        </div>
      </div>

      {/* Étapes */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <p className={`ml-2 text-sm font-medium hidden sm:block ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 hidden sm:block ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {renderStep()}

        {/* Boutons navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button type="button" onClick={prevStep} disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-sm">
            ← Précédent
          </button>

          {currentStep === totalSteps ? (
            <button type="submit" disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 text-sm">
              {isSubmitting
                ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Enregistrement...</>
                : 'Enregistrer le médecin'}
            </button>
          ) : (
            <button type="button" onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Suivant →
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;