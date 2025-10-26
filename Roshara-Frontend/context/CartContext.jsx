"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const getPid = (it) => it?.product || it?._id || it?.id;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  const openMiniCart = () => setMiniCartOpen(true);
  const closeMiniCart = () => setMiniCartOpen(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, ready]);

  const addItem = (item, qty = 1) => {
    const pid = getPid(item);
    const normalized = { ...item, product: pid };
    setItems((prev) => {
      const existing = prev.find((p) => getPid(p) === pid);
      if (existing) {
        return prev.map((p) =>
          getPid(p) === pid ? { ...p, qty: (p.qty || 1) + qty } : p
        );
      }
      return [...prev, { ...normalized, qty }];
    });
  };

  const setQty = (productId, qty) => {
    setItems((prev) =>
      prev.map((p) =>
        getPid(p) === productId ? { ...p, qty: Math.max(qty, 1) } : p
      )
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((p) => getPid(p) !== productId));
  };

  const clear = () => setItems([]);

  const validItems = Array.isArray(items) ? items : [];
  const itemsPrice = validItems.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1),
    0
  );
  const shippingPrice = itemsPrice > 999 ? 0 : 49;
  const taxPrice = Math.round(itemsPrice * 0.05);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        items: validItems,
        addItem,
        setQty,
        removeItem,
        clear,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        ready,
        miniCartOpen,
        openMiniCart,
        closeMiniCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
