import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:px-14 px-8 max-[768px]:text-sm">
        
        {/* About Section */}
        <div>
          <h3 className="text-xl font-bold mb-4 max-[768px]:text-base">Gawyam</h3>
          <p className="text-gray-300 leading-relaxed">
            Bringing quality milk and dairy products directly to your home. Freshness guaranteed. 
          </p>
        </div>

        {/* Quick Links */}
        <div className='flex flex-col'>
          <h4 className="text-lg font-semibold mb-4 max-[768px]:text-base">Quick Links</h4>
          <div className="flex flex-col space-y-2 text-gray-300">
           <Link to="/products" className="hover:text-green-300 transition">Products</Link>
           <Link to="/reviews" className="hover:text-green-300 transition">Reviews</Link>
           <Link to="/offers" className="hover:text-green-300 transition">Offers</Link>
           <Link to="/about" className="hover:text-green-300 transition">About Us</Link>
           <Link to="/privacy" className="hover:text-green-300 transition">Privacy</Link>
           <Link to="/terms" className="hover:text-green-300 transition">Terms and Service</Link>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4 max-[768px]:text-base">Contact Us</h4>
          <p className="text-gray-300">UttarPradesh</p>
          <p className="text-gray-300">UP, India</p>
          <p className="text-gray-300 mt-2">Phone: +91 199999999</p>
          <p className="text-gray-300">Email: gawyam@gmail.com</p>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-4 max-[768px]:text-base">Follow Us</h4>
          <div className="flex space-x-4 text-gray-300">
            <a href="https://facebook.com/gawyam" target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition" aria-label="Facebook">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11.549 9.817v-6.944h-2.5v-2.873h2.5v-2.19c0-2.463 1.463-3.82 3.695-3.82 1.07 0 2.188.192 2.188.192v2.41h-1.234c-1.216 0-1.594.755-1.594 1.53v1.867h2.713l-.434 2.873h-2.28v6.945A10 10 0 0022 12z" />
              </svg>
            </a>
            <a href="https://instagram.com/gawyam" target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition" aria-label="Instagram">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm8.5 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-4.5 2a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z"/>
              </svg>
            </a>
            <a href="https://twitter.com/gawyam" target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition" aria-label="Twitter">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.34-1.6.57-2.46.68a4.3 4.3 0 001.88-2.37 8.46 8.46 0 01-2.71 1.03A4.22 4.22 0 0015.5 4c-2.3 0-4.16 1.87-4.16 4.18 0 .33.04.66.1.97C7.7 8.82 4.1 7.1 1.67 4.15a4.26 4.26 0 00-.57 2.1c0 1.45.74 2.73 1.88 3.48a4.12 4.12 0 01-1.88-.5v.05c0 2.03 1.45 3.73 3.37 4.1a4.15 4.15 0 01-1.87.07c.53 1.65 2.07 2.85 3.9 2.88A8.46 8.46 0 012 19.04 11.93 11.93 0 008.29 21c7.55 0 11.67-6.25 11.67-11.67l-.01-.54A8.18 8.18 0 0022.46 6z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>

      <div className="w-full py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start opacity-80 hover:opacity-100 transition-opacity duration-300">
            
            {/* Brand Identity / Icon */}
            <div className="flex-shrink-0 bg-green-600 text-white p-3 rounded-2xl shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" 
              width="24" height="24" viewBox="0 0 24 24" 
              fill="none" stroke="currentColor" strokeWidth="2" 
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>

            {/* Disclaimer Text */}
            <div className="flex-1">
              <h5 className="text-neutral-300 font-bold text-sm uppercase tracking-widest mb-3">Transparency & Care</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-[13px] leading-relaxed text-neutral-300">
                <p>
                  <span className="font-bold text-white">Product Variation:</span> As our dairy is 100% organic and minimally processed, seasonal variations in texture and color are natural. We do not use artificial stabilizers to force "factory-perfect" consistency.
                </p>
                <p>
                  <span className="font-bold text-white">Health Note:</span> Content on this app is for informational purposes only and not a substitute for professional medical advice. Always consult your nutritionist for dairy-related dietary changes.
                </p>
                <p>
                  <span className="font-bold text-white">Storage:</span> Our "Farm-to-Home" promise ends at your doorstep. Please refrigerate all Gavyam products immediately below 4°C to maintain biological integrity and freshness.
                </p>
                <p>
                  <span className="font-bold text-white">Adulteration:</span> We maintain a zero-tolerance policy. Every batch undergoes 20+ rigorous purity checks before it is cleared for delivery to your family.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 mt-8 text-sm">
        &copy; {new Date().getFullYear()} Gawyam. All rights reserved.
      </div>
    </footer>
  );
}
