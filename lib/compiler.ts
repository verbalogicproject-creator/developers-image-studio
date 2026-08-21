import { GenerateRequestInput } from "./schema";
import {
  DOMAIN_VOCABULARIES,
  LIGHTING_VOCABULARIES,
  COMPOSITION_VOCABULARIES,
  MATERIAL_VOCABULARIES,
  POST_CATEGORIES,
  ARTISTIC_STYLE_VOCABULARIES,
  TYPOGRAPHY_STYLE_VOCABULARIES,
  TEXT_PLACEMENT_VOCABULARIES,
} from "./constants";

export function compileStudioPrompt(input: GenerateRequestInput): string {
  const pipeline = input.pipelineMode || "ecommerce";

  const brandColorSection = input.brandColor
    ? `<color_direction>
  Primary accent color strictly tuned to chromatic hex value ${input.brandColor}, harmonized into reflections, luminescence, and typographic accents.
</color_direction>`
    : `<color_direction>
  Harmonious high-contrast palette: deep obsidian base with luminescent amber, electric cyan, and clean crisp white accents.
</color_direction>`;

  const exclusionSection =
    input.excludeElements && input.excludeElements.trim().length > 0
      ? `<exclusion_constraints>
  Do not include: ${input.excludeElements.trim()}. No unrequested extra props, illegible text artifacts, watermark-like symbols, visible hands, or human figures unless explicitly defined in the subject concept.
</exclusion_constraints>`
      : `<exclusion_constraints>
  No visible human hands or faces unless explicitly requested, no watermark artifacts, no gibberish typography on surfaces.
</exclusion_constraints>`;

  const inpaintSection =
    input.editMode === "edit"
      ? `<inpainting_edit_directive>
  Perform precise photorealistic modification on the provided reference image. Blend seamless natural lighting, preserve physical contact shadows, and maintain consistent optical resolution across edited regions.
</inpainting_edit_directive>`
      : "";

  // ==========================================
  // BRANCH 1: SOCIAL MEDIA & EDITORIAL PIPELINE
  // ==========================================
  if (pipeline === "social_editorial") {
    const postCategory = input.postCategory || "deep_tech";
    const artisticStyle = input.artisticStyle || "luminescent_particles";
    const typographyStyle = input.typographyStyle || "bold_impact_sans";
    const textPlacement = input.textPlacement || "bottom_third_scrim";
    const badgePosition = input.badgePosition || "top_left";

    const catObj =
      POST_CATEGORIES.find((c) => c.value === postCategory) ||
      POST_CATEGORIES[0];
    const artStyleInfo =
      ARTISTIC_STYLE_VOCABULARIES[artisticStyle] ||
      ARTISTIC_STYLE_VOCABULARIES.luminescent_particles;
    const typoDesc =
      TYPOGRAPHY_STYLE_VOCABULARIES[typographyStyle] ||
      TYPOGRAPHY_STYLE_VOCABULARIES.bold_impact_sans;
    const placeDesc =
      TEXT_PLACEMENT_VOCABULARIES[textPlacement] ||
      TEXT_PLACEMENT_VOCABULARIES.bottom_third_scrim;

    const headline = input.headlineText?.trim() || input.rawPrompt.trim();
    const pubBadge = input.publicationBadge?.trim();
    const author = input.authorBadge?.trim();

    const badgePosStr =
      badgePosition === "top_right" ? "top-right corner" : "top-left corner";

    const badgeLine = pubBadge
      ? `- Publication Badge: Render small, crisp, elegant publication mark "${pubBadge}" in the ${badgePosStr}.`
      : `- Publication Badge: Minimal, sleek publication tag in the ${badgePosStr}.`;

    const authorLine = author
      ? `\n  - Author Attribution Badge: Render small subhead badge "${author}" positioned below the main headline or in the lower margin.`
      : "";

    const compiledSocialPrompt = `<editorial_art_director>
  Elite Visual Journalist and Publication Art Director specialized in viral science, quantum physics, and high-tech social media graphics.
</editorial_art_director>

<subject_concept>
  ${input.rawPrompt.trim()}
</subject_concept>

<editorial_theme>
  Category: ${catObj.label}
  Context: ${catObj.description}
</editorial_theme>

<visual_art_style>
  Preset: ${artStyleInfo.label}
  Directives: ${artStyleInfo.lexicon}
</visual_art_style>

<graphic_design_and_typography>
  ${badgeLine}
  - Primary Headline: Prominently render the exact text "${headline}".
  - Typography Rules: Use ${typoDesc} Lettering must be ultra-sharp, perfectly aligned, high-contrast against the background with zero gibberish or spelling artifacts.
  - Compositional Layout: ${placeDesc}${authorLine}
</graphic_design_and_typography>

${brandColorSection}

${exclusionSection}

${inpaintSection}

<rendering_fidelity>
  8k graphic design publication print quality, crisp vector-like typography integration, cinematic color grading, flawless visual contrast, zero AI artifacting.
</rendering_fidelity>`;

    return compiledSocialPrompt.replace(/\n{3,}/g, "\n\n");
  }

  // ==========================================
  // BRANCH 2: E-COMMERCE & PRODUCT STUDIO
  // ==========================================
  const domain = input.domain || "Skincare";
  const lighting = input.lighting || "Diffused Natural";
  const composition = input.composition || "Macro/Close-up";
  const material = input.material || "Matte/Frosted";

  const domainData = DOMAIN_VOCABULARIES[domain];
  const lightingDetail = LIGHTING_VOCABULARIES[lighting];
  const compositionDetail = COMPOSITION_VOCABULARIES[composition];
  const materialDetail = MATERIAL_VOCABULARIES[material];

  const editorialRules: string[] = [];

  if (input.toggles?.negativeSpace) {
    editorialRules.push(
      "- NEGATIVE SPACE: Off-center rule-of-thirds composition reserving generous, uncluttered negative space on one side with smooth luminance gradient specifically calibrated for advertising copy and typography placement."
    );
  }

  if (input.toggles?.studioIsolation) {
    editorialRules.push(
      "- STUDIO ISOLATION: Subject staged on clean geometric architectural tiered pedestals against a seamless studio infinity cove backdrop with subtle floor gradient shadow falloff."
    );
  }

  if (input.toggles?.naturalContext) {
    editorialRules.push(
      "- NATURAL CONTEXT: Infuse authentic contextual environment, organic textured textile draping (cashmere/soft linen), delicate botanicals, and real-world tactile prop interplay."
    );
  }

  // Label & Typography Control Logic
  let labelSection = "";
  const labelMode = input.labelMode || "none";

  if (input.packagingText && input.packagingText.trim().length > 0) {
    labelSection = `<packaging_typography>
  Render strictly the exact text "${input.packagingText.trim()}" on the primary product label. Do not print descriptive material keywords on the container.
</packaging_typography>`;
  } else if (labelMode === "none") {
    labelSection = `<packaging_typography>
  The product packaging carries NO legible text, logo, or wordmark of any kind — a pristine, blank, frosted, or softly out-of-focus label area only. Do not invent or render any brand name, product name, fake logo, or descriptive copy on the container.
</packaging_typography>`;
  } else if (labelMode === "wordmark") {
    const brand = input.brandName?.trim() || "Calyx";
    labelSection = `<packaging_typography>
  Render strictly and ONLY the exact brand wordmark "${brand}" on the primary product label. Do not invent or render any other text, sub-headers, or descriptive material keywords on the container.
</packaging_typography>`;
  } else if (labelMode === "full") {
    const brand = input.brandName?.trim() || "Calyx";
    const product = input.productName?.trim() || "Bare Barrier Serum";
    const detail = input.productDetail?.trim();
    const detailStr = detail ? `, and volume specification "${detail}"` : "";
    labelSection = `<packaging_typography>
  Render strictly the exact brand name "${brand}", product title "${product}"${detailStr} on the primary product label. Prohibit any additional invented copy, unrequested slogans, or descriptive material keywords on the container.
</packaging_typography>`;
  }

  const compiledEcommercePrompt = `<photographer_persona>
  ${domainData.persona}
</photographer_persona>

<subject_concept>
  ${input.rawPrompt.trim()}
</subject_concept>

<domain_aesthetics>
  Domain: ${domain}
  Atmosphere: ${domainData.environment}
  Luxury Lexicon: ${domainData.lexicon}
</domain_aesthetics>

${labelSection}

<lighting_and_atmosphere>
  Preset: ${lighting}
  Details: ${lightingDetail}
</lighting_and_atmosphere>

<composition_and_framing>
  Framing: ${composition}
  Aspect Ratio: ${input.aspectRatio}
  Technique: ${compositionDetail}
</composition_and_framing>

<material_and_surface_finish>
  Material Quality: ${material}
  Surface Rendering: ${materialDetail}
</material_and_surface_finish>

${brandColorSection}

<editorial_guidelines>
${
  editorialRules.length > 0
    ? editorialRules.join("\n")
    : "- Maintain clean editorial balance and high commercial still-life aesthetics."
}
</editorial_guidelines>

${exclusionSection}

${inpaintSection}

<rendering_fidelity>
  Photorealistic commercial 8k capture, Hasselblad H6D-100c medium format camera aesthetic, clean optical depth of field, authentic micro-textures, zero digital artifacts, true physical light transport.
</rendering_fidelity>`;

  return compiledEcommercePrompt.replace(/\n{3,}/g, "\n\n");
}
