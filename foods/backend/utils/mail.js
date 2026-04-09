import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpMail = async (to, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: "Reset Your Password",
        html: `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 5 minutes.</p>`
    })
}

export const sendDeliveryOtpMail = async (user, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to:user.email,
        subject: "Delivery Otp",
        html: `<p>Your OTP for delivery is <b>${otp}</b>. It is valid for 5 minutes.</p>`
    })
}