import {
  DomainOption,
  LightingOption,
  CompositionOption,
  MaterialOption,
  AspectRatioOption,
} from "@/types";

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
