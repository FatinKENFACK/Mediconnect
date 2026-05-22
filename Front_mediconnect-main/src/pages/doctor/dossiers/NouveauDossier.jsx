import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  UserCircleIcon,
  CalendarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Données factices pour la démo
const patients = [
  { id: 1, nom: 'Jean Dupont', dateNaissance: '15/03/1985', email: 'jean.dupont@example.com', telephone: '06 12 34 56 78' },
  { id: 2, nom: 'Marie Martin', dateNaissance: '22/07/1990', email: 'marie.martin@example.com', telephone: '06 23 45 67 89' },
  { id: 3, nom: 'Pierre Durand', dateNaissance: '05/11/1978', email: 'pierre.durand@example.com', telephone: '06 34 56 78 90' },
  { id: 4, nom: 'Sophie Bernard', dateNaissance: '18/09/1982', email: 'sophie.bernard@example.com', telephone: '06 45 67 89 01' },
  { id: 5, nom: 'Thomas Moreau', dateNaissance: '30/01/1995', email: 'thomas.moreau@example.com', telephone: '06 56 78 90 12' },
];

const NouveauDossier = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    patientId: '',
    numeroSecuriteSociale: '',
    genre: '',
    adresse: '',
    ville: '',
    codePostal: '',
    telephone: '',
    email: '',
    profession: '',
    groupeSanguin: '',
    poids: '',
    taille: '',
    antecedents: '',
    allergies: '',
    antecedentsFamiliaux: '',
    habitudesVie: '',
    medecinTraitant: '',
    personneAPrevenir: {
      nom: '',
      telephone: '',
      lien: ''
    }
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      telephone: patient.telephone,
      email: patient.email
    }));
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de soumission ici
    console.log('Nouveau dossier créé :', { ...formData, patient: selectedPatient });
    // Redirection après création
    navigate('/medecin/dossiers');
  };

  const filteredPatients = patients.filter(patient =>
    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Retour aux dossiers
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Nouveau dossier médical</h1>
        <p className="mt-1 text-sm text-gray-500">
          {step === 1 ? 'Sélectionnez un patient existant ou créez-en un nouveau' : 'Complétez les informations du dossier'}
        </p>
      </div>

      {step === 1 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Sélection du patient
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Recherchez un patient existant ou créez-en un nouveau.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <div className="px-4 py-5 sm:p-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Rechercher un patient par nom ou email"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Patients correspondants
                </h4>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {filteredPatients.map((patient) => (
                      <li key={patient.id}>
                        <button
                          onClick={() => handleSelectPatient(patient)}
                          className="block hover:bg-gray-50 w-full text-left"
                        >
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <UserCircleIcon className="h-10 w-10 text-gray-400" />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {patient.nom}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Né(e) le {patient.dateNaissance}
                                  </div>
                                </div>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <svg
                                  className="h-5 w-5 text-gray-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                  <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                  {patient.email}
                                </div>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <PhoneIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                {patient.telephone}
                              </div>
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                    Créer un nouveau patient
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Informations personnelles
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
                    Genre *
                  </label>
                  <select
                    id="genre"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    required
                  >
                    <option value="">Sélectionner un genre</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="numeroSecuriteSociale" className="block text-sm font-medium text-gray-700">
                    Numéro de sécurité sociale *
                  </label>
                  <input
                    type="text"
                    name="numeroSecuriteSociale"
                    id="numeroSecuriteSociale"
                    value={formData.numeroSecuriteSociale}
                    onChange={handleChange}
                    placeholder="1 85 03 15 123 456 78"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    id="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="codePostal" className="block text-sm font-medium text-gray-700">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    name="codePostal"
                    id="codePostal"
                    value={formData.codePostal}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="ville" className="block text-sm font-medium text-gray-700">
                    Ville *
                  </label>
                  <input
                    type="text"
                    name="ville"
                    id="ville"
                    value={formData.ville}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                    Téléphone *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <label htmlFor="country" className="sr-only">Pays</label>
                      <select
                        id="country"
                        name="country"
                        className="focus:ring-blue-500 focus:border-blue-500 h-full py-0 pl-3 pr-1 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-l-md"
                      >
                        <option>FR</option>
                        <option>BE</option>
                        <option>CH</option>
                      </select>
                    </div>
                    <input
                      type="tel"
                      name="telephone"
                      id="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-16 sm:text-sm border-gray-300 rounded-md"
                      placeholder="6 12 34 56 78"
                      required
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
                    Profession
                  </label>
                  <input
                    type="text"
                    name="profession"
                    id="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="groupeSanguin" className="block text-sm font-medium text-gray-700">
                    Groupe sanguin
                  </label>
                  <select
                    id="groupeSanguin"
                    name="groupeSanguin"
                    value={formData.groupeSanguin}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Non renseigné</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="poids" className="block text-sm font-medium text-gray-700">
                    Poids (kg)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="poids"
                      id="poids"
                      value={formData.poids}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.0"
                      min="0"
                      step="0.1"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">kg</span>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="taille" className="block text-sm font-medium text-gray-700">
                    Taille (cm)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      name="taille"
                      id="taille"
                      value={formData.taille}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0"
                      min="0"
                      max="250"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">cm</span>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    IMC
                  </label>
                  <div className="mt-1 px-3 py-2 bg-gray-50 text-sm text-gray-700 border border-gray-200 rounded-md">
                    {formData.poids && formData.taille 
                      ? (formData.poids / Math.pow(formData.taille / 100, 2)).toFixed(1)
                      : '--'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Antécédents médicaux
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="antecedents" className="block text-sm font-medium text-gray-700">
                    Antécédents médicaux personnels
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="antecedents"
                      name="antecedents"
                      rows={3}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Maladies chroniques, interventions chirurgicales, hospitalisations..."
                      value={formData.antecedents}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                    Allergies connues
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="allergies"
                      name="allergies"
                      rows={2}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Médicaments, aliments, autres..."
                      value={formData.allergies}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="antecedentsFamiliaux" className="block text-sm font-medium text-gray-700">
                    Antécédents familiaux
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="antecedentsFamiliaux"
                      name="antecedentsFamiliaux"
                      rows={2}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Maladies héréditaires ou fréquentes dans la famille..."
                      value={formData.antecedentsFamiliaux}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="habitudesVie" className="block text-sm font-medium text-gray-700">
                    Habitudes de vie
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="habitudesVie"
                      name="habitudesVie"
                      rows={2}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      placeholder="Tabac, alcool, activité physique, alimentation..."
                      value={formData.habitudesVie}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Personne à prévenir en cas d'urgence
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="personneAPrevenir.nom" className="block text-sm font-medium text-gray-700">
                    Nom et prénom *
                  </label>
                  <input
                    type="text"
                    name="personneAPrevenir.nom"
                    id="personneAPrevenir.nom"
                    value={formData.personneAPrevenir.nom}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="personneAPrevenir.lien" className="block text-sm font-medium text-gray-700">
                    Lien avec le patient *
                  </label>
                  <input
                    type="text"
                    name="personneAPrevenir.lien"
                    id="personneAPrevenir.lien"
                    value={formData.personneAPrevenir.lien}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Conjoint, parent, ami..."
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="personneAPrevenir.telephone" className="block text-sm font-medium text-gray-700">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="personneAPrevenir.telephone"
                    id="personneAPrevenir.telephone"
                    value={formData.personneAPrevenir.telephone}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Informations complémentaires
              </h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="medecinTraitant" className="block text-sm font-medium text-gray-700">
                    Médecin traitant
                  </label>
                  <input
                    type="text"
                    name="medecinTraitant"
                    id="medecinTraitant"
                    value={formData.medecinTraitant}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Dr. Nom Prénom"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5 inline" />
              Retour
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Créer le dossier
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NouveauDossier;
