"use client";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../../services/productService";
import ProductCard from "./ProductCard"; 

export default function NewArrivals() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <section className="p-8">
      <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
}
