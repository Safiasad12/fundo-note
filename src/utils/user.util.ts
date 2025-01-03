import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import logger from './logger'

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, token: string) => {
  try {
    await transporter.sendMail({
      from: `"fundoonotes" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Password Reset Token",
      html: `<p>Your password reset token is:</p><p><strong>${token}</strong></p>`,
    });
    logger.info('Email sent successfully');
  } catch (error) {
    logger.error('Error sending email:', error);
  }
};
