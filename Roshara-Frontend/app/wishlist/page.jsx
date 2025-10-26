"use client";
import Link from "next/link";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();
  const { addItem, openMiniCart } = useCart();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Wishlist</h1>

      {items.length === 0 ? (
        <div className="text-gray-600">
          Your wishlist is empty. <Link href="/shop" className="underline">Browse products</Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((it) => (
              <div key={it.product} className="border rounded-lg p-4">
                <img
                  src={it.image || "/placeholder.png"}
                  alt={it.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <div className="font-medium">{it.name}</div>
                <div className="text-gray-600 mb-3">₹{it.price}</div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addItem({
                        product: it.product,
                        name: it.name,
                        price: it.price,
                        image: it.image,
                      }, 1);
                      openMiniCart();
                    }}
                    className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800"
                  >
                    Add to Bag
                  </button>
                  <button
                    onClick={() => remove(it.product)}
                    className="flex-1 border border-gray-400 py-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={clear} className="mt-6 border border-gray-400 px-4 py-2 rounded">
            Clear Wishlist
          </button>
        </>
      )}
    </div>
  );
}
