import React, { useState, useEffect } from 'react';
import { providerService } from '../../services/api';
import './Doctor.css';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientGoals, setPatientGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    type: 'Exercise',
    title: '',
    targetValue: '',
    unit: 'minutes'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await providerService.getPatients();
      setPatients(response.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load patients');
      setLoading(false);
    }
  };

  const fetchPatientGoals = async (patientId) => {
    try {
      const response = await providerService.getPatientGoals(patientId);
      setPatientGoals(response.data || []);
    } catch (err) {
      setError('Failed to load patient goals');
    }
  };

  const handlePatientSelect = async (patient) => {
    setSelectedPatient(patient);
    setShowGoalForm(false);
    setSuccess('');
    setError('');
    fetchPatientGoals(patient._id);
  };

  const handleGoalChange = (e) => {
    setNewGoal({
      ...newGoal,
      [e.target.name]: e.target.value
    });
  };

  const handleSetGoal = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await providerService.setPatientGoal(selectedPatient._id, {
        ...newGoal,
        targetValue: parseFloat(newGoal.targetValue)
      });

      setSuccess('Goal set successfully!');
      setShowGoalForm(false);
      setNewGoal({
        type: 'Exercise',
        title: '',
        targetValue: '',
        unit: 'minutes'
      });
      fetchPatientGoals(selectedPatient._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set goal');
    }
  };

  if (loading) {
    return <div className="loading">Loading patients...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Patients</h1>
        <p>View and manage patient wellness goals</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {patients.length === 0 ? (
        <div className="empty-state-card">
          <h3>No Patients Yet</h3>
          <p>Patients who book appointments with you will appear here.</p>
        </div>
      ) : (
        <div className="patients-layout">
          {/* Patients List */}
          <div className="patients-list-panel">
            <h2>Patients ({patients.length})</h2>
            {patients.map(patient => (
              <div
                key={patient._id}
                className={`patient-card ${selectedPatient?._id === patient._id ? 'active' : ''}`}
                onClick={() => handlePatientSelect(patient)}
              >
                <h3>{patient.name}</h3>
                <p className="patient-email">{patient.email}</p>
                {patient.goalCount !== undefined && (
                  <span className="goal-count">{patient.goalCount} goals</span>
                )}
              </div>
            ))}
          </div>

          {/* Patient Details */}
          <div className="patient-details-panel">
            {selectedPatient ? (
              <>
                <div className="patient-detail-header">
                  <h2>{selectedPatient.name}</h2>
                  <button
                    className="btn-primary"
                    onClick={() => setShowGoalForm(!showGoalForm)}
                  >
                    {showGoalForm ? 'Cancel' : '+ Set New Goal'}
                  </button>
                </div>

                <div className="patient-info-section">
                  <h3>Patient Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <strong>Email:</strong> {selectedPatient.email}
                    </div>
                    {selectedPatient.allergies && (
                      <div className="info-item">
                        <strong>Allergies:</strong> {selectedPatient.allergies}
                      </div>
                    )}
                    {selectedPatient.medications && (
                      <div className="info-item">
                        <strong>Medications:</strong> {selectedPatient.medications}
                      </div>
                    )}
                  </div>
                </div>

                {/* Set Goal Form */}
                {showGoalForm && (
                  <div className="goal-form-section">
                    <h3>Set New Wellness Goal</h3>
                    <form onSubmit={handleSetGoal}>
                      <div className="form-group">
                        <label htmlFor="type">Goal Type</label>
                        <select
                          id="type"
                          name="type"
                          value={newGoal.type}
                          onChange={handleGoalChange}
                          required
                        >
                          <option value="Exercise">Exercise</option>
                          <option value="Nutrition">Nutrition</option>
                          <option value="Sleep">Sleep</option>
                          <option value="Hydration">Hydration</option>
                          <option value="Medication">Medication</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="title">Goal Title</label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={newGoal.title}
                          onChange={handleGoalChange}
                          placeholder="e.g., Daily Walking Exercise"
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="targetValue">Target Value</label>
                          <input
                            type="number"
                            id="targetValue"
                            name="targetValue"
                            value={newGoal.targetValue}
                            onChange={handleGoalChange}
                            placeholder="e.g., 30"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="unit">Unit</label>
                          <select
                            id="unit"
                            name="unit"
                            value={newGoal.unit}
                            onChange={handleGoalChange}
                            required
                          >
                            <option value="minutes">minutes</option>
                            <option value="hours">hours</option>
                            <option value="steps">steps</option>
                            <option value="glasses">glasses</option>
                            <option value="servings">servings</option>
                            <option value="calories">calories</option>
                            <option value="mg">mg</option>
                            <option value="times">times</option>
                          </select>
                        </div>
                      </div>

                      <button type="submit" className="btn-primary">
                        Set Goal
                      </button>
                    </form>
                  </div>
                )}

                {/* Patient Goals */}
                <div className="patient-goals-section">
                  <h3>Wellness Goals</h3>
                  {patientGoals.length === 0 ? (
                    <p className="empty-state">No goals set for this patient yet</p>
                  ) : (
                    <div className="goals-list">
                      {patientGoals.map(goal => (
                        <div key={goal._id} className="goal-card-detail">
                          <div className="goal-header">
                            <h4>{goal.title}</h4>
                            <span className={`status-badge ${goal.status}`}>{goal.status}</span>
                          </div>
                          <div className="goal-body">
                            <p><strong>Type:</strong> {goal.type}</p>
                            <p><strong>Target:</strong> {goal.targetValue} {goal.unit}</p>
                            <p className="goal-date">
                              Set on {new Date(goal.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="empty-selection">
                <p>Select a patient from the list to view details and manage goals</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientList;
