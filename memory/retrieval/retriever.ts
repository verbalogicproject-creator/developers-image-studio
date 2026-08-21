import { MemoryConfig } from "../config";
import { MemoryDatabase } from "../database";
import { filterForDiversity } from "../diversity";
import {
  ChunkRecord,
  EmbeddingProvider,
  MemoryRecord,
  RetrievedContext,
  SearchOptions,
} from "../types";
import { cosineSimilarity } from "../vector_math";
import { inferQueryIntent } from "./intent";
import { LexicalScorer } from "./lexical";
import { reciprocalRankFusion } from "./rank_fusion";

export class HybridRetriever {
  private lexicalScorer = new LexicalScorer();

  constructor(
    private db: MemoryDatabase,
    private embeddingProvider: EmbeddingProvider,
    private config: MemoryConfig
  ) {}

  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<RetrievedContext[]> {
    const limit = options.limit ?? this.config.defaultResultLimit;
    const candidateLimit =
      options.candidateLimit ?? this.config.candidateLimit;
    const intent = options.intent || inferQueryIntent(query);

    // 1. Generate query embedding
    const queryVector = await this.embeddingProvider.embedQuery({
      query,
      intent,
    });

    // 2. Fetch all chunks and memories with embeddings from SQLite
    const chunks = this.db.getAllChunksWithEmbeddings();
    const memories = this.db.getAllMemoriesWithEmbeddings();

    // 3. Semantic scoring (Cosine similarity)
    const semanticChunkMatches: Array<{
      id: string;
      score: number;
      sourceType: string;
      chunk: ChunkRecord & { filepath: string; fileType: string };
    }> = [];

    for (const chunk of chunks) {
      if (!chunk.embedding) continue;
      const score = cosineSimilarity(queryVector, chunk.embedding);
      if (score >= this.config.minSimilarityThreshold) {
        semanticChunkMatches.push({
          id: chunk.id,
          score,
          sourceType: chunk.sourceType,
          chunk,
        });
      }
    }

    const semanticMemoryMatches: Array<{
      id: string;
      score: number;
      sourceType: string;
      memory: MemoryRecord;
    }> = [];

    for (const memory of memories) {
      if (!memory.embedding) continue;
      const score = cosineSimilarity(queryVector, memory.embedding);
      if (score >= this.config.minSimilarityThreshold) {
        semanticMemoryMatches.push({
          id: memory.id,
          score,
          sourceType: memory.memoryType,
          memory,
        });
      }
    }

    // Sort semantic matches
    const allSemanticMatches = [
      ...semanticChunkMatches,
      ...semanticMemoryMatches,
    ].sort((a, b) => b.score - a.score);

    // 4. Lexical scoring
    const lexicalMatches: Array<{
      id: string;
      score: number;
      sourceType: string;
    }> = [];

    for (const chunk of chunks) {
      const match = this.lexicalScorer.scoreText(
        query,
        chunk.id,
        chunk.content,
        chunk.symbolName,
        chunk.heading
      );
      if (match) {
        lexicalMatches.push({
          id: chunk.id,
          score: match.score,
          sourceType: chunk.sourceType,
        });
      }
    }

    for (const memory of memories) {
      const match = this.lexicalScorer.scoreText(
        query,
        memory.id,
        memory.content,
        memory.title
      );
      if (match) {
        lexicalMatches.push({
          id: memory.id,
          score: match.score,
          sourceType: memory.memoryType,
        });
      }
    }

    lexicalMatches.sort((a, b) => b.score - a.score);

    // 5. Graph / Architectural Relation Traversal
    const graphMatches: Array<{
      id: string;
      score: number;
      sourceType: string;
    }> = [];

    const allRelations = this.db.getAllRelations();
    const queryTokens = query.toLowerCase().split(/\s+/);

    for (const rel of allRelations) {
      const mentionsFrom = queryTokens.some((t) =>
        rel.fromId.toLowerCase().includes(t)
      );
      const mentionsTo = queryTokens.some((t) =>
        rel.toId.toLowerCase().includes(t)
      );

      if (mentionsFrom || mentionsTo) {
        // Boost chunks matching either node
        for (const chunk of chunks) {
          if (
            chunk.symbolName === rel.fromId ||
            chunk.symbolName === rel.toId ||
            chunk.content.includes(rel.fromId) ||
            chunk.content.includes(rel.toId)
          ) {
            graphMatches.push({
              id: chunk.id,
              score: rel.weight * (rel.confidence || 1.0),
              sourceType: "architecture",
            });
          }
        }
      }
    }

    // 6. Reciprocal Rank Fusion (RRF)
    const fusedRankings = reciprocalRankFusion(
      allSemanticMatches.slice(0, candidateLimit),
      lexicalMatches.slice(0, candidateLimit),
      graphMatches.slice(0, candidateLimit),
      intent,
      this.config.rrfConstant
    );

    // 7. Map back to full RetrievedContext structures
    const chunkMap = new Map<string, (typeof chunks)[0]>();
    chunks.forEach((c) => chunkMap.set(c.id, c));

    const memoryMap = new Map<string, MemoryRecord>();
    memories.forEach((m) => memoryMap.set(m.id, m));

    const candidatePool: RetrievedContext[] = [];

    for (const ranked of fusedRankings) {
      const chunk = chunkMap.get(ranked.id);
      if (chunk) {
        // Fetch related graph edges if any
        let relatedNodes: RetrievedContext["relatedNodes"];
        if (chunk.symbolName) {
          const rels = this.db.getRelationsForNode(chunk.symbolName);
          if (rels.length > 0) {
            relatedNodes = rels.map((r) => ({
              relation: r.relation,
              targetId: r.fromId === chunk.symbolName ? r.toId : r.fromId,
              weight: r.weight,
            }));
          }
        }

        candidatePool.push({
          id: chunk.id,
          filepath: chunk.filepath,
          sourceType: chunk.sourceType,
          memoryType: "source_code",
          modality: chunk.sourceType === "code" ? "code" : "text",
          content: chunk.content,
          symbol: chunk.symbolName,
          symbolKind: chunk.symbolKind,
          heading: chunk.heading,
          startLine: chunk.startLine,
          endLine: chunk.endLine,
          semanticScore: ranked.semanticScore,
          lexicalScore: ranked.lexicalScore,
          graphScore: ranked.graphScore,
          finalScore: ranked.finalScore,
          reason: ranked.reason,
          relatedNodes,
        });
      } else {
        const memory = memoryMap.get(ranked.id);
        if (memory) {
          candidatePool.push({
            id: memory.id,
            sourceType: "experiential",
            memoryType: memory.memoryType,
            modality: memory.modality,
            content: memory.content,
            symbol: memory.title,
            symbolKind: memory.memoryType,
            semanticScore: ranked.semanticScore,
            lexicalScore: ranked.lexicalScore,
            finalScore: ranked.finalScore,
            reason: ranked.reason,
            metadata: memory.metadata,
          });
        }
      }
    }

    // 8. Filter for diversity and same-file saturation limits
    const diverseResults = filterForDiversity(candidatePool, {
      maxPerFile: 2,
      limit,
    });

    return diverseResults;
  }
}
