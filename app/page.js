"use client";

import { motion } from "framer-motion";
import QRGeneratorPage from "./qr/QRGeneratorPage";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center">
      <motion.div
        className="w-full max-w-5xl px-4 py-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* App Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl font-extrabold text-gray-900"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Dynamic Client QR System
          </motion.h1>

          <motion.p
            className="mt-3 text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
          >
            Generate a permanent QR code for your client and update their
            details anytime — without changing the QR.
          </motion.p>
        </motion.div>

        {/* Main App Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          <QRGeneratorPage />
        </motion.div>
      </motion.div>
    </main>
  );
}
