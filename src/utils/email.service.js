const nodemailer = require('nodemailer');

const sendVideoCallEmail = async (to, doctorName, patientName, link) => {
    // SMTP settings - reusing env vars from otp.service.js logic
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER || 'risittanalt@gmail.com';
    const pass = process.env.SMTP_PASS || 'sitm gejk cxaj aawy';
    const from = process.env.SMTP_FROM || user;

    if (!host || !user || !pass) {
        console.error('SMTP configuration is incomplete');
        return false;
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass
        }
    });

    const subject = `Video Call Invitation from ${patientName}`;

    // Simple HTML template
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video Call Invitation</title>
    <style>
        body { font-family: sans-serif; background-color: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .btn { display: inline-block; background-color: #2563EB; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        .footer { margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Hello ${doctorName},</h2>
        <p>You have a video call request from your patient, <strong>${patientName}</strong>.</p>
        <p>Please click the button below to join the call:</p>
        <a href="${link}" class="btn">Join Video Call</a>
        <p style="margin-top: 20px;">Or copy this link: <br><a href="${link}">${link}</a></p>
        <div class="footer">
            <p>ConnectCare Video Consultation</p>
        </div>
    </div>
</body>
</html>
    `;

    try {
        const info = await transporter.sendMail({
            from,
            to,
            subject,
            html
        });
        console.log('Video call email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending video call email:', error);
        return false;
    }
};

const sendMedicalReport = async (to, doctorName, patientName, reportData, reportId) => {
    // SMTP settings
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER || 'risittanalt@gmail.com';
    const pass = process.env.SMTP_PASS || 'sitm gejk cxaj aawy';
    const from = process.env.SMTP_FROM || user;

    const transporter = nodemailer.createTransport({
        host, port, secure: port === 465, auth: { user, pass }
    });

    const subject = `Medical Report - Consultation with ${patientName}`;

    // Format report data for HTML
    const reportHtml = Object.entries(reportData).map(([key, value]) => {
        const title = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        return `<div style="margin-bottom: 15px;">
            <h3 style="margin: 0 0 5px 0; color: #2c3e50; font-size: 16px;">${title}</h3>
            <p style="margin: 0; color: #34495e; line-height: 1.5;">${value}</p>
        </div>`;
    }).join('');

    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 20px; }
        .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: #2563EB; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
        .report-section { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin:0; font-size: 24px;">Medical Consultation Report</h1>
        </div>
        <div class="content">
            <p>Dear Dr. ${doctorName},</p>
            <p>Here is the AI-generated summary for your consultation with <strong>${patientName}</strong>.</p>
            
            <div class="report-section">
                ${reportHtml}
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/TailAdmin/doctors" style="display: inline-block; background: #2563EB; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">View on Dashboard</a>
            </div>
        </div>
        <div class="footer">
            <p>Generated by ConnectCare AI • ID: ${reportId}</p>
        </div>
    </div>
</body>
</html>
    `;

    try {
        await transporter.sendMail({ from, to, subject, html });
        console.log('Medical report email sent to', to);
        return true;
    } catch (error) {
        console.error('Error sending medical report email:', error);
        return false;
    }
};

module.exports = {
    sendVideoCallEmail,
    sendMedicalReport,
    sendPatientReport: async (to, patientName, doctorName, reportData, reportId) => {
        // SMTP settings
        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const port = parseInt(process.env.SMTP_PORT || '587', 10);
        const user = process.env.SMTP_USER || 'risittanalt@gmail.com';
        const pass = process.env.SMTP_PASS || 'sitm gejk cxaj aawy';
        const from = process.env.SMTP_FROM || user;

        const transporter = nodemailer.createTransport({
            host, port, secure: port === 465, auth: { user, pass }
        });

        const subject = `Your Medical Report - Consultation with Dr. ${doctorName}`;

        const reportHtml = `
            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0 0 5px 0; color: #2c3e50; font-size: 16px;">Diagnosis</h3>
                <p style="margin: 0; color: #34495e; line-height: 1.5;">${reportData.diagnosis}</p>
            </div>
            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0 0 5px 0; color: #2c3e50; font-size: 16px;">Prescription/Plan</h3>
                <p style="margin: 0; color: #34495e; line-height: 1.5;">${reportData.prescription}</p>
            </div>
            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0 0 5px 0; color: #2c3e50; font-size: 16px;">Notes</h3>
                <p style="margin: 0; color: #34495e; line-height: 1.5;">${reportData.notes}</p>
            </div>
        `;

        const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 20px; }
            .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: #2563EB; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .footer { background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; }
            .report-section { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin:0; font-size: 24px;">Medical Report</h1>
            </div>
            <div class="content">
                <p>Dear ${patientName},</p>
                <p>Here is the medical report from your consultation with <strong>Dr. ${doctorName}</strong>.</p>
                
                <div class="report-section">
                    ${reportHtml}
                </div>
                
                <div style="margin-top: 20px; text-align: center;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" style="display: inline-block; background: #2563EB; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: bold;">View on Dashboard</a>
                </div>
            </div>
            <div class="footer">
                <p>Generated by ConnectCare • ID: ${reportId}</p>
            </div>
        </div>
    </body>
    </html>
        `;

        try {
            await transporter.sendMail({ from, to, subject, html });
            console.log('Patient report email sent to', to);
            return true;
        } catch (error) {
            console.error('Error sending patient report email:', error);
            return false;
        }
    }
};

