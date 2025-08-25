import React, { useEffect, useState } from 'react';
import { ShoppingCart, Replace } from 'lucide-react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:3000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Fetch orders error:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to replace this order?')) {
      try {
        await axios.delete(`http://localhost:3000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(orders.filter((order) => order.id !== id));
      } catch (err) {
        console.error('Delete order error:', err.response?.data || err.message);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center gap-1">
        <ShoppingCart size={30} className="border-2 rounded p-0.5 bg-purple-950" />
         Order Management :
      </h2>

      {orders.length === 0 ? (
        <p className="text-yellow-500">No orders found.</p>
      ) : (
        <table className="min-w-full border rounded overflow-hidden mb-6">
          <thead className="bg-yellow-200">
            <tr>
              <th className="p-2 px-4 border">Order ID</th>
              <th className="p-2 px-4 border">User ID</th>
              <th className="p-2 px-4 border">Product</th>
              <th className="p-2 px-4 border">Price</th>
              <th className="p-2 px-4 border">Image</th>
              <th className="p-2 px-4 border">Time</th>
              <th className="p-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="p-2 px-4 border bg-teal-100">{order.id}</td>
                <td className="p-2 px-4 border bg-teal-100">{order.user_id}</td>
                <td className="p-2 px-4 border bg-emerald-100">{order.product_name}</td>
                <td className="p-2 px-4 border bg-red-100">${order.product_price}</td>
                <td className="p-2 px-4 border bg-blue-100">
                  <img
                    src={
                      order.product_image.startsWith('http')
                        ? order.product_image
                        : `http://localhost:3000/${order.product_image}`
                    }
                    alt="product"
                    className="w-15 h-15 object-cover rounded"
                  />
                </td>
                <td className="p-2 px-4 border bg-gray-100">
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="p-2 px-4 border bg-yellow-100 text-center">
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-1 rounded flex items-center justify-center gap-1"
                  >
                    <Replace size={18}/>Replace
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderManagement;
