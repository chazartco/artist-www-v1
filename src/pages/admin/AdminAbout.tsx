import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useToast } from '../../contexts/ToastContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminAbout: React.FC = () => {
  const { about, updateAbout } = useData();
  const { showToast } = useToast();
  const [editedAbout, setEditedAbout] = useState({ ...about });
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialTitle, setNewSocialTitle] = useState('');
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedAbout({ ...editedAbout, [name]: value });
  };
  
  const handleEditorChange = (content: string) => {
    setEditedAbout({ ...editedAbout, htmlContent: content });
  };
  
  const addSocialLink = () => {
    if (newSocialPlatform && newSocialUrl && newSocialTitle) {
      setEditedAbout({
        ...editedAbout,
        socialLinks: [
          ...editedAbout.socialLinks,
          {
            platform: newSocialPlatform,
            url: newSocialUrl,
            title: newSocialTitle,
          },
        ],
      });
      setNewSocialPlatform('');
      setNewSocialUrl('');
      setNewSocialTitle('');
    }
  };
  
  const removeSocialLink = (index: number) => {
    setEditedAbout({
      ...editedAbout,
      socialLinks: editedAbout.socialLinks.filter((_, i) => i !== index),
    });
  };
  
  const handleSave = () => {
    updateAbout(editedAbout);
    showToast('About page updated successfully');
  };
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  return (
    <div className="admin-section">
      <h2 className="text-2xl font-semibold mb-6">About Page Content</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Artist Name</label>
          <input
            type="text"
            name="name"
            value={editedAbout.name}
            onChange={handleInputChange}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Profile Image URL</label>
          <input
            type="text"
            name="profileImage"
            value={editedAbout.profileImage}
            onChange={handleInputChange}
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={editedAbout.email}
            onChange={handleInputChange}
            className="input"
            placeholder="contact@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={editedAbout.location}
            onChange={handleInputChange}
            className="input"
            placeholder="City, Country"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Biography (Short)</label>
          <textarea
            name="biography"
            value={editedAbout.biography}
            onChange={handleInputChange}
            className="input"
            rows={3}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Social Links</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
          <input
            type="text"
            value={newSocialPlatform}
            onChange={(e) => setNewSocialPlatform(e.target.value)}
            className="input"
            placeholder="Platform (e.g., Instagram)"
          />
          <input
            type="text"
            value={newSocialUrl}
            onChange={(e) => setNewSocialUrl(e.target.value)}
            className="input"
            placeholder="URL"
          />
          <input
            type="text"
            value={newSocialTitle}
            onChange={(e) => setNewSocialTitle(e.target.value)}
            className="input"
            placeholder="Display Text"
          />
        </div>
        <button
          onClick={addSocialLink}
          disabled={!newSocialPlatform || !newSocialUrl || !newSocialTitle}
          className="btn btn-primary mb-4"
        >
          Add Social Link
        </button>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="p-2 text-left">Platform</th>
                <th className="p-2 text-left">Display Text</th>
                <th className="p-2 text-left">URL</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {editedAbout.socialLinks.map((link, index) => (
                <tr 
                  key={index} 
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="p-2">{link.platform}</td>
                  <td className="p-2">{link.title}</td>
                  <td className="p-2 truncate max-w-[200px]">
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary-500 hover:underline"
                    >
                      {link.url}
                    </a>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => removeSocialLink(index)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-error-500"
                    >
                      <X size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {editedAbout.socialLinks.length === 0 && (
            <div className="text-center py-3 text-gray-500">
              No social links added yet.
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">About Page Content</label>
        <div className="bg-white dark:bg-gray-900 rounded border dark:border-gray-700">
          <ReactQuill
            theme="snow"
            value={editedAbout.htmlContent}
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
          />
        </div>
      </div>
      
      <button
        onClick={handleSave}
        className="btn btn-primary flex items-center gap-2"
      >
        <Check size={18} />
        Save Changes
      </button>
    </div>
  );
};

export default AdminAbout;