# Imagen Nano Banana Image Studio v2 🍌✨

An elite visual context injection and prompt orchestration frontend engineered for **Google Gemini 3.1 Flash Image (`gemini-3.1-flash-image`) Nano Banana 2**. Tailored for high-end luxury photorealism (minimalist cosmetics, fine jewelry, heritage wine cellars, modern SaaS interfaces, and organic culinary scenes) and optimized for low-resource Termux/Android and web environments.

---

## 💎 Features

* **Visual Context Prompt Compiler (`lib/compiler.ts`)**: Synthesizes natural-language ideas into structured XML tags with domain lexicons, camera personas, lighting directions, composition parameters, and material overrides.
* **The Studio Tab (`components/StudioTab.tsx`)**: Minimalist prompt input, sample inspiration chips, full active viewport, aspect-ratio frame, zoom lightbox, and download utility.
* **The Orchestrator GUI (`components/OrchestratorTab.tsx`)**:
  * **Domain Aesthetics:** Skincare, Fine Jewelry, Heritage Wine, Modern SaaS, Organic Food.
  * **Lighting Directives:** Diffused Natural, Studio Rim, Low-key Moody, Golden Hour.
  * **Composition Framing:** Macro/Close-up, Flat lay, Isometric, Wide Angle.
  * **Material Overrides:** Matte/Frosted, High Gloss/Condensation, Textured/Organic.
  * **Aspect Ratio:** 1:1, 3:4, 4:3, 9:16, 16:9 (bound 1:1 to API).
  * **Brand Color Injector:** Custom hex picker with luxury preset swatches.
  * **Scene Toggles:** Negative Space for Web Copy, Studio Isolation, Natural Context.
* **Dual-Mode Prompt Utility (`components/PromptPreview.tsx`)**: Instant preview of compiled XML prompts and one-click copy of ready-to-run CLI `curl` commands.
* **Local Caching Gallery (`components/Gallery.tsx`)**: Persistent storage retaining previous generations and parameters with one-click restore.
* **Mobile & Termux Optimized**: Lightweight bundle, zero runtime bloat, persistent `localStorage` synchronization via Zustand, and touch-friendly 44px targets.

---

## 🚀 Quick Start

### 1. Configure Environment
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
# or specify port:
npm run dev -- -p 3001
```

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🛠 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Luxury Dark Mode)
* **State Management:** Zustand with `persist` middleware
* **Validation:** Zod
* **AI Model:** `@google/genai` Node SDK targeting `gemini-3.1-flash-image`
