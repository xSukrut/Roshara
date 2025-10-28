"use client";
import { ROSHARA_SIZES } from "../../constants/sizes";
import { useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useCart } from "../../../context/CartContext";

const SIZE_CHART = {
  "6XS": { bust: 22, waist: 15, hips: 25, shoulder: 13 },
  "5XS": { bust: 24, waist: 17, hips: 27, shoulder: 13 },
  "4XS": { bust: 26, waist: 19, hips: 29, shoulder: 13 },
  "3XS": { bust: 28, waist: 21, hips: 31, shoulder: 13 },
  "2XS": { bust: 30, waist: 23, hips: 33, shoulder: 14 },
  XS: { bust: 32, waist: 25, hips: 35, shoulder: 14 },
  S: { bust: 34, waist: 27, hips: 37, shoulder: 14 },
  M: { bust: 36, waist: 29, hips: 39, shoulder: 14 },
  L: { bust: 38, waist: 31, hips: 41, shoulder: 15 },
  XL: { bust: 40, waist: 33, hips: 43, shoulder: 15 },
  "2XL": { bust: 42.5, waist: 35.5, hips: 45.5, shoulder: 15.5 },
  "3XL": { bust: 45, waist: 38, hips: 48, shoulder: 15.5 },
  "4XL": { bust: 47.5, waist: 40.5, hips: 50.5, shoulder: 16 },
  "5XL": { bust: 50, waist: 43, hips: 53, shoulder: 16 },
  "6XL": { bust: 53, waist: 46, hips: 56, shoulder: 17 },
};
const ALL_SIZES = Object.keys(SIZE_CHART);

function normalizeSizes(list) {
  if (!Array.isArray(list) || list.length === 0) return ALL_SIZES;
  const set = new Set(list.filter((s) => SIZE_CHART[s]));
  return ALL_SIZES.filter((s) => set.has(s));
}

function imagesFromProduct(product) {
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") ||
    "http://localhost:5000";
  const pick = (img) => {
    if (!img) return null;
    const raw =
      typeof img === "string"
        ? img
        : img.url || img.src || img.path || img.location || img.file;
    if (!raw) return null;
    if (raw.startsWith("http")) return raw;
    if (raw.startsWith("/uploads")) return `${base}${raw}`;
    return raw;
  };
  const arr = (product?.images?.length ? product.images : [product?.image])
    .map(pick)
    .filter(Boolean);
  return arr.length ? arr : ["/placeholder.png"];
}

export default function ProductDetails({ product, onClose, onAddToCart }) {
  const { addItem, openMiniCart } = useCart(); // ⬅️ NEW (fallback)
  const gallery = useMemo(() => imagesFromProduct(product), [product]);
  const [active, setActive] = useState(0);
  const sizes = useMemo(() => normalizeSizes(product?.sizes), [product?.sizes]);
  const [selected, setSelected] = useState(sizes[0] || null);
  const [qty, setQty] = useState(1);
  const [showGuide, setShowGuide] = useState(false);
  const [err, setErr] = useState("");

  const measures = selected ? SIZE_CHART[selected] : null;

  const addToCart = () => {
    setErr("");
    if (!selected) {
      setErr("Please select a size.");
      return;
    }
    const item = {
      product: product._id,
      name: product.name,
      price: product.price,
      image: gallery[0],
      size: selected,
      qty, // your CartContext can ignore if it doesn't use qty
    };

    // Use parent handler if provided, else fallback to CartContext
    if (typeof onAddToCart === "function") {
      onAddToCart(item);
    } else {
      addItem(item); // ⬅️ Fallback path
      openMiniCart?.(); // ⬅️ Show mini cart if available
    }
    onClose?.();
  };

  return (
    <div className=" fixed inset-0 z-90 bg-black/50 backdrop-blur-xs">
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 w-full max-w-3xl mx-auto  ">
        <div className="relative bg-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl">
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* LEFT: gallery */}
            <div>
              <div className="relative w-full aspect-3/4 rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={gallery[active]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 flex gap-3">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border ${
                      i === active ? "border-black" : "border-gray-200"
                    }`}
                    onClick={() => setActive(i)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`thumb ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: info */}
            <div>
              <div className="text-xs tracking-wide text-gray-500">ROSHARA</div>
              <h1 className="text-2xl font-semibold mt-1">{product.name}</h1>
              <div className="mt-4 text-3xl font-semibold">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Size Chart</div>
                  <button
                    type="button"
                    onClick={() => setShowGuide(true)}
                    className="text-sm underline underline-offset-4 text-gray-600 hover:text-black"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-3">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelected(s)}
                      className={`min-w-48px h-10 rounded-full border px-3 text-sm ${
                        selected === s ? "border-black" : "border-gray-300"
                      } hover:border-black`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {measures && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <Spec label="Bust" value={measures.bust} />
                    <Spec label="Waist" value={measures.waist} />
                    <Spec label="Hips" value={measures.hips} />
                    <Spec label="Shoulder" value={measures.shoulder} />
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  All measurements in inches.
                </div>
                {err && <div className="mt-2 text-sm text-red-600">{err}</div>}
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="text-sm text-gray-600">Qty</div>
                <div className="flex items-center gap-2">
                  <button
                    className="w-10 h-10 border rounded hover:bg-gray-50"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                  >
                    –
                  </button>
                  <div className="w-10 text-center">{qty}</div>
                  <button
                    className="w-10 h-10 border rounded hover:bg-gray-50"
                    onClick={() => setQty((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                🚚 Free Delivery On Orders Over ₹2000
              </div>
            </div>
          </div>
        </div>

        {showGuide && <SizeGuideModal onClose={() => setShowGuide(false)} />}
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div className="border rounded px-3 py-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{value}"</div>
    </div>
  );
}

function SizeGuideModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-110 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="text-lg font-semibold">Size Guide</h3>
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:text-black"
          >
            Close
          </button>
        </div>
        <div className="max-h-[75vh] overflow-auto p-5 space-y-5">
          <img
            src="/size-guide.jpg"
            alt="Roshara Size Guide"
            className="w-full h-auto rounded"
          />
        </div>
      </div>
    </div>
  );
}
