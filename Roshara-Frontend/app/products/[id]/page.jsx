"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProduct } from "../../services/productService";
import { useCart } from "../../../context/CartContext";

const imgUrl = (src) => (src?.startsWith("http") ? src : `http://localhost:5000${src}`);

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (id) getProduct(id).then(setProduct);
  }, [id]);

  if (!product) return <div className="max-w-6xl mx-auto p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <div>
        <div className="aspect-square bg-gray-100 overflow-hidden rounded">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgUrl(product.images?.[0])}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        {product.images?.length > 1 && (
          <div className="grid grid-cols-5 gap-3 mt-3">
            {product.images.slice(1).map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={imgUrl(img)} alt="" className="aspect-square object-cover rounded" />
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="text-gray-700 mt-2">{product.description}</p>
        <p className="text-xl mt-4">₹{product.price}</p>

        <div className="flex items-center gap-3 mt-6">
          <label>Qty</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-20 border rounded p-2"
          />
        </div>

        <button
          onClick={() => addItem(product, qty)}
          className="mt-6 bg-black text-white px-5 py-2 rounded hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
