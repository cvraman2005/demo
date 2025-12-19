const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const auditLog = require('../middleware/auditLog');

// All routes require authentication and patient role
router.use(auth);
router.use(rbac('patient'));

// Profile routes
router.get('/profile', auditLog('VIEW_PROFILE'), patientController.getProfile);
router.put('/profile', auditLog('UPDATE_PROFILE'), patientController.updateProfile);

// Doctor listing
router.get('/doctors', patientController.getDoctors);

// Check doctor availability
const availabilityController = require('../controllers/availabilityController');
router.get('/availability/days', availabilityController.getDoctorAvailableDays);
router.get('/availability', availabilityController.getDoctorAvailability);

// Appointment routes
router.get('/appointments', auditLog('VIEW_APPOINTMENTS'), patientController.getAppointments);
router.post('/appointments', auditLog('BOOK_APPOINTMENT'), patientController.bookAppointment);

// Goal routes (view only - goals set by doctor)
router.get('/goals', auditLog('VIEW_GOALS'), patientController.getGoals);

// Goal logging routes
router.get('/goals/:id/logs', auditLog('VIEW_GOAL_LOGS'), patientController.getGoalLogs);
router.post('/goals/:id/log', auditLog('LOG_GOAL_PROGRESS'), patientController.logGoalProgress);

module.exports = router;
