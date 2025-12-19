const User = require('../models/User');
const Appointment = require('../models/Appointment');
const WellnessGoal = require('../models/WellnessGoal');
const GoalLog = require('../models/GoalLog');

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, allergies, medications } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, allergies, medications },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate('doctorId', 'name specialty')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Book appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Verify doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if doctor has availability for this time slot
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getDay();
    
    const DoctorAvailability = require('../models/DoctorAvailability');
    const availability = await DoctorAvailability.findOne({
      doctorId: doctorId,
      dayOfWeek: dayOfWeek
    });

    if (!availability) {
      return res.status(400).json({ 
        message: 'Doctor is not available on this day' 
      });
    }

    // Verify the requested time falls within doctor's working hours
    const [reqHour, reqMin] = time.split(':').map(Number);
    const [startHour, startMin] = availability.startTime.split(':').map(Number);
    const [endHour, endMin] = availability.endTime.split(':').map(Number);

    const reqMinutes = reqHour * 60 + reqMin;
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (reqMinutes < startMinutes || reqMinutes + 60 > endMinutes) {
      return res.status(400).json({ 
        message: `Time slot must be between ${availability.startTime} and ${availability.endTime}` 
      });
    }

    // Check if slot is already booked (prevent double-booking)
    const existingAppointment = await Appointment.findOne({
      doctorId: doctorId,
      date: appointmentDate,
      time: time,
      status: { $in: ['scheduled', 'completed'] }  // Don't block if cancelled
    });

    if (existingAppointment) {
      return res.status(409).json({ 
        message: 'This time slot is already booked. Please choose another time.' 
      });
    }

    // Create the appointment (reserves 1 hour slot)
    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date: appointmentDate,
      time,
      duration: 60,  // 1 hour
      status: 'scheduled'
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctorId', 'name specialty');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get goals (view only - set by doctor)
exports.getGoals = async (req, res) => {
  try {
    const goals = await WellnessGoal.find({ patientId: req.user.id })
      .populate('doctorId', 'name specialty');
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get goal logs
exports.getGoalLogs = async (req, res) => {
  try {
    const { id } = req.params;

    const logs = await GoalLog.find({ goalId: id, patientId: req.user.id }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Log goal progress
exports.logGoalProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ message: 'Value is required' });
    }

    // Verify goal belongs to patient
    const goal = await WellnessGoal.findOne({ _id: id, patientId: req.user.id });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Create log entry
    const log = await GoalLog.create({
      patientId: req.user.id,
      goalId: id,
      date: new Date(),
      value
    });

    // Calculate progress percentage
    const progress = Math.min(Math.round((value / goal.target) * 100), 100);

    res.status(201).json({
      success: true,
      log,
      progress
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
