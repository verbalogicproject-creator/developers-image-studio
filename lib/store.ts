import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  DomainOption,
  LightingOption,
  CompositionOption,
  MaterialOption,
  AspectRatioOption,
  LabelModeOption,
  OrchestratorToggles,
  GenerationItem,
} from "@/types";
import { DOMAIN_VOCABULARIES } from "./constants";

interface StudioStoreState {
  // Tabs
  activeTab: "studio" | "orchestrator";
  setActiveTab: (tab: "studio" | "orchestrator") => void;

  // Mode: Text-to-Image vs Image-to-Image / Inpaint
  editMode: "generate" | "edit";
  setEditMode: (editMode: "generate" | "edit") => void;

  baseImage: string | null;
  baseImageMimeType: string;
  maskImage: string | null;
  setBaseImage: (baseImage: string | null, mimeType?: string) => void;
  setMaskImage: (maskImage: string | null) => void;
  clearEditImages: () => void;

  // Prompt and Orchestrator state
  rawPrompt: string;
  domain: DomainOption;
  lighting: LightingOption;
  composition: CompositionOption;
  material: MaterialOption;
  aspectRatio: AspectRatioOption;
  brandColor: string;
  toggles: OrchestratorToggles;

  // Label & Typography Control
  labelMode: LabelModeOption;
  brandName: string;
  productName: string;
  productDetail: string;
  packagingText: string;

  // Negative / Exclusion Constraints
  excludeElements: string;

  // Gallery & Generation state
  gallery: GenerationItem[];
  currentGeneration: GenerationItem | null;
  isGenerating: boolean;
  error: string | null;

  // Actions
  setRawPrompt: (prompt: string) => void;
  setDomain: (domain: DomainOption) => void;
  setLighting: (lighting: LightingOption) => void;
  setComposition: (composition: CompositionOption) => void;
  setMaterial: (material: MaterialOption) => void;
  setAspectRatio: (aspectRatio: AspectRatioOption) => void;
  setBrandColor: (color: string) => void;
  setToggle: (key: keyof OrchestratorToggles, value: boolean) => void;
  
  setLabelMode: (mode: LabelModeOption) => void;
  setBrandName: (brand: string) => void;
  setProductName: (product: string) => void;
  setProductDetail: (detail: string) => void;
  setPackagingText: (text: string) => void;
  setExcludeElements: (text: string) => void;

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

      editMode: "generate",
      setEditMode: (editMode) => set({ editMode }),

      baseImage: null,
      baseImageMimeType: "image/jpeg",
      maskImage: null,
      setBaseImage: (baseImage, mimeType = "image/jpeg") =>
        set({ baseImage, baseImageMimeType: mimeType }),
      setMaskImage: (maskImage) => set({ maskImage }),
      clearEditImages: () => set({ baseImage: null, maskImage: null }),

      rawPrompt:
        "Minimalist skincare serum bottle resting on soft beige cashmere folds with delicate dried floral branch shadows",
      domain: "Skincare",
      lighting: "Diffused Natural",
      composition: "Macro/Close-up",
      material: "Matte/Frosted",
      aspectRatio: "1:1",
      brandColor: "#E8DFD8",
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

      excludeElements:
        "no visible people or hands, no watermark-like artifacts, no props not implied by the subject concept",

      gallery: [],
      currentGeneration: null,
      isGenerating: false,
      error: null,

      setRawPrompt: (rawPrompt) => set({ rawPrompt }),
      setDomain: (domain) => {
        const defaultColor =
          DOMAIN_VOCABULARIES[domain]?.defaultColor || "#E8DFD8";
        set({ domain, brandColor: defaultColor });
      },
      setLighting: (lighting) => set({ lighting }),
      setComposition: (composition) => set({ composition }),
      setMaterial: (material) => set({ material }),
      setAspectRatio: (aspectRatio) => set({ aspectRatio }),
      setBrandColor: (brandColor) => set({ brandColor }),
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
      setExcludeElements: (excludeElements) => set({ excludeElements }),

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
          domain: item.parameters.domain,
          lighting: item.parameters.lighting,
          composition: item.parameters.composition,
          material: item.parameters.material,
          aspectRatio: item.parameters.aspectRatio,
          brandColor: item.parameters.brandColor,
          labelMode: item.parameters.labelMode || "none",
          brandName: item.parameters.brandName || "Calyx",
          productName: item.parameters.productName || "Bare Barrier Serum",
          productDetail: item.parameters.productDetail || "50ml / 1.7 fl oz",
          packagingText: item.parameters.packagingText || "",
          excludeElements: item.parameters.excludeElements || "",
          toggles: { ...item.parameters.toggles },
          currentGeneration: item,
          editMode: item.mode || "generate",
        }),
    }),
    {
      name: "imagen-nano-banana-studio-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rawPrompt: state.rawPrompt,
        domain: state.domain,
        lighting: state.lighting,
        composition: state.composition,
        material: state.material,
        aspectRatio: state.aspectRatio,
        brandColor: state.brandColor,
        labelMode: state.labelMode,
        brandName: state.brandName,
        productName: state.productName,
        productDetail: state.productDetail,
        packagingText: state.packagingText,
        excludeElements: state.excludeElements,
        toggles: state.toggles,
        gallery: state.gallery,
      }),
    }
  )
);
