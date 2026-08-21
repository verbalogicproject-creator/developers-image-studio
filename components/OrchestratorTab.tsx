"use client";

import React from "react";
import {
  Sliders,
  Sparkles,
  Layers,
  RotateCcw,
  ArrowRight,
  Type,
  ShieldAlert,
  ShoppingBag,
  Share2,
  Atom,
  Layout,
  Palette,
  FileText,
} from "lucide-react";
import { useStudioStore } from "@/lib/store";
import {
  DOMAIN_OPTIONS,
  LIGHTING_OPTIONS,
  COMPOSITION_OPTIONS,
  MATERIAL_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  DOMAIN_VOCABULARIES,
  POST_CATEGORIES,
  TYPOGRAPHY_STYLES,
  TEXT_PLACEMENTS,
  ARTISTIC_STYLES,
  BADGE_POSITIONS,
  ARTISTIC_STYLE_VOCABULARIES,
} from "@/lib/constants";
import {
  DomainOption,
  LightingOption,
  CompositionOption,
  MaterialOption,
  AspectRatioOption,
  LabelModeOption,
  PostCategory,
  TypographyStyle,
  TextPlacement,
  ArtisticStyle,
  BadgePosition,
  PipelineMode,
} from "@/types";
import { Select } from "./ui/Select";
import { ToggleSwitch } from "./ui/ToggleSwitch";
import { ColorPickerInput } from "./ColorPickerInput";
import { PromptPreview } from "./PromptPreview";
import { Button } from "./ui/Button";

export const OrchestratorTab: React.FC = () => {
  const {
    pipelineMode,
    setPipelineMode,
    aspectRatio,
    setAspectRatio,
    brandColor,
    setBrandColor,
    excludeElements,
    setExcludeElements,

    // E-Commerce
    domain,
    setDomain,
    lighting,
    setLighting,
    composition,
    setComposition,
    material,
    setMaterial,
    labelMode,
    setLabelMode,
    brandName,
    setBrandName,
    productName,
    setProductName,
    productDetail,
    setProductDetail,
    packagingText,
    setPackagingText,
    toggles,
    setToggle,

    // Social Editorial
    postCategory,
    setPostCategory,
    headlineText,
    setHeadlineText,
    publicationBadge,
    setPublicationBadge,
    badgePosition,
    setBadgePosition,
    authorBadge,
    setAuthorBadge,
    typographyStyle,
    setTypographyStyle,
    textPlacement,
    setTextPlacement,
    artisticStyle,
    setArtisticStyle,

    setActiveTab,
  } = useStudioStore();

  const activeDomainInfo = DOMAIN_VOCABULARIES[domain];
  const activeArtStyleInfo = ARTISTIC_STYLE_VOCABULARIES[artisticStyle];

  const handleResetDefaults = () => {
    if (pipelineMode === "social_editorial") {
      setPostCategory("deep_tech");
      setArtisticStyle("luminescent_particles");
      setTypographyStyle("bold_impact_sans");
      setTextPlacement("bottom_third_scrim");
      setHeadlineText(
        "Your Bad Luck Isn't Random — And an Oxford Physicist's Machine Could Help Prove It"
      );
      setPublicationBadge("iai news");
      setBadgePosition("top_left");
      setAuthorBadge("Kanji Low • AI Marketing Strategist");
      setAspectRatio("1:1");
      setBrandColor("#F59E0B");
      setExcludeElements(
        "no visible people or hands, no watermark-like artifacts, no props not implied by the subject concept"
      );
    } else {
      setDomain("Skincare");
      setLighting("Diffused Natural");
      setComposition("Macro/Close-up");
      setMaterial("Matte/Frosted");
      setAspectRatio("1:1");
      setBrandColor("#E8DFD8");
      setLabelMode("none");
      setBrandName("Calyx");
      setProductName("Bare Barrier Serum");
      setProductDetail("50ml / 1.7 fl oz");
      setPackagingText("");
      setExcludeElements(
        "no visible people or hands, no watermark-like artifacts, no props not implied by the subject concept"
      );
      setToggle("negativeSpace", true);
      setToggle("studioIsolation", false);
      setToggle("naturalContext", true);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Master Pipeline Selector Header Bar */}
      <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-subtle-card backdrop-blur-md flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                Master Pipeline Orchestrator
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
                  Dual-Engine
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Switch seamlessly between Commercial E-Commerce and Viral Social/Editorial post synthesis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800/60 hover:bg-zinc-800 rounded-xl border border-zinc-700/60 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Mode Defaults
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setActiveTab("studio")}
              className="text-xs"
            >
              <span>Return to Studio</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </div>
        </div>

        {/* Master Mode Segmented Switch */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setPipelineMode("ecommerce")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              pipelineMode === "ecommerce"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold shadow-md"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>1. E-Commerce & Product Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setPipelineMode("social_editorial")}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              pipelineMode === "social_editorial"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-bold shadow-md"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>2. Social Media & Editorial Post Engine</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PIPELINE 1: E-COMMERCE CONTROLS                                           */}
      {/* ========================================================================= */}
      {pipelineMode === "ecommerce" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          {/* Left Column: Dropdowns & Presets */}
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-subtle-card backdrop-blur-md">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-zinc-800/60">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              Core Photographic Directives
            </h3>

            {/* Domain */}
            <Select
              label="Domain Aesthetic"
              helperText={activeDomainInfo?.persona}
              value={domain}
              onChange={(e) => setDomain(e.target.value as DomainOption)}
              options={DOMAIN_OPTIONS.map((d) => ({
                value: d,
                label: d,
              }))}
            />

            {/* Lighting */}
            <Select
              label="Lighting Direction"
              value={lighting}
              onChange={(e) => setLighting(e.target.value as LightingOption)}
              options={LIGHTING_OPTIONS.map((l) => ({
                value: l,
                label: l,
              }))}
            />

            {/* Composition */}
            <Select
              label="Camera Composition & Framing"
              value={composition}
              onChange={(e) =>
                setComposition(e.target.value as CompositionOption)
              }
              options={COMPOSITION_OPTIONS.map((c) => ({
                value: c,
                label: c,
              }))}
            />

            {/* Material Override */}
            <Select
              label="Material & Surface Override"
              value={material}
              onChange={(e) => setMaterial(e.target.value as MaterialOption)}
              options={MATERIAL_OPTIONS.map((m) => ({
                value: m,
                label: m,
              }))}
            />

            {/* Aspect Ratio */}
            <Select
              label="Aspect Ratio (API Output)"
              helperText="Maps directly to Google Imagen/Nano Banana aspect_ratio parameter."
              value={aspectRatio}
              onChange={(e) =>
                setAspectRatio(e.target.value as AspectRatioOption)
              }
              options={ASPECT_RATIO_OPTIONS.map((r) => ({
                value: r,
                label: r,
              }))}
            />
          </div>

          {/* Right Column: Typography Control, Color & Modifiers */}
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-subtle-card backdrop-blur-md">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-zinc-800/60">
              <Type className="w-3.5 h-3.5 text-amber-500" />
              Packaging Typography & Brand Control
            </h3>

            {/* Label Mode Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Label Rendering Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLabelMode("none")}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                    labelMode === "none"
                      ? "bg-amber-500/10 border-amber-500/80 text-amber-300 font-semibold"
                      : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <span className="block font-semibold">Blank / None</span>
                  <span className="text-[10px] text-zinc-500">
                    Safest for Post-Type
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setLabelMode("wordmark")}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                    labelMode === "wordmark"
                      ? "bg-amber-500/10 border-amber-500/80 text-amber-300 font-semibold"
                      : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <span className="block font-semibold">Wordmark</span>
                  <span className="text-[10px] text-zinc-500">
                    Brand Name Only
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setLabelMode("full")}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                    labelMode === "full"
                      ? "bg-amber-500/10 border-amber-500/80 text-amber-300 font-semibold"
                      : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <span className="block font-semibold">Full Label</span>
                  <span className="text-[10px] text-zinc-500">
                    Brand + Product + Vol
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setLabelMode("custom")}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all text-left ${
                    labelMode === "custom"
                      ? "bg-amber-500/10 border-amber-500/80 text-amber-300 font-semibold"
                      : "bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <span className="block font-semibold">Custom String</span>
                  <span className="text-[10px] text-zinc-500">
                    Exact Typography
                  </span>
                </button>
              </div>
            </div>

            {/* Conditional Typography Text Inputs */}
            {labelMode === "custom" && (
              <div className="flex flex-col gap-1.5 animate-in fade-in">
                <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Packaging Typography
                </label>
                <input
                  type="text"
                  value={packagingText}
                  onChange={(e) => setPackagingText(e.target.value)}
                  placeholder="e.g. LUMEN / Revitalizing Serum"
                  className="w-full h-11 px-3.5 text-sm rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/80"
                />
              </div>
            )}

            {(labelMode === "wordmark" || labelMode === "full") && (
              <div className="flex flex-col gap-2.5 animate-in fade-in">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Calyx"
                    className="w-full h-10 px-3 text-sm rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/80"
                  />
                </div>

                {labelMode === "full" && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="e.g. Bare Barrier Serum"
                        className="w-full h-10 px-3 text-sm rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/80"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                        Product Detail / Volume
                      </label>
                      <input
                        type="text"
                        value={productDetail}
                        onChange={(e) => setProductDetail(e.target.value)}
                        placeholder="e.g. 50ml / 1.7 fl oz"
                        className="w-full h-10 px-3 text-sm rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/80"
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Negative / Exclusion Constraints */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-800/60">
              <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                Exclusion Constraints
              </label>
              <input
                type="text"
                value={excludeElements}
                onChange={(e) => setExcludeElements(e.target.value)}
                placeholder="e.g. no visible people or hands, no watermark-like artifacts"
                className="w-full h-10 px-3 text-xs rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/80"
              />
            </div>

            {/* Brand Color Injector */}
            <div className="pt-2 border-t border-zinc-800/60">
              <ColorPickerInput
                value={brandColor}
                onChange={(color) => setBrandColor(color)}
              />
            </div>

            {/* Boolean Feature Toggles */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-zinc-800/60">
              <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Editorial & Scene Toggles
              </span>

              <ToggleSwitch
                label="Negative Space for Web Copy"
                description="Off-center rule-of-thirds margin reserved for editorial typography."
                checked={toggles.negativeSpace}
                onChange={(val) => setToggle("negativeSpace", val)}
              />

              <ToggleSwitch
                label="Studio Isolation"
                description="Clean geometric pedestal with seamless studio infinity cove backdrop."
                checked={toggles.studioIsolation}
                onChange={(val) => setToggle("studioIsolation", val)}
              />

              <ToggleSwitch
                label="Natural Context"
                description="Infuses organic fabric folds, dried botanicals, and realistic tactile textures."
                checked={toggles.naturalContext}
                onChange={(val) => setToggle("naturalContext", val)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PIPELINE 2: SOCIAL MEDIA & EDITORIAL CONTROLS                             */}
      {/* ========================================================================= */}
      {pipelineMode === "social_editorial" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          {/* Left Column: Visual Art Direction */}
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-subtle-card backdrop-blur-md">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-zinc-800/60">
              <Atom className="w-3.5 h-3.5 text-amber-500" />
              Theme & Visual Art Style
            </h3>

            {/* Category & Vibe Dropdown */}
            <Select
              label="Post Category & Narrative"
              helperText={
                POST_CATEGORIES.find((c) => c.value === postCategory)
                  ?.description
              }
              value={postCategory}
              onChange={(e) => setPostCategory(e.target.value as PostCategory)}
              options={POST_CATEGORIES.map((c) => ({
                value: c.value,
                label: c.label,
              }))}
            />

            {/* Visual Art Style */}
            <Select
              label="Visual Art & Lighting Style"
              helperText={activeArtStyleInfo?.lexicon}
              value={artisticStyle}
              onChange={(e) =>
                setArtisticStyle(e.target.value as ArtisticStyle)
              }
              options={ARTISTIC_STYLES.map((a) => ({
                value: a.value,
                label: a.label,
              }))}
            />

            {/* Aspect Ratio Selector for Social Media */}
            <Select
              label="Social Aspect Ratio"
              helperText="1:1 (Square Feed/LinkedIn), 3:4 (IG Portrait), 9:16 (Story/Reel), 16:9 (Landscape)."
              value={aspectRatio}
              onChange={(e) =>
                setAspectRatio(e.target.value as AspectRatioOption)
              }
              options={ASPECT_RATIO_OPTIONS.map((r) => ({
                value: r,
                label: r,
              }))}
            />

            {/* Theme Energy Accent Color */}
            <div className="pt-2 border-t border-zinc-800/60">
              <ColorPickerInput
                value={brandColor}
                onChange={(color) => setBrandColor(color)}
              />
            </div>

            {/* Exclusion Constraints */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-800/60">
              <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                Exclusion Constraints
              </label>
              <input
                type="text"
                value={excludeElements}
                onChange={(e) => setExcludeElements(e.target.value)}
                placeholder="e.g. no visible people or hands, no watermark-like artifacts"
                className="w-full h-10 px-3 text-xs rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500/80"
              />
            </div>
          </div>

          {/* Right Column: Graphic Design, Typography & Scrim Layout */}
          <div className="flex flex-col gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-subtle-card backdrop-blur-md">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-zinc-800/60">
              <Type className="w-3.5 h-3.5 text-amber-500" />
              Integrated Graphic Design & Typography
            </h3>

            {/* Primary Headline Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                <span>Primary Headline / Hook Copy</span>
                <span className="text-[10px] text-amber-400 font-mono">
                  Exact Rendered Text
                </span>
              </label>
              <textarea
                rows={3}
                value={headlineText}
                onChange={(e) => setHeadlineText(e.target.value)}
                placeholder="e.g. Your Bad Luck Isn't Random — And an Oxford Physicist's Machine Could Help Prove It"
                className="w-full p-3 text-sm leading-snug rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/80 resize-none"
              />
            </div>

            {/* Publication Badge / Logo & Position */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Publication Badge / Bug
                </label>
                <input
                  type="text"
                  value={publicationBadge}
                  onChange={(e) => setPublicationBadge(e.target.value)}
                  placeholder="e.g. iai news or POP MECH"
                  className="w-full h-10 px-3 text-sm rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/80"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                  Badge Position
                </label>
                <Select
                  value={badgePosition}
                  onChange={(e) =>
                    setBadgePosition(e.target.value as BadgePosition)
                  }
                  options={BADGE_POSITIONS.map((b) => ({
                    value: b.value,
                    label: b.label,
                  }))}
                />
              </div>
            </div>

            {/* Author / Footer Attribution */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-300 uppercase tracking-wider">
                Author / Subtitle Attribution (Optional)
              </label>
              <input
                type="text"
                value={authorBadge}
                onChange={(e) => setAuthorBadge(e.target.value)}
                placeholder="e.g. Kanji Low • AI Marketing Strategist"
                className="w-full h-10 px-3 text-sm rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/80"
              />
            </div>

            {/* Font & Hierarchy Dropdown */}
            <Select
              label="Typography Style & Font Vibe"
              helperText={
                TYPOGRAPHY_STYLES.find((t) => t.value === typographyStyle)
                  ?.description
              }
              value={typographyStyle}
              onChange={(e) =>
                setTypographyStyle(e.target.value as TypographyStyle)
              }
              options={TYPOGRAPHY_STYLES.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
            />

            {/* Text Placement & Scrim */}
            <Select
              label="Text Placement & Scrim Layout"
              helperText={
                TEXT_PLACEMENTS.find((p) => p.value === textPlacement)
                  ?.description
              }
              value={textPlacement}
              onChange={(e) =>
                setTextPlacement(e.target.value as TextPlacement)
              }
              options={TEXT_PLACEMENTS.map((p) => ({
                value: p.value,
                label: p.label,
              }))}
            />
          </div>
        </div>
      )}

      {/* Live Compiled Prompt Preview Container */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider px-1">
          Live Injected XML Prompt Preview ({pipelineMode === "ecommerce" ? "E-Commerce Pipeline" : "Social Editorial Pipeline"})
        </h3>
        <PromptPreview />
      </div>
    </div>
  );
};
