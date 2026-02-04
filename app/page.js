import QRGeneratorPage from "./qr/QRGeneratorPage";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center">
      <div className="w-full max-w-5xl px-4 py-10">
        {/* App Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Dynamic Client QR System
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Generate a permanent QR code for your client and update their
            details anytime — without changing the QR.
          </p>
        </div>

        {/* Main App Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
          <QRGeneratorPage />
        </div>
      </div>
    </main>
  );
}
