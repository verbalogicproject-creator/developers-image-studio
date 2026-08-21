/**
 * Local Multimodal Project Memory Engine — Type Definitions
 * Strongly typed contracts for Source, Architectural, Experiential, and Multimodal memory.
 */

export type MemoryModality =
  | "text"
  | "code"
  | "architecture"
  | "image"
  | "generation";

export type MemoryType =
  | "source_code"
  | "documentation"
  | "architecture_spec"
  | "decision_record"
  | "generation_history"
  | "user_interaction"
  | "symbol_index";

export type SourceAuthority =
  | "runtime"
  | "source"
  | "architecture"
  | "documentation"
  | "generated";

export type RetrievalIntent =
  | "implementation"
  | "architecture"
  | "documentation"
  | "history"
  | "generation"
  | "exact_symbol"
  | "general";

export interface FileRecord {
  id: string;
  filepath: string;
  fileType: string;
  contentHash: string;
  mtime: number;
  size: number;
  indexedAt: number;
}

export interface ChunkRecord {
  id: string;
  fileId: string;
  chunkIndex: number;
  content: string;
  contentHash: string;
  sourceType: string;
  symbolName?: string;
  symbolKind?: string;
  heading?: string;
  startLine?: number;
  endLine?: number;
  embedding?: Float32Array;
  embeddingModel: string;
  embeddingDimension: number;
  createdAt: number;
  updatedAt: number;
}

export interface MemoryRecord {
  id: string;
  memoryType: MemoryType;
  modality: MemoryModality;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  embedding?: Float32Array;
  embeddingModel: string;
  embeddingDimension: number;
  createdAt: number;
  updatedAt: number;
}

export interface MemoryRelation {
  id: string;
  fromId: string;
  relation: string;
  toId: string;
  source: string;
  weight: number;
  confidence?: number;
  metadata?: Record<string, unknown>;
  createdAt: number;
}

export interface GenerationMemory {
  id: string;
  originalIntent: string;
  compiledPrompt: string;
  pipelineMode?: string;
  domain?: string;
  lighting?: string;
  composition?: string;
  materials?: string[];
  colors?: string[];
  aspectRatio?: string;
  imagePath?: string;
  parentGenerationId?: string;
  refinementInstruction?: string;
  headlineText?: string;
  publicationBadge?: string;
  authorBadge?: string;
  createdAt: number;
  updatedAt?: number;
  metadata?: Record<string, unknown>;
}

export interface DocumentEmbeddingInput {
  text: string;
  title?: string;
  symbol?: string;
  context?: string;
}

export interface QueryEmbeddingInput {
  query: string;
  intent?: RetrievalIntent;
  isCodeQuery?: boolean;
}

export interface EmbeddingProvider {
  embedDocument(input: DocumentEmbeddingInput): Promise<Float32Array>;
  embedQuery(input: QueryEmbeddingInput): Promise<Float32Array>;
  readonly modelName: string;
  readonly dimensions: number;
}

export interface RetrievedContext {
  id: string;
  filepath?: string;
  sourceType: string;
  memoryType?: MemoryType | string;
  modality: MemoryModality;
  content: string;
  symbol?: string;
  symbolKind?: string;
  heading?: string;
  startLine?: number;
  endLine?: number;
  semanticScore?: number;
  lexicalScore?: number;
  graphScore?: number;
  finalScore: number;
  reason: string;
  metadata?: Record<string, unknown>;
  relatedNodes?: Array<{
    relation: string;
    targetId: string;
    weight: number;
  }>;
}

export interface SearchOptions {
  limit?: number;
  candidateLimit?: number;
  intent?: RetrievalIntent;
  minScore?: number;
  includeRelations?: boolean;
  filterFilepaths?: string[];
  filterMemoryTypes?: MemoryType[];
  filterModalities?: MemoryModality[];
}

export interface IndexStats {
  filesCount: number;
  chunksCount: number;
  memoriesCount: number;
  relationsCount: number;
  lastIndexedAt: number;
  dbSizeBytes: number;
}
