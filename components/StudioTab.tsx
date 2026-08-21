"use client";

import React, { useState, useRef } from "react";
import {
  Wand2,
  Copy,
  Check,
  Download,
  AlertCircle,
  Sparkles,
  Sliders,
  Maximize2,
  Minimize2,
  Info,
  ImagePlus,
  Paintbrush,
  UploadCloud,
  FileJson,
  X,
  Share2,
  ShoppingBag,
  Type,
  Tag,
  User,
} from "lucide-react";
import { useStudioStore } from "@/lib/store";
import { compileStudioPrompt } from "@/lib/compiler";
import { Button } from "./ui/Button";
import { Gallery } from "./Gallery";
import { PromptPreview } from "./PromptPreview";
import { CanvasMask } from "./CanvasMask";

export const StudioTab: React.FC = () => {
  const {
    pipelineMode,
    setPipelineMode,
    rawPrompt,
    setRawPrompt,
    aspectRatio,
    brandColor,
    excludeElements,

    // E-Commerce
    domain,
    lighting,
    composition,
    material,
    labelMode,
    brandName,
    productName,
    productDetail,
    packagingText,
    setPackagingText,
    toggles,

    // Social Editorial
    postCategory,
    headlineText,
    setHeadlineText,
    publicationBadge,
    setPublicationBadge,
    badgePosition,
    authorBadge,
    setAuthorBadge,
    typographyStyle,
    textPlacement,
    artisticStyle,

    // Edit / Inpaint Mode
    editMode,
    setEditMode,
    baseImage,
    baseImageMimeType,
    maskImage,
    setBaseImage,
    setMaskImage,
    clearEditImages,

    isGenerating,
    setIsGenerating,
    error,
    setError,
    currentGeneration,
    addGeneration,
    setActiveTab,
    gallery,
  } = useStudioStore();

  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ecommerceIdeas = [
    {
      prompt:
        "Matte white cosmetic tube on folded beige cashmere textile with soft window sunlight",
      label: "Calyx / Bare Barrier Cream",
    },
    {
      prompt:
        "Amber glass dropper serum bottle resting beside delicate dried flora with warm raking shadows",
      label: "LUMEN / Botanical Elixir",
    },
    {
      prompt:
        "Flawless solitaire diamond ring on deep obsidian velvet plinth with micro-facet caustics",
      label: "AURELIA / Haute Joaillerie",
    },
    {
      prompt:
        "Vintage 1982 Bordeaux wine bottle with aged wax seal resting on French oak cellar barrel",
      label: "CHÂTEAU MARGAUX 1982",
    },
  ];

  const socialEditorialIdeas = [
    {
      prompt:
        "Glowing golden singularity particle vortex funneling into a quantum spacetime grid with luminescent fiber optics",
      headline:
        "Your Bad Luck Isn't Random — And an Oxford Physicist's Machine Could Help Prove It",
      badge: "iai news",
      author: "Kanji Low • AI Marketing Strategist",
    },
    {
      prompt:
        "Bioluminescent synaptic neural network filaments branching through deep cobalt celestial cosmic void with glowing axon pulses",
      headline:
        "Consciousness Beyond Neurons: The Quantum Microtubule Revolution",
      badge: "POP SCIENCE",
      author: "Neuroscience Dispatch",
    },
    {
      prompt:
        "Stylized 3D matte vinyl AI dev mascot coding on floating glowing cyan and neon purple holographic telemetry windows",
      headline:
        "Why 90% of Autonomous AI Agents Fail in Production (And the 1 Architecture That Doesn't)",
      badge: "DEV LEADERSHIP",
      author: "Architect Weekly",
    },
    {
      prompt:
        "Annotated quantum wave spectrum schematic blueprint with glowing cyan neon geometric grid on obsidian carbon substrate",
      headline:
        "The Arrow of Time Can Be Reversed in Superconducting Qubits",
      badge: "PHYSICS TODAY",
      author: "Quantum Foundry",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mimeType = file.type || "image/jpeg";
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBaseImage(result, mimeType);
      setMaskImage(null);
    };
    reader.readAsDataURL(file);
  };

  const getPayload = () => ({
    pipelineMode,
    rawPrompt,
    aspectRatio,
    brandColor,
    excludeElements,
    editMode,
    baseImage: editMode === "edit" ? baseImage : null,
    baseImageMimeType: editMode === "edit" ? baseImageMimeType : undefined,
    maskImage: editMode === "edit" ? maskImage : null,

    // E-Commerce
    domain,
    lighting,
    composition,
    material,
    labelMode,
    brandName,
    productName,
    productDetail,
    packagingText,
    toggles,

    // Social Editorial
    postCategory,
    headlineText,
    publicationBadge,
    badgePosition,
    authorBadge,
    typographyStyle,
    textPlacement,
    artisticStyle,
  });

  const handleGenerate = async () => {
    if (!rawPrompt.trim()) {
      setError("Please enter a concept prompt before generating.");
      return;
    }

    if (editMode === "edit" && !baseImage) {
      setError("Please upload a base image for Edit/Inpaint mode.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const payload = getPayload();

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate image.");
      }

      const newGen = {
        id:
          "gen-" +
          Date.now() +
          "-" +
          Math.random().toString(36).substring(2, 7),
        timestamp: Date.now(),
        rawPrompt,
        compiledPrompt: data.compiledPrompt || compileStudioPrompt(payload),
        imageData: data.imageData,
        mimeType: data.mimeType || "image/jpeg",
        mode: editMode,
        pipelineMode,
        parameters: {
          pipelineMode,
          aspectRatio,
          brandColor,
          excludeElements,
          domain,
          lighting,
          composition,
          material,
          labelMode,
          brandName,
          productName,
          productDetail,
          packagingText,
          toggles: { ...toggles },
          postCategory,
          headlineText,
          publicationBadge,
          badgePosition,
          authorBadge,
          typographyStyle,
          textPlacement,
          artisticStyle,
        },
      };

      addGeneration(newGen);
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(
        err.message ||
          "An unexpected error occurred while generating the image."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCompiled = async () => {
    const compiled = compileStudioPrompt(getPayload());
    try {
      await navigator.clipboard.writeText(compiled);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Clipboard copy failed", e);
    }
  };

  const activeImageSrc = currentGeneration
    ? currentGeneration.imageData.startsWith("data:")
      ? currentGeneration.imageData
      : `data:${currentGeneration.mimeType};base64,${currentGeneration.imageData}`
    : null;

  const handleDownloadActive = () => {
    if (!currentGeneration || !activeImageSrc) return;
    const link = document.createElement("a");
    link.href = activeImageSrc;
    const prefix =
      currentGeneration.parameters.pipelineMode === "social_editorial"
        ? `editorial-${currentGeneration.parameters.postCategory || "post"}`
        : `ecommerce-${currentGeneration.parameters.domain?.toLowerCase() || "asset"}`;
    link.download = `imagen-banana-${prefix}-${currentGeneration.timestamp}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditActiveImage = () => {
    if (!activeImageSrc) return;
    setBaseImage(activeImageSrc, currentGeneration?.mimeType || "image/jpeg");
    setEditMode("edit");
  };

  const handleExportManifest = () => {
    if (gallery.length === 0) return;
    const manifest = {
      project: "Imagen Nano Banana Image Studio v2",
      pipelineMode,
      exportTimestamp: new Date().toISOString(),
      itemsCount: gallery.length,
      items: gallery.map((item) => ({
        id: item.id,
        filename: `imagen-banana-${item.parameters.pipelineMode}-${item.timestamp}.jpg`,
        timestamp: new Date(item.timestamp).toISOString(),
        rawPrompt: item.rawPrompt,
        parameters: item.parameters,
        compiledPrompt: item.compiledPrompt,
      })),
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `screening-manifest-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Banner: Master Pipeline Selector & Inpaint Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-subtle-card gap-3">
        {/* Pipeline Selector Switch */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setPipelineMode("ecommerce")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              pipelineMode === "ecommerce"
                ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>E-Commerce Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setPipelineMode("social_editorial")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              pipelineMode === "social_editorial"
                ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Editorial</span>
          </button>
        </div>

        {/* Action modes */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setEditMode("generate")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                editMode === "generate"
                  ? "bg-zinc-800 text-amber-300 font-bold shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Text-to-Image
            </button>
            <button
              type="button"
              onClick={() => setEditMode("edit")}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                editMode === "edit"
                  ? "bg-zinc-800 text-amber-300 font-bold shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Inpaint / Edit
            </button>
          </div>

          {gallery.length > 0 && (
            <button
              onClick={handleExportManifest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 hover:text-white rounded-xl border border-zinc-700/60 transition-colors"
              title="Download screening manifest JSON for human review"
            >
              <FileJson className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Export Manifest</span>
            </button>
          )}
        </div>
      </div>

      {/* Edit / Inpaint Canvas Area (Shown when in Edit mode) */}
      {editMode === "edit" && (
        <div className="flex flex-col gap-3 p-5 rounded-2xl bg-zinc-900/80 border border-amber-500/30 shadow-subtle-card backdrop-blur-md animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <ImagePlus className="w-4 h-4 text-amber-400" />
              Reference Base Image & Inpainting Mask
            </h3>
            {baseImage && (
              <button
                type="button"
                onClick={clearEditImages}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear Image
              </button>
            )}
          </div>

          {!baseImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-zinc-700 hover:border-amber-500/80 bg-zinc-950/60 cursor-pointer transition-all text-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  Tap to upload reference photo from device / camera
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Supports JPEG, PNG, WebP • Mask drawing canvas will appear automatically
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <CanvasMask
                baseImage={baseImage}
                onMaskChange={(mask) => setMaskImage(mask)}
                aspectRatio={aspectRatio}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN INPUT & COPYWRITING CARD (DYNAMIC BASED ON PIPELINE)                  */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-subtle-card backdrop-blur-md">
        {/* Header & Meta Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {pipelineMode === "social_editorial"
                ? "Social Editorial Prompt & Copy Studio"
                : "E-Commerce Concept & Packaging Studio"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-700/60">
              {pipelineMode === "social_editorial"
                ? `${postCategory} • ${aspectRatio}`
                : `${domain} • ${aspectRatio}`}
            </span>
            <button
              onClick={() => setActiveTab("orchestrator")}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Full Orchestrator</span>
            </button>
          </div>
        </div>

        {/* ======================================================= */}
        {/* PIPELINE 1 (E-COMMERCE) STUDIO INPUTS                   */}
        {/* ======================================================= */}
        {pipelineMode === "ecommerce" && (
          <div className="flex flex-col gap-3 animate-in fade-in">
            {/* Subject Scene Prompt */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="prompt-input"
                className="text-xs font-medium text-zinc-300 uppercase tracking-wider"
              >
                {editMode === "edit"
                  ? "Inpainting / Modification Instruction"
                  : "Product Staging & Subject Scene Prompt"}
              </label>
              <textarea
                id="prompt-input"
                rows={3}
                value={rawPrompt}
                onChange={(e) => setRawPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="e.g. Matte white cosmetic lotion tube on textured beige linen with soft morning light..."
                className="w-full p-3.5 rounded-xl text-sm leading-relaxed bg-zinc-950/70 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/80 resize-none shadow-inner"
              />
            </div>

            {/* Packaging Typography Text Input */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="packaging-input"
                className="text-xs font-medium text-zinc-300 uppercase tracking-wider flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-amber-400" />
                  Packaging Typography / Label Copy (Optional)
                </span>
                <span className="text-[11px] text-zinc-500">
                  Exact text to print on container
                </span>
              </label>
              <input
                id="packaging-input"
                type="text"
                value={packagingText}
                onChange={(e) => setPackagingText(e.target.value)}
                placeholder="e.g. Calyx / Bare Barrier Serum (or leave empty for blank container)"
                className="w-full h-11 px-3.5 text-sm rounded-xl bg-zinc-950/70 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/80"
              />
            </div>

            {/* E-Commerce Inspiration Chips */}
            {editMode === "generate" && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <span className="text-[11px] text-zinc-500 flex-shrink-0">
                  Presets:
                </span>
                {ecommerceIdeas.map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRawPrompt(idea.prompt);
                      setPackagingText(idea.label);
                    }}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-300 hover:text-amber-200 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {idea.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================= */}
        {/* PIPELINE 2 (SOCIAL EDITORIAL) STUDIO INPUTS             */}
        {/* ======================================================= */}
        {pipelineMode === "social_editorial" && (
          <div className="flex flex-col gap-3 animate-in fade-in">
            {/* Visual Scene & Cosmic Prompt */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="social-prompt-input"
                className="text-xs font-medium text-zinc-300 uppercase tracking-wider"
              >
                Visual Scene & Science Art Concept
              </label>
              <textarea
                id="social-prompt-input"
                rows={2}
                value={rawPrompt}
                onChange={(e) => setRawPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="e.g. Glowing golden singularity particle vortex funneling into a quantum spacetime grid with luminescent fiber optics..."
                className="w-full p-3.5 rounded-xl text-sm leading-relaxed bg-zinc-950/70 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/80 resize-none shadow-inner"
              />
            </div>

            {/* Primary Headline Copy Textarea */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="headline-input"
                className="text-xs font-medium text-zinc-300 uppercase tracking-wider flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-amber-400" />
                  Post Headline / Hook Copy (Integrated Scrim Text)
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  Exact Rendered Typography
                </span>
              </label>
              <textarea
                id="headline-input"
                rows={2}
                value={headlineText}
                onChange={(e) => setHeadlineText(e.target.value)}
                placeholder="e.g. Your Bad Luck Isn't Random — And an Oxford Physicist's Machine Could Help Prove It"
                className="w-full p-3 text-sm leading-snug rounded-xl bg-zinc-950/70 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/80 resize-none"
              />
            </div>

            {/* Publication Badge & Author Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  Publication Bug / Brand Tag
                </label>
                <input
                  type="text"
                  value={publicationBadge}
                  onChange={(e) => setPublicationBadge(e.target.value)}
                  placeholder="e.g. iai news or POP MECH"
                  className="w-full h-10 px-3 text-sm rounded-xl bg-zinc-950/70 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/80"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Author / Footer Subhead (Optional)
                </label>
                <input
                  type="text"
                  value={authorBadge}
                  onChange={(e) => setAuthorBadge(e.target.value)}
                  placeholder="e.g. Kanji Low • AI Marketing Strategist"
                  className="w-full h-10 px-3 text-sm rounded-xl bg-zinc-950/70 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/80"
                />
              </div>
            </div>

            {/* Social Editorial Inspiration Chips */}
            {editMode === "generate" && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
                <span className="text-[11px] text-zinc-500 flex-shrink-0">
                  Viral Presets:
                </span>
                {socialEditorialIdeas.map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setRawPrompt(idea.prompt);
                      setHeadlineText(idea.headline);
                      setPublicationBadge(idea.badge);
                      setAuthorBadge(idea.author);
                    }}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-300 hover:text-amber-200 transition-colors whitespace-nowrap flex-shrink-0"
                  >
                    {idea.badge}: {idea.headline.substring(0, 30)}...
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-800/60">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleCopyCompiled}
              className="w-full sm:w-auto text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>Compiled Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy Compiled Prompt</span>
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => setShowPromptDetails(!showPromptDetails)}
              className="p-2.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/50 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Toggle Live XML Prompt"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            isLoading={isGenerating}
            onClick={handleGenerate}
            className="w-full sm:w-auto px-6 text-sm"
          >
            <Wand2 className="w-4 h-4" />
            <span>
              {editMode === "edit"
                ? "Synthesize Inpaint Edit"
                : pipelineMode === "social_editorial"
                ? "Synthesize Social Post Visual"
                : "Generate with Nano Banana"}
            </span>
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 flex items-start gap-3 text-xs leading-relaxed animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-rose-300">Generation Error: </span>
            {error}
          </div>
        </div>
      )}

      {/* Optional Live Prompt Collapsible */}
      {showPromptDetails && <PromptPreview />}

      {/* Main Viewport Showcase */}
      <div className="flex flex-col gap-3 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-subtle-card backdrop-blur-md">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <span>Active Viewport</span>
            {currentGeneration && (
              <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {currentGeneration.parameters.pipelineMode === "social_editorial"
                  ? currentGeneration.parameters.postCategory
                  : currentGeneration.parameters.domain}{" "}
                • {currentGeneration.parameters.aspectRatio}
              </span>
            )}
          </h3>

          {currentGeneration && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditActiveImage}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-amber-500/30 transition-colors"
                title="Send active image to Inpaint/Edit mode"
              >
                <Paintbrush className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit in Inpaint</span>
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={handleDownloadActive}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>

        {/* Viewport Display Area */}
        <div
          className={`relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 flex items-center justify-center transition-all ${
            isFullscreen
              ? "fixed inset-4 z-50 bg-zinc-950/95 backdrop-blur-2xl flex flex-col p-6 border-zinc-700"
              : "min-h-[360px] md:min-h-[440px]"
          }`}
        >
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-100">
                  {editMode === "edit"
                    ? "Executing Multimodal Inpainting"
                    : pipelineMode === "social_editorial"
                    ? "Synthesizing High-Impact Social Graphic"
                    : "Compiling & Synthesizing Visuals"}
                </h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                  Gemini Nano Banana 2 is rendering photorealistic lighting, typography, and materials...
                </p>
              </div>
            </div>
          ) : activeImageSrc ? (
            <div className="relative w-full h-full flex items-center justify-center group">
              <img
                src={activeImageSrc}
                alt={currentGeneration?.rawPrompt || "Generated Output"}
                className={`max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-transform duration-300 ${
                  isFullscreen ? "max-h-[85vh]" : ""
                }`}
              />
              {isFullscreen && (
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900/90 text-zinc-300 hover:text-white border border-zinc-700"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 shadow-inner">
                <Sparkles className="w-8 h-8 text-amber-500/50" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-zinc-300">Studio Viewport Idle</h4>
                <p className="text-xs text-zinc-500 max-w-xs mt-1">
                  Type your prompt and copy above and click Generate to create luxury imagery.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Current generation metadata footer */}
        {currentGeneration && (
          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/60 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium truncate max-w-[80%]">
                &ldquo;{currentGeneration.rawPrompt}&rdquo;
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {new Date(currentGeneration.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-zinc-400">
              <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-amber-300 font-mono">
                Mode: {currentGeneration.parameters.pipelineMode || "ecommerce"}
              </span>
              {currentGeneration.parameters.pipelineMode === "social_editorial" ? (
                <>
                  <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">
                    {currentGeneration.parameters.postCategory}
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">
                    {currentGeneration.parameters.typographyStyle}
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">
                    {currentGeneration.parameters.textPlacement}
                  </span>
                </>
              ) : (
                <>
                  <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">
                    {currentGeneration.parameters.domain}
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">
                    {currentGeneration.parameters.lighting}
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-300">
                    {currentGeneration.parameters.material}
                  </span>
                </>
              )}
              {currentGeneration.parameters.brandColor && (
                <span className="px-2 py-0.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-300 flex items-center gap-1 font-mono">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: currentGeneration.parameters.brandColor }}
                  />
                  {currentGeneration.parameters.brandColor}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Gallery Cached History Section */}
      <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-subtle-card backdrop-blur-md">
        <Gallery />
      </div>
    </div>
  );
};
