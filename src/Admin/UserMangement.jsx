import React, { useEffect, useState } from 'react';
import { Users, Pencil, Save, X, UserRoundPen, Trash2} from 'lucide-react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:3000/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setEditForm({ username: user.username, email: user.email });
    setMessage('');
    setError('');
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditForm({ username: '', email: '' });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/api/users/${editingUser.id}`, editForm);
      setMessage('User updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
    }
  };

  return (
    <div className="p-4 text-black">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center gap-1">
        <Users size={28} className="bg-blue-950 rounded border-2" /> User Management :
      </h2>

      {!editingUser && (
        <table className="min-w-full border rounded overflow-hidden mb-6">
          <thead className="bg-yellow-200">
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Username</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border bg-green-100">{user.id}</td>
                <td className="py-2 px-4 border bg-teal-100">{user.username}</td>
                <td className="py-2 px-4 border bg-teal-100">{user.email}</td>
                <td className="py-2 px-4 border bg-orange-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(user)}
                    className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 cursor-pointer"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 cursor-pointer"
                  >
                    <Trash2 size={16}/>
                    Delete
                  </button>
                </div>
              </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingUser && (
        <div key={editingUser.id} className="max-w-xl mx-auto mt-8 p-5 border rounded-lg shadow-md bg-yellow-50">
          <h3 className="text-xl font-bold mb-4 flex flex-row items-center gap-1"><UserRoundPen size={25} className='border-2 rounded bg-teal-300'/>Edit User (ID: {editingUser.id})</h3>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Username:</label>
            <input
              type="text"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              className="border p-2 rounded w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-300"
            />
          </div>

          <div className="mb-8">
            <label className="block font-semibold mb-1">Email:</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="border p-2 rounded w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-300"
            />
          </div>

          {message && <div className="text-green-600 mb-2">{message}</div>}
          {error && <div className="text-red-600 mb-2">{error}</div>}

          <div className="flex gap-3 items-center justify-center">
            <button
              onClick={handleUpdate}
              className="bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-90 text-white px-3 py-2 rounded flex items-center gap-1 transition duration-200 cursor-pointer"
            >
              <Save size={20} />
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="bg-purple-700 hover:bg-purple-800 hover:scale-105 active:scale-90 text-white px-3 py-2 rounded flex items-center gap-1 transition duration-200 cursor-pointer"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
