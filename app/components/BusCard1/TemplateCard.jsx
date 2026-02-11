"use client";

import { Eye, Copy, ArrowRight } from "lucide-react";

const TemplateCard = ({ template, onClick }) => {
  return (
    <div
      className="group bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => onClick(template)}
    >
      {/* Template Preview */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-50 to-white">
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: `${template.color}15` }}
        >
          {/* Preview design based on template type */}
          <div className="w-3/4 h-32 bg-white rounded-lg shadow-md p-4 transform group-hover:scale-105 transition-transform duration-300">
            <div className="flex items-start gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: template.color }}
              >
                {template.icon}
              </div>
              <div>
                <div className="h-2 w-24 bg-slate-200 rounded mb-1"></div>
                <div className="h-2 w-16 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-100 rounded"></div>
              <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
              <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
            </div>
            <div className="absolute bottom-4 right-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Eye size={14} className="text-slate-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Badge */}
        {template.featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
              Popular
            </span>
          </div>
        )}
      </div>

      {/* Template Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-slate-900">{template.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{template.category}</p>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${template.color}20` }}
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: template.color }}
            ></div>
          </div>
        </div>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {template.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Use Template
            <ArrowRight size={14} />
          </button>
          <div className="flex gap-2">
            <button
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              title="Quick Preview"
            >
              <Eye size={14} className="text-slate-600" />
            </button>
            <button
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              title="Duplicate"
            >
              <Copy size={14} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
