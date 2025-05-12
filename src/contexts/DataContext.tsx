import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadArtworks, saveArtworks, loadExhibitions, saveExhibitions, loadAbout, saveAbout } from '../utils/storage';
import { Artwork, Exhibition, AboutData } from '../types';

type DataContextType = {
  artworks: Artwork[];
  exhibitions: Exhibition[];
  about: AboutData;
  addArtwork: (artwork: Omit<Artwork, 'id'>) => void;
  updateArtwork: (id: string, artwork: Partial<Artwork>) => void;
  deleteArtwork: (id: string) => void;
  addExhibition: (exhibition: Omit<Exhibition, 'id'>) => void;
  updateExhibition: (id: string, exhibition: Partial<Exhibition>) => void;
  deleteExhibition: (id: string) => void;
  updateAbout: (data: Partial<AboutData>) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [about, setAbout] = useState<AboutData>({
    name: '',
    biography: '',
    profileImage: '',
    socialLinks: []
  });

  useEffect(() => {
    const initializeData = async () => {
      try {
        const [artworksData, exhibitionsData, aboutData] = await Promise.all([
          loadArtworks(),
          loadExhibitions(),
          loadAbout()
        ]);
        setArtworks(artworksData);
        setExhibitions(exhibitionsData);
        setAbout(aboutData);
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };
    
    initializeData();
  }, []);

  useEffect(() => {
    saveArtworks(artworks);
  }, [artworks]);

  useEffect(() => {
    saveExhibitions(exhibitions);
  }, [exhibitions]);

  useEffect(() => {
    saveAbout(about);
  }, [about]);

  const addArtwork = (artwork: Omit<Artwork, 'id'>) => {
    const newArtwork: Artwork = {
      ...artwork,
      id: Date.now().toString(),
    };
    setArtworks((prev) => [...prev, newArtwork]);
  };

  const updateArtwork = (id: string, artwork: Partial<Artwork>) => {
    setArtworks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...artwork } : item))
    );
  };

  const deleteArtwork = (id: string) => {
    setArtworks((prev) => prev.filter((item) => item.id !== id));
  };

  const addExhibition = (exhibition: Omit<Exhibition, 'id'>) => {
    const newExhibition: Exhibition = {
      ...exhibition,
      id: Date.now().toString(),
    };
    setExhibitions((prev) => [...prev, newExhibition]);
  };

  const updateExhibition = (id: string, exhibition: Partial<Exhibition>) => {
    setExhibitions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...exhibition } : item))
    );
  };

  const deleteExhibition = (id: string) => {
    setExhibitions((prev) => prev.filter((item) => item.id !== id));
  };

  const updateAbout = (data: Partial<AboutData>) => {
    setAbout((prev) => ({ ...prev, ...data }));
  };

  return (
    <DataContext.Provider
      value={{
        artworks,
        exhibitions,
        about,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        addExhibition,
        updateExhibition,
        deleteExhibition,
        updateAbout,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};