// app/components/NewArrivals/NewArrivals.jsx
"use client";
import { useEffect, useState } from "react";
import api from "../../lib/apiClient.js";
import Link from "next/link";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data)).catch(() => setProducts([]));
  }, []);

  if (!products.length) return <p className="text-gray-500">No products yet.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.slice(0, 8).map((p) => (
        <Link key={p._id} href={`/shop/${p._id}`} className="block border rounded overflow-hidden">
          <div className="aspect-3/4 bg-gray-100">
            {p.images?.[0] ? (
              // basic img so you don’t need next/image config
              <img
                src={`http://localhost:5000${p.images[0]}`}
                alt={p.name}
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          <div className="p-3">
            <div className="font-medium">{p.name}</div>
            <div className="text-sm text-gray-600">₹{p.price}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
