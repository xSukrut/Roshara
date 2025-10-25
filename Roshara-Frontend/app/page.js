import HeroSection from "@/app/components/home/HeroSection";

import Link from "next/link";
import NewArrivals from "./components/NewArrivals/NewArrivals";

export default function Homepage() {
  return (
    <main>
      <HeroSection />
      <NewArrivals />
    </main>
  );
}
