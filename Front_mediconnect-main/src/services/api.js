// ============================================================
//  services/api.js
// ============================================================

const BASE_URL = 'http://localhost:8000/api';

// ================= TOKEN MANAGEMENT =================

// Sauvegarder token
const saveTokens = ({ access, refresh }) => {
  localStorage.setItem('access', access);
  localStorage.setItem('refresh', refresh);
};

// Récupérer access token
const getAccessToken = () => localStorage.getItem('access')
// Récupérer refresh token
const getRefreshToken = () => localStorage.getItem('refresh');

// Supprimer tokens
const clearTokens = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
};

// ================= REQUEST =================

const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Gestion refresh token
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      headers['Authorization'] = `Bearer ${getAccessToken()}`;

      const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      return handleResponse(retryResponse);
    } else {
      clearTokens();
      window.location.href = '/connexion';
      return;
    }
  }

  return handleResponse(response);
};

// ================= RESPONSE =================

// ================= RESPONSE =================

const handleResponse = async (response) => {
  // Si la réponse est vide (204 No Content) — cas d'une suppression
  if (response.status === 204) {
    return null;  // On retourne null sans essayer de parser du JSON
  }

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data.error ||
      data.detail ||
      data.non_field_errors?.[0] ||
      Object.values(data)?.[0]?.[0] ||
      'Une erreur est survenue';

    throw new Error(errorMessage);
  }

  return data;
};

// ================= REFRESH TOKEN =================

const refreshAccessToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/accounts/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: getRefreshToken() }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access', data.access);
      return true;
    }

    return false;
  } catch {
    return false;
  }
};

// ================= AUTH =================

const login = async (email, password) => {
  const data = await request('/accounts/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  saveTokens(data.tokens);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

const registerPatient = async (formData) => {
  const payload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    date_of_birth: formData.dateOfBirth || null,
    gender: formData.gender || '',
    address: formData.address || '',
    city: formData.city || '',
    region: formData.region || '',
    postal_code: formData.postalCode || '',
    password: formData.password,
    confirm_password: formData.confirmPassword,
  };

  const data = await request('/accounts/register/patient/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  saveTokens(data.tokens);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

// ================= PROFILE =================

const getProfile = async () => {
  return await request('/accounts/profile/');
};

const updateProfile = async (profileData) => {
  const formData = new FormData();

  Object.keys(profileData).forEach((key) => {
    if (profileData[key] !== null && profileData[key] !== undefined) {
      formData.append(key, profileData[key]);
    }
  });

  const token = getAccessToken();

  const response = await fetch(`${BASE_URL}/accounts/profile/update/`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return handleResponse(response);
};

const logout = () => {
  clearTokens();
};

// ================= APPOINTMENTS =================

const getAppointments = async () => {
  return await request('/appointments/');
};

const createAppointment = async (appointmentData) => {
  return await request('/appointments/', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
};

const cancelAppointment = async (id) => {
  return await request(`/appointments/${id}/`, {
    method: 'DELETE',
  });
};

// ================= HOSPITAL =================

// Inscription hôpital
// POST /api/accounts/register/hospital/
const registerHospital = async (formData) => {
  const payload = {
    email: formData.email,
    password: formData.password,
    confirm_password: formData.confirmPassword,
    name: formData.name,
    registration_number: formData.registrationNumber,
    hospital_type: formData.hospitalType,
    phone: formData.phone,
    address: formData.address,
    city: formData.city,
    region: formData.region,
    website: formData.website || '',
  };

  const data = await request('/accounts/register/hospital/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  // Si compte en attente de validation, pas de tokens
  if (data.pending) {
    return data;
  }

  saveTokens(data.tokens);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

// Inscription médecin avec code hôpital
const registerDoctor = async (formData) => {
  const payload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    password: formData.password,
    confirm_password: formData.confirmPassword,
    phone: formData.phone,
    gender: formData.gender || '',
    date_of_birth: formData.dateOfBirth || null,
    specialization: formData.specialization,
    license_number: formData.licenseNumber,
    experience_years: parseInt(formData.experienceYears) || 0,
    bio: formData.bio || '',
    languages: formData.languages || '',
    fee_in_person: parseInt(formData.feeInPerson) || 5000,
    fee_video: parseInt(formData.feeVideo) || 6000,
    hospital_code: formData.hospitalCode.toUpperCase(),
  };

  const data = await request('/accounts/register/doctor/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  saveTokens(data.tokens);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

// Récupère le profil de l'hôpital connecté
// GET /api/accounts/hospital/profile/
const getHospitalProfile = async () => {
  return await request('/accounts/hospital/profile/');
};

// Met à jour le profil hôpital
const updateHospitalProfile = async (data) => {
  return await request('/accounts/hospital/profile/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// ================= ADMIN =================

const getAdminStats = async () => {
  return await request('/accounts/admin/stats/');
};

const getAdminHospitals = async () => {
  return await request('/accounts/admin/hospitals/');
};

const updateHospitalStatus = async (id, action) => {
  return await request(`/accounts/admin/hospitals/${id}/status/`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
};

const getAdminDoctors = async () => {
  return await request('/accounts/admin/doctors/');
};

const updateDoctorStatus = async (id, action) => {
  return await request(`/accounts/admin/doctors/${id}/status/`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
};

// Récupère le profil du médecin connecté
const getDoctorProfile = async () => {
  return await request('/accounts/doctor/profile/');
};

// Met à jour le profil du médecin
const updateDoctorProfile = async (data) => {
  return await request('/accounts/doctor/profile/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Rendez-vous du médecin connecté
const getDoctorAppointments = async () => {
  return await request('/appointments/doctor/');
};

// Rendez-vous du médecin aujourd'hui
const getDoctorAppointmentsToday = async () => {
  return await request('/appointments/doctor/stats/');
};
// Met à jour le statut d'un rendez-vous (médecin)
const updateAppointmentStatus = async (id, status) => {
  return await request(`/appointments/doctor/${id}/status/`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

// Récupère la liste de tous les médecins
const getDoctors = async () => {
  return await request('/accounts/doctors/');
};


// ============================================================
// MEDICAL RECORDS
// Toutes les fonctions pour le dossier médical
// 'request' est notre fonction centrale qui gère le token JWT
// ============================================================

// -------- ANTÉCÉDENTS MÉDICAUX --------

// Récupère la liste de tous les antécédents du patient connecté
// GET /api/medical/history/
const getMedicalHistory = async () => {
  return await request('/medical/history/');
};

// Crée un nouvel antécédent médical
// POST /api/medical/history/
// 'data' contient : condition, date, status, notes
const createMedicalHistory = async (data) => {
  return await request('/medical/history/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Modifie un antécédent existant
// PATCH /api/medical/history/<id>/
// 'id' est l'identifiant de l'antécédent à modifier
const updateMedicalHistory = async (id, data) => {
  return await request(`/medical/history/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Supprime un antécédent médical
// DELETE /api/medical/history/<id>/
const deleteMedicalHistory = async (id) => {
  return await request(`/medical/history/${id}/`, {
    method: 'DELETE',
  });
};

// -------- ALLERGIES --------

// Récupère la liste de toutes les allergies du patient
// GET /api/medical/allergies/
const getAllergies = async () => {
  return await request('/medical/allergies/');
};

// Crée une nouvelle allergie
// POST /api/medical/allergies/
// 'data' contient : name, type, severity, notes
const createAllergy = async (data) => {
  return await request('/medical/allergies/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Modifie une allergie existante
// PATCH /api/medical/allergies/<id>/
const updateAllergy = async (id, data) => {
  return await request(`/medical/allergies/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Supprime une allergie
// DELETE /api/medical/allergies/<id>/
const deleteAllergy = async (id) => {
  return await request(`/medical/allergies/${id}/`, {
    method: 'DELETE',
  });
};

// -------- MÉDICAMENTS --------

// Récupère la liste de tous les médicaments du patient
// GET /api/medical/medications/
const getMedications = async () => {
  return await request('/medical/medications/');
};

// Crée un nouveau médicament
// POST /api/medical/medications/
// 'data' contient : name, dosage, frequency, start_date, prescriber, notes
const createMedication = async (data) => {
  return await request('/medical/medications/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Modifie un médicament existant
// PATCH /api/medical/medications/<id>/
const updateMedication = async (id, data) => {
  return await request(`/medical/medications/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Supprime un médicament
// DELETE /api/medical/medications/<id>/
const deleteMedication = async (id) => {
  return await request(`/medical/medications/${id}/`, {
    method: 'DELETE',
  });
};

// -------- DOCUMENTS MÉDICAUX --------

// Récupère la liste de tous les documents du patient
// GET /api/medical/documents/
const getMedicalDocuments = async () => {
  return await request('/medical/documents/');
};

// Upload un nouveau document médical
// POST /api/medical/documents/
// Utilise FormData car on envoie un fichier (pas du JSON)
const uploadMedicalDocument = async (data) => {
  const token = getAccessToken();

  // FormData permet d'envoyer des fichiers avec fetch
  const formData = new FormData();
  formData.append('name', data.name);       // Nom du document
  formData.append('type', data.type);       // Type de document
  formData.append('file', data.file);       // Le fichier lui-même

  // On n'utilise pas 'request' ici car on ne met pas Content-Type
  // Le navigateur le définit automatiquement avec la boundary pour multipart
  const response = await fetch(`${BASE_URL}/medical/documents/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,   // Token JWT pour l'authentification
    },
    body: formData,                          // Données du formulaire avec le fichier
  });

  return handleResponse(response);
};

// Supprime un document médical
// DELETE /api/medical/documents/<id>/
const deleteMedicalDocument = async (id) => {
  return await request(`/medical/documents/${id}/`, {
    method: 'DELETE',
  });
};

// Liste publique des hôpitaux
const getPublicHospitals = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await request(`/accounts/hospitals/public/${query ? '?' + query : ''}`);
};

// Détail d'un hôpital
const getPublicHospitalDetail = async (id) => {
  return await request(`/accounts/hospitals/public/${id}/`);
};

// ================= DISPONIBILITÉS MÉDECIN =================

// Récupère toutes les disponibilités du médecin connecté
// GET /api/appointments/availability/
const getDoctorAvailabilities = async () => {
  return await request('/appointments/availability/');
};

// Crée une nouvelle disponibilité
// POST /api/appointments/availability/
const createDoctorAvailability = async (data) => {
  return await request('/appointments/availability/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Modifie une disponibilité (ex: activer/désactiver)
// PATCH /api/appointments/availability/<id>/
const updateDoctorAvailability = async (id, data) => {
  return await request(`/appointments/availability/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Supprime une disponibilité
// DELETE /api/appointments/availability/<id>/
const deleteDoctorAvailability = async (id) => {
  return await request(`/appointments/availability/${id}/`, {
    method: 'DELETE',
  });
};

// Sauvegarde complète du planning (remplace tout)
// POST /api/appointments/availability/bulk-save/
const saveDoctorAvailabilities = async (availabilities) => {
  return await request('/appointments/availability/bulk-save/', {
    method: 'POST',
    body: JSON.stringify({ availabilities }),
  });
};

// ================= PRESCRIPTIONS =================

// Liste des prescriptions du médecin connecté
// GET /api/appointments/prescriptions/
const getPrescriptions = async (filters = {}) => {
  const query = new URLSearchParams(filters).toString();
  return await request(`/appointments/prescriptions/${query ? '?' + query : ''}`);
};

// Créer une prescription
// POST /api/appointments/prescriptions/
const createPrescription = async (data) => {
  return await request('/appointments/prescriptions/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// Modifier une prescription
// PATCH /api/appointments/prescriptions/<id>/
const updatePrescription = async (id, data) => {
  return await request(`/appointments/prescriptions/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

// Supprimer une prescription
// DELETE /api/appointments/prescriptions/<id>/
const deletePrescription = async (id) => {
  return await request(`/appointments/prescriptions/${id}/`, {
    method: 'DELETE',
  });
};

// Liste des patients du médecin (pour le formulaire)
// GET /api/appointments/doctor/patients/
const getDoctorPatients = async () => {
  return await request('/appointments/doctor/patients/');
};

// ================= EXPORT =================

const api = {
  // Auth
  login,
  registerPatient,
  registerHospital,
  registerDoctor,
  getProfile,
  updateProfile,
  logout,
  getAccessToken,
  clearTokens,

  // Appointments
  getAppointments,
  createAppointment,
  cancelAppointment,
  updateAppointmentStatus,

  // Medical Records
  getMedicalHistory,
  createMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
  getAllergies,
  createAllergy,
  updateAllergy,
  deleteAllergy,
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication,
  getMedicalDocuments,
  uploadMedicalDocument,
  deleteMedicalDocument,

  getAdminStats,
  getAdminHospitals,
  updateHospitalStatus,
  getAdminDoctors,
  updateDoctorStatus,

  getHospitalProfile,
  updateHospitalProfile,

  getDoctorProfile,
  updateDoctorProfile,

  getDoctorAppointments,
  getDoctorAppointmentsToday,
  getDoctors,

  getPublicHospitals,
  getPublicHospitalDetail,

  getDoctorAvailabilities,
  createDoctorAvailability,
  updateDoctorAvailability,
  deleteDoctorAvailability,
  saveDoctorAvailabilities,

  getPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getDoctorPatients,
};

export default api;