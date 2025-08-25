import React, { useState } from 'react';
import { ListPlus } from 'lucide-react';
import axios from 'axios';

const AddProduct = ({ category, onProductAdded }) => {
  const [formData, setFormData] = useState({ name: '', price: '', image: null });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, price, image } = formData;

    if (!name.trim() || !price || !image || !category) {
      return alert('Please fill in all fields and select an image.');
    }

    const data = new FormData();
    data.append('name', name.trim());
    data.append('price', price);
    data.append('image', image);
    data.append('category', category);

    try {
      await axios.post(`http://localhost:3000/api/products`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Product added successfully!');
      setFormData({ name: '', price: '', image: null });
      onProductAdded();
    } catch (err) {
      console.error(err);
      setMessage('Failed to add product.');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mb-6"
    >
      <h2 className="text-2xl font-bold mb-8 text-yellow-500 text-center flex items-center justify-center gap-1">
        <ListPlus size={28} />
        Add New Product
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 font-semibold text-gray-700">Product Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="price" className="mb-2 font-semibold text-gray-700">Price:</label>
          <input
            type="number"
            name="price"
            id="price"
            placeholder="Enter price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-semibold text-gray-700">Product Image:</label>
          <label
            htmlFor="image-upload"
            className="cursor-pointer border border-gray-300 rounded-md px-3 py-2 text-center bg-blue-100 hover:bg-blue-200 transition flex items-center justify-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4m0 0l-4 4m4-4v12" />
            </svg>
            <span className="text-gray-700">
              {formData.image ? formData.image.name : 'Choose Image'}
            </span>
          </label>
          <input
            type="file"
            id="image-upload"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-md transition transform active:scale-95 cursor-pointer"
      >
        Add Product
      </button>

      {message && (
        <p
          className={`mt-4 text-center font-semibold ${
            message.startsWith('') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default AddProduct;
