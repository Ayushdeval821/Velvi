import React, { createContext, useContext, useState, useEffect } from 'react';
import * as cartService from '../services/cartService.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('velvi_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  // Sync from backend when user logs in
  useEffect(() => {
    if (user) {
      loadBackendCart();
    }
  }, [user]);

  // Persist guest cart to local storage
  useEffect(() => {
    localStorage.setItem('velvi_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const loadBackendCart = async () => {
    try {
      setLoading(true);
      const res = await cartService.getCart();
      if (res.data) {
        // Map backend cart item to format { product, quantity }
        const mapped = res.data.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        }));
        setCartItems(mapped);
      }
    } catch (err) {
      console.error('Failed to load backend cart:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        const res = await cartService.addToCart(product._id, quantity);
        if (res.data) {
          setCartItems(
            res.data.map((item) => ({
              product: item.product,
              quantity: item.quantity,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to add to cart on server:', err.message);
        throw err;
      }
    } else {
      // Guest cart
      setCartItems((prev) => {
        const existing = prev.find((item) => item.product._id === product._id);
        if (existing) {
          return prev.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { product, quantity }];
      });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);

    if (user) {
      try {
        const res = await cartService.updateCartItem(productId, quantity);
        if (res.data) {
          setCartItems(
            res.data.map((item) => ({
              product: item.product,
              quantity: item.quantity,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to update quantity on server:', err.message);
        throw err;
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const res = await cartService.removeFromCart(productId);
        if (res.data) {
          setCartItems(
            res.data.map((item) => ({
              product: item.product,
              quantity: item.quantity,
            }))
          );
        }
      } catch (err) {
        console.error('Failed to remove from cart on server:', err.message);
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item.product._id !== productId));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.error('Failed to clear cart on server:', err.message);
      }
    }
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      item.product.discountPrice && item.product.discountPrice < item.product.price
        ? item.product.discountPrice
        : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Free shipping on orders over ₹299
  const shipping = subtotal >= 299 || subtotal === 0 ? 0 : 49;
  const grandTotal = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        shipping,
        grandTotal,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
