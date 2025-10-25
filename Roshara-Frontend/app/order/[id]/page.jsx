"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "../../../services/orderService";

export default function OrderPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;
    getOrderById(id).then(setOrder).catch(console.error);
  }, [id]);

  if (!order) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">Order {order._id}</h1>
      <p>Status: {order.status}</p>
      <p>Total: ₹{order.totalPrice}</p>
      <h2 className="mt-4 font-semibold">Items</h2>
      {order.orderItems.map(it => (
        <div key={it._id} className="border-b py-2">
          <p>{it.name} x {it.quantity} — ₹{it.price}</p>
        </div>
      ))}
    </div>
  );
}
