import { Artwork, Exhibition, AboutData, ThemeData, ContentData } from '../types';

// Default data
const DEFAULT_ARTWORKS: Artwork[] = [];
const DEFAULT_EXHIBITIONS: Exhibition[] = [];
const DEFAULT_ABOUT: AboutData = {
  name: '',
  biography: '',
  profileImage: '',
  socialLinks: [],
  email: '',
  location: '',
  htmlContent: ''
};
const DEFAULT_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export const loadContent = async (): Promise<ContentData> => {
  try {
    const response = await fetch('/api/content');
    if (!response.ok) throw new Error('Failed to fetch content');
    const content = await response.json();
    return {
      ...content,
      adminPassword: content.adminPassword || DEFAULT_PASSWORD,
      password_changed: content.password_changed || false
    };
  } catch (error) {
    console.error('Error loading content:', error);
    return {
      artworks: DEFAULT_ARTWORKS,
      exhibitions: DEFAULT_EXHIBITIONS,
      about: DEFAULT_ABOUT,
      theme: null,
      adminPassword: DEFAULT_PASSWORD,
      password_changed: false
    };
  }
};

export const saveContent = async (content: ContentData): Promise<boolean> => {
  try {
    // Ensure we're not overwriting the password if it's not included
    if (!content.adminPassword) {
      const currentContent = await loadContent();
      content.adminPassword = currentContent.adminPassword;
      content.password_changed = currentContent.password_changed;
    }

    const response = await fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });
    
    if (!response.ok) throw new Error('Failed to save content');
    return true;
  } catch (error) {
    console.error('Error saving content:', error);
    return false;
  }
};

// API functions
export const loadArtworks = async (): Promise<Artwork[]> => {
  const content = await loadContent();
  return Array.isArray(content.artworks) ? content.artworks : DEFAULT_ARTWORKS;
};

export const saveArtworks = async (artworks: Artwork[]): Promise<void> => {
  const content = await loadContent();
  content.artworks = artworks;
  await saveContent(content);
};

export const loadExhibitions = async (): Promise<Exhibition[]> => {
  const content = await loadContent();
  return Array.isArray(content.exhibitions) ? content.exhibitions : DEFAULT_EXHIBITIONS;
};

export const saveExhibitions = async (exhibitions: Exhibition[]): Promise<void> => {
  const content = await loadContent();
  content.exhibitions = exhibitions;
  await saveContent(content);
};

export const loadAbout = async (): Promise<AboutData> => {
  const content = await loadContent();
  return content.about || DEFAULT_ABOUT;
};

export const saveAbout = async (about: AboutData): Promise<void> => {
  const content = await loadContent();
  content.about = about;
  await saveContent(content);
};

export const loadTheme = async (): Promise<ThemeData | null> => {
  const content = await loadContent();
  return content.theme;
};

export const saveTheme = async (theme: ThemeData): Promise<void> => {
  const content = await loadContent();
  content.theme = theme;
  await saveContent(content);
};

export const resetAllData = async (): Promise<void> => {
  const content = await loadContent();
  await saveContent({
    artworks: DEFAULT_ARTWORKS,
    exhibitions: DEFAULT_EXHIBITIONS,
    about: DEFAULT_ABOUT,
    theme: null,
    adminPassword: DEFAULT_PASSWORD,
    password_changed: false
  });
};