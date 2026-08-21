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

export interface OrchestratorState {
  rawPrompt: string;
  domain: DomainOption;
  lighting: LightingOption;
  composition: CompositionOption;
  material: MaterialOption;
  aspectRatio: AspectRatioOption;
  brandColor: string;
  labelMode: LabelModeOption;
  brandName: string;
  productName: string;
  productDetail: string;
  packagingText: string;
  excludeElements: string;
  toggles: OrchestratorToggles;
}

export interface GenerationItem {
  id: string;
  timestamp: number;
  rawPrompt: string;
  compiledPrompt: string;
  imageData: string; // Base64 or data URL
  mimeType: string;
  mode: "generate" | "edit";
  parameters: {
    domain: DomainOption;
    lighting: LightingOption;
    composition: CompositionOption;
    material: MaterialOption;
    aspectRatio: AspectRatioOption;
    brandColor: string;
    labelMode: LabelModeOption;
    brandName: string;
    productName: string;
    productDetail: string;
    packagingText: string;
    excludeElements: string;
    toggles: OrchestratorToggles;
  };
}

export interface GenerateApiRequest {
  rawPrompt: string;
  domain: DomainOption;
  lighting: LightingOption;
  composition: CompositionOption;
  material: MaterialOption;
  aspectRatio: AspectRatioOption;
  brandColor?: string;
  labelMode?: LabelModeOption;
  brandName?: string;
  productName?: string;
  productDetail?: string;
  packagingText?: string;
  excludeElements?: string;
  toggles: OrchestratorToggles;
  numberOfImages?: number;
  editMode?: "generate" | "edit";
  baseImage?: string | null; // Base64 image
  baseImageMimeType?: string;
  maskImage?: string | null; // Base64 mask image
}

export interface GenerateApiResponse {
  success: boolean;
  imageData?: string; // base64
  mimeType?: string;
  compiledPrompt?: string;
  error?: string;
}
