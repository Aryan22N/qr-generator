"use client";

import { Suspense } from "react";
import QRGeneratorPage from "../qr/QRGeneratorPage";

export default function QRGeneratorRoute() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="w-full flex items-center justify-center py-16">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-gray-600">Loading QR tools...</p>
              </div>
            </div>
          }
        >
          <QRGeneratorPage />
        </Suspense>
      </div>
    </main>
  );
}
