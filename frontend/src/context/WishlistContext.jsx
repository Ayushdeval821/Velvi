import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('velvi_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('velvi_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = async (product) => {
    const exists = wishlist.some((p) => p._id === product._id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p._id !== product._id));
    } else {
      setWishlist((prev) => [...prev, product]);
    }

    if (user) {
      try {
        await API.post(`/wishlist/${product._id}`);
      } catch (err) {
        console.error('Failed to sync wishlist with server:', err.message);
      }
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
