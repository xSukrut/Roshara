"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const STORAGE_KEY = "cart_items_v2";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Helper: build a stable key per line item (product + size)
export const lineKey = (product, size) => `${product}__${size || "NOSIZE"}`;

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(load());
  }, []);
  useEffect(() => {
    save(items);
  }, [items]);

  const addItem = ({ product, name, price, image, size, qty = 1 }) => {
    if (!product) return;

    const productId = typeof product === "object" ? product._id : product;

    setItems((prev) => {
      const next = [...prev];
      const idx = next.findIndex(
        (it) => it.product === productId && (it.size || null) === (size || null)
      );
      if (idx >= 0) {
        next[idx] = { ...next[idx], qty: (next[idx].qty || 1) + qty };
      } else {
        next.push({
          product: productId,
          name,
          price: Number(price),
          image,
          size: size || null,
          qty: Number(qty) || 1,
        });
      }
      return next;
    });
  };

  // Set quantity per product + size
  const setQty = (product, size, qty) => {
    setItems((prev) =>
      prev.map((it) =>
        it.product === product && (it.size || null) === (size || null)
          ? { ...it, qty: Math.max(1, Number(qty) || 1) }
          : it
      )
    );
  };

  const removeItem = (product, size = null) => {
    const productId = typeof product === "object" ? product._id : product;

    setItems((prev) =>
      prev.filter(
        (it) =>
          !(it.product === productId && (it.size || null) === (size || null))
      )
    );
  };

  const clear = () => setItems([]);

  // Totals
  const itemsPrice = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.price) * (it.qty || 1), 0),
    [items]
  );

  // You can keep your shipping/tax rules; simple placeholders here:
  const shippingPrice = 0;
  const taxPrice = Math.round(itemsPrice * 0.05); // example 5% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // optional: to open a mini cart if you have one
  const openMiniCart = () => document.dispatchEvent(new Event("openMiniCart"));

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        setQty,
        removeItem,
        clear,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        openMiniCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
