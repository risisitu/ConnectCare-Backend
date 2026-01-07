const express = require('express');
const doctorRouter = express.Router();
const DoctorController = require('../controllers/doctor.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Public routes
doctorRouter.post('/signup', DoctorController.signup);
doctorRouter.post('/login', DoctorController.login);
doctorRouter.get('/getallDoctors', DoctorController.getAllDoctors);
doctorRouter.get('/doctors/:id', DoctorController.getDoctorById);
// Get all patients of a specific doctor
doctorRouter.get('/:doctorId/patients', DoctorController.getDoctorPatientsList);

// Protected routes (require authentication)
doctorRouter.use(authMiddleware);
doctorRouter.get('/profile', DoctorController.getProfile);
doctorRouter.put('/profile', DoctorController.updateProfile);
doctorRouter.get('/patients', DoctorController.getMyPatients);
doctorRouter.get('/patients/:patientId', DoctorController.getPatientById);
doctorRouter.get('/appointments', DoctorController.getMyAppointments);
doctorRouter.get('/reports', DoctorController.getDoctorReports);
doctorRouter.put('/reports/:reportId', DoctorController.updateReportStatus);

module.exports = doctorRouter;