"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { StudioTab } from "@/components/StudioTab";
import { OrchestratorTab } from "@/components/OrchestratorTab";
import { useStudioStore } from "@/lib/store";

export default function Home() {
  const { activeTab } = useStudioStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch when hydrating localStorage-persisted Zustand state
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {activeTab === "studio" ? <StudioTab /> : <OrchestratorTab />}
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950/60 py-6 text-center text-xs text-zinc-600">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Imagen Nano Banana Image Studio v2 • Luxury Visual Context Engine</span>
          <span className="font-mono text-zinc-500">
            Powered by Google Gen AI (<code className="text-zinc-400">gemini-3.1-flash-image</code>)
          </span>
        </div>
      </footer>
    </div>
  );
}
