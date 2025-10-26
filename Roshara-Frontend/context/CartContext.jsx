"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]); // [{_id, name, price, image, qty}]
  const [coupon, setCoupon] = useState(null); // { code, discountType, value }
  const [discountAmount, setDiscountAmount] = useState(0);

  // load from storage
  useEffect(() => {
    try {
      const s = localStorage.getItem("cart");
      const parsed = s ? JSON.parse(s) : { items: [], coupon: null, discountAmount: 0 };
      setItems(parsed.items || []);
      setCoupon(parsed.coupon || null);
      setDiscountAmount(parsed.discountAmount || 0);
    } catch {}
  }, []);

  // save to storage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify({ items, coupon, discountAmount }));
  }, [items, coupon, discountAmount]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p._id === product._id);
      if (i > -1) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + qty };
        return copy;
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          qty,
        },
      ];
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((p) => p._id !== id));

  const setQty = (id, qty) =>
    setItems((prev) => prev.map((p) => (p._id === id ? { ...p, qty: Math.max(1, qty) } : p)));

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setDiscountAmount(0);
  };

  const itemsPrice = items.reduce((s, it) => s + it.price * it.qty, 0);
  const totalAfterDiscount = Math.max(0, itemsPrice - discountAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setQty,
        clearCart,
        coupon,
        setCoupon,
        discountAmount,
        setDiscountAmount,
        itemsPrice,
        totalAfterDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
