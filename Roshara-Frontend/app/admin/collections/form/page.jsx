"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import api from "../../../../lib/apiClient";
import { useAuth } from "../../../../context/AuthContext";

export default function CollectionForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { token } = useAuth();

  const id = params.get("id");
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (id) {
      api.get(`/collections/${id}`).then((res) => setForm(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await api.put(`/collections/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Updated successfully!");
      } else {
        await api.post(`/collections`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Created successfully!");
      }
      setTimeout(() => router.push("/admin/collections"), 600);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-4">{id ? "Edit" : "Add"} Collection</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block mb-2 font-medium">Upload Collection Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("image", file);

            try {
              const res = await axios.post("http://localhost:5000/api/upload", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
                },
              });

              const imageUrl = res.data.imageUrl;

              setForm((prev) => ({ ...prev, image: res.data.imageUrl }));
            } catch (err) {
              console.error("Upload failed:", err);
            }
          }}
          className="w-full p-2 border rounded mb-3"
        />
        {form.image && (
          <img
            src={`http://localhost:5000${form.image}`}
            alt="preview"
            className="w-32 h-32 object-cover border rounded"
          />
        )}

        <input
          type="text"
          placeholder="Collection name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
          rows="4"
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          {id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}
