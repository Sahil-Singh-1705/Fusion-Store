import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  const handleRemoveFromCart = (productToRemove) => {
    setCart((prev) => prev.filter((item) => item !== productToRemove));
  };

  const handleBuyNow = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to place an order.");
        return;
      }

      const authRes = await axios.get("http://localhost:3000/api/check-auth", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = authRes.data.user;
      if (!user || !user.id) {
        alert("User authentication failed. Please login again.");
        return;
      }

      const payload = {
        userId: user.id,
        product: {
          name: product.name,
          price: parseFloat(product.price),
          imgSrc: product.imgSrc,
        },
      };

      console.log("Placing order with payload:", payload);

      await axios.post(
        "http://localhost:3000/api/orders",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Order placed for: ${product.name}`);
    } catch (error) {
      console.error("Buy Now error:", error.response ? error.response.data : error.message);
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        searchQuery,
        setSearchQuery,
        handleAddToCart,
        handleRemoveFromCart,
        handleBuyNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
