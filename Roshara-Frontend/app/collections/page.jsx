"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCollections } from "../services/collectionService";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:5000";

const pickPath = (src) => {
  if (!src) return null;
  if (typeof src === "string") return src;
  return src.url || src.src || src.path || src.location || src.file || null;
};

const urlFor = (src) => {
  const p = pickPath(src);
  if (!p) return "/placeholder.png";

  // Already absolute
  if (p.startsWith("http")) return p;

  // Ensure leading slash for relative paths
  const path = p.startsWith("/") ? p : `/${p}`;

  // Most backends store images under /uploads
  if (path.startsWith("/uploads")) return `${API_BASE}${path}`;

  // Fallback: still make it absolute against API_BASE
  return `${API_BASE}${path}`;
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getAllCollections()
      .then((data) => setCollections(Array.isArray(data) ? data : []))
      .catch(() => setCollections([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Collections</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {collections.map((c) => {
          const imgSrc = urlFor(c.image || c.cover || c.imageUrl);

          return (
            <Link
              key={c._id}
              href={`/collections/${c._id}`}
              className="border rounded overflow-hidden"
            >
              <div className="aspect-video bg-gray-100">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={c.name || "Collection"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium">{c.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {c.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
