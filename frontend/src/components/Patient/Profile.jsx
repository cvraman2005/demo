import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/api';
import './Patient.css';

function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    allergies: '',
    medications: ''
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await patientService.getProfile();
      setProfile({
        name: response.data.name || '',
        email: response.data.email || '',
        allergies: response.data.allergies || '',
        medications: response.data.medications || ''
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await patientService.updateProfile({
        name: profile.name,
        allergies: profile.allergies,
        medications: profile.medications
      });
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
      setSaving(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>View and manage your health information</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              disabled={!editing}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              disabled
              className="disabled-input"
            />
            <small>Email cannot be changed</small>
          </div>

          <div className="form-group">
            <label htmlFor="allergies">Allergies</label>
            <textarea
              id="allergies"
              name="allergies"
              value={profile.allergies}
              onChange={handleChange}
              disabled={!editing}
              placeholder="List any allergies"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="medications">Current Medications</label>
            <textarea
              id="medications"
              name="medications"
              value={profile.medications}
              onChange={handleChange}
              disabled={!editing}
              placeholder="List current medications"
              rows="3"
            />
          </div>

          <div className="button-group">
            {!editing ? (
              <button 
                type="button" 
                className="btn-primary"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setEditing(false);
                    fetchProfile();
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
