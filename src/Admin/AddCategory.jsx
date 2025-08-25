import React, { useState } from 'react';
import { PackagePlus } from 'lucide-react';
import axios from 'axios';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name || !image || !description) {
      setMessage('Please fill out all fields including image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('description', description);

    try {
      setLoading(true);
      await axios.post('http://localhost:3000/api/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(`Category "${name}" added successfully!`);
      setName('');
      setImage(null);
      setDescription('');
      document.getElementById('category-image-upload').value = '';
    } catch (err) {
      console.error(err);
      setMessage('Failed to add category.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white via-yellow-50 to-white p-6 shadow-xl rounded-2xl max-w-lg mx-auto mt-10 border border-yellow-100 transition-all duration-500">
      <h2 className="text-2xl font-bold mb-6 text-yellow-500 text-center flex items-center justify-center gap-1">
        <PackagePlus size={28} />
        Add New Category
      </h2>
      
      <form onSubmit={handleAddCategory} className="space-y-5">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Category Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Smartphones"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 transition"
          />
        </div>

        <div>
         <label className="block mb-1 text-sm font-medium text-gray-700">Category Image:</label>
         <div className="flex items-center">
           <input
             type="text"
             readOnly
             value={image ? image.name : ''}
             placeholder="No file chosen"
             className="flex-1 p-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-sm focus:outline-none"
           />
       
           <input
             type="file"
             accept="image/*"
             onChange={(e) => setImage(e.target.files[0])}
             id="category-image-upload"
             className="hidden focus:outline-none"
           />
       
           <label
             htmlFor="category-image-upload"
             className="bg-blue-500 text-white px-3 py-2 rounded-r-lg font-semibold shadow hover:bg-blue-600 transition cursor-pointer active:scale-90"
           >
             Choose
           </label>
         </div>
       </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short description for this category"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50 transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold text-white transition duration-200 cursor-pointer ${
            loading
              ? 'bg-yellow-300 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-500 active:scale-95'
          }`}
        >
          {loading ? 'Adding...' : 'Add Category'}
        </button>

        {message && (
          <p className={`text-center text-sm mt-3 ${message.includes('') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddCategory;
