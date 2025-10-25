"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/orderService";

export default function CheckoutPage() {
  const router = useRouter();
  const search = useSearchParams();
  const couponFromQuery = search.get("coupon") || "";
  const [address, setAddress] = useState({ address: "", city: "", postalCode: "", country: "India" });
  const { items, itemsPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(couponFromQuery);
  const [taxPrice] = useState(0);
  const [shippingPrice] = useState(0);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return alert("Cart empty");
    const orderItems = items.map(i => ({ product: i._id, quantity: i.qty }));
    const body = {
      orderItems,
      shippingAddress: address,
      paymentMethod: "cod",
      taxPrice,
      shippingPrice,
      couponCode: coupon || null
    };
    try {
      setLoading(true);
      const data = await createOrder(body);
      clearCart();
      alert("Order created: " + data._id);
      router.push(`/order/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold">Shipping Address</h2>
          <input placeholder="Address" value={address.address} onChange={(e)=>setAddress({...address, address: e.target.value})} className="border p-2 w-full mb-2" />
          <input placeholder="City" value={address.city} onChange={(e)=>setAddress({...address, city: e.target.value})} className="border p-2 w-full mb-2" />
          <input placeholder="Postal Code" value={address.postalCode} onChange={(e)=>setAddress({...address, postalCode: e.target.value})} className="border p-2 w-full mb-2" />
          <input placeholder="Country" value={address.country} onChange={(e)=>setAddress({...address, country: e.target.value})} className="border p-2 w-full mb-2" />
        </div>
        <div className="p-4 border">
          <p>Items total: ₹{itemsPrice}</p>
          <p>Tax: ₹{taxPrice}</p>
          <p>Shipping: ₹{shippingPrice}</p>
          <p>Coupon: {coupon || "None"}</p>
          <button onClick={handlePlaceOrder} disabled={loading} className="mt-4 bg-black text-white px-4 py-2">
            {loading ? "Placing..." : "Place Order (Pay on delivery)"}
          </button>
        </div>
      </div>
    </div>
  );
}
