import { GenerateRequestInput } from "./schema";
import {
  DOMAIN_VOCABULARIES,
  LIGHTING_VOCABULARIES,
  COMPOSITION_VOCABULARIES,
  MATERIAL_VOCABULARIES,
} from "./constants";

export function compileStudioPrompt(input: GenerateRequestInput): string {
  const domainData = DOMAIN_VOCABULARIES[input.domain];
  const lightingDetail = LIGHTING_VOCABULARIES[input.lighting];
  const compositionDetail = COMPOSITION_VOCABULARIES[input.composition];
  const materialDetail = MATERIAL_VOCABULARIES[input.material];

  const editorialRules: string[] = [];

  if (input.toggles.negativeSpace) {
    editorialRules.push(
      "- NEGATIVE SPACE: Off-center rule-of-thirds composition reserving generous, uncluttered negative space on one side with smooth luminance gradient specifically calibrated for advertising copy and typography placement."
    );
  }

  if (input.toggles.studioIsolation) {
    editorialRules.push(
      "- STUDIO ISOLATION: Subject staged on clean geometric architectural tiered pedestals against a seamless studio infinity cove backdrop with subtle floor gradient shadow falloff."
    );
  }

  if (input.toggles.naturalContext) {
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

  const brandColorSection = input.brandColor
    ? `<color_direction>
  Primary brand accent color strictly tuned to chromatic hex value ${input.brandColor}, subtly harmonized into packaging accents, lighting reflections, or subtle surface gradients.
</color_direction>`
    : `<color_direction>
  Harmonious organic luxury palette: warm cashmere ecru, champagne gold, soft sand, and pristine porcelain neutrals.
</color_direction>`;

  const exclusionSection = input.excludeElements && input.excludeElements.trim().length > 0
    ? `<exclusion_constraints>
  Do not include: ${input.excludeElements.trim()}. No unrequested extra props, illegible text artifacts, watermark-like symbols, visible hands, or human figures unless explicitly defined in the subject concept.
</exclusion_constraints>`
    : `<exclusion_constraints>
  No visible human hands or faces unless explicitly requested, no watermark artifacts, no gibberish typography on surfaces.
</exclusion_constraints>`;

  const inpaintSection = input.editMode === "edit"
    ? `<inpainting_edit_directive>
  Perform precise photorealistic modification on the provided reference image. Blend seamless natural lighting, preserve physical contact shadows, and maintain consistent optical resolution across edited regions.
</inpainting_edit_directive>`
    : "";

  const compiledPrompt = `<photographer_persona>
  ${domainData.persona}
</photographer_persona>

<subject_concept>
  ${input.rawPrompt.trim()}
</subject_concept>

<domain_aesthetics>
  Domain: ${input.domain}
  Atmosphere: ${domainData.environment}
  Luxury Lexicon: ${domainData.lexicon}
</domain_aesthetics>

${labelSection}

<lighting_and_atmosphere>
  Preset: ${input.lighting}
  Details: ${lightingDetail}
</lighting_and_atmosphere>

<composition_and_framing>
  Framing: ${input.composition}
  Aspect Ratio: ${input.aspectRatio}
  Technique: ${compositionDetail}
</composition_and_framing>

<material_and_surface_finish>
  Material Quality: ${input.material}
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

  return compiledPrompt.replace(/\n{3,}/g, "\n\n");
}
