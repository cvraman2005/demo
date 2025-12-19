import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { providerService } from '../../services/api';
import { Users, Calendar, ArrowRight, Loader, BarChart3 } from 'lucide-react';
import './DoctorDashboard.css';

function DoctorDashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [patientsRes, availabilityRes] = await Promise.all([
        providerService.getPatients(),
        providerService.getAvailability()
      ]);

      setPatients(patientsRes.data || []);
      setAvailability(availabilityRes.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const getDayName = (dayNum) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-[#0066cc]" />
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-container">
      {/* Header */}
      <div className="doctor-dashboard-header">
        <h1 className="doctor-dashboard-title">Dr. {user?.name}'s Dashboard</h1>
        <p className="doctor-dashboard-subtitle">Manage your patients and availability</p>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {/* Grid Layout */}
      <div className="doctor-dashboard-grid">
        {/* Quick Actions */}
        <div className="doctor-card">
          <div className="doctor-card-header">
            <h2 className="doctor-card-title">
              <Calendar />
              Quick Actions
            </h2>
          </div>
          <div className="doctor-card-content">
            <div className="action-buttons">
              <Link to="/doctor/patients" className="action-button">
                <span>View All Patients</span>
                <ArrowRight />
              </Link>
              <Link to="/doctor/availability" className="action-button">
                <span>Manage Availability</span>
                <ArrowRight />
              </Link>
            </div>
          </div>
        </div>

        {/* Patients Summary */}
        <div className="doctor-card">
          <div className="doctor-card-header">
            <h2 className="doctor-card-title">
              <Users />
              My Patients
            </h2>
          </div>
          <div className="doctor-card-content">
            {patients.length === 0 ? (
              <p className="no-data-text">No patients assigned yet</p>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{patients.length}</div>
                    <div className="stat-label">Total Patients</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {patients.reduce((sum, p) => sum + (p.goalCount || 0), 0)}
                    </div>
                    <div className="stat-label">Total Goals</div>
                  </div>
                </div>
                <Link to="/doctor/patients" className="view-all-button">
                  View all patients <ArrowRight />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Availability Summary */}
        <div className="doctor-card">
          <div className="doctor-card-header">
            <h2 className="doctor-card-title">
              <BarChart3 />
              Your Availability
            </h2>
          </div>
          <div className="doctor-card-content">
            {availability.length === 0 ? (
              <div className="set-availability-container">
                <p className="no-data-text">No availability set</p>
                <Link to="/doctor/availability" className="primary-button">
                  Set Availability
                </Link>
              </div>
            ) : (
              <>
                <div className="availability-list">
                  {availability.map((slot, index) => (
                    <div key={index} className="availability-slot">
                      <div>
                        <p className="availability-day">{getDayName(slot.dayOfWeek)}</p>
                        <p className="availability-time">{slot.startTime} - {slot.endTime}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/doctor/availability" className="view-all-button">
                  Manage availability <ArrowRight />
                </Link>
              </>
            )}
          </div>
        </div>
  
      </div>
    </div>
  );
}

export default DoctorDashboard;
