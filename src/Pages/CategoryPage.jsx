import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductCart from '../components/ProductCart';
import { useCart } from '../components/CartContext';
import axios from 'axios';

const CategoryPage = () => {
  const { category } = useParams(); 
  const { searchQuery } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${category.toLowerCase()}`);
        setProducts(response.data);
      } catch (err) {
        console.error(`Error fetching ${category} data:`, err);
      }
    };
    fetchProducts();
  }, [category]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {filteredProducts.map(product => (
        <ProductCart key={product.id} product={product} />
      ))}
    </div>
  );
};

export default CategoryPage;
