import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDark, toggleDarkMode } = useTheme();
  const { about } = useData();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md h-14'
          : 'bg-gray-100 dark:bg-gray-800 h-16'
      }`}
    >
      <div className="container mx-auto h-full relative flex items-center justify-between px-4">
        <Link
          to="/"
          className="font-sans text-lg hover:text-primary-500 transition-colors"
        >
          {about.name || 'Artist Portfolio'}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center space-x-1">
          <NavLink to="/" className="nav-link px-4 py-2 rounded-full text-sm" end>
            Home
          </NavLink>
          <NavLink to="/gallery" className="nav-link px-4 py-2 rounded-full text-sm">
            Gallery
          </NavLink>
          <NavLink to="/exhibitions" className="nav-link px-4 py-2 rounded-full text-sm">
            Exhibitions
          </NavLink>
          <NavLink to="/about" className="nav-link px-4 py-2 rounded-full text-sm">
            About
          </NavLink>
          <NavLink to="/contact" className="nav-link px-4 py-2 rounded-full text-sm">
            Contact
          </NavLink>
        </nav>

        {/* Theme Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-gray-100/95 dark:bg-gray-800/95 backdrop-blur-sm transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="font-sans text-xl" onClick={closeMenu}>
              {about.name || 'Artist Portfolio'}
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex flex-col space-y-2">
            <NavLink
              to="/"
              className="text-lg py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={closeMenu}
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/gallery"
              className="text-lg py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={closeMenu}
            >
              Gallery
            </NavLink>
            <NavLink
              to="/exhibitions"
              className="text-lg py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={closeMenu}
            >
              Exhibitions
            </NavLink>
            <NavLink
              to="/about"
              className="text-lg py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={closeMenu}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className="text-lg py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={closeMenu}
            >
              Contact
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;