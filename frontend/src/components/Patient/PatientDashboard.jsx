import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/api';
import { Calendar, Target, Footprints, Activity, Moon, Droplets, Bell, Lightbulb, Loader, Plus, X } from 'lucide-react';
import './PatientDashboard.css';

function PatientDashboard() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [goalLogs, setGoalLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [logValue, setLogValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [goalsRes, appointmentsRes] = await Promise.all([
        patientService.getGoals(),
        patientService.getAppointments()
      ]);

      const goalsData = goalsRes.data || [];
      setGoals(goalsData);
      setAppointments(appointmentsRes.data || []);

      // Fetch today's logs for each goal
      const logsPromises = goalsData.map(goal => 
        patientService.getGoalLogs(goal._id)
          .then(res => ({ goalId: goal._id, logs: res.data }))
          .catch(() => ({ goalId: goal._id, logs: [] }))
      );
      
      const logsResults = await Promise.all(logsPromises);
      const logsMap = {};
      logsResults.forEach(({ goalId, logs }) => {
        // Get today's log
        const today = new Date().toDateString();
        const todayLog = logs.find(log => new Date(log.date).toDateString() === today);
        logsMap[goalId] = todayLog?.value || 0;
      });
      
      setGoalLogs(logsMap);
      setLoading(false);
    } catch (err) {
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const getGoalIcon = (type) => {
    const icons = {
      'steps': Footprints,
      'water': Droplets,
      'sleep': Moon,
      'exercise': Activity
    };
    return icons[type] || Target;
  };

  const getGoalByType = (type) => {
    return goals.find(g => g.type === type);
  };

  const getTodayProgress = (goalId) => {
    return goalLogs[goalId] || 0;
  };

  const getProgressPercentage = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const openLogModal = (goal) => {
    setSelectedGoal(goal);
    setLogValue(getTodayProgress(goal._id).toString());
    setShowLogModal(true);
    setError('');
    setSuccess('');
  };

  const closeLogModal = () => {
    setShowLogModal(false);
    setSelectedGoal(null);
    setLogValue('');
  };

  const handleLogProgress = async (e) => {
    e.preventDefault();
    if (!selectedGoal || !logValue) return;

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await patientService.logGoalProgress(selectedGoal._id, { value: parseFloat(logValue) });
      setSuccess('Progress logged successfully!');
      
      // Update local state
      setGoalLogs(prev => ({
        ...prev,
        [selectedGoal._id]: parseFloat(logValue)
      }));

      setTimeout(() => {
        closeLogModal();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log progress');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {user?.name}</h1>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      {/* Wellness Goals Section */}
      <div className="wellness-section">
        <h2 className="wellness-title">Wellness Goals</h2>
        
        {goals.length === 0 ? (
          <p className="no-data">No wellness goals set yet. Your doctor will create goals for you.</p>
        ) : (
          <div className="wellness-grid">
            {goals.map(goal => {
              const IconComponent = getGoalIcon(goal.type);
              const currentValue = getTodayProgress(goal._id);
              const progress = getProgressPercentage(currentValue, goal.target);
              
              return (
                <div key={goal._id} className="wellness-card" onClick={() => openLogModal(goal)}>
                  <div className="card-header">
                    <div className="card-icon-label">
                      <IconComponent className="card-icon" />
                      <span className="card-label">{goal.title}</span>
                    </div>
                    <button className="log-button" title="Log progress">
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="card-value-container">
                    <div className="card-value-large">{currentValue}</div>
                    <div className="card-target">{goal.target} {goal.unit}</div>
                  </div>
                  <div className="progress-container">
                    <div className="progress-text">
                      <span className="progress-percentage">{progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div 
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Additional Sections */}
      <div className="additional-sections">
        {/* Preventive Care Reminders */}
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">
              <Bell />
              Preventive Care Reminders
            </h3>
          </div>
          <div className="section-card-content">
            {appointments.filter(a => a.status === 'scheduled').length === 0 ? (
              <p className="no-data">No upcoming appointments</p>
            ) : (
              <div>
                {appointments.filter(a => a.status === 'scheduled').slice(0, 2).map(appointment => (
                  <div key={appointment._id} className="appointment-item">
                    <Calendar className="appointment-icon" />
                    <div className="appointment-details">
                      <p className="appointment-doctor">Dr. {appointment.doctorId?.name || 'Dr. Patel'}</p>
                      <p className="appointment-time">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Health Tip of the Day */}
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">
              <Lightbulb />
              Health Tip of the Day
            </h3>
          </div>
          <div className="section-card-content">
            <p className="health-tip">
              Stay hydrated throughout the day. Drinking adequate water helps maintain energy levels, supports digestion, and keeps your skin healthy.
            </p>
          </div>
        </div>
      </div>

      {/* Log Progress Modal */}
      {showLogModal && selectedGoal && (
        <div className="modal-overlay" onClick={closeLogModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Log {selectedGoal.title}</h3>
              <button className="modal-close" onClick={closeLogModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleLogProgress}>
              <div className="modal-body">
                {error && <div className="alert-error">{error}</div>}
                {success && <div className="alert-success">{success}</div>}
                
                <div className="form-group">
                  <label className="form-label">
                    Today's Progress ({selectedGoal.unit})
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={logValue}
                    onChange={(e) => setLogValue(e.target.value)}
                    min="0"
                    step={selectedGoal.type === 'water' ? '1' : '0.1'}
                    required
                    disabled={submitting}
                    placeholder={`Enter ${selectedGoal.type} value`}
                  />
                  <p className="form-help">
                    Goal: {selectedGoal.target} {selectedGoal.unit}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="button-secondary" 
                  onClick={closeLogModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="button-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Logging...' : 'Log Progress'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;