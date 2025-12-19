import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard if wrong role
    if (user.role === 'patient') {
      return <Navigate to="/patient/dashboard" replace />;
    } else if (user.role === 'doctor') {
      return <Navigate to="/doctor/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
