import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Shared.css';

function Sidebar() {
  const { user, logout, isPatient, isDoctor } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!user) {
    return null;
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">🏥 Portal</div>
        <div className="sidebar-user-info">
          <p className="sidebar-user-name">{user.name}</p>
          <p className="sidebar-user-role">{isPatient ? 'Patient' : 'Doctor'}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {isPatient && (
          <>
            <Link
              to="/patient/dashboard"
              className={`sidebar-link ${isActive('/patient/dashboard') ? 'active' : ''}`}
            >
              <span className="sidebar-icon">📊</span>
              Dashboard
            </Link>
            <Link
              to="/patient/goals"
              className={`sidebar-link ${isActive('/patient/goals') ? 'active' : ''}`}
            >
              <span className="sidebar-icon">🎯</span>
              My Goals
            </Link>
            <Link
              to="/patient/book-appointment"
              className={`sidebar-link ${isActive('/patient/book-appointment') ? 'active' : ''}`}
            >
              <span className="sidebar-icon">📅</span>
              Book Appointment
            </Link>
            <Link
              to="/patient/profile"
              className={`sidebar-link ${isActive('/patient/profile') ? 'active' : ''}`}
            >
              <span className="sidebar-icon">👤</span>
              Profile
            </Link>
          </>
        )}

        {isDoctor && (
          <>
            <Link
              to="/doctor/dashboard"
              className={`sidebar-link ${isActive('/doctor/dashboard') ? 'active' : ''}`}
            >
              <span className="sidebar-icon">📊</span>
              Dashboard
            </Link>
            <Link
              to="/doctor/patients"
              className={`sidebar-link ${isActive('/doctor/patients') ? 'active' : ''}`}
            >
              <span className="sidebar-icon">👥</span>
              Patients
            </Link>
            <Link
              to="/doctor/availability"
              className={`sidebar-link ${isActive('/doctor/availability') ? 'active' : ''}`}
            >
              <span className="sidebar-icon">📅</span>
              Availability
            </Link>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="sidebar-logout">
          <span className="sidebar-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
