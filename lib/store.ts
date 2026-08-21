import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  PipelineMode,
  DomainOption,
  LightingOption,
  CompositionOption,
  MaterialOption,
  AspectRatioOption,
  LabelModeOption,
  OrchestratorToggles,
  GenerationItem,
  PostCategory,
  TypographyStyle,
  TextPlacement,
  ArtisticStyle,
  BadgePosition,
} from "@/types";
import { DOMAIN_VOCABULARIES, ARTISTIC_STYLE_VOCABULARIES } from "./constants";

interface StudioStoreState {
  // Navigation Tabs
  activeTab: "studio" | "orchestrator";
  setActiveTab: (tab: "studio" | "orchestrator") => void;

  // Master Pipeline Selector
  pipelineMode: PipelineMode;
  setPipelineMode: (mode: PipelineMode) => void;

  // Mode: Text-to-Image vs Image-to-Image / Inpaint
  editMode: "generate" | "edit";
  setEditMode: (editMode: "generate" | "edit") => void;

  baseImage: string | null;
  baseImageMimeType: string;
  maskImage: string | null;
  setBaseImage: (baseImage: string | null, mimeType?: string) => void;
  setMaskImage: (maskImage: string | null) => void;
  clearEditImages: () => void;

  // Shared Parameters
  rawPrompt: string;
  aspectRatio: AspectRatioOption;
  brandColor: string;
  excludeElements: string;

  // E-Commerce Specific State
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

  // Social & Editorial Specific State
  postCategory: PostCategory;
  headlineText: string;
  publicationBadge: string;
  badgePosition: BadgePosition;
  authorBadge: string;
  typographyStyle: TypographyStyle;
  textPlacement: TextPlacement;
  artisticStyle: ArtisticStyle;

  // Gallery & Generation State
  gallery: GenerationItem[];
  currentGeneration: GenerationItem | null;
  isGenerating: boolean;
  error: string | null;

  // Setters
  setRawPrompt: (prompt: string) => void;
  setAspectRatio: (aspectRatio: AspectRatioOption) => void;
  setBrandColor: (color: string) => void;
  setExcludeElements: (text: string) => void;

  // E-Commerce Actions
  setDomain: (domain: DomainOption) => void;
  setLighting: (lighting: LightingOption) => void;
  setComposition: (composition: CompositionOption) => void;
  setMaterial: (material: MaterialOption) => void;
  setToggle: (key: keyof OrchestratorToggles, value: boolean) => void;
  setLabelMode: (mode: LabelModeOption) => void;
  setBrandName: (brand: string) => void;
  setProductName: (product: string) => void;
  setProductDetail: (detail: string) => void;
  setPackagingText: (text: string) => void;

  // Social Editorial Actions
  setPostCategory: (cat: PostCategory) => void;
  setHeadlineText: (text: string) => void;
  setPublicationBadge: (badge: string) => void;
  setBadgePosition: (pos: BadgePosition) => void;
  setAuthorBadge: (badge: string) => void;
  setTypographyStyle: (style: TypographyStyle) => void;
  setTextPlacement: (placement: TextPlacement) => void;
  setArtisticStyle: (style: ArtisticStyle) => void;

  // App Execution Actions
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentGeneration: (item: GenerationItem | null) => void;
  addGeneration: (item: GenerationItem) => void;
  removeGeneration: (id: string) => void;
  clearGallery: () => void;
  loadParameters: (item: GenerationItem) => void;
}

export const useStudioStore = create<StudioStoreState>()(
  persist(
    (set, get) => ({
      activeTab: "studio",
      setActiveTab: (activeTab) => set({ activeTab }),

      pipelineMode: "ecommerce",
      setPipelineMode: (pipelineMode) => {
        if (pipelineMode === "social_editorial") {
          const currentStyle = get().artisticStyle;
          const defaultColor =
            ARTISTIC_STYLE_VOCABULARIES[currentStyle]?.defaultColor || "#F59E0B";
          set({
            pipelineMode,
            brandColor: defaultColor,
            aspectRatio: "1:1",
            rawPrompt:
              "Glowing amber particle vortex funneling into a quantum singularity against deep cosmic void",
          });
        } else {
          const currentDomain = get().domain;
          const defaultColor =
            DOMAIN_VOCABULARIES[currentDomain]?.defaultColor || "#E8DFD8";
          set({
            pipelineMode,
            brandColor: defaultColor,
            aspectRatio: "1:1",
            rawPrompt:
              "Minimalist skincare serum bottle resting on soft beige cashmere folds with delicate dried floral branch shadows",
          });
        }
      },

      editMode: "generate",
      setEditMode: (editMode) => set({ editMode }),

      baseImage: null,
      baseImageMimeType: "image/jpeg",
      maskImage: null,
      setBaseImage: (baseImage, mimeType = "image/jpeg") =>
        set({ baseImage, baseImageMimeType: mimeType }),
      setMaskImage: (maskImage) => set({ maskImage }),
      clearEditImages: () => set({ baseImage: null, maskImage: null }),

      // Shared
      rawPrompt:
        "Minimalist skincare serum bottle resting on soft beige cashmere folds with delicate dried floral branch shadows",
      aspectRatio: "1:1",
      brandColor: "#E8DFD8",
      excludeElements:
        "no visible people or hands, no watermark-like artifacts, no props not implied by the subject concept",

      // E-Commerce
      domain: "Skincare",
      lighting: "Diffused Natural",
      composition: "Macro/Close-up",
      material: "Matte/Frosted",
      toggles: {
        negativeSpace: true,
        studioIsolation: false,
        naturalContext: true,
      },
      labelMode: "none",
      brandName: "Calyx",
      productName: "Bare Barrier Serum",
      productDetail: "50ml / 1.7 fl oz",
      packagingText: "",

      // Social & Editorial
      postCategory: "deep_tech",
      headlineText:
        "Your Bad Luck Isn't Random — And an Oxford Physicist's Machine Could Help Prove It",
      publicationBadge: "iai news",
      badgePosition: "top_left",
      authorBadge: "Kanji Low • AI Marketing Strategist",
      typographyStyle: "bold_impact_sans",
      textPlacement: "bottom_third_scrim",
      artisticStyle: "luminescent_particles",

      gallery: [],
      currentGeneration: null,
      isGenerating: false,
      error: null,

      // Shared Setters
      setRawPrompt: (rawPrompt) => set({ rawPrompt }),
      setAspectRatio: (aspectRatio) => set({ aspectRatio }),
      setBrandColor: (brandColor) => set({ brandColor }),
      setExcludeElements: (excludeElements) => set({ excludeElements }),

      // E-Commerce Setters
      setDomain: (domain) => {
        const defaultColor =
          DOMAIN_VOCABULARIES[domain]?.defaultColor || "#E8DFD8";
        set({ domain, brandColor: defaultColor });
      },
      setLighting: (lighting) => set({ lighting }),
      setComposition: (composition) => set({ composition }),
      setMaterial: (material) => set({ material }),
      setToggle: (key, value) =>
        set((state) => ({
          toggles: {
            ...state.toggles,
            [key]: value,
          },
        })),
      setLabelMode: (labelMode) => set({ labelMode }),
      setBrandName: (brandName) => set({ brandName }),
      setProductName: (productName) => set({ productName }),
      setProductDetail: (productDetail) => set({ productDetail }),
      setPackagingText: (packagingText) => set({ packagingText }),

      // Social Editorial Setters
      setPostCategory: (postCategory) => set({ postCategory }),
      setHeadlineText: (headlineText) => set({ headlineText }),
      setPublicationBadge: (publicationBadge) => set({ publicationBadge }),
      setBadgePosition: (badgePosition) => set({ badgePosition }),
      setAuthorBadge: (authorBadge) => set({ authorBadge }),
      setTypographyStyle: (typographyStyle) => set({ typographyStyle }),
      setTextPlacement: (textPlacement) => set({ textPlacement }),
      setArtisticStyle: (artisticStyle) => {
        const defaultColor =
          ARTISTIC_STYLE_VOCABULARIES[artisticStyle]?.defaultColor || "#F59E0B";
        set({ artisticStyle, brandColor: defaultColor });
      },

      setIsGenerating: (isGenerating) => set({ isGenerating }),
      setError: (error) => set({ error }),
      setCurrentGeneration: (currentGeneration) => set({ currentGeneration }),

      addGeneration: (item) =>
        set((state) => {
          const updatedGallery = [
            item,
            ...state.gallery.filter((g) => g.id !== item.id),
          ].slice(0, 15);
          return {
            gallery: updatedGallery,
            currentGeneration: item,
            error: null,
          };
        }),

      removeGeneration: (id) =>
        set((state) => ({
          gallery: state.gallery.filter((g) => g.id !== id),
          currentGeneration:
            state.currentGeneration?.id === id ? null : state.currentGeneration,
        })),

      clearGallery: () => set({ gallery: [], currentGeneration: null }),

      loadParameters: (item) =>
        set({
          rawPrompt: item.rawPrompt,
          aspectRatio: item.parameters.aspectRatio,
          brandColor: item.parameters.brandColor,
          excludeElements: item.parameters.excludeElements || "",
          pipelineMode: item.parameters.pipelineMode || "ecommerce",

          // E-Commerce
          domain: item.parameters.domain || "Skincare",
          lighting: item.parameters.lighting || "Diffused Natural",
          composition: item.parameters.composition || "Macro/Close-up",
          material: item.parameters.material || "Matte/Frosted",
          labelMode: item.parameters.labelMode || "none",
          brandName: item.parameters.brandName || "Calyx",
          productName: item.parameters.productName || "Bare Barrier Serum",
          productDetail: item.parameters.productDetail || "50ml / 1.7 fl oz",
          packagingText: item.parameters.packagingText || "",
          toggles: item.parameters.toggles
            ? { ...item.parameters.toggles }
            : {
                negativeSpace: true,
                studioIsolation: false,
                naturalContext: true,
              },

          // Social Editorial
          postCategory: item.parameters.postCategory || "deep_tech",
          headlineText: item.parameters.headlineText || "",
          publicationBadge: item.parameters.publicationBadge || "",
          badgePosition: item.parameters.badgePosition || "top_left",
          authorBadge: item.parameters.authorBadge || "",
          typographyStyle: item.parameters.typographyStyle || "bold_impact_sans",
          textPlacement: item.parameters.textPlacement || "bottom_third_scrim",
          artisticStyle:
            item.parameters.artisticStyle || "luminescent_particles",

          currentGeneration: item,
          editMode: item.mode || "generate",
        }),
    }),
    {
      name: "imagen-nano-banana-studio-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        pipelineMode: state.pipelineMode,
        rawPrompt: state.rawPrompt,
        aspectRatio: state.aspectRatio,
        brandColor: state.brandColor,
        excludeElements: state.excludeElements,

        // E-Commerce
        domain: state.domain,
        lighting: state.lighting,
        composition: state.composition,
        material: state.material,
        labelMode: state.labelMode,
        brandName: state.brandName,
        productName: state.productName,
        productDetail: state.productDetail,
        packagingText: state.packagingText,
        toggles: state.toggles,

        // Social Editorial
        postCategory: state.postCategory,
        headlineText: state.headlineText,
        publicationBadge: state.publicationBadge,
        badgePosition: state.badgePosition,
        authorBadge: state.authorBadge,
        typographyStyle: state.typographyStyle,
        textPlacement: state.textPlacement,
        artisticStyle: state.artisticStyle,

        gallery: state.gallery,
      }),
    }
  )
);
