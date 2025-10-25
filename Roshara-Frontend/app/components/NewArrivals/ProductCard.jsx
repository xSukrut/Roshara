"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Search, ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProductCard({ product, onSearch }) {
  const [hovering, setHovering] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // ✅ Support both direct images or color variants
  const images =
    product.images ||
    (product.colors && product.colors[0]?.images) ||
    [];

  // Prevent runtime error if no images
  if (!images.length) return null;

  // Image cycling on hover
  useEffect(() => {
    let interval;
    if (hovering && images.length > 1) {
      interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 600);
    }
    return () => clearInterval(interval);
  }, [hovering, images.length]);

  return (
    <div
      className="group relative cursor-pointer"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Image */}
      <motion.div
        className="relative w-full h-[350px] overflow-hidden rounded-2xl shadow-sm"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={images[currentImage]}
          alt={product.name}
          fill
          className="object-cover transition-all duration-700"
        />

        {/* Icons on hover - vertical right side */}
        <div className="absolute top-5 right-3 flex flex-col items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => onSearch(product)}
            className="bg-white p-2 rounded-full shadow hover:scale-110 transition-transform"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </button>
          <button className="bg-white p-2 rounded-full shadow hover:scale-110 transition-transform">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
          </button>
          <button className="bg-white p-2 rounded-full shadow hover:scale-110 transition-transform">
            <Heart className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </motion.div>

      {/* Info below card */}
      <div className="text-center mt-3">
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-500">{product.price}</p>
      </div>
    </div>
  );
}
