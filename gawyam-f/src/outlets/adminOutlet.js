import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdmin } from '../Admin/adminContext/adminAuthContext';

export default function AdminOutlet() {
  const { pathname } = useLocation();
  const { logoutAdmin } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/admin' && pathname !== '/admin') return false;
    return pathname.startsWith(path);
  };

  const navLinks = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Products", path: "/admin/products", icon: "📦" },
    { name: "Categories", path: "/admin/categories", icon: "🗂️" },
    { name: "Orders", path: "/admin/orders", icon: "🛍️" },
    { name: "Coupons", path: "/admin/coupons", icon: "🎟️" },
  ];

  const handleLogout = async () => {
    try {
      const res = await logoutAdmin();
      toast.success(res.success);
      setIsSidebarOpen(false);
    } catch (error) {
      toast.error('Error in logging out');
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      
      {/* --- MOBILE OVERLAY BACKDROP --- */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-black/50 md:hidden transition-opacity"
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 
          flex flex-col shadow-sm transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static 
        `}
      >
        
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-blue-600 tracking-wide">
            GAAVYA <span className="text-gray-400 text-sm font-normal">Admin</span>
          </h1>
          {/* Close button for mobile only */}
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="md:hidden text-gray-500 hover:text-red-500 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              onClick={() => setIsSidebarOpen(false)} // Close sidebar when clicking a link on mobile
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200
                ${isActive(link.path) 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <span className="text-lg">{link.icon}</span>
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">Logout</button>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0"> 
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 sticky top-0 z-10 gap-4">
           
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
             </svg>
           </button>

           <div className="flex-1 flex items-center justify-between">
             <h2 className="text-gray-700 font-semibold capitalize truncate">
               {pathname.split('/')[2] || 'Dashboard'}
             </h2>
             <div className="text-sm text-gray-500 hidden sm:block">
               {new Date().toLocaleDateString()}
             </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}