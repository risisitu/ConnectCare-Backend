const Report = require('../models/report.model');
const Appointment = require('../models/appointment.model');

class ReportController {
    static async generateReport(req, res) {
        try {
            const { id: userId, role } = req.user;
            const { appointmentId } = req.params;
            const { diagnosis, prescription, notes } = req.body;

            // Check if user has access to this appointment
            const hasAccess = await Appointment.checkAppointmentAccess(appointmentId, userId, role);
            if (!hasAccess) {
                return res.status(403).json({ success: false, error: 'Unauthorized access to appointment' });
            }

            // Get appointment details to get both doctor and patient IDs
            const appointment = await Appointment.getAppointmentById(appointmentId);
            if (!appointment) {
                return res.status(404).json({ success: false, error: 'Appointment not found' });
            }

            const reportData = {
                appointmentId,
                patientId: appointment.patient_id,
                doctorId: appointment.doctor_id,
                diagnosis,
                prescription,
                notes,
                aiGenerated: false
            };

            const report = await Report.createReport(reportData);
            res.status(201).json({
                success: true,
                data: report
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async generateAIReport(req, res) {
        try {
            const { id: userId, role } = req.user;
            const { appointmentId } = req.params;

            // Check if user has access to this appointment
            const hasAccess = await Appointment.checkAppointmentAccess(appointmentId, userId, role);
            if (!hasAccess) {
                return res.status(403).json({ success: false, error: 'Unauthorized access to appointment' });
            }

            // Get appointment details
            const appointment = await Appointment.getAppointmentById(appointmentId);
            if (!appointment) {
                return res.status(404).json({ success: false, error: 'Appointment not found' });
            }

            // Generate AI report
            const aiReport = await Report.generateAIReport(appointment);

            // Save the AI-generated report
            const reportData = {
                appointmentId,
                patientId: appointment.patient_id,
                doctorId: appointment.doctor_id,
                ...aiReport,
                aiGenerated: true
            };

            const report = await Report.createReport(reportData);
            res.status(201).json({
                success: true,
                data: report
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async updateReportStatus(req, res) {
        try {
            const { id: userId, role } = req.user;
            if (role !== 'doctor') {
                return res.status(403).json({ success: false, error: 'Only doctors can update report status' });
            }

            const { reportId } = req.params;
            const { status, notes } = req.body;

            // Validate status
            const validStatuses = ['approved', 'rejected', 'iterated'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ success: false, error: 'Invalid status' });
            }

            // Update report status
            const report = await Report.updateReportStatus(reportId, status, userId);

            // If status is 'iterated', create a new iteration
            if (status === 'iterated' && notes) {
                await Report.createReportIteration({
                    reportId,
                    changes: notes
                });
            }

            res.json({
                success: true,
                data: report
            });
        } catch (error) {
            if (error.message === 'Report not found or unauthorized') {
                return res.status(403).json({ success: false, error: error.message });
            }
            res.status(500).json({ success: false, error: error.message });
        }
    }

    static async getReport(req, res) {
        try {
            const { id: userId, role } = req.user;
            const { reportId } = req.params;

            // Check if user has access to this report
            const hasAccess = await Report.checkReportAccess(reportId, userId, role);
            if (!hasAccess) {
                return res.status(403).json({ success: false, error: 'Unauthorized access to report' });
            }

            // Get report details
            const report = await Report.getReportById(reportId);
            if (!report) {
                return res.status(404).json({ success: false, error: 'Report not found' });
            }

            // Get report iterations if they exist
            const iterations = await Report.getReportIterations(reportId);

            res.json({
                success: true,
                data: {
                    ...report,
                    iterations
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = ReportController;