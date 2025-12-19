const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const auditLog = require('../middleware/auditLog');

// All routes require authentication and doctor role
router.use(auth);
router.use(rbac('doctor'));

// Patient management routes
router.get('/patients', auditLog('VIEW_PATIENTS'), providerController.getPatients);
router.get('/patients/:id', auditLog('VIEW_PATIENT_DETAIL'), providerController.getPatientDetail);
router.get('/patients/:id/goals', auditLog('VIEW_PATIENT_GOALS'), providerController.getPatientGoals);
router.post('/patients/:id/goals', auditLog('SET_PATIENT_GOAL'), providerController.setPatientGoal);

// Availability management routes
router.get('/availability', auditLog('VIEW_AVAILABILITY'), providerController.getAvailability);
router.put('/availability', auditLog('UPDATE_AVAILABILITY'), providerController.setAvailability);

module.exports = router;
