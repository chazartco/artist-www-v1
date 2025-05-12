import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const ArtworkViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { artworks } = useData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [id]);

  if (!id) {
    navigate('/gallery');
    return null;
  }

  const artwork = artworks.find((a) => a.id === id);
  
  if (!artwork && !loading) {
    navigate('/gallery');
    return null;
  }

  const currentIndex = artworks.findIndex((a) => a.id === id);
  const hasNext = currentIndex < artworks.length - 1;
  const hasPrev = currentIndex > 0;
  
  const goToNext = () => {
    if (hasNext) {
      navigate(`/gallery/${artworks[currentIndex + 1].id}`);
    }
  };
  
  const goToPrev = () => {
    if (hasPrev) {
      navigate(`/gallery/${artworks[currentIndex - 1].id}`);
    }
  };

  const closeViewer = () => {
    navigate('/gallery');
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeViewer();
      } else if (e.key === 'ArrowRight') {
        if (hasNext) goToNext();
      } else if (e.key === 'ArrowLeft') {
        if (hasPrev) goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, artworks]);

  if (loading) {
    return (
      <div className="image-viewer-backdrop">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="image-viewer-backdrop animate-fade-in">
      <div className="image-viewer-content animate-slide-up">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">{artwork?.title}</h2>
          <button 
            onClick={closeViewer}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Close viewer"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="relative">
          <img 
            src={artwork?.imageUrl} 
            alt={artwork?.title} 
            className="image-viewer-img p-4" 
          />
          
          {hasPrev && (
            <button 
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              aria-label="Previous artwork"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          {hasNext && (
            <button 
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
              aria-label="Next artwork"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span>{artwork?.medium}</span>
            <span>•</span>
            <span>{artwork?.year}</span>
            <span>•</span>
            <span>{artwork?.dimensions}</span>
          </div>
          
          <p className="mb-4">{artwork?.description}</p>
          
          {artwork?.nftLink && (
            <a
              href={artwork.nftLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-500 hover:text-primary-600 font-medium"
            >
              <ExternalLink size={16} className="mr-2" />
              View on marketplace
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkViewer;