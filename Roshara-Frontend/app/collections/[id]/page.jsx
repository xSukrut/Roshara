"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAllProducts } from "../../services/productService";
import { getCollection } from "../../services/collectionService";
import ProductGrid from "../../components/ProductGrid";

export default function CollectionProductsPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!id) return;
    getCollection(id).then(setCollection);
    getAllProducts().then((all) => {
      // backend populates collection on product (name only)
      const filtered = all.filter((p) => p.collection?._id === id || p.collection?._id === undefined && p.collection?._id === id);
      // If p.collection returns as full object (when populated) it should have _id; if not populated, you might compare names.
      setProducts(
        filtered.length
          ? filtered
          : all.filter((p) => p.collection?.name && collection?.name && p.collection.name === collection.name)
      );
    });
  }, [id, collection?.name]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">
        {collection ? collection.name : "Collection"}
      </h1>
      <ProductGrid products={products} />
    </div>
  );
}
