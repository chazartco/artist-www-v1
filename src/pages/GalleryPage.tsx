import React, { useState } from 'react';
import ArtworkCard from '../components/ArtworkCard';
import { useData } from '../contexts/DataContext';
import { Search } from 'lucide-react';

const GalleryPage: React.FC = () => {
  const { artworks, about } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMedium, setFilterMedium] = useState('');
  
  // Get unique mediums for filter
  const mediums = Array.from(new Set(artworks.map((artwork) => artwork.medium)));
  
  // Filter artworks based on search and medium filter
  const filteredArtworks = artworks.filter((artwork) => {
    const matchesSearch = 
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMedium = filterMedium ? artwork.medium === filterMedium : true;
    
    return matchesSearch && matchesMedium;
  });

  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center tracking-tight mb-4">
          Gallery
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center">
          Explore a collection of original artworks by {about.name}
        </p>
      </div>
      
      <div className="mb-8 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10"
              placeholder="Search artworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:w-1/4">
            <select
              value={filterMedium}
              onChange={(e) => setFilterMedium(e.target.value)}
              className="input"
            >
              <option value="">All Mediums</option>
              {mediums.map((medium) => (
                <option key={medium} value={medium}>
                  {medium}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {filteredArtworks.length > 0 ? (
        <div className="artwork-grid">
          {filteredArtworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            No artworks found matching your search.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterMedium('');
            }}
            className="mt-4 btn btn-outline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;