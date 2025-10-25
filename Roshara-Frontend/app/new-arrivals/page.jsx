"use client";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import ProductGrid from "../components/ProductGrid";

export default function NewArrivalsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts({ featured: true })
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">New Arrivals</h1>
      <ProductGrid products={products} />
    </section>
  );
}
