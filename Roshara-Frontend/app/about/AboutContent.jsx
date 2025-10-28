"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function AboutContent() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-2 text-amber-600 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="uppercase tracking-wide text-sm font-medium">
            The Story Behind
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          About <span className="text-[#481617]">Roshara</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Where elegance meets craftsmanship — designed with love, made to last.
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="bg-linear-to-br from-white to-amber-50/40 rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12"
      >
        <div className="space-y-6 text-lg leading-relaxed text-gray-700">
          <p>
            Roshara was born from a simple thought of making fashion feel
            luxurious, personal, and yet affordable. Roshara bridges India’s
            traditional elegance with modern comfort, offering pieces that feel
            made just for you.
          </p>

          <p>
            Roshara is for women and men aged 20–35yrs, who love dressing up but
            value comfort and individuality, be it traditional or western.
            They’re style conscious, social, and want something unique for every
            occasion — be it a pooja, party, or brunch.
          </p>

          <p>
            Roshara offers a full spectrum of fashion from ethnic wear to daily
            wear long and short kurtis as well as men’s wear.
          </p>

          <p>
            Custom sizing is a free service because fashion should fit you, not
            the other way around. For custom orders, Roshara collects the
            following measurements: Bust, waist, hip, shoulder width, sleeve
            length, dress/top length. <br />
            <span className="italic text-gray-500">
              Note: For sizes exceeding XL, ₹200 would be charged extra.
            </span>
          </p>

          <p>
            Currently, Roshara ships pan-India, with international shipping
            launching soon.
          </p>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        className="mt-16 grid sm:grid-cols-2 gap-8"
      >
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm p-8 hover:shadow-md transition-all duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-amber-700">
            What We Value
          </h2>
          <ul className="list-disc ml-5 space-y-2 text-gray-700">
            <li>Timeless design over fast cycles</li>
            <li>Small-batch, responsible production</li>
            <li>Comfortable, durable fabrics</li>
            <li>Fair partnerships with makers</li>
          </ul>
        </div>

        <div className="relative bg-linear-to-br from-amber-50 to-white border border-amber-100 rounded-2xl p-8 flex flex-col justify-center shadow-sm overflow-hidden">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-3 text-amber-800">
              “Crafted with Care, Worn with Confidence.”
            </h3>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Every Roshara piece tells a story — of skill, detail, and devotion
              to timeless style.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
