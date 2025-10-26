"use client";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { items, setQty, removeItem, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      <section className="md:col-span-2">
        <h1 className="text-2xl font-semibold mb-4">Bag</h1>

        {items.length === 0 ? (
          <div className="text-gray-600">
            Your bag is empty. <Link href="/shop" className="underline">Continue shopping</Link>
          </div>
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
      </section>

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

        <Link
          href="/checkout"
          className="block text-center mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Checkout
        </Link>
      </aside>
    </div>
  );
}
