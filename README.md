# Imagen Nano Banana Image Studio v2 🍌✨

An elite, high-performance visual context orchestration engine and prompt compiler engineered for **Google Gemini 3.1 Flash Image (`gemini-3.1-flash-image`) Nano Banana 2**. Designed for high-end luxury e-commerce aesthetics and viral science/tech social media editorial posts, optimized specifically for local Termux/Android and web environments.

---

## 🧭 System Overview & Architecture

The application operates as a **Dual-Pipeline Visual Generation Engine** managed by a unified Next.js App Router and Zustand persistent state architecture.

```
                  ┌────────────────────────────────────────┐
                  │ Master Mode: Pipeline Selector Switch  │
                  └───────────────────┬────────────────────┘
                                      │
         ┌────────────────────────────┴────────────────────────────┐
         ▼                                                         ▼
┌─────────────────────────────────┐       ┌──────────────────────────────────────┐
│ Pipeline #1: E-Commerce Studio  │       │ Pipeline #2: Social & Editorial Post │
├─────────────────────────────────┤       ├──────────────────────────────────────┤
│ • Domains: Skincare, Wine, SaaS │       │ • Categories: Deep Tech, Quantum...  │
│ • Materials: Frosted, Gloss...  │       │ • Layout: Bottom Scrim, Split, Bug   │
│ • Packaging Typography & Label  │       │ • Headline & Author Attribution      │
│ • Isolation / Studio Pedestal   │       │ • Typography Vibe: Bold Sans / Serif │
│ • Negative Space for Web Copy   │       │ • Visual Style: Fiber Optics, Synapse│
└─────────────────────────────────┘       └──────────────────────────────────────┘
```

---

## 💎 Core Feature Matrix

### 1. Dual-Pipeline Visual Directives
* **E-Commerce & Product Studio Pipeline:**
  * **5 Commercial Domains:** Skincare, Fine Jewelry, Heritage Wine, Modern SaaS, Organic Food.
  * **4 Lighting Setups:** Diffused Natural, Studio Rim, Low-key Moody, Golden Hour (with botanical branch gobos).
  * **4 Camera Framing Styles:** Macro/Close-up, Flat lay (90° knolling), Isometric (30° architectural), Wide Angle.
  * **3 Surface Textures:** Matte/Frosted, High Gloss/Condensation, Textured/Organic.
  * **Label & Typography Control:** Blank/None (safest for post-type), Brand Wordmark, Full Label (Brand + Product + Volume), Custom Text.
  * **Editorial Toggles:** Rule-of-thirds negative space for web typography, studio isolation cove, natural context fabric draping.
* **Social Media & Editorial Post Engine:**
  * **5 Post Categories:** Deep Tech & Particle Physics, Quantum Consciousness & Singularity, 3D AI & Developer Marketing, Provocative Pop Science, Diagrammatic & Infographic Narratives.
  * **Integrated Graphic Design:** Primary hook headline copy, publication mark/bug with corner placement, author attribution subtitle.
  * **Typography Vibe:** Bold Impact Sans (all-caps punch), Editorial Luxury Serif, Modern Tech Grotesk, Technical Monospace.
  * **Scrim Layouts:** Bottom Third (dark gradient scrim), Top Header Banner, Split Layout, Integrated Depth Billboard.
  * **Visual Art Styles:** Luminescent Fiber Optics & Caustics, Cosmic Synapses & Neural Nebulae, 3D Matte Clay & Neon Hologram, Technical Scientific Blueprint.

### 2. Image-to-Image & Mobile Canvas Inpainting
* **Touch-Friendly HTML5 Canvas Mask Overlay:** Optimized for Android touchscreen pointer events (`onTouchStart`, `onTouchMove`, `onTouchEnd`) with zero touch drift.
* **Inpaint Controls:** Glowing translucent amber mask overlay, brush size slider (10px–80px), eraser, and instant binary mask generation.
* **Gallery Inpaint Bridge:** Send any previous generation directly into the inpainting canvas with one tap.

### 3. Provenance & Screening Tools
* **Live Injected XML Prompt Preview:** Live inspection of structured prompt compilation.
* **CLI `curl` Generator:** One-click copy of ready-to-run curl commands for terminal testing in Termux.
* **Screening Manifest Export:** Download `screening-manifest-*.json` alongside generated image batches containing prompts, parameters, and timestamps for human screening workflows.
* **Persistent Local Gallery:** Preserves the last 15 generations in `localStorage` across app restarts with one-click parameter restoration.

---

## 🛠 Tech Stack & Constraints

* **Framework:** Next.js (App Router, Turbopack ready)
* **Language:** TypeScript 5.7+ (Strict Mode)
* **Styling:** Tailwind CSS (Custom Studio Obsidian Dark Theme with Amber Glow accents)
* **State Management:** Zustand 5.0 with `persist` middleware and hydration safety
* **Validation:** Zod 3.24+
* **AI Model:** Google Gen AI Node SDK (`@google/genai`) targeting `gemini-3.1-flash-image` (Nano Banana 2)
* **Environment:** Optimized for Termux/Android, low CPU/RAM footprint, zero dependency bloat

---

## 🚀 Quick Start Guide

### 1. Configure Environment Variables
Create `/root/image-studio/.env.local` containing your Google Gemini API key:
```env
GEMINI_API_KEY=AIzaSy...
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development / Production Server
```bash
# Production build & run (Recommended for Termux stability)
npm run build
npm start -- -p 3001

# Or run development server
npm run dev -- -p 3001
```

Access the studio at `http://localhost:3001` or via local network on Android at `http://<device-ip>:3001`.

---

## 📁 Repository Directory Structure

```
/root/image-studio/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # Backend API route executing gemini-3.1-flash-image via @google/genai
│   ├── globals.css               # Luxury dark studio theme & sleek scrollbar styling
│   ├── layout.tsx                # Root layout with dark mode metadata
│   └── page.tsx                  # Client entry with hydration safety & tab switching
├── components/
│   ├── ui/
│   │   ├── Button.tsx            # Polished tactile button component with loading spinner
│   │   ├── Select.tsx            # Custom styled chevron select dropdown
│   │   └── ToggleSwitch.tsx      # Smooth animated toggle switch
│   ├── CanvasMask.tsx            # Touch-optimized HTML5 Canvas inpainting overlay
│   ├── ColorPickerInput.tsx      # Hex input with swatch preview and luxury palette presets
│   ├── Gallery.tsx               # Local-cached gallery strip with restore & download actions
│   ├── Header.tsx                # Branding header, model target badge, and tab navigation
│   ├── OrchestratorTab.tsx       # Master Pipeline GUI (E-Commerce vs Social Editorial controls)
│   ├── PromptPreview.tsx         # Live compiled XML prompt viewer & CLI curl copier
│   └── StudioTab.tsx             # Dual-pipeline prompt & copywriting input, viewport, and actions
├── lib/
│   ├── compiler.ts               # Visual Context Prompt Compiler Engine (XML tag synthesis)
│   ├── constants.ts              # Luxury domain vocabularies, social art presets, and lexicons
│   ├── schema.ts                 # Zod validation schemas for API and client requests
│   └── store.ts                  # Zustand state store with localStorage persistence
├── types/
│   └── index.ts                  # TypeScript interfaces, enums, and API contracts
├── architecture.mmd              # Complete Mermaid visual dataflow and architecture graph
├── project-state.yaml            # Machine-readable knowledge graph for cold-start AI agents
├── user-guide.md                 # Complete manual for E-Commerce, Social Post, and Inpainting workflows
├── CHANGELOG.md                  # Evolution audit log
└── package.json                  # Dependencies and scripts
```

---

## 🔒 Critical Invariants (Do Not Break)

1. **Target Model:** Always target `gemini-3.1-flash-image` (Nano Banana 2) via `ai.models.generateContent` with `responseModalities: ["IMAGE"]`.
2. **Response Parsing:** Extract base64 image data exclusively from `response.candidates[0].content.parts[0].inlineData.data`.
3. **Hydration Safety:** Always use `mounted` verification in `app/page.tsx` before rendering Zustand `localStorage` hydrated state.
4. **Canvas Coordinate Math:** Always scale canvas pointer coordinates via `scaleX = canvas.width / rect.width` and `scaleY = canvas.height / rect.height` to prevent touch drift on high-DPI mobile devices.
