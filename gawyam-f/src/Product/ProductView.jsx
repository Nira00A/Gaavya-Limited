import React, { memo, useEffect, useRef, useState } from 'react';
import { Star, Heart, ArrowLeft, Plus, Minus, ShoppingBag, Hexagon, Zap, ChevronDown, ChevronUp } from 'react-feather';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cartContext';
import { Review } from './Review';
import { useWishlist } from '../context/wishlistCustomHook';
import { useProd } from '../context/productContext';
import { toast } from 'react-toastify';
import { useProf } from '../context/profileContext';

const ProductView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, increaseQuantity, decreaseQuantity, cart } = useCart();
    
    const [product, setProduct] = useState(null);
    
    const { getProduct , prodLoading} = useProd();
    const { reviews } = useProf()

    const [selectedServing, setSelectedServing] = useState("");
    const [activeImage, setActiveImage] = useState("");
    const [activeTab, setActiveTab] = useState(false);

    const isReviewInitial = useRef(null)

    useEffect(() => {
        if (!id || isReviewInitial.current === id) return;

        const fetchProduct = async () => {
            try {
                isReviewInitial.current = id

                const data = await getProduct(id);
   
                if (data) {
                    setProduct(data);
                    
                    if (data.gallery && data.gallery.length > 0) {
                        setActiveImage(data.gallery[0]);
                    }

                    const options = data.serving_options || ["500 ml", "1 L"];
                    setSelectedServing(options[0]);
                }
            } catch (error) {
                console.log(error);
                toast.error('Failed to load product');
            }
        };

        fetchProduct();
    }, [id, getProduct]); 

    const { toggleWishlist, isItemInWishlist } = useWishlist();
    const cartItem = cart.find(item => item.id === product?.id);
    const isFavorited = isItemInWishlist(product?.id);

    if (prodLoading) return <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <p className="text-green-800 font-bold animate-pulse">Loading...</p>
          </div>
        </div>
    if (!product) return <div className="p-20 text-center font-bold">Product not found!</div>;

    // Default Serving Options if DB is empty
    const servingOptions = product.serving_options || "500 ml";

    return (
        <div className="bg-white min-h-screen font-sans text-slate-800">
            {/* Header */}
            <header className="sticky top-0 w-full bg-white backdrop-blur-md p-4 flex items-center justify-between z-40 border-b border-gray-100">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={22} />
                </button>
                <div className="text-center">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">
                        Home / {product.category_name || "Product"}
                    </p>
                    <h2 className="font-bold text-sm truncate max-w-[150px]">{product.name}</h2>
                </div>
                <button 
                    onClick={() => toggleWishlist(product)}
                    className="p-2 rounded-full active:scale-75 transition-all"
                >
                    <Heart 
                        size={20} 
                        fill={isFavorited ? "#ef4444" : "none"} 
                        className={isFavorited ? "text-red-500" : "text-neutral-400"}
                    />
                </button>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col">
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-start'>
                    
                    {/* Gallery Section */}
                    <div className="space-y-6 lg:sticky lg:top-24">
                        <div className="bg-[#F3F4F6] rounded-[2.5rem] overflow-hidden aspect-square flex items-center justify-center relative shadow-inner">
                            <img 
                                src={activeImage || "https://via.placeholder.com/400"} 
                                alt={product.name} 
                                className="object-contain w-4/5 h-4/5 hover:scale-110 transition-transform duration-500" 
                            />
                            {/* Veg/Non-Veg Indicator (Assuming is_veg boolean in DB) */}
                            <div className="absolute bottom-6 right-6 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                <div className={`w-4 h-4 border-2 ${product.is_veg === false ? 'border-red-600' : 'border-green-600'} flex items-center justify-center rounded-sm`}>
                                    <div className={`w-2 h-2 rounded-full ${product.is_veg === false ? 'bg-red-600' : 'bg-green-600'}`}></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Thumbnails mapped from 'gallery' */}
                        {product.gallery && product.gallery.length > 0 && (
                            <div className="flex gap-4 overflow-x-auto no-scrollbar justify-center">
                                {product.gallery.map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setActiveImage(img)}
                                        className={`w-20 h-20 rounded-2xl border-2 transition-all overflow-hidden bg-gray-50 flex-shrink-0 ${activeImage === img ? 'border-green-600' : 'border-transparent opacity-60'}`}
                                    >
                                        <img src={img} className="w-full h-full object-contain" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Product Details Accordion */}
                        <div className="md:block lg:block pt-8 border-t border-gray-100">
                            <h4 className="font-semibold text-lg mb-4">Product Details</h4>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4">{product.description}</p>
                            {!activeTab && <button onClick={() => setActiveTab(true)} className="text-green-600 text-sm font-semibold flex items-center gap-1">
                                View more details <ChevronDown size={14}/>
                            </button>}

                            {activeTab && (
                                <div className="overflow-y-auto no-scrollbar pr-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    
                                    {/* Sourcing Origin */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em] mb-3">Sourcing Origin</h4>
                                        <p className="text-slate-500 leading-relaxed italic">
                                            {product.sourcing_origin || "Sourced directly from our certified organic farms."}
                                        </p>
                                    </div>

                                    {/* Benefits / Best Suited For */}
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em] mb-4">Best Suited For</h4>
                                        <div className="p-4 bg-green-50/50 rounded-2xl border border-green-100/50">
                                            <p className="text-xs text-green-700/70 leading-normal">
                                                {product.best_suited_for.join(', ') || "Not Mentioned"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Storage & Usage */}
                                    <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Storage & Usage</h4>
                                        <ul className="space-y-3">
                                            <li className="flex justify-between items-center text-sm border-b border-slate-200/50 pb-2">
                                                <span className="text-slate-500">Shelf Life</span>
                                                <span className="font-semibold text-slate-900">{product.shelf_life || "48 Hours"}</span>
                                            </li>
                                            <li className="flex justify-between items-center text-sm border-b border-slate-200/50 pb-2">
                                                <span className="text-slate-500">Storage Tips</span>
                                                <span className="font-semibold text-slate-900 text-right max-w-[150px]">{product.storage_tips || "Keep Refrigerated"}</span>
                                            </li>
                                            {product.allergen_info && (
                                                <li className="flex justify-between items-center text-sm pb-1">
                                                    <span className="text-slate-500">Allergens</span>
                                                    <span className="font-semibold text-red-500 text-right">{product.allergen_info}</span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    <div className="pt-4 sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pb-2">
                                        <button 
                                            onClick={() => setActiveTab(false)} 
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-semibold text-sm transition-all active:scale-95"
                                        >
                                            View less details <ChevronUp size={16}/>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info & Actions */}
                    <div className="lg:sticky lg:top-24 space-y-8 pb-10">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">{product.name}</h1>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold">
                                    
                                    <Star size={12} fill="currentColor" />
                                </div>
                                <span className="text-gray-400 text-sm font-medium">{reviews.averageRating ? reviews.averageRating : 0} ratings</span>
                            </div>
                        </div>

                        {/* Unit Selection */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Unit</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                
                                    <button 
                                        className={`relative p-4 rounded-2xl border-2 text-left transition-all ${selectedServing  ? 'border-green-600 bg-green-50/30' : 'border-gray-100 bg-white'}`}
                                    >
                                        <p className="font-bold text-sm text-gray-900">{servingOptions}</p>
                                        <p className="text-xs font-medium text-gray-500">₹{product.price}</p>
                                        {selectedServing && (
                                            <div className="absolute -top-2 -right-2 bg-green-600 text-white p-1 rounded-full">
                                                <Hexagon size={12}/>
                                            </div>
                                        )}
                                    </button>

                            </div>
                        </div>

                        {/* Pricing & Add to Cart */}
                        <div className="flex items-center justify-between p-6 bg-slate-50 rounded-xl border border-slate-100">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Total Price</p>
                                <span className="text-3xl font-bold text-slate-900 max-[425px]:text-lg">₹{product.price}</span>
                            </div>
                            
                            {!cartItem ? (
                                <button 
                                    onClick={() => addToCart({ ...product, selectedServing })}
                                    className="max-[425px]:text-base bg-green-600 hover:bg-green-700 text-white max-[425px]:px-4 max-[425px]:py-3 px-8 py-4 rounded-xl font-bold shadow-lg shadow-green-100 flex items-center gap-3 active:scale-95 transition-all"
                                >
                                    <ShoppingBag size={20} /> ADD TO CART
                                </button>
                            ) : (
                                <div className="flex items-center gap-6 bg-green-600 text-white px-6 py-4 rounded-2xl font-bold">
                                    <button onClick={() => decreaseQuantity(product.id, -1)}><Minus size={20}/></button>
                                    <span>{cartItem.quantity}</span>
                                    <button onClick={() => increaseQuantity(product.id, 1)}><Plus size={20}/></button>
                                </div>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 gap-6 pt-6 border-t border-gray-100">
                            <div className="flex gap-4 items-center">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-full"><Zap size={20}/></div>
                                <div>
                                    <h5 className="font-bold text-sm">Superfast Delivery</h5>
                                    <p className="text-xs text-gray-400">Fresh from Gavyam farms to your doorstep.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-full"><Hexagon size={20}/></div>
                                <div>
                                    <h5 className="font-bold text-sm">Best Price & Quality</h5>
                                    <p className="text-xs text-gray-400">Direct from farm, no middlemen.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Review Section */}
                <Review itemId={id}/>
            </main>
        </div>
    );
};

export default React.memo(ProductView)