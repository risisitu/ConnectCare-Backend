const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

router.post('/appointments/:appointmentId/reports', ReportController.generateReport);
router.post('/appointments/:appointmentId/ai-reports', ReportController.generateAIReport);
router.get('/reports/:reportId', ReportController.getReport);
router.put('/reports/:reportId', ReportController.updateReportStatus);

module.exports = router;