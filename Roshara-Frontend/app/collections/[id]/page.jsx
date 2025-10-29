"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAllProducts } from "../../../services/productService";
import { getCollection } from "../../../services/collectionService"; 
import ProductCard from "../../components/NewArrivals/ProductCard";
import ProductDetails from "../../components/NewArrivals/ProductDetails";

export default function CollectionProductsPage() {
  const { id } = useParams() || {};
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!id) return;

    getCollection(id)
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

  const handleOpenQuickView = (product) => setSelectedProduct(product);
  const handleCloseQuickView = () => setSelectedProduct(null);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-1">
        {collection?.name || "Collection"}
      </h1>

      {collection?.description && (
        <p className="text-gray-600 mb-6">{collection.description}</p>
      )}

      {products.length === 0 ? (
        <p className="text-gray-500">No products in this collection yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onSearch={handleOpenQuickView}
              size="lg"
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={handleCloseQuickView} />
      )}
    </div>
  );
}
