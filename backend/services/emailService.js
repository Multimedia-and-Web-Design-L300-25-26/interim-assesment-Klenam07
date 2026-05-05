// services/emailService.js — Email sending utility using nodemailer

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification Code - Quick Crypto",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0A0B0D; color: #FFFFFF; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #1E2025; border-radius: 12px; padding: 30px;">
          <h1 style="color: #0052FF; text-align: center; margin-bottom: 20px;">Quick Crypto</h1>
          <h2 style="font-size: 24px; margin-bottom: 15px;">Verify Your Email</h2>
          <p style="color: #8A919E; margin-bottom: 20px;">
            Your verification code is:
          </p>
          <div style="background-color: #0A0B0D; border: 2px solid #0052FF; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <p style="font-size: 36px; font-weight: bold; color: #0052FF; letter-spacing: 5px; margin: 0;">
              ${verificationCode}
            </p>
          </div>
          <p style="color: #8A919E; font-size: 14px; margin-bottom: 20px;">
            This code will expire in 10 minutes.
          </p>
          <p style="color: #8A919E; font-size: 12px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Verification email sent" };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendVerificationEmail };
