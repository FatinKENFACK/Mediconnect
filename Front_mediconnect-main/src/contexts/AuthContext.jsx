import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restaure la session au chargement
  useEffect(() => {
    const restoreSession = async () => {
      const token = api.getAccessToken();
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const freshUser = await api.getProfile();
          // getProfile retourne directement l'objet user
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
        } catch {
          // Token expiré — on restaure depuis localStorage sans appel API
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            api.clearTokens();
            setUser(null);
          }
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  // Connexion — redirige selon le rôle
  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
    redirectByRole(data.user.role);
  };

  // Inscription patient
  const signup = async (email, password, formData) => {
    const data = await api.registerPatient({
      ...formData,
      password,
      confirmPassword: formData.confirmPassword || password,
    });
    setUser(data.user);
    navigate('/patient/dashboard');
    return { success: true };
  };

  // Inscription hôpital
  const signupHospital = async (formData) => {
    const data = await api.registerHospital(formData);
    // Pas de redirection — compte en attente de validation
    return data;
  };
  // Inscription médecin
  const signupDoctor = async (formData) => {
    const data = await api.registerDoctor(formData);
    setUser(data.user);
    navigate('/medecin/tableau-de-bord');
    return { success: true };
  };

  // Déconnexion
  const logout = () => {
    api.logout();
    setUser(null);
    navigate('/connexion');
  };

  // Redirection selon le rôle
  const redirectByRole = (role) => {
    switch (role) {
      case 'patient':
        navigate('/patient/dashboard');
        break;
      case 'doctor':
        navigate('/medecin/tableau-de-bord');
        break;
      case 'hospital':
        navigate('/hopital/tableau-de-bord');
        break;
      case 'admin':
        navigate('/admin/tableau-de-bord');
        break;
      default:
        navigate('/');
    }
  };

  const isAuthenticated = !!user;
  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';
  const isHospital = user?.role === 'hospital';
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    loading,
    login,
    signup,
    signupHospital,
    signupDoctor,
    logout,
    isAuthenticated,
    isPatient,
    isDoctor,
    isHospital,
    isAdmin,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};

export default AuthContext;