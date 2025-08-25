import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductList from './components/ProductList';
import Header from './components/Header';
import Footer from './components/Footer';
import CartPage from './Pages/CartPage';
import AuthPage from './Pages/AuthPage';
import AdminDashboard from './Admin/AdminDashboard';
import CategoryPage from './Pages/CategoryPage';

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/:category" element={<CategoryPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
