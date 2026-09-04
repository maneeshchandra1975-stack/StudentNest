'use strict';

const nodemailer = require('nodemailer');

// ── Create reusable transporter ─────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send OTP verification email to student
 * @param {string} toEmail  - recipient email
 * @param {string} otp      - plain 6-digit OTP
 * @param {string} name     - student's name
 */
const sendOTPEmail = async (toEmail, otp, name) => {
  const mailOptions = {
    from:    process.env.SMTP_FROM || 'maneeshchandra1975@gmail.com',
    to:      toEmail,
    subject: 'CampusNest - Your OTP Code',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 480px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: #2563EB; padding: 30px; text-align: center; }
            .header h1 { color: #fff; margin: 0; font-size: 24px; }
            .body { padding: 30px; }
            .otp-box { background: #eff6ff; border: 2px dashed #2563EB; border-radius: 10px; text-align: center; padding: 20px; margin: 24px 0; }
            .otp-code { font-size: 42px; font-weight: bold; color: #1e40af; letter-spacing: 10px; }
            .expires { color: #6b7280; font-size: 13px; margin-top: 8px; }
            .footer { background: #f9fafb; padding: 20px 30px; text-align: center; color: #9ca3af; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>CampusNest</h1>
            </div>
            <div class="body">
              <p>Hi <strong>${name || 'Student'}</strong>,</p>
              <p>Please use the verification OTP code below to proceed on CampusNest.</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="expires">This OTP expires in <strong>10 minutes</strong></div>
              </div>
              <p>If you did not initiate this request, please ignore this email.</p>
              <p>- The CampusNest Team</p>
            </div>
            <div class="footer">
              Automated system email from CampusNest Student Portal.
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SUCCESS] OTP email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error(`[EMAIL WARNING] Could not deliver email via SMTP: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      // In production, we MUST throw so the user knows it failed (and they don't get stuck)
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
    console.log(`===================================================`);
    console.log(`>>> VERIFICATION OTP FOR [${toEmail}]: ${otp} <<<`);
    console.log(`===================================================`);
  }
};

module.exports = { sendOTPEmail };
