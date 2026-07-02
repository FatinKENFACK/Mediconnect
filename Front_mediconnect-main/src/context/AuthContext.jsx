import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole]       = useState('visitor');
  const [loading, setLoading]         = useState(true);
  const navigate = useNavigate();

  // ============================================================
  // AU CHARGEMENT DE L'APP : restaurer la session depuis localStorage
  // ============================================================
  useEffect(() => {
    const restoreSession = async () => {
      const token = api.getAccessToken();
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          setUserRole(user.role || 'visitor');

          // Revalider le profil depuis le backend (token toujours valide ?)
          try {
            const freshProfile = await api.getProfile();
            setCurrentUser(freshProfile);
            localStorage.setItem('user', JSON.stringify(freshProfile));
            setUserRole(freshProfile.role || 'visitor');
          } catch {
            api.clearTokens();
            setCurrentUser(null);
            setUserRole('visitor');
          }
        } catch {
          api.clearTokens();
        }
      }

      setLoading(false);
    };

    restoreSession();
  }, []);

  // ============================================================
  // REDIRECTION SELON LE RÔLE
  // ============================================================
  const redirectByRole = (role) => {
    const routes = {
      patient:  '/patient',
      doctor:   '/medecin',
      hospital: '/hopital',
      admin:    '/admin',
    };
    navigate(routes[role] || '/');
  };

  // ============================================================
  // LOGIN — utilisé par Login.jsx : login(email, password)
  // ============================================================
  const login = async (email, password) => {
    const data = await api.login(email, password);
    setCurrentUser(data.user);
    setUserRole(data.user.role || 'visitor');
    redirectByRole(data.user.role);
    return { success: true, user: data.user };
  };

  // ============================================================
  // SIGNUP PATIENT — utilisé par Register.jsx :
  // signup(email, password, userData)
  // userData contient déjà firstName, lastName, phone, etc.
  // ============================================================
  const signup = async (email, password, userData) => {
    const payload = {
      ...userData,
      email,
      password,
      confirmPassword: password, // Register.jsx valide déjà la confirmation lui-même
    };

    const data = await api.registerPatient(payload);
    setCurrentUser(data.user);
    setUserRole(data.user.role || 'visitor');
    redirectByRole(data.user.role);
    return { success: true, user: data.user };
  };

  // ============================================================
  // SIGNUP MÉDECIN — utilisé par DoctorRegister.jsx :
  // signupDoctor(formData)
  // ============================================================
  const signupDoctor = async (formData) => {
    const data = await api.registerDoctor(formData);
    setCurrentUser(data.user);
    setUserRole(data.user.role || 'visitor');
    redirectByRole(data.user.role);
    return { success: true, user: data.user };
  };

  // ============================================================
  // SIGNUP HÔPITAL — utilisé par HospitalRegistration.jsx :
  // signupHospital(formData)
  // ============================================================
  const signupHospital = async (formData) => {
    const data = await api.registerHospital(formData);

    // Si l'hôpital est en attente de validation admin (pas de tokens renvoyés)
    if (data.pending) {
      return { success: true, pending: true };
    }

    setCurrentUser(data.user);
    setUserRole(data.user.role || 'visitor');
    redirectByRole(data.user.role);
    return { success: true, user: data.user };
  };

  // ============================================================
  // LOGOUT
  // ============================================================
  const logout = async () => {
    api.logout();
    setCurrentUser(null);
    setUserRole('visitor');
    navigate('/connexion');
    return { success: true };
  };

  // ============================================================
  // MISE À JOUR PROFIL LOCAL (après modification réussie)
  // ============================================================
  const updateCurrentUser = (updatedFields) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  // ============================================================
  // VALEUR DU CONTEXTE
  // ============================================================
  const value = {
    currentUser,
    userRole,
    loading,
    isAuthenticated: !!currentUser,
    login,
    signup,
    signupDoctor,
    signupHospital,
    logout,
    updateCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;