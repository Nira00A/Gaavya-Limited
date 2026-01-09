import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      {/* Visual Element - Scaled for mobile (text-7xl) to desktop (text-9xl) */}
      <h1 className="text-7xl md:text-9xl font-black text-green-100 select-none ">
        404
      </h1>
      
      <div className="text-center -mt-8 md:-mt-12">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          Oops! Page spilled.
        </h2>
        
        {/* Max-width ensures text doesn't stretch too wide on desktop */}
        <p className="text-gray-500 mb-8 max-w-[280px] md:max-w-xs mx-auto text-xs md:text-sm leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Let's get you back to the fresh milk!
        </p>

        {/* Responsive Button - Full width on tiny screens, auto on larger */}
        <button
          onClick={() => navigate('/')}
          className="w-full md:w-auto bg-green-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all text-sm md:text-base"
        >
          Back to Gaavya Home
        </button>
      </div>

      {/* Decorative text - Hidden on very small screens to save space */}
      <p className="hidden sm:block mt-16 text-[10px] md:text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">
        Pure • Fresh • Gaavya
      </p>
    </div>
  );
};

export default NotFound;