import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageSlider from './ImageSlider';
import axios from 'axios';

const ProductList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <ImageSlider />
      <div className="p-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-100 hover:scale-105 glow-text transition duration-200">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden duration-300 hover:scale-105">
              <img src={category.image} alt={category.name} className="w-100 h-48 px-12 object-cover"/>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                <p className="text-gray-600 mb-2">{category.description}</p>
                <Link
                  to={`/${category.name.toLowerCase().replace(/ /g, '')}`}
                  className="inline-block bg-[#FFD700] text-[#121212] px-4 py-2 rounded-md shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 active:brightness-90 transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                  See More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;
