const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/health-info', publicController.getHealthInfo);
router.get('/privacy-policy', publicController.getPrivacyPolicy);

module.exports = router;
