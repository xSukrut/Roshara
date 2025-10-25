// context/CartContext.jsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i._id === product._id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].qty += qty;
        return copy;
      } else {
        return [...prev, { ...product, qty }];
      }
    });
  };

  const updateQty = (productId, qty) => {
    setItems((prev) => prev.map(i => i._id === productId ? { ...i, qty } : i));
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(i => i._id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemsPrice = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, removeFromCart, clearCart, itemsPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
