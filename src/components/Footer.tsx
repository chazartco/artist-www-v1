import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Footer: React.FC = () => {
  const { about } = useData();
  
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram size={20} />;
      case 'twitter':
        return <Twitter size={20} />;
      case 'youtube':
        return <Youtube size={20} />;
      default:
        return null;
    }
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold">
              {about.name || 'Artist Portfolio'}
            </span>
            <div className="flex gap-3">
              {about.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400"
                  aria-label={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>

          <nav>
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-primary-500 transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/exhibitions" className="hover:text-primary-500 transition-colors">
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary-500 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-primary-500 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </nav>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} {about.name}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;