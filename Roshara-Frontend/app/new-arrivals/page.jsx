// // app/components/NewArrivals/NewArrivals.jsx
// "use client";
// import { useEffect, useState } from "react";
// import api from "../../lib/apiClient.js";
// import Link from "next/link";

// export default function NewArrivals() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     api
//       .get("/products")
//       .then((res) => setProducts(res.data))
//       .catch(() => setProducts([]));
//   }, []);

//   if (!products.length)
//     return <p className="text-gray-500">No products yet.</p>;

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//       {products.slice(0, 8).map((p) => (
//         <Link
//           key={p._id}
//           href={`/shop/${p._id}`}
//           className="block border rounded overflow-hidden"
//         >
//           <div className="aspect-3/4 bg-gray-100">
//             {p.images?.[0] ? (
//               // basic img so you don’t need next/image config
//               <img
//                 src={`http://localhost:5000${p.images[0]}`}
//                 alt={p.name}
//                 className="w-full h-full object-cover"
//               />
//             ) : null}
//           </div>
//           <div className="p-3">
//             <div className="font-medium">{p.name}</div>
//             <div className="text-sm text-gray-600">₹{p.price}</div>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from "react";
// import api from "../../lib/apiClient.js";
// // import your existing ProductCard
// import ProductDetails from "../components/NewArrivals/ProductDetails"; // for quick view overlay
// import ProductCard from "../components/NewArrivals/ProductCard.jsx";
// import Link from "next/link";

// export default function NewArrivals() {
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null); // for overlay

//   useEffect(() => {
//     api
//       .get("/products")
//       .then((res) => setProducts(res.data))
//       .catch(() => setProducts([]));
//   }, []);

//   // open overlay
//   const handleQuickView = (product) => {
//     setSelectedProduct(product);
//   };

//   const handleClose = () => {
//     setSelectedProduct(null);
//   };

//   if (!products.length)
//     return <p className="text-gray-500">No products yet.</p>;

//   return (
//     <section className="p-8">
//       <h1 className="text-3xl font-bold mb-6 text-center">New Arrivals</h1>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//         {products.map((product) => (
//           <ProductCard
//             key={product._id}
//             product={product}
//             onSearch={handleQuickView} // for quick view overlay
//           />
//         ))}
//       </div>

//       {/* Quick view overlay */}
//       {selectedProduct && (
//         <ProductDetails product={selectedProduct} onClose={handleClose} />
//       )}
//     </section>
//   );
// }

"use client";

import Link from "next/link";

export default function ProductCard({ product, size = "md" }) {
  if (!product) return null;

  const img =
    (Array.isArray(product.images) && product.images[0]) ||
    product.image ||
    "/placeholder.png";

  const heightClass = size === "lg" ? "h-[420px] md:h-[460px]" : "h-[350px]";

  return (
    <Link
      href={`/product/${product._id}`} // if you use slugs, change to /product/${product.slug}
      className="group block"
      aria-label={product.name}
    >
      <div className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-gray-200`}>
        <img
          src={img}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      </div>

      <div className="mt-3 text-center">
        <h3 className="font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
        <p className="text-gray-900 font-semibold">₹{Number(product.price).toLocaleString("en-IN")}</p>
      </div>
    </Link>
  );
}
