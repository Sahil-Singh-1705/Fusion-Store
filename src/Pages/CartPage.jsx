import React, { useEffect, useState } from 'react';
import { useCart } from '../components/CartContext';
import { ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, handleRemoveFromCart, handleBuyNow } = useCart();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          return;
        }

        const res = await axios.get('http://localhost:3000/api/check-auth', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data.user);
      } catch (err) {
        console.error("Authentication error:", err);
        setUser(null);
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, []);

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold text-yellow-400 mb-4 flex flex-row items-center gap-2">
          Your Shopping Cart <ShoppingCart size={35} />
        </h2>
        <p className="text-white text-center text-xl">
          Please{" "}
          <span
            className="text-yellow-400 underline hover:brightness-110 hover:scale-105 active:scale-90 cursor-pointer inline-block"
            onClick={() => navigate('/auth')}
          >
            Login
          </span>{" "}
          to view your cart.
        </p>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0);

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-3xl font-bold text-yellow-400 mb-4 flex flex-row items-center gap-2">
        Your Shopping Cart <ShoppingCart size={35} /> :
      </h2>
      {cart.length === 0 ? (
        <p className="text-white">Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white p-4 my-2 rounded shadow">
              <div className="flex items-center gap-4">
                <img src={item.imgSrc} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-green-600">${item.price}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleRemoveFromCart(item)}
                  className="text-sm text-red-600 bg-red-200 px-3 py-1 cursor-pointer rounded-md transform hover:scale-105 hover:bg-red-100 active:scale-95 active:brightness-90 transition duration-200"
                >
                  ❌ Remove
                </button>
                <button
                  onClick={() => handleBuyNow(item)}
                  className="text-sm bg-orange-400 text-[#121212] font-semibold px-3 py-1 rounded-md shadow-md hover:brightness-110 hover:scale-105 active:scale-95 active:brightness-90 transition duration-200"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end mt-6 px-4">
            <h3 className="text-2xl font-bold text-black px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 shadow-md">
              Total: ${total.toFixed(2)}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
