require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const DoctorAvailability = require('../models/DoctorAvailability');

const doctors = [
  {
    name: 'Dr. Smith',
    email: 'dr.smith@hospital.com',
    password: 'Doctor123!',
    specialty: 'General Medicine',
    schedule: { startTime: '09:00', endTime: '12:00' }  // 9 AM - 12 PM
  },
  {
    name: 'Dr. Patel',
    email: 'dr.patel@hospital.com',
    password: 'Doctor123!',
    specialty: 'Cardiology',
    schedule: { startTime: '14:00', endTime: '17:00' }  // 2 PM - 5 PM
  },
  {
    name: 'Dr. Chen',
    email: 'dr.chen@hospital.com',
    password: 'Doctor123!',
    specialty: 'Dermatology',
    schedule: { startTime: '09:00', endTime: '11:00' }  // 9 AM - 11 AM
  },
  {
    name: 'Dr. Wilson',
    email: 'dr.wilson@hospital.com',
    password: 'Doctor123!',
    specialty: 'Orthopedics',
    schedule: { startTime: '11:00', endTime: '16:00' }  // 11 AM - 4 PM
  },
  {
    name: 'Dr. Garcia',
    email: 'dr.garcia@hospital.com',
    password: 'Doctor123!',
    specialty: 'Pediatrics',
    schedule: { startTime: '09:00', endTime: '15:00' }  // 9 AM - 3 PM
  }
];

async function seedDoctors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing doctors and availability
    await User.deleteMany({ role: 'doctor' });
    await DoctorAvailability.deleteMany({});
    console.log('✓ Cleared existing doctors');

    // Create doctors
    for (const doctorData of doctors) {
      const doctor = await User.create({
        email: doctorData.email,
        password: doctorData.password,
        name: doctorData.name,
        role: 'doctor',
        specialty: doctorData.specialty,
        consentGiven: true,
        consentDate: new Date()
      });

      // Create availability for weekdays (Monday to Friday)
      for (let day = 1; day <= 5; day++) {
        await DoctorAvailability.create({
          doctorId: doctor._id,
          dayOfWeek: day,
          startTime: doctorData.schedule.startTime,
          endTime: doctorData.schedule.endTime,
          slotDuration: 60  // 1 hour slots
        });
      }

      console.log(`✓ Created doctor: ${doctor.name} (${doctor.specialty}) [${doctorData.schedule.startTime}-${doctorData.schedule.endTime}]`);
    }

    console.log('\n✓ Seeding completed successfully!');
    console.log('\nDoctor credentials:');
    doctors.forEach(d => {
      console.log(`  ${d.name}: ${d.email} / ${d.password}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('✗ Seeding failed:', error);
    process.exit(1);
  }
}

seedDoctors();
