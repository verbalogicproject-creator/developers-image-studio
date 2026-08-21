import {
  DomainOption,
  LightingOption,
  CompositionOption,
  MaterialOption,
  AspectRatioOption,
  PostCategory,
  TypographyStyle,
  TextPlacement,
  ArtisticStyle,
  BadgePosition,
} from "@/types";

// ==========================================
// E-COMMERCE & PRODUCT STUDIO CONSTANTS
// ==========================================

export const DOMAIN_OPTIONS: DomainOption[] = [
  "Skincare",
  "Fine Jewelry",
  "Heritage Wine",
  "Modern SaaS",
  "Organic Food",
];

export const LIGHTING_OPTIONS: LightingOption[] = [
  "Diffused Natural",
  "Studio Rim",
  "Low-key Moody",
  "Golden Hour",
];

export const COMPOSITION_OPTIONS: CompositionOption[] = [
  "Macro/Close-up",
  "Flat lay",
  "Isometric",
  "Wide Angle",
];

export const MATERIAL_OPTIONS: MaterialOption[] = [
  "Matte/Frosted",
  "High Gloss/Condensation",
  "Textured/Organic",
];

export const ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
  "1:1",
  "3:4",
  "4:3",
  "9:16",
  "16:9",
];

export const DOMAIN_VOCABULARIES: Record<
  DomainOption,
  {
    persona: string;
    lexicon: string;
    environment: string;
    defaultColor: string;
  }
> = {
  Skincare: {
    persona:
      "Master Commercial Cosmetics & Still-Life Photographer with expertise in high-end dermatologist and luxury spa editorial campaigns.",
    lexicon:
      "Minimalist packaging, translucent hydrogel textures, rich satin cream emulsions, amber apothecary glass bottles with natural beechwood dropper caps, subtle subsurface scattering (SSS) on porcelain and cream textures, draped neutral cashmere and soft beige linen backdrops, Calacatta marble slab pedestals with soft grey-gold veining.",
    environment:
      "Serene, hyper-clean Scandinavian spa vanity setting with soft diffuse architectural geometry and calm ambient warmth.",
    defaultColor: "#E8DFD8",
  },
  "Fine Jewelry": {
    persona:
      "High-Jewelry Visual Director and Master Macro Gemologist Photographer.",
    lexicon:
      "Micro-facet brilliance, fire dispersion in flawless diamonds, 18k polished champagne gold and platinum specular highlights, deep velvet presentation pedestals, crisp edge refraction, pristine reflections with zero chromatic aberration.",
    environment:
      "Haute joaillerie private salon, midnight velvet plinth with focused micro-spotlights creating pin-sharp caustic light patterns.",
    defaultColor: "#D4AF37",
  },
  "Heritage Wine": {
    persona:
      "Master Sommelier & Editorial Vineyard Cellar Photographer.",
    lexicon:
      "Deep Bordeaux red wine glass caustics, vintage amber and emerald glass bottle reflections, aged French oak barrel woodgrain, hand-embossed textured cotton paper label, authentic cellar dust motes in subtle directional raking light, wax-sealed bottle neck.",
    environment:
      "Atmospheric 18th-century subterranean stone wine cellar, rustic subterranean masonry, warm candle-lit undertones.",
    defaultColor: "#722F37",
  },
  "Modern SaaS": {
    persona:
      "Elite Silicon Valley Product Designer & 3D Spatial Interface Visualizer.",
    lexicon:
      "Dark-mode glassmorphic floating interface layers, subtle frosted glass UI cards (backdrop-blur-md), vivid neo-gradient illumination, crisp vector typography, 3D holographic telemetry widgets, sleek titanium alloy device chassis.",
    environment:
      "Ultra-modern obsidian-toned technology studio with ambient neon edge luminescence and isometric spatial grid.",
    defaultColor: "#6366F1",
  },
  "Organic Food": {
    persona:
      "Artisan Culinary Stylist & Editorial Farm-to-Table Photographer.",
    lexicon:
      "Fresh morning dew droplets, raw rustic linen weaves, tactile heirloom grain surfaces, weathered reclaimed timber surfaces, vibrant organic botanical garnishes, honest farm-fresh earthy textures.",
    environment:
      "Sun-drenched rustic kitchen table with organic flora, cast iron accents, and warm diffused morning sunlight.",
    defaultColor: "#65A30D",
  },
};

export const LIGHTING_VOCABULARIES: Record<LightingOption, string> = {
  "Diffused Natural":
    "Soft wrap-around north-facing window light diffused through sheer linen, gentle gradient shadows, low contrast falloff, lifelike daylight temperature (5600K).",
  "Studio Rim":
    "Precision commercial studio strobes with crisp edge contour rim lighting, neomorphic halo backlight separating the subject from the background, subtle front fill to preserve micro-detail.",
  "Low-key Moody":
    "Dramatic chiaroscuro lighting, deep rich obsidian shadows, selective high-contrast spotlight on hero focal points, mysterious atmospheric mood with velvety dark falloff.",
  "Golden Hour":
    "Warm, low-angle oblique late afternoon sunlight (3200K), casting long cinematic shadows with intricate botanical branch gobos (dappled foliage shadows) and warm golden specular glints.",
};

export const COMPOSITION_VOCABULARIES: Record<CompositionOption, string> = {
  "Macro/Close-up":
    "Tactile macro focus with ultra-shallow depth of field (Hasselblad 120mm f/2.8 macro), creamy optical bokeh, razor-sharp focus on primary surface textures, droplet beads, and product bevels.",
  "Flat lay":
    "Precision knolling overhead 90-degree flat lay, geometric orthogonal alignment, balanced negative space, even studio diffusion eliminating harsh glare.",
  "Isometric":
    "Architectural 30-degree isometric perspective, dimensional depth, balanced diagonal lines, showcasing top, front, and side facets simultaneously in clean modern staging.",
  "Wide Angle":
    "Expansive environmental framing with 28mm architectural lens perspective, leading perspective lines, contextual atmosphere surrounding the hero subject without focal distortion.",
};

export const MATERIAL_VOCABULARIES: Record<MaterialOption, string> = {
  "Matte/Frosted":
    "Silky soft-touch matte polymer finish, frosted translucent glass with internal light scattering, non-reflective velvety ceramic surface texture.",
  "High Gloss/Condensation":
    "Pristine high-gloss mirror lacquer finish, micro-droplets of fresh cold condensation beading on glass surfaces, crisp specular light reflections.",
  "Textured/Organic":
    "Raw tactile surfaces, heavy woven cashmere linen weave, porous unpolished travertine stone, authentic organic wood grain textures.",
};

// ==========================================
// SOCIAL MEDIA & EDITORIAL PIPELINE CONSTANTS
// ==========================================

export const POST_CATEGORIES: {
  value: PostCategory;
  label: string;
  description: string;
}[] = [
  {
    value: "deep_tech",
    label: "Deep Tech & Particle Physics",
    description: "High-contrast quantum machines, fiber optics, laser matrices, cosmic dark voids.",
  },
  {
    value: "quantum_cosmology",
    label: "Quantum Consciousness & Singularity",
    description: "Golden particle vortexes, singularity funnels, dimensional spacetime fabric.",
  },
  {
    value: "ai_dev_marketing",
    label: "3D AI & Developer Marketing",
    description: "Stylized 3D matte characters, holographic UI cards, author attribution badges.",
  },
  {
    value: "pop_science",
    label: "Provocative Pop Science & Mechanics",
    description: "Viral headlines, glowing neural synapses, bold bottom-scrim typography.",
  },
  {
    value: "infographic_diagram",
    label: "Diagrammatic & Infographic Narratives",
    description: "Annotated scientific wave spectrums, schematic blueprints, contrast-backed split text.",
  },
];

export const TYPOGRAPHY_STYLES: {
  value: TypographyStyle;
  label: string;
  description: string;
}[] = [
  {
    value: "bold_impact_sans",
    label: "Bold Impact Sans (All-Caps)",
    description: "Heavy grotesque sans-serif, maximum punch and viral readability.",
  },
  {
    value: "editorial_luxury_serif",
    label: "Editorial Luxury Serif",
    description: "Sophisticated high-contrast display serif for intellectual thought leadership.",
  },
  {
    value: "clean_tech_grotesk",
    label: "Modern Tech Grotesk",
    description: "Minimalist Swiss neo-grotesk with razor-sharp geometric kerning.",
  },
  {
    value: "diagram_mono",
    label: "Technical Monospace",
    description: "Blueprint schematic monospace font for scientific data callouts.",
  },
];

export const TEXT_PLACEMENTS: {
  value: TextPlacement;
  label: string;
  description: string;
}[] = [
  {
    value: "bottom_third_scrim",
    label: "Bottom Third (Dark Gradient Scrim)",
    description: "Smooth dark bottom scrim ensuring 100% headline legibility over intense visuals.",
  },
  {
    value: "top_header_clean",
    label: "Top Header Banner",
    description: "Header band in top margin, leaving bottom scene wide and expansive.",
  },
  {
    value: "split_top_bottom",
    label: "Split Layout (Bug Top, Hook Bottom)",
    description: "Publication bug placed in top margin, heavy headline anchored at bottom.",
  },
  {
    value: "integrated_billboard",
    label: "Integrated Depth Billboard",
    description: "Typography woven spatially behind foreground elements and light caustics.",
  },
];

export const ARTISTIC_STYLES: {
  value: ArtisticStyle;
  label: string;
  description: string;
}[] = [
  {
    value: "luminescent_particles",
    label: "Luminescent Fiber Optics & Caustics",
    description: "Glowing optic filaments, golden particle streams, and volumetric energy beams.",
  },
  {
    value: "cosmic_synapses",
    label: "Cosmic Synapses & Neural Nebulae",
    description: "Bioluminescent axon networks interwoven with celestial star clusters.",
  },
  {
    value: "3d_matte_clay",
    label: "3D Matte Clay & Neon Hologram",
    description: "Stylized vinyl character mascot, soft claymation, floating cyan HUD widgets.",
  },
  {
    value: "scientific_schematic",
    label: "Technical Scientific Blueprint",
    description: "Precision vector grids, quantum wave spectrums, annotated schematic overlays.",
  },
];

export const BADGE_POSITIONS: { value: BadgePosition; label: string }[] = [
  { value: "top_left", label: "Top-Left Corner" },
  { value: "top_right", label: "Top-Right Corner" },
];

export const ARTISTIC_STYLE_VOCABULARIES: Record<
  ArtisticStyle,
  { label: string; lexicon: string; defaultColor: string }
> = {
  luminescent_particles: {
    label: "Luminescent Fiber Optics & Caustics",
    lexicon:
      "Hyper-detailed glowing optic fibers, golden amber energy vortex, illuminated particle streams against a deep obsidian space void, volumetric cinematic lighting, subsurface caustic scattering, radiant refraction trails.",
    defaultColor: "#F59E0B",
  },
  cosmic_synapses: {
    label: "Cosmic Synapses & Neural Nebulae",
    lexicon:
      "Intricate glowing neural synaptic networks interwoven with deep celestial nebulae, bioluminescent electric cyan and violet axon filaments, deep obsidian and cobalt space background with radiant star clusters and dimensional light grids.",
    defaultColor: "#8B5CF6",
  },
  "3d_matte_clay": {
    label: "3D Matte Clay & Neon Hologram",
    lexicon:
      "Stylized 3D matte vinyl character, soft tactile claymation textures, isometric developer workspace, floating glowing cyan and purple holographic UI cards, studio softbox ambient illumination, delightful high-contrast character design.",
    defaultColor: "#06B6D4",
  },
  scientific_schematic: {
    label: "Technical Scientific Blueprint",
    lexicon:
      "Clean diagrammatic vector aesthetics, annotated quantum wave spectrums, technical blueprint geometry, crisp precision lines with subtle cyan/emerald neon grid overlays on deep carbon substrate.",
    defaultColor: "#10B981",
  },
};

export const TYPOGRAPHY_STYLE_VOCABULARIES: Record<TypographyStyle, string> = {
  bold_impact_sans:
    "Heavy grotesque bold sans-serif (all-caps impact), ultra-legible, crisp kerning, commanding authority, zero digital aliasing.",
  editorial_luxury_serif:
    "High-contrast editorial display serif, refined calligraphic elegance, sophisticated intellectual authority, balanced optical weights.",
  clean_tech_grotesk:
    "Modern Swiss neo-grotesk, balanced geometry, minimalist Silicon Valley tech journal aesthetic, pristine letter-spacing.",
  diagram_mono:
    "Technical monospace typography, tabular alignment, blueprint schematic annotation style with sharp geometric glyphs.",
};

export const TEXT_PLACEMENT_VOCABULARIES: Record<TextPlacement, string> = {
  bottom_third_scrim:
    "Anchored at the bottom third with a smooth dark gradient/scrim overlay beneath the typography ensuring maximum optical contrast and effortless readability.",
  top_header_clean:
    "Clean top header banner placement with subtle dark ambient gradient falloff, keeping the lower visual field open for hero focal energy.",
  split_top_bottom:
    "Publication bug and metadata tag in the top margin, primary hook headline anchored boldly in the lower third with contrast-backed gradient.",
  integrated_billboard:
    "Bold integrated typographic billboard composition woven into the spatial depth of the visual scene with realistic ambient occlusion.",
};
