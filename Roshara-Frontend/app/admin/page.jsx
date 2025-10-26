"use client";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-semibold mb-6 text-center">Admin Dashboard</h1>
        <div className="space-y-4">
          <Link href="/admin/products" className="block bg-black text-white text-center py-2 rounded hover:bg-gray-800">
            Manage Products
          </Link>
          <Link href="/admin/collections" className="block bg-black text-white text-center py-2 rounded hover:bg-gray-800">
            Manage Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
