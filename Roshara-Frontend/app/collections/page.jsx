"use client";
import { useEffect, useState } from "react";
import { getAllCollections } from "../../services/collectionService";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getAllCollections().then(setCollections);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Collections</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {collections.map((c) => (
          <div key={c._id} className="border rounded-lg p-4 bg-gray-50">
            <h2 className="text-xl font-semibold">{c.name}</h2>
            <p className="text-gray-600">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
