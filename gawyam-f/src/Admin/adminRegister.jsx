/*
import { useState } from 'react';
import adminApi from '../axiosApi/adminApi';
import { useNavigate } from 'react-router-dom';
import {useAdmin} from '../Admin/adminContext/adminAuthContext'
import {toast} from 'react-toastify'

const AdminRegister = () => {
  const [step, setStep] = useState(1); // Step 1: Register, Step 2: Verify
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const { registerAdmin , verifyAdminOtp } = useAdmin()

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg({ type: 'info', text: 'Sending OTP...' });

    try {
      const res = await registerAdmin(email,password);

      if (res.success) {
        setMsg({ type: 'success', text: 'OTP sent to your email!' });
        setStep(2);
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Registration failed' });
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg({ type: 'info', text: 'Verifying...' });

    try {
      const res = await verifyAdminOtp(email , otp);

      if (res.success) {
        setMsg({ type: 'success', text: 'Verified! Redirecting...' });
        toast.success(res.text)
        setTimeout(() => navigate('/admin/dashboard'), 1500);
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.text || 'Invalid Code' });
      toast.error('Error in verifying , try again')
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-96 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {step === 1 ? 'Admin Register' : 'Verify Email'}
        </h2>

        {msg.text && (
          <div className={`p-2 mb-4 rounded ${msg.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {msg.text}
          </div>
        )}

        {step === 1 ? (
          // REGISTER 
          <form onSubmit={handleRegister} className="space-y-4">
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
              Send OTP
            </button>
            <p className="text-center text-sm">
              Already have an account? <a href="/admin/login" className="text-blue-500">Login</a>
            </p>
          </form>
        ) : (
          //  VERIFY  
          <form onSubmit={handleVerify} className="space-y-4">
             <p className="text-sm text-gray-600 text-center">
               Enter the code sent to <strong>{email}</strong>
             </p>
            <input
              type="text"
              placeholder="Enter 6-digit Code"
              className="w-full p-2 border rounded text-center text-xl tracking-widest"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
              Verify & Login
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="w-full text-gray-500 text-sm hover:underline"
            >
              Wrong Email? Go Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminRegister;
*/