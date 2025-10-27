export const metadata = {
  title: "About Us • Roshara",
  description:
    "Roshara is a curated clothing brand focused on timeless silhouettes, thoughtful details, and small-batch craftsmanship.",
};

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">About Us</h1>

      <section className="space-y-4 text-lg leading-relaxed text-gray-700">
        <p>
          Roshara was born from a simple thought of making fashion feel luxurious, personal, and yet affordable.  Roshara bridges India’s traditional elegance with modern comfort, offering pieces that feel made just for you.
        </p>

        <p>
          Roshara is for women and men aged 20–35yrs, who love dressing up but value comfort and individuality, be it traditional or western. They’re style conscious, social, and want something unique for every occasion — be it a pooja, party, or brunch.
        </p>

        <p>
          Roshara offers a full spectrum of fashion from ethnic wear to daily wear long and short kurtis as well as men’s wear
        </p>

        <p>
         Custom sizing is a free service because fashion should fit you, not the other way around.
         For custom orders, Roshara collects the following measurements: Bust, waist, hip, shoulder width, sleeve length, dress/top length.
         Note: For sizes exceeding XL 200 would be charged extra. 

        </p>

        <p>
          Currently, Roshara ships pan-India, with international shipping launching soon.
        </p>
      </section>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="p-5 border rounded-xl">
          <h2 className="text-xl font-semibold mb-2">What We Value</h2>
          <ul className="list-disc ml-5 space-y-1 text-gray-700">
            <li>Timeless design over fast cycles</li>
            <li>Small-batch, responsible production</li>
            <li>Comfortable, durable fabrics</li>
            <li>Fair partnerships with makers</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

