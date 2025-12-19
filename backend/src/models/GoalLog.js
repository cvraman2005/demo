const mongoose = require('mongoose');

const goalLogSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WellnessGoal',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GoalLog', goalLogSchema);
