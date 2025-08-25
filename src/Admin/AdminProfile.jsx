import React, { useEffect, useState } from 'react';
import { Pencil, Save, X } from 'lucide-react';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwords, setPasswords] = useState({ old: '', new1: '', new2: '' });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setError('Not logged in');
          return;
        }

        const res = await fetch('http://localhost:3000/api/admin-profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to fetch admin');
        }

        const data = await res.json();
        setAdmin(data);
        setForm({ username: data.username, email: data.email });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAdmin();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');

    if ((passwords.old || passwords.new1 || passwords.new2) &&
        (!passwords.old || !passwords.new1 || !passwords.new2)) {
      setError('Please fill all password fields or leave all blank');
      return;
    }

    if (passwords.new1 !== passwords.new2) {
      setError('New passwords do not match');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/admin-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (passwords.old && passwords.new1 && passwords.new2) {
        const passRes = await fetch('http://localhost:3000/api/admin-change-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ oldPassword: passwords.old, newPassword: passwords.new1 })
        });

        const passData = await passRes.json();
        if (!passRes.ok) throw new Error(passData.message);
      }

      setMessage('Profile updated successfully');
      setAdmin((prev) => ({ ...prev, ...form }));
      setEditMode(false);
      setError('');
      setPasswords({ old: '', new1: '', new2: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!admin) return <div className="text-yellow-100">Loading...</div>;

  return (
    <div className="admin-profile max-w-xl mx-auto p-5">
      <div className="admin-card p-5 rounded-lg border shadow-md bg-yellow-50 flex flex-col items-center text-black">
        <img
          src={`http://localhost:3000/${admin.image_path}`}
          alt={admin.username}
          className="w-40 h-40 rounded-full object-cover mb-4 border-4 border-black"
        />
        <div className="text-left space-y-2 w-full mb-2">
          <div>
            <span className="font-semibold">Username:</span>{' '}
            {editMode ? (
              <input
                className="border p-2 rounded w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-300"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            ) : (
              admin.username
            )}
          </div>
          <div>
            <span className="font-semibold">Email:</span>{' '}
            {editMode ? (
              <input
                className="border p-2 rounded w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-300"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            ) : (
              admin.email
            )}
          </div>

          {editMode && (
            <>
              <div>
                <label className="block text-sm font-semibold">Old Password:</label>
                <input
                  type="password"
                  className="border p-2 rounded w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-300"
                  value={passwords.old}
                  onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">New Password:</label>
                <input
                  type="password"
                  className="border p-2 rounded w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-300"
                  value={passwords.new1}
                  onChange={(e) => setPasswords({ ...passwords, new1: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Confirm New Password:</label>
                <input
                  type="password"
                  className="border p-2 rounded w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-300"
                  value={passwords.new2}
                  onChange={(e) => setPasswords({ ...passwords, new2: e.target.value })}
                />
              </div>
            </>
          )}

          {message && <div className="text-green-500">{message}</div>}
        </div>

        <div className="mt-4">
          {editMode ? (
            <div className="flex flex-row gap-3">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded hover:scale-105 flex items-center gap-1 active:scale-90 transition duration-200 cursor-pointer"
              >
                <Save />
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setForm({ username: admin.username, email: admin.email });
                  setPasswords({ old: '', new1: '', new2: '' });
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded hover:scale-105 flex flex-row items-center active:scale-90 transition duration-200 cursor-pointer"
              >
                <X />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex flex-row items-center gap-1 hover:scale-105 active:scale-90 transition duration-200 cursor-pointer"
            >
              <Pencil size={15} />
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
