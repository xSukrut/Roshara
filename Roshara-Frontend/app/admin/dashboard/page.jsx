"use client";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <p className="p-6 text-red-500">Access denied. Admins only.</p>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        <Link href="/admin/products" className="p-6 border rounded-lg hover:bg-gray-50">
          Manage Products →
        </Link>
        <Link href="/admin/collections" className="p-6 border rounded-lg hover:bg-gray-50">
          Manage Collections →
        </Link>
      </div>
    </div>
  );
}
