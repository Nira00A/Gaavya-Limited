import React from 'react';
import { Clock } from 'react-feather'; 

const CanOrderPopup = ({ isOpen, onClose, reason }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-lg overflow-hidden shadow-lg animate-in zoom-in-95 duration-300">
        
        {/* Top Branding / Image Area */}
        <div className="bg-amber-50 p-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border-4 border-amber-100">
             {/* Replace with a small version of your Cow Illustration */}
                <img
                src="Images/GawyamLogo.jpeg"
                alt="Gawyam Logo"
                className="h-20 w-20 object-cover rounded-full"
                />
          </div>
          <h2 className="text-xl font-black text-amber-900">Cows Didn't migrate!</h2>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <p className="text-gray-600 font-medium mb-6">
            We are currently not accepting orders in your area!
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl text-left">
              <Clock className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Delivery Slot</p>
                <p className="text-sm font-bold text-gray-800">Tomorrow, 7:00 AM - 9:00 AM</p>
              </div>
            </div>

            {/* Main Action */}
            <button 
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all"
            >
              Got it, thanks!
            </button>
            
            <button 
              onClick={() => window.location.href = "tel:+91XXXXXXXXXX"}
              className="w-full text-gray-400 text-sm font-bold py-2 hover:text-green-600 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanOrderPopup;