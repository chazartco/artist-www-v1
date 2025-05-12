import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Artwork } from '../types';

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  return (
    <div className="artwork-card animate-fade-in">
      <Link to={`/gallery/${artwork.id}`} className="block">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={artwork.displayUrl || artwork.imageUrl}
            alt={artwork.title}
            className="artwork-image"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-1">{artwork.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {artwork.medium}, {artwork.year}
          </p>
          <p className="text-sm line-clamp-2 text-gray-500 dark:text-gray-400 mb-3">
            {artwork.description}
          </p>
          {artwork.nftLink && (
            <a
              href={artwork.nftLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-primary-500 hover:text-primary-600"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} className="mr-1" />
              View on marketplace
            </a>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ArtworkCard