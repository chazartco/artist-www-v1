import { loadContent } from './storage';

const DEFAULT_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export const checkAuth = async (): Promise<boolean> => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const authenticate = async (password: string): Promise<{ success: boolean; isDefault: boolean }> => {
  const isAuthenticated = password === DEFAULT_PASSWORD;
  if (isAuthenticated) {
    localStorage.setItem('isAuthenticated', 'true');
  }
  return { success: isAuthenticated, isDefault: false };
};

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
};