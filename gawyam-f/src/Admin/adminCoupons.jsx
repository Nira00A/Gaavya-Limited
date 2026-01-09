import React, { useState, useEffect } from 'react';
import adminApi from '../axiosApi/adminApi';
import { toast } from 'react-toastify';
import { Plus, Trash2, CheckCircle, XCircle, Calendar, X } from 'react-feather';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedProductId , setExpandedProductId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'PERCENTAGE', 
    discount_value: '',
    expiry_date: '',
    description: '',
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await adminApi.get('/coupons');
      if (res.data.success) {
          setCoupons(res.data.coupons || []); 
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load coupons");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminApi.post('/coupons/add', formData);
      toast.success("Coupon Created Successfully!");
      
      // Add new coupon to list immediately
      setCoupons(prev => [res.data.coupon, ...prev]);
      
      setIsFormOpen(false);
      setFormData({ 
        code: '', discount_type: 'PERCENTAGE', discount_value: '', 
        expiry_date: '', description: '' 
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await adminApi.patch(`/coupons/${id}/toggle`, { is_active: !currentStatus });
      toast.success(currentStatus ? "Coupon Deactivated" : "Coupon Activated");
      fetchCoupons();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
        await adminApi.delete(`/coupons/${id}`);
        toast.success("Coupon deleted");
        setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
        toast.error("Delete failed");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      
      {/* --- STATS HEADER --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-2 pl-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-50 p-2 rounded-lg text-blue-500"><Plus size={20} /></div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Coupons</p>
            <h3 className="text-xl font-semibold text-gray-800">{coupons.length}</h3>
          </div>
        </div>
        
        <div className="bg-white p-2 pl-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-50 p-2 rounded-lg text-green-600"><CheckCircle size={20} /></div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Active Now</p>
            <h3 className="text-xl font-semibold text-gray-800">{coupons.filter(c => c.is_active).length}</h3>
          </div>
        </div>

        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          <div className="bg-white/20 p-1.5 rounded-lg"><Plus size={20} /></div>
          <span className="font-semibold uppercase tracking-wider text-sm">Create Coupon</span>
        </button>
      </div>

      {/* --- CREATE MODAL --- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-700">Create New Coupon</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Coupon Code</label>
                    <input name="code" value={formData.code} onChange={handleInputChange} placeholder="e.g. WELCOME50" className="w-full p-3 border rounded-lg font-bold uppercase tracking-widest focus:ring-2 focus:ring-blue-500 outline-none" required />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Expires On</label>
                    <input name="expiry_date" type="date" value={formData.expiry_date} onChange={handleInputChange} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Type</label>
                    <select name="discount_type" value={formData.discount_type} onChange={handleInputChange} className="w-full p-3 border rounded-lg bg-white">
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FLAT">Flat (₹)</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Value</label>
                    <input name="discount_value" type="number" value={formData.discount_value} onChange={handleInputChange} placeholder="e.g. 10" className="w-full p-3 border rounded-lg" required />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description (User Visible)</label>
                <input name="description" value={formData.description} onChange={handleInputChange} placeholder="e.g. 10% off on your first order" className="w-full p-3 border rounded-lg" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors mt-2 shadow-lg">
                {loading ? 'Creating...' : 'Launch Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- COUPON TABLE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Code</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Discount</th>
              {/* HIDDEN ON MOBILE (< 900px) */}
              <th className="hidden min-[900px]:table-cell px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
              <th className="hidden min-[900px]:table-cell px-6 py-4 text-xs font-bold text-gray-400 uppercase">Validity</th>
              <th className="hidden min-[900px]:table-cell px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {coupons.map((coupon) => (
              <React.Fragment key={coupon.id}>
                {/* MAIN ROW */}
                <tr 
                  onClick={() => setExpandedProductId(expandedProductId === coupon.id ? null : coupon.id)} 
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${expandedProductId === coupon.id ? 'bg-blue-50/50' : ''}`}
                >
                  <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800 tracking-wider bg-gray-100 inline-block px-3 py-1 rounded-md border border-gray-200">
                          {coupon.code}
                      </div>
                      {/* Show basic description on mobile row if needed, or keep clean */}
                      <div className="min-[900px]:hidden text-xs text-blue-500 mt-2 font-semibold">
                          {expandedProductId === coupon.id ? 'Tap to close' : 'Tap for details'}
                      </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-600">
                      {coupon.discount_type === 'FLAT' ? `₹${coupon.discount_value} OFF` : `${coupon.discount_value}% OFF`}
                  </td>

                  {/* DESKTOP COLUMNS (HIDDEN ON MOBILE) */}
                  <td className="hidden min-[900px]:table-cell px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${coupon.is_active ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                          {coupon.is_active ? 'Active' : 'Inactive'}
                      </span>
                  </td>
                  <td className="hidden min-[900px]:table-cell px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : 'Lifetime'}
                      </div>
                  </td>
                  <td className="hidden min-[900px]:table-cell px-6 py-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                            onClick={(e) => { e.stopPropagation(); toggleStatus(coupon.id, coupon.is_active); }}
                            className={`p-2 rounded-lg transition-colors ${coupon.is_active ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                            title={coupon.is_active ? "Deactivate" : "Activate"}
                        >
                            {coupon.is_active ? <XCircle size={18} /> : <CheckCircle size={18} />}
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(coupon.id); }}
                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                      </div>
                  </td>
                </tr>

                {/* EXPANDED VIEW (MOBILE DETAILS + DESCRIPTION) */}
                {expandedProductId === coupon.id && (
                  <tr className="bg-gray-50 animate-fade-in">
                    <td colSpan="5" className="p-6 border-t border-gray-100 shadow-inner">
                      
                      {/* 1. Mobile-Only Details Section */}
                      <div className="min-[900px]:hidden grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
                         <div>
                            <div className='font-bold text-gray-400 text-xs uppercase mb-1'>Status</div>
                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${coupon.is_active ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                              {coupon.is_active ? 'Active' : 'Inactive'}
                            </span>
                         </div>
                         <div>
                            <div className='font-bold text-gray-400 text-xs uppercase mb-1'>Validity</div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                              <Calendar size={14} />
                              {coupon.expiry_date ? new Date(coupon.expiry_date).toLocaleDateString() : 'Lifetime'}
                            </div>
                         </div>
                         
                         {/* Mobile Actions */}
                         <div className="col-span-2 flex gap-3 mt-2">
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleStatus(coupon.id, coupon.is_active); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-colors ${coupon.is_active ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}
                            >
                                {coupon.is_active ? <><XCircle size={16}/> Deactivate</> : <><CheckCircle size={16}/> Activate</>}
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(coupon.id); }}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-100 text-red-700 rounded-lg font-bold text-sm hover:bg-red-200"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                         </div>
                      </div>

                      {/* 2. Common Details (Description) */}
                      <div>
                        <div className='font-bold text-gray-400 text-xs uppercase'>Description</div>
                        <div className='text-gray-700 text-sm mt-1 bg-white p-3 rounded-lg border border-gray-200 inline-block'>
                          {coupon.description || "No description provided."}
                        </div>
                      </div>

                    </td> 
                  </tr>
                )}
              </React.Fragment>
            ))}
            
            {coupons.length === 0 && (
                <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">No coupons found. Create one to get started!</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoupons;