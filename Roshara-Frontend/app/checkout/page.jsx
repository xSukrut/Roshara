"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { createOrder, markPaidUPI } from "../../services/orderService";
import { QRCodeCanvas } from "qrcode.react";

export default function CheckoutPage() {
  const { user, token, loading } = useAuth(); // <- use loading
  const { items, itemsPrice, shippingPrice, taxPrice, totalPrice, setQty, removeItem, clear } = useCart();
  const router = useRouter();

  const [address, setAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" | "upi"
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null); // for UPI flow

  // Only redirect after auth state is known
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login?next=/checkout");
    }
  }, [loading, user, router]);

  const upiString = useMemo(() => {
    const vpa = "roshara@upi"; // demo
    const name = "Roshara";
    const amount = totalPrice || 0;
    const txnNote = encodeURIComponent("Order payment");
    return `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${txnNote}`;
  }, [totalPrice]);

  const handlePlaceOrder = async () => {
    setError("");
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!address.address || !address.city || !address.postalCode) {
      setError("Please fill your address completely.");
      return;
    }
    setPlacing(true);
    try {
      const orderItems = items.map((it) => ({
        product: it.product,
        name: it.name,
        quantity: it.qty,
        price: it.price,
      }));

      const payload = {
        orderItems,
        shippingAddress: address,
        paymentMethod,
        taxPrice,
        shippingPrice,
      };

      const order = await createOrder(token, payload);

      if (paymentMethod === "cod") {
        clear();
        router.push(`/order/${order._id}?status=pending`);
      } else {
        setOrderId(order._id); // show UPI block
      }
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacing(false);
    }
  };

  const handleMarkPaid = async () => {
    try {
      await markPaidUPI(token, orderId);
      clear();
      router.push(`/order/${orderId}?status=paid`);
    } catch (e) {
      setError(e?.response?.data?.message || "Payment confirmation failed.");
    }
  };

  // While auth is loading, show nothing (or a light skeleton)
  if (loading) {
    return <div className="p-6">Loading checkout…</div>;
  }

  // If not logged in, the effect above will redirect. Render nothing here.
  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
      {/* Bag / Items */}
      <section className="md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Bag</h2>

        {items.length === 0 ? (
          <p>Your bag is empty.</p>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.product} className="border rounded p-4 flex gap-4">
                <img
                  src={it.image || "/placeholder.png"}
                  alt={it.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-600">₹{it.price}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={it.qty}
                      onChange={(e) => setQty(it.product, Number(e.target.value))}
                      className="w-16 border rounded px-2 py-1"
                    />
                    <button onClick={() => removeItem(it.product)} className="text-red-600 text-sm ml-3">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Address */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Delivery Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              placeholder="Address"
              className="border rounded px-3 py-2"
              value={address.address}
              onChange={(e) => setAddress({ ...address, address: e.target.value })}
            />
            <input
              placeholder="City"
              className="border rounded px-3 py-2"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <input
              placeholder="PIN Code"
              className="border rounded px-3 py-2"
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            />
            <input
              placeholder="Country"
              className="border rounded px-3 py-2"
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
            />
          </div>
        </div>

        {/* Payment */}
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Payment Method</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pay"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span>Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pay"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              <span>UPI</span>
            </label>
          </div>
        </div>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        <button
          onClick={handlePlaceOrder}
          disabled={placing || items.length === 0}
          className="mt-6 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          {placing ? "Placing..." : "Place Order"}
        </button>

        {/* UPI block */}
        {orderId && paymentMethod === "upi" && (
          <div className="mt-6 border rounded p-4">
            <h4 className="font-semibold mb-2">Pay via UPI</h4>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <QRCodeCanvas value={upiString} size={160} />
              <div>
                <a
                  href={upiString}
                  className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Open UPI App
                </a>
                <p className="text-sm text-gray-600 mt-2">
                  UPI ID: <b>roshara@upi</b> &nbsp; | &nbsp; Amount: ₹{totalPrice}
                </p>
                <button
                  onClick={handleMarkPaid}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  I’ve paid
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Price details */}
      <aside className="md:col-span-1 border rounded p-4 h-fit">
        <h3 className="font-semibold mb-3">Price Details</h3>
        <div className="flex justify-between text-sm">
          <span>Items Total</span><span>₹{itemsPrice}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>Shipping</span><span>{shippingPrice ? `₹${shippingPrice}` : "FREE"}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span>Tax (5%)</span><span>₹{taxPrice}</span>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between font-semibold">
          <span>Total</span><span>₹{totalPrice}</span>
        </div>
      </aside>
    </div>
  );
}
