import React, { useState, useEffect } from 'react';
import { providerService } from '../../services/api';
import './Doctor.css';

function ManageAvailability() {
  const [availability, setAvailability] = useState([]);
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: '1',
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const response = await providerService.getAvailability();
      setAvailability(response.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load availability');
      setLoading(false);
    }
  };

  const getDayName = (dayNum) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum];
  };

  const handleAddSlot = () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      setError('Please enter both start and end times');
      return;
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newSlot.startTime) || !timeRegex.test(newSlot.endTime)) {
      setError('Please use HH:MM format (e.g., 09:00)');
      return;
    }

    // Check if start time is before end time
    const [startHour, startMin] = newSlot.startTime.split(':').map(Number);
    const [endHour, endMin] = newSlot.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (startMinutes >= endMinutes) {
      setError('Start time must be before end time');
      return;
    }

    const isDuplicate = availability.some(
      slot => slot.dayOfWeek === parseInt(newSlot.dayOfWeek) && 
               slot.startTime === newSlot.startTime && 
               slot.endTime === newSlot.endTime
    );

    if (isDuplicate) {
      setError('This time slot already exists');
      return;
    }

    setAvailability([
      ...availability,
      {
        dayOfWeek: parseInt(newSlot.dayOfWeek),
        startTime: newSlot.startTime,
        endTime: newSlot.endTime
      }
    ]);

    setNewSlot({ dayOfWeek: '1', startTime: '', endTime: '' });
    setError('');
  };

  const handleRemoveSlot = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await providerService.setAvailability({ schedule: availability });
      setSuccess('Availability updated successfully!');
      setSaving(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update availability');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading availability...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Availability</h1>
        <p>Set your available time slots for patient appointments</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="availability-card">
        {/* Add New Slot */}
        <div className="add-slot-section">
          <h3>Add Time Slot</h3>
          <div className="slot-form">
            <div className="form-group">
              <label htmlFor="dayOfWeek">Day of Week</label>
              <select
                id="dayOfWeek"
                value={newSlot.dayOfWeek}
                onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}
              >
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
                <option value="0">Sunday</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                value={newSlot.startTime}
                onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                value={newSlot.endTime}
                onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
              />
            </div>

            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleAddSlot}
            >
              + Add Slot
            </button>
          </div>
        </div>

        {/* Current Availability */}
        <div className="current-slots-section">
          <h3>Current Availability</h3>
          {availability.length === 0 ? (
            <p className="empty-state">No availability slots set. Add slots above.</p>
          ) : (
            <div className="slots-grid">
              {availability
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                .map((slot, index) => (
                  <div key={index} className="slot-item">
                    <div className="slot-info">
                      <strong>{getDayName(slot.dayOfWeek)}</strong>
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveSlot(index)}
                      title="Remove slot"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="save-section">
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Availability'}
          </button>
          <p className="help-text">
            Changes will be saved and patients will be able to book appointments during these times.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ManageAvailability;
