import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('visitor');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fonction de connexion simulée
  const login = async (email, password) => {
    // Simulation de connexion réussie
    const mockUser = {
      uid: 'mock-user-id',
      email,
      displayName: email.split('@')[0],
      role: 'user',
      emailVerified: true
    };
    
    setCurrentUser(mockUser);
    setUserRole('user');
    return { success: true };
  };

  // Fonction d'inscription simulée
  const signup = async (email, password, userData) => {
    // Simulation d'inscription réussie
    const mockUser = {
      uid: `mock-user-${Date.now()}`,
      email,
      displayName: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || email.split('@')[0],
      role: 'user',
      emailVerified: false,
      ...userData
    };
    
    setCurrentUser(mockUser);
    setUserRole('user');
    return { success: true };
  };

  // Fonction de déconnexion
  const logout = async () => {
    setCurrentUser(null);
    setUserRole('visitor');
    return { success: true };
  };

  // Réinitialiser le mot de passe
  const resetPassword = async (email) => {
    console.log(`Réinitialisation du mot de passe demandée pour: ${email}`);
    return { success: true };
  };

  // Mettre à jour le profil utilisateur
  const updateProfile = async (updates) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
      return { success: true };
    }
    return { success: false, error: 'Aucun utilisateur connecté' };
  };

  // Mettre à jour l'email
  const updateEmail = async (email) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, email });
      return { success: true };
    }
    return { success: false, error: 'Aucun utilisateur connecté' };
  };

  // Mettre à jour le mot de passe
  const updatePassword = async (password) => {
    if (currentUser) {
      // Dans une vraie application, vous enverriez une requête pour mettre à jour le mot de passe
      console.log('Mot de passe mis à jour avec succès');
      return { success: true };
    }
    return { success: false, error: 'Aucun utilisateur connecté' };
  };

  // Valeur du contexte
  const value = {
    currentUser,
    userRole,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
