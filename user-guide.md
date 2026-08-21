# User Guide & Practical Operations Manual 📖

Welcome to the **Imagen Nano Banana Image Studio v2** operational manual. This guide walks you through every feature, workflow, and advanced option in the studio.

---

## 📑 Table of Contents
1. [Workflow 1: Commercial E-Commerce Product Studio](#1-workflow-1-commercial-e-commerce-product-studio)
2. [Workflow 2: Viral Social Media & Editorial Post Graphics](#2-workflow-2-viral-social-media--editorial-post-graphics)
3. [Workflow 3: Mobile Touch Inpainting & Image-to-Image](#3-workflow-3-mobile-touch-inpainting--image-to-image)
4. [Workflow 4: Batch Screening & Manifest Export](#4-workflow-4-batch-screening--manifest-export)
5. [Workflow 5: CLI Testing via Termux Terminal (`curl`)](#5-workflow-5-cli-testing-via-termux-terminal-curl)
6. [Best Practices & Troubleshooting](#6-best-practices--troubleshooting)

---

## 1. Workflow 1: Commercial E-Commerce Product Studio

Use this pipeline for pristine, photorealistic product photography (skincare bottles, cosmetics, fine jewelry, wine cellars, SaaS hardware, and organic foods).

```
[ Select: E-Commerce Studio ] ➔ [ Type Concept Prompt ] ➔ [ Set Packaging Text ] ➔ [ Generate with Nano Banana ]
```

### Step-by-Step:
1. **Activate E-Commerce Mode:** At the top of the **Studio** tab, select **"E-Commerce Studio"**.
2. **Enter Your Concept:** In the prompt textarea, describe your subject (e.g. *"Matte white cosmetic tube on folded beige cashmere textile with soft window sunlight"*). Or tap one of the preset chips.
3. **Control Packaging Typography (Crucial for Real Brands):**
   * Enter the exact brand or product text in the **Packaging Typography** field (e.g. `"Calyx / Bare Barrier Serum"`).
   * *Tip:* If you want a clean container ready for post-production graphic design, leave this field empty or set Label Mode to `"Blank / None"` in the Orchestrator.
4. **Tune Directives in the Orchestrator (Optional):**
   * Switch to **The Orchestrator** tab to adjust:
     * **Domain Aesthetic:** Skincare, Fine Jewelry, Heritage Wine, Modern SaaS, Organic Food.
     * **Lighting:** Diffused Natural (soft daylight), Studio Rim, Low-key Moody, Golden Hour (with botanical gobos).
     * **Composition:** Macro/Close-up, Flat lay (knolling), Isometric, Wide Angle.
     * **Material:** Matte/Frosted, High Gloss/Condensation, Textured/Organic.
     * **Brand Color:** Pick or type a hex color (e.g. `#E8DFD8` for warm cashmere or `#D4AF37` for gold).
     * **Toggles:** Turn on *Negative Space for Web Copy* if you need room for website copy.
5. **Generate:** Tap **"Generate with Nano Banana"** (or press `Ctrl+Enter` / `Cmd+Enter`).
6. **Inspect & Download:** View the high-res render in the **Active Viewport**, tap fullscreen to zoom, or tap **Download**.

---

## 2. Workflow 2: Viral Social Media & Editorial Post Graphics

Use this pipeline for high-engagement science publications, thought-leadership carousels, and tech editorial graphics with integrated headlines and publication bugs.

```
[ Select: Social Editorial ] ➔ [ Enter Visual Concept ] ➔ [ Enter Headline Copy ] ➔ [ Enter Publication Bug ] ➔ [ Synthesize ]
```

### Step-by-Step:
1. **Activate Social Editorial Mode:** At the top of the **Studio** tab, select **"Social Editorial"**.
2. **Describe the Visual World:** In the top prompt box, describe the high-concept visual (e.g. *"Glowing golden singularity particle vortex funneling into a quantum spacetime grid with luminescent fiber optics"*).
3. **Set the Exact Headline Text:** In the **Post Headline Copy** textarea, type your exact title (e.g. *"Your Bad Luck Isn't Random — And an Oxford Physicist's Machine Could Help Prove It"*).
4. **Set Publication Bug & Author Subtitle:**
   * **Publication Bug / Tag:** Type your mark (e.g. `"iai news"`, `"POP MECH"`, `"TECH CRUNCH"`).
   * **Author Attribution:** Type your subtitle (e.g. `"Kanji Low • AI Marketing Strategist"`).
5. **Tune Typography & Layout (in Orchestrator):**
   * **Category:** Deep Tech & Particle Physics, Quantum Consciousness, 3D AI Dev Marketing, Pop Science, Infographic Diagram.
   * **Typography Style:** Bold Impact Sans (all-caps punch), Editorial Luxury Serif, Modern Tech Grotesk, Technical Monospace.
   * **Text Placement & Scrim:** Bottom Third (Dark Gradient Scrim - recommended for 100% legibility), Top Header, Split Layout, Integrated Depth.
   * **Visual Art Style:** Luminescent Fiber Optics, Cosmic Synapses, 3D Matte Clay, Technical Blueprint.
   * **Aspect Ratio:** `1:1` (Feed/LinkedIn), `3:4` (Instagram Portrait), `9:16` (Story/Reel).
6. **Synthesize:** Tap **"Synthesize Social Post Visual"**. The model will render the visual scene, lay down the dark contrast scrim, and print the typography with zero gibberish.

---

## 3. Workflow 3: Mobile Touch Inpainting & Image-to-Image

Use this mode when you want to modify a specific part of an existing image (e.g. change a label, add fiber optic threads, replace a prop, or adjust lighting).

```
[ Active Viewport / Gallery ] ➔ [ Tap "Edit in Inpaint" ] ➔ [ Paint Mask with Finger ] ➔ [ Enter Instruction ] ➔ [ Synthesize Inpaint ]
```

### Step-by-Step:
1. **Load an Image into Inpaint:**
   * Tap **"Inpaint / Edit"** at the top of the Studio tab to upload a file from your device, **OR**
   * Tap the **"Edit in Inpaint"** button directly on any render in the **Active Viewport** or **Gallery**.
2. **Paint the Mask:**
   * An interactive HTML5 canvas overlay will appear over your image.
   * Use your finger (or mouse) to paint over the area you wish to alter. The painted area will glow in translucent amber.
   * Adjust the **Size** slider (10px–80px) or toggle the **Eraser** to refine the mask edges.
   * Tap **Clear** if you want to start over.
3. **Enter Inpaint Instructions:**
   * In the prompt textarea, describe what should replace the masked area (e.g. *"Replace packaging label with Calyx wordmark and add soft botanical leaf shadows"*).
4. **Execute Inpaint:** Tap **"Synthesize Inpaint Edit"**. The backend will send both the base image and the binary mask to Gemini Nano Banana 2.

---

## 4. Workflow 4: Batch Screening & Manifest Export

Every generated image is automatically cached in the browser's persistent `localStorage` (retaining up to the last 15 generations).

### Inspecting & Restoring History:
* Tap any card in the **Cached Generation History** strip at the bottom of the Studio tab.
* Tap the **Restore (↺)** icon on any card to instantly reload all its prompts, domain settings, lighting directives, and typography parameters into the Orchestrator.

### Exporting Screening Manifests:
1. At the top of the Studio tab (or in the header banner), tap **"Export Manifest"**.
2. This downloads a `screening-manifest-<timestamp>.json` file formatted as follows:
```json
{
  "project": "Imagen Nano Banana Image Studio v2",
  "pipelineMode": "social_editorial",
  "exportTimestamp": "2026-08-21T22:30:00.000Z",
  "itemsCount": 4,
  "items": [
    {
      "id": "gen-1787333210042",
      "filename": "imagen-banana-editorial-deep_tech-1787333210042.jpg",
      "timestamp": "2026-08-21T20:26:50.000Z",
      "rawPrompt": "Glowing amber particle vortex...",
      "parameters": {
        "pipelineMode": "social_editorial",
        "postCategory": "deep_tech",
        "headlineText": "Your Bad Luck Isn't Random...",
        "publicationBadge": "iai news",
        "typographyStyle": "bold_impact_sans",
        "textPlacement": "bottom_third_scrim"
      },
      "compiledPrompt": "<editorial_art_director>...</editorial_art_director>"
    }
  ]
}
```
This manifest integrates with human screening and asset management pipelines.

---

## 5. Workflow 5: CLI Testing via Termux Terminal (`curl`)

You can execute generations directly from the Termux command line without touching the browser:

1. In the Studio tab, tap the **Info (ℹ️)** button next to *Copy Compiled Prompt* to open the **Prompt Inspector**.
2. Select the **"CLI Curl"** tab.
3. Tap **"Copy curl"**.
4. Switch to your Termux shell and paste the command:
```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "pipelineMode": "social_editorial",
    "postCategory": "deep_tech",
    "rawPrompt": "Glowing golden singularity particle vortex...",
    "headlineText": "Your Bad Luck Isn'\''t Random",
    "publicationBadge": "iai news",
    "typographyStyle": "bold_impact_sans",
    "textPlacement": "bottom_third_scrim",
    "artisticStyle": "luminescent_particles",
    "aspectRatio": "1:1",
    "brandColor": "#F59E0B"
  }'
```
5. The API will return `{ "success": true, "imageData": "<base64_data>", "mimeType": "image/jpeg" }`.

---

## 6. Best Practices & Troubleshooting

* **Preventing AI Typography Hallucinations on Products:** In E-Commerce mode, set `labelMode` to `"none"` if you don't need printed text. Image generators can occasionally hallucinate small filler text; a blank label gives you a clean canvas for adding typography in code or Figma.
* **Ensuring Headline Readability in Social Posts:** Always use the `"bottom_third_scrim"` or `"split_top_bottom"` text placement. This instructs the model to generate a dark gradient scrim behind the text, guaranteeing high contrast.
* **Mobile Touch Inpainting:** The inpaint canvas handles Android device pixel ratios automatically. If you ever experience coordinate offset, zoom out to 100% before painting.
* **Termux Memory Usage:** If you notice Termux running low on RAM, run `npm run build` once and start in production mode (`npm start -- -p 3001`) rather than `npm run dev`, as Next.js production builds use significantly less memory.
