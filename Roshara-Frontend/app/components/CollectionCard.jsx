"use client";
import Link from "next/link";
import Image from "next/image";

export default function CollectionCard({ collection }) {
  const cover =
    collection.image ||
    "https://via.placeholder.com/800x500?text=Collection";

  return (
    <Link href={`/collections/${collection._id}`} className="block border rounded overflow-hidden">
      <div className="relative h-48">
        {/* make sure next.config.js allows via.placeholder.com (you already did) */}
        <Image src={cover} alt={collection.name} fill style={{ objectFit: "cover" }} />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{collection.name}</h3>
        {collection.description && (
          <p className="text-sm mt-1 line-clamp-2">{collection.description}</p>
        )}
      </div>
    </Link>
  );
}
