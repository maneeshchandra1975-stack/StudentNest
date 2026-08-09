'use strict';

const nodemailer = require('nodemailer');

// ── Create reusable transporter ─────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT, 10),
  secure: false, // TLS (not SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send OTP verification email to student
 * @param {string} toEmail  - student's college email
 * @param {string} otp      - plain 6-digit OTP
 * @param {string} name     - student's name (for personalisation)
 */
const sendOTPEmail = async (toEmail, otp, name) => {
  const mailOptions = {
    from:    process.env.SMTP_FROM,
    to:      toEmail,
    subject: 'CampusNest - Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 480px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: #10b981; padding: 30px; text-align: center; }
            .header h1 { color: #fff; margin: 0; font-size: 24px; }
            .body { padding: 30px; }
            .otp-box { background: #f0fdf4; border: 2px dashed #10b981; border-radius: 10px; text-align: center; padding: 20px; margin: 24px 0; }
            .otp-code { font-size: 42px; font-weight: bold; color: #065f46; letter-spacing: 10px; }
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
              <p>Hi <strong>${name}</strong>,</p>
              <p>Welcome to CampusNest! Please use the OTP below to verify your VIT-AP student email address.</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
                <div class="expires">This OTP expires in <strong>10 minutes</strong></div>
              </div>
              <p>If you did not create an account, please ignore this email.</p>
              <p>- The CampusNest Team</p>
            </div>
            <div class="footer">
              This is an automated email. Please do not reply.<br/>
              CampusNest - VIT-AP University
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail };
