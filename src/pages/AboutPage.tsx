import React from 'react';
import { useData } from '../contexts/DataContext';
import { Instagram, Twitter, Youtube } from 'lucide-react';

const AboutPage: React.FC = () => {
  const { about } = useData();
  
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

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 mb-10">
          <div className="md:w-1/3">
            <div className="sticky top-24">
              <div className="rounded-2xl overflow-hidden mb-6">
                <img
                  src={about.profileImage}
                  alt={about.name}
                  className="w-full h-auto"
                />
              </div>
              <div className="flex justify-center gap-4 mb-6">
                {about.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    aria-label={link.platform}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="md:w-2/3">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
              {about.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              {about.biography}
            </p>
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: about.htmlContent }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;