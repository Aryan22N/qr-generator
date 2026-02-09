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
  Filter,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import QRCode from "react-qr-code";

export default function ClientsDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to view your clients</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                My Clients
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all your client QR codes in one place
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push("/")}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all"
              >
                <Plus size={20} />
                New Client QR
              </button>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search clients by name, company, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-gray-600 pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className="text-sm text-gray-500">
                  {filteredClients.length}{" "}
                  {filteredClients.length === 1 ? "client" : "clients"}
                </span>
              </div>
            </div>
          </div>

          {/* CLIENTS GRID */}
          {filteredClients.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <QrCode className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchQuery ? "No clients found" : "No clients yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first client QR code to get started"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => router.push("/")}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  Create First Client
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* CLIENT CARD HEADER */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {getInitials(client.name)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {client.name || "Unnamed Client"}
                          </h3>
                          {client.company && (
                            <p className="text-gray-600 text-sm flex items-center gap-1">
                              <Building size={14} />
                              {client.company}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* QR PREVIEW */}
                      <div
                        id={`qr-${client.id}`}
                        className="w-16 h-16 p-2 border border-gray-200 rounded-lg"
                      >
                        <QRCode
                          value={`${window.location.origin}/client/${client.id}`}
                          size={64}
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                        />
                      </div>
                    </div>

                    {/* CONTACT INFO */}
                    <div className="space-y-2">
                      {client.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} />
                          <span className="truncate">{client.email}</span>
                        </div>
                      )}

                      {client.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} />
                          <span>{client.phone}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>Created {formatDate(client.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleViewClient(client)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        title="View Profile"
                      >
                        <Eye size={16} />
                        View
                      </button>

                      <button
                        onClick={() => handleEditClient(client)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        title="Edit Client"
                      >
                        <Edit size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() => downloadQR(client)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                        title="Download QR"
                      >
                        <Download size={16} />
                        Download
                      </button>

                      <button
                        onClick={() => handleCopyLink(client.id)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm"
                        title="Copy Link"
                      >
                        {copiedId === client.id ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                        {copiedId === client.id ? "Copied!" : "Copy"}
                      </button>
                    </div>

                    {/* DELETE BUTTON */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {deleteConfirm === client.id ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-red-600">Delete?</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteClient(client.id)}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                            >
                              No
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(client.id)}
                          className="w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 text-sm"
                        >
                          <Trash2 size={14} />
                          Delete Client
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
