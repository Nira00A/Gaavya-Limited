import { useState, useEffect } from 'react';

export const useWishlist = () => {
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('gaavya_wishlist');
        if (saved) setWishlist(JSON.parse(saved));
    }, []);

    const toggleWishlist = (item) => {
        const exists = wishlist.find(i => i.id === item.id);
        let updated;
        if (exists) {
            updated = wishlist.filter(i => i.id !== item.id);
        } else {
            updated = [{
                id: item.id,
                title: item.title,
                image: item.image,
                description: item.description
            }, ...wishlist];
        }
        setWishlist(updated);
        localStorage.setItem('gaavya_wishlist', JSON.stringify(updated));
    };

    const isItemInWishlist = (id) => wishlist.some(i => i.id === id);

    return { wishlist, toggleWishlist, isItemInWishlist };
};