"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../services/orderService";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    items,
    itemsPrice,
    coupon,
    clearCart,
    discountAmount,
    totalAfterDiscount,
  } = useCart();

  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("Please login first.");
      return;
    }
    if (!items.length) {
      setMessage("Your cart is empty.");
      return;
    }

    try {
      await createOrder({
        orderItems: items,
        shippingAddress: form,
        paymentMethod: "cod", // you can switch later to Razorpay
        taxPrice: 0,
        shippingPrice: 0,
        couponCode: coupon?.code || null,
      });

      clearCart();
      router.push("/"); // you can redirect to /orders or success page
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create order");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full border rounded p-2"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
          <input
            className="w-full border rounded p-2"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
          />
          <input
            className="w-full border rounded p-2"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            required
          />
          <input
            className="w-full border rounded p-2"
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            required
          />
          {message && <p className="text-sm text-red-600">{message}</p>}
          <button className="bg-black text-white px-4 py-2 rounded">Place Order</button>
        </form>
      </div>

      <div className="border rounded p-4 h-fit sticky top-20">
        <h2 className="text-xl font-semibold mb-3">Summary</h2>
        <div className="flex justify-between py-1">
          <span>Items</span>
          <span>₹{itemsPrice}</span>
        </div>
        <div className="flex justify-between py-1">
          <span>Discount</span>
          <span>-₹{discountAmount}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>₹{totalAfterDiscount}</span>
        </div>
      </div>
    </div>
  );
}
