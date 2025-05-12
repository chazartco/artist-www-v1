import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Instagram, Twitter, Youtube } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { sendEmail, isEmailConfigured } from '../utils/emailService';
import { ContactFormData } from '../types';

const ContactPage: React.FC = () => {
  const { about } = useData();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });

  const emailConfigured = isEmailConfigured();
  
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram size={24} />;
      case 'twitter':
        return <Twitter size={24} />;
      case 'youtube':
        return <Youtube size={24} />;
      default:
        return null;
    }
  };
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailConfigured) return;

    setStatus({ type: 'loading', message: 'Sending message...' });
    
    try {
      const success = await sendEmail(formData);
      
      if (success) {
        setStatus({
          type: 'success',
          message: 'Your message has been sent successfully!',
        });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again later.',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center tracking-tight mb-4">
          Contact
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center">
          Get in touch for inquiries, commissions, or collaboration opportunities
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center gap-6 mb-12">
          {about.socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 transition-colors"
              aria-label={link.platform}
            >
              {getSocialIcon(link.platform)}
            </a>
          ))}
        </div>

        <div className="card p-8">
          <h2 className="text-3xl font-bold mb-6">Send a Message</h2>
          
          {!emailConfigured && (
            <div className="bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 p-4 rounded-md mb-6">
              <p>Contact form is currently disabled. Please use social media to get in touch.</p>
            </div>
          )}
          
          {status.type === 'success' && (
            <div className="bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 p-4 rounded-md flex items-start mb-6">
              <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{status.message}</p>
            </div>
          )}
          
          {status.type === 'error' && (
            <div className="bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-400 p-4 rounded-md flex items-start mb-6">
              <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{status.message}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${!emailConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!emailConfigured}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${!emailConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={!emailConfigured}
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={formData.subject}
                onChange={handleChange}
                className={`input ${!emailConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!emailConfigured}
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                value={formData.message}
                onChange={handleChange}
                className={`input ${!emailConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!emailConfigured}
              />
            </div>
            <button
              type="submit"
              disabled={status.type === 'loading' || !emailConfigured}
              className={`btn btn-primary w-full flex items-center justify-center ${
                !emailConfigured ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {status.type === 'loading' ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;