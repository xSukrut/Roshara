"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCollections } from "../services/collectionService";

const imgUrl = (src) => (src?.startsWith("http") ? src : `http://localhost:5000${src}`);

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getAllCollections().then(setCollections).catch(() => setCollections([]));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Collections</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {collections.map((c) => (
          <Link key={c._id} href={`/collections/${c._id}`} className="border rounded overflow-hidden">
            <div className="aspect-video bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {c.image ? (
                <img src={imgUrl(c.image)} alt={c.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400">No Image</div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium">{c.name}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
