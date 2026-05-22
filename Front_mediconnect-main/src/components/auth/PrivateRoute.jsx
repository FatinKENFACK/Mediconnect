import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { currentUser, hasRole } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Rediriger vers la page de connexion avec l'URL de redirection
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  // Vérifier si l'utilisateur a le rôle requis
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      // Rediriger vers le dashboard approprié selon le rôle actuel
      switch (currentUser.role) {
        case 'admin':
          return <Navigate to="/admin/tableau-de-bord" replace />;
        case 'doctor':
          return <Navigate to="/medecin/tableau-de-bord" replace />;
        case 'hospital':
          return <Navigate to="/hopital/tableau-de-bord" replace />;
        case 'patient':
        default:
          return <Navigate to="/patient/tableau-de-bord" replace />;
      }
    }
  }

  return children;
};

export default PrivateRoute;
