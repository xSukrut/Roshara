// "use client";
// import Link from "next/link";
// import Image from "next/image";

// export default function CollectionCard({ collection }) {
//   const cover =
//     collection.image || "https://via.placeholder.com/800x500?text=Collection";

//   return (
//     <Link
//       href={`/collections/${collection._id}`}
//       className="block border rounded overflow-hidden"
//     >
//       <div className="relative h-48">
//         {/* make sure next.config.js allows via.placeholder.com (you already did) */}
//         <Image
//           src={cover}
//           alt={collection.name}
//           fill
//           style={{ objectFit: "cover" }}
//         />
//       </div>
//       <div className="p-4">
//         <h3 className="font-semibold">{collection.name}</h3>
//         {collection.description && (
//           <p className="text-sm mt-1 line-clamp-2">{collection.description}</p>
//         )}
//       </div>
//     </Link>
//   );
// }

"use client";
import Link from "next/link";
import Image from "next/image";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
  "http://localhost:5000";

const pickPath = (src) => {
  if (!src) return null;
  if (typeof src === "string") return src;
  return src.url || src.src || src.path || src.location || src.file || null;
};

const urlFor = (src) => {
  const p = pickPath(src);
  if (!p) return "/placeholder.png";
  if (p.startsWith("http")) return p;
  const path = p.startsWith("/") ? p : `/${p}`;
  if (path.startsWith("/uploads")) return `${API_BASE}${path}`;
  return `${API_BASE}${path}`;
};

export default function CollectionCard({ collection }) {
  const cover = urlFor(
    collection.image || collection.cover || collection.imageUrl
  );

  return (
    <Link
      href={`/collections/${collection._id}`}
      className="group relative block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-60 w-full">
        <Image
          src={cover}
          alt={collection.name}
          fill
          className="object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-300"></div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
        <h3 className="text-xl font-semibold tracking-wide drop-shadow-md">
          {collection.name}
        </h3>
        {collection.description && (
          <p className="text-sm mt-2 text-gray-200 line-clamp-2 max-w-xs">
            {collection.description}
          </p>
        )}
      </div>
    </Link>
  );
}
