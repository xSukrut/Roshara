"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "../../services/productService";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    setQty,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    addItem,
    openMiniCart,
  } = useCart();

  const [recommendations, setRecommendations] = useState([]);
  const [recError, setRecError] = useState("");

  const cartIds = useMemo(
    () =>
      new Set(
        (items || [])
          .map((it) => it?.product || it?._id || it?.id)
          .filter(Boolean)
      ),
    [items]
  );

  // Fetch recommendations (exclude already-in-cart items)
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setRecError("");
        const all = await getAllProducts();
        const list = Array.isArray(all) ? all : [];
        const filtered = list.filter((p) => !cartIds.has(p._id));
        // Pick up to 4
        const top = filtered.slice(0, 4);
        if (!ignore) setRecommendations(top);
      } catch (e) {
        if (!ignore) setRecError("Could not load recommendations.");
        // console.error(e);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [cartIds]);

  const handleCheckout = () => {
    if (!items || items.length === 0) return;
    router.push("/checkout");
  };

  const addRecToCart = (p) => {
    // try to grab first image if array exists
    const firstImage =
      (Array.isArray(p.images) && p.images.length ? p.images[0] : null) ||
      p.image ||
      "/placeholder.png";

    addItem({
      product: p._id,
      name: p.name,
      price: p.price,
      image: firstImage,
    });
    if (typeof openMiniCart === "function") openMiniCart();
  };

  if (!items || items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-semibold mb-4">Your Bag</h1>
        <p className="text-gray-600 mb-6">Your bag is empty.</p>

        {/* Show recommendations even when empty, if available */}
        {recommendations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">You might also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommendations.map((p) => (
                <div key={p._id} className="border rounded-lg p-3">
                  <div className="relative w-full h-40 mb-2 overflow-hidden rounded">
                    <Image
                      src={
                        (Array.isArray(p.images) && p.images[0]) ||
                        p.image ||
                        "/placeholder.png"
                      }
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">₹{p.price}</div>
                  <button
                    onClick={() => addRecToCart(p)}
                    className="mt-2 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition text-sm"
                  >
                    Add to Bag
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/shop"
          className="inline-block mt-8 bg-black text-white px-5 py-3 rounded hover:bg-gray-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      {/* Left — Bag Items */}
      <section className="md:col-span-2">
        <h1 className="text-3xl font-semibold mb-6">Your Bag</h1>
        <div className="space-y-4">
          {items.map((it) => {
            const pid = it.product || it._id;
            return (
              <div
                key={pid}
                className="flex items-center justify-between border rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={it.image || "/placeholder.png"}
                      alt={it.name}
                      fill
                      className="rounded object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{it.name}</h3>
                    <p className="text-sm text-gray-600">₹{it.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-sm">Qty:</label>
                      <input
                        type="number"
                        min="1"
                        value={it.qty}
                        onChange={(e) => setQty(pid, Number(e.target.value))}
                        className="w-16 border rounded px-2 py-1 text-center"
                      />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(pid)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* Recommendations under the cart items (desktop & mobile) */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">You might also like</h2>
          {recError && (
            <p className="text-sm text-red-600 mb-2">{recError}</p>
          )}
          {recommendations.length === 0 ? (
            <p className="text-gray-600">We’ll show suggestions here soon.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recommendations.map((p) => (
                <div key={p._id} className="border rounded-lg p-3">
                  <div className="relative w-full h-40 mb-2 overflow-hidden rounded">
                    <Image
                      src={
                        (Array.isArray(p.images) && p.images[0]) ||
                        p.image ||
                        "/placeholder.png"
                      }
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-sm font-medium">{p.name}</div>
                  <div className="text-sm text-gray-600">₹{p.price}</div>
                  <button
                    onClick={() => addRecToCart(p)}
                    className="mt-2 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition text-sm"
                  >
                    Add to Bag
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Right — Summary */}
      <aside className="border rounded-lg p-6 h-fit shadow-md">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>₹{itemsPrice}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>{shippingPrice ? `₹${shippingPrice}` : "FREE"}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Tax</span>
          <span>₹{taxPrice}</span>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between font-semibold text-lg mb-4">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50"
          disabled={!items || items.length === 0}
        >
          Proceed to Checkout
        </button>

        {/* Continue Shopping */}
        <Link
          href="/shop"
          className="block w-full text-center mt-3 py-2 border border-black rounded hover:bg-gray-100 transition"
        >
          Continue Shopping
        </Link>
      </aside>
    </div>
  );
}
