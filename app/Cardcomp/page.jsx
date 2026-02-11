"use client";

import { useMemo, useState, useSyncExternalStore, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card1 from "../components/BusCard1/Card1";

import {
  Palette,
  Download,
  Save,
  RotateCw,
  Eye,
  Printer,
  FileText,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const parseJson = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const getStoredTemplate = (templateId) => {
  const savedTemplate = parseJson(
    localStorage.getItem("selectedTemplate"),
    null,
  );
  if (savedTemplate) return savedTemplate;
  if (!templateId) return null;

  const templates = parseJson(localStorage.getItem("templates"), []);
  const templateList = Array.isArray(templates) ? templates : [];
  return templateList.find((template) => template.id === templateId) || null;
};

const getTemplateSnapshot = (templateIdParam) => {
  if (typeof window === "undefined") return "";

  const savedTemplate = parseJson(
    localStorage.getItem("selectedTemplate"),
    null,
  );
  if (savedTemplate) return JSON.stringify(savedTemplate);

  const parsedId = templateIdParam
    ? Number.parseInt(templateIdParam, 10)
    : Number.NaN;
  if (Number.isNaN(parsedId)) return "";

  const template = getStoredTemplate(parsedId);
  return template ? JSON.stringify(template) : "";
};

export default function CardCompPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams?.get?.("template");
  const templateSnapshot = useSyncExternalStore(
    () => () => { },
    () => getTemplateSnapshot(templateIdParam),
    () => "",
  );
  const selectedTemplate = useMemo(
    () => parseJson(templateSnapshot, null),
    [templateSnapshot],
  );

  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    email: "",
    phone1: "",
    phone2: "",
    website: "",
    // address: "123 ArN Street\nMumbai, Maharashtra 400001",
    address: "",
    slogan: "",
  });
  const [customColors, setCustomColors] = useState({});
  const effectiveColors = {
    brandBlue: selectedTemplate?.color || "#4dabf5",
    brandDark: "#1e293b",
    accentColor: selectedTemplate?.color || "#2c7bb6",
    ...customColors,
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleColorChange = (colorField, value) => {
    setCustomColors((prev) => ({
      ...prev,
      [colorField]: value,
    }));
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all fields?")) {
      setFormData({
        name: "",
        title: "",
        company: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        slogan: "",
      });
      setCustomColors({});
    }
  };

  const applyCaptureOverrides = () => {
    if (!cardRef.current || typeof window === "undefined") {
      return () => { };
    }

    const root = cardRef.current;
    const elements = [root, ...root.querySelectorAll("*")];
    const ctx = document.createElement("canvas").getContext("2d");
    const hasUnsupportedColor = (value) =>
      /color-mix|oklch|oklab|lch|lab/i.test(value || "");

    const toSafeColor = (value, fallback) => {
      if (!value || value === "none" || value === "transparent") {
        return fallback ?? value;
      }
      if (!ctx) return fallback ?? value;

      const sentinel = "rgb(1, 2, 3)";
      ctx.fillStyle = sentinel;
      try {
        ctx.fillStyle = value;
      } catch {
        return fallback ?? value;
      }

      const normalized = ctx.fillStyle;
      if (normalized === sentinel || hasUnsupportedColor(normalized)) {
        return fallback ?? value;
      }
      return normalized;
    };

    const previousStyles = new Map();

    elements.forEach((el) => {
      previousStyles.set(el, {
        color: el.style.color,
        backgroundColor: el.style.backgroundColor,
        borderColor: el.style.borderColor,
        outlineColor: el.style.outlineColor,
        textDecorationColor: el.style.textDecorationColor,
        boxShadow: el.style.boxShadow,
        textShadow: el.style.textShadow,
        filter: el.style.filter,
        backdropFilter: el.style.backdropFilter,
        backgroundImage: el.style.backgroundImage,
        fill: el.style.fill,
        stroke: el.style.stroke,
      });

      const style = window.getComputedStyle(el);
      el.style.color = toSafeColor(style.color, "#111827");
      el.style.backgroundColor = toSafeColor(
        style.backgroundColor,
        "rgba(0, 0, 0, 0)",
      );
      el.style.borderColor = toSafeColor(
        style.borderTopColor,
        "rgba(0, 0, 0, 0)",
      );
      el.style.outlineColor = toSafeColor(
        style.outlineColor,
        "rgba(0, 0, 0, 0)",
      );
      el.style.textDecorationColor = toSafeColor(
        style.textDecorationColor,
        "rgba(0, 0, 0, 0)",
      );

      if (hasUnsupportedColor(style.boxShadow)) {
        el.style.boxShadow = "none";
      }
      if (hasUnsupportedColor(style.textShadow)) {
        el.style.textShadow = "none";
      }
      if (hasUnsupportedColor(style.filter)) {
        el.style.filter = "none";
      }
      if (hasUnsupportedColor(style.backdropFilter)) {
        el.style.backdropFilter = "none";
      }
      if (hasUnsupportedColor(style.backgroundImage)) {
        el.style.backgroundImage = "none";
      }

      if (el instanceof SVGElement) {
        el.style.fill = toSafeColor(style.fill, el.style.color || "#111827");
        el.style.stroke = toSafeColor(style.stroke, "none");
      }
    });

    return () => {
      previousStyles.forEach((styles, el) => {
        Object.assign(el.style, styles);
      });
    };
  };

  const captureCardAsImage = async () => {
    if (!cardRef.current) return null;

    const restoreCaptureStyles = applyCaptureOverrides();

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      await new Promise((resolve) => requestAnimationFrame(resolve));

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: false,
        onclone: (doc) => {
          const root = doc.querySelector("[data-capture-root='true']");
          if (!root) return;

          // Function to detect unsupported CSS color functions
          const hasUnsupportedColor = (value) => {
            if (!value || typeof value !== "string") return false;
            return /color-mix|oklch|oklab|lch|lab/i.test(value);
          };

          // Function to normalize color values
          const normalizeColor = (value, fallback) => {
            if (!value || value === "none" || value === "transparent") {
              return fallback || value;
            }

            if (hasUnsupportedColor(value)) {
              return fallback || "#000000"; // Default to black for unsupported
            }

            // Test if the color is valid
            const testCanvas = doc.createElement("canvas");
            const testCtx = testCanvas.getContext("2d");
            if (!testCtx) return fallback || "#000000";

            // Save original fillStyle
            const originalFillStyle = testCtx.fillStyle;

            try {
              testCtx.fillStyle = value;
              const normalized = testCtx.fillStyle;
              if (
                normalized !== originalFillStyle &&
                !hasUnsupportedColor(normalized)
              ) {
                return normalized;
              }
            } catch {
              // If there's an error, use fallback
            }

            return fallback || "#000000";
          };

          // Process all elements in the root
          const elements = [
            doc.documentElement,
            doc.body,
            root,
            ...root.querySelectorAll("*"),
          ];

          elements.forEach((el) => {
            try {
              const style = doc.defaultView.getComputedStyle(el);

              // Normalize colors
              el.style.color = normalizeColor(style.color, "#000000");
              el.style.backgroundColor = normalizeColor(
                style.backgroundColor,
                "#ffffff",
              );
              el.style.borderColor = normalizeColor(
                style.borderTopColor,
                "transparent",
              );
              el.style.outlineColor = normalizeColor(
                style.outlineColor,
                "transparent",
              );
              el.style.textDecorationColor = normalizeColor(
                style.textDecorationColor,
                "transparent",
              );

              // Handle SVG elements
              if (el instanceof doc.defaultView.SVGElement) {
                const fill = el.getAttribute("fill") || style.fill;
                const stroke = el.getAttribute("stroke") || style.stroke;

                if (fill) {
                  el.style.fill = normalizeColor(fill, "#000000");
                }
                if (stroke) {
                  el.style.stroke = normalizeColor(stroke, "none");
                }
              }

              // Handle unsupported CSS functions
              if (hasUnsupportedColor(style.boxShadow)) {
                el.style.boxShadow = "none";
              }
              if (hasUnsupportedColor(style.textShadow)) {
                el.style.textShadow = "none";
              }
              if (hasUnsupportedColor(style.filter)) {
                el.style.filter = "none";
              }
              if (hasUnsupportedColor(style.backdropFilter)) {
                el.style.backdropFilter = "none";
              }

              // Handle background images with unsupported colors
              if (style.backgroundImage && style.backgroundImage !== "none") {
                if (hasUnsupportedColor(style.backgroundImage)) {
                  el.style.backgroundImage = "none";
                }
              }
            } catch (error) {
              console.warn("Error processing element style:", error);
              // Continue with other elements
            }
          });
        },
      });

      return canvas;
    } catch (error) {
      console.error("Error capturing card:", error);

      // Fallback: try without onclone for better compatibility
      try {
        const fallbackCanvas = await html2canvas(cardRef.current, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          allowTaint: false,
        });
        return fallbackCanvas;
      } catch (fallbackError) {
        console.error("Fallback capture also failed:", fallbackError);
        throw error;
      }
    } finally {
      restoreCaptureStyles();
    }
  };

  const downloadAsPDF = async () => {
    setIsDownloading(true);
    try {
      const canvas = await captureCardAsImage();
      if (!canvas) return;

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? "portrait" : "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      // Add metadata
      pdf.setProperties({
        title: `${formData.company} Business Card - ${formData.name}`,
        subject: "Business Card",
        author: "Business Card Generator",
        keywords: "business, card, contact, professional",
      });

      // Generate filename
      const filename = `${formData.company}_${formData.name}_BusinessCard.pdf`
        .replace(/\s+/g, "_")
        .toLowerCase();

      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsDownloading(false);
      setShowDownloadOptions(false);
    }
  };

  const downloadAsPNG = async (options = {}) => {
    setIsDownloading(true);
    try {
      const canvas = await captureCardAsImage();
      if (!canvas) return;

      const {
        quality = 1.0, // PNG quality (0 to 1)
        scale = 2, // Resolution scale
        addPadding = true, // Add padding around the card
      } = options;

      // Optional: Add white padding around the card
      let finalCanvas = canvas;
      if (addPadding) {
        const padding = 40;
        const paddedCanvas = document.createElement("canvas");
        paddedCanvas.width = canvas.width + padding * 2;
        paddedCanvas.height = canvas.height + padding * 2;
        const ctx = paddedCanvas.getContext("2d");

        // Fill with white background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

        // Draw original canvas in center
        ctx.drawImage(canvas, padding, padding);
        finalCanvas = paddedCanvas;
      }

      const link = document.createElement("a");

      // Generate filename with timestamp for uniqueness
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:]/g, "-");
      const filename = `${formData.company || "BusinessCard"}_${formData.name || "Card"
        }_${timestamp}.png`
        .replace(/\s+/g, "_")
        .toLowerCase()
        .replace(/[^a-z0-9_.-]/g, "");

      // Download the PNG
      link.download = filename;
      link.href = finalCanvas.toDataURL("image/png");
      link.click();

      // Clean up
      link.remove();

      return filename; // Return filename for potential further use
    } catch (error) {
      console.error("Error generating PNG:", error);

      // Show a more user-friendly error
      alert("Failed to generate PNG. Please try again.");
    } finally {
      setIsDownloading(false);
      setShowDownloadOptions(false);
    }
  };

  const downloadAsJPG = async () => {
    setIsDownloading(true);
    try {
      const canvas = await captureCardAsImage();
      if (!canvas) return;

      const link = document.createElement("a");
      const filename = `${formData.company}_${formData.name}_BusinessCard.jpg`
        .replace(/\s+/g, "_")
        .toLowerCase();

      link.download = filename;
      link.href = canvas.toDataURL("image/jpeg", 0.9); // 90% quality
      link.click();
    } catch (error) {
      console.error("Error generating JPG:", error);
      alert("Error generating JPG. Please try again.");
    } finally {
      setIsDownloading(false);
      setShowDownloadOptions(false);
    }
  };

  const handleDownload = () => {
    setShowDownloadOptions(!showDownloadOptions);
  };

  const handleQuickDownload = async () => {
    await downloadAsPDF();
  };

  const downloadPrintReadyPDF = async () => {
    setIsDownloading(true);
    try {
      // Create a print-ready PDF with crop marks and bleeds
      const canvas = await captureCardAsImage();
      if (!canvas) return;

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Standard business card dimensions (with bleed)
      const cardWidth = 92; // mm (3.6 inches)
      const cardHeight = 54; // mm (2.1 inches)
      const bleed = 3; // mm bleed area

      // Calculate position to center on A4
      const pageWidth = 297; // A4 landscape width in mm
      const pageHeight = 210; // A4 landscape height in mm
      const x = (pageWidth - cardWidth) / 2;
      const y = (pageHeight - cardHeight) / 2;

      // Add crop marks
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.1);

      // Top-left crop mark
      pdf.line(x - 5, y, x, y);
      pdf.line(x, y - 5, x, y);

      // Top-right crop mark
      pdf.line(x + cardWidth, y, x + cardWidth + 5, y);
      pdf.line(x + cardWidth, y - 5, x + cardWidth, y);

      // Bottom-left crop mark
      pdf.line(x - 5, y + cardHeight, x, y + cardHeight);
      pdf.line(x, y + cardHeight, x, y + cardHeight + 5);

      // Bottom-right crop mark
      pdf.line(
        x + cardWidth,
        y + cardHeight,
        x + cardWidth + 5,
        y + cardHeight,
      );
      pdf.line(
        x + cardWidth,
        y + cardHeight,
        x + cardWidth,
        y + cardHeight + 5,
      );

      // Add card image
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", x, y, cardWidth, cardHeight);

      // Add print instructions
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text("Print Instructions:", 20, pageHeight - 20);
      pdf.text("- Print at 100% scale on A4 paper", 20, pageHeight - 15);
      pdf.text("- Use crop marks for cutting", 20, pageHeight - 10);
      pdf.text(
        "- For professional printing, export as PDF with bleeds",
        20,
        pageHeight - 5,
      );

      const filename = `${formData.company}_BusinessCard_PrintReady.pdf`
        .replace(/\s+/g, "_")
        .toLowerCase();

      pdf.save(filename);
    } catch (error) {
      console.error("Error generating print-ready PDF:", error);
      alert("Error generating print-ready PDF. Please try again.");
    } finally {
      setIsDownloading(false);
      setShowDownloadOptions(false);
    }
  };

  if (!selectedTemplate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            No Template Selected
          </h2>
          <p className="text-slate-600 mb-6">
            Please select a template from the templates page.
          </p>
          <button
            onClick={() => router.push("/Cardtemp")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Browse Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
          >
            &larr; Back to Templates
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Customize Your Card
              </h1>
              <p className="text-slate-600">
                Template:{" "}
                <span className="font-medium">{selectedTemplate.name}</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 flex items-center gap-2"
              >
                <RotateCw size={16} />
                Reset
              </button>
              <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 flex items-center gap-2">
                <Save size={16} />
                Save Draft
              </button>

              {/* Download Button with Options */}
              <div className="relative">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Download Card
                    </>
                  )}
                </button>

                {/* Download Options Dropdown */}
                {showDownloadOptions && !isDownloading && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
                    <div className="p-2">
                      <button
                        onClick={handleQuickDownload}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-md flex items-center gap-3 transition-colors"
                      >
                        <FileText size={18} className="text-blue-600" />
                        <div>
                          <div className="font-medium text-slate-900">
                            Download as PDF
                          </div>
                          <div className="text-xs text-slate-500">
                            Standard PDF file
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={downloadPrintReadyPDF}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-md flex items-center gap-3 transition-colors"
                      >
                        <Printer size={18} className="text-green-600" />
                        <div>
                          <div className="font-medium text-slate-900">
                            Print-Ready PDF
                          </div>
                          <div className="text-xs text-slate-500">
                            With crop marks & bleeds
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={downloadAsPNG}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-md flex items-center gap-3 transition-colors"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            PNG
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            Download as PNG
                          </div>
                          <div className="text-xs text-slate-500">
                            High-quality image
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={downloadAsJPG}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-md flex items-center gap-3 transition-colors"
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-red-500 rounded flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            JPG
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">
                            Download as JPG
                          </div>
                          <div className="text-xs text-slate-500">
                            Compressed image
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="border-t border-slate-200 p-3 bg-slate-50">
                      <p className="text-xs text-slate-600">
                        All downloads include your custom design with logo and
                        QR code
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Side - Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Personal Information
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Senior Developer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      handleInputChange("company", e.target.value)
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Slogan/Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.slogan}
                    onChange={(e) =>
                      handleInputChange("slogan", e.target.value)
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company slogan"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Contact Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone1
                  </label>
                  <input
                    type="tel"
                    value={formData.phone1}
                    onChange={(e) =>
                      handleInputChange("phone1", e.target.value)
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="9875XXXXXX"
                  />
                  <label className="block text-sm font-medium text-slate-700  pt-4 pb-2">
                    Phone2
                  </label>
                  <input
                    type="tel"
                    value={formData.phone2}
                    onChange={(e) =>
                      handleInputChange("phone2", e.target.value)
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="7895XXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="www.company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows={3}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street, City, State, Zip Code"
                  />
                </div>
              </div>
            </div>

            {/* Color Customization */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Palette size={20} />
                Color Customization
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={effectiveColors.brandBlue}
                      onChange={(e) =>
                        handleColorChange("brandBlue", e.target.value)
                      }
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={effectiveColors.brandBlue}
                      onChange={(e) =>
                        handleColorChange("brandBlue", e.target.value)
                      }
                      className="flex-1 p-3 border border-slate-300 rounded-lg font-mono text-sm"
                      placeholder="#4dabf5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={effectiveColors.accentColor}
                      onChange={(e) =>
                        handleColorChange("accentColor", e.target.value)
                      }
                      className="w-12 h-12 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={effectiveColors.accentColor}
                      onChange={(e) =>
                        handleColorChange("accentColor", e.target.value)
                      }
                      className="flex-1 p-3 border border-slate-300 rounded-lg font-mono text-sm"
                      placeholder="#2c7bb6"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Download Instructions */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <FileText size={20} />
                Download Instructions
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span>
                    <strong>PDF:</strong> Best for sharing and printing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span>
                    <strong>Print-Ready PDF:</strong> Includes crop marks for
                    professional printing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span>
                    <strong>PNG:</strong> High-quality image for digital use
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
                  <span>
                    <strong>JPG:</strong> Compressed image for web use
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Side - Preview */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Eye size={20} />
                Live Preview
              </h2>

              <div className="flex flex-col items-center justify-center">
                {/* Card container for capture */}
                <div ref={cardRef} data-capture-root="true">
                  <Card1
                    formData={formData}
                    template={selectedTemplate}
                    customColors={effectiveColors}
                  />
                </div>

                <div className="mt-8 text-center text-sm text-slate-600">
                  <p>Edit details on the left to see live updates here</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Click Download Card to export your design
                  </p>
                </div>
              </div>
            </div>

            {/* Download Status */}
            {isDownloading && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <h3 className="font-bold text-yellow-900">
                      Generating Download...
                    </h3>
                    <p className="text-sm text-yellow-800">
                      Please wait while we prepare your business card
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useMemo, useState, useSyncExternalStore, useRef } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Card1 from "../components/BusCard1/Card1";
// import {
//   Palette,
//   Download,
//   Save,
//   RotateCw,
//   Eye,
//   Printer,
//   FileText,
// } from "lucide-react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const parseJson = (value, fallback) => {
//   if (!value) return fallback;
//   try {
//     return JSON.parse(value);
//   } catch {
//     return fallback;
//   }
// };

// const getStoredTemplate = (templateId) => {
//   const savedTemplate = parseJson(
//     localStorage.getItem("selectedTemplate"),
//     null,
//   );
//   if (savedTemplate) return savedTemplate;
//   if (!templateId) return null;

//   const templates = parseJson(localStorage.getItem("templates"), []);
//   const templateList = Array.isArray(templates) ? templates : [];
//   return templateList.find((template) => template.id === templateId) || null;
// };

// const getTemplateSnapshot = (templateIdParam) => {
//   if (typeof window === "undefined") return "";

//   const savedTemplate = parseJson(
//     localStorage.getItem("selectedTemplate"),
//     null,
//   );
//   if (savedTemplate) return JSON.stringify(savedTemplate);

//   const parsedId = templateIdParam
//     ? Number.parseInt(templateIdParam, 10)
//     : Number.NaN;
//   if (Number.isNaN(parsedId)) return "";

//   const template = getStoredTemplate(parsedId);
//   return template ? JSON.stringify(template) : "";
// };

// export default function CardCompPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const templateIdParam = searchParams?.get?.("template");
//   const templateSnapshot = useSyncExternalStore(
//     () => () => {},
//     () => getTemplateSnapshot(templateIdParam),
//     () => "",
//   );
//   const selectedTemplate = useMemo(
//     () => parseJson(templateSnapshot, null),
//     [templateSnapshot],
//   );

//   const cardRef = useRef(null);
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [downloadFormat, setDownloadFormat] = useState("pdf");
//   const [showDownloadOptions, setShowDownloadOptions] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "John Smith",
//     title: "Senior Developer",
//     company: "TechCorp",
//     email: "john@techcorp.com",
//     phone: "+1 (555) 123-4567",
//     website: "www.techcorp.com",
//     address: "123 Tech Street\nSan Francisco, CA 94107",
//     slogan: "Innovation at its Best",
//   });
//   const [customColors, setCustomColors] = useState({});
//   const effectiveColors = {
//     brandBlue: selectedTemplate?.color || "#4dabf5",
//     brandDark: "#1e293b",
//     accentColor: selectedTemplate?.color || "#2c7bb6",
//     ...customColors,
//   };

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleColorChange = (colorField, value) => {
//     setCustomColors((prev) => ({
//       ...prev,
//       [colorField]: value,
//     }));
//   };

//   const handleReset = () => {
//     if (confirm("Are you sure you want to reset all fields?")) {
//       setFormData({
//         name: "",
//         title: "",
//         company: "",
//         email: "",
//         phone: "",
//         website: "",
//         address: "",
//         slogan: "",
//       });
//       setCustomColors({});
//     }
//   };

//   const captureCardAsImage = async () => {
//     if (!cardRef.current) return null;

//     try {
//       const canvas = await html2canvas(cardRef.current, {
//         scale: 3, // Higher resolution for better quality
//         useCORS: true,
//         backgroundColor: "#ffffff",
//         logging: false,
//         allowTaint: true, // Allow cross-origin images
//         foreignObjectRendering: true, // Better SVG support
//         onclone: (doc) => {
//           const root = doc.querySelector("[data-capture-root='true']");
//           if (!root) return;

//           // Function to detect unsupported CSS color functions
//           const hasUnsupportedColor = (value) => {
//             if (!value || typeof value !== "string") return false;
//             return /color-mix|oklch|oklab|lab|lch/i.test(value);
//           };

//           // Function to normalize color values
//           const normalizeColor = (value, fallback) => {
//             if (!value || value === "none" || value === "transparent") {
//               return fallback || value;
//             }

//             if (hasUnsupportedColor(value)) {
//               return fallback || "#000000"; // Default to black for unsupported
//             }

//             // Test if the color is valid
//             const testCanvas = doc.createElement("canvas");
//             const testCtx = testCanvas.getContext("2d");
//             if (!testCtx) return fallback || "#000000";

//             // Save original fillStyle
//             const originalFillStyle = testCtx.fillStyle;

//             try {
//               testCtx.fillStyle = value;
//               // If setting succeeded and it's not the sentinel value, return it
//               if (testCtx.fillStyle !== originalFillStyle) {
//                 return value;
//               }
//             } catch {
//               // If there's an error, use fallback
//             }

//             return fallback || "#000000";
//           };

//           // Process all elements in the root
//           const elements = [root, ...root.querySelectorAll("*")];

//           elements.forEach((el) => {
//             try {
//               const style = doc.defaultView.getComputedStyle(el);

//               // Normalize colors
//               el.style.color = normalizeColor(style.color, "#000000");
//               el.style.backgroundColor = normalizeColor(
//                 style.backgroundColor,
//                 "#ffffff",
//               );
//               el.style.borderColor = normalizeColor(
//                 style.borderTopColor,
//                 "transparent",
//               );
//               el.style.outlineColor = normalizeColor(
//                 style.outlineColor,
//                 "transparent",
//               );
//               el.style.textDecorationColor = normalizeColor(
//                 style.textDecorationColor,
//                 "transparent",
//               );

//               // Handle SVG elements
//               if (el instanceof doc.defaultView.SVGElement) {
//                 const fill = el.getAttribute("fill") || style.fill;
//                 const stroke = el.getAttribute("stroke") || style.stroke;

//                 if (fill) {
//                   el.style.fill = normalizeColor(fill, "#000000");
//                 }
//                 if (stroke) {
//                   el.style.stroke = normalizeColor(stroke, "none");
//                 }
//               }

//               // Handle unsupported CSS functions
//               if (hasUnsupportedColor(style.boxShadow)) {
//                 el.style.boxShadow = "none";
//               }
//               if (hasUnsupportedColor(style.textShadow)) {
//                 el.style.textShadow = "none";
//               }
//               if (hasUnsupportedColor(style.filter)) {
//                 el.style.filter = "none";
//               }
//               if (hasUnsupportedColor(style.backdropFilter)) {
//                 el.style.backdropFilter = "none";
//               }

//               // Handle background images with unsupported colors
//               if (style.backgroundImage && style.backgroundImage !== "none") {
//                 if (hasUnsupportedColor(style.backgroundImage)) {
//                   el.style.backgroundImage = "none";
//                 }
//               }
//             } catch (error) {
//               console.warn("Error processing element style:", error);
//               // Continue with other elements
//             }
//           });
//         },
//       });

//       return canvas;
//     } catch (error) {
//       console.error("Error capturing card:", error);

//       // Fallback: try without onclone for better compatibility
//       try {
//         const fallbackCanvas = await html2canvas(cardRef.current, {
//           scale: 2,
//           useCORS: true,
//           backgroundColor: "#ffffff",
//           logging: false,
//           allowTaint: true,
//         });
//         return fallbackCanvas;
//       } catch (fallbackError) {
//         console.error("Fallback capture also failed:", fallbackError);
//         throw error;
//       }
//     }
//   };

//   // const downloadAsPDF = async () => {
//   //   setIsDownloading(true);
//   //   try {
//   //     const canvas = await captureCardAsImage();
//   //     if (!canvas) return;

//   //     const imgWidth = 210; // A4 width in mm
//   //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

//   //     const pdf = new jsPDF({
//   //       orientation: imgHeight > imgWidth ? "portrait" : "landscape",
//   //       unit: "mm",
//   //       format: "a4",
//   //     });

//   //     const imgData = canvas.toDataURL("image/png");
//   //     pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

//   //     // Add metadata
//   //     pdf.setProperties({
//   //       title: `${formData.company} Business Card - ${formData.name}`,
//   //       subject: "Business Card",
//   //       author: "Business Card Generator",
//   //       keywords: "business, card, contact, professional",
//   //     });

//   //     // Generate filename
//   //     const filename = `${formData.company}_${formData.name}_BusinessCard.pdf`
//   //       .replace(/\s+/g, "_")
//   //       .toLowerCase();

//   //     pdf.save(filename);
//   //   } catch (error) {
//   //     console.error("Error generating PDF:", error);
//   //     alert("Error generating PDF. Please try again.");
//   //   } finally {
//   //     setIsDownloading(false);
//   //     setShowDownloadOptions(false);
//   //   }
//   // };

//   const downloadAsPNG = async (options = {}) => {
//     setIsDownloading(true);
//     try {
//       const canvas = await captureCardAsImage();
//       if (!canvas) return;

//       const {
//         quality = 1.0, // PNG quality (0 to 1)
//         scale = 2, // Resolution scale
//         addPadding = true, // Add padding around the card
//       } = options;

//       // Optional: Add white padding around the card
//       let finalCanvas = canvas;
//       if (addPadding) {
//         const padding = 40;
//         const paddedCanvas = document.createElement("canvas");
//         paddedCanvas.width = canvas.width + padding * 2;
//         paddedCanvas.height = canvas.height + padding * 2;
//         const ctx = paddedCanvas.getContext("2d");

//         // Fill with white background
//         ctx.fillStyle = "#ffffff";
//         ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

//         // Draw original canvas in center
//         ctx.drawImage(canvas, padding, padding);
//         finalCanvas = paddedCanvas;
//       }

//       const link = document.createElement("a");

//       // Generate filename with timestamp for uniqueness
//       const timestamp = new Date()
//         .toISOString()
//         .slice(0, 19)
//         .replace(/[:]/g, "-");
//       const filename = `${formData.company || "BusinessCard"}_${
//         formData.name || "Card"
//       }_${timestamp}.png`
//         .replace(/\s+/g, "_")
//         .toLowerCase()
//         .replace(/[^a-z0-9_.-]/g, "");

//       // Download the PNG
//       link.download = filename;
//       link.href = finalCanvas.toDataURL("image/png");
//       link.click();

//       // Clean up
//       link.remove();

//       return filename; // Return filename for potential further use
//     } catch (error) {
//       console.error("Error generating PNG:", error);

//       // Show a more user-friendly error
//       setErrorMessage("Failed to generate PNG. Please try again.");
//       setTimeout(() => setErrorMessage(""), 5000);

//       // You could also use a toast notification here
//       // toast.error("Failed to download PNG");
//     } finally {
//       setIsDownloading(false);
//       setShowDownloadOptions(false);
//     }
//   };

//   // const downloadAsJPG = async () => {
//   //   setIsDownloading(true);
//   //   try {
//   //     const canvas = await captureCardAsImage();
//   //     if (!canvas) return;

//   //     const link = document.createElement("a");
//   //     const filename = `${formData.company}_${formData.name}_BusinessCard.jpg`
//   //       .replace(/\s+/g, "_")
//   //       .toLowerCase();

//   //     link.download = filename;
//   //     link.href = canvas.toDataURL("image/jpeg", 0.9); // 90% quality
//   //     link.click();
//   //   } catch (error) {
//   //     console.error("Error generating JPG:", error);
//   //     alert("Error generating JPG. Please try again.");
//   //   } finally {
//   //     setIsDownloading(false);
//   //     setShowDownloadOptions(false);
//   //   }
//   // };

//   const handleDownload = () => {
//     setShowDownloadOptions(!showDownloadOptions);
//   };

//   const handleQuickDownload = async () => {
//     await downloadAsPDF();
//   };

//   const downloadPrintReadyPDF = async () => {
//     setIsDownloading(true);
//     try {
//       // Create a print-ready PDF with crop marks and bleeds
//       const canvas = await captureCardAsImage();
//       if (!canvas) return;

//       const pdf = new jsPDF({
//         orientation: "landscape",
//         unit: "mm",
//         format: "a4",
//       });

//       // Standard business card dimensions (with bleed)
//       const cardWidth = 92; // mm (3.6 inches)
//       const cardHeight = 54; // mm (2.1 inches)
//       const bleed = 3; // mm bleed area

//       // Calculate position to center on A4
//       const pageWidth = 297; // A4 landscape width in mm
//       const pageHeight = 210; // A4 landscape height in mm
//       const x = (pageWidth - cardWidth) / 2;
//       const y = (pageHeight - cardHeight) / 2;

//       // Add crop marks
//       pdf.setDrawColor(0);
//       pdf.setLineWidth(0.1);

//       // Top-left crop mark
//       pdf.line(x - 5, y, x, y);
//       pdf.line(x, y - 5, x, y);

//       // Top-right crop mark
//       pdf.line(x + cardWidth, y, x + cardWidth + 5, y);
//       pdf.line(x + cardWidth, y - 5, x + cardWidth, y);

//       // Bottom-left crop mark
//       pdf.line(x - 5, y + cardHeight, x, y + cardHeight);
//       pdf.line(x, y + cardHeight, x, y + cardHeight + 5);

//       // Bottom-right crop mark
//       pdf.line(
//         x + cardWidth,
//         y + cardHeight,
//         x + cardWidth + 5,
//         y + cardHeight,
//       );
//       pdf.line(
//         x + cardWidth,
//         y + cardHeight,
//         x + cardWidth,
//         y + cardHeight + 5,
//       );

//       // Add card image
//       const imgData = canvas.toDataURL("image/png");
//       pdf.addImage(imgData, "PNG", x, y, cardWidth, cardHeight);

//       // Add print instructions
//       pdf.setFontSize(10);
//       pdf.setTextColor(100);
//       pdf.text("Print Instructions:", 20, pageHeight - 20);
//       pdf.text("- Print at 100% scale on A4 paper", 20, pageHeight - 15);
//       pdf.text("- Use crop marks for cutting", 20, pageHeight - 10);
//       pdf.text(
//         "- For professional printing, export as PDF with bleeds",
//         20,
//         pageHeight - 5,
//       );

//       const filename = `${formData.company}_BusinessCard_PrintReady.pdf`
//         .replace(/\s+/g, "_")
//         .toLowerCase();

//       pdf.save(filename);
//     } catch (error) {
//       console.error("Error generating print-ready PDF:", error);
//       alert("Error generating print-ready PDF. Please try again.");
//     } finally {
//       setIsDownloading(false);
//       setShowDownloadOptions(false);
//     }
//   };

//   if (!selectedTemplate) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-slate-900 mb-4">
//             No Template Selected
//           </h2>
//           <p className="text-slate-600 mb-6">
//             Please select a template from the templates page.
//           </p>
//           <button
//             onClick={() => router.push("/Cardtemp")}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
//           >
//             Browse Templates
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => router.back()}
//             className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
//           >
//             &larr; Back to Templates
//           </button>
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
//                 Customize Your Card
//               </h1>
//               <p className="text-slate-600">
//                 Template:{" "}
//                 <span className="font-medium">{selectedTemplate.name}</span>
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-3">
//               <button
//                 onClick={handleReset}
//                 className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 flex items-center gap-2"
//               >
//                 <RotateCw size={16} />
//                 Reset
//               </button>
//               <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-medium hover:bg-slate-50 flex items-center gap-2">
//                 <Save size={16} />
//                 Save Draft
//               </button>

//               {/* Download Button with Options */}
//               <div className="relative">
//                 <button
//                   onClick={handleDownload}
//                   disabled={isDownloading}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isDownloading ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Downloading...
//                     </>
//                   ) : (
//                     <>
//                       <Download size={16} />
//                       Download Card
//                     </>
//                   )}
//                 </button>

//                 {/* Download Options Dropdown */}
//                 {showDownloadOptions && !isDownloading && (
//                   <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
//                     <div className="p-2">
//                       {/* <button
//                         onClick={handleQuickDownload}
//                         className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-md flex items-center gap-3 transition-colors"
//                       >
//                         <FileText size={18} className="text-blue-600" />
//                         <div>
//                           <div className="font-medium text-slate-900">
//                             Download as PDF
//                           </div>
//                           <div className="text-xs text-slate-500">
//                             Standard PDF file
//                           </div>
//                         </div>
//                       </button>

//                       <button
//                         onClick={downloadPrintReadyPDF}
//                         className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-md flex items-center gap-3 transition-colors"
//                       >
//                         <Printer size={18} className="text-green-600" />
//                         <div>
//                           <div className="font-medium text-slate-900">
//                             Print-Ready PDF
//                           </div>
//                           <div className="text-xs text-slate-500">
//                             With crop marks & bleeds
//                           </div>
//                         </div>
//                       </button> */}

//                       <button
//                         onClick={downloadAsPNG}
//                         className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-md flex items-center gap-3 transition-colors"
//                       >
//                         <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded flex items-center justify-center">
//                           <span className="text-white text-xs font-bold">
//                             PNG
//                           </span>
//                         </div>
//                         <div>
//                           <div className="font-medium text-slate-900">
//                             Download as PNG
//                           </div>
//                           <div className="text-xs text-slate-500">
//                             High-quality image
//                           </div>
//                         </div>
//                       </button>

//                       {/* <button
//                         onClick={downloadAsJPG}
//                         className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-md flex items-center gap-3 transition-colors"
//                       >
//                         <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-red-500 rounded flex items-center justify-center">
//                           <span className="text-white text-xs font-bold">
//                             JPG
//                           </span>
//                         </div>
//                         <div>
//                           <div className="font-medium text-slate-900">
//                             Download as JPG
//                           </div>
//                           <div className="text-xs text-slate-500">
//                             Compressed image
//                           </div>
//                         </div>
//                       </button> */}
//                     </div>

//                     <div className="border-t border-slate-200 p-3 bg-slate-50">
//                       <p className="text-xs text-slate-600">
//                         All downloads include your custom design with logo and
//                         QR code
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
//           {/* Left Side - Form */}
//           <div className="space-y-6">
//             {/* Personal Information */}
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//               <h2 className="text-xl font-bold text-slate-900 mb-6">
//                 Personal Information
//               </h2>

//               <div className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Full Name
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.name}
//                       onChange={(e) =>
//                         handleInputChange("name", e.target.value)
//                       }
//                       className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="John Doe"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Job Title
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.title}
//                       onChange={(e) =>
//                         handleInputChange("title", e.target.value)
//                       }
//                       className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                       placeholder="Senior Developer"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Company Name
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.company}
//                     onChange={(e) =>
//                       handleInputChange("company", e.target.value)
//                     }
//                     className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Company Name"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Slogan/Tagline
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.slogan}
//                     onChange={(e) =>
//                       handleInputChange("slogan", e.target.value)
//                     }
//                     className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Your company slogan"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Contact Information */}
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//               <h2 className="text-xl font-bold text-slate-900 mb-6">
//                 Contact Information
//               </h2>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange("email", e.target.value)}
//                     className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="email@company.com"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Phone
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.phone}
//                     onChange={(e) => handleInputChange("phone", e.target.value)}
//                     className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="+1 (555) 123-4567"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Website
//                   </label>
//                   <input
//                     type="url"
//                     value={formData.website}
//                     onChange={(e) =>
//                       handleInputChange("website", e.target.value)
//                     }
//                     className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="www.company.com"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Address
//                   </label>
//                   <textarea
//                     value={formData.address}
//                     onChange={(e) =>
//                       handleInputChange("address", e.target.value)
//                     }
//                     rows={3}
//                     className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Street, City, State, Zip Code"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Color Customization */}
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
//               <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
//                 <Palette size={20} />
//                 Color Customization
//               </h2>

//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Primary Color
//                   </label>
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="color"
//                       value={effectiveColors.brandBlue}
//                       onChange={(e) =>
//                         handleColorChange("brandBlue", e.target.value)
//                       }
//                       className="w-12 h-12 rounded-lg cursor-pointer"
//                     />
//                     <input
//                       type="text"
//                       value={effectiveColors.brandBlue}
//                       onChange={(e) =>
//                         handleColorChange("brandBlue", e.target.value)
//                       }
//                       className="flex-1 p-3 border border-slate-300 rounded-lg font-mono text-sm"
//                       placeholder="#4dabf5"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-2">
//                     Accent Color
//                   </label>
//                   <div className="flex items-center gap-3">
//                     <input
//                       type="color"
//                       value={effectiveColors.accentColor}
//                       onChange={(e) =>
//                         handleColorChange("accentColor", e.target.value)
//                       }
//                       className="w-12 h-12 rounded-lg cursor-pointer"
//                     />
//                     <input
//                       type="text"
//                       value={effectiveColors.accentColor}
//                       onChange={(e) =>
//                         handleColorChange("accentColor", e.target.value)
//                       }
//                       className="flex-1 p-3 border border-slate-300 rounded-lg font-mono text-sm"
//                       placeholder="#2c7bb6"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Download Instructions */}
//             <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
//               <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
//                 <FileText size={20} />
//                 Download Instructions
//               </h3>
//               <ul className="space-y-2 text-sm text-blue-800">
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
//                   <span>
//                     <strong>PDF:</strong> Best for sharing and printing
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
//                   <span>
//                     <strong>Print-Ready PDF:</strong> Includes crop marks for
//                     professional printing
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
//                   <span>
//                     <strong>PNG:</strong> High-quality image for digital use
//                   </span>
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5"></div>
//                   <span>
//                     <strong>JPG:</strong> Compressed image for web use
//                   </span>
//                 </li>
//               </ul>
//             </div>
//           </div>

//           {/* Right Side - Preview */}
//           <div className="lg:sticky lg:top-8 h-fit">
//             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
//               <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
//                 <Eye size={20} />
//                 Live Preview
//               </h2>

//               <div className="flex flex-col items-center justify-center">
//                 {/* Card container for capture */}
//                 <div ref={cardRef} data-capture-root="true">
//                   <Card1
//                     formData={formData}
//                     template={selectedTemplate}
//                     customColors={effectiveColors}
//                   />
//                 </div>

//                 <div className="mt-8 text-center text-sm text-slate-600">
//                   <p>Edit details on the left to see live updates here</p>
//                   <p className="text-xs text-slate-500 mt-1">
//                     Click Download Card to export your design
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Download Status */}
//             {isDownloading && (
//               <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
//                 <div className="flex items-center gap-3">
//                   <div className="w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
//                   <div>
//                     <h3 className="font-bold text-yellow-900">
//                       Generating Download...
//                     </h3>
//                     <p className="text-sm text-yellow-800">
//                       Please wait while we prepare your business card
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
