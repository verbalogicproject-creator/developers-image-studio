import { z } from "zod";

export const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const OrchestratorTogglesSchema = z.object({
  negativeSpace: z.boolean().default(false),
  studioIsolation: z.boolean().default(false),
  naturalContext: z.boolean().default(false),
});

export const GenerateRequestSchema = z.object({
  rawPrompt: z
    .string()
    .min(1, "Please provide a natural language prompt")
    .max(2000, "Prompt is too long (max 2000 characters)"),
  domain: z.enum([
    "Skincare",
    "Fine Jewelry",
    "Heritage Wine",
    "Modern SaaS",
    "Organic Food",
  ]),
  lighting: z.enum([
    "Diffused Natural",
    "Studio Rim",
    "Low-key Moody",
    "Golden Hour",
  ]),
  composition: z.enum([
    "Macro/Close-up",
    "Flat lay",
    "Isometric",
    "Wide Angle",
  ]),
  material: z.enum([
    "Matte/Frosted",
    "High Gloss/Condensation",
    "Textured/Organic",
  ]),
  aspectRatio: z.enum(["1:1", "3:4", "4:3", "9:16", "16:9"]),
  brandColor: z
    .string()
    .regex(hexColorRegex, "Must be a valid hex color (e.g., #D4AF37)")
    .optional()
    .or(z.literal("")),
  toggles: OrchestratorTogglesSchema,
  numberOfImages: z.number().int().min(1).max(4).default(1).optional(),
});

export type GenerateRequestInput = z.infer<typeof GenerateRequestSchema>;
