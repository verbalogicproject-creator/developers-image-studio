export type PipelineMode = "ecommerce" | "social_editorial";

// E-Commerce Types
export type DomainOption =
  | "Skincare"
  | "Fine Jewelry"
  | "Heritage Wine"
  | "Modern SaaS"
  | "Organic Food";

export type LightingOption =
  | "Diffused Natural"
  | "Studio Rim"
  | "Low-key Moody"
  | "Golden Hour";

export type CompositionOption =
  | "Macro/Close-up"
  | "Flat lay"
  | "Isometric"
  | "Wide Angle";

export type MaterialOption =
  | "Matte/Frosted"
  | "High Gloss/Condensation"
  | "Textured/Organic";

export type AspectRatioOption = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

export type LabelModeOption = "none" | "wordmark" | "full" | "custom";

export interface OrchestratorToggles {
  negativeSpace: boolean;
  studioIsolation: boolean;
  naturalContext: boolean;
}

// Social & Editorial Types
export type PostCategory =
  | "deep_tech"
  | "quantum_cosmology"
  | "ai_dev_marketing"
  | "pop_science"
  | "infographic_diagram";

export type TypographyStyle =
  | "bold_impact_sans"
  | "editorial_luxury_serif"
  | "clean_tech_grotesk"
  | "diagram_mono";

export type TextPlacement =
  | "bottom_third_scrim"
  | "top_header_clean"
  | "split_top_bottom"
  | "integrated_billboard";

export type ArtisticStyle =
  | "luminescent_particles"
  | "cosmic_synapses"
  | "3d_matte_clay"
  | "scientific_schematic";

export type BadgePosition = "top_left" | "top_right";

export interface OrchestratorState {
  // Master Pipeline
  pipelineMode: PipelineMode;

  // Shared
  rawPrompt: string;
  aspectRatio: AspectRatioOption;
  brandColor: string;
  excludeElements: string;

  // E-Commerce Specific
  domain: DomainOption;
  lighting: LightingOption;
  composition: CompositionOption;
  material: MaterialOption;
  labelMode: LabelModeOption;
  brandName: string;
  productName: string;
  productDetail: string;
  packagingText: string;
  toggles: OrchestratorToggles;

  // Social & Editorial Specific
  postCategory: PostCategory;
  headlineText: string;
  publicationBadge: string;
  badgePosition: BadgePosition;
  authorBadge: string;
  typographyStyle: TypographyStyle;
  textPlacement: TextPlacement;
  artisticStyle: ArtisticStyle;
}

export interface GenerationItem {
  id: string;
  timestamp: number;
  rawPrompt: string;
  compiledPrompt: string;
  imageData: string; // Base64 or data URL
  mimeType: string;
  mode: "generate" | "edit";
  pipelineMode: PipelineMode;
  parameters: {
    pipelineMode: PipelineMode;
    aspectRatio: AspectRatioOption;
    brandColor: string;
    excludeElements: string;

    // E-commerce
    domain?: DomainOption;
    lighting?: LightingOption;
    composition?: CompositionOption;
    material?: MaterialOption;
    labelMode?: LabelModeOption;
    brandName?: string;
    productName?: string;
    productDetail?: string;
    packagingText?: string;
    toggles?: OrchestratorToggles;

    // Social Editorial
    postCategory?: PostCategory;
    headlineText?: string;
    publicationBadge?: string;
    badgePosition?: BadgePosition;
    authorBadge?: string;
    typographyStyle?: TypographyStyle;
    textPlacement?: TextPlacement;
    artisticStyle?: ArtisticStyle;
  };
}

export interface GenerateApiRequest {
  pipelineMode?: PipelineMode;
  rawPrompt: string;
  aspectRatio: AspectRatioOption;
  brandColor?: string;
  excludeElements?: string;
  numberOfImages?: number;

  // Inpainting / Image-to-Image
  editMode?: "generate" | "edit";
  baseImage?: string | null;
  baseImageMimeType?: string;
  maskImage?: string | null;

  // E-Commerce
  domain?: DomainOption;
  lighting?: LightingOption;
  composition?: CompositionOption;
  material?: MaterialOption;
  labelMode?: LabelModeOption;
  brandName?: string;
  productName?: string;
  productDetail?: string;
  packagingText?: string;
  toggles?: OrchestratorToggles;

  // Social Editorial
  postCategory?: PostCategory;
  headlineText?: string;
  publicationBadge?: string;
  badgePosition?: BadgePosition;
  authorBadge?: string;
  typographyStyle?: TypographyStyle;
  textPlacement?: TextPlacement;
  artisticStyle?: ArtisticStyle;
}

export interface GenerateApiResponse {
  success: boolean;
  imageData?: string;
  mimeType?: string;
  compiledPrompt?: string;
  error?: string;
}
