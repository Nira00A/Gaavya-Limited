import React, { useState } from 'react';
import adminApi from '../axiosApi/adminApi';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from './adminContext/adminAuthContext';
import {toast} from 'react-toastify'

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginAdmin } = useAdmin()

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await loginAdmin(email , password)

      if (res.success) {
        alert(res.text)
        navigate('/admin/dashboard');
      }else{
        alert(res.error)
        setError(res.error)
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed')
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-96 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          New here? Contact Gaavya
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;