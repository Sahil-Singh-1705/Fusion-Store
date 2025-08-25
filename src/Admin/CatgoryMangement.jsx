import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FolderEdit, Pencil, Save, Trash2, X, Cog } from 'lucide-react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', image: null });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const startEdit = (cat) => {
    setEditingCategory(cat);
    setEditForm({ name: cat.name, description: cat.description, image: null });
    setMessage('');
    setError('');
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditForm({ name: '', description: '', image: null });
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      await axios.put(
        `http://localhost:3000/api/categories/${editingCategory.id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      setMessage('Category updated successfully');
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  return (
    <div className="p-4 text-black">
      <h2 className="text-2xl font-bold mb-4 text-yellow-500 flex items-center gap-1">
        <Cog size={28} className="bg-pink-950 rounded border-2" /> Category Management:
      </h2>

      {!editingCategory && (
        <table className="min-w-full border rounded overflow-hidden mb-6">
          <thead className="bg-yellow-200">
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Image</th>
              <th className="py-2 px-4 border">Count</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td className="py-2 px-4 border bg-green-100">{cat.id}</td>
                <td className="py-2 px-4 border bg-teal-100">{cat.name}</td>
                <td className="py-2 px-4 border bg-teal-100">{cat.description}</td>
                <td className="py-2 px-4 border bg-blue-100">
                  <img src={`http://localhost:3000/${cat.image}`} alt="Category" className="w-20 h-15 object-cover rounded" />
                </td>
                <td className="py-2 px-4 border bg-pink-100 text-center">{cat.product_count}</td>
                <td className="py-2 px-4 border bg-orange-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingCategory && (
        <div className="max-w-xl mx-auto mt-8 p-5 border rounded-lg shadow-md bg-yellow-50">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-1">
            <FolderEdit size={25} fill='lightgreen' /> Edit Category (ID: {editingCategory.id})
          </h3>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Category Name:</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="border p-2 rounded w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition border border-gray-300"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Description:</label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="border p-2 rounded w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition border border-gray-300"
            />
          </div>

          <div className="mb-6">
          <label className="block mb-1 font-medium">Replace Image:</label>
          <div className="flex items-center">
            <input
              type="text"
              readOnly
              value={editForm.image ? editForm.image.name : ''}
              placeholder="No file chosen"
              className="flex-1 p-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-100 text-sm focus:outline-none"
            />
        
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditForm({ ...editForm, image: e.target.files[0] })
              }
              id="edit-image-upload"
              className="hidden focus:outline-none"
            />
        
            <label
              htmlFor="edit-image-upload"
              className="bg-blue-500 text-white px-3 py-2 rounded-r-lg font-semibold shadow hover:bg-blue-600 transition cursor-pointer active:scale-90"
            >
              Choose
            </label>
          </div>
        </div>

          {message && <p className="text-green-600 mb-2">{message}</p>}
          {error && <p className="text-red-600 mb-2">{error}</p>}

          <div className="flex gap-3 items-center justify-center">
            <button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-1 transition duration-200 cursor-pointer active:scale-90"
            >
              <Save size={20} />
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="bg-purple-700 hover:bg-purple-800 active:scale-90 text-white px-4 py-2 rounded flex items-center gap-1 transition duration-200 cursor-pointer"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
