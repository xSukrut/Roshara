"use client";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { validateCoupon } from "../services/couponService";
import Link from "next/link";

const imgUrl = (src) => (src?.startsWith("http") ? src : `http://localhost:5000${src}`);

export default function CartPage() {
  const {
    items,
    setQty,
    removeItem,
    coupon,
    setCoupon,
    discountAmount,
    setDiscountAmount,
    itemsPrice,
    totalAfterDiscount,
  } = useCart();

  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");

  const apply = async () => {
    try {
      const res = await validateCoupon(code, itemsPrice);
      // res = { valid, discountType, value, message }
      if (!res.valid) {
        setMsg(res.message || "Invalid coupon");
        return;
      }
      let discount = 0;
      if (res.discountType === "percentage") discount = Math.round((itemsPrice * res.value) / 100);
      else discount = res.value;

      setCoupon({ code, discountType: res.discountType, value: res.value });
      setDiscountAmount(discount);
      setMsg(res.message || "Applied");
    } catch (e) {
      setMsg(e.response?.data?.message || "Invalid coupon");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-semibold mb-4">Cart</h1>

        {!items.length ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it._id} className="flex items-center gap-4 border p-3 rounded">
                <div className="w-20 h-20 bg-gray-100 overflow-hidden rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {it.image ? (
                    <img src={imgUrl(it.image)} alt={it.name} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-600">₹{it.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={it.qty}
                    onChange={(e) => setQty(it._id, Number(e.target.value))}
                    className="w-20 border rounded p-2"
                  />
                  <button onClick={() => removeItem(it._id)} className="text-red-600">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="border p-4 rounded sticky top-20">
          <h2 className="text-xl font-semibold mb-3">Summary</h2>
          <div className="flex justify-between py-1">
            <span>Subtotal</span>
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

          <div className="mt-4">
            <label className="block text-sm mb-1">Coupon</label>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 border rounded p-2"
                placeholder="Enter code"
              />
              <button onClick={apply} className="bg-black text-white px-4 rounded">
                Apply
              </button>
            </div>
            {coupon && (
              <p className="text-sm text-green-700 mt-2">
                Applied: <b>{coupon.code}</b>
              </p>
            )}
            {msg && <p className="text-sm text-gray-600 mt-1">{msg}</p>}
          </div>

          <Link
            href="/checkout"
            className={`block text-center mt-4 px-4 py-2 rounded ${
              items.length ? "bg-black text-white" : "bg-gray-300 text-gray-600 pointer-events-none"
            }`}
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
