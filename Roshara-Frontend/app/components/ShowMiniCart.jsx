"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import Image from "next/image";
import { X } from "lucide-react";
import Link from "next/link";

export default function ShowMiniCart() {
  const {
    items,
    miniCartOpen,
    closeMiniCart,
    removeItem,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useCart();

  return (
    <AnimatePresence>
      {miniCartOpen && (
        <motion.div
          initial={{ opacity: 0, x: 50, y: -50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 50, y: -50 }}
          className="fixed top-5 right-5 w-96 bg-white shadow-2xl rounded-xl z-50 p-5 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <button onClick={closeMiniCart}>
              <X className="w-5 h-5 text-gray-600 hover:text-black transition" />
            </button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">
              Your cart is empty.
            </p>
          ) : (
            <>
              <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center gap-3 border-b pb-3"
                  >
                    <div className="w-16 h-16 relative rounded overflow-hidden bg-gray-100">
                      <Image
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : `http://localhost:5000${item.image}`
                        }
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-gray-500 text-xs">
                        Size: {item.size} | ₹{item.price} × {item.qty}
                      </p>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.product)}
                      className="text-red-500 text-xs font-semibold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="mt-4 border-t pt-3 text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shippingPrice === 0 ? "Free" : `₹${shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{taxPrice}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-2 text-base">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/cart"
                onClick={closeMiniCart}
                className="mt-4 block text-center bg-black text-white py-2 rounded-md hover:bg-gray-900 transition"
              >
                Go to Checkout
              </Link>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
