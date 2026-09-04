'use strict';

const nodemailer = require('nodemailer');
const axios = require('axios');

// ── Create reusable transporter (Local / Fallback) ─────────
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
  const subject = 'CampusNest - Your OTP Code';
  const senderEmail = process.env.SMTP_FROM || 'maneeshchandra1975@gmail.com';
  const htmlContent = `
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
    `;

  try {
    // 1. If we have a Brevo API Key, use HTTP API (Bypasses Render Port 587 Block)
    if (process.env.BREVO_API_KEY) {
      await axios.post('https://api.brevo.com/v3/smtp/email', {
        sender: { email: senderEmail, name: 'CampusNest' },
        to: [{ email: toEmail }],
        subject: subject,
        htmlContent: htmlContent
      }, {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      });
      console.log(`[EMAIL SUCCESS] OTP email sent via Brevo API to ${toEmail}`);
      return;
    }

    // 2. Fallback to Nodemailer SMTP (Works locally, blocked on Render Free)
    await transporter.sendMail({
      from: senderEmail,
      to: toEmail,
      subject: subject,
      html: htmlContent
    });
    console.log(`[EMAIL SUCCESS] OTP email sent via SMTP to ${toEmail}`);

  } catch (error) {
    const errorMsg = error.response && error.response.data 
      ? JSON.stringify(error.response.data) 
      : error.message;

    console.error(`[EMAIL WARNING] Could not deliver email: ${errorMsg}`);
    
    // Always throw an error if the HTTP API fails, or if we are in production
    if (process.env.NODE_ENV === 'production' || process.env.BREVO_API_KEY) {
      throw new Error(`Failed to send OTP email: ${errorMsg}`);
    }
    
    console.log(`===================================================`);
    console.log(`>>> VERIFICATION OTP FOR [${toEmail}]: ${otp} <<<`);
    console.log(`===================================================`);
  }
};

module.exports = { sendOTPEmail };
