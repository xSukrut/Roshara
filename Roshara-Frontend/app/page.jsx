// // app/page.jsx
// "use client";

// import HeroSection from "./components/home/HeroSection";
// import NewArrivals from "./components/NewArrivals/NewArrivals";

// export default function HomePage() {
//   return (
//     <div className="min-h-screen">
//       {/* Hero at top, navbar sits above it */}
//       <HeroSection />

//       {/* New Arrivals */}
//       <section className="max-w-8xl bg-[#F8F5F0] mx-auto px-4 py-12">
//         <NewArrivals />
//       </section>
//     </div>
//   );
// }

"use client";

import HeroSection from "./components/home/HeroSection";
import NewArrivals from "./components/NewArrivals/NewArrivals";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCollections } from "../services/collectionService";
import CollectionCard from "./components/CollectionCard"; // adjust path if needed

export default function Homepage() {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    getAllCollections()
      .then((data) =>
        setCollections(Array.isArray(data) ? data.slice(0, 3) : [])
      ) // show first 3 collections
      .catch(() => setCollections([]));
  }, []);

  return (
    <main>
      <HeroSection />
      <NewArrivals />

      {/* 🟢 Collections Preview Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Our Collections</h2>
          <Link
            href="/collections"
            className="text-blue-600 hover:underline font-medium"
          >
            View All
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {collections.length > 0 ? (
            collections.map((collection) => (
              <CollectionCard key={collection._id} collection={collection} />
            ))
          ) : (
            <p className="text-gray-500">No collections available yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
