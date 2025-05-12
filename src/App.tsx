import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import ExhibitionsPage from './pages/ExhibitionsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/admin/AdminPage';
import AdminGallery from './pages/admin/AdminGallery';
import AdminExhibitions from './pages/admin/AdminExhibitions';
import AdminAbout from './pages/admin/AdminAbout';
import AdminSettings from './pages/admin/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';
import ArtworkDetail from './components/ArtworkDetail';

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="gallery/:id" element={<ArtworkDetail />} />
                <Route path="exhibitions" element={<ExhibitionsPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                
                <Route path="admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>}>
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="exhibitions" element={<AdminExhibitions />} />
                  <Route path="about" element={<AdminAbout />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </ToastProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;