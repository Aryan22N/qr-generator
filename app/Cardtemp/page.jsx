"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Clock,
  TrendingUp,
} from "lucide-react";
import Card1 from "../components/BusCard1/Card1";
import CategoryFilter from "../components/CategoryFilter";

// Template data with actual card previews
// Template data with image URLs
const cardTemplates = [
  {
    id: 1,
    name: "Modern Professional",
    category: "Professional",
    description: "Clean and modern design for corporate professionals",
    color: "#2563eb",
    featured: true,
    rating: 4.8,
    downloads: "12.5k",
    design: "modern",
    // Actual image URLs (you should replace these with your actual image paths)
    image: "/Cardtemp/temp1.png",
    preview:
      "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&h=250&fit=crop",
    previewData: {
      name: "Alex Johnson",
      title: "Senior Developer",
      company: "TechCorp",
      email: "alex@techcorp.com",
      phone: "+1 (555) 123-4567",
      website: "www.techcorp.com",
      address: "123 Tech Street\nSan Francisco, CA 94107",
      slogan: "Innovation at its Best",
    },
  },
  // {
  //   id: 2,
  //   name: "Corporate Elegant",
  //   category: "Corporate",
  //   description: "Elegant design suitable for executives and managers",
  //   color: "#0f172a",
  //   featured: true,
  //   rating: 4.9,
  //   downloads: "8.7k",
  //   design: "elegant",
  //   image: "/images/cards/corporate-elegant-card.jpg",
  //   preview:
  //     "https://images.unsplash.com/photo-1634942536828-6d2e8e3a3c41?w=400&h=250&fit=crop",
  //   previewData: {
  //     name: "Sarah Williams",
  //     title: "Marketing Director",
  //     company: "BrandCo",
  //     email: "sarah@brandco.com",
  //     phone: "+1 (555) 987-6543",
  //     website: "www.brandco.com",
  //     address: "456 Business Ave\nNew York, NY 10001",
  //     slogan: "Excellence in Marketing",
  //   },
  // },
  // {
  //   id: 3,
  //   name: "Creative Agency",
  //   category: "Creative",
  //   description: "Vibrant design for creative professionals and agencies",
  //   color: "#7c3aed",
  //   featured: false,
  //   rating: 4.6,
  //   downloads: "6.3k",
  //   design: "creative",
  //   image: "/images/cards/creative-agency-card.jpg",
  //   preview:
  //     "https://images.unsplash.com/photo-1634942536765-1a3926ae5d8a?w=400&h=250&fit=crop",
  //   previewData: {
  //     name: "Mike Chen",
  //     title: "Creative Director",
  //     company: "DesignStudio",
  //     email: "mike@designstudio.com",
  //     phone: "+1 (555) 456-7890",
  //     website: "www.designstudio.com",
  //     address: "789 Creative Blvd\nLos Angeles, CA 90001",
  //     slogan: "Where Ideas Come Alive",
  //   },
  // },
  // {
  //   id: 4,
  //   name: "Tech Startup",
  //   category: "Tech",
  //   description: "Modern tech-focused design for startups",
  //   color: "#059669",
  //   featured: true,
  //   rating: 4.7,
  //   downloads: "10.2k",
  //   design: "tech",
  //   image: "/images/cards/tech-startup-card.jpg",
  //   preview:
  //     "https://images.unsplash.com/photo-1634942536719-5e2e3c7c6b3a?w=400&h=250&fit=crop",
  //   previewData: {
  //     name: "David Kim",
  //     title: "CEO & Founder",
  //     company: "StartupX",
  //     email: "david@startupx.com",
  //     phone: "+1 (555) 789-0123",
  //     website: "www.startupx.com",
  //     address: "101 Innovation Dr\nAustin, TX 73301",
  //     slogan: "Building the Future",
  //   },
  // },
  // {
  //   id: 5,
  //   name: "Luxury Brand",
  //   category: "Luxury",
  //   description: "Premium design for luxury brands and high-end services",
  //   color: "#b45309",
  //   featured: false,
  //   rating: 4.9,
  //   downloads: "5.8k",
  //   design: "luxury",
  //   image: "/images/cards/luxury-brand-card.jpg",
  //   preview:
  //     "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400&h=250&fit=crop",
  //   previewData: {
  //     name: "Emma Wilson",
  //     title: "Brand Manager",
  //     company: "LuxuryGroup",
  //     email: "emma@luxurygroup.com",
  //     phone: "+1 (555) 234-5678",
  //     website: "www.luxurygroup.com",
  //     address: "222 Premium St\nBeverly Hills, CA 90210",
  //     slogan: "The Art of Luxury",
  //   },
  // },
  // {
  //   id: 6,
  //   name: "Minimalist",
  //   category: "Minimal",
  //   description: "Simple and clean minimalist design",
  //   color: "#64748b",
  //   featured: false,
  //   rating: 4.5,
  //   downloads: "7.4k",
  //   design: "minimal",
  //   image: "/images/cards/minimalist-card.jpg",
  //   preview:
  //     "https://images.unsplash.com/photo-1634942536828-6d2e8e3a3c41?w=400&h=250&fit=crop",
  //   previewData: {
  //     name: "James Miller",
  //     title: "UX Designer",
  //     company: "SimpleCo",
  //     email: "james@simpleco.com",
  //     phone: "+1 (555) 345-6789",
  //     website: "www.simpleco.com",
  //     address: "333 Minimal Way\nPortland, OR 97201",
  //     slogan: "Less is More",
  //   },
  // },
  // {
  //   id: 7,
  //   name: "Bold & Modern",
  //   category: "Modern",
  //   description: "Bold colors and modern typography",
  //   color: "#dc2626",
  //   featured: true,
  //   rating: 4.8,
  //   downloads: "9.1k",
  //   design: "bold",
  //   image: "/images/cards/bold-modern-card.jpg",
  //   preview:
  //     "https://images.unsplash.com/photo-1634942536765-1a3926ae5d8a?w=400&h=250&fit=crop",
  //   previewData: {
  //     name: "Lisa Rodriguez",
  //     title: "Art Director",
  //     company: "BoldDesigns",
  //     email: "lisa@bolddesigns.com",
  //     phone: "+1 (555) 567-8901",
  //     website: "www.bolddesigns.com",
  //     address: "444 Dynamic Rd\nMiami, FL 33101",
  //     slogan: "Dare to be Different",
  //   },
  // },
  // {
  //   id: 8,
  //   name: "Classic Traditional",
  //   category: "Traditional",
  //   description: "Classic design for traditional businesses",
  //   color: "#475569",
  //   featured: false,
  //   rating: 4.4,
  //   downloads: "4.9k",
  //   design: "classic",
  //   image: "/images/cards/classic-traditional-card.jpg",
  //   preview:
  //     "https://images.unsplash.com/photo-1634942536719-5e2e3c7c6b3a?w=400&h=250&fit=crop",
  //   previewData: {
  //     name: "Robert Brown",
  //     title: "Account Manager",
  //     company: "ClassicFinance",
  //     email: "robert@classicfinance.com",
  //     phone: "+1 (555) 678-9012",
  //     website: "www.classicfinance.com",
  //     address: "555 Heritage Ln\nChicago, IL 60601",
  //     slogan: "Trusted Since 1985",
  //   },
  // },
];

// Template Card Component with visible preview
const TemplatePreview = ({ template, onClick }) => {
  // Use actual card images from template data or fallback to placeholder
  const cardImage =
    template.image ||
    template.preview ||
    `/images/cards/template-${template.id}.jpg`;

  return (
    <div
      className="group bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1"
      onClick={() => onClick(template)}
    >
      {/* Card Image Preview */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        {/* Actual Card Image */}
        <div className="relative w-full h-full">
          <img
            src={cardImage}
            alt={`${template.name} business card design`}
            className="w-full h-full object-contain p-4 transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to a placeholder image if the actual image fails to load
              e.target.src = `/images/cards/placeholder-card.jpg`;
            }}
          />

          {/* Design Elements Overlay */}
          <div
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
            style={{ backgroundColor: template.color }}
          >
            <div className="text-white text-sm font-bold">
              {template.icon || "💎"}
            </div>
          </div>

          {/* Color Indicator */}
          <div
            className="absolute bottom-4 left-4 w-6 h-6 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: template.color }}
          />
        </div>

        {/* Overlay with CTA */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
          <div className="w-full">
            <button className="w-full px-4 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Use This Design
            </button>
          </div>
        </div>

        {/* Featured Badge */}
        {template.featured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-sm">
              Popular
            </span>
          </div>
        )}

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Template Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {template.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                {template.category}
              </span>
              {template.design && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                  {template.design}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{template.rating}</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {template.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <TrendingUp size={12} />
              <span>{template.downloads} downloads</span>
            </div>
          </div>

          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Quick preview
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
export default function CardTemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Filter templates based on search and category
  const filteredTemplates = cardTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "featured" && template.featured) ||
      template.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    localStorage.setItem("selectedTemplate", JSON.stringify(template));

    // Navigate to card creation page with template ID
    setTimeout(() => {
      router.push(`/Cardcomp?template=${template.id}`);
    }, 300);
  };

  // Quick preview function
  const handleQuickPreview = (template, e) => {
    e.stopPropagation();
    setSelectedTemplate(template);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Choose Your Card Design
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Click on any card design below to start customizing with your
            information
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${
                    viewMode === "grid"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <CategoryFilter
            templates={cardTemplates}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600">
            Showing{" "}
            <span className="font-semibold">{filteredTemplates.length}</span>{" "}
            card designs
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock size={14} />
            <span>Click any card to start editing</span>
          </div>
        </div>

        {/* Selected Template Preview (Large) */}
        {selectedTemplate && (
          <div className="mb-12 bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Preview: {selectedTemplate.name}
                </h2>
                <p className="text-slate-600">{selectedTemplate.description}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => handleTemplateSelect(selectedTemplate)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Use This Design →
                </button>
              </div>
            </div>

            {/* Full Card Preview */}
            <div className="flex justify-center">
              <div className="scale-90">
                <Card1
                  formData={selectedTemplate.previewData}
                  template={selectedTemplate}
                />
              </div>
            </div>
          </div>
        )}

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {filteredTemplates.map((template) => (
              <TemplatePreview
                key={template.id}
                template={template}
                onClick={handleTemplateSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No designs found
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Try adjusting your search or filter to find what you&apos;re
              looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Need a custom design?
            </h3>
            <p className="text-slate-600 mb-6">
              Our design team can create a unique business card just for your
              brand.
            </p>
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 border border-blue-200 transition-colors">
              Request Custom Design
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
