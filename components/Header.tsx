"use client";

import React from "react";
import { Sparkles, Sliders, Layers, Cpu } from "lucide-react";
import { useStudioStore } from "@/lib/store";

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, gallery } = useStudioStore();

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-700 flex items-center justify-center shadow-glow flex-shrink-0">
            <Sparkles className="w-5 h-5 text-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-zinc-100 flex items-center gap-1.5">
                Imagen Nano Banana
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  v2 Studio
                </span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-amber-500" />
              <span>Target: <code className="text-zinc-300 font-mono">gemini-3.1-flash-image</code></span>
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 shadow-inner w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("studio")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === "studio"
                ? "bg-amber-500 text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>The Studio</span>
            {gallery.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === "studio" ? "bg-zinc-950/20 text-zinc-950" : "bg-zinc-800 text-zinc-400"
              }`}>
                {gallery.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("orchestrator")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === "orchestrator"
                ? "bg-amber-500 text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>The Orchestrator</span>
          </button>
        </div>
      </div>
    </header>
  );
};
