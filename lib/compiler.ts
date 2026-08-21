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

  const brandColorSection = input.brandColor
    ? `<color_direction>
  Primary brand accent color strictly tuned to chromatic hex value ${input.brandColor}, subtly harmonized into packaging accents, lighting reflections, or subtle surface gradients.
</color_direction>`
    : `<color_direction>
  Harmonious organic luxury palette: warm cashmere ecru, champagne gold, soft sand, and pristine porcelain neutrals.
</color_direction>`;

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

<rendering_fidelity>
  Photorealistic commercial 8k capture, Hasselblad H6D-100c medium format camera aesthetic, clean optical depth of field, authentic micro-textures, zero digital artifacts, true physical light transport.
</rendering_fidelity>`;

  return compiledPrompt;
}
