import emailjs from 'emailjs-com';
import { ContactFormData } from '../types';

export const isEmailConfigured = (): boolean => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const userId = import.meta.env.VITE_EMAILJS_USER_ID;

  return Boolean(serviceId && templateId && userId && 
    serviceId !== 'service_id' && 
    templateId !== 'template_id' && 
    userId !== 'user_id');
};

export const sendEmail = async (formData: ContactFormData): Promise<boolean> => {
  if (!isEmailConfigured()) {
    console.error('Email service is not configured');
    return false;
  }

  try {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const userId = import.meta.env.VITE_EMAILJS_USER_ID;
    
    await emailjs.send(
      serviceId,
      templateId,
      {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: import.meta.env.VITE_CONTACT_EMAIL,
      },
      userId
    );
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};