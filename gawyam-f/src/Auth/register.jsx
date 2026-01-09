import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from '../firebaseConfig';
import { useAuth } from '../context/authContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    email: ''
  });
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGetOtp = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.password || !formData.email) {
      toast.warn("Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await sendEmailVerification(userCredential.user);
      setIsEmailSent(true);
      toast.info("Verification link sent! Please check your inbox.");
    } catch (error) {
      const getFriendlyError = (code) => {
        switch (code) {
          case 'auth/email-already-in-use':
            return "This email is already registered with Gawyam.";
          case 'auth/weak-password':
            return "Please choose a stronger password (min 6 chars).";
          default:
            return "Something went wrong. Please try again.";
        }
      };
      toast.error(getFriendlyError(error.code));
    }
  };

  useEffect(() => {
    let interval;
    if (isEmailSent) {
      interval = setInterval(async () => {
        if (auth.currentUser) {
          await auth.currentUser.reload();
          if (auth.currentUser.emailVerified) {
            clearInterval(interval);
            await register(formData.email, formData.fullName, formData.password);
            navigate('/');
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isEmailSent, formData, register, navigate]);

  return (
    <div className="bg-[#F8FAF7] h-screen min-[768px]:h-[650px] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* LEFT PANEL */}
        <div className="bg-green-600 p-8 md:p-12 text-white md:w-5/12 flex flex-col justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">Register</h2>
            <p className="text-green-50 text-base md:text-lg leading-relaxed opacity-90">
              Join the Gawyam family and enjoy fresh A2 Milk, Ghee, and organic farm products. #SudhDudh
            </p>
          </div>

          <div className="hidden md:flex mt-10 relative h-40 items-end justify-center">
            <div className="absolute bottom-0 w-32 h-32 bg-green-500 rounded-full blur-2xl opacity-50"></div>
            <img 
              src="/Images/GawyamLogo.jpeg" 
              alt="Gawyam Farm" 
              className="h-28 w-28 object-cover rounded-full relative z-10 border-4 border-white/30" 
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 md:p-12 md:w-7/12 flex flex-col justify-center">
          {isEmailSent ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Verify your Email</h3>
              <p className="text-gray-500 text-sm">We've sent a link to <span className="font-bold text-green-600">{formData.email}</span>. The page will redirect automatically after you verify.</p>
            </div>
          ) : (
            <form onSubmit={handleGetOtp} className="space-y-6 md:space-y-8">
              <div className="relative group">
                <input
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer w-full py-3 border-b-2 border-gray-100 focus:border-green-600 outline-none transition-all text-gray-800 font-medium bg-transparent"
                />
                <label className="absolute left-0 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-xs peer-focus:text-green-600 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs">
                  Full Name
                </label>
              </div>

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
                <p className="text-[11px] md:text-xs text-gray-400 leading-relaxed">
                  By creating an account, you agree to Gawyam's <Link to="/terms" className="text-green-600 font-bold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-green-600 font-bold hover:underline">Privacy Policy</Link>.
                </p>

                <button
                  type="submit"
                  disabled={isEmailSent}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98] uppercase tracking-widest text-xs md:text-sm"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          <div className="text-center mt-8 pt-6 border-t border-gray-50">
            <p className="text-gray-500 text-sm md:text-base">
              Already part of the family? 
              <Link to="/login" className="text-green-600 font-bold ml-2 hover:text-green-700 transition-colors hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;