const express = require('express');
const router = express.Router();

const patient_controller = require('../controllers/patient.controller');

router.post('/delete/:userName',patient_controller.patient_delete);
router.get('/test', patient_controller.test);//just to test
router.post('/create', patient_controller.add_patient);//add patient
router.get('/list/:nameDoctor',patient_controller.render_patients);//render patients
module.exports = router;