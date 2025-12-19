const User = require('../models/User');
const Appointment = require('../models/Appointment');
const WellnessGoal = require('../models/WellnessGoal');
const GoalLog = require('../models/GoalLog');

// Get assigned patients (patients who have appointments with this doctor)
exports.getPatients = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id })
      .populate('patientId', 'name email')
      .select('patientId');

    // Get unique patients
    const patientIds = [...new Set(appointments.map(apt => apt.patientId._id.toString()))];
    const patients = await User.find({ _id: { $in: patientIds }, role: 'patient' })
      .select('-password');

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patient detail with compliance
exports.getPatientDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify patient is assigned (has appointment with this doctor)
    const hasAppointment = await Appointment.findOne({
      doctorId: req.user.id,
      patientId: id
    });

    if (!hasAppointment) {
      return res.status(403).json({ message: 'You are not assigned to this patient' });
    }

    const patient = await User.findById(id).select('-password');
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get patient goals
    const goals = await WellnessGoal.find({ patientId: id });

    // Calculate compliance for each goal
    const goalsWithCompliance = await Promise.all(goals.map(async (goal) => {
      const logs = await GoalLog.find({ goalId: goal._id }).sort({ date: -1 }).limit(7);
      
      let progress = 0;
      let complianceStatus = 'Missed';

      if (logs.length > 0) {
        const avgValue = logs.reduce((sum, log) => sum + log.value, 0) / logs.length;
        progress = Math.min(Math.round((avgValue / goal.target) * 100), 100);
        
        if (progress >= 100) {
          complianceStatus = 'Goal Met';
        } else if (progress >= 50) {
          complianceStatus = 'Partial';
        } else {
          complianceStatus = 'Missed';
        }
      }

      return {
        _id: goal._id,
        type: goal.type,
        title: goal.title,
        target: goal.target,
        unit: goal.unit,
        progress,
        status: complianceStatus
      };
    }));

    // Overall compliance
    const metGoals = goalsWithCompliance.filter(g => g.status === 'Goal Met').length;
    const totalGoals = goalsWithCompliance.length;
    const overallCompliance = totalGoals > 0
      ? metGoals === totalGoals ? 'Full' : metGoals > 0 ? 'Partial' : 'Low'
      : 'No Goals';

    res.json({
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        allergies: patient.allergies,
        medications: patient.medications
      },
      goals: goalsWithCompliance,
      compliance: overallCompliance
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patient goals
exports.getPatientGoals = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify patient is assigned
    const hasAppointment = await Appointment.findOne({
      doctorId: req.user.id,
      patientId: id
    });

    if (!hasAppointment) {
      return res.status(403).json({ message: 'You are not assigned to this patient' });
    }

    const goals = await WellnessGoal.find({ patientId: id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Set goal for patient
exports.setPatientGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, title, target, unit } = req.body;

    if (!type || !title || !target || !unit) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Verify patient is assigned
    const hasAppointment = await Appointment.findOne({
      doctorId: req.user.id,
      patientId: id
    });

    if (!hasAppointment) {
      return res.status(403).json({ message: 'You are not assigned to this patient' });
    }

    // Verify patient exists
    const patient = await User.findOne({ _id: id, role: 'patient' });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Create goal
    const goal = await WellnessGoal.create({
      patientId: id,
      doctorId: req.user.id,
      type,
      title,
      target,
      unit,
      status: 'active'
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get doctor's availability schedule
exports.getAvailability = async (req, res) => {
  try {
    const DoctorAvailability = require('../models/DoctorAvailability');
    
    const availability = await DoctorAvailability.find({ doctorId: req.user.id })
      .sort({ dayOfWeek: 1 });

    res.json(availability);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Set/Update doctor's availability
exports.setAvailability = async (req, res) => {
  try {
    const DoctorAvailability = require('../models/DoctorAvailability');
    const { schedule } = req.body;

    // schedule format: [{ dayOfWeek: 1, startTime: "09:00", endTime: "17:00" }, ...]
    if (!schedule || !Array.isArray(schedule)) {
      return res.status(400).json({ message: 'Schedule array is required' });
    }

    // Validate each schedule entry
    for (const entry of schedule) {
      if (entry.dayOfWeek < 0 || entry.dayOfWeek > 6) {
        return res.status(400).json({ message: 'dayOfWeek must be between 0-6' });
      }
      if (!entry.startTime || !entry.endTime) {
        return res.status(400).json({ message: 'startTime and endTime are required' });
      }
    }

    // Delete existing availability for this doctor
    await DoctorAvailability.deleteMany({ doctorId: req.user.id });

    // Create new availability entries
    const availabilityEntries = schedule.map(entry => ({
      doctorId: req.user.id,
      dayOfWeek: entry.dayOfWeek,
      startTime: entry.startTime,
      endTime: entry.endTime,
      slotDuration: entry.slotDuration || 60
    }));

    const created = await DoctorAvailability.insertMany(availabilityEntries);

    res.json({
      message: 'Availability updated successfully',
      availability: created
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
