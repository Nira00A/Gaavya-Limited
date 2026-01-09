import React, { useState } from 'react';
import { useCoupon } from "../context/couponContext";
import { Copy, CheckCircle, Clock } from "react-feather";

export default function MyCoupons() {
    const { coupons, couponLoading } = useCoupon();
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No Expiry";
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    if (couponLoading) return (
        <div className="flex justify-center items-center h-64 text-green-600 animate-pulse">
            Loading your rewards...
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold text-neutral-700 mb-8 flex items-center gap-2">
                My Coupons
            </h2>
            
            {coupons.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="text-6xl mb-4">🏷️</div>
                    <p className="text-neutral-400 font-medium">You don't have any coupons yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {coupons.map((item) => (
                        <div key={item.id} className="group relative flex bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
                            
                            {/*LEFT SIDE*/}
                            <div className="w-1/3 bg-green-50 flex flex-col items-center justify-center p-4 border-r-2 border-dashed border-green-200 relative">
                                {/* Semi-circles for 'ticket' look */}
                                <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#F8F9FB] rounded-full border border-gray-100"></div>
                                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-[#F8F9FB] rounded-full border border-gray-100"></div>

                                <span className="text-3xl font-black text-green-600">
                                    {item.discount_type === 'percentage' 
                                        ? `${item.discount_value}%` 
                                        : `₹${item.discount_value}`
                                    }
                                </span>
                                <span className="text-xs font-bold text-green-700 uppercase tracking-wider mt-1">OFF</span>
                            </div>

                            {/*RIGHT SIDE*/}
                            <div className="flex-1 p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-neutral-700 text-lg">{item.code}</h3>
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                                            {item.is_active ? 'Active' : 'Used'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                                        {item.description || "Applicable on your next order of fresh farm products."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-1 text-xs text-neutral-400 font-medium">
                                        <Clock size={12} />
                                        <span>Expires: {formatDate(item.expiry_date)}</span>
                                    </div>

                                    <button 
                                        onClick={() => handleCopy(item.code, item.id)}
                                        className="flex items-center gap-1 text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
                                    >
                                        {copiedId === item.id ? (
                                            <>
                                                <CheckCircle size={16} /> Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={16} /> Copy Code
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}