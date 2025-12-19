import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    role: 'patient',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, isPatient, isDoctor } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Navigate based on role
      if (isPatient) {
        navigate('/patient/dashboard');
      } else if (isDoctor) {
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
        <h2>Login</h2>
        <p className="auth-subtitle">Welcome back to Healthcare Wellness Portal</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group role-toggle-group">
            <label>Role</label>
            <div className="role-toggle">
              <button
                type="button"
                className={`toggle-btn ${formData.role === 'patient' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'patient' })}
              >
                Patient
              </button>
              <button
                type="button"
                className={`toggle-btn ${formData.role === 'doctor' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'doctor' })}
              >
                Doctor
              </button>
            </div>
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
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
