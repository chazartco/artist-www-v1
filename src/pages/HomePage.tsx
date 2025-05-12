import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Image, Calendar, User, Instagram, Twitter, Youtube } from 'lucide-react';
import Slideshow from '../components/Slideshow';
import { useData } from '../contexts/DataContext';

const HomePage: React.FC = () => {
  const { artworks, about } = useData();
  
  // Get featured artworks for slideshow
  const featuredArtworks = artworks.filter(artwork => artwork.featured);

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
    <div className="pt-16">
      <Slideshow artworks={featuredArtworks} />
      
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            {about.name}
          </h1>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
            {about.biography}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/gallery" className="btn btn-primary">
              View Gallery
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
      
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 tracking-tight">
          Explore
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/gallery" className="group">
            <div className="card h-full hover:translate-y-[-4px] transition-transform">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-full mb-4">
                  <Image className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Artwork Gallery</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Explore a collection of original artworks across various mediums.
                </p>
                <span className="mt-auto inline-flex items-center text-primary-500 group-hover:text-primary-600">
                  Browse Gallery <ArrowRight size={16} className="ml-1 group-hover:ml-2 transition-all" />
                </span>
              </div>
            </div>
          </Link>
          
          <Link to="/exhibitions" className="group">
            <div className="card h-full hover:translate-y-[-4px] transition-transform">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="bg-secondary-100 dark:bg-secondary-900/30 p-4 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-secondary-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Exhibitions</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  View upcoming, current, and past exhibitions featuring the artist's work.
                </p>
                <span className="mt-auto inline-flex items-center text-secondary-500 group-hover:text-secondary-600">
                  View Exhibitions <ArrowRight size={16} className="ml-1 group-hover:ml-2 transition-all" />
                </span>
              </div>
            </div>
          </Link>
          
          <Link to="/about" className="group">
            <div className="card h-full hover:translate-y-[-4px] transition-transform">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="bg-accent-100 dark:bg-accent-900/30 p-4 rounded-full mb-4">
                  <User className="h-8 w-8 text-accent-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">About the Artist</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Learn more about the artist's background, inspiration, and creative process.
                </p>
                <span className="mt-auto inline-flex items-center text-accent-500 group-hover:text-accent-600">
                  Learn More <ArrowRight size={16} className="ml-1 group-hover:ml-2 transition-all" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>
      
      <section className="bg-gray-50 dark:bg-gray-800 py-16 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Connect Online
              </h2>
              <p className="text-lg mb-6 text-gray-600 dark:text-gray-300">
                Follow on social media for the latest updates, behind-the-scenes content, and more.
              </p>
              <div className="flex gap-4">
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
            <div className="w-full md:w-1/2 md:pl-8">
              <div className="aspect-square max-w-xs mx-auto overflow-hidden rounded-full">
                <img
                  src={about.profileImage}
                  alt={about.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;