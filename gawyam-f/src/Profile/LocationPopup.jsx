import React, { useState } from 'react';
import { MapPin, X } from 'react-feather';

const NoDeliveryPopup = ({}) => {
    const [open , setOpen] = useState(true)

    if (!open) return
    
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
        
        {/* Header with Close Button */}
        <div className="flex justify-end p-2">
          <button 
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6">
            <MapPin size={32} className="text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Not Serviceable Yet
          </h2>
          
          <p className="text-gray-600 mb-6">
            We currently don't deliver to <span className="font-semibold text-gray-800"></span>. 
            Gaavya is expanding fast—we hope to reach you soon!
          </p>

          <div className="space-y-3">
            <button
              onClick={() => setOpen(false)}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-[1.02]"
            >
              Change Location
            </button>
            
            <button
              onClick={() => setOpen(false)}
              className="w-full py-3 border-2 border-gray-200 text-gray-500 font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Notify Me When Available
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(NoDeliveryPopup); 