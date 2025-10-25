"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { validateCoupon } from "../../services/couponService";

export default function CartPage() {
  const { items, updateQty, removeFromCart, itemsPrice } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleValidate = async () => {
    try {
      const res = await validateCoupon(coupon, itemsPrice);
      let d = 0;
      if (res.discountType === "percentage") d = Math.round((itemsPrice * res.value) / 100);
      else d = res.value;
      setDiscount(d);
      alert("Coupon valid — discount applied.");
    } catch (err) {
      alert(err.response?.data?.message || err.message);
      setDiscount(0);
    }
  };

  const total = Math.max(itemsPrice - discount, 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {items.length === 0 ? <p>Your cart is empty. <Link href="/products">Shop now</Link></p> :
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {items.map(it => (
            <div key={it._id} className="flex items-center justify-between border-b py-3">
              <div>
                <strong>{it.name}</strong><br/>
                <span>₹{it.price} x {it.qty}</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min="1" value={it.qty} onChange={(e)=> updateQty(it._id, Number(e.target.value))} className="w-16 border p-1"/>
                <button onClick={()=> removeFromCart(it._id)} className="text-red-600">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border">
          <div>
            <input value={coupon} onChange={(e)=>setCoupon(e.target.value)} placeholder="Coupon code" className="border p-2 w-full mb-2" />
            <button onClick={handleValidate} className="bg-black text-white px-3 py-1 w-full">Apply Coupon</button>
          </div>
          <div className="mt-4">
            <p>Subtotal: ₹{itemsPrice}</p>
            <p>Discount: -₹{discount}</p>
            <p className="font-bold">Total: ₹{total}</p>
            <Link href={`/checkout?coupon=${coupon}`}>
              <button className="bg-green-600 text-white px-4 py-2 w-full mt-4">Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      </div>}
    </div>
  );
}
