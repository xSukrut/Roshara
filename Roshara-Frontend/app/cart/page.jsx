// "use client";
// import Link from "next/link";
// import { useCart } from "../../context/CartContext";

// export default function CartPage() {
//   const {
//     items,
//     setQty,
//     removeItem,
//     itemsPrice,
//     shippingPrice,
//     taxPrice,
//     totalPrice,
//   } = useCart();

//   return (
//     <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
//       <section className="md:col-span-2">
//         <h1 className="text-2xl font-semibold mb-4">Bag</h1>

//         {items.length === 0 ? (
//           <div className="text-gray-600">
//             Your bag is empty.{" "}
//             <Link href="/shop" className="underline">
//               Continue shopping
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {items.map((it) => (
//               <div key={it.product} className="border rounded p-4 flex gap-4">
//                 <img
//                   src={
//                     it.image?.startsWith("http")
//                       ? it.image
//                       : `http://localhost:5000${it.image || ""}`
//                   }
//                   alt={it.name}
//                   className="w-20 h-20 object-cover rounded"
//                 />

//                 <div className="flex-1">
//                   <div className="font-medium">{it.name}</div>
//                   <div className="text-sm text-gray-600">₹{it.price}</div>
//                   <div className="mt-2 flex items-center gap-2">
//                     <label className="text-sm">Qty</label>
//                     <input
//                       type="number"
//                       min="1"
//                       value={it.qty}
//                       onChange={(e) =>
//                         setQty(it.product, Number(e.target.value))
//                       }
//                       className="w-16 border rounded px-2 py-1"
//                     />
//                     <button
//                       onClick={() => removeItem(it.product)}
//                       className="text-red-600 text-sm ml-3"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <aside className="md:col-span-1 border rounded p-4 h-fit">
//         <h3 className="font-semibold mb-3">Price Details</h3>
//         <div className="flex justify-between text-sm">
//           <span>Items Total</span>
//           <span>₹{itemsPrice}</span>
//         </div>
//         <div className="flex justify-between text-sm mt-1">
//           <span>Shipping</span>
//           <span>{shippingPrice ? `₹${shippingPrice}` : "FREE"}</span>
//         </div>
//         <div className="flex justify-between text-sm mt-1">
//           <span>Tax (5%)</span>
//           <span>₹{taxPrice}</span>
//         </div>
//         <hr className="my-3" />
//         <div className="flex justify-between font-semibold">
//           <span>Total</span>
//           <span>₹{totalPrice}</span>
//         </div>

//         <Link
//           href="/checkout"
//           className="block text-center mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
//         >
//           Checkout
//         </Link>
//       </aside>
//     </div>
//   );
// }

"use client";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const {
    items,
    setQty,
    removeItem,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useCart();

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Bag Section */}
      <section className="md:col-span-2">
        <h1 className="text-4xl font-extrabold mb-10 text-[#461518] text-center md:text-left">
          Your Bag
        </h1>

        {items.length === 0 ? (
          <div className="text-gray-600 text-lg text-center md:text-left">
            Your bag is empty.{" "}
            <Link
              href="/shop"
              className="underline text-[#461518] hover:text-[#7f1d1d]"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((it) => (
              <div
                key={it.product}
                className="rounded-2xl p-4 flex gap-4 items-center shadow-md hover:shadow-xl transition-shadow duration-300 bg-gradient-to-black from-pink-100 to-pink-200 overflow-hidden"
              >
                <img
                  src={
                    it.image?.startsWith("http")
                      ? it.image
                      : `http://localhost:5000${it.image || ""}`
                  }
                  alt={it.name}
                  className="w-24 h-24 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                />

                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-lg hover:text-[#7f1d1d] transition-colors duration-300">
                    {it.name}
                  </div>
                  <div className="text-[#7f1d1d] font-medium text-sm mt-1">
                    ₹{it.price}
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <label className="text-sm text-gray-700">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={it.qty}
                      onChange={(e) =>
                        setQty(it.product, Number(e.target.value))
                      }
                      className="w-20 border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <button
                      onClick={() => removeItem(it.product)}
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Price Summary */}
      <aside className="md:col-span-1 rounded-2xl p-6 shadow-lg bg-gradient-to-black from-pink-50 to-pink-200">
        <h3 className="font-semibold text-lg mb-4 text-[#461518]">
          Price Details
        </h3>
        <div className="flex justify-between text-[#7f1d1d] text-sm mb-1">
          <span>Items Total</span>
          <span>₹{itemsPrice}</span>
        </div>
        <div className="flex justify-between text-[#7f1d1d] text-sm mb-1">
          <span>Shipping</span>
          <span>{shippingPrice ? `₹${shippingPrice}` : "FREE"}</span>
        </div>
        <div className="flex justify-between text-[#7f1d1d] text-sm mb-2">
          <span>Tax (5%)</span>
          <span>₹{taxPrice}</span>
        </div>
        <hr className="my-3 border-[#f5c2c7]" />
        <div className="flex justify-between font-semibold text-[#461518] text-lg mb-4">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>

        <Link
          href="/checkout"
          className="block text-center mt-4 px-4 py-3 rounded-2xl font-semibold text-white bg-gradient-to-red from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 transition-all duration-300"
        >
          Checkout
        </Link>
      </aside>
    </div>
  );
}
