import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from './CartContext';
import { Home, Zap, LogIn, LogOut } from 'lucide-react';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, searchQuery, setSearchQuery } = useCart();

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); 

  const isAdminRoute = location.pathname.startsWith('/admin');
  const showSearchBar =
    !['/', '/cart', '/auth'].includes(location.pathname) && !isAdminRoute;

  const hideAuthButtons = [ '/smartphones', '/laptops', '/smartwatch', '/earbuds', '/cameras', '/smarttv', ].includes(location.pathname);

  useEffect(() => {
    const checkUserAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:3000/api/check-auth', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.user);
        } catch {
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setUser(null);
      }
    };

    const checkAdminAuth = async () => {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        try {
          await axios.get('http://localhost:3000/api/admin-auth', {
            headers: { Authorization: `Bearer ${adminToken}` },
          });
          setIsAdmin(true);
        } catch {
          setIsAdmin(false);
          localStorage.removeItem('adminToken');
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkUserAuth();
    checkAdminAuth();
  }, [location.pathname]);

  const handleUserLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <header className="bg-[#121212] text-white p-4 shadow-lg">
      <div className="flex items-center justify-between flex-wrap">
        <h1
          className="text-3xl font-bold text-yellow-200 hover:scale-105 hover:brightness-110 italic cursor-pointer glow-text flex flex-row transition duration-200"
          onClick={() => navigate('/')}
        >
          <Zap size={33} className="text-yellow-200 fill-yellow-200 drop-shadow-[0_0_5px_#facc15]" />
          Fusion $tore
        </h1>

        <div className="flex space-x-4 items-center relative">
          {showSearchBar && (
            <input
              type="text"
              className="p-2 rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-3 focus:ring-yellow-400"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}

          {!isAdminRoute && (
            <>
              <button className="btn mr-2 flex flex-row items-center" onClick={() => navigate('/')}>
                <Home size={24} />
                Home
              </button>

              <button className="btn mr-2 flex flex-row items-center" onClick={() => navigate('/cart')}>
                Cart
                <img width={20} src="public/Images/grocery-store.png" alt="Cart" />
                {user && cart.length > 0 && (
                  <span className="text-[#121212]">({cart.length})</span>
                )}
              </button>

              {!hideAuthButtons && (
                !user ? (
                  <button className="btn flex flex-row" onClick={() => navigate('/auth')}>
                    Login/Sign Up<LogIn />
                  </button>
                ) : (
                  <button className="btn flex flex-row" onClick={handleUserLogout}>
                    <LogOut />Logout ({user.username})
                  </button>
                )
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
