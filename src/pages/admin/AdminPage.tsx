import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Image, Calendar, User, Settings, LogOut } from 'lucide-react';
import { logout } from '../../utils/auth';
import { useToast } from '../../contexts/ToastContext';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    navigate('/');
    showToast('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
        
        <nav className="admin-nav">
          <NavLink to="/admin/gallery" className={({ isActive }) => 
            `admin-nav-item flex items-center gap-2 ${isActive ? 'active' : ''}`
          }>
            <Image size={18} />
            Gallery
          </NavLink>
          <NavLink to="/admin/exhibitions" className={({ isActive }) => 
            `admin-nav-item flex items-center gap-2 ${isActive ? 'active' : ''}`
          }>
            <Calendar size={18} />
            Exhibitions
          </NavLink>
          <NavLink to="/admin/about" className={({ isActive }) => 
            `admin-nav-item flex items-center gap-2 ${isActive ? 'active' : ''}`
          }>
            <User size={18} />
            About
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => 
            `admin-nav-item flex items-center gap-2 ${isActive ? 'active' : ''}`
          }>
            <Settings size={18} />
            Settings
          </NavLink>
        </nav>
        
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;