import React, { useState } from 'react';
import { Edit, Trash2, Plus, Check, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import { Exhibition } from '../../types';

const AdminExhibitions: React.FC = () => {
  const { exhibitions, addExhibition, updateExhibition, deleteExhibition } = useData();
  const { showToast } = useToast();
  const [editingExhibition, setEditingExhibition] = useState<Exhibition | null>(null);
  const [isAddingExhibition, setIsAddingExhibition] = useState(false);
  const [newExhibition, setNewExhibition] = useState<Omit<Exhibition, 'id'>>({
    title: '',
    location: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    images: [],
    featured: false,
    status: 'upcoming',
  });
  
  const [newImageUrl, setNewImageUrl] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  
  const addImageToNew = () => {
    if (newImageUrl.trim()) {
      setNewExhibition({
        ...newExhibition,
        images: [...newExhibition.images, newImageUrl],
      });
      setNewImageUrl('');
    }
  };
  
  const removeImageFromNew = (index: number) => {
    setNewExhibition({
      ...newExhibition,
      images: newExhibition.images.filter((_, i) => i !== index),
    });
  };
  
  const addImageToEdit = () => {
    if (editImageUrl.trim() && editingExhibition) {
      setEditingExhibition({
        ...editingExhibition,
        images: [...editingExhibition.images, editImageUrl],
      });
      setEditImageUrl('');
    }
  };
  
  const removeImageFromEdit = (index: number) => {
    if (editingExhibition) {
      setEditingExhibition({
        ...editingExhibition,
        images: editingExhibition.images.filter((_, i) => i !== index),
      });
    }
  };
  
  const handleAddExhibition = () => {
    addExhibition(newExhibition);
    setNewExhibition({
      title: '',
      location: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      images: [],
      featured: false,
      status: 'upcoming',
    });
    setIsAddingExhibition(false);
    showToast('Exhibition added successfully');
  };
  
  const handleUpdateExhibition = () => {
    if (editingExhibition) {
      updateExhibition(editingExhibition.id, editingExhibition);
      setEditingExhibition(null);
      showToast('Exhibition updated successfully');
    }
  };
  
  const handleDeleteExhibition = (id: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm('Are you sure you want to delete this exhibition?')) {
      deleteExhibition(id);
      showToast('Exhibition deleted successfully');
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    isEditing: boolean
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    if (isEditing && editingExhibition) {
      setEditingExhibition({
        ...editingExhibition,
        [name]: type === 'checkbox' ? checked : value,
      });
    } else {
      setNewExhibition({
        ...newExhibition,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  return (
    <div className="admin-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Exhibitions</h2>
        <button
          onClick={() => setIsAddingExhibition(!isAddingExhibition)}
          className="btn btn-primary flex items-center gap-2"
        >
          {isAddingExhibition ? (
            <>
              <X size={18} />
              Cancel
            </>
          ) : (
            <>
              <Plus size={18} />
              Add Exhibition
            </>
          )}
        </button>
      </div>
      
      {isAddingExhibition && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Add New Exhibition</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={newExhibition.title}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={newExhibition.location}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={newExhibition.startDate}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={newExhibition.endDate}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={newExhibition.status}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
              >
                <option value="upcoming">Upcoming</option>
                <option value="current">Current</option>
                <option value="past">Past</option>
              </select>
            </div>
            <div className="flex items-center self-end">
              <input
                type="checkbox"
                id="new-exhibition-featured"
                name="featured"
                checked={newExhibition.featured}
                onChange={(e) => handleInputChange(e, false)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="new-exhibition-featured" className="text-sm font-medium">
                Featured
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={newExhibition.description}
                onChange={(e) => handleInputChange(e, false)}
                className="input"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Images</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="input flex-grow"
                  placeholder="Enter image URL..."
                />
                <button
                  onClick={addImageToNew}
                  disabled={!newImageUrl.trim()}
                  className="btn btn-primary whitespace-nowrap"
                >
                  Add Image
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {newExhibition.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Exhibition ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      onClick={() => removeImageFromNew(index)}
                      className="absolute top-1 right-1 bg-error-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleAddExhibition}
              className="btn btn-primary flex items-center gap-2"
              disabled={!newExhibition.title || !newExhibition.location}
            >
              <Check size={18} />
              Save Exhibition
            </button>
            <button
              onClick={() => setIsAddingExhibition(false)}
              className="btn btn-outline flex items-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {editingExhibition && (
        <div className="mb-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Edit Exhibition</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={editingExhibition.title}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={editingExhibition.location}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={editingExhibition.startDate.split('T')[0]}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={editingExhibition.endDate.split('T')[0]}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={editingExhibition.status}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
              >
                <option value="upcoming">Upcoming</option>
                <option value="current">Current</option>
                <option value="past">Past</option>
              </select>
            </div>
            <div className="flex items-center self-end">
              <input
                type="checkbox"
                id="edit-exhibition-featured"
                name="featured"
                checked={editingExhibition.featured}
                onChange={(e) => handleInputChange(e, true)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="edit-exhibition-featured" className="text-sm font-medium">
                Featured
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={editingExhibition.description}
                onChange={(e) => handleInputChange(e, true)}
                className="input"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Images</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="input flex-grow"
                  placeholder="Enter image URL..."
                />
                <button
                  onClick={addImageToEdit}
                  disabled={!editImageUrl.trim()}
                  className="btn btn-primary whitespace-nowrap"
                >
                  Add Image
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {editingExhibition.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Exhibition ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      onClick={() => removeImageFromEdit(index)}
                      className="absolute top-1 right-1 bg-error-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleUpdateExhibition}
              className="btn btn-primary flex items-center gap-2"
            >
              <Check size={18} />
              Update Exhibition
            </button>
            <button
              onClick={() => setEditingExhibition(null)}
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
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Date Range</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Images</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exhibitions.map((exhibition) => (
              <tr 
                key={exhibition.id} 
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="p-3 font-medium">{exhibition.title}</td>
                <td className="p-3">{exhibition.location}</td>
                <td className="p-3">
                  {new Date(exhibition.startDate).toLocaleDateString()} - 
                  {new Date(exhibition.endDate).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span 
                    className={`text-xs px-2 py-1 rounded text-white ${
                      exhibition.status === 'upcoming' 
                        ? 'bg-accent-500' 
                        : exhibition.status === 'current' 
                          ? 'bg-secondary-500' 
                          : 'bg-gray-500'
                    }`}
                  >
                    {exhibition.status.charAt(0).toUpperCase() + exhibition.status.slice(1)}
                  </span>
                </td>
                <td className="p-3">{exhibition.images.length}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingExhibition(exhibition)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                      aria-label="Edit exhibition"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteExhibition(exhibition.id)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-error-500"
                      aria-label="Delete exhibition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {exhibitions.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No exhibitions found. Add your first exhibition using the button above.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminExhibitions;