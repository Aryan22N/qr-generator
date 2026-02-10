"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import { useAuth } from "@/app/providers";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  QrCode,
  Calendar,
  Building,
  Phone,
  Mail,
  Copy,
  Check,
  Loader2,
  UserCircle,
} from "lucide-react";
import QRCode from "react-qr-code";

export default function ClientsDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  /* ===============================
     LOAD USER'S CLIENTS
  =============================== */
  useEffect(() => {
    if (!user) return;

    const loadClients = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setClients(data || []);
        setFilteredClients(data || []);
      } catch (error) {
        console.error("Error loading clients:", error);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [user]);

  /* ===============================
     SEARCH & FILTER
  =============================== */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClients(clients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(query) ||
        client.company?.toLowerCase().includes(query) ||
        client.email?.toLowerCase().includes(query) ||
        client.phone?.toLowerCase().includes(query),
    );

    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  /* ===============================
     CLIENT ACTIONS
  =============================== */
  const handleViewClient = (client) => {
    router.push(`/client/${client.id}`);
  };

  const handleEditClient = (client) => {
    router.push(`/client/${client.id}/edit`);
  };

  const handleViewQR = (client) => {
    router.push(`/qrgenerator?client=${client.id}`);
  };

  const handleCopyLink = async (clientId) => {
    const url = `${window.location.origin}/client/${clientId}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(clientId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteClient = async (clientId) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId)
        .eq("owner_id", user.id);

      if (error) throw error;

      // Remove from local state
      setClients((prev) => prev.filter((c) => c.id !== clientId));
      setFilteredClients((prev) => prev.filter((c) => c.id !== clientId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting client:", error);
      alert("Failed to delete client");
    }
  };

  const downloadQR = (client) => {
    const svg = document
      .getElementById(`qr-${client.id}`)
      ?.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const svgString = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `client-${client.name}-qr.png`;
      a.click();
    };
    img.src = url;
  };

  /* ===============================
     FORMATTING HELPERS
  =============================== */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  /* ===============================
     LOADING STATE
  =============================== */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600">Loading your clients...</p>
        </div>
      </div>
    );
  }

  /* ===============================
     NO USER STATE
  =============================== */
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6 border border-gray-100"
        >
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-600">
            <UserCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Sign In Required</h2>
          <p className="text-gray-500">Please sign in to view and manage your clients.</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/20"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* BACKGROUND DECORATION */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-100/40 blur-3xl rounded-full mix-blend-multiply opacity-70"></div>
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-indigo-100/40 blur-3xl rounded-full mix-blend-multiply opacity-70"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-10">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Client Management
            </h1>
            <p className="text-gray-500 text-lg max-w-xl">
              Create, manage, and track your client QR codes efficiently.
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push("/")}
            className="group flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">New Client QR</span>
          </motion.button>
        </div>

        {/* SEARCH BAR */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative group max-w-2xl"
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search clients by name, company, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm group-hover:shadow-md"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
              {filteredClients.length} found
            </span>
          </div>
        </motion.div>

        {/* CLIENTS GRID */}
        {filteredClients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 text-center"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <QrCode className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchQuery ? "No matching clients found" : "No clients yet"}
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              {searchQuery
                ? "Try adjusting your search terms to find what you're looking for."
                : "Get started by creating your first client QR code. It only takes a few seconds."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                <Plus size={20} />
                Create First Client
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-100 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                          {getInitials(client.name)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                            {client.name || "Unnamed Client"}
                          </h3>
                          {client.company && (
                            <p className="text-sm text-gray-500 font-medium flex items-center gap-1 mt-0.5 line-clamp-1">
                              <Building size={14} />
                              {client.company}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Hidden QR for download generation */}
                      <div className="hidden">
                        <div id={`qr-${client.id}`}>
                          <QRCode
                            value={`${window.location.origin}/client/${client.id}`}
                            size={256}
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                          />
                        </div>
                      </div>

                      {/* Visible QR Preview */}
                      <div
                        className="relative w-12 h-12 bg-white rounded-lg border border-gray-100 p-1 cursor-pointer"
                        onClick={() => handleViewQR(client)}
                        title="View Full QR"
                      >
                        <QRCode
                          value={`${window.location.origin}/client/${client.id}`}
                          size={100}
                          style={{ height: "100%", width: "100%" }}
                          viewBox={`0 0 256 256`}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100/50">
                        <Mail size={16} className="text-gray-400 shrink-0" />
                        <span className="truncate font-medium">{client.email || "No email"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100/50">
                        <Phone size={16} className="text-gray-400 shrink-0" />
                        <span className="truncate font-medium">{client.phone || "No phone"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                        <Calendar size={14} />
                        {formatDate(client.created_at)}
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleCopyLink(client.id)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={copiedId === client.id ? "Copied" : "Copy Link"}
                        >
                          {copiedId === client.id ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                        <button
                          onClick={() => downloadQR(client)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download QR"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Main Action Bar */}
                  <div className="bg-gray-50/80 p-3 grid grid-cols-2 gap-3 border-t border-gray-100">
                    <button
                      onClick={() => handleViewClient(client)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      <Eye size={16} /> View
                    </button>

                    {deleteConfirm === client.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="flex-1 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClient(client)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-all"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(client.id)}
                          className="flex items-center justify-center px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
