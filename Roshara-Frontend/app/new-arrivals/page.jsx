
"use client";
import { useEffect, useMemo, useState } from "react";
import { getAllProducts } from "../../services/productService"; // adjust path if needed
import ProductCard from "../components/NewArrivals/ProductCard"; // adjust path
import ProductDetails from "../components/NewArrivals/ProductDetails"; // adjust path

export default function NewArrivalsPage() {
  const [all, setAll] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getAllProducts()
      .then((data) => (Array.isArray(data) ? setAll(data) : setAll([])))
      .catch(() => setAll([]));
  }, []);

  // newest first (optional)
  const newest = useMemo(() => {
    const copy = [...all];
    copy.sort((a, b) => {
      const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });
    return copy;
  }, [all]);

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-center mb-2">All New Arrivals</h1>
      <p className="text-center text-gray-600 mb-8">
        Explore the latest additions to our collection
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {newest.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            onSearch={setSelected}   // <-- this enables the “zoom” button
            size="lg"
          />
        ))}
      </div>

      {selected && (
        <ProductDetails product={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}




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

// "use client";

// import Link from "next/link";

// export default function Page({ product, size = "md" }) {
//   if (!product) return null;

//   const img =
//     (Array.isArray(product.images) && product.images[0]) ||
//     product.image ||
//     "/placeholder.png";

//   const heightClass = size === "lg" ? "h-[420px] md:h-[460px]" : "h-[350px]";

//   return (
//     <Link
//       href={`/product/${product._id}`}
//       className="group block"
//       aria-label={product.name}
//     >
//       <div
//         className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border border-gray-200`}
//       >
//         <img
//           src={img}
//           alt={product.name}
//           className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
//         />
//       </div>

//       <div className="mt-3 text-center">
//         <h3 className="font-semibold text-gray-800 line-clamp-2">
//           {product.name}
//         </h3>
//         <p className="text-gray-900 font-semibold">
//           ₹{Number(product.price).toLocaleString("en-IN")}
//         </p>
//       </div>
//     </Link>
//   );
// }

