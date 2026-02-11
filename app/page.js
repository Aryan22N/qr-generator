"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import {
  ArrowRight,
  QrCode,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  BarChart3,
  Zap,
  Globe,
  Building,
} from "lucide-react";
import Hero3D from "./components/Hero3D";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleCtaClick = () => {
    if (authLoading) return;
    router.push(user ? "/qrgenerator" : "/login");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* ==========================================
          HERO SECTION
      ========================================== */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] mix-blend-multiply animate-blob" />
          <div className="absolute top-20 right-10 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000" />
        </div>

        {/* 3D Background */}
        <Hero3D />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-100 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                The Smartest Way to Manage Client QRs
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]"
              variants={itemVariants}
            >
              One QR per client.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Update details anytime.
              </span>
            </motion.h1>

            <motion.p
              className="max-w-2xl mx-auto text-xl text-gray-600 leading-relaxed font-medium"
              variants={itemVariants}
            >
              Generate permanent QR codes for your clients. Edit their contact
              info, links, or custom profiles instantly without ever reprinting
              the code.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            >
              <button
                onClick={handleCtaClick}
                disabled={authLoading}
                className="group relative px-8 py-4 bg-gray-900 text-white font-bold rounded-xl overflow-hidden shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-900/20 transition-all hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  {authLoading
                    ? "Checking session..."
                    : user
                      ? "Generate QR"
                      : "Start for Free"}
                  {!authLoading && (
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </span>
              </button>

              {user && (
                <button
                  className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all border border-gray-200 shadow-sm hover:shadow-md"
                  disabled={authLoading}
                  onClick={() => router.push("/client")}
                >
                  View Dashboard
                </button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          STATS SECTION
      ========================================== */}
      {/* <section className="py-10 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active QRs", value: "10k+", icon: QrCode },
              { label: "Scans Monthly", value: "2M+", icon: BarChart3 },
              { label: "Business Uses", value: "500+", icon: Building },
              { label: "Uptime", value: "99.9%", icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-center text-blue-600 mb-2">
                  <stat.icon size={24} className="opacity-80" />
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ==========================================
          HOW IT WORKS
      ========================================== */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to streamline your client management workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 z-0"></div>

            {[
              {
                step: "01",
                title: "Create Profile",
                desc: "Input client details like name, contact info, and custom links into our clean dashboard.",
                color: "bg-blue-600",
              },
              {
                step: "02",
                title: "Generate QR",
                desc: "Instantly create a unique, high-resolution QR code linked to that profile.",
                color: "bg-indigo-600",
              },
              {
                step: "03",
                title: "Update Anytime",
                desc: "Client changed their number? Update the profile and the QR stays exactly the same.",
                color: "bg-purple-600",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div
                  className={`w-24 h-24 ${item.color} rounded-3xl rotate-3 shadow-xl flex items-center justify-center mb-8 transform hover:rotate-6 transition-transform duration-300`}
                >
                  <span className="text-3xl font-bold text-white font-mono">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed px-4">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================
          FEATURES SECTION
      ========================================== */}
      <section className="py-24 bg-gray-50 relative clip-path-slant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: RefreshCw,
                title: "Dynamic Content",
                desc: "Static QRs are dead. Our dynamic system lets you change destination URLs and profile data instantly.",
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                icon: ShieldCheck,
                title: "Enterprise Security",
                desc: "Your client data is encrypted and protected. Manage access levels and ownership with ease.",
                color: "text-emerald-600",
                bg: "bg-emerald-100",
              },
              {
                icon: Globe,
                title: "Custom Branding",
                desc: "Make it yours. Add your logo, colors, and custom domain to every client profile page.",
                color: "text-purple-600",
                bg: "bg-purple-100",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-200/80 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
