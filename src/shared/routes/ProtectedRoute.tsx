import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'client';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, user } = useAuth();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (requiredRole && user?.role !== requiredRole) {
    // Redirigir según el rol del usuario
    const userRedirect = user?.role === 'admin' ? '/admin' : '/catalog';
    return <Navigate to={userRedirect} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;