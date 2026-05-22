/** @jsxImportSource react */
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

// Import des pages publiques
import LandingPage from './pages/public/LandingPage';
import Login from './pages/public/Login';
import HospitalRegistration from './pages/hospital/HospitalRegistration';
import DoctorRegister from './pages/public/DoctorRegister';
import Register from './pages/public/Register';
import NotFound from './pages/public/NotFound';
import Help from './pages/patient/Help';

// Layouts
import PatientLayout from './layouts/PatientLayout';

// Pages patient
import Dashboard from './pages/patient/Dashboard';
import Appointments from './pages/patient/Appointments';
import NewAppointment from './pages/patient/NewAppointment_Enhanced';
import MedicalRecords from './pages/patient/MedicalRecords';
import Documents from './pages/patient/Documents';
import VideoConsultation from './pages/patient/VideoConsultation';
import Messages from './pages/patient/Messages';
import SearchDoctors from './pages/patient/SearchDoctors';
import SearchHospitals from './pages/patient/SearchHospitals';
import HospitalDetail from './pages/patient/HospitalDetail';
import Payment from './pages/patient/Payment';
import Review from './pages/patient/Review';
import NewDocument from './pages/patient/NewDocument';
import Profile from './pages/patient/Profile';

// Layout et pages hôpital
import HospitalLayout from './layouts/HospitalLayout';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import HospitalProfile from './pages/hospital/HospitalProfile';
import HospitalDoctors from './pages/hospital/HospitalDoctors';
import HospitalServices from './pages/hospital/HospitalServices';
import HospitalReviews from './pages/hospital/HospitalReviews';
import HospitalSubscription from './pages/hospital/HospitalSubscription';
import HospitalAppointments from './pages/hospital/HospitalAppointments';
import HospitalMedicalRecords from './pages/hospital/HospitalMedicalRecords';
import HospitalMessaging from './pages/hospital/HospitalMessaging';
import HospitalAvailability from './pages/hospital/HospitalAvailability';
import HospitalStatistics from './pages/hospital/HospitalStatistics';
import HospitalVideoConsultation from './pages/hospital/HospitalVideoConsultation';
import AddDoctor from './pages/hospital/AddDoctor';
import AddService from './pages/hospital/AddService';
import EditService from './pages/hospital/EditService';
import AddAvailability from './pages/hospital/AddAvailability';
import SubscriptionPlans from './pages/hospital/SubscriptionPlans';
import SubscriptionPayment from './pages/hospital/SubscriptionPayment';

// Layout et pages médecin
import DoctorLayout from './layouts/DoctorLayout';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';
import DoctorAvailability from './pages/doctor/DoctorAvailability';
import AgendaDoctor from './pages/doctor/AgendaDoctor';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import ConsultationsDoctor from './pages/doctor/ConsultationsDoctor';
import NouvelleConsultation from './pages/doctor/consultations/NouvelleConsultation';
import ConsultationDetail from './pages/doctor/consultations/ConsultationDetail';
import DossiersDoctor from './pages/doctor/DossiersDoctor';
import VoirDossier from './pages/doctor/dossiers/VoirDossier';
import ComptesRendusDoctor from './pages/doctor/ComptesRendusDoctor';
import NouveauCompteRendu from './pages/doctor/comptes-rendus/NouveauCompteRendu';
import VoirCompteRendu from './pages/doctor/comptes-rendus/VoirCompteRendu';
import ModifierCompteRendu from './pages/doctor/comptes-rendus/ModifierCompteRendu';
import PrescriptionsDoctor from './pages/doctor/PrescriptionsDoctor';
import NouvelleOrdonnance from './pages/doctor/prescriptions/NouvelleOrdonnance';
import ModifierOrdonnance from './pages/doctor/prescriptions/ModifierOrdonnance';
import DoctorMessaging from './pages/doctor/DoctorMessaging';
import DoctorReviews from './pages/doctor/DoctorReviews';
import ConsultationHistory from './pages/doctor/ConsultationHistory';
import CreatePatient from './pages/doctor/CreatePatient';
import DoctorStatistics from './pages/doctor/DoctorStatistics';
import ParametresDoctor from './pages/doctor/ParametresDoctor';

// Layout et pages admin
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import HospitalManagement from './pages/admin/HospitalManagement';
import SubscriptionManagement from './pages/admin/SubscriptionManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import Reports from './pages/admin/Reports';
import BackupManagement from './pages/admin/BackupManagement';
import PrivacyManagement from './pages/admin/PrivacyManagement';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/aide" element={<Help />} />
          <Route path="/inscription-hopital" element={<HospitalRegistration />} /> 
          <Route path="/inscription-medecin" element={<DoctorRegister />} />
          <Route path="*" element={<NotFound />} />

          {/* Routes protégées - Espace patient */}
          {/* <Route path="/patient" element={
            <PrivateRoute allowedRoles={['patient']}>
              <PatientLayout />
            </PrivateRoute>
          }> */}
          <Route path="/patient" element={<PatientLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="rendez-vous" element={<Appointments />} />
            <Route path="rendez-vous/nouveau" element={<NewAppointment />} />
            <Route path="dossiers-medicaux" element={<MedicalRecords />} />
            <Route path="documents" element={<Documents />} />
            <Route path="consultation-video" element={<VideoConsultation />} />
            <Route path="messages" element={<Messages />} />
            <Route path="messages/:conversationId" element={<Messages />} />
            <Route path="recherche-medecins" element={<SearchDoctors />} />
            <Route path="recherche-hopitaux" element={<SearchHospitals />} />
            <Route path="hopital/:hospitalId" element={<HospitalDetail />} />
            <Route path="paiement" element={<Payment />} />
            <Route path="avis" element={<Review />} />
            <Route path="documents/nouveau" element={<NewDocument />} />
            <Route path="profil" element={<Profile />} />
            <Route path="aide" element={<Help />} />
          </Route>

          {/* Routes protégées - Espace hôpital */}
          {/* <Route path="/hopital" element={
            <PrivateRoute allowedRoles={['hospital']}>
              <HospitalLayout />
            </PrivateRoute>
          }> */}
          <Route path="/hopital" element={<HospitalLayout />}>
            <Route index element={<HospitalDashboard />} />
            <Route path="tableau-de-bord" element={<HospitalDashboard />} />
            <Route path="profil" element={<HospitalProfile />} />
            <Route path="medecins" element={<HospitalDoctors />} />
            <Route path="services" element={<HospitalServices />} />
            <Route path="avis" element={<HospitalReviews />} />
            <Route path="abonnement" element={<HospitalSubscription />} />
            <Route path="rendez-vous" element={<HospitalAppointments />} />
            <Route path="dossiers-patients" element={<HospitalMedicalRecords />} />
            <Route path="messagerie" element={<HospitalMessaging />} />
            <Route path="disponibilites" element={<HospitalAvailability />} />
            <Route path="statistiques" element={<HospitalStatistics />} />
            <Route path="consultations-video" element={<HospitalVideoConsultation />} />
            <Route path="ajouter-medecin" element={<AddDoctor />} />
            <Route path="ajouter-service" element={<AddService />} />
            <Route path="modifier-service/:id" element={<EditService />} />
            <Route path="ajouter-disponibilite" element={<AddAvailability />} />
            <Route path="abonnement/plans" element={<SubscriptionPlans />} />
            <Route path="abonnement/paiement" element={<SubscriptionPayment />} />
          </Route>

          {/* Routes protégées - Espace médecin */}
          {/* <Route path="/medecin" element={
            <PrivateRoute allowedRoles={['doctor']}>
              <DoctorLayout />
            </PrivateRoute>
          }> */}
          <Route path="/medecin" element={<DoctorLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="disponibilites" element={<DoctorAvailability />} />
            <Route path="tableau-de-bord" element={<DoctorDashboard />} />
            <Route path="profil" element={<DoctorProfile />} />
            <Route path="disponibilites" element={<DoctorAvailability />} />
            <Route path="agenda" element={<AgendaDoctor />} />
            <Route path="rendez-vous" element={<DoctorAppointments />} />
            <Route path="consultations" element={<ConsultationsDoctor />} />
            <Route path="consultations/nouvelle" element={<NouvelleConsultation />} />
            <Route path="consultations/:id" element={<ConsultationDetail />} />
            <Route path="dossiers" element={<DossiersDoctor />} />
            <Route path="dossiers/:id" element={<VoirDossier />} />
            <Route path="comptes-rendus" element={<ComptesRendusDoctor />} />
            <Route path="comptes-rendus/nouveau" element={<NouveauCompteRendu />} />
            <Route path="comptes-rendus/:id" element={<VoirCompteRendu />} />
            <Route path="comptes-rendus/modifier/:id" element={<ModifierCompteRendu />} />
            <Route path="prescriptions" element={<PrescriptionsDoctor />} />
            <Route path="prescriptions/nouvelle" element={<NouvelleOrdonnance />} />
            <Route path="prescriptions/modifier/:id" element={<ModifierOrdonnance />} />
            <Route path="messagerie" element={<DoctorMessaging />} />
            <Route path="avis" element={<DoctorReviews />} />
            <Route path="historique" element={<ConsultationHistory />} />
            <Route path="creer-patient" element={<CreatePatient />} />
            <Route path="statistiques" element={<DoctorStatistics />} />
            <Route path="parametres" element={<ParametresDoctor />} />
          </Route>

          {/* Routes protégées - Espace admin */}
          {/* <Route path="/admin" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminLayout />
            </PrivateRoute>
          }> */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="tableau-de-bord" element={<AdminDashboard />} />
            <Route path="hopitaux" element={<HospitalManagement />} />
            <Route path="abonnements" element={<SubscriptionManagement />} />
            <Route path="paiements" element={<PaymentManagement />} />
            <Route path="rapports" element={<Reports />} />
            <Route path="sauvegardes" element={<BackupManagement />} />
            <Route path="confidentialite" element={<PrivacyManagement />} />
            <Route path="parametres" element={<Settings />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
