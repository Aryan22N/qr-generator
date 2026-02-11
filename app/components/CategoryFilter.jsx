"use client";

const CategoryFilter = ({ templates, activeCategory, onCategoryChange }) => {
  const categories = [
    { id: "all", name: "All Designs", count: templates.length },
    {
      id: "featured",
      name: "Popular",
      count: templates.filter((t) => t.featured).length,
    },
    {
      id: "professional",
      name: "Professional",
      count: templates.filter((t) => t.category === "Professional").length,
    },
    {
      id: "corporate",
      name: "Corporate",
      count: templates.filter((t) => t.category === "Corporate").length,
    },
    {
      id: "creative",
      name: "Creative",
      count: templates.filter((t) => t.category === "Creative").length,
    },
    {
      id: "tech",
      name: "Tech",
      count: templates.filter((t) => t.category === "Tech").length,
    },
    {
      id: "luxury",
      name: "Luxury",
      count: templates.filter((t) => t.category === "Luxury").length,
    },
    {
      id: "minimal",
      name: "Minimal",
      count: templates.filter((t) => t.category === "Minimal").length,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeCategory === category.id
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          {category.name}
          <span className="ml-2 text-xs opacity-80">({category.count})</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
