"use client";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";
import ProductGrid from "../components/ProductGrid";

export default function ShopPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Shop All</h1>
      <ProductGrid products={products} />
    </section>
  );
}
