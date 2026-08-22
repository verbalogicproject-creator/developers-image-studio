import fs from "node:fs";
import { CodeChunker } from "./chunkers/code_chunker";
import { CtxChunker } from "./chunkers/ctx_chunker";
import { MarkdownChunker } from "./chunkers/markdown_chunker";
import { TextChunker } from "./chunkers/text_chunker";
import { DEFAULT_CONFIG, MemoryConfig } from "./config";
import { MemoryDatabase } from "./database";
import { GeminiEmbeddingProvider } from "./embedding_provider";
import { packageContextForAgent } from "./packaging";
import { HybridRetriever } from "./retrieval/retriever";
import { computeSha256, FileScanner, ScannedFile } from "./scanner";
import {
  ChunkRecord,
  EmbeddingProvider,
  GenerationMemory,
  IndexStats,
  MemoryRecord,
  MemoryRelation,
  MemoryType,
  RetrievedContext,
  SearchOptions,
} from "./types";

export class MemoryEngine {
  private config: MemoryConfig;
  private db: MemoryDatabase;
  private embeddingProvider: EmbeddingProvider;
  private scanner: FileScanner;
  private retriever: HybridRetriever;

  private codeChunker = new CodeChunker();
  private markdownChunker = new MarkdownChunker();
  private ctxChunker = new CtxChunker();
  private textChunker = new TextChunker();

  constructor(
    customConfig?: Partial<MemoryConfig>,
    customEmbeddingProvider?: EmbeddingProvider
  ) {
    this.config = { ...DEFAULT_CONFIG, ...customConfig };
    this.db = new MemoryDatabase(this.config.dbPath);
    this.embeddingProvider =
      customEmbeddingProvider ||
      new GeminiEmbeddingProvider(
        undefined,
        this.config.embeddingModel,
        this.config.embeddingDimensions
      );
    this.scanner = new FileScanner(this.config);
    this.retriever = new HybridRetriever(
      this.db,
      this.embeddingProvider,
      this.config
    );
  }

  // ==========================================
  // INCREMENTAL INDEXING
  // ==========================================

  async index(
    onProgress?: (status: {
      phase: "scanning" | "chunking" | "embedding" | "completed";
      file?: string;
      current?: number;
      total?: number;
      message?: string;
    }) => void
  ): Promise<{
    indexed: number;
    unchanged: number;
    deleted: number;
    totalChunks: number;
  }> {
    onProgress?.({ phase: "scanning", message: "Scanning project directory..." });
    const scannedFiles = this.scanner.scan();
    const existingDbFiles = this.db.getAllFiles();
    const existingFileMap = new Map(
      existingDbFiles.map((f) => [f.filepath, f])
    );

    let indexedCount = 0;
    let unchangedCount = 0;
    let deletedCount = 0;

    // 1. Detect deleted files
    const scannedPathSet = new Set(scannedFiles.map((f) => f.filepath));
    for (const dbFile of existingDbFiles) {
      if (!scannedPathSet.has(dbFile.filepath)) {
        this.db.deleteFile(dbFile.id);
        deletedCount++;
      }
    }

    // 2. Incremental Indexing for new / modified files
    const filesToProcess: ScannedFile[] = [];

    for (const file of scannedFiles) {
      const existing = existingFileMap.get(file.filepath);
      if (
        existing &&
        existing.contentHash === file.contentHash &&
        existing.mtime === file.mtime
      ) {
        unchangedCount++;
      } else {
        filesToProcess.push(file);
      }
    }

    const totalToProcess = filesToProcess.length;

    for (let idx = 0; idx < totalToProcess; idx++) {
      const file = filesToProcess[idx];
      const fileId = `file_${computeSha256(file.filepath).slice(0, 24)}`;

      onProgress?.({
        phase: "chunking",
        file: file.filepath,
        current: idx + 1,
        total: totalToProcess,
        message: `Processing [${idx + 1}/${totalToProcess}]: ${file.filepath}`,
      });

      // Upsert file record FIRST so foreign keys satisfy constraint
      this.db.upsertFile({
        id: fileId,
        filepath: file.filepath,
        fileType: file.fileType,
        contentHash: file.contentHash,
        mtime: file.mtime,
        size: file.size,
        indexedAt: Date.now(),
      });

      // Clear existing chunks for this file
      this.db.deleteChunksByFileId(fileId);

      // Select appropriate semantic chunker
      let chunks: ChunkRecord[] = [];
      const ext = `.${file.fileType}`.toLowerCase();

      if ([".ts", ".tsx", ".js", ".jsx"].includes(ext)) {
        chunks = this.codeChunker.chunk(
          file.filepath,
          file.content,
          fileId,
          this.embeddingProvider.modelName,
          this.embeddingProvider.dimensions
        );
      } else if ([".md", ".mdx"].includes(ext)) {
        chunks = this.markdownChunker.chunk(
          file.filepath,
          file.content,
          fileId,
          this.embeddingProvider.modelName,
          this.embeddingProvider.dimensions
        );
      } else if (ext === ".ctx") {
        const parsed = this.ctxChunker.parse(
          file.filepath,
          file.content,
          fileId,
          this.embeddingProvider.modelName,
          this.embeddingProvider.dimensions
        );
        chunks = parsed.chunks;
        // Ingest Graph Relations
        for (const rel of parsed.relations) {
          this.db.insertRelation(rel);
        }
      } else {
        chunks = this.textChunker.chunk(
          file.filepath,
          file.content,
          fileId,
          this.embeddingProvider.modelName,
          this.embeddingProvider.dimensions
        );
      }

      // Embed each chunk and store in SQLite
      for (const chunk of chunks) {
        try {
          const vector = await this.embeddingProvider.embedDocument({
            text: chunk.content,
            title: file.filepath,
            symbol: chunk.symbolName,
            context: chunk.heading,
          });
          chunk.embedding = vector;
          this.db.insertChunk(chunk, file.filepath);
        } catch (err: any) {
          console.error(
            `Failed to embed chunk ${chunk.id} in ${file.filepath}:`,
            err.message
          );
        }
      }

      indexedCount++;
    }

    onProgress?.({
      phase: "completed",
      message: `Indexing complete. ${indexedCount} indexed, ${unchangedCount} unchanged, ${deletedCount} deleted.`,
    });

    const stats = this.db.getStats();
    return {
      indexed: indexedCount,
      unchanged: unchangedCount,
      deleted: deletedCount,
      totalChunks: stats.chunksCount,
    };
  }

  // ==========================================
  // EXPERIENTIAL & DIRECT TEXT INGESTION
  // ==========================================

  async ingestGenerationMemory(gen: GenerationMemory): Promise<string> {
    const memoryId = `mem_gen_${gen.id}`;
    const now = Date.now();

    const title =
      gen.headlineText ||
      gen.domain ||
      gen.originalIntent.slice(0, 50) ||
      "Generation Memory";

    const content = [
      `### Generation Run: ${title}`,
      `**Pipeline:** ${gen.pipelineMode || "ecommerce"}`,
      `**Original Intent:** ${gen.originalIntent}`,
      gen.domain ? `**Domain:** ${gen.domain}` : "",
      gen.lighting ? `**Lighting:** ${gen.lighting}` : "",
      gen.aspectRatio ? `**Aspect Ratio:** ${gen.aspectRatio}` : "",
      gen.headlineText ? `**Rendered Headline:** ${gen.headlineText}` : "",
      gen.publicationBadge ? `**Publication Badge:** ${gen.publicationBadge}` : "",
      `\n**Compiled Prompt:**\n${gen.compiledPrompt}`,
    ]
      .filter(Boolean)
      .join("\n");

    const vector = await this.embeddingProvider.embedDocument({
      text: content,
      title,
      context: `Pipeline: ${gen.pipelineMode || "ecommerce"} | AspectRatio: ${gen.aspectRatio || "1:1"}`,
    });

    const memoryRecord: MemoryRecord = {
      id: memoryId,
      memoryType: "generation_history",
      modality: "generation",
      title,
      content,
      metadata: {
        ...gen,
      },
      embedding: vector,
      embeddingModel: this.embeddingProvider.modelName,
      embeddingDimension: this.embeddingProvider.dimensions,
      createdAt: gen.createdAt || now,
      updatedAt: now,
    };

    this.db.upsertMemory(memoryRecord);
    return memoryId;
  }

  async ingestText(
    content: string,
    title?: string,
    memoryType: MemoryType = "user_interaction",
    metadata?: Record<string, unknown>
  ): Promise<string> {
    const memoryId = `mem_note_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = Date.now();

    const firstLine = content.split("\n")[0].replace(/^[#\s*-]+/, "").trim();
    const resolvedTitle = title || firstLine.slice(0, 60) || "Logged Note";

    const vector = await this.embeddingProvider.embedDocument({
      text: content,
      title: resolvedTitle,
      context: `MemoryType: ${memoryType} | Ingested: ${new Date(now).toISOString()}`,
    });

    const memoryRecord: MemoryRecord = {
      id: memoryId,
      memoryType,
      modality: "text",
      title: resolvedTitle,
      content,
      metadata: {
        ...metadata,
        ingestedAt: now,
      },
      embedding: vector,
      embeddingModel: this.embeddingProvider.modelName,
      embeddingDimension: this.embeddingProvider.dimensions,
      createdAt: now,
      updatedAt: now,
    };

    this.db.upsertMemory(memoryRecord);
    return memoryId;
  }

  // ==========================================
  // HYBRID RETRIEVAL & GRAPH
  // ==========================================

  async search(
    query: string,
    options?: SearchOptions
  ): Promise<RetrievedContext[]> {
    return this.retriever.search(query, options);
  }

  async searchFormatted(
    query: string,
    options?: SearchOptions,
    maxItems = 3,
    maxChars = 4000
  ): Promise<string> {
    const contexts = await this.retriever.search(query, options);
    return packageContextForAgent(query, contexts, maxItems, maxChars);
  }

  getAllRelations(): MemoryRelation[] {
    return this.db.getAllRelations();
  }

  getStats(): IndexStats {
    const stats = this.db.getStats();
    try {
      if (fs.existsSync(this.config.dbPath)) {
        stats.dbSizeBytes = fs.statSync(this.config.dbPath).size;
      }
    } catch (e) {}
    return stats;
  }

  close() {
    this.db.close();
  }
}
