import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './authContext';
import api from '../axiosApi/api'
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user} = useAuth()
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('gawyam_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('gawyam_cart', JSON.stringify(cart));
  }, [cart]);

  
  useEffect(() => {
    if(cart.length >= 0 && user){
      const interval = setTimeout(async() => {
        try {
          await api.post('/cart/add/sync' , {cart} )

        } catch (error) {
          toast.error(error)
        }
      }, 3000)
      return() => clearTimeout(interval)
    }
  },[cart , user])

  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0) 
    );
  };

  const removeItem = (id) => setCart(cart.filter((item) => item.id !== id));

  const clearCart = () => {
    localStorage.removeItem('gawyam_cart')
    setCart([])
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        increaseQuantity, 
        decreaseQuantity, 
        removeItem, 
        clearCart,
        totalItems, 
        totalPrice 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);