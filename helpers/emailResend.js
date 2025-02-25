import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to send emails using Resend
const sendEmail = async ({ to, subject, html, from = "APV - Administrador de Pacientes de Veterinaria <onboarding@resend.dev>" }) => {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    
    if (error) {
      console.error('Error from Resend API:', error);
      throw new Error(error.message);
    }
    
    console.log('Email sent successfully. Response:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendEmail;