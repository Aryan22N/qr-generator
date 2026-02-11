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
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-blue-400 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2"
      onClick={() => onClick(template)}
    >
      {/* Card Image Preview */}
      <div className="relative h-64 overflow-hidden bg-slate-100">
        {/* Actual Card Image */}
        <div className="relative w-full h-full">
          <img
            src={cardImage}
            alt={`${template.name} business card design`}
            className="w-full h-full object-contain p-6 transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback to a placeholder image if the actual image fails to load
              e.target.src = `/images/cards/placeholder-card.jpg`;
            }}
          />

          {/* Design Elements Overlay */}
          <div
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm bg-white/90"
            style={{ color: template.color }}
          >
            <div className="text-lg font-bold">{template.icon || "💎"}</div>
          </div>
        </div>

        {/* Overlay with CTA */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6 backdrop-blur-[2px]">
          <div className="w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-full px-4 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-colors">
              Use This Design
            </button>
          </div>
        </div>

        {/* Featured Badge */}
        {template.featured && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg">
              Popular
            </span>
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {template.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                {template.category}
              </span>
              {template.design && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                  {template.design}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-bold text-slate-700">
              {template.rating}
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-500 mb-5 line-clamp-2 leading-relaxed">
          {template.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <TrendingUp size={14} className="text-emerald-500" />
            <span>{template.downloads} saved</span>
          </div>

          <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group/btn">
            Preview
            <span className="group-hover/btn:translate-x-0.5 transition-transform">
              →
            </span>
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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Design Your <span className="text-blue-600">Identity</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Choose from our collection of premium, professionally designed
            templates to start building your brand today.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Controls */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={22}
                />
                <input
                  type="text"
                  placeholder="Search designs like 'Corporate', 'Minimal'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 rounded-lg transition-all ${viewMode === "grid"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 rounded-lg transition-all ${viewMode === "list"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                      }`}
                  >
                    <List size={20} />
                  </button>
                </div>

                <button className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/20">
                  <Filter size={18} />
                  Filters
                </button>
              </div>
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
        <div className="mb-8 flex items-center justify-between">
          <p className="text-slate-600 font-medium">
            Showing{" "}
            <span className="text-slate-900 font-bold">
              {filteredTemplates.length}
            </span>{" "}
            premium designs
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
            <Clock size={14} />
            <span>Updated weekly</span>
          </div>
        </div>

        {/* Selected Template Preview (Large) */}
        {selectedTemplate && (
          <div className="mb-12 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden ring-4 ring-slate-50">
            <div className="p-8 md:p-10 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Preview: {selectedTemplate.name}
                  </h2>
                  <p className="text-slate-600 text-lg">
                    {selectedTemplate.description}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="px-6 py-3 bg-white text-slate-700 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => handleTemplateSelect(selectedTemplate)}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
                  >
                    Use This Design <span className="text-xl">→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Full Card Preview */}
            <div className="p-12 bg-slate-100/50 flex justify-center overflow-x-auto">
              <div className="scale-90 transform-gpu hover:scale-100 transition-transform duration-500">
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
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-50 flex items-center justify-center">
              <Search size={40} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No designs found
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              We couldn&apos;t find any templates matching your search. Try
              adjusting your filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Need a custom enterprise design?
              </h3>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Our tailored solutions help large organizations maintain brand
                consistency across thousands of employees.
              </p>
              <button className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Contact Enterprise Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
