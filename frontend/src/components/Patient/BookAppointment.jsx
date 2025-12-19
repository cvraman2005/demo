import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './Patient.css';

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availability, setAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor) {
      fetchAvailability();
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (selectedDay && selectedDoctor) {
      fetchAvailableSlots();
    }
  }, [selectedDay, selectedDoctor]);

  const fetchDoctors = async () => {
    try {
      const response = await patientService.getDoctors();
      setDoctors(response.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load doctors');
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await patientService.getAvailableDays(selectedDoctor);
      setAvailability(response.data?.availability || []);
      setSelectedDay(null);
      setAvailableSlots([]);
      setSelectedSlot(null);
    } catch (err) {
      setError('Failed to load doctor availability');
      setAvailability([]);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      setSlotsLoading(true);
      const dateStr = getNextDateForDay(selectedDay.dayOfWeek);
      
      // Fetch available slots for the specific date
      const response = await patientService.getAvailability(selectedDoctor, dateStr);
      setAvailableSlots(response.data?.availableSlots || []);
      setSelectedSlot(null);
      setSlotsLoading(false);
    } catch (err) {
      setError('Failed to load available slots');
      setSlotsLoading(false);
    }
  };

  const getDayName = (dayNum) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return typeof dayNum === 'number' ? days[dayNum] : dayNum;
  };

  const getNextDateForDay = (dayOfWeek) => {
    const today = new Date();
    const todayDay = today.getDay();
    let daysToAdd = dayOfWeek - todayDay;
    
    if (daysToAdd < 0) {
      daysToAdd += 7;
    } else if (daysToAdd === 0) {
      daysToAdd = 7; // If same day, show next week
    }
    
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysToAdd);
    return nextDate.toISOString().split('T')[0];
  };

  const handleDaySelect = (slot) => {
    setSelectedDay(slot);
    setError('');
  };

  const handleSlotSelect = (slotTime) => {
    setSelectedSlot(slotTime);
    setError('');
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    setError('');
    setSuccess('');
    setBookingLoading(true);

    try {
      const dateStr = getNextDateForDay(selectedDay.dayOfWeek);
      
      await patientService.bookAppointment({
        doctorId: selectedDoctor,
        date: dateStr,
        time: selectedSlot
      });
      
      setSuccess('Appointment booked successfully!');
      setTimeout(() => {
        navigate('/patient/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading doctors...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Book an Appointment</h1>
        <p>Schedule a consultation with a healthcare provider</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="booking-card">
        <div className="form-group">
          <label htmlFor="doctor">Select Doctor</label>
          <select
            id="doctor"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            required
          >
            <option value="">-- Choose a doctor --</option>
            {doctors.map(doctor => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.name} {doctor.specialty ? `- ${doctor.specialty}` : ''}
              </option>
            ))}
          </select>
        </div>

        {selectedDoctor && (
          <>
            {availability.length === 0 ? (
              <div className="info-message">
                This doctor has not set their availability yet.
              </div>
            ) : (
              <>
                {!selectedDay ? (
                  <div className="weekly-schedule">
                    <h3 style={{ marginBottom: '20px', color: '#1a3a5c' }}>
                      Select a Day
                    </h3>
                    <div className="schedule-grid">
                      {availability.map((slot, index) => {
                        const nextDate = getNextDateForDay(slot.dayOfWeek);
                        
                        return (
                          <div 
                            key={index} 
                            className="day-column"
                            onClick={() => handleDaySelect(slot)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="day-header">
                              <h4>{getDayName(slot.dayOfWeek)}</h4>
                              <p className="day-date">{nextDate}</p>
                            </div>
                            <div className="time-slots">
                              <div className="time-slot" style={{ background: '#0066cc', color: 'white', border: 'none' }}>
                                <span className="time">{slot.startTime}</span>
                                <span className="time-range">to {slot.endTime}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="weekly-schedule">
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ color: '#1a3a5c', margin: 0 }}>
                        {getDayName(selectedDay.dayOfWeek)} - {getNextDateForDay(selectedDay.dayOfWeek)}
                      </h3>
                      <button 
                        className="btn-secondary"
                        onClick={() => setSelectedDay(null)}
                        style={{ padding: '8px 16px', fontSize: '0.9em' }}
                      >
                        Change Day
                      </button>
                    </div>

                    {slotsLoading ? (
                      <div style={{ padding: '30px', textAlign: 'center', color: '#666' }}>
                        Loading available slots...
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="info-message">
                        No available slots for this day. Please select another day.
                      </div>
                    ) : (
                      <>
                        <h4 style={{ color: '#333', marginBottom: '15px' }}>
                          Available 1-Hour Slots
                        </h4>
                        <div className="slots-grid">
                          {availableSlots.map((slot, index) => {
                            const isSelected = selectedSlot === slot;
                            
                            return (
                              <button
                                key={index}
                                className={`time-slot-button ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleSlotSelect(slot)}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>

                        {selectedSlot && (
                          <div className="booking-summary">
                            <h3>Appointment Summary</h3>
                            <div className="summary-details">
                              <p><strong>Doctor:</strong> {doctors.find(d => d._id === selectedDoctor)?.name}</p>
                              <p><strong>Day:</strong> {getDayName(selectedDay.dayOfWeek)}</p>
                              <p><strong>Date:</strong> {getNextDateForDay(selectedDay.dayOfWeek)}</p>
                              <p><strong>Time:</strong> {selectedSlot}</p>
                            </div>
                            <button
                              className="btn-primary"
                              onClick={handleBookAppointment}
                              disabled={bookingLoading}
                            >
                              {bookingLoading ? 'Booking...' : 'Confirm Appointment'}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BookAppointment;
