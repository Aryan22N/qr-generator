"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "@/app/providers";
import { motion, AnimatePresence } from "framer-motion";
import { Save, ArrowLeft, Trash2, Plus, Loader2 } from "lucide-react";

export default function EditClientPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    customFields: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [clientOwner, setClientOwner] = useState(null);

  /* ===============================
     LOAD CLIENT DATA
  =============================== */
  useEffect(() => {
    if (!id || authLoading) return;

    const loadClient = async () => {
      setLoading(true);
      setError(null);

      try {
        // First check if user is authenticated
        if (!user) {
          router.push("/login");
          return;
        }

        // Fetch client data
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select("*")
          .eq("id", id)
          .single();

        if (clientError) {
          throw new Error("Client not found");
        }

        if (!clientData) {
          throw new Error("Client does not exist");
        }

        // Check if user is the owner
        if (clientData.owner_id !== user.id) {
          throw new Error("You don't have permission to edit this client");
        }

        setClientOwner(clientData.owner_id);

        // Set form data
        setFormData({
          name: clientData.name || "",
          company: clientData.company || "",
          phone: clientData.phone || "",
          email: clientData.email || "",
          customFields: Array.isArray(clientData.custom_fields)
            ? clientData.custom_fields.map((field) => ({
                ...field,
                id: field.id || Math.random().toString(36).substr(2, 9),
              }))
            : [],
        });
      } catch (err) {
        console.error("Load error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id, user, authLoading, router]);

  /* ===============================
     FORM HANDLERS
  =============================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleCustomFieldChange = (index, key, value) => {
    setFormData((prev) => {
      const updatedFields = [...prev.customFields];
      if (!updatedFields[index]) {
        updatedFields[index] = {
          label: "",
          value: "",
          id: Math.random().toString(36).substr(2, 9),
        };
      }
      updatedFields[index] = { ...updatedFields[index], [key]: value.trim() };
      return { ...prev, customFields: updatedFields };
    });
  };

  const addCustomField = () => {
    setFormData((prev) => ({
      ...prev,
      customFields: [
        ...prev.customFields,
        {
          label: "",
          value: "",
          id: Math.random().toString(36).substr(2, 9),
        },
      ],
    }));
  };

  const removeCustomField = (index) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };

  /* ===============================
     FIXED: formatUrlForStorage function
  =============================== */
  const formatUrlForStorage = (label, value) => {
    if (!value) return "";

    const trimmed = value.trim();
    const lowerLabel = label?.toLowerCase() || "";
    const lowerValue = trimmed.toLowerCase();

    // Check if it's just a number with decimal (like 9.9, 8.5) - DON'T add https://
    const isJustNumber = /^\d*\.?\d+$/.test(trimmed);
    if (isJustNumber) {
      return trimmed; // Return as-is for numbers like 9.9
    }

    // If it's already a full URL, return as is
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }

    // If it's an email
    if (trimmed.includes("@") && trimmed.includes(".")) {
      return trimmed; // Store as plain email
    }

    // If it's a phone number
    if (/^[\d\s\-\+\(\)]{10,}$/.test(trimmed.replace(/[^\d\s\-\+\(\)]/g, ""))) {
      return trimmed; // Store as plain phone
    }

    // For social media handles (@username)
    if (trimmed.startsWith("@")) {
      return trimmed; // Store as @username
    }

    // Check if this field should be a URL based on label
    const isSocialMediaField =
      lowerLabel.includes("instagram") ||
      lowerLabel.includes("ig") ||
      lowerLabel.includes("insta") ||
      lowerLabel.includes("youtube") ||
      lowerLabel.includes("yt") ||
      lowerLabel.includes("facebook") ||
      lowerLabel.includes("fb") ||
      lowerLabel.includes("twitter") ||
      lowerLabel.includes("x") ||
      lowerLabel.includes("linkedin");

    const isWebsiteField =
      lowerLabel.includes("website") ||
      lowerLabel.includes("web") ||
      lowerLabel.includes("site") ||
      lowerLabel.includes("url");

    // Check if it looks like a domain (not just a number with dot)
    const looksLikeDomain =
      !isJustNumber &&
      (lowerValue.includes(".com") ||
        lowerValue.includes(".org") ||
        lowerValue.includes(".net") ||
        lowerValue.includes(".io") ||
        lowerValue.includes(".co") ||
        lowerValue.includes(".app") ||
        lowerValue.includes("/"));

    // Only add https:// for social media or website fields that look like domains
    if ((isSocialMediaField || isWebsiteField) && looksLikeDomain) {
      return `https://${trimmed}`;
    }

    // For all other values (including plain text like "CGPA 9.9"), return as-is
    return trimmed;
  };

  /* ===============================
     SAVE CHANGES
  =============================== */
  const handleSave = async () => {
    if (!user || !id) return;

    setSaving(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }

      // Format custom fields URLs using the label context
      const formattedCustomFields = formData.customFields.map((field) => ({
        label: field.label.trim(),
        value: formatUrlForStorage(field.label, field.value.trim()),
      }));

      // Prepare update data (remove temporary IDs from custom fields)
      const updateData = {
        name: formData.name.trim(),
        company: formData.company.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        custom_fields: formattedCustomFields
          .filter((field) => field.label.trim() || field.value.trim())
          .map(({ id, ...rest }) => rest), // Remove temporary IDs
        updated_at: new Date().toISOString(),
      };

      // Update in Supabase
      const { error: updateError } = await supabase
        .from("clients")
        .update(updateData)
        .eq("id", id)
        .eq("owner_id", user.id); // Additional security check

      if (updateError) {
        throw new Error(`Failed to save: ${updateError.message}`);
      }

      // Navigate back to client profile on success
      router.push(`/client/${id}`);
      router.refresh(); // Refresh server components
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ===============================
     NAVIGATION
  =============================== */
  const goBack = () => {
    router.push(`/client`);
  };

  /* ===============================
     LOADING STATE
  =============================== */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-gray-600">Loading client data...</p>
        </div>
      </div>
    );
  }

  /* ===============================
     ERROR STATE
  =============================== */
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={goBack}
            className="w-full bg-gray-800 text-white py-3 rounded-xl hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Back to Client
          </button>
        </div>
      </div>
    );
  }

  /* ===============================
     MAIN FORM
  =============================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Client Profile
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Edit Client
              </h1>
              <p className="text-gray-600 mt-2">
                Update client information and custom fields
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={goBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* ERROR MESSAGE */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            >
              <p className="text-red-600">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FORM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-6 md:p-8 space-y-8">
            {/* BASIC INFORMATION */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter client name"
                    disabled={saving}
                    required
                  />
                  {!formData.name.trim() && (
                    <p className="mt-1 text-sm text-red-600">
                      Name is required
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter company name"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter phone number"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter email address"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            {/* CUSTOM FIELDS */}
            <div className="border-t pt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Custom Fields
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Add additional information specific to this client
                  </p>
                </div>
                <button
                  onClick={addCustomField}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  disabled={saving}
                  type="button"
                >
                  <Plus size={18} />
                  Add Field
                </button>
              </div>

              <div className="space-y-4">
                {/* CUSTOM FIELDS WITH SMART PLACEHOLDERS */}
                {formData.customFields.map((field, i) => (
                  <div
                    key={field.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Field Name
                        </label>
                        <input
                          value={field.label || ""}
                          onChange={(e) =>
                            handleCustomFieldChange(i, "label", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="e.g., Instagram, YouTube, Website, Phone, Email, CGPA"
                          disabled={saving}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Value
                        </label>
                        <input
                          value={field.value || ""}
                          onChange={(e) =>
                            handleCustomFieldChange(i, "value", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={getPlaceholder(field.label)}
                          disabled={saving}
                        />
                        <div className="mt-1 text-xs text-gray-500">
                          {getHelperText(field.label)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeCustomField(i)}
                      className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-8"
                      disabled={saving}
                      type="button"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}

                {formData.customFields.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                    <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No custom fields added yet</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Click Add Field to create custom fields for this client
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SAVE BUTTON FOOTER */}
            <div className="border-t pt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={goBack}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.name.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save All Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ===============================
   HELPER FUNCTIONS
=============================== */

// Helper function to get placeholder text
const getPlaceholder = (label) => {
  if (!label) return "Enter value";

  const lowerLabel = label.toLowerCase().trim();

  if (
    lowerLabel.includes("instagram") ||
    lowerLabel.includes("ig") ||
    lowerLabel.includes("insta")
  ) {
    return "@username or https://instagram.com/username";
  }

  if (lowerLabel.includes("youtube") || lowerLabel.includes("yt")) {
    return "https://youtube.com/c/username";
  }

  if (lowerLabel.includes("facebook") || lowerLabel.includes("fb")) {
    return "https://facebook.com/username";
  }

  if (lowerLabel.includes("twitter") || lowerLabel.includes("x")) {
    return "@username or https://twitter.com/username";
  }

  if (lowerLabel.includes("linkedin")) {
    return "https://linkedin.com/in/username";
  }

  if (
    lowerLabel.includes("website") ||
    lowerLabel.includes("web") ||
    lowerLabel.includes("site") ||
    lowerLabel.includes("url")
  ) {
    return "https://example.com";
  }

  if (lowerLabel.includes("phone") || lowerLabel.includes("mobile")) {
    return "+1 (234) 567-8900";
  }

  if (lowerLabel.includes("email") || lowerLabel.includes("mail")) {
    return "email@example.com";
  }

  if (
    lowerLabel.includes("address") ||
    lowerLabel.includes("location") ||
    lowerLabel.includes("map")
  ) {
    return "123 Street Name, City, Country";
  }

  // For fields like CGPA, GPA, Department, Title, etc.
  if (
    lowerLabel.includes("cgpa") ||
    lowerLabel.includes("gpa") ||
    lowerLabel.includes("score")
  ) {
    return "e.g., 9.9, 8.5, A+";
  }

  if (
    lowerLabel.includes("department") ||
    lowerLabel.includes("title") ||
    lowerLabel.includes("position")
  ) {
    return "e.g., Marketing, Manager, Engineer";
  }

  // For all other fields
  return "Enter value";
};

// Helper function to get helper text
const getHelperText = (label) => {
  if (!label) return "";

  const lowerLabel = label.toLowerCase().trim();

  if (
    lowerLabel.includes("instagram") ||
    lowerLabel.includes("ig") ||
    lowerLabel.includes("insta")
  ) {
    return "Enter @username or full Instagram URL";
  }

  if (lowerLabel.includes("youtube") || lowerLabel.includes("yt")) {
    return "Will open in YouTube app on mobile";
  }

  if (
    lowerLabel.includes("website") ||
    lowerLabel.includes("web") ||
    lowerLabel.includes("site") ||
    lowerLabel.includes("url")
  ) {
    return "Enter website URL";
  }

  if (lowerLabel.includes("phone") || lowerLabel.includes("mobile")) {
    return "Will open phone dialer on mobile";
  }

  if (lowerLabel.includes("email") || lowerLabel.includes("mail")) {
    return "Will open email app";
  }

  if (
    lowerLabel.includes("cgpa") ||
    lowerLabel.includes("gpa") ||
    lowerLabel.includes("score")
  ) {
    return "Enter your score (e.g., 9.9)";
  }

  return "";
};
