import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Layout from './components/Shared/Layout';
import ProtectedRoute from './components/Shared/ProtectedRoute';

// Public pages
import Home from './components/Public/Home';

// Auth pages
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Patient pages
import PatientDashboard from './components/Patient/PatientDashboard';
import GoalTracker from './components/Patient/GoalTracker';
import BookAppointment from './components/Patient/BookAppointment';
import Profile from './components/Patient/Profile';

// Doctor pages
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import PatientList from './components/Doctor/PatientList';
import ManageAvailability from './components/Doctor/ManageAvailability';

import './App.css';

function AppRoutes() {
  const { isAuthenticated, isPatient, isDoctor } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      
      {/* Auth Routes - redirect to dashboard if already logged in */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            isPatient ? <Navigate to="/patient/dashboard" replace /> :
            isDoctor ? <Navigate to="/doctor/dashboard" replace /> :
            <Navigate to="/" replace />
          ) : (
            <Login />
          )
        } 
      />
      <Route 
        path="/register" 
        element={
          isAuthenticated ? (
            isPatient ? <Navigate to="/patient/dashboard" replace /> :
            isDoctor ? <Navigate to="/doctor/dashboard" replace /> :
            <Navigate to="/" replace />
          ) : (
            <Register />
          )
        } 
      />

      {/* Patient Routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute requiredRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/goals"
        element={
          <ProtectedRoute requiredRole="patient">
            <GoalTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/book-appointment"
        element={
          <ProtectedRoute requiredRole="patient">
            <BookAppointment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute requiredRole="patient">
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Doctor Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute requiredRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <ProtectedRoute requiredRole="doctor">
            <PatientList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/availability"
        element={
          <ProtectedRoute requiredRole="doctor">
            <ManageAvailability />
          </ProtectedRoute>
        }
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
