import React, { useState } from 'react';
import { Edit, Trash2, Plus, Check, X, Search, Loader2 } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { Artwork } from '../../types';
import { fetchObjktData } from '../../utils/objktApi';

const AdminGallery: React.FC = () => {
  const { artworks, addArtwork, updateArtwork, deleteArtwork } = useData();
  const { showToast } = useToast();
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  const [isAddingArtwork, setIsAddingArtwork] = useState(false);
  const [isLoadingObjkt, setIsLoadingObjkt] = useState(false);
  const [objktUrl, setObjktUrl] = useState('');
  const [newArtwork, setNewArtwork] = useState<Omit<Artwork, 'id'>>({
    title: '',
    description: '',
    imageUrl: '',
    displayUrl: '',
    year: '',
    medium: '',
    dimensions: '',
    nftLink: '',
    featured: false,
  });
  
  const handleFetchObjkt = async () => {
    if (!objktUrl) {
      showToast('Please enter an OBJKT URL');
      return;
    }

    setIsLoadingObjkt(true);
    try {
      const data = await fetchObjktData(objktUrl);
      if (data) {
        setNewArtwork({
          ...data,
          medium: 'Digital', // Default to Digital
        });
        showToast('NFT data loaded successfully');
      } else {
        showToast('Invalid OBJKT URL or failed to load NFT data');
      }
    } catch (error) {
      showToast('Error fetching NFT data');
    } finally {
      setIsLoadingObjkt(false);
    }
  };

  const handleAddArtwork = () => {
    addArtwork(newArtwork);
    setNewArtwork({
      title: '',
      description: '',
      imageUrl: '',
      displayUrl: '',
      year: '',
      medium: '',
      dimensions: '',
      nftLink: '',
      featured: false,
    });
    setObjktUrl('');
    setIsAddingArtwork(false);
    showToast('Artwork added successfully');
  };
  
  const handleUpdateArtwork = () => {
    if (editingArtwork) {
      updateArtwork(editingArtwork.id, editingArtwork);
      setEditingArtwork(null);
      showToast('Artwork updated successfully');
    }
  };
  
  const handleDeleteArtwork = (id: string) => {
    if (confirm('Are you sure you want to delete this artwork?')) {
      deleteArtwork(id);
      showToast('Artwork deleted successfully');
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isEditing: boolean
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (isEditing && editingArtwork) {
      setEditingArtwork({
        ...editingArtwork,
        [name]: type === 'checkbox' ? checked : value,
      });
    } else {
      setNewArtwork({
        ...newArtwork,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  return (
    <div className="admin-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Gallery</h2>
        <button
          onClick={() => setIsAddingArtwork(!isAddingArtwork)}
          className="btn btn-primary flex items-center gap-2"
        >
          {isAddingArtwork ? (
            <>
              <X size={18} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={18} />
              Add Artwork
            </>
          )}
        </button>
      </div>
      
      {isAddingArtwork && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Add New Artwork</h3>

          <div className="mb-6 p-4 bg-white dark:bg-gray-900 rounded-lg">
            <h4 className="text-lg font-medium mb-3">Import from OBJKT</h4>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">OBJKT URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={objktUrl}
                  onChange={(e) => setObjktUrl(e.target.value)}
                  className="input flex-grow"
                  placeholder="https://objkt.com/tokens/KT1.../1"
                />
                <button
                  onClick={handleFetchObjkt}
                  disabled={isLoadingObjkt || !objktUrl}
                  className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
                >
                  {isLoadingObjkt ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      Fetch NFT Data
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={newArtwork.title}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="text"
                name="imageUrl"
                value={newArtwork.imageUrl}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
                required
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display URL (Optional)</label>
              <input
                type="text"
                name="displayUrl"
                value={newArtwork.displayUrl}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
                placeholder="https://example.com/display.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <input
                type="text"
                name="year"
                value={newArtwork.year}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Medium</label>
              <input
                type="text"
                name="medium"
                value={newArtwork.medium}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dimensions</label>
              <input
                type="text"
                name="dimensions"
                value={newArtwork.dimensions}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NFT Link (Optional)</label>
              <input
                type="text"
                name="nftLink"
                value={newArtwork.nftLink}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
                placeholder="https://objkt.com/..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={newArtwork.description}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
                rows={3}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="new-featured"
                name="featured"
                checked={newArtwork.featured}
                onChange={(e) => handleInputChange(e, false)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="new-featured" className="text-sm font-medium">
                Featured on homepage
              </label>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleAddArtwork}
              className="btn btn-primary flex items-center gap-2"
              disabled={!newArtwork.title || !newArtwork.imageUrl}
            >
              <Check size={18} />
              Save Artwork
            </button>
            <button
              onClick={() => setIsAddingArtwork(false)}
              className="btn btn-outline flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {editingArtwork && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Edit Artwork</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={editingArtwork.title}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="text"
                name="imageUrl"
                value={editingArtwork.imageUrl}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display URL (Optional)</label>
              <input
                type="text"
                name="displayUrl"
                value={editingArtwork.displayUrl}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
                placeholder="https://example.com/display.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <input
                type="text"
                name="year"
                value={editingArtwork.year}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Medium</label>
              <input
                type="text"
                name="medium"
                value={editingArtwork.medium}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dimensions</label>
              <input
                type="text"
                name="dimensions"
                value={editingArtwork.dimensions}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NFT Link (Optional)</label>
              <input
                type="text"
                name="nftLink"
                value={editingArtwork.nftLink}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={editingArtwork.description}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
                rows={3}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="edit-featured"
                name="featured"
                checked={editingArtwork.featured}
                onChange={(e) => handleInputChange(e, true)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="edit-featured" className="text-sm font-medium">
                Featured on homepage
              </label>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleUpdateArtwork}
              className="btn btn-primary flex items-center gap-2"
            >
              <Check size={18} />
              Update Artwork
            </button>
            <button
              onClick={() => setEditingArtwork(null)}
              className="btn btn-outline flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Medium</th>
              <th className="p-3 text-left">Year</th>
              <th className="p-3 text-left">Featured</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artworks.map((artwork) => (
              <tr 
                key={artwork.id} 
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="p-3">
                  <div className="w-16 h-16 rounded overflow-hidden">
                    <img
                      src={artwork.displayUrl || artwork.imageUrl}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="p-3 font-medium">{artwork.title}</td>
                <td className="p-3">{artwork.medium}</td>
                <td className="p-3">{artwork.year}</td>
                <td className="p-3">
                  {artwork.featured ? (
                    <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  ) : (
                    <span className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded">
                      No
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingArtwork(artwork)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                      aria-label="Edit artwork"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteArtwork(artwork.id)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-error-500"
                      aria-label="Delete artwork"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {artworks.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No artworks found. Add your first artwork using the button above.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;