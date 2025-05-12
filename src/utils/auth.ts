import { loadContent, saveContent } from './storage';

const DEFAULT_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export const checkAuth = async (): Promise<boolean> => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) return false;

  const content = await loadContent();
  
  // If password has been changed, use the stored password
  if (content.password_changed && content.adminPassword) {
    return true;
  }
  
  // If still using default password, force logout
  if (!content.password_changed && content.adminPassword === DEFAULT_PASSWORD) {
    logout();
    return false;
  }
  
  return true;
};

export const authenticate = async (password: string): Promise<{ success: boolean; isDefault: boolean }> => {
  const content = await loadContent();
  
  // If password has been changed, use the stored password
  if (content.password_changed && content.adminPassword) {
    const isAuthenticated = password === content.adminPassword;
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
    }
    return { success: isAuthenticated, isDefault: false };
  }
  
  // Otherwise, use default password
  const isAuthenticated = password === DEFAULT_PASSWORD;
  const isDefault = true;
  
  if (isAuthenticated) {
    if (!isDefault) {
      localStorage.setItem('isAuthenticated', 'true');
    }
  }
  
  return { success: isAuthenticated, isDefault };
};

export const changePassword = async (newPassword: string): Promise<boolean> => {
  try {
    const content = await loadContent();
    content.adminPassword = newPassword;
    content.password_changed = true;
    await saveContent(content);
    localStorage.setItem('isAuthenticated', 'true');
    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    return false;
  }
};

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
};