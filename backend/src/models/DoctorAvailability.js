const mongoose = require('mongoose');

const doctorAvailabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  },
  startTime: {
    type: String,
    required: true  // Format: "09:00"
  },
  endTime: {
    type: String,
    required: true  // Format: "17:00"
  },
  slotDuration: {
    type: Number,
    default: 60  // Duration in minutes (1 hour slots)
  }
});

module.exports = mongoose.model('DoctorAvailability', doctorAvailabilitySchema);
