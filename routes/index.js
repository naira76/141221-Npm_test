const express = require('express');
const bmiController = require('../controllers/bmi_controller');
const router = express.Router();

router.post('/bmi', bmiController.storeBMI);
router.get('/bmi', bmiController.getAllBMI);

module.exports = router;
