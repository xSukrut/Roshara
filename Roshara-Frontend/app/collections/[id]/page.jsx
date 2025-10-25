"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductGrid from "../../components/ProductGrid";
import { getCollectionById } from "../../services/collectionService";
import { getAllProducts } from "../../services/productService";

export default function CollectionDetailPage() {
  const { id } = useParams();
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const coll = await getCollectionById(id);
        setCollection(coll);

        // ask backend for products filtered by collection (see backend enhancement below)
        const prods = await getAllProducts({ collection: id });
        setProducts(prods);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [id]);

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">
        {collection?.name || "Collection"}
      </h1>
      {collection?.description && (
        <p className="mb-4">{collection.description}</p>
      )}
      <ProductGrid products={products} />
    </section>
  );
}
