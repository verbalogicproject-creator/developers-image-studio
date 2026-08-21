import { z } from "zod";

export const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const OrchestratorTogglesSchema = z.object({
  negativeSpace: z.boolean().default(false),
  studioIsolation: z.boolean().default(false),
  naturalContext: z.boolean().default(false),
});

export const GenerateRequestSchema = z.object({
  pipelineMode: z.enum(["ecommerce", "social_editorial"]).default("ecommerce").optional(),
  
  rawPrompt: z
    .string()
    .min(1, "Please provide a natural language prompt")
    .max(3000, "Prompt is too long (max 3000 characters)"),
  
  aspectRatio: z.enum(["1:1", "3:4", "4:3", "9:16", "16:9"]).default("1:1"),
  brandColor: z
    .string()
    .regex(hexColorRegex, "Must be a valid hex color (e.g., #D4AF37)")
    .optional()
    .or(z.literal("")),
  excludeElements: z.string().optional().default(""),
  numberOfImages: z.number().int().min(1).max(4).default(1).optional(),

  // Image-to-Image & Inpainting Mode
  editMode: z.enum(["generate", "edit"]).default("generate").optional(),
  baseImage: z.string().nullable().optional(),
  baseImageMimeType: z.string().optional(),
  maskImage: z.string().nullable().optional(),

  // E-Commerce Specific Parameters
  domain: z
    .enum([
      "Skincare",
      "Fine Jewelry",
      "Heritage Wine",
      "Modern SaaS",
      "Organic Food",
    ])
    .default("Skincare")
    .optional(),
  lighting: z
    .enum([
      "Diffused Natural",
      "Studio Rim",
      "Low-key Moody",
      "Golden Hour",
    ])
    .default("Diffused Natural")
    .optional(),
  composition: z
    .enum([
      "Macro/Close-up",
      "Flat lay",
      "Isometric",
      "Wide Angle",
    ])
    .default("Macro/Close-up")
    .optional(),
  material: z
    .enum([
      "Matte/Frosted",
      "High Gloss/Condensation",
      "Textured/Organic",
    ])
    .default("Matte/Frosted")
    .optional(),
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

  // Social & Editorial Specific Parameters
  postCategory: z
    .enum([
      "deep_tech",
      "quantum_cosmology",
      "ai_dev_marketing",
      "pop_science",
      "infographic_diagram",
    ])
    .default("deep_tech")
    .optional(),
  headlineText: z.string().optional().default(""),
  publicationBadge: z.string().optional().default(""),
  badgePosition: z.enum(["top_left", "top_right"]).default("top_left").optional(),
  authorBadge: z.string().optional().default(""),
  typographyStyle: z
    .enum([
      "bold_impact_sans",
      "editorial_luxury_serif",
      "clean_tech_grotesk",
      "diagram_mono",
    ])
    .default("bold_impact_sans")
    .optional(),
  textPlacement: z
    .enum([
      "bottom_third_scrim",
      "top_header_clean",
      "split_top_bottom",
      "integrated_billboard",
    ])
    .default("bottom_third_scrim")
    .optional(),
  artisticStyle: z
    .enum([
      "luminescent_particles",
      "cosmic_synapses",
      "3d_matte_clay",
      "scientific_schematic",
    ])
    .default("luminescent_particles")
    .optional(),
});

export type GenerateRequestInput = z.infer<typeof GenerateRequestSchema>;
