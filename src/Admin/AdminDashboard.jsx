import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutGrid, Users, ShoppingCart, SquareUserRound, CircleUserRound, LogOut, Box, Plus, List, Cog } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminProfile from './AdminProfile';
import UserManagement from './UserMangement';
import ProductManagement from './ProductMangement';
import AddCategory from './AddCategory';
import CategoryManagement from './CatgoryMangement';
import OrderManagement from './OrderManagement';

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [activeMenu, setActiveMenu] = useState('products');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState({ username: '', image_path: '' });

  useEffect(() => {
    if (location.hash === '#profile') setActiveMenu('profile');
  }, [location]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      try {
        await axios.get('http://localhost:3000/api/admin-auth', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);
        const res = await axios.get('http://localhost:3000/api/admin-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdminProfile(res.data);
      } catch {
        localStorage.removeItem('adminToken');
        setToken('');
        setIsAuthenticated(false);
      }
    };
    verifyToken();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('#admin-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/admin-login', loginForm);
      const receivedToken = res.data.token;
      localStorage.setItem('adminToken', receivedToken);
      setToken(receivedToken);
      setIsAuthenticated(true);
      setActiveMenu('products');
    } catch {
      setError('Invalid admin credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsAuthenticated(false);
    setLoginForm({ email: '', password: '' });
    navigate('/admin');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'products':
        return <ProductManagement token={token} />;
      case 'add-category':
        return <AddCategory />;
      case'manage-category':
        return <CategoryManagement/>
      case 'users':
        return <UserManagement />;
      case 'orders':
        return <OrderManagement/>
      case 'profile':
        return <AdminProfile />;
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80 max-w-sm">
          <div className="flex justify-center mb-1">
            <CircleUserRound size={38} className="text-yellow-300 bg-black rounded-full" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center text-yellow-400">Admin Login</h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <input
            type="email"
            placeholder="Admin Email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            className="w-full p-2 mb-3 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            className="w-full p-2 mb-4 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-300"
          />
          <button className="w-full btn">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <div className="text-2xl font-bold mb-6 text-yellow-400">Fusion Admin</div>

        <div className="relative">
         <button
           onClick={() => setActiveMenu(activeMenu === 'products-dropdown' ? '' : 'products-dropdown')}
           className="flex items-center justify-between w-full gap-2 p-2 hover:bg-gray-800 cursor-pointer hover:text-yellow-400 rounded"
         >
           <span className="flex items-center gap-1">
             <List size={20} />
             Product Management
           </span>
           <svg
             className={`w-4 h-4 transition-transform ${activeMenu === 'products-dropdown' ? 'rotate-180' : ''}`}
             fill="none"
             stroke="currentColor"
             viewBox="0 0 24 24"
           >
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
           </svg>
         </button>

         {activeMenu === 'products-dropdown' && (
          
           <div className="ml-6 mt-1 space-y-1 text-sm">
             <hr/>
             <button
               onClick={() => setActiveMenu('products')}
               className="text-gray-300 hover:text-yellow-400 block mb-2 hover:bg-gray-800 rounded px-2 py-1 flex items-center gap-1 mt-2"
             >
              <LayoutGrid size={15}/> Manage Products
             </button>
             <hr/>
             <button
               onClick={() => setActiveMenu('add-category')}
               className="text-gray-300 hover:text-yellow-400 block hover:bg-gray-800 rounded px-2 py-1 flex items-center gap-1 mt-2 mb-2"
             >
              <Plus size={15}/> Add Category
             </button>
             <hr/>
             <button
               className="text-gray-300 hover:text-yellow-400 block hover:bg-gray-800 rounded px-2 py-1 flex items-center gap-1 mt-2 mb-2"
               onClick={() => setActiveMenu('manage-category')}
             >
               <Cog size={15}/>Manage Category
             </button>
             <hr/>
           </div>
         )}
        </div>


        <button
          onClick={() => setActiveMenu('users')}
          className="flex items-center gap-2 p-2 hover:bg-gray-800 cursor-pointer hover:text-yellow-400 rounded"
        >
          <Users size={20} /> User Management
        </button>
        <button
          onClick={() => setActiveMenu('orders')}
          className="flex items-center gap-2 p-2 hover:bg-gray-800 cursor-pointer hover:text-yellow-400 rounded"
        >
          <ShoppingCart size={20} /> Order Management
        </button>
      </aside>

      <main className="flex-1 p-6 bg-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-400 flex items-center gap-2 underline underline-offset-4">
            <SquareUserRound size={40} className="rounded-lg bg-black text-yellow-400" />
            {adminProfile.username ? `${adminProfile.username}/Dashboard` : 'Dashboard'}
          </h1>
          <div className="relative" id="admin-dropdown">
            <button
              onClick={() => setDropdownOpen((open) => !open)}
              className="flex items-center gap-2 text-black bg-yellow-400 px-3 py-2 rounded-md cursor-pointer focus:outline-none hover:brightness-110"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <img
                src={`http://localhost:3000/${adminProfile.image_path || 'public/Images/default-avatar.png'}`}
                alt="Admin Avatar"
                className="w-7 h-7 rounded-full object-cover border-1 border-black"
              />
              <svg
                className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded shadow-lg z-50">
                <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                  <span className="font-semibold text-yellow-300">{adminProfile.username}</span>
                </div>
                <li>
                  <button
                    onClick={() => {
                      setActiveMenu('profile');
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-yellow-400 hover:text-black cursor-pointer"
                  >
                    Profile
                  </button>
                </li>
                <hr className="text-black" />
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left gap-22 px-4 py-2 hover:bg-yellow-400 hover:text-black flex flex-row cursor-pointer"
                  >
                    Logout <LogOut size={22} />
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
