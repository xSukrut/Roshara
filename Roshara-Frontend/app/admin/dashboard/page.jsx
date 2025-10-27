"use client";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-6">Loading…</p>;
  if (!user || !(user.role === "admin" || user.isAdmin)) {
    return <p className="p-6 text-red-500">Access denied. Admins only.</p>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/admin/products" className="p-6 border rounded-lg hover:bg-gray-50">
          Manage Products →
        </Link>
        <Link href="/admin/collections" className="p-6 border rounded-lg hover:bg-gray-50">
          Manage Collections →
        </Link>
        <Link href="/admin/orders" className="p-6 border rounded-lg hover:bg-gray-50">
          Orders & UPI Verification →
        </Link>
      </div>
    </div>
  );
}
