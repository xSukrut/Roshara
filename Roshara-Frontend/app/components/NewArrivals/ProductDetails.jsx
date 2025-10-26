"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCart } from "../../../context/CartContext";

export default function ProductDetails({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [mainImage, setMainImage] = useState("");
  const { addItem, openMiniCart } = useCart();

  // Get color images or fallback to product.images
  const colorOptions =
    product.colors && product.colors.length > 0
      ? product.colors
      : [{ name: "Default", images: product.images || [] }];

  const selectedColor = colorOptions[selectedColorIndex] || colorOptions[0];

  // Update main image when color changes
  useEffect(() => {
    if (selectedColor?.images?.length) {
      setMainImage(selectedColor.images[0]);
    }
  }, [selectedColorIndex]);

  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="details"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex justify-center items-start z-50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="relative bg-white rounded-3xl shadow-2xl mt-6 w-[80%] md:w-[65%] lg:w-[50%] overflow-hidden flex flex-col md:flex-row"
        >
          {/* LEFT SIDE - IMAGES */}
          <div className="md:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-6">
            {/* Main Image */}
            {mainImage ? (
              <Image
                src={mainImage}
                alt={product.name}
                width={400}
                height={500}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-[400px] h-[500px] bg-gray-200 rounded-lg animate-pulse" />
            )}

            {/* Thumbnail Images */}
            <div className="flex gap-3 mt-4">
              {selectedColor?.images?.slice(0, 4).map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt="thumb"
                  width={70}
                  height={70}
                  onClick={() => setMainImage(img)}
                  className={`rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                    mainImage === img ? "border-black" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - DETAILS */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            {/* Header Section */}
            <div>
              <h3 className="text-sm text-gray-500 font-medium">ROSHARA</h3>
              <h2 className="text-2xl font-bold mt-1">{product.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★ ★ ★ ★ ★</span>
              </div>

              {/* Description */}
              <p className="mt-1 text-gray-600 text-sm leading-relaxed">
                {product.description ||
                  "Sleek and stylish sneakers with breathable mesh and a cushioned sole for all-day comfort."}
              </p>

              {/* Price */}
              <p className="mt-2 text-3xl font-bold">{product.price}</p>

              {/* Colors */}
              <div className="mt-1">
                <h4 className="font-semibold text-gray-700 mb-2">Color</h4>
                <div className="flex gap-3 flex-wrap">
                  {colorOptions.map((color, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`w-10 h-10 rounded-lg overflow-hidden border-2 cursor-pointer ${
                        idx === selectedColorIndex
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                    >
                      <Image
                        src={color.images[0]}
                        alt={color.name}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Chart */}
              <div className="mt-5">
                <h4 className="font-semibold text-gray-700 mb-2">Size Chart</h4>
                <div className="grid grid-cols-6 gap-2">
                  {[40, 41, 42, 43, 44, 45].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded-md py-2 text-sm transition-all ${
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

              {/* Quantity */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border w-8 h-8 flex items-center justify-center text-xl rounded hover:bg-gray-100"
                >
                  –
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="border w-8 h-8 flex items-center justify-center text-xl rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90">
                Buy Now
              </button>
              <button
                onClick={() => {
                  addItem({
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                  });
                  openMiniCart();
                  onClose();
                }}
                className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90"
              >
                Add to Cart
              </button>
              <button className="border p-3 rounded-xl hover:bg-gray-100">
                ❤️
              </button>
            </div>

            {/* Delivery Note */}
            <p className="text-sm text-gray-500 mt-4">
              🚚 Free Delivery On Orders Over ₹2000
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
