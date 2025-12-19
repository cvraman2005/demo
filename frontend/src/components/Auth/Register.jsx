import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    consentGiven: false,
    allergies: '',
    medications: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.role === 'patient' && !formData.consentGiven) {
      setError('You must consent to data collection to register as a patient');
      return;
    }

    setLoading(true);

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      consentGiven: formData.consentGiven
    };

    if (formData.role === 'patient') {
      userData.allergies = formData.allergies;
      userData.medications = formData.medications;
    }

    const result = await register(userData);
    
    if (result.success) {
      if (formData.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (formData.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <p className="auth-subtitle">Create your Healthcare Wellness Portal account</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="At least 6 characters"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">I am a:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor/Provider</option>
            </select>
          </div>

          {formData.role === 'patient' && (
            <>
              <div className="form-group">
                <label htmlFor="allergies">Allergies (optional)</label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="List any allergies"
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="medications">Current Medications (optional)</label>
                <textarea
                  id="medications"
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  placeholder="List current medications"
                  rows="2"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="consentGiven"
                    checked={formData.consentGiven}
                    onChange={handleChange}
                  />
                  <span>
                    I consent to the collection and use of my health data for wellness tracking and 
                    appointment management purposes. I understand my data will be handled in compliance 
                    with HIPAA regulations.
                  </span>
                </label>
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
