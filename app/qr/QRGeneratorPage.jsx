"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Trash2,
  Plus,
  Download,
  Edit2,
  RefreshCw,
  Loader2,
  Eye,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation"; // Add useSearchParams
import { useAuth } from "@/app/providers";

import { clientSchema } from "../schemas/client.schema";
import { supabase } from "../lib/supabase";

const generateUUID = () => {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  if (typeof globalThis !== "undefined" && globalThis.crypto?.getRandomValues) {
    const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10

    const toHex = (value) => value.toString(16).padStart(2, "0");
    return [
      toHex(bytes[0]),
      toHex(bytes[1]),
      toHex(bytes[2]),
      toHex(bytes[3]),
      "-",
      toHex(bytes[4]),
      toHex(bytes[5]),
      "-",
      toHex(bytes[6]),
      toHex(bytes[7]),
      "-",
      toHex(bytes[8]),
      toHex(bytes[9]),
      "-",
      toHex(bytes[10]),
      toHex(bytes[11]),
      toHex(bytes[12]),
      toHex(bytes[13]),
      toHex(bytes[14]),
      toHex(bytes[15]),
    ].join("");
  }

  return `id-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
};

export default function QRGeneratorPage() {
  const [clientId, setClientId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingClient, setLoadingClient] = useState(false); // Add loading state
  const qrRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams(); // Add this
  const { user, loading: authLoading } = useAuth();

  // Get client ID from query parameter
  const clientIdFromQuery = searchParams.get("client");

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      company: "",
      customFields: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFields",
  });

  const BASE_URL = typeof window !== "undefined" ? window.location.origin : "";
  const qrValue = clientId ? `${BASE_URL}/client/${clientId}` : "";

  /* ===============================
     LOAD EXISTING CLIENT FROM QUERY PARAM
  =============================== */
  useEffect(() => {
    if (!clientIdFromQuery || !user) return;

    const loadExistingClient = async () => {
      setLoadingClient(true);
      setErrorMessage("");

      try {
        console.log("Loading client:", clientIdFromQuery);

        const { data: clientData, error } = await supabase
          .from("clients")
          .select("*")
          .eq("id", clientIdFromQuery)
          .eq("owner_id", user.id) // Security: only load if user is owner
          .single();

        if (error) {
          console.error("Error loading client:", error);
          setErrorMessage("Client not found or you don't have permission");
          return;
        }

        if (!clientData) {
          setErrorMessage("Client not found");
          return;
        }

        console.log("Client loaded:", clientData);

        // Set the form values
        setValue("name", clientData.name || "");
        setValue("phone", clientData.phone || "");
        setValue("email", clientData.email || "");
        setValue("company", clientData.company || "");

        // Set custom fields
        if (
          Array.isArray(clientData.custom_fields) &&
          clientData.custom_fields.length > 0
        ) {
          // Clear existing custom fields
          while (fields.length > 0) {
            remove(0);
          }
          // Add loaded custom fields
          clientData.custom_fields.forEach((field) => {
            append({ label: field.label || "", value: field.value || "" });
          });
        }

        // Set the client ID so QR shows
        setClientId(clientData.id);
        setSuccessMessage("Client loaded successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Failed to load client:", error);
        setErrorMessage("Failed to load client data");
      } finally {
        setLoadingClient(false);
      }
    };

    loadExistingClient();
  }, [clientIdFromQuery, user, setValue, append, remove, fields.length]);

  /* ===============================
     CREATE CLIENT + QR
  =============================== */
  const onGenerateQR = async (data) => {
    if (!user || clientId || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const id = clientIdFromQuery || generateUUID(); // Use existing ID if loading

    try {
      const clientData = {
        id,
        owner_id: user.id,
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        company: data.company.trim(),
        custom_fields: data.customFields.filter(
          (field) => field.label.trim() || field.value.trim(),
        ),
        created_at: new Date().toISOString(),
      };

      let result;

      if (clientIdFromQuery) {
        // Update existing client
        const { data: updateData, error: updateError } = await supabase
          .from("clients")
          .update(clientData)
          .eq("id", id)
          .eq("owner_id", user.id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = updateData;
      } else {
        // Create new client
        const { data: insertData, error: insertError } = await supabase
          .from("clients")
          .insert(clientData)
          .select()
          .single();

        if (insertError) throw insertError;
        result = insertData;
      }

      setClientId(result.id);
      setSuccessMessage(
        clientIdFromQuery
          ? "Client updated and QR code regenerated!"
          : "Client created and QR code generated successfully!",
      );

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Failed to save client");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
     UPDATE CLIENT
  =============================== */
  const onSaveChanges = async (data) => {
    if (!clientId || !user || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const { error } = await supabase
        .from("clients")
        .update({
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email.trim(),
          company: data.company.trim(),
          custom_fields: data.customFields.filter(
            (field) => field.label.trim() || field.value.trim(),
          ),
          updated_at: new Date().toISOString(),
        })
        .eq("id", clientId)
        .eq("owner_id", user.id); // Additional security check

      if (error) throw error;

      setSuccessMessage("Changes saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    reset({
      name: "",
      phone: "",
      email: "",
      company: "",
      customFields: [],
    });
    setClientId(null);
    setSuccessMessage("");
    setErrorMessage("");
    // Clear query parameter from URL
    router.push("/qrgenerator");
  };

  /* ===============================
     QR HELPERS
  =============================== */
  const copyQrValue = async () => {
    if (!qrValue) return;
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard?.writeText &&
        (typeof window === "undefined" || window.isSecureContext)
      ) {
        await navigator.clipboard.writeText(qrValue);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = qrValue;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (!ok) {
          throw new Error("Clipboard copy failed");
        }
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
      setErrorMessage("Clipboard not available. Please copy the URL manually.");
    }
  };

  const downloadQR = () => {
    if (!qrRef.current || !clientId) {
      setErrorMessage("No QR code available to download");
      return;
    }

    const svg = qrRef.current?.querySelector("svg");
    if (!svg) {
      setErrorMessage("QR code element not found");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      // Get SVG as string
      const svgString = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });

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
        a.download = `client-qr-${clientId}.png`;
        a.click();
      };

      img.onerror = () => {
        setErrorMessage("Failed to generate QR image");
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (error) {
      console.error("Download error:", error);
      setErrorMessage("Failed to download QR code");
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  /* ===============================
     LOADING STATE
  =============================== */
  if (authLoading || loadingClient) {
    return (
      <div className="flex justify-center text-gary-600 items-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">
            {loadingClient
              ? "Loading client data..."
              : "Loading authentication..."}
          </p>
        </div>
      </div>
    );
  }

  /* ===============================
     UI
  =============================== */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 text-gray-600 md:p-8 space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          {clientIdFromQuery ? "Update Client QR" : "Client QR Code Generator"}
        </h1>
        <p className="text-gray-600 mt-2">
          {clientIdFromQuery
            ? "Update client information and regenerate QR code"
            : "Create QR codes for client profiles"}
        </p>
      </div>

      {/* STATUS MESSAGES */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-green-50 border border-green-200 rounded-xl"
          >
            <p className="text-green-600 text-sm">{successMessage}</p>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORM SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Client Information
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {clientIdFromQuery
                  ? "Update client details"
                  : "Enter client details to generate QR code"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {clientId && (
                <button
                  onClick={() => router.push(`/client/${clientId}`)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                  title="View Client Profile"
                >
                  <Eye size={16} />
                  View Profile
                </button>
              )}
              <button
                onClick={clearForm}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 disabled:text-gray-400"
                disabled={isSubmitting}
                type="button"
              >
                <RefreshCw size={16} />
                {clientIdFromQuery ? "New Client" : "Clear All"}
              </button>
            </div>
          </div>

          {/* BASIC FIELDS */}
          <div className="space-y-4">
            {["name", "company", "email", "phone"].map((field) => (
              <div key={field} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field}
                  {field === "name" && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
                <input
                  {...register(field)}
                  placeholder={`Enter client ${field}`}
                  className={`w-full border ${errors[field] ? "border-red-300" : "border-gray-300"} rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100`}
                  disabled={isSubmitting}
                />
                {errors[field] && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors[field].message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* CUSTOM FIELDS */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  Custom Fields
                </h3>
                <p className="text-gray-500 text-sm">
                  Add additional information
                </p>
              </div>
              <button
                type="button"
                onClick={() => append({ label: "", value: "" })}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                disabled={isSubmitting}
              >
                <Plus size={16} />
                Add Field
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gray-50 rounded-xl space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Field Label
                      </label>
                      <input
                        {...register(`customFields.${index}.label`)}
                        placeholder="e.g., Department, Instagram, Website"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Value
                      </label>
                      <input
                        {...register(`customFields.${index}.value`)}
                        placeholder="Enter value"
                        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 disabled:text-gray-400"
                      disabled={isSubmitting}
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}

              {fields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                  <p className="text-gray-500">No custom fields added</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Add fields like social media links, addresses, etc.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6 border-t">
            {!clientId ? (
              <button
                onClick={handleSubmit(onGenerateQR)}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {clientIdFromQuery ? "Updating..." : "Generating..."}
                  </>
                ) : clientIdFromQuery ? (
                  "Update & Regenerate QR"
                ) : (
                  "Generate QR Code"
                )}
              </button>
            ) : (
              <button
                onClick={handleSubmit(onSaveChanges)}
                disabled={isSubmitting || !isDirty}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* QR SECTION */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
        >
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">QR Code</h2>
              <p className="text-gray-500 text-sm mt-1">
                Scan this code to view client profile
              </p>
            </div>

            {!clientId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                  <div className="w-16 h-16 border-4 border-gray-300 border-dashed rounded-lg"></div>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {clientIdFromQuery
                    ? "Loading client..."
                    : "No QR Code Generated"}
                </h3>
                <p className="text-gray-500 max-w-md">
                  {clientIdFromQuery
                    ? "Loading client data..."
                    : "Fill out the client information form and click 'Generate QR Code' to create a shareable QR code."}
                </p>
                {loadingClient && (
                  <div className="mt-4">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                  <div
                    ref={qrRef}
                    className="p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-inner"
                  >
                    <QRCode
                      value={qrValue}
                      size={240}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="H"
                    />
                  </div>

                  {/* QR URL WITH COPY */}
                  <div className="w-full space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Profile URL
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm break-all flex-1 font-mono text-gray-600">
                          {qrValue}
                        </p>
                        <button
                          onClick={copyQrValue}
                          className="flex-shrink-0 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Copy URL"
                          type="button"
                        >
                          {copied ? (
                            <Check size={18} className="text-green-600" />
                          ) : (
                            <Copy size={18} />
                          )}
                        </button>
                      </div>
                      {copied && (
                        <p className="text-xs text-green-600 mt-2">
                          URL copied to clipboard!
                        </p>
                      )}
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        onClick={downloadQR}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors"
                        type="button"
                      >
                        <Download size={18} />
                        Download QR
                      </button>
                      <button
                        onClick={() => router.push(`/client/${clientId}/edit`)}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
                        type="button"
                      >
                        <Edit2 size={18} />
                        Edit Client
                      </button>
                    </div>

                    <div className="pt-4 border-t">
                      <button
                        onClick={() => router.push(`/client/${clientId}`)}
                        className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm flex items-center justify-center gap-2"
                        type="button"
                      >
                        <Eye size={16} />
                        View Client Profile →
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
