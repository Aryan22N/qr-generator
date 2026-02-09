"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useAuth } from "@/app/providers";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Smartphone,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Link as LinkIcon,
  Globe,
  Edit,
  QrCode,
} from "lucide-react";

export default function ClientProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [client, setClient] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState("");

  /* ===============================
     DETECT MOBILE DEVICE
  =============================== */
  useEffect(() => {
    // Safely check for mobile
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
      }
    };

    checkMobile();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  /* ===============================
     LOAD CLIENT FROM SUPABASE
  =============================== */
  useEffect(() => {
    if (!id) return;

    const loadClient = async () => {
      setLoading(true);
      setError("");
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Client not found", error);
          setError("Client not found");
          setClient(null);
        } else if (!data) {
          setError("Client does not exist");
          setClient(null);
        } else {
          setClient(data);
          setFormData({
            name: data.name || "",
            company: data.company || "",
            phone: data.phone || "",
            email: data.email || "",
            customFields: data.custom_fields || [],
          });
        }
      } catch (err) {
        console.error("Error loading client:", err);
        setError("Failed to load client details");
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
  }, [id]);

  /* ===============================
     CHECK IF A FIELD SHOULD BE CLICKABLE
  =============================== */

  // Define which field labels should be clickable
  const isClickableField = (label) => {
    if (!label) return false;

    const lowerLabel = label.toLowerCase().trim();

    // NON-clickable fields (prevent false positives)
    const nonClickableKeywords = [
      "cgpa",
      "gpa",
      "score",
      "grade",
      "percentage",
      "marks",
      "age",
      "height",
      "weight",
      "temperature",
      "measurement",
      "salary",
      "price",
      "cost",
      "amount",
      "fee",
      "charge",
      "rating",
      "review",
      "stars",
      "date",
      "time",
      "duration",
      "schedule",
      "quantity",
      "count",
      "number",
      "amount",
      "total",
      "department",
      "title",
      "position",
      "role",
      "designation",
      "notes",
      "description",
      "remark",
      "comment",
      "feedback",
      "experience",
      "years",
      "level",
      "seniority",
    ];

    // First check if it's explicitly non-clickable
    if (nonClickableKeywords.some((keyword) => lowerLabel.includes(keyword))) {
      return false;
    }

    // Only these specific field types should be clickable
    const clickableKeywords = [
      // Social media
      "instagram",
      "ig",
      "insta",
      "facebook",
      "fb",
      "twitter",
      "x",
      "tweet",
      "youtube",
      "yt",
      "video",
      "linkedin",
      "li",
      "tiktok",
      "tt",
      "whatsapp",
      "wa",

      // Contact info (only when explicitly labeled)
      "phone",
      "mobile",
      "whatsapp",
      "email",
      "mail",

      // Websites and links
      "website",
      "web",
      "site",
      "url",
      "link",
      "portfolio",
      "github",
      "git",

      // Maps and location
      "address",
      "location",
      "map",
      "maps",

      // Other specific links
      "calendar",
      "booking",
      "appointment",
      "menu",
      "reservation",
      "donate",
      "payment",
      "shop",
      "store",
      "buy",
    ];

    return clickableKeywords.some((keyword) => lowerLabel.includes(keyword));
  };

  /* ===============================
     URL SCHEME HANDLERS
  =============================== */

  // Get icon for different link types
  const getLinkIcon = (label, value) => {
    if (!label) return <LinkIcon size={16} />;

    const lowerLabel = label.toLowerCase();
    const lowerValue = value?.toLowerCase() || "";

    // Check by field label first
    if (
      lowerLabel.includes("instagram") ||
      lowerLabel.includes("ig") ||
      lowerLabel.includes("insta")
    ) {
      return <Instagram size={16} />;
    }
    if (lowerLabel.includes("youtube") || lowerLabel.includes("yt")) {
      return <Youtube size={16} />;
    }
    if (lowerLabel.includes("facebook") || lowerLabel.includes("fb")) {
      return <Facebook size={16} />;
    }
    if (lowerLabel.includes("twitter") || lowerLabel.includes("x")) {
      return <Twitter size={16} />;
    }
    if (lowerLabel.includes("linkedin")) {
      return <Linkedin size={16} />;
    }
    if (lowerLabel.includes("phone") || lowerLabel.includes("mobile")) {
      return <Phone size={16} />;
    }
    if (lowerLabel.includes("email") || lowerLabel.includes("mail")) {
      return <Mail size={16} />;
    }
    if (
      lowerLabel.includes("map") ||
      lowerLabel.includes("address") ||
      lowerLabel.includes("location")
    ) {
      return <MapPin size={16} />;
    }
    if (
      lowerLabel.includes("website") ||
      lowerLabel.includes("web") ||
      lowerLabel.includes("site") ||
      lowerLabel.includes("url")
    ) {
      return <Globe size={16} />;
    }

    // Fallback: Check by value content
    if (lowerValue.includes("instagram.com")) return <Instagram size={16} />;
    if (lowerValue.includes("youtube.com") || lowerValue.includes("youtu.be"))
      return <Youtube size={16} />;
    if (lowerValue.includes("facebook.com")) return <Facebook size={16} />;
    if (lowerValue.includes("twitter.com") || lowerValue.includes("x.com"))
      return <Twitter size={16} />;
    if (lowerValue.includes("linkedin.com")) return <Linkedin size={16} />;
    if (lowerValue.startsWith("tel:")) return <Phone size={16} />;
    if (lowerValue.startsWith("mailto:")) return <Mail size={16} />;
    if (lowerValue.includes("maps.") || lowerValue.includes("goo.gl/maps"))
      return <MapPin size={16} />;

    return <LinkIcon size={16} />;
  };

  // Format display text for links - FIXED VERSION
  const formatLinkText = (value) => {
    if (!value) return "";

    // QUICK FIX: If it's just a number with decimal (like 9.9, 8.5), return as-is
    if (/^\d*\.?\d+$/.test(value.trim())) {
      return value;
    }

    // Remove protocol prefixes
    if (value.startsWith("tel:")) return value.replace("tel:", "");
    if (value.startsWith("mailto:")) return value.replace("mailto:", "");

    // Handle social media handles
    if (value.startsWith("@")) {
      return value;
    }

    // Check if it's a URL (starts with http:// or https://)
    if (value.startsWith("http://") || value.startsWith("https://")) {
      // Remove protocol and www for display
      const display = value
        .replace(/^(https?:\/\/)?(www\.)?/, "")
        .replace(/\/$/, "")
        .split("?")[0]; // Remove query parameters

      // Truncate long URLs for display
      return display.length > 30 ? display.substring(0, 30) + "..." : display;
    }

    // Return everything else as-is (including plain text like "CGPA 9.9")
    return value;
  };

  // Handle link clicks with app-specific URL schemes - FIXED VERSION
  const handleLinkClick = (label, value) => {
    if (!value || typeof window === "undefined") return;

    const lowerLabel = label?.toLowerCase() || "";
    const lowerValue = value.toLowerCase().trim();
    let appUrl = value;

    // Check if this is just a number with decimal (like 9.9) - don't make it clickable
    const isJustNumber = /^\d*\.?\d+$/.test(value.trim());
    if (isJustNumber) {
      // Don't open anything for plain numbers
      return;
    }

    // Handle phone numbers (only if field is explicitly phone/mobile/whatsapp)
    if (
      (lowerLabel.includes("phone") ||
        lowerLabel.includes("mobile") ||
        lowerLabel.includes("whatsapp")) &&
      /^[\d\s\-\+\(\)]{10,}$/.test(lowerValue.replace(/[^\d\s\-\+\(\)]/g, ""))
    ) {
      appUrl = `tel:${value.replace(/[^\d\+]/g, "")}`;
    }
    // Handle emails (only if field is explicitly email/mail)
    else if (
      (lowerLabel.includes("email") || lowerLabel.includes("mail")) &&
      lowerValue.includes("@") &&
      lowerValue.includes(".")
    ) {
      appUrl = `mailto:${value}`;
    }
    // Handle Instagram links
    else if (
      lowerLabel.includes("instagram") ||
      lowerLabel.includes("ig") ||
      lowerLabel.includes("insta")
    ) {
      const username = extractInstagramUsername(lowerValue);
      if (isMobile && username) {
        appUrl = `instagram://user?username=${username}`;
        // Fallback to web if app not installed
        setTimeout(() => {
          safeOpenURL(`https://instagram.com/${username}`, "_blank");
        }, 500);
      } else if (username) {
        appUrl = `https://instagram.com/${username}`;
      }
    }
    // Handle YouTube links
    else if (lowerLabel.includes("youtube") || lowerLabel.includes("yt")) {
      const videoId = extractYouTubeId(lowerValue);
      const channelId = extractYouTubeChannel(lowerValue);

      if (isMobile) {
        if (videoId) {
          appUrl = `vnd.youtube://watch?v=${videoId}`;
        } else if (channelId) {
          appUrl = `vnd.youtube://channel/${channelId}`;
        }
        // Fallback to web
        setTimeout(() => {
          safeOpenURL(
            value.startsWith("http") ? value : `https://${value}`,
            "_blank",
          );
        }, 500);
      }
    }
    // Handle Facebook links
    else if (lowerLabel.includes("facebook") || lowerLabel.includes("fb")) {
      const username = extractUsername(lowerValue, "facebook.com");
      if (isMobile && username) {
        appUrl = `fb://profile/${username}`;
        setTimeout(() => {
          safeOpenURL(`https://facebook.com/${username}`, "_blank");
        }, 500);
      }
    }
    // Handle Twitter/X links
    else if (lowerLabel.includes("twitter") || lowerLabel.includes("x")) {
      const username = extractTwitterUsername(lowerValue);
      if (isMobile && username) {
        appUrl = `twitter://user?screen_name=${username}`;
        setTimeout(() => {
          safeOpenURL(`https://twitter.com/${username}`, "_blank");
        }, 500);
      }
    }
    // Handle LinkedIn links
    else if (lowerLabel.includes("linkedin")) {
      const profileId = extractLinkedInId(lowerValue);
      if (isMobile && profileId) {
        appUrl = `linkedin://profile/${profileId}`;
        setTimeout(() => {
          safeOpenURL(
            value.startsWith("http") ? value : `https://${value}`,
            "_blank",
          );
        }, 500);
      }
    }
    // Handle website/URL links
    else if (
      lowerLabel.includes("website") ||
      lowerLabel.includes("web") ||
      lowerLabel.includes("site") ||
      lowerLabel.includes("url")
    ) {
      // Check if it looks like a real URL (not just a number with dot)
      const looksLikeRealURL =
        !isJustNumber &&
        (value.includes(".com") ||
          value.includes(".org") ||
          value.includes(".net") ||
          value.includes(".io") ||
          value.includes(".co") ||
          value.includes("/"));

      // Add https:// if missing AND it looks like a real URL
      if (
        !value.startsWith("http") &&
        !value.startsWith("tel:") &&
        !value.startsWith("mailto:") &&
        looksLikeRealURL
      ) {
        appUrl = `https://${value}`;
      }
    }
    // For other clickable fields, be more careful about adding https://
    else {
      // Check if it looks like a real URL (not just a number with dot)
      const looksLikeRealURL =
        !isJustNumber &&
        (value.includes(".com") ||
          value.includes(".org") ||
          value.includes(".net") ||
          value.includes(".io") ||
          value.includes(".co") ||
          value.includes("/"));

      // Only add https:// if it looks like a real URL
      if (
        !value.startsWith("http") &&
        !value.startsWith("tel:") &&
        !value.startsWith("mailto:") &&
        looksLikeRealURL
      ) {
        appUrl = `https://${value}`;
      }
    }

    // Only open if we have a valid URL (not the original value unless it's already a URL)
    if (appUrl && (appUrl !== value || value.startsWith("http"))) {
      safeOpenURL(appUrl, isMobile ? "_self" : "_blank");
    }
  };

  // Safe URL opener with error handling
  const safeOpenURL = (url, target = "_blank") => {
    if (typeof window === "undefined") return;

    try {
      const newWindow = window.open(url, target);
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        // Popup blocked, fallback to same window
        window.location.href = url;
      }
    } catch (err) {
      console.error("Error opening URL:", err);
      // Last resort fallback
      window.location.href = url;
    }
  };

  /* ===============================
     HELPER FUNCTIONS
  =============================== */

  const extractInstagramUsername = (url) => {
    if (!url) return null;
    // Handle @username format
    if (url.startsWith("@")) {
      return url.substring(1);
    }

    // Handle instagram.com/username
    const regex = /instagram\.com\/([^/?&]+)/;
    const match = url.match(regex);
    return match ? match[1].split("?")[0] : null;
  };

  const extractTwitterUsername = (url) => {
    if (!url) return null;
    // Handle @username format
    if (url.startsWith("@")) {
      return url.substring(1);
    }

    // Handle twitter.com/username or x.com/username
    const regex = /(?:twitter\.com|x\.com)\/([^/?&]+)/;
    const match = url.match(regex);
    return match ? match[1].split("?")[0] : null;
  };

  const extractUsername = (url, domain) => {
    if (!url) return null;
    const regex = new RegExp(`${domain}/([^/?&]+)`);
    const match = url.match(regex);
    return match ? match[1].split("?")[0] : null;
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s?]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const extractYouTubeChannel = (url) => {
    if (!url) return null;
    const regex = /youtube\.com\/channel\/([^/?&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const extractLinkedInId = (url) => {
    if (!url) return null;
    const regex = /linkedin\.com\/in\/([^/?&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  /* ===============================
     UI STATES
  =============================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Client Not Found</h2>
          <p className="text-gray-600">
            {error || "The client does not exist or has been removed."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen text-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white max-w-xl w-full rounded-2xl shadow-xl p-6 space-y-6"
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Client Details</h1>
          {isMobile && (
            <div className="inline-flex items-center gap-1 mt-1 px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
              <Smartphone size={12} />
              <span>Tap links to open in apps</span>
            </div>
          )}
        </div>

        {/* CLIENT INFORMATION */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <h2 className="text-sm font-medium text-gray-500 mb-2">
              Basic Information
            </h2>
            <div className="space-y-3">
              {/* Name - NOT clickable */}
              <DetailItem label="Name" value={client.name} />

              {/* Company - NOT clickable */}
              <DetailItem label="Company" value={client.company} />

              {/* Phone - NOT clickable (only clickable if custom field labeled "Phone") */}
              {client.phone && (
                <DetailItem label="Phone" value={client.phone} />
              )}

              {/* Email - NOT clickable (only clickable if custom field labeled "Email") */}
              {client.email && (
                <DetailItem label="Email" value={client.email} />
              )}
            </div>
          </div>

          {/* CUSTOM FIELDS - Only specific fields are clickable */}
          <AnimatePresence>
            {Array.isArray(client.custom_fields) &&
              client.custom_fields.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-xl p-4"
                >
                  <h2 className="text-sm font-medium text-gray-500 mb-2">
                    Additional Information
                  </h2>
                  <div className="space-y-3">
                    {client.custom_fields.map((field, i) => {
                      const shouldBeClickable = isClickableField(field.label);

                      return shouldBeClickable ? (
                        <ClickableDetail
                          key={i}
                          label={field.label}
                          value={formatLinkText(field.value)}
                          onClick={() =>
                            handleLinkClick(field.label, field.value)
                          }
                          icon={getLinkIcon(field.label, field.value)}
                          isLink={true}
                        />
                      ) : (
                        <DetailItem
                          key={i}
                          label={field.label}
                          value={field.value}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              )}
          </AnimatePresence>

          {/* ACTION BUTTONS (Only visible to owner) */}
          <AnimatePresence>
            {user?.id === client.owner_id && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 pt-4"
              >
                <button
                  onClick={() => router.push(`/client/${client.id}/edit`)}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={18} />
                  Edit Client Info
                </button>

                {/* QR Code Link */}
                <button
                  onClick={() =>
                    router.push(`/qrgenerator?client=${client.id}`)
                  }
                  className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <QrCode size={18} />
                  View QR Code
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-xs text-gray-400 text-center break-all pt-4 border-t">
          Client ID: {client.id}
        </p>
      </motion.div>
    </main>
  );
}

/* ===============================
   REUSABLE COMPONENTS
=============================== */

// For non-clickable items
function DetailItem({ label, value }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="font-medium text-gray-800 text-right break-all max-w-[60%]">
        {value || "—"}
      </span>
    </div>
  );
}

// For clickable links
function ClickableDetail({ label, value, onClick, icon, isLink = false }) {
  return (
    <div
      onClick={onClick}
      className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all ${
        isLink
          ? "bg-white border border-blue-100 hover:border-blue-300 hover:bg-blue-50"
          : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-blue-600">{icon}</span>}
        <span className="text-gray-500 text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-blue-600 text-right break-all max-w-[60%]">
          {value || "—"}
        </span>
        {isLink && <ExternalLink size={14} className="text-gray-400" />}
      </div>
    </div>
  );
}
