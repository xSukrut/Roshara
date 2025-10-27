// "use client";
// import { useEffect, useState } from "react";
// import { getAllProducts } from "../../../services/productService";
// import ProductCard from "./ProductCard";

// export default function NewArrivals() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     getAllProducts().then(setProducts).catch(console.error);
//   }, []);

//   return (
//     <section className="p-8">
//       <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {products.map(p => <ProductCard key={p._id} product={p} />)}
//       </div>
//     </section>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { getAllProducts } from "../../../services/productService";
import ProductCard from "./ProductCard";
import Link from "next/link";
import ProductDetails from "./ProductDetails";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    getAllProducts().then(setProducts).catch(console.error);
  }, []);

  // Show only 4 products for the home page
  const visibleProducts = products.slice(0, 4);

  const handleSearch = (product) => {
    setSelectedProduct(product);
  };

  const handleClose = () => {
    setSelectedProduct(null);
  };

  return (
    <section className="p-8 ">
      {/* Heading and View All button in one row */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold text-center mb-6">New Arrivals</h2>
        <Link
          href="/new-arrivals"
          className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
        >
          View All
        </Link>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visibleProducts.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onSearch={handleSearch}
            className="w-64 h-80"
          />
        ))}
      </div>

      {/* Overlay for product details */}
      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={handleClose} />
      )}
    </section>
  );
}
