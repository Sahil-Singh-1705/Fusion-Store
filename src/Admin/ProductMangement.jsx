import React, { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import AddProduct from './AddProduct';

const ProductManagement = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/categories');
        const names = res.data.map(cat => cat.name);
        setCategories(names);
        if (names.length > 0) setSelectedCategory(names[0]);
      } catch (err) {
        console.error('Category fetch error:', err);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    if (!token || !selectedCategory) return;
    try {
      const res = await axios.get(`http://localhost:3000/api/products/${selectedCategory}`);
      setProducts(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [selectedCategory, token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure')) return;
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const toggleAddForm = () => {
    setShowAddForm((prev) => !prev);
  };

  return (
    <div>
      <div className="mb-6 flex items-center space-x-4">
        <label className="text-xl font-semibold text-yellow-400 mr-2">Select Category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-100"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button
          onClick={toggleAddForm}
          className={`ml-auto font-bold py-2 px-4 rounded transition duration-300 active:scale-90 ${
            showAddForm
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-[#FFD700] text-[#121212] hover:bg-yellow-500'
          }`}
        >
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showAddForm && (
        <AddProduct
          category={selectedCategory}
          onProductAdded={() => {
            fetchProducts();
            setShowAddForm(false);
          }}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 shadow-md rounded-lg hover:scale-105 transition duration-300"
          >
            {product.imgSrc && (
              <img
                src={`http://localhost:3000/${product.imgSrc}`}
                alt={product.name}
                className="w-64 h-48 object-cover pl-3"
              />
            )}
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-green-600 font-medium">${product.price}</p>
            <button
              onClick={() => handleDeleteProduct(product.id)}
              className="mt-2 text-sm bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 hover:scale-105 active:scale-90 transition duration-200 shadow flex items-center gap-1"
            >
              <Trash2 size={15}/>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
