"use client";
import { useEffect, useState } from "react";
import { getAllCollections } from "../services/collectionService";
import CollectionCard from "../components/CollectionCard";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getAllCollections()
      .then(setCollections)
      .catch(console.error);
  }, []);

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Collections</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map((c) => (
          <CollectionCard key={c._id} collection={c} />
        ))}
      </div>
    </section>
  );
}
