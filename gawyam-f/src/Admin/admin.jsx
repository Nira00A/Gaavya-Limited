import React, { useEffect, useState } from 'react';
import { useLoading } from '../context/loadingContext';
import { toast } from 'react-toastify';
import adminApi from '../axiosApi/adminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    users: 0,
    pending_orders: 0,
    delivered_orders: 0,
    low_stock: 0
  });
  const [activity, setActivity] = useState([]);
  const { startLoading , stopLoading} = useLoading()

  useEffect(() => {
    startLoading()
    const fetchStats = async () => {
      try {
        const res = await adminApi.get('/dashboard-stats');
        if (res.data.success) {
          setStats(res.data.stats);
          setActivity(res.data.recent_activity);
        }
      } catch (error) {
        toast.error(error?.response?.data?.error || 'Error please refresh')
        console.error("Failed to load stats", error);
      } finally {
        stopLoading()
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6 m-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      {/* --- STATS CARDS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
            <p className="max-[650px]:text-base text-xl font-bold text-gray-800">₹{stats.revenue}</p>
          </div>
        </div>

        {/* Card 2: Users */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Users</p>
            <p className="max-[650px]:text-base text-xl font-bold text-gray-800">{stats.users}</p>
          </div>
        </div>

        {/* Card 3: Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Orders</p>
            <div className="flex gap-2 text-sm">
               <span className="text-orange-600 font-semibold">{stats.pending_orders} Pending</span>
               <span className="text-gray-300">|</span>
               <span className="text-green-600 font-semibold">{stats.delivered_orders} Done</span>
            </div>
          </div>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Low Stock</p>
            <p className={`max-[650px]:text-base text-xl font-bold ${stats.low_stock > 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {stats.low_stock} Items
            </p>
          </div>
        </div>
      </div>

      {/* --- RECENT ACTIVITY SECTION --- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
        
        {activity.length === 0 ? (
          <p className="text-gray-500">No recent activity found.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {activity.map((item) => (
              <div key={item.id} className="py-3 flex justify-between items-center hover:bg-gray-50 p-2 rounded transition">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    New Order #{item.id} Placed
                  </p>
                  <p className="text-xs text-gray-500">
                    User ID: {item.user_id} • ₹{item.total_amount}
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;