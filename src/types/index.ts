export interface Artwork {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  displayUrl?: string;
  year: string;
  medium: string;
  dimensions: string;
  nftLink?: string;
  featured: boolean;
}

export interface Exhibition {
  id: string;
  title: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string; 
  images: string[];
  featured: boolean;
  status: 'upcoming' | 'current' | 'past';
}

export interface SocialLink {
  platform: string;
  url: string;
  title: string;
}

export interface AboutData {
  name: string;
  biography: string;
  profileImage: string;
  socialLinks: SocialLink[];
  htmlContent: string;
  email: string;
  location: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ThemeData {
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface ContentData {
  artworks: Artwork[];
  exhibitions: Exhibition[];
  about: AboutData;
  theme: ThemeData | null;
  adminPassword: string;
  password_changed?: boolean;
}