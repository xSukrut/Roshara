// app/page.jsx
"use client";

import HeroSection from "./components/home/HeroSection";
import NewArrivals from "./components/NewArrivals/NewArrivals";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero at top, navbar sits above it */}
      <HeroSection />

      {/* New Arrivals */}
      <section className="max-w-8xl bg-[#F8F5F0] mx-auto px-4 py-12">
        <NewArrivals />
      </section>
    </div>
  );
}
