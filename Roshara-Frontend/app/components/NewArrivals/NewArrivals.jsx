"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getAllProducts } from "../../../services/productService";
import ProductCard from "../NewArrivals/ProductCard";
import ProductDetails from "../NewArrivals/ProductDetails";

export default function NewArrivals() {
  const [all, setAll] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getAllProducts()
      .then((data) => Array.isArray(data) ? setAll(data) : setAll([]))
      .catch(() => setAll([]));
  }, []);

  // newest first, then take 5
  const latestFive = useMemo(() => {
    const copy = [...all];
    copy.sort((a, b) => {
      const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });
    return copy.slice(0, 5);
  }, [all]);

  return (
    <section className="p-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold text-center mb-6">New Arrivals</h2>
        <Link
          href="/new-arrivals"
          className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {latestFive.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onSearch={setSelectedProduct}
            className="w-64 h-80"
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
}
