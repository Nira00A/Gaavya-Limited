import { useState } from 'react';
import PlacePopup from './placePopup';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { User } from 'react-feather'

export default function Header() {
  const [appButton, setAppButton] = useState(false);
  const [place, setPlace] = useState(() => {
    const saved = localStorage.getItem('Delivary_location');
    return saved ? JSON.parse(saved) : 'Uttarpradesh';
  });
  const [showPopup, setShowPopup] = useState(false);
  const { user , isAuthLoading} = useAuth()

  const handleAppButton = () => {
    setAppButton(true);
  };

  const handlePlaceClick = () => {
    setShowPopup(true);
  };

  if (isAuthLoading) return <div className="h-16 bg-white" />

  return (
    <header className="relative shadow-md overflow-hidden">
      <div className="flex justify-center items-center max-[768px]:justify-between py-4">
        {showPopup && <PlacePopup place={place} setPlace={setPlace} onClose={setShowPopup} />}
        
        {/* Logo */}
        <div className="flex flex-row flex-shrink-0 pr-6 min-[966px]:pr-16 gap-2 max-[768px]:ml-4">
          <Link to={'/'}>
            <img
              src="https://res.cloudinary.com/dpbzzbag3/image/upload/v1767963025/file_zgxl5c.jpg"
              alt="Gawyam Logo"
              className="h-12 w-12 object-cover rounded-full"
            />
          </Link>
          <div className='flex flex-col'>
            <div className='text-sm font-medium text-gray-700'>Deliver In</div>
            <div onClick={handlePlaceClick} className='text-md font-semibold cursor-pointer'>{place}</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex gap-6 pr-16 items-center min-[966px]:gap-12 max-md:hidden">
          <Link to={'/product'} className="text-sm text-gray-700 hover:text-green-600 font-medium transition">
            Product
          </Link>
          <Link to={"/quality_report"} className="text-sm text-gray-700 hover:text-green-600 font-medium transition">
            Quality Report
          </Link>
          <Link to={'/about'} className="text-sm text-gray-700 hover:text-green-600 font-medium transition">
            About
          </Link>
        </nav>

        {/* Action Buttons Area */}
        <div className='flex gap-3 items-center'>
          <button
            onClick={handleAppButton}
            className="text-sm hidden md:block relative px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105"
          >
            Download
            <span className="hidden min-[846px]:inline"> The App</span>
          </button>

          {/* Cart Icon */}
          <Link 
            to={'/cart'}
            className='p-3 bg-neutral-200 rounded-full mx-1'
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="black">
              <path d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z"/>
            </svg>
          </Link>

          {user ? 
          (
            <Link 
            to={'/profile'}
            className='p-3 bg-neutral-200 rounded-full mx-1'>
              <User size={20}/>
            </Link>
          ):
          (
            <Link 
              to={'/login'}
              className="max-[768px]:mr-4 px-6 py-2 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-lg transition transform hover:scale-105 max-sm:text-sm whitespace-nowrap"
            >
              Login
            </Link>
          )}
        </div>

        {/* App Download Popup Logic */}
        {appButton && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative flex flex-col">
              <button
                onClick={() => setAppButton(false)}
                className="absolute top-0 right-1 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close popup"
              >
                &times;
              </button>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-4">Join Now for a Free Item!</h2>
                  <p className="text-gray-600 mb-6">Sign up today and claim your exclusive free product.</p>
                </div>
                <div className="flex-shrink-0 w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xl">
                  QR Code
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <button className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition transform hover:scale-105">
                  Get it on Google Play
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </header>
  );
}