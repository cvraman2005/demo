import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Shared.css';

function Navigation() {
  const { user } = useAuth();

  // Only show navbar for non-authenticated users (login/register/home)
  if (user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🏥 Healthcare Portal
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-link nav-link-highlight">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
