import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const ArtworkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { artworks } = useData();
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const artwork = artworks.find(a => a.id === id);

  useEffect(() => {
    if (!artwork) {
      navigate('/gallery');
    }
  }, [artwork, navigate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  };

  const formatDimensions = (dimensions: any) => {
    if (typeof dimensions === 'string') {
      return dimensions;
    }
    if (typeof dimensions === 'object' && dimensions?.artifact?.dimensions) {
      const { width, height } = dimensions.artifact.dimensions;
      return `${width} x ${height}`;
    }
    return null;
  };

  if (!artwork) return null;

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/gallery"
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-500 mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div 
            ref={imageRef}
            className={`relative overflow-hidden bg-black rounded-lg ${
              isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <div 
              className={`transition-transform duration-200 ${
                isZoomed ? 'scale-200' : 'scale-100'
              }`}
              style={{
                transformOrigin: `${position.x}% ${position.y}%`
              }}
            >
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-auto"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {artwork.year} • {artwork.medium}
              </p>
            </div>

            <div className="prose dark:prose-invert">
              <p className="whitespace-pre-line">{artwork.description}</p>
            </div>

            <div className="space-y-2">
              {artwork.dimensions && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Dimensions:</span> {formatDimensions(artwork.dimensions)}
                </p>
              )}
              {artwork.nftLink && (
                <a
                  href={artwork.nftLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-500 hover:text-primary-600"
                >
                  <ExternalLink size={16} className="mr-2" />
                  View on marketplace
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;