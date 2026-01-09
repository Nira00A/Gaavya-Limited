import React, { useMemo, useState } from 'react';
import { useCart } from '../context/cartContext';
import { Heart, ShoppingBag, Search, RefreshCw, Filter, X } from 'react-feather'; // Added Filter/X icons
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/wishlistCustomHook';
import { useProd } from '../context/productContext';

const brands = ["Gawyam Original", "Farm-Fresh", "Vedic-Choice", "Organic-India"];

const priceRange = [
    { id: 1, label: "Under 100", min: 0, max: 100 },
    { id: 2, label: "100 - 300", min: 100, max: 300 },
    { id: 3, label: "Above 300", min: 300, max: 10000 }
];

const GawyamStore = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    // ✅ FIX 1: Default to 0 ("All Products") instead of 1
    const [activeCategory, setActiveCategory] = useState(0); 
    const [activePriceId, setActivePriceId] = useState(null);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false); // New State for Mobile

    const { products, categories } = useProd();
    const { toggleWishlist, isItemInWishlist } = useWishlist();

    const filteredProducts = useMemo(() => {
        return (products || []).filter(product => {
            const matchCategory = activeCategory === 0 || product.category_id === activeCategory;
            
            const activeRange = priceRange.find(p => p.id === activePriceId);
            const matchPrice = !activePriceId || (activeRange && product.price >= activeRange.min && product.price <= activeRange.max);

            const matchBrand = selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand));

            return matchCategory && matchPrice && matchBrand;
        });
    }, [activeCategory, activePriceId, selectedBrands, products]);

    const handleClick = (id) => {
        navigate(`/product/${id}`);
    };

    const toggleBrand = (brand) => {
        setSelectedBrands(prev => 
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    // Reusable Sidebar Content (For both Desktop & Mobile)
    const FilterSidebar = () => (
        <div className="space-y-8">
             <div className="flex lg:hidden justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-neutral-700">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}><X /></button>
            </div>

            <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-lg">Price Range</h4>
                    <button onClick={() => setActivePriceId(null)} className="text-xs text-green-600 font-bold uppercase hover:underline">Reset</button>
                </div>
                <div className='flex flex-wrap gap-3 w-full'>
                    {priceRange.map((item) => (
                        <div key={item.id} onClick={() => setActivePriceId(item.id)} className="cursor-pointer group">
                            <div className={`
                                inline-flex items-center justify-center px-4 py-1.5 font-bold text-sm border rounded-full transition-all duration-300
                                ${activePriceId === item.id 
                                    ? 'bg-green-600 text-white border-green-500 scale-105 shadow-md' 
                                    : 'bg-neutral-100 text-neutral-600 border-neutral-200 group-hover:bg-green-50 group-hover:text-green-600'}
                            `}>
                                ₹ {item.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Brand Filter */}
            <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-50">
                <h4 className="font-bold text-lg mb-4">Brand</h4>
                <div className="space-y-4">
                    {brands.map(brand => (
                        <label key={brand} className="flex items-center justify-between cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                            <span className={`transition-colors ${selectedBrands.includes(brand) ? 'text-green-600 font-bold' : 'text-slate-500'}`}>
                                {brand}
                            </span>
                            <input 
                                type="checkbox" 
                                checked={selectedBrands.includes(brand)}
                                onChange={() => toggleBrand(brand)} 
                                className="w-5 h-5 rounded-lg border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer accent-green-600" 
                            />
                        </label>
                    ))}
                </div>
            </section>
        </div>
    );

    return (
        <div className="bg-[#F8F9FB] min-h-screen text-neutral-500 font-sans">
            
            {/* --- TOP CATEGORY BAR --- */}
            <div className="bg-white w-full border-b border-gray-100 sticky top-0 z-30 px-4 py-1 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    
                    {/* Categories Scroll */}
                    <div className="flex gap-3 overflow-x-auto no-scrollbar py-1 flex-1">
                        {/* ✅ FIX 3: Added 'All' Button manually */}
                        <button 
                            onClick={() => setActiveCategory(0)}
                            className={`max-[425px]:text-xs px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                                activeCategory === 0 ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-gray-200'
                            }`}
                        >
                            All Products
                        </button>

                        {(categories || []).map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`max-[425px]:text-xs px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                                    activeCategory === cat.id ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-slate-500 border border-gray-200'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* ✅ FIX 4: Mobile Filter Toggle Button */}
                    <button 
                        className="lg:hidden p-2 bg-gray-100 rounded-full text-gray-600"
                        onClick={() => setShowMobileFilters(true)}
                    >
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* --- DESKTOP SIDEBAR --- */}
                <aside className="hidden lg:block sticky top-24 h-fit">
                    <FilterSidebar />
                </aside>

                {/* --- MOBILE SIDEBAR DRAWER --- */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
                        <div className="absolute right-0 top-0 bottom-0 w-3/4 max-w-xs bg-white p-6 overflow-y-auto shadow-2xl animate-slide-in">
                            <FilterSidebar />
                        </div>
                    </div>
                )}

                {/* --- PRODUCTS GRID --- */}
                <div className="lg:col-span-3">
                    <header className="flex justify-between items-center mb-6">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Showing {filteredProducts.length} Products
                        </p>
                    </header>

                    {filteredProducts.length === 0 ? 
                    <div className="flex flex-col items-center justify-center py-20 px-6 rounded-[3rem] border-slate-100 text-center animate-fade-in">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-green-100 rounded-full blur-3xl opacity-40 scale-150"></div>
                            <div className="relative bg-green-50 p-6 rounded-full text-green-600">
                                <Search size={40} strokeWidth={2} />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-neutral-600 mb-2">
                            The cows are still grazing!
                        </h3>
                        
                        <p className="text-slate-400 max-w-[300px] mx-auto text-sm leading-relaxed mb-8">
                            We couldn’t find any products matching those filters. Try widening your search.
                        </p>

                        <button 
                            onClick={() => {
                                setActiveCategory(0);
                                setActivePriceId(null);
                                setSelectedBrands([]);
                            }}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-green-200"
                        >
                            <RefreshCw size={18} />
                            <span>Clear All Filters</span>
                        </button>
                    </div>
                    :       
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProducts.map((item) => (
                            <div onClick={() => handleClick(item.id)} key={item.id} className="bg-white rounded-[2rem] p-4 shadow-sm border border-transparent hover:border-green-100 hover:shadow-xl transition-all group relative cursor-pointer">
                                
                                {/* Image Area */}
                                <div className="bg-[#F2F4F7] aspect-square rounded-[1.5rem] mb-4 flex items-center justify-center relative overflow-hidden">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleWishlist(item);
                                        }}
                                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 active:scale-90 transition-all z-10"
                                    >
                                        <Heart 
                                            size={18} 
                                            fill={isItemInWishlist(item?.id) ? "#ef4444" : "none"} 
                                            className={isItemInWishlist(item?.id) ? "text-red-500" : "text-neutral-400"}
                                        />
                                    </button>
                                    
                                    {/* ✅ FIX 5: Handle Image Source safely */}
                                    <img 
                                        src={item.image_url || item.img || "https://placehold.co/200?text=No+Image"} 
                                        alt={item.name} 
                                        className="w-3/4 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                                    />
                                </div>

                                {/* Content */}
                                <div className="px-1">
                                    <h3 className="text-base font-bold text-neutral-700 mb-1 leading-tight truncate">{item.name}</h3>
                                    <p className="text-xs text-slate-400 mb-4">{item.description ? item.description.substring(0, 40) + '...' : 'Fresh & Organic'}</p>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-extrabold text-green-700">₹{item.price}</span>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(item);
                                            }} 
                                            className="bg-green-50 text-green-700 p-2.5 rounded-xl hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <ShoppingBag size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    }
                </div>
            </main>
        </div>
    );
};

export default GawyamStore;