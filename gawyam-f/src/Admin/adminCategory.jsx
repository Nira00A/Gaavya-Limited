import React, { useEffect, useState } from 'react';
import adminApi from '../axiosApi/adminApi';
import { toast } from 'react-toastify';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [editId, setEditId] = useState(null); 
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [isActive, setIsActive] = useState(true); 

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await adminApi.get('/categories');
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to load categories");
    }
  };

  const openAddModal = () => {
    setEditId(null);
    setName('');
    setIcon('');
    setIsActive(true);
    setIsFormOpen(true);
  };

  const openEditModal = (category) => {
    setEditId(category.id);
    setName(category.name);
    setIcon(category.icon);
    setIsActive(category.is_active !== false); 
    setIsFormOpen(true);
  };

  // (ADD OR EDIT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !icon) return toast.warning("Please enter a Name and an Emoji");

    setLoading(true);
    try {
      let result;
      
      if (editId) {
        // EDIT 
        result = await adminApi.put(`/categories/${editId}`, { name, icon, is_active: isActive });
      } else {
        // ADD 
        result = await adminApi.post('/categories', { name, icon, is_active: isActive });
      }

      if (result.data.success){
        setIsFormOpen(false);
        fetchCategories();
        toast.success(result.data.text || (editId ? "Category Updated" : "Category Added"));
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const result = await adminApi.delete(`/categories/${id}`);
      if(result.data.success){
        toast.success('Category deleted');
        fetchCategories();
      } else {
        toast.error('Error in deleting');
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Server Error');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Categories</h1>
      </div>

      {/* --- TOP ACTIONS --- */}
      <div className="mb-6">
        <button 
          onClick={openAddModal}
          className="max-[650px]:text-base bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-sm font-medium flex items-center gap-2 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New category
        </button>
      </div>

      {/* (ADD / EDIT) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 animate-fade-in">
            <h2 className="text-lg font-bold mb-4 border-b pb-2 text-gray-800">
              {editId ? 'Edit Category' : 'Create New Category'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Wallpapers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  autoFocus
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="🖼️"
                    maxLength={2}
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-16 text-center text-xl p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <span className="text-xs text-gray-400 self-center">Use Win + . for emojis</span>
                </div>
              </div>

              {/* Active Toggle (Only show on Edit, or default true on Add) */}
              <div className="flex items-center gap-2">
                 <input 
                    type="checkbox" 
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                 />
                 <label htmlFor="isActive" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                    Is Active?
                 </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (editId ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DATA TABLE */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden select-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="p-4">Name</th>
              <th className="p-4">Icon</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition duration-150">
                
                {/* Name */}
                <td className="p-4 font-medium text-gray-800 max-[650px]:text-sm">
                  {cat.name}
                </td>

                {/* Icon */}
                <td className="p-4 text-xl">
                  {cat.icon}
                </td>

                {/* Status (Rounded Badge) */}
                <td className="p-4 text-center">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full  ${
                      cat.is_active !== false 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>
                    {cat.is_active !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 text-right">
                  <div className="inline-flex gap-2">
                    {/* Edit Button (Opens Modal) */}
                    <button 
                      onClick={() => openEditModal(cat)}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition shadow-sm"
                      title="Edit"
                    >
                      <svg className="w-4 h-4 max-[650px]:w-3 max-[650px]:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition shadow-sm"
                      title="Delete"
                    >
                      <svg className="w-4 h-4 max-[650px]:w-3 max-[650px]:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </td>

              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  No categories found. Click "New category" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- FOOTER ACTIONS --- */}
      <div className="mt-6 flex justify-between items-center">
        <button 
            onClick={openAddModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-sm font-medium flex items-center gap-2 text-sm transition"
        >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
            New category
        </button>
        
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm shadow-sm transition">
            Sort alphabetically
        </button>
      </div>

    </div>
  );
}

export default CategoryManager;