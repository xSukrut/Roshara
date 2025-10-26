// "use client";
// import { createContext, useContext, useEffect, useState } from "react";

// const CartContext = createContext();
// export const useCart = () => useContext(CartContext);

// export function CartProvider({ children }) {
//   const [items, setItems] = useState([]);
//   const [ready, setReady] = useState(false);
//   const [showMiniCart, setShowMiniCart] = useState(false);
//   const [miniCartOpen, setMiniCartOpen] = useState(false);

//   const openMiniCart = () => setShowMiniCart(true);
//   const closeMiniCart = () => setShowMiniCart(false);

//   // ✅ Load cart from localStorage
//   useEffect(() => {
//     try {
//       const stored = localStorage.getItem("cart");
//       if (stored) {
//         const parsed = JSON.parse(stored);
//         if (Array.isArray(parsed)) {
//           setItems(parsed);
//         } else {
//           setItems([]); // fallback if malformed
//         }
//       }
//     } catch (err) {
//       console.error("Failed to load cart:", err);
//       setItems([]);
//     } finally {
//       setReady(true);
//     }
//   }, []);

//   // ✅ Persist to localStorage whenever items change
//   useEffect(() => {
//     if (ready) {
//       localStorage.setItem("cart", JSON.stringify(items));
//     }
//   }, [items, ready]);

//   // ✅ Add an item
//   const addItem = (item, qty = 1) => {
//     setItems((prev) => {
//       const existing = prev.find((p) => p.product === item.product);
//       if (existing) {
//         return prev.map((p) =>
//           p.product === item.product ? { ...p, qty: p.qty + qty } : p
//         );
//       }
//       return [...prev, { ...item, qty }];
//     });
//   };

//   // ✅ Update quantity
//   const setQty = (productId, qty) => {
//     setItems((prev) =>
//       prev.map((p) =>
//         p.product === productId ? { ...p, qty: Math.max(qty, 1) } : p
//       )
//     );
//   };

//   // ✅ Remove one item
//   const removeItem = (productId) => {
//     setItems((prev) => prev.filter((p) => p.product !== productId));
//   };

//   // ✅ Clear all
//   const clear = () => setItems([]);

//   // ✅ Calculate prices (guard for non-array)
//   const validItems = Array.isArray(items) ? items : [];
//   const itemsPrice = validItems.reduce(
//     (sum, it) => sum + (it.price || 0) * (it.qty || 1),
//     0
//   );
//   const shippingPrice = itemsPrice > 999 ? 0 : 49;
//   const taxPrice = Math.round(itemsPrice * 0.05);
//   const totalPrice = itemsPrice + shippingPrice + taxPrice;

//   return (
//     <CartContext.Provider
//       value={{
//         items: validItems,
//         addItem,
//         setQty,
//         removeItem,
//         clear,
//         itemsPrice,
//         shippingPrice,
//         taxPrice,
//         totalPrice,
//         ready,
//         miniCartOpen,
//         openMiniCart,
//         closeMiniCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false); // ✅ only one variable

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
    setItems((prev) => {
      const existing = prev.find((p) => p.product === item.product);
      if (existing) {
        return prev.map((p) =>
          p.product === item.product ? { ...p, qty: p.qty + qty } : p
        );
      }
      return [...prev, { ...item, qty }];
    });
  };

  const setQty = (productId, qty) => {
    setItems((prev) =>
      prev.map((p) =>
        p.product === productId ? { ...p, qty: Math.max(qty, 1) } : p
      )
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((p) => p.product !== productId));
  };

  const clear = () => setItems([]);

  const validItems = Array.isArray(items) ? items : [];
  const itemsPrice = validItems.reduce(
    (sum, it) => sum + (it.price || 0) * (it.qty || 1),
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
