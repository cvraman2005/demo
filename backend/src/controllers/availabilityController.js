const User = require('../models/User');
const DoctorAvailability = require('../models/DoctorAvailability');
const Appointment = require('../models/Appointment');

// Helper function to generate time slots
const generateTimeSlots = (startTime, endTime, slotDuration = 60) => {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  while (currentMinutes + slotDuration <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    slots.push(timeStr);
    currentMinutes += slotDuration;
  }

  return slots;
};

// Get doctor's available days (for UI to show which days doctor works)
exports.getDoctorAvailableDays = async (req, res) => {
  try {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res.status(400).json({ message: 'doctorId is required' });
    }

    // Get all availability entries for this doctor
    const availability = await DoctorAvailability.find({ doctorId: doctorId }).sort({ dayOfWeek: 1 });

    if (availability.length === 0) {
      return res.json({ 
        doctorId,
        availability: [],
        message: 'Doctor has not set availability yet'
      });
    }

    res.json({
      doctorId,
      availability
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get doctor availability for a specific date
exports.getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId || !date) {
      return res.status(400).json({ message: 'doctorId and date are required' });
    }

    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getDay();

    // Get doctor's defined time range for this day
    const availability = await DoctorAvailability.findOne({
      doctorId: doctorId,
      dayOfWeek: dayOfWeek
    });

    if (!availability) {
      return res.json({ 
        doctorId,
        date,
        dayOfWeek,
        message: 'Doctor is not available on this day',
        availableSlots: [] 
      });
    }

    // Generate all time slots from the doctor's time range
    const allSlots = generateTimeSlots(
      availability.startTime, 
      availability.endTime, 
      availability.slotDuration
    );

    // Get already booked slots for this doctor on this date
    const bookedAppointments = await Appointment.find({
      doctorId: doctorId,
      date: appointmentDate,
      status: { $in: ['scheduled', 'completed'] }
    }).select('time');

    const bookedSlots = bookedAppointments.map(apt => apt.time);

    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      doctorId,
      date,
      dayOfWeek,
      schedule: {
        startTime: availability.startTime,
        endTime: availability.endTime,
        slotDuration: availability.slotDuration
      },
      allSlots,
      bookedSlots,
      availableSlots
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
