"use client";
import { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService";
import ProductGrid from "../components/ProductGrid";

export default function ShopPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Shop All</h1>
      <ProductGrid products={products} />
    </div>
  );
}

