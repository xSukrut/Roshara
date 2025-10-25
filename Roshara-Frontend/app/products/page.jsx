"use client";
import { useEffect, useState } from "react";
import ProductCard from "../components/NewArrivals/ProductCard"; // adjust path if needed
import { getAllProducts } from "../../services/productService";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => { getAllProducts().then(setProducts).catch(console.error); }, []);
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shop</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p._1d} product={p} />)}
      </div>
    </div>
  );
}
