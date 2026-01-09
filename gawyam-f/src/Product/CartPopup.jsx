import React, { useState, useEffect } from 'react';
import { ChevronRight, ShoppingBag } from 'react-feather';
import { useCart } from '../context/cartContext';
import { Link } from 'react-router-dom';

export const CartPopup = () => {
    const { cart } = useCart();
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting , setIsExiting] = useState(false)

    useEffect(() => {
        if (cart.length > 0) {
            setIsVisible(true);
            setIsExiting(false)

            const exiting = setTimeout(()=>{
                setIsExiting(true)
            }, 3500)

            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 4000);

            return () => {
                clearTimeout(exiting)
                clearTimeout(timer)
            }
        }
    }, [cart]);

    const totalCart = cart.reduce((acc , cur)=>  acc + (cur.quantity || 1) , 0)

    if (cart.length === 0 || !isVisible) return null;

    const visibleItems = cart.slice(0, 2);
    const remainingCount = cart.length - visibleItems.length;

    return (
        <div className={`${isExiting ? 'animate-cart-exit' : 'animate-cart-pop'} fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-20 fade-in duration-500 ease-out`}>
            <Link 
                to="/cart"
                className="flex items-center gap-6 py-3 px-5 bg-green-600 hover:bg-green-700 text-white rounded-[2rem] shadow-2xl shadow-green-900/20 transition-all active:scale-95 group border border-white/10"
            >
                {/* Avatar Stack Logic */}
                <div className="flex -space-x-3">
                    {visibleItems.map((item, index) => (
                        <div 
                            key={`${item.id}-${index}`} 
                            className="w-10 h-10 max-[645px]:w-8 max-[645px]:h-8 rounded-full border-2 border-green-600 overflow-hidden bg-white shadow-md"
                            style={{ zIndex: 10 - index }}
                        >
                            <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                    ))}
                    
                    {remainingCount > 0 && (
                        <div className="w-10 h-10 rounded-full border-2 border-green-600 bg-green-100 flex items-center justify-center text-green-700 text-xs font-black z-0 shadow-md">
                            +{remainingCount}
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-100/80">
                        {totalCart} {cart.length === 1 ? 'Item' : 'Items'} <span className='max-[645px]:hidden'>In Basket</span>
                    </span>
                    <span className="text-sm font-bold flex items-center gap-1">
                        <span className='max-[645px]:hidden'>View</span> Cart <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </div>

                <div className="h-8 w-[1px] bg-white/20"></div>

                <div className="flex items-center gap-2">
                    <ShoppingBag size={18} />
                </div>
            </Link>
        </div>
    );
};