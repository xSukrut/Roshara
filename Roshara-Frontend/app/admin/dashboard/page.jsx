"use client";
import AdminRoute from "../../components/AdminRoute";

export default function AdminDashboard() {
  return (
    <AdminRoute>
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p>Welcome, Admin! Here you’ll manage products, orders, and coupons.</p>
      </div>
    </AdminRoute>
  );
}
