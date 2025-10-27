"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/NewArrivals/ProductCard";
import ProductDetails from "../components/NewArrivals/ProductDetails";
import { getAllProducts } from "../../services/productService";

export default function ShopAllPage() {
  const [all, setAll] = useState([]);
  const [visible, setVisible] = useState(12);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("new");
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        if (!ignore) setAll(Array.isArray(data) ? data : []);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...all];

    if (q.trim()) {
      const term = q.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    const min = Number(minP);
    const max = Number(maxP);
    if (!Number.isNaN(min) && min > 0) list = list.filter((p) => Number(p.price) >= min);
    if (!Number.isNaN(max) && max > 0) list = list.filter((p) => Number(p.price) <= max);

    if (sort === "price-asc") list.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === "price-desc") list.sort((a, b) => Number(b.price) - Number(a.price));
    else {
      list.sort((a, b) =>
        (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
        (a.createdAt ? new Date(a.createdAt).getTime() : 0)
      );
    }
    return list;
  }, [all, q, sort, minP, maxP]);

  const shown = filtered.slice(0, visible);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Shop All</h1>
        <p className="text-gray-600 mt-2">
          {loading ? "Loading products…" : `${filtered.length} item${filtered.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-6">
        <div className="flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full md:max-w-md border rounded-lg px-3 py-2"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={minP}
              onChange={(e) => setMinP(e.target.value)}
              placeholder="Min ₹"
              className="w-24 border rounded-lg px-2 py-2"
            />
            <span className="text-sm text-gray-500">—</span>
            <input
              type="number"
              min="0"
              value={maxP}
              onChange={(e) => setMaxP(e.target.value)}
              placeholder="Max ₹"
              className="w-24 border rounded-lg px-2 py-2"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="new">Newest</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      {/* Grid – pass size="lg" for tall cards */}
      {loading ? (
        <GridSkeleton />
      ) : shown.length === 0 ? (
        <div className="text-center text-gray-600 py-12">
          No products match your filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {shown.map((p) => (
              <ProductCard key={p._id} product={p} onSearch={setSelectedProduct} size="lg" />
            ))}
          </div>

          {shown.length < filtered.length && (
            <div className="text-center mt-8">
              <button
                onClick={() => setVisible((v) => v + 12)}
                className="px-6 py-2 border border-black rounded hover:bg-gray-100 transition"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}

      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </main>
  );
}

function GridSkeleton() {
  const cells = Array.from({ length: 8 });
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {cells.map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="w-full h-[420px] md:h-[460px] bg-gray-200 rounded-2xl" />
          <div className="mt-3 h-4 w-2/3 bg-gray-200 rounded" />
          <div className="mt-2 h-4 w-1/3 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}
