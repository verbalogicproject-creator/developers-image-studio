# Changelog & Evolutionary History 📜

All notable changes, architectural pivots, and feature additions to **Imagen Nano Banana Image Studio v2** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.2.0] - 2026-08-21 (Dual-Pipeline Architecture & Studio Post Copy)

### Added
* **Master Pipeline Selector:** Introduced dual-engine branching between `ecommerce` (Commercial Product Studio) and `social_editorial` (Social Media & Editorial Post Engine).
* **Social Editorial Directives in Compiler (`lib/compiler.ts`):**
  * `<editorial_art_director>` persona definition for viral science, quantum cosmology, and tech editorial graphics.
  * `<editorial_theme>` mapping 5 categories: Deep Tech, Quantum Consciousness, 3D AI Dev Marketing, Pop Science, and Diagrammatic Infographics.
  * `<visual_art_style>` mapping 4 aesthetic presets: Luminescent Fiber Optics, Cosmic Synapses, 3D Matte Clay, and Technical Blueprints.
  * `<graphic_design_and_typography>` with explicit headline rendering, publication bug placement, and bottom dark gradient scrim contrast rules.
* **StudioTab Post Copy Inputs (`components/StudioTab.tsx`):**
  * Embedded first-class Headline / Hook Copy input directly in the Studio tab.
  * Embedded Publication Bug & Author Attribution subhead inputs.
  * Added viral science preset inspiration chips (Singularity Machine, Neural Consciousness, 3D Claude + Codex Mascot, Quantum Arrow of Time).
* **Master Pipeline GUI in Orchestrator (`components/OrchestratorTab.tsx`):**
  * Segmented master pill switch: `[ 1. E-Commerce & Product Studio ]` | `[ 2. Social Media & Editorial Post Engine ]`.
  * Dynamic conditional controls for categories, typography styles, text placements, and artistic visual styles.
* **Full Local Persistence:** All dual-pipeline states persist in browser `localStorage` across reloads.

### Changed
* Updated `types/index.ts` and `lib/schema.ts` with `PipelineMode`, `PostCategory`, `TypographyStyle`, `TextPlacement`, `ArtisticStyle`, and `BadgePosition`.
* Updated `components/PromptPreview.tsx` to display compiled XML and ready-to-run curl commands for both pipelines.
* Updated `components/Gallery.tsx` to handle dynamic prefixing and metadata for both e-commerce and social editorial items.

---

## [2.1.0] - 2026-08-21 (Label Control, Inpainting Canvas & Manifests)

### Added
* **Label & Typography Control:**
  * Added `labelMode: 'none' | 'wordmark' | 'full' | 'custom'`.
  * Injected `<packaging_typography>` tag into `lib/compiler.ts` prohibiting AI descriptive keyword hallucinations on product containers.
  * Added `brandName` (e.g. `"Calyx"`), `productName` (`"Bare Barrier Serum"`), `productDetail` (`"50ml / 1.7 fl oz"`), and `packagingText` inputs in Orchestrator.
* **Image-to-Image & Mobile Inpainting Canvas (`components/CanvasMask.tsx`):**
  * Touch-friendly HTML5 Canvas overlay with brush size slider (10px–80px), eraser, and binary mask export.
  * Added `editMode: 'generate' | 'edit'`, `baseImage`, and `maskImage` to Zustand store.
  * Added "Edit in Inpaint" bridge button on Viewport and Gallery cards.
* **Negative & Exclusion Constraints:**
  * Added `excludeElements` input injected as `<exclusion_constraints>` in XML prompt to eliminate unwanted human hands, faces, or props.
* **Screening Manifest Export:**
  * Added "Export Manifest" button in Studio tab generating `screening-manifest-*.json` alongside batch images for human verification workflows.

### Changed
* Updated `app/api/generate/route.ts` to construct multimodal parts (`text` + `baseImage` + `maskImage`) for `@google/genai` `generateContent`.

---

## [2.0.0] - 2026-08-21 (Nano Banana 2 Baseline Migration)

### Added
* **Migration to Nano Banana 2:**
  * Migrated from deprecated `imagen-3.0-generate-002` to `gemini-3.1-flash-image` model.
  * Replaced legacy `generateImages` with unified `ai.models.generateContent({ config: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio } } })`.
  * Updated response parsing to extract base64 from `response.candidates[0].content.parts[0].inlineData.data`.
* **Visual Context Prompt Compiler (`lib/compiler.ts`):**
  * Synthesizes natural language inputs with photographer personas, domain vocabularies, lighting setups, and camera composition.
* **Luxury Dark Theme UI:**
  * Obsidian dark palette with amber glow accents, custom scrollbars, and tactile buttons.
* **Zustand State Store (`lib/store.ts`):**
  * Lightweight state management with `localStorage` persistence and SSR hydration guard.
* **Dual-Tab Architecture:**
  * Tab 1: The Studio (Prompt textarea, active viewport, cached history gallery).
  * Tab 2: The Orchestrator (Dropdowns for Domain, Lighting, Composition, Material, Aspect Ratio, and Brand Color Injector).
