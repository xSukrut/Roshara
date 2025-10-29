// services/collectionService.js

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");


async function getJSON(url, options) {
  const res = await fetch(url, {
    ...options,
    
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

export async function getAllCollections() {
  return getJSON(`${API_BASE}/collections`);
}

export async function getCollection(id) {
  if (!id) throw new Error("getCollection: id is required");
  return getJSON(`${API_BASE}/collections/${id}`);
}

/* If you have admin endpoints you can add them as needed:
export async function createCollection(payload) {
  return getJSON(`${API_BASE}/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateCollection(id, payload) {
  return getJSON(`${API_BASE}/collections/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
*/
