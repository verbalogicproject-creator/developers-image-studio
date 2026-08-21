"use client";

import React from "react";
import {
  Sliders,
  Sparkles,
  Layers,
  SunMedium,
  Camera,
  Component,
  Ratio,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useStudioStore } from "@/lib/store";
import {
  DOMAIN_OPTIONS,
  LIGHTING_OPTIONS,
  COMPOSITION_OPTIONS,
  MATERIAL_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  DOMAIN_VOCABULARIES,
} from "@/lib/constants";
import {
  DomainOption,
  LightingOption,
  CompositionOption,
  MaterialOption,
  AspectRatioOption,
} from "@/types";
import { Select } from "./ui/Select";
import { ToggleSwitch } from "./ui/ToggleSwitch";
import { ColorPickerInput } from "./ColorPickerInput";
import { PromptPreview } from "./PromptPreview";
import { Button } from "./ui/Button";

export const OrchestratorTab: React.FC = () => {
  const {
    domain,
    setDomain,
    lighting,
    setLighting,
    composition,
    setComposition,
    material,
    setMaterial,
    aspectRatio,
    setAspectRatio,
    brandColor,
    setBrandColor,
    toggles,
    setToggle,
    setActiveTab,
  } = useStudioStore();

  const activeDomainInfo = DOMAIN_VOCABULARIES[domain];

  const handleResetDefaults = () => {
    setDomain("Skincare");
    setLighting("Diffused Natural");
    setComposition("Macro/Close-up");
    setMaterial("Matte/Frosted");
    setAspectRatio("1:1");
    setBrandColor("#E8DFD8");
    setToggle("negativeSpace", true);
    setToggle("studioIsolation", false);
    setToggle("naturalContext", true);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Info */}
      <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-subtle-card backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              Visual Context Orchestrator
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
                localStorage Synced
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Configure luxury lighting, composition, materials, and spatial guidelines before injection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-800/60 hover:bg-zinc-800 rounded-xl border border-zinc-700/60 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
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

      {/* Grid of Orchestrator Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            onChange={(e) => setComposition(e.target.value as CompositionOption)}
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
            onChange={(e) => setAspectRatio(e.target.value as AspectRatioOption)}
            options={ASPECT_RATIO_OPTIONS.map((r) => ({
              value: r,
              label: r,
            }))}
          />
        </div>

        {/* Right Column: Color Injector & Editorial Toggles */}
        <div className="flex flex-col gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 shadow-subtle-card backdrop-blur-md">
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-zinc-800/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Color & Spatial Modifiers
          </h3>

          {/* Brand Color Injector */}
          <ColorPickerInput
            value={brandColor}
            onChange={(color) => setBrandColor(color)}
          />

          {/* Boolean Feature Toggles */}
          <div className="flex flex-col gap-2.5 pt-2">
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

      {/* Live Compiled Prompt Preview Container */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider px-1">
          Live Injected XML Prompt Preview
        </h3>
        <PromptPreview />
      </div>
    </div>
  );
};
