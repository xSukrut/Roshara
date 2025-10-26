"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search, ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

export default function ProductCard({ product, onSearch, className = "" }) {
  const [hovering, setHovering] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  const { addItem, openMiniCart } = useCart();
  const { toggle, inWishlist } = useWishlist();

  const images =
    product.images || (product.colors && product.colors[0]?.images) || [];
  if (!images.length) return null;

  useEffect(() => {
    let interval;
    if (hovering && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 600);
    }
    return () => clearInterval(interval);
  }, [hovering, images.length]);

  const isFav = inWishlist(product._id);

  return (
    <div
      className={`group relative cursor-pointer ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Image */}
      <motion.div
        className="relative w-full h-full overflow-hidden rounded-2xl shadow-sm"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={
            images[currentImage]?.startsWith("http")
              ? images[currentImage]
              : `http://localhost:5000${images[currentImage]}`
          }
          alt={product.name}
          fill
          className="object-cover transition-all duration-700"
        />

        {/* Icons on hover - vertical right side */}
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
            aria-label="Quick add to bag"
          >
            <ShoppingCart className="w-5 h-5 text-gray-700" />
          </button>

          <button
            className="bg-white p-2 rounded-full shadow hover:scale-110 transition-transform"
            onClick={() =>
              toggle({
                product: product._id,
                name: product.name,
                price: product.price,
                image: images[0],
              })
            }
            aria-label="Toggle wishlist"
            title={isFav ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-5 h-5 ${isFav ? "text-red-500" : "text-gray-700"}`}
            />
          </button>
        </div>
      </motion.div>

      {/* Info below card */}
      <div className="text-center mt-3">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-500">{product.price}</p>
      </div>

      {showQuickAdd && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-0 right-0 w-56 bg-white shadow-xl rounded p-4 z-50"
        >
          {/* Image with blue overlay */}
          <div className="relative w-full h-32 mb-3">
            <Image
              src={
                images[0]?.startsWith("http")
                  ? images[0]
                  : `http://localhost:5000${images[0]}`
              }
              alt={product.name}
              fill
              className="object-cover rounded"
            />

            <div className="absolute inset-0 bg-blue-200/30 rounded"></div>
          </div>

          {/* Size options (demo) */}
          <div className="mb-3">
            <p className="text-sm font-semibold mb-1">Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {[40, 41, 42, 43, 44, 45].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`border rounded-md py-1 px-2 text-sm transition-all ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-700 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!selectedSize) return;
                addItem({
                  product: product._id,
                  name: product.name,
                  price: product.price,
                  image: images?.[0],
                  size: selectedSize,
                });
                openMiniCart();
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
