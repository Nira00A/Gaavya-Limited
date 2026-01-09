import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { user, login, isAuthLoading } = useAuth();
  const [formData, setFormData] = useState({ password: '', email: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success(result.text);
        navigate('/');
      } else {
        toast.error(result.text);
      }
    } catch (error) {
      toast.error(error.code || "Login failed");
    }
  };

  if (isAuthLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="text-green-800 font-bold animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) return <Navigate to={'/'} replace />;

  return (
    <div className="bg-slate-50 h-screen min-[768px]:h-[600px] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
        
        {/* LEFT PANEL */}
        <div className="bg-green-600 p-8 md:p-12 text-white md:w-5/12 flex flex-col justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">Login</h2>
            <p className="text-green-50 text-base md:text-lg leading-relaxed opacity-90">
              Get access to fresh A2 Milk, Bilona Ghee, and exclusive farm offers delivered to your doorstep.
            </p>
          </div>

          <div className="hidden md:flex mt-10 relative h-40 items-end justify-center">
            <div className="absolute bottom-0 w-32 h-32 bg-green-500 rounded-full blur-2xl opacity-50"></div>
            <img 
              src="/Images/GawyamLogo.jpeg" 
              alt="Gavyam Farm" 
              className="h-28 w-28 object-cover rounded-full relative z-10 border-4 border-white/30" 
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 md:p-12 md:w-7/12 flex flex-col justify-center">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleLogin(); }} 
            className="space-y-6 md:space-y-8"
          >
            <div className="relative group">
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full py-3 border-b-2 border-gray-100 focus:border-green-600 outline-none transition-all text-gray-800 font-medium bg-transparent"
              />
              <label className="absolute left-0 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-green-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">
                Email Address
              </label>
            </div>

            <div className="relative group">
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full py-3 border-b-2 border-gray-100 focus:border-green-600 outline-none transition-all text-gray-800 font-medium bg-transparent"
              />
              <label className="absolute left-0 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-green-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">
                Password
              </label>
            </div>

            <div className="space-y-4">
              <p className="text-[11px] md:text-xs text-gray-400 leading-tight">
                By continuing, you agree to Gawyam's <a href="#" className="text-green-600 font-semibold hover:underline">Terms of Use</a> and <a href="#" className="text-green-600 font-semibold hover:underline">Privacy Policy</a>.
              </p>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98]"
              >
                Continue
              </button>
            </div>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-gray-50">
            <Link
              to={'/register'}
              className="text-green-600 font-bold hover:text-green-700 text-sm md:text-base transition-colors"
            >
              New to Gawyam? Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;