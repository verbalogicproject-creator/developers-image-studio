"use client";

import React from "react";
import { Download, Trash2, RotateCcw, Clock, Sparkles, Image as ImageIcon, Paintbrush } from "lucide-react";
import { useStudioStore } from "@/lib/store";
import { GenerationItem } from "@/types";

export const Gallery: React.FC = () => {
  const {
    gallery,
    currentGeneration,
    setCurrentGeneration,
    removeGeneration,
    clearGallery,
    loadParameters,
    setBaseImage,
    setEditMode,
    setActiveTab,
  } = useStudioStore();

  const handleDownload = (item: GenerationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = item.imageData.startsWith("data:")
      ? item.imageData
      : `data:${item.mimeType};base64,${item.imageData}`;
    link.download = `imagen-banana-${item.parameters.domain.toLowerCase().replace(/\s+/g, "-")}-${item.timestamp}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestore = (item: GenerationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    loadParameters(item);
  };

  const handleEditInInpaint = (item: GenerationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const imgData = item.imageData.startsWith("data:")
      ? item.imageData
      : `data:${item.mimeType};base64,${item.imageData}`;
    setBaseImage(imgData, item.mimeType || "image/jpeg");
    setEditMode("edit");
    setActiveTab("studio");
  };

  if (gallery.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-zinc-900/40 border border-dashed border-zinc-800 text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-500 mb-3">
          <ImageIcon className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-zinc-300">No Generations in Local Cache</h4>
        <p className="text-xs text-zinc-500 max-w-sm mt-1">
          Your generated images, packaging parameters, and prompt metadata will be cached here automatically across app sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Cached Generation History
          </h3>
          <span className="px-2 py-0.5 text-[11px] font-mono bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700/60">
            {gallery.length}/15
          </span>
        </div>

        <button
          onClick={clearGallery}
          className="text-xs text-zinc-500 hover:text-rose-400 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cache
        </button>
      </div>

      {/* Grid of Generations */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {gallery.map((item) => {
          const isSelected = currentGeneration?.id === item.id;
          const imageSrc = item.imageData.startsWith("data:")
            ? item.imageData
            : `data:${item.mimeType};base64,${item.imageData}`;

          return (
            <div
              key={item.id}
              onClick={() => setCurrentGeneration(item)}
              className={`group relative rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 bg-zinc-900 ${
                isSelected
                  ? "ring-2 ring-amber-500 border-amber-500/80 shadow-glow"
                  : "border-zinc-800 hover:border-zinc-600"
              }`}
            >
              {/* Image Preview */}
              <div className="aspect-square w-full relative bg-zinc-950 overflow-hidden">
                <img
                  src={imageSrc}
                  alt={item.rawPrompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium bg-black/70 text-zinc-200 backdrop-blur-sm rounded border border-white/10">
                    {item.parameters.aspectRatio}
                  </span>
                  {item.mode === "edit" && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-medium bg-amber-500/80 text-black backdrop-blur-sm rounded">
                      Inpaint
                    </span>
                  )}
                </div>

                {/* Action Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleRestore(item, e)}
                        title="Load Parameters to Studio"
                        className="p-1.5 rounded-lg bg-zinc-900/90 text-amber-400 hover:bg-amber-500 hover:text-black transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleEditInInpaint(item, e)}
                        title="Open in Inpaint / Edit"
                        className="p-1.5 rounded-lg bg-zinc-900/90 text-amber-300 hover:bg-amber-400 hover:text-black transition-colors"
                      >
                        <Paintbrush className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDownload(item, e)}
                        title="Download Image"
                        className="p-1.5 rounded-lg bg-zinc-900/90 text-zinc-200 hover:bg-zinc-800 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeGeneration(item.id);
                        }}
                        title="Delete"
                        className="p-1.5 rounded-lg bg-zinc-900/90 text-rose-400 hover:bg-rose-900/80 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta details footer */}
              <div className="p-2.5 bg-zinc-900/90 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-amber-300/90 truncate">
                    {item.parameters.domain}
                  </span>
                  <span className="text-[10px] text-zinc-500 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-1">
                  {item.rawPrompt}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
