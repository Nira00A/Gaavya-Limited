import { Link } from 'react-router-dom';
import { Trash2, ExternalLink } from 'react-feather';
import { useWishlist } from '../context/wishlistCustomHook';

export const WishlistPage = () => {
    const { wishlist, toggleWishlist } = useWishlist();

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-8">My Favorites</h2>
            
            {wishlist.length === 0 ? (
                <div className="text-center py-20 text-neutral-400">
                    Your wishlist is empty. Start adding some dairy!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                        <div key={item.id} className="border rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all">
                            <img src={item.image} alt="" className="w-full h-44 object-cover" />
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                <p className="text-sm text-neutral-500 line-clamp-2 mb-4">{item.description}</p>
                                
                                <div className="flex gap-2">
                                    <Link 
                                        to={`/product/${item.id}`} 
                                        className="flex-1 bg-neutral-100 text-neutral-800 py-2 rounded-lg font-bold text-center flex items-center justify-center gap-1 hover:bg-neutral-200"
                                    >
                                        Details <ExternalLink size={14} />
                                    </Link>
                                    <button 
                                        onClick={() => toggleWishlist(item)}
                                        className="p-2 text-red-500 border border-red-100 rounded-lg hover:bg-red-50"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};