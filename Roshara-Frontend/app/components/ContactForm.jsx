"use client";

export default function ContactForm({ email }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = (data.get("name") || "Customer").toString().trim();
    const from = (data.get("email") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${from}\n\nMessage:\n${message}`);

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl border rounded-xl p-5 space-y-4">
      <input
        name="name"
        type="text"
        placeholder="Name"
        className="w-full border rounded-md px-3 py-2"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full border rounded-md px-3 py-2"
        required
      />
      <textarea
        name="message"
        placeholder="Message"
        rows={6}
        className="w-full border rounded-md px-3 py-2"
        required
      />
      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
      >
        Send Message
      </button>
    </form>
  );
}
