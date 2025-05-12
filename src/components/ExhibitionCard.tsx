import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Exhibition } from '../types';

interface ExhibitionCardProps {
  exhibition: Exhibition;
}

const ExhibitionCard: React.FC<ExhibitionCardProps> = ({ exhibition }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const getStatusClass = () => {
    switch (exhibition.status) {
      case 'upcoming':
        return 'bg-accent-500';
      case 'current':
        return 'bg-secondary-500';
      case 'past':
        return 'bg-gray-500';
    }
  };
  
  const getStatusText = () => {
    switch (exhibition.status) {
      case 'upcoming':
        return 'Upcoming';
      case 'current':
        return 'Current';
      case 'past':
        return 'Past';
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <>
      <div className={`exhibition-item ${
        exhibition.status === 'upcoming' 
          ? 'upcoming-exhibition' 
          : exhibition.status === 'current' 
            ? 'current-exhibition' 
            : 'past-exhibition'
      }`}>
        <div className="flex gap-4 flex-col md:flex-row">
          {exhibition.images.length > 0 && (
            <div 
              className="w-full md:w-1/3 aspect-square overflow-hidden rounded-lg cursor-pointer"
              onClick={() => handleImageClick(exhibition.images[0])}
            >
              <img
                src={exhibition.images[0]}
                alt={exhibition.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="w-full md:w-2/3">
            <div className="flex items-center gap-2 mb-2">
              <span 
                className={`text-xs px-2 py-1 rounded text-white ${getStatusClass()}`}
              >
                {getStatusText()}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-2">{exhibition.title}</h3>
            <p className="text-sm mb-3">{exhibition.location}</p>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
              <Calendar size={16} className="mr-2" />
              <span>
                {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {exhibition.description}
            </p>
            
            {exhibition.images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {exhibition.images.slice(1).map((image, index) => (
                  <div 
                    key={index} 
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  >
                    <img
                      src={image}
                      alt={`${exhibition.title} ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>
          <div className="h-full flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Exhibition detail"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ExhibitionCard;