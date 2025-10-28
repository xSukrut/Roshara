// "use client";
// import { motion } from "framer-motion";
// import Image from "next/image";
// import { Search, ShoppingCart, Heart } from "lucide-react";
// import { useState, useEffect } from "react";
// import { useCart } from "../../../context/CartContext";
// import { useWishlist } from "../../../context/WishlistContext";

// export default function ProductCard({ product, onSearch, className = "" }) {
//   const [hovering, setHovering] = useState(false);
//   const [currentImage, setCurrentImage] = useState(0);
//   const [showQuickAdd, setShowQuickAdd] = useState(false);
//   const [selectedSize, setSelectedSize] = useState(null);

//   const { addItem, openMiniCart } = useCart();
//   const { toggle, inWishlist } = useWishlist();

//   const images =
//     product.images || (product.colors && product.colors[0]?.images) || [];
//   if (!images.length) return null;

//   useEffect(() => {
//     let interval;
//     if (hovering && images.length > 1) {
//       interval = setInterval(() => {
//         setCurrentImage((prev) => (prev + 1) % images.length);
//       }, 600);
//     }
//     return () => clearInterval(interval);
//   }, [hovering, images.length]);

//   const isFav = inWishlist(product._id);

//   return (
//     <div
//       className={`group relative cursor-pointer ${className}`}
//       onMouseEnter={() => setHovering(true)}
//       onMouseLeave={() => setHovering(false)}
//     >
//       {/* Image */}
//       <motion.div
//         className="relative w-full h-full overflow-hidden rounded-2xl shadow-sm"
//         whileHover={{ scale: 1.02 }}
//         transition={{ duration: 0.3 }}
//       >
//         <Image
//           src={
//             images[currentImage]?.startsWith("http")
//               ? images[currentImage]
//               : `http://localhost:5000${images[currentImage]}`
//           }
//           alt={product.name}
//           fill
//           className="object-cover transition-all duration-700"
//         />

//         {/* Icons on hover - vertical right side */}
//         <div className="absolute top-5 right-3 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
//           <button
//             onClick={() => onSearch && onSearch(product)}
//             className="bg-white p-2 rounded-full shadow hover:scale-110 transition-transform"
//             aria-label="Quick view"
//           >
//             <Search className="w-5 h-5 text-gray-700" />
//           </button>

//           <button
//             className="bg-white p-2 rounded-full shadow hover:scale-110 transition-transform"
//             onClick={() => setShowQuickAdd(true)}
//             aria-label="Quick add to bag"
//           >
//             <ShoppingCart className="w-5 h-5 text-gray-700" />
//           </button>

//           <button
//             className="bg-white p-2 rounded-full shadow hover:scale-110 transition-transform"
//             onClick={() =>
//               toggle({
//                 product: product._id,
//                 name: product.name,
//                 price: product.price,
//                 image: images[0],
//               })
//             }
//             aria-label="Toggle wishlist"
//             title={isFav ? "Remove from wishlist" : "Add to wishlist"}
//           >
//             <Heart
//               className={`w-5 h-5 ${isFav ? "text-red-500" : "text-gray-700"}`}
//             />
//           </button>
//         </div>
//       </motion.div>

//       {/* Info below card */}
//       <div className="text-center mt-3">
//         <h3 className="font-semibold text-gray-800">{product.name}</h3>
//         <p className="text-gray-500">{product.price}</p>
//       </div>

//       {showQuickAdd && (
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           className="absolute top-0 right-0 w-56 bg-white shadow-xl rounded p-4 z-50"
//         >
//           {/* Image with blue overlay */}
//           <div className="relative w-full h-32 mb-3">
//             <Image
//               src={
//                 images[0]?.startsWith("http")
//                   ? images[0]
//                   : `http://localhost:5000${images[0]}`
//               }
//               alt={product.name}
//               fill
//               className="object-cover rounded"
//             />

//             <div className="absolute inset-0 bg-blue-200/30 rounded"></div>
//           </div>

//           {/* Size options (demo) */}
//           <div className="mb-3">
//             <p className="text-sm font-semibold mb-1">Select Size</p>
//             <div className="flex gap-2 flex-wrap">
//               {[40, 41, 42, 43, 44, 45].map((size) => (
//                 <button
//                   key={size}
//                   onClick={() => setSelectedSize(size)}
//                   className={`border rounded-md py-1 px-2 text-sm transition-all ${
//                     selectedSize === size
//                       ? "bg-black text-white border-black"
//                       : "border-gray-300 text-gray-700 hover:border-black"
//                   }`}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-2">
//             <button
//               onClick={() => {
//                 if (!selectedSize) return;
//                 addItem({
//                   product: product._id,
//                   name: product.name,
//                   price: product.price,
//                   image: images?.[0],
//                   size: selectedSize,
//                 });
//                 openMiniCart();
//                 setShowQuickAdd(false);
//               }}
//               className="flex-1 bg-black text-white py-2 rounded"
//             >
//               Add
//             </button>
//             <button
//               onClick={() => setShowQuickAdd(false)}
//               className="flex-1 border border-gray-400 py-2 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }

"use client";
import { motion } from "framer-motion";
import { ROSHARA_SIZES } from "../../constants/sizes";
import Image from "next/image";
import { Search, ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "../../../context/CartContext";

// helper: ensure full URL for /uploads paths
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
  "http://localhost:5000";
const urlFor = (src) => {
  if (!src) return "/placeholder.png";
  if (src.startsWith("http")) return src;
  if (src.startsWith("/uploads")) return `${API_BASE}${src}`;
  return src;
};

export default function ProductCard({ product, onSearch, size = "md" }) {
  const [hovering, setHovering] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const { addItem, openMiniCart } = useCart();

  // Wishlist (localStorage)
  const [wish, setWish] = useState([]);
  useEffect(() => {
    try {
      const w = JSON.parse(localStorage.getItem("wishlist") || "[]");
      if (Array.isArray(w)) setWish(w);
    } catch {}
  }, []);
  const inWishlist = useMemo(
    () => wish.includes(product._id),
    [wish, product?._id]
  );
  const toggleWishlist = () => {
    setWish((prev) => {
      const next = inWishlist
        ? prev.filter((id) => id !== product._id)
        : [...prev, product._id];
      localStorage.setItem("wishlist", JSON.stringify(next));
      return next;
    });
  };

  // images source fallback
  const rawImages = Array.isArray(product?.images) ? product.images : [];
  const images = rawImages
    .map((img) => {
      if (!img) return null;
      const s =
        typeof img === "string"
          ? img
          : img.url || img.src || img.path || img.location || img.file;
      return s ? urlFor(s) : null;
    })
    .filter(Boolean);
  if (!images.length) return null;

  // image cycle on hover
  useEffect(() => {
    let t;
    if (hovering && images.length > 1) {
      t = setInterval(
        () => setCurrentImage((p) => (p + 1) % images.length),
        600
      );
    }
    return () => clearInterval(t);
  }, [hovering, images.length]);

  // size options
  const sizeOptions =
    Array.isArray(product?.sizes) && product.sizes.length
      ? product.sizes
      : ROSHARA_SIZES;

  // NEW: height presets
  const heightClass =
    size === "lg"
      ? "h-[420px] md:h-[460px]" // taller cards for Shop All
      : "h-[350px]"; // default everywhere else

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <motion.div
        className={`relative w-full ${heightClass} overflow-hidden rounded-2xl shadow-sm`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={images[currentImage]}
          alt={product.name}
          fill
          className="object-cover transition-all duration-800"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Right-side icons */}
        <div className="absolute top-5 right-3 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => onSearch && onSearch(product)}
            className="bg-white p-2 rounded-full shadow hover:scale-110 transition-transform"
            aria-label="Quick view"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>

          <button
            className="bg-white p-2 rounded-full shadow hover:scale-110 transition-transform"
            onClick={() => setShowQuickAdd(true)}
            aria-label="Add to bag"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
          </button>

          {/* Wishlist toggle */}
          <button
            className={`p-2 rounded-full shadow hover:scale-110 transition-transform ${
              inWishlist ? "bg-red-500 text-white" : "bg-white"
            }`}
            onClick={toggleWishlist}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Info */}
      <div className="text-center mt-3">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-900 font-semibold">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </p>
      </div>

      {/* Quick add panel */}
      {showQuickAdd && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-0 right-0 w-56 bg-white shadow-xl rounded p-4 z-50"
        >
          <div className="relative w-full h-32 mb-3">
            <Image
              src={images[0]}
              alt={product.name}
              fill
              className="object-cover rounded"
            />
            <div className="absolute inset-0 bg-blue-200/30 rounded" />
          </div>

          <div className="mb-3">
            <p className="text-sm font-semibold mb-1">Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {sizeOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`border rounded-md py-1 px-2 text-sm transition-all ${
                    selectedSize === s
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-700 hover:border-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!selectedSize) return;
                addItem({
                  product: product._id,
                  name: product.name,
                  price: product.price,
                  image: images[0],
                  size: selectedSize,
                });
                openMiniCart?.();
                setShowQuickAdd(false);
              }}
              className="flex-1 bg-black text-white py-2 rounded"
            >
              Add
            </button>
            <button
              onClick={() => setShowQuickAdd(false)}
              className="flex-1 border border-gray-400 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
