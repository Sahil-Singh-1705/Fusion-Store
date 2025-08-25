import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleUserRound } from 'lucide-react';
import axios from 'axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post('http://localhost:3000/api/login', {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem('token', res.data.token);
        navigate('/');
      } else {
        await axios.post('http://localhost:3000/api/signup', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        setMessage('Signup successful! Please log in.');
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-76">
        
        <div className='flex justify-center mb-1'>
          <CircleUserRound size={40} className='bg-yellow-300 rounded-full'/>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center text-[#121212]">
          {isLogin ? 'Login to Your Account' : 'Create a New Account'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-300"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-300"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-300"
            required
          />
          <button type="submit" className="w-full btn">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-center ${
            message.toLowerCase().includes('success') ? 'text-green-500' : 'text-red-500'
          }`}>
            {message}
          </p>
        )}

        <p className="text-center mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            className="text-blue-600 ml-1 cursor-pointer underline hover:scale-105 active:scale-90"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;