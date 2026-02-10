"use client";

import { Suspense } from "react";
import QRGeneratorPage from "../qr/QRGeneratorPage";
import { Loader2 } from "lucide-react";

export default function QRGeneratorRoute() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense
          fallback={
            <div className="w-full flex items-center justify-center py-16">
              <div className="text-center space-y-3">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Loading QR tools...</p>
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
