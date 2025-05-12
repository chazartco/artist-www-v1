import React, { useState, useEffect } from 'react';
import { Check, Save, Lock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { HexColorPicker } from 'react-colorful';
import { loadContent, saveContent } from '../../utils/storage';

const ColorPicker = ({ color, onChange, label }: { color: string; onChange: (color: string) => void; label: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded border border-gray-300 dark:border-gray-700"
          style={{ backgroundColor: color }}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="input w-32"
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-2">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-20">
            <HexColorPicker color={color} onChange={onChange} />
          </div>
        </div>
      )}
    </div>
  );
};

const AdminSettings: React.FC = () => {
  const { isDark, toggleDarkMode, colors, updateColors } = useTheme();
  const { showToast } = useToast();
  const [newColors, setNewColors] = useState({ ...colors });
  const [jsonContent, setJsonContent] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const loadJsonContent = async () => {
      const content = await loadContent();
      setJsonContent(JSON.stringify(content, null, 2));
    };
    loadJsonContent();
  }, []);

  const handleColorChange = (colorKey: string, value: string) => {
    setNewColors({ ...newColors, [colorKey]: value });
    // Update colors in real-time
    updateColors({ [colorKey]: value });
  };
  
  const resetColors = () => {
    const defaultColors = {
      primary: '#6366f1',
      secondary: '#14b8a6',
      accent: '#f59e0b'
    };
    setNewColors(defaultColors);
    updateColors(defaultColors);
    showToast('Colors reset to default');
  };

  const handleSaveJson = async () => {
    try {
      const content = JSON.parse(jsonContent);
      await saveContent(content);
      showToast('Content saved successfully');
    } catch (error) {
      showToast('Invalid JSON format');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters');
      return;
    }

    try {
      const content = await loadContent();
      if (oldPassword !== content.adminPassword) {
        showToast('Current password is incorrect');
        return;
      }

      content.adminPassword = newPassword;
      await saveContent(content);
      showToast('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      showToast('Failed to change password');
    }
  };

  return (
    <div className="space-y-8">
      <div className="admin-section">
        <h2 className="text-2xl font-semibold mb-6">Theme Settings</h2>
        
        <div className="flex items-center mb-6">
          <span className="mr-4">Dark Mode:</span>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors ${
              isDark ? 'bg-primary-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                isDark ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <ColorPicker
            color={newColors.primary}
            onChange={(color) => handleColorChange('primary', color)}
            label="Primary Color"
          />
          <ColorPicker
            color={newColors.secondary}
            onChange={(color) => handleColorChange('secondary', color)}
            label="Secondary Color"
          />
          <ColorPicker
            color={newColors.accent}
            onChange={(color) => handleColorChange('accent', color)}
            label="Accent Color"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => updateColors(newColors)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Check size={18} />
            Save Theme Settings
          </button>
          <button
            onClick={resetColors}
            className="btn btn-outline"
          >
            Reset Colors
          </button>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="text-2xl font-semibold mb-6">Content JSON Editor</h2>
        <div className="mb-4">
          <textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            className="input font-mono text-sm h-96"
            spellCheck={false}
          />
        </div>
        <button
          onClick={handleSaveJson}
          className="btn btn-primary flex items-center gap-2"
        >
          <Save size={18} />
          Save Content
        </button>
      </div>

      <div className="admin-section">
        <h2 className="text-2xl font-semibold mb-6">Change Password</h2>
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
            />
          </div>
          <button
            onClick={handlePasswordChange}
            className="btn btn-primary flex items-center gap-2"
          >
            <Lock size={18} />
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;