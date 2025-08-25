import React from 'react';
import { useCart } from './CartContext';

const ProductCart = ({ product }) => {
  const { handleAddToCart, handleBuyNow } = useCart();

  const imageUrl = `http://localhost:3000/${product.imgSrc}`;

  return (
    <div className="product-card flex items-center justify-center flex-wrap">
      <img src={imageUrl} alt={product.name} className="h-48 w-54 object-cover" />
      <div className="p-4 w-full">
        <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
        <p className="text-lg text-green-600">${product.price}</p>
        <button
          className="btn"
          onClick={() => handleAddToCart(product)}
        >
          Add to Cart
        </button>
        <button
          className="ml-2 px-3 py-2 bg-orange-400 text-[#121212] font-semibold rounded-lg shadow-md transition duration-300 transform hover:scale-105 hover:brightness-130 active:scale-95"
          onClick={() => handleBuyNow(product)}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCart;
