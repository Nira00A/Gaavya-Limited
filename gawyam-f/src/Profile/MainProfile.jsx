import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { 
  Package, 
  User, 
  LogOut, 
  ChevronRight, 
} from 'react-feather';
import  ProfileInformation  from './ProfileInformation';
import { useAuth } from '../context/authContext';
import { useProf } from '../context/profileContext';
import { toast } from 'react-toastify';
import NotFound from '../NoFound/404NotFound';
import {LocationPage} from './ManageAddress';
import { WishlistPage } from './Wishlist';
import MyCoupons from './MyCoupons';

const ProfilePage = () => {
  const navigate = useNavigate()
  const { profile } = useProf()
  const { user } = useAuth()
  const [page , setPage] = useState('Profile Information')
  const { logout } = useAuth()
  const sections = [
  {
    section: 'ACCOUNT SETTINGS',
    children: { 
      1: 'Profile Information', 
      2: 'Manage Addresses', 
    }
  },
  {
    section: 'MY STUFF',
    children: { 
      1: 'My Coupons', 
      2: 'My Wishlist'
    }
  }
];

  const renderComponent = () => {
    switch(page){
      case 'Profile Information':
        return <ProfileInformation />
      case 'Manage Addresses':
        return <LocationPage />
      case 'Active Plans':
        return
      case 'Billing History':
        return
      case 'My Coupons':
        return <MyCoupons />
      case 'My Reviews':
        return
      case 'My Wishlist':
        return <WishlistPage />
      default:
        return <ProfileInformation />
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  if (!user) return <NotFound />

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 lg:p-6 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
        
        <aside className="space-y-4 w-full">
          
          <div className="bg-white p-5 flex items-center gap-4 shadow-sm rounded-2xl">
            <div className="w-14 h-14 bg-green-100 rounded-full border-2 border-green-500 flex items-center justify-center overflow-hidden shrink-0">
               <User />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] uppercase tracking-widest text-green-600 font-bold">Welcome,</p>
              <h2 className="text-gray-800 truncate font-semibold">{profile?.name}</h2>
            </div>
          </div>

          <div className="bg-white shadow-sm rounded-2xl overflow-hidden">
            
            <div className="p-4 flex items-center justify-between border-b border-gray-50 hover:bg-green-50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <Package className="w-5 h-5 text-green-600 shrink-0" />
                <span className="font-bold text-gray-700 text-sm">My Milk Orders</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-600" />
            </div>

            {sections.map((item, key) => (
            <div key={key} className="border-b border-gray-100 bg-white">
              <div className="p-4 flex items-center gap-4">
                <User className="w-5 h-5 text-green-600 shrink-0" />
                <span className="font-bold uppercase text-[11px] text-gray-400 tracking-wider">
                  {item.section}
                </span>
              </div>

              <div className="pb-4">
                {Object.values(item.children).map((childName, childKey) => {
                  const isActive = page === childName;

                  return (
                    <div
                      key={childKey}
                      onClick={() => setPage(childName)}
                      className={`
                        relative cursor-pointer py-2 transition-all duration-300 ease-in-out text-sm
                        ${isActive 
                          ? 'bg-green-50 text-green-700 font-bold px-4 border-l-4 border-green-600' 
                          : 'text-gray-600 hover:text-green-600 hover:translate-x-2 px-8 lg:px-12 border-l-4 border-transparent'
                        }
                      `}
                    >
                      {childName}
                    </div>
                  );
                })}
              </div>
            </div>
            ))}

            <button onClick={handleLogout} className="w-full p-4 flex items-center gap-4 hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600">
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="font-bold text-xs uppercase tracking-widest">Log Out</span>
            </button>
          </div>
        </aside>

        <main className="bg-white p-4 lg:p-8 shadow-sm rounded-2xl lg:rounded-3xl min-h-[400px] lg:min-h-[600px] w-full overflow-hidden">
           {renderComponent()}
        </main>

      </div>
    </div>
  );
};

export default ProfilePage;