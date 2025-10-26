"use client";
import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]); // [{product, name, price, image, ...}]
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("wishlist", JSON.stringify(items));
  }, [items, ready]);

  const inWishlist = (productId) => items.some((p) => p.product === productId);

  const add = (item) => {
    setItems((prev) => {
      if (prev.some((p) => p.product === item.product)) return prev; // already there
      return [item, ...prev];
    });
  };

  const remove = (productId) => {
    setItems((prev) => prev.filter((p) => p.product !== productId));
  };

  const toggle = (item) => {
    if (inWishlist(item.product)) remove(item.product);
    else add(item);
  };

  const clear = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ items, add, remove, toggle, inWishlist, clear, ready }}>
      {children}
    </WishlistContext.Provider>
  );
}
