"use client";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../services/productService";

export default function ShopPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Shop All</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div key={p._id} className="border rounded-lg p-4">
            <img src={p.images?.[0] || "/placeholder.png"} alt={p.name} className="w-full h-60 object-cover" />
            <h2 className="text-lg font-semibold mt-2">{p.name}</h2>
            <p className="text-gray-700">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

