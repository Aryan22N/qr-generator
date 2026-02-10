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
  ArrowRight,
  Save,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const [loadingClient, setLoadingClient] = useState(false);
  const qrRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
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
      <div className="flex justify-center text-primary items-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">
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
      className="max-w-6xl mx-auto p-4 md:p-8 space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {clientIdFromQuery ? "Update Client QR" : "Client QR Code Generator"}
        </h1>
        <p className="text-muted-foreground mt-2">
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
            className="p-4 bg-green-500/15 border border-green-500/30 rounded-xl"
          >
            <p className="text-green-600 dark:text-green-400 text-sm">{successMessage}</p>
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-destructive/15 border border-destructive/30 rounded-xl"
          >
            <p className="text-destructive text-sm">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORM SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">
                Client Information
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {clientIdFromQuery
                  ? "Update client details"
                  : "Enter client details to generate QR code"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {clientId && (
                <button
                  onClick={() => router.push(`/client/${clientId}`)}
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  title="View Client Profile"
                >
                  <Eye size={16} />
                  View Profile
                </button>
              )}
              <button
                onClick={clearForm}
                className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 disabled:opacity-50 transition-colors"
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
                <label className="block text-sm font-medium text-foreground capitalize">
                  {field}
                  {field === "name" && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </label>
                <input
                  {...register(field)}
                  placeholder={`Enter client ${field}`}
                  className={`w-full bg-muted/50 border ${errors[field] ? "border-destructive focus:ring-destructive/30" : "border-input focus:ring-primary/30"} rounded-xl px-4 py-3 focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 outline-none`}
                  disabled={isSubmitting}
                />
                {errors[field] && (
                  <p className="text-xs text-destructive mt-1">
                    {errors[field].message}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* CUSTOM FIELDS */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-card-foreground">
                  Custom Fields
                </h3>
                <p className="text-muted-foreground text-sm">
                  Add additional information
                </p>
              </div>
              <button
                type="button"
                onClick={() => append({ label: "", value: "" })}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 disabled:opacity-50"
                disabled={isSubmitting}
              >
                <Plus size={16} />
                Add Field
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-muted/30 rounded-xl space-y-3 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Field Label
                        </label>
                        <input
                          {...register(`customFields.${index}.label`)}
                          placeholder="e.g., Department"
                          className="w-full bg-background border border-input rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-transparent disabled:opacity-50 outline-none"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Value
                        </label>
                        <input
                          {...register(`customFields.${index}.value`)}
                          placeholder="Enter value"
                          className="w-full bg-background border border-input rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-transparent disabled:opacity-50 outline-none"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="flex items-center gap-1 text-sm text-destructive hover:text-destructive/80 disabled:opacity-50"
                        disabled={isSubmitting}
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {fields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
                  <p className="text-muted-foreground">No custom fields added</p>
                  <p className="text-muted-foreground/60 text-sm mt-1">
                    Add fields like social media links, addresses, etc.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6 border-t border-border">
            {!clientId ? (
              <button
                onClick={handleSubmit(onGenerateQR)}
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium shadow-lg shadow-primary/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {clientIdFromQuery ? "Updating..." : "Generating..."}
                  </>
                ) : clientIdFromQuery ? (
                  <>
                    <RefreshCw size={20} />
                    Update & Regenerate QR
                  </>
                ) : (
                  <>
                    <Check size={20} />
                    Generate QR Code
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSubmit(onSaveChanges)}
                disabled={isSubmitting || !isDirty}
                className="w-full bg-secondary text-secondary-foreground py-4 rounded-xl hover:bg-secondary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-medium border border-input"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
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
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-card-foreground">QR Code</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Scan this code to view client profile
              </p>
            </div>

            {!clientId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center mb-6">
                  <div className="w-16 h-16 border-4 border-input border-dashed rounded-lg opacity-50"></div>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {clientIdFromQuery
                    ? "Loading client..."
                    : "No QR Code Generated"}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {clientIdFromQuery
                    ? "Loading client data..."
                    : "Fill out the client information form and click 'Generate QR Code' to create a shareable QR code."}
                </p>
                {loadingClient && (
                  <div className="mt-4">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                  <div
                    ref={qrRef}
                    className="p-6 bg-white border-2 border-border rounded-2xl shadow-inner"
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
                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Client Profile URL
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm break-all flex-1 font-mono text-muted-foreground">
                          {qrValue}
                        </p>
                        <button
                          onClick={copyQrValue}
                          className="flex-shrink-0 p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
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
                        className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground border border-input py-3 rounded-xl hover:bg-secondary/80 transition-colors font-medium"
                        type="button"
                      >
                        <Download size={18} />
                        Download QR
                      </button>
                      <button
                        onClick={() => router.push(`/client/${clientId}/edit`)}
                        className="flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl hover:opacity-90 transition-colors font-medium shadow-md shadow-primary/20"
                        type="button"
                      >
                        <Edit2 size={18} />
                        Edit Client
                      </button>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => router.push(`/client/${clientId}`)}
                        className="w-full text-muted-foreground hover:text-foreground py-2 text-sm flex items-center justify-center gap-2 transition-colors"
                        type="button"
                      >
                        <Eye size={16} />
                        View Client Profile <ArrowRight size={16} />
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
