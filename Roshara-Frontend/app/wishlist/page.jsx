// "use client";
// import Link from "next/link";
// import { useWishlist } from "../../context/WishlistContext";
// import { useCart } from "../../context/CartContext";

// export default function WishlistPage() {
//   const { items, remove, clear } = useWishlist();
//   const { addItem, openMiniCart } = useCart();

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-4xl text-center font-semibold text-[#461518] mb-10">
//         Wishlist
//       </h1>

//       {items.length === 0 ? (
//         <div className="text-gray-600">
//           Your wishlist is empty.{" "}
//           <Link href="/shop" className="underline">
//             Browse products
//           </Link>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {items.map((it) => (
//               <div key={it.product} className="border rounded-lg p-4">
//                 <img
//                   src={it.image || "/placeholder.png"}
//                   alt={it.name}
//                   className="w-full h-48 object-cover rounded mb-3"
//                 />
//                 <div className="font-medium">{it.name}</div>
//                 <div className="text-gray-600 mb-3">₹{it.price}</div>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => {
//                       addItem(
//                         {
//                           product: it.product,
//                           name: it.name,
//                           price: it.price,
//                           image: it.image,
//                         },
//                         1
//                       );
//                       openMiniCart();
//                     }}
//                     className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800"
//                   >
//                     Add to Bag
//                   </button>
//                   <button
//                     onClick={() => remove(it.product)}
//                     className="flex-1 border border-gray-400 py-2 rounded"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <button
//             onClick={clear}
//             className="mt-6 border border-gray-400 px-4 py-2 rounded"
//           >
//             Clear Wishlist
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

"use client";
import Link from "next/link";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import Image from "next/image";

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();
  const { addItem, openMiniCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl text-center font-bold text-[#461518] mb-12">
        Your Wishlist
      </h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-600 text-lg">
          Your wishlist is empty.{" "}
          <Link
            href="/shop"
            className="underline text-[#461518] font-semibold hover:text-[#7a1f1f] transition-colors"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((it) => (
              <div
                key={it.product}
                className="border border-[#eeeae0] rounded-2xl p-2 bg-white shadow-md hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative w-full h-110 overflow-hidden rounded-xl mb-4">
                  <Image
                    src={
                      it.image?.startsWith("http")
                        ? it.image
                        : `http://localhost:5000${it.image}`
                    }
                    alt={it.name}
                    width={400} // or any width you prefer
                    height={300} // or any height you prefer
                    className="object-cover rounded mb-3"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                </div>

                <div className="font-semibold text-lg text-gray-800 mb-1">
                  {it.name}
                </div>
                <div className="text-gray-500 mb-4">₹{it.price}</div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      addItem(
                        {
                          product: it.product,
                          name: it.name,
                          price: it.price,
                          image: it.image,
                        },
                        1
                      );
                      openMiniCart();
                    }}
                    className="flex-1 bg-[#461518] text-white py-2 rounded-xl hover:bg-[#7a1f1f] transition-colors duration-300"
                  >
                    Add to Bag
                  </button>
                  <button
                    onClick={() => remove(it.product)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={clear}
              className="border border-gray-400 px-6 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-300"
            >
              Clear Wishlist
            </button>
          </div>
        </>
      )}
    </div>
  );
}
