"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import * as collectionSvc from "../../../services/collectionService";  
import { getAllProducts } from "../../../services/productService";

export default function CollectionProductsPage() {
  const { id } = useParams() || {};
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!id) return;

    // Quick sanity check:
    // console.log("collectionSvc keys:", Object.keys(collectionSvc));

    collectionSvc
      .getCollection(id)           // <-- will work for named or default exports
      .then(setCollection)
      .catch((e) => console.error("Failed to load collection:", e));

    getAllProducts()
      .then((all = []) => {
        const filtered = all.filter(
          (p) => p?.collection?._id === id || p?.collection === id
        );
        setProducts(filtered);
      })
      .catch((e) => console.error("Failed to load products:", e));
  }, [id]);

  if (!collection) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Collection</h1>
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-1">{collection.name}</h1>
      {collection.description && (
        <p className="text-gray-600 mb-6">{collection.description}</p>
      )}

      {products.length === 0 ? (
        <p className="text-gray-500">No products in this collection yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <div key={p._id} className="border rounded overflow-hidden">
              <div className="aspect-square bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    Array.isArray(p.images) && p.images[0]
                      ? (typeof p.images[0] === "string"
                          ? p.images[0]
                          : p.images[0]?.url || p.images[0]?.src || p.images[0]?.path) || "/placeholder.png"
                      : "/placeholder.png"
                  }
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-700">₹{p.price}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
