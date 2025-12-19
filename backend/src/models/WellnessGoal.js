const mongoose = require('mongoose');

const wellnessGoalSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['steps', 'water', 'sleep', 'checkup'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  target: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'missed'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WellnessGoal', wellnessGoalSchema);
