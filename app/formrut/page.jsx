"use client";

import React from "react";
import NewOrderForm from "../components/form";
import { ArrowLeft, PlusCircle, Settings, Download } from "lucide-react";

// Mock data - replace with your actual data fetching
const mockCustomers = [
  {
    id: "1",
    name: "John Smith",
    mobile: "+1 (555) 123-4567",
    email: "john@example.com",
  },
  {
    id: "2",
    name: "Acme Corporation",
    mobile: "+1 (555) 987-6543",
    email: "orders@acme.com",
  },
  {
    id: "3",
    name: "Sarah Johnson",
    mobile: "+1 (555) 456-7890",
    email: "sarah@business.com",
  },
  {
    id: "4",
    name: "Tech Solutions Ltd",
    mobile: "+1 (555) 234-5678",
    email: "info@techsolutions.com",
  },
  {
    id: "5",
    name: "Retail Store Chain",
    mobile: "+1 (555) 876-5432",
    email: "orders@retailchain.com",
  },
];

const Page = () => {
  // You can fetch customers here in a real application
  // const { data: customers, isLoading } = useFetchCustomers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  New Order
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  Create a new order for your customer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Download size={16} />
                <span>Template</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">1,247</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <PlusCircle className="text-blue-600" size={20} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">+12% from last month</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {mockCustomers.length}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.67 3.357a9 9 0 01-13.67 0"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              All customers available
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">94%</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">High satisfaction rate</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {/* Form Header Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button className="px-6 py-4 border-b-2 border-blue-600 text-blue-600 font-medium whitespace-nowrap">
                Order Details
              </button>
              <button className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">
                Shipping Info
              </button>
              <button className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">
                Payment
              </button>
              <button className="px-6 py-4 text-gray-500 hover:text-gray-700 font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">
                Attachments
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {/* Product Type Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Product Type
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["brochures", "business-cards", "flyers", "banners"].map(
                  (type) => (
                    <button
                      key={type}
                      className={`p-4 rounded-lg border transition-all ${
                        type === "brochures"
                          ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200"
                          : "border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`p-2 rounded-full ${
                            type === "brochures" ? "bg-blue-100" : "bg-gray-100"
                          }`}
                        >
                          {type === "brochures" && (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm font-medium capitalize">
                          {type.replace("-", " ")}
                        </span>
                      </div>
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Form Component */}
            <div className="relative">
              {/* Loading Overlay (if needed) */}
              {/* {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              )} */}

              <NewOrderForm productType="brochures" customers={mockCustomers} />
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Need help with your order?
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Our team is available 24/7 to assist you with any questions
                    about your order specifications, pricing, or delivery
                    options.
                  </p>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Contact Support →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h4 className="font-medium text-gray-900 mb-4">Quick Tips</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-green-600 font-medium">1</span>
                </div>
                <span className="text-sm text-gray-600">
                  Double-check all measurements before submission
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-green-600 font-medium">2</span>
                </div>
                <span className="text-sm text-gray-600">
                  Upload high-resolution files for best quality
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-green-600 font-medium">3</span>
                </div>
                <span className="text-sm text-gray-600">
                  Include special instructions in the notes section
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Print Management System. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Help Center
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Add custom styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .bg-grid-pattern {
          background-image:
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }

        /* Smooth transitions */
        * {
          transition:
            background-color 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default Page;
