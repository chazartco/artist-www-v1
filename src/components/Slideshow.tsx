import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import QRCode from 'react-qr-code';
import { Artwork } from '../types';

interface SlideshowProps {
  artworks: Artwork[];
  autoplayInterval?: number;
}

const Slideshow: React.FC<SlideshowProps> = ({ 
  artworks, 
  autoplayInterval = 15000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenControls, setShowFullscreenControls] = useState(true);
  const hideControlsTimeout = useRef<number | null>(null);

  const currentArtwork = artworks[currentIndex];

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
    document.body.style.overflow = !isFullscreen ? 'hidden' : '';
  }, [isFullscreen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const goToNext = useCallback(() => {
    if (isTransitioning || artworks.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % artworks.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [artworks.length, isTransitioning]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning || artworks.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + artworks.length) % artworks.length
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }, [artworks.length, isTransitioning]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrevious,
    trackMouse: false,
  });

  useEffect(() => {
    if (artworks.length <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [artworks.length, goToNext, autoplayInterval]);

  useEffect(() => {
    const preloadArtwork = (index: number) => {
      const artwork = artworks[index % artworks.length];
      if (!artwork) return;
      const img = new Image();
      img.src = artwork.imageUrl;
      img.fetchPriority = 'high';
      img.decoding = 'async';
      img.loading = 'eager';
    };

    preloadArtwork((currentIndex + 1) % artworks.length);
    preloadArtwork((currentIndex + 2) % artworks.length);
  }, [currentIndex, artworks]);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleMouseMove = () => {
      setShowFullscreenControls(true);
      if (hideControlsTimeout.current) {
        window.clearTimeout(hideControlsTimeout.current);
      }
      hideControlsTimeout.current = window.setTimeout(() => {
        setShowFullscreenControls(false);
      }, 5000);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideControlsTimeout.current) {
        window.clearTimeout(hideControlsTimeout.current);
      }
    };
  }, [isFullscreen]);

  if (!artworks.length) return null;

  return (
    <>
      <section className="relative h-[80vh] bg-black overflow-hidden" {...swipeHandlers}>
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center blur-md scale-105 opacity-70"
            style={{ backgroundImage: `url(${currentArtwork.imageUrl})` }}
          />
        </div>

        <div className="relative h-full flex items-center justify-center z-10">
          <img
            src={currentArtwork.imageUrl}
            alt={currentArtwork.title}
            className="h-full w-auto object-contain"
            fetchPriority="high"
            decoding="async"
            loading="eager"
          />

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
            <div
              className={`bg-zinc-900/30 backdrop-blur-md px-3 py-2 rounded-lg border border-zinc-700 transition-opacity duration-500 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="flex items-center justify-center text-center whitespace-nowrap overflow-hidden text-ellipsis">
                <span className="text-white text-sm font-bold truncate">
                  {currentArtwork.year}
                </span>
                <span className="mx-2 text-zinc-400">|</span>
                <Link
                  to={`/gallery/${currentArtwork.id}`}
                  className="text-white hover:text-primary-300 transition-colors text-sm font-medium truncate"
                >
                  {currentArtwork.title}
                </Link>
              </div>
            </div>
          </div>

          <button
            onClick={toggleFullscreen}
            className="absolute bottom-6 right-6 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="View in fullscreen"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>

        {artworks.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              disabled={isTransitioning}
              aria-label="Previous artwork"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              disabled={isTransitioning}
              aria-label="Next artwork"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
              {artworks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true);
                      setCurrentIndex(index);
                      setTimeout(() => setIsTransitioning(false), 500);
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-white"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to artwork ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {isFullscreen && (
        <div className={`fixed inset-0 bg-black z-50 flex items-center justify-center ${
          !showFullscreenControls ? "cursor-none" : ""
        }`}>
          <div className="relative w-full h-full">
            <div className="relative h-full w-full z-10">
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${currentArtwork.imageUrl})` }}
              />
            </div>

            <div className="absolute inset-0 z-0 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center blur-md scale-105 opacity-50"
                style={{ backgroundImage: `url(${currentArtwork.imageUrl})` }}
              />
            </div>

            <div className="absolute bottom-6 right-6 z-30 flex flex-col items-center">
              <div className="bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg mb-2 text-center">
                <span className="text-white text-xs font-bold block">
                  {currentArtwork.year}
                </span>
                <Link
                  to={`/gallery/${currentArtwork.id}`}
                  className="text-white hover:text-primary-300 transition-colors text-xs font-medium block"
                >
                  {currentArtwork.title}
                </Link>
              </div>

              {currentArtwork.nftLink && (
                <div className="bg-white p-2 rounded-lg">
                  <div className="w-24 h-24">
                    <QRCode
                      value={currentArtwork.nftLink}
                      size={96}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      viewBox="0 0 96 96"
                    />
                  </div>
                </div>
              )}
            </div>

            <div
              className={`transition-opacity duration-500 ease-in-out ${
                showFullscreenControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <button
                onClick={toggleFullscreen}
                className="absolute top-6 right-6 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                aria-label="Exit fullscreen"
              >
                <X className="h-6 w-6" />
              </button>

              {artworks.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                    disabled={isTransitioning}
                    aria-label="Previous artwork"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                    disabled={isTransitioning}
                    aria-label="Next artwork"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Slideshow;