// context/WishlistContext.jsx
"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
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

  const inWishlist = (productId) =>
    items.some((p) => String(p.product) === String(productId));

  const add = (item) => {
    setItems((prev) => {
      if (prev.some((p) => String(p.product) === String(item.product))) return prev;
      return [item, ...prev];
    });
  };

  const remove = (productId) => {
    setItems((prev) => prev.filter((p) => String(p.product) !== String(productId)));
  };

  const toggle = (item) => {
    if (inWishlist(item.product)) remove(item.product);
    else add(item);
  };

  const clear = () => setItems([]);

  const value = useMemo(
    () => ({ items, add, remove, toggle, inWishlist, clear, ready, count: items.length }),
    [items, ready]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
