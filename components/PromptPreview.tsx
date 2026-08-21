"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, Code2 } from "lucide-react";
import { useStudioStore } from "@/lib/store";
import { compileStudioPrompt } from "@/lib/compiler";

export const PromptPreview: React.FC = () => {
  const {
    rawPrompt,
    domain,
    lighting,
    composition,
    material,
    aspectRatio,
    brandColor,
    toggles,
  } = useStudioStore();

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [viewMode, setViewMode] = useState<"xml" | "curl">("xml");

  const compiledPrompt = compileStudioPrompt({
    rawPrompt: rawPrompt || "Luxury product studio concept",
    domain,
    lighting,
    composition,
    material,
    aspectRatio,
    brandColor,
    toggles,
  });

  const curlCommand = `curl -X POST http://localhost:3000/api/generate \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(
    {
      rawPrompt: rawPrompt || "Luxury product studio concept",
      domain,
      lighting,
      composition,
      material,
      aspectRatio,
      brandColor,
      toggles,
    },
    null,
    2
  ).replace(/'/g, "'\\''")}'`;

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(compiledPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  };

  const handleCopyCurl = async () => {
    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl bg-zinc-900/70 border border-zinc-800/80 overflow-hidden shadow-subtle-card">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-950/70 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-900 rounded-lg p-0.5 border border-zinc-800">
            <button
              onClick={() => setViewMode("xml")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === "xml"
                  ? "bg-amber-500 text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Compiled XML
            </button>
            <button
              onClick={() => setViewMode("curl")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === "curl"
                  ? "bg-amber-500 text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              CLI Curl
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === "xml" ? (
            <button
              onClick={handleCopyPrompt}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white rounded-lg border border-zinc-700/60 transition-colors"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Prompt</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleCopyCurl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white rounded-lg border border-zinc-700/60 transition-colors"
            >
              {copiedCurl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copied curl!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy curl</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Code Display */}
      <div className="relative p-4 font-mono text-[11px] leading-relaxed text-zinc-300 overflow-x-auto max-h-72 select-text bg-zinc-950/40">
        <pre className="whitespace-pre-wrap break-words">
          {viewMode === "xml" ? compiledPrompt : curlCommand}
        </pre>
      </div>
    </div>
  );
};
