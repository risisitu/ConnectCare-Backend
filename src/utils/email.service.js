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

module.exports = {
    sendVideoCallEmail
};
