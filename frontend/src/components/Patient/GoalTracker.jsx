import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/api';
import './Patient.css';

function GoalTracker() {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logValue, setLogValue] = useState('');
  const [logNote, setLogNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await patientService.getGoals();
      setGoals(response.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load goals');
      setLoading(false);
    }
  };

  const fetchGoalLogs = async (goalId) => {
    try {
      const response = await patientService.getGoalLogs(goalId);
      setLogs(response.data || []);
    } catch (err) {
      setError('Failed to load goal logs');
    }
  };

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setLogValue('');
    setLogNote('');
    setSuccess('');
    setError('');
    fetchGoalLogs(goal._id);
  };

  const handleLogProgress = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await patientService.logGoalProgress(selectedGoal._id, {
        value: parseFloat(logValue),
        note: logNote
      });
      
      setSuccess('Progress logged successfully!');
      setLogValue('');
      setLogNote('');
      fetchGoalLogs(selectedGoal._id);
      fetchGoals(); // Refresh goals to update status
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log progress');
    }
  };

  if (loading) {
    return <div className="loading">Loading goals...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Wellness Goals Tracker</h1>
        <p>Track your daily progress towards wellness goals</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {goals.length === 0 ? (
        <div className="empty-state-card">
          <h3>No Goals Yet</h3>
          <p>Your healthcare provider hasn't set any wellness goals for you yet.</p>
        </div>
      ) : (
        <div className="goals-tracker-layout">
          {/* Goals List */}
          <div className="goals-list-panel">
            <h2>Your Goals</h2>
            {goals.map(goal => (
              <div
                key={goal._id}
                className={`goal-card ${selectedGoal?._id === goal._id ? 'active' : ''}`}
                onClick={() => handleGoalSelect(goal)}
              >
                <h3>{goal.title}</h3>
                <p className="goal-type">{goal.type}</p>
                <p className="goal-target">Target: {goal.targetValue} {goal.unit}</p>
                <span className={`status-badge ${goal.status}`}>{goal.status}</span>
              </div>
            ))}
          </div>

          {/* Goal Details and Log Entry */}
          <div className="goal-details-panel">
            {selectedGoal ? (
              <>
                <div className="goal-detail-header">
                  <h2>{selectedGoal.title}</h2>
                  <span className={`status-badge ${selectedGoal.status}`}>{selectedGoal.status}</span>
                </div>
                
                <div className="goal-detail-info">
                  <p><strong>Type:</strong> {selectedGoal.type}</p>
                  <p><strong>Target:</strong> {selectedGoal.targetValue} {selectedGoal.unit}</p>
                </div>

                {/* Log Progress Form */}
                <div className="log-progress-section">
                  <h3>Log Today's Progress</h3>
                  <form onSubmit={handleLogProgress}>
                    <div className="form-group">
                      <label>Value ({selectedGoal.unit})</label>
                      <input
                        type="number"
                        step="0.01"
                        value={logValue}
                        onChange={(e) => setLogValue(e.target.value)}
                        required
                        placeholder={`Enter value in ${selectedGoal.unit}`}
                      />
                    </div>

                    <div className="form-group">
                      <label>Notes (optional)</label>
                      <textarea
                        value={logNote}
                        onChange={(e) => setLogNote(e.target.value)}
                        placeholder="Add any notes about your progress"
                        rows="3"
                      />
                    </div>

                    <button type="submit" className="btn-primary">Log Progress</button>
                  </form>
                </div>

                {/* Progress History */}
                <div className="progress-history">
                  <h3>Progress History</h3>
                  {logs.length === 0 ? (
                    <p className="empty-state">No progress logged yet</p>
                  ) : (
                    <div className="logs-list">
                      {logs.map(log => (
                        <div key={log._id} className="log-entry">
                          <div className="log-header">
                            <strong>{log.value} {selectedGoal.unit}</strong>
                            <span className="log-date">
                              {new Date(log.date).toLocaleDateString()}
                            </span>
                          </div>
                          {log.note && <p className="log-note">{log.note}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="empty-selection">
                <p>Select a goal from the list to track your progress</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GoalTracker;
