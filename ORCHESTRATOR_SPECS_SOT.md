# Image-Studio Orchestrator SPECS & APIs Design Single Source of Truth (SOT) 📐

An authoritative, comprehensive architectural specification and synchronization contract for the **Imagen Nano Banana Image Studio v2** Orchestrator, Studio components, Visual Context Prompt Compiler, Zustand store, and Next.js backend API.

---

## 📑 Table of Contents
1. [Core Architectural Contract & Purpose](#1-core-architectural-contract--purpose)
2. [Full System Dataflow & Component Architecture](#2-full-system-dataflow--component-architecture)
3. [The 10-Layer Synchronization Matrix](#3-the-10-layer-synchronization-matrix)
4. [Master Pipeline Specifications & XML Tag Mapping](#4-master-pipeline-specifications--xml-tag-mapping)
5. [Complete Type & Zod Schema Reference](#5-complete-type--zod-schema-reference)
6. [Step-by-Step Recipe: Adding a New Orchestrator Parameter](#6-step-by-step-recipe-adding-a-new-orchestrator-parameter)
7. [Inpainting & Canvas Mask Invariants](#7-inpainting--canvas-mask-invariants)
8. [Next.js API Contract & Error Protocols](#8-nextjs-api-contract--error-protocols)
9. [Local Memory OS Integration & GraphRAG Relations](#9-local-memory-os-integration--graphrag-relations)

---

## 1. Core Architectural Contract & Purpose

The Orchestrator is the **master control plane** for visual prompt synthesis and image generation. It is not an isolated UI form. Every control in the Orchestrator directly influences:
1. **Prompt Compiler Output (`lib/compiler.ts`)** — Structured XML tags ingested by `gemini-3.1-flash-image`.
2. **Client State Persistence (`lib/store.ts`)** — Zustand store saved to `localStorage`.
3. **Studio Viewport & Actions (`components/StudioTab.tsx`)** — Active badges, quick chips, and live generation.
4. **Historical Provenance (`components/Gallery.tsx`)** — Parameter restoration and download manifests.
5. **Backend Validation (`app/api/generate/route.ts` & `lib/schema.ts`)** — Strict Zod schema parsing.
6. **Local Project Memory OS (`memory/`)** — Experiential run logging and GraphRAG relations.

> [!IMPORTANT]
> **The Synchronization Invariant:**
> To prevent state drift, compiler breakage, or silent drop of parameters during history restoration, **any upgrade to the Orchestrator MUST be executed across all 10 layers synchronously**. Never add a field to the UI without updating the Types, Zod Schema, Store, Compiler, and Gallery restore bridges!

---

## 2. Full System Dataflow & Component Architecture

```
                                  USER INTERACTION
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
       [ OrchestratorTab.tsx ]                           [ StudioTab.tsx ]
     • Master Pipeline Switcher                        • Master Pipeline Switcher
     • Domain / Post Category                          • Prompt / Headline Inputs
     • Lighting / Atmosphere                           • Publication & Author Badges
     • Packaging Typography / Copy                     • Active Viewport & Inpainting
     • Negative Space / Studio Toggles                 • Quick Science Preset Chips
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                             [ Zustand Store (lib/store.ts) ]
                                • Active Parameters
                                • LocalStorage Persistence (partialize)
                                • Gallery State (Max 15 items)
                                         │
                                         ▼
                     [ Prompt Compiler Engine (lib/compiler.ts) ]
                                • XML Tag Synthesis
                                • Vocabulary & Lexicon Ingestion
                                • Strict Negative Prompt Injection
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
       [ PromptPreview.tsx ]                           [ POST /api/generate ]
     • Live XML Inspector                            • Zod Schema Validation (lib/schema.ts)
     • Terminal curl Generator                       • @google/genai Node SDK Call
                                                     • Model: gemini-3.1-flash-image
                                                                 │
                                                                 ▼
                                                  [ Background Memory Ingestion ]
                                                     • MemoryEngine.ingestGenerationMemory
                                                     • SQLite Float32 Vector BLOB (768d)
```

---

## 3. The 10-Layer Synchronization Matrix

Whenever an engineer or AI agent adds, modifies, or deprecates an Orchestrator field, the following 10 files **MUST** be updated in unison:

| Layer # | File Path | Required Changes | Failure Mode if Missed |
| :--- | :--- | :--- | :--- |
| **1. Types** | [`types/index.ts`](file:///root/image-studio/types/index.ts) | • Add type union (e.g. `export type LensType = ...`)<br/>• Add key to `OrchestratorState`<br/>• Add key to `GenerationItem.parameters`<br/>• Add key to `GenerateApiRequest` | TypeScript compiler error; missing parameter types. |
| **2. Schema** | [`lib/schema.ts`](file:///root/image-studio/lib/schema.ts) | • Add field to `GenerateRequestSchema` with `.default()` and `.optional()` validation | API throws `400 Bad Request: Invalid payload`. |
| **3. Constants** | [`lib/constants.ts`](file:///root/image-studio/lib/constants.ts) | • Declare options array for dropdowns<br/>• Map descriptive vocabulary and lighting/lens lexicons | UI displays raw strings; compiler emits empty tags. |
| **4. Store** | [`lib/store.ts`](file:///root/image-studio/lib/store.ts) | • Add key to `StudioStoreState`<br/>• Add action setter (e.g. `setLensType`)<br/>• Add initial default value<br/>• Add to `partialize` array for `localStorage`<br/>• Add to `loadParameters(item)` for history restoration | State resets on refresh; history restore drops parameter. |
| **5. Compiler** | [`lib/compiler.ts`](file:///root/image-studio/lib/compiler.ts) | • Extract parameter from `input`<br/>• Synthesize dedicated XML block (e.g. `<lens_and_optics>`)<br/>• Branch logic for E-Commerce vs Social Editorial | Field appears in UI but has zero effect on AI generation. |
| **6. Orchestrator UI** | [`components/OrchestratorTab.tsx`](file:///root/image-studio/components/OrchestratorTab.tsx) | • Bind UI select/input to `useStudioStore`<br/>• Add helper text and active styling | Feature is inaccessible to users in Orchestrator GUI. |
| **7. Studio UI** | [`components/StudioTab.tsx`](file:///root/image-studio/components/StudioTab.tsx) | • Render parameter badge in active viewport footer<br/>• Provide quick-preset chip if applicable | User cannot see active parameter during generation in Studio. |
| **8. Prompt Preview** | [`components/PromptPreview.tsx`](file:///root/image-studio/components/PromptPreview.tsx) | • Verify XML tag renders in live inspector<br/>• Include parameter in generated CLI `curl` JSON payload string | Copied `curl` command differs from GUI execution. |
| **9. Gallery** | [`components/Gallery.tsx`](file:///root/image-studio/components/Gallery.tsx) | • Render parameter tag/badge on history cards | History card lacks context; user cannot differentiate past runs. |
| **10. Memory & Arch** | [`image-studio.architecture.ctx`](file:///root/image-studio/image-studio.architecture.ctx) | • Add `@relation OrchestratorTab controls <Parameter>`<br/>• Re-index memory via `npm run memory -- index` | AI agent loses architectural awareness of the relation. |

---

## 4. Master Pipeline Specifications & XML Tag Mapping

The application operates in two distinct, non-overlapping pipelines controlled by `pipelineMode`:

### Branch 1: Commercial E-Commerce Studio (`pipelineMode: 'ecommerce'`)
* **Target Audience:** Luxury packaging, cosmetic serums, fine jewelry, heritage wines, and SaaS products.
* **Persona Injected:** Elite Commercial Advertising Still-Life Photographer (`<photographer_persona>`).

```
State Key                Type / Enum Values                          Compiled XML Output Tag
─────────────────────────────────────────────────────────────────────────────────────────────
domain                   Skincare | Fine Jewelry | Heritage Wine |   <domain_aesthetics>
                         Modern SaaS | Organic Food                  (Includes persona, environment & lexicon)

lighting                 Diffused Natural | Studio Rim |             <lighting_and_atmosphere>
                         Low-key Moody | Golden Hour                 (Rich multi-point studio setup)

composition              Macro/Close-up | Flat lay |                 <composition_and_framing>
                         Isometric | Wide Angle                      (Framing, camera angle & depth)

material                 Matte/Frosted | High Gloss/Condensation |   <material_and_surface_finish>
                         Textured/Organic                            (Physical light transport & refraction)

brandColor               Hex string (#RRGGBB)                        <color_direction>
                                                                     (Strict chromatic accent tuning)

excludeElements          string (comma-separated constraints)        <exclusion_constraints>
                                                                     (Negative prompt constraints)

toggles.negativeSpace    boolean                                     <editorial_guidelines>
                                                                     (- NEGATIVE SPACE: Rule-of-thirds)

toggles.studioIsolation  boolean                                     <editorial_guidelines>
                                                                     (- STUDIO ISOLATION: Infinity cove)

toggles.naturalContext   boolean                                     <editorial_guidelines>
                                                                     (- NATURAL CONTEXT: Tactile draping)

labelMode                none | wordmark | full | custom             <packaging_typography>
packagingText            string                                      (Pristine blank vs strict exact label)

rawPrompt                string                                      <subject_concept>
aspectRatio              1:1 | 3:4 | 4:3 | 9:16 | 16:9               <composition_and_framing> + API config
editMode                 generate | edit                             <inpainting_edit_directive>
─────────────────────────────────────────────────────────────────────────────────────────────
```

### Branch 2: Social Editorial Post Engine (`pipelineMode: 'social_editorial'`)
* **Target Audience:** High-engagement science journalism, quantum physics, AI thought leadership, and infographics.
* **Persona Injected:** Elite Visual Journalist & Publication Art Director (`<editorial_art_director>`).

```
State Key                Type / Enum Values                          Compiled XML Output Tag
─────────────────────────────────────────────────────────────────────────────────────────────
postCategory             deep_tech | quantum_cosmology |             <editorial_theme>
                         ai_dev_marketing | pop_science |            (Theme context & journalistic tone)
                         infographic_diagram

artisticStyle            luminescent_particles | cosmic_synapses |   <visual_art_style>
                         3d_matte_clay | scientific_schematic        (Artistic rendering directives)

typographyStyle          bold_impact_sans | editorial_luxury_serif | <graphic_design_and_typography>
                         clean_tech_grotesk | diagram_mono           (Typography rules & letter alignment)

textPlacement            bottom_third_scrim | top_header_clean |     <graphic_design_and_typography>
                         split_top_bottom | integrated_billboard     (Layout, scrim gradients & positioning)

headlineText             string (Primary hook headline copy)         <graphic_design_and_typography>
                                                                     (- Primary Headline: "{headlineText}")

publicationBadge         string (e.g. "iai news", "WIRED")           <graphic_design_and_typography>
badgePosition            top_left | top_right                        (- Publication Badge in corner)

authorBadge              string (e.g. "Dr. Kanji • AI Marketing")    <graphic_design_and_typography>
                                                                     (- Author Attribution Badge)

brandColor               Hex string (#RRGGBB)                        <color_direction>
excludeElements          string                                      <exclusion_constraints>
rawPrompt                string                                      <subject_concept>
aspectRatio              1:1 | 3:4 | 4:3 | 9:16 | 16:9               API imageConfig.aspectRatio
editMode                 generate | edit                             <inpainting_edit_directive>
─────────────────────────────────────────────────────────────────────────────────────────────
```

---

## 5. Complete Type & Zod Schema Reference

### Core TypeScript Interface (`types/index.ts`):
```typescript
export interface OrchestratorState {
  pipelineMode: "ecommerce" | "social_editorial";
  rawPrompt: string;
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  brandColor: string;
  excludeElements: string;

  // E-Commerce
  domain: "Skincare" | "Fine Jewelry" | "Heritage Wine" | "Modern SaaS" | "Organic Food";
  lighting: "Diffused Natural" | "Studio Rim" | "Low-key Moody" | "Golden Hour";
  composition: "Macro/Close-up" | "Flat lay" | "Isometric" | "Wide Angle";
  material: "Matte/Frosted" | "High Gloss/Condensation" | "Textured/Organic";
  labelMode: "none" | "wordmark" | "full" | "custom";
  brandName: string;
  productName: string;
  productDetail: string;
  packagingText: string;
  toggles: {
    negativeSpace: boolean;
    studioIsolation: boolean;
    naturalContext: boolean;
  };

  // Social Editorial
  postCategory: "deep_tech" | "quantum_cosmology" | "ai_dev_marketing" | "pop_science" | "infographic_diagram";
  headlineText: string;
  publicationBadge: string;
  badgePosition: "top_left" | "top_right";
  authorBadge: string;
  typographyStyle: "bold_impact_sans" | "editorial_luxury_serif" | "clean_tech_grotesk" | "diagram_mono";
  textPlacement: "bottom_third_scrim" | "top_header_clean" | "split_top_bottom" | "integrated_billboard";
  artisticStyle: "luminescent_particles" | "cosmic_synapses" | "3d_matte_clay" | "scientific_schematic";
}
```

### Zod Validation Schema (`lib/schema.ts`):
```typescript
export const GenerateRequestSchema = z.object({
  pipelineMode: z.enum(["ecommerce", "social_editorial"]).default("ecommerce").optional(),
  rawPrompt: z.string().min(1).max(3000),
  aspectRatio: z.enum(["1:1", "3:4", "4:3", "9:16", "16:9"]).default("1:1"),
  brandColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional().or(z.literal("")),
  excludeElements: z.string().optional().default(""),
  numberOfImages: z.number().int().min(1).max(4).default(1).optional(),

  // Inpaint / Img2Img
  editMode: z.enum(["generate", "edit"]).default("generate").optional(),
  baseImage: z.string().nullable().optional(),
  baseImageMimeType: z.string().optional(),
  maskImage: z.string().nullable().optional(),

  // E-Commerce
  domain: z.enum(["Skincare", "Fine Jewelry", "Heritage Wine", "Modern SaaS", "Organic Food"]).default("Skincare").optional(),
  lighting: z.enum(["Diffused Natural", "Studio Rim", "Low-key Moody", "Golden Hour"]).default("Diffused Natural").optional(),
  composition: z.enum(["Macro/Close-up", "Flat lay", "Isometric", "Wide Angle"]).default("Macro/Close-up").optional(),
  material: z.enum(["Matte/Frosted", "High Gloss/Condensation", "Textured/Organic"]).default("Matte/Frosted").optional(),
  labelMode: z.enum(["none", "wordmark", "full", "custom"]).default("none").optional(),
  brandName: z.string().optional().default(""),
  productName: z.string().optional().default(""),
  productDetail: z.string().optional().default(""),
  packagingText: z.string().optional().default(""),
  toggles: OrchestratorTogglesSchema.default({
    negativeSpace: false,
    studioIsolation: false,
    naturalContext: false,
  }).optional(),

  // Social Editorial
  postCategory: z.enum(["deep_tech", "quantum_cosmology", "ai_dev_marketing", "pop_science", "infographic_diagram"]).default("deep_tech").optional(),
  headlineText: z.string().optional().default(""),
  publicationBadge: z.string().optional().default(""),
  badgePosition: z.enum(["top_left", "top_right"]).default("top_left").optional(),
  authorBadge: z.string().optional().default(""),
  typographyStyle: z.enum(["bold_impact_sans", "editorial_luxury_serif", "clean_tech_grotesk", "diagram_mono"]).default("bold_impact_sans").optional(),
  textPlacement: z.enum(["bottom_third_scrim", "top_header_clean", "split_top_bottom", "integrated_billboard"]).default("bottom_third_scrim").optional(),
  artisticStyle: z.enum(["luminescent_particles", "cosmic_synapses", "3d_matte_clay", "scientific_schematic"]).default("luminescent_particles").optional(),
});
```

---

## 6. Step-by-Step Recipe: Adding a New Orchestrator Parameter

Follow this exact 10-step protocol to add a new parameter (e.g. `cameraLens`):

### Step 1: Declare Types in `types/index.ts`
```typescript
export type CameraLensOption = "50mm Prime" | "85mm Portrait" | "100mm Macro" | "24mm Architectural";

// Add to OrchestratorState
export interface OrchestratorState {
  // ...
  cameraLens: CameraLensOption;
}

// Add to GenerationItem.parameters & GenerateApiRequest
```

### Step 2: Add Zod Validation in `lib/schema.ts`
```typescript
export const GenerateRequestSchema = z.object({
  // ...
  cameraLens: z.enum(["50mm Prime", "85mm Portrait", "100mm Macro", "24mm Architectural"]).default("100mm Macro").optional(),
});
```

### Step 3: Define Vocabularies in `lib/constants.ts`
```typescript
export const CAMERA_LENS_OPTIONS: Array<{ value: CameraLensOption; label: string; description: string }> = [ ... ];
export const CAMERA_LENS_VOCABULARIES: Record<CameraLensOption, string> = { ... };
```

### Step 4: Add Store Key & Setters in `lib/store.ts`
```typescript
// Add to state interface, initial state, partialize array, and loadParameters
cameraLens: "100mm Macro",
setCameraLens: (cameraLens) => set({ cameraLens }),
```

### Step 5: Update Visual Context Compiler in `lib/compiler.ts`
```typescript
// Synthesize XML block
const lensDetail = CAMERA_LENS_VOCABULARIES[input.cameraLens || "100mm Macro"];
const lensTag = `<optical_lens_directive>\n  Focal Length: ${input.cameraLens}\n  Optical Characteristics: ${lensDetail}\n</optical_lens_directive>`;
```

### Step 6: Render Control in `components/OrchestratorTab.tsx`
Add a `<Select>` dropdown or button group bound to `store.cameraLens` and `store.setCameraLens`.

### Step 7: Render Indicator in `components/StudioTab.tsx`
Add the parameter badge into the footer of the Studio Tab viewport.

### Step 8: Verify Live Inspector in `components/PromptPreview.tsx`
Ensure the XML tag appears in the live prompt inspector and in the CLI `curl` command.

### Step 9: Render History Tag in `components/Gallery.tsx`
Display a small badge on historical generation cards so the user knows what setting was used.

### Step 10: Register Graph Relation in `image-studio.architecture.ctx`
```ctx
@relation OrchestratorTab controls CameraLensDirective (weight=1.3)
```
Run `npm run memory -- index` to refresh the semantic memory OS.

---

## 7. Inpainting & Canvas Mask Invariants

* **Touch Coordinate Normalization:**
  Always scale touch pointer coordinates against the true internal canvas resolution:
  $$\text{scaleX} = \frac{\text{canvas.width}}{\text{rect.width}}, \quad \text{scaleY} = \frac{\text{canvas.height}}{\text{rect.height}}$$
  $$X_{\text{canvas}} = (X_{\text{touch}} - \text{rect.left}) \times \text{scaleX}$$
  $$Y_{\text{canvas}} = (Y_{\text{touch}} - \text{rect.top}) \times \text{scaleY}$$
* **Binary Mask Encoding:**
  The mask must be exported as pure black background (`#000000`) with pure white brush strokes (`#FFFFFF`) in `image/png` format.
* **State Bridge:**
  Clicking "Inpaint / Modify" in the Gallery automatically sets `editMode = 'edit'`, sets `baseImage = item.imageData`, and switches the UI to `StudioTab`.

---

## 8. Next.js API Contract & Error Protocols

### Request Endpoint: `POST /api/generate`
* **Content-Type:** `application/json`
* **Payload:** Strict JSON matching `GenerateRequestSchema`.

### Response Contract:
```typescript
export interface GenerateApiResponse {
  success: boolean;
  imageData?: string;       // Clean Base64 string without data: prefix
  mimeType?: string;        // "image/jpeg" | "image/png"
  compiledPrompt?: string;  // The compiled XML prompt sent to Gemini
  error?: string;           // Descriptive error message if failed
}
```

### HTTP Status Code Protocol:
* `200 OK`: Successful generation. Base64 image returned.
* `400 Bad Request`: Payload validation failed against `GenerateRequestSchema`.
* `422 Unprocessable Entity`: Model returned text feedback or safety refusal instead of image data.
* `500 Internal Server Error`: Missing `GEMINI_API_KEY` or runtime SDK exception.
* `502 Bad Gateway`: Model response candidate was empty or unparseable.

---

## 9. Local Memory OS Integration & GraphRAG Relations

Whenever an image is generated, `app/api/generate/route.ts` creates an experiential memory record asynchronously via `MemoryEngine.ingestGenerationMemory(...)`.

### Authoritative Architecture Graph Edges:
```
OrchestratorTab      --(controls)-->   MasterPipeline
OrchestratorTab      --(controls)-->   LightingDirective
OrchestratorTab      --(controls)-->   CompositionFraming
OrchestratorTab      --(controls)-->   PackagingTypography
OrchestratorTab      --(controls)-->   SocialEditorialTheme

StudioTab            --(renders)-->    ActiveViewport
StudioTab            --(triggers)-->   PromptCompiler
StudioTab            --(calls)-->      GenerateApiRoute

PromptCompiler       --(produces)-->   CompiledPrompt
GenerateApiRoute     --(calls)-->      GeminiNanoBanana
GeminiNanoBanana     --(produces)-->   GeneratedImageData

Gallery              --(persists)-->   GenerationRecord
Gallery              --(bridges_to)--> CanvasMask
CanvasMask           --(produces)-->   BinaryMask

MemoryEngine         --(indexes)-->    SourceMemory
MemoryEngine         --(indexes)-->    ArchitecturalMemory
MemoryEngine         --(indexes)-->    ExperientialMemory
```

To inspect or query these architectural specifications at any time:
```bash
# Natural language search via CLI
npm run memory -- search "How to add a new parameter to Orchestrator"

# Graph relations inspection
npm run memory -- graph
```
