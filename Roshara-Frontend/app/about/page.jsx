export default function AboutPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">About Us</h1>
      <p className="leading-7">
        Roshara is a curated clothing brand. (Static content for now.)
        If you want this to come from backend, add GET /api/pages/about and fetch it here.
      </p>
    </div>
  );
}
