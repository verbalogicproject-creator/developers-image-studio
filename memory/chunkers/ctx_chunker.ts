import { computeSha256 } from "../scanner";
import { ChunkRecord, MemoryRelation } from "../types";

export interface CtxParseResult {
  chunks: ChunkRecord[];
  relations: MemoryRelation[];
}

export class CtxChunker {
  parse(
    filepath: string,
    content: string,
    fileId: string,
    modelName: string,
    dimensions: number
  ): CtxParseResult {
    const lines = content.split("\n");
    const chunks: ChunkRecord[] = [];
    const relations: MemoryRelation[] = [];
    const now = Date.now();

    let currentBlock: string[] = [];
    let currentBlockTitle = "Architecture Context";
    let currentBlockKind = "architecture_spec";
    let blockStartLine = 1;
    let chunkIndex = 0;

    const flushBlock = (endLine: number) => {
      if (currentBlock.length === 0) return;
      const text = currentBlock.join("\n").trim();
      if (!text) return;

      const formatted = `// Architecture Specification: ${filepath}\n// Section: ${currentBlockTitle} [${currentBlockKind}]\n\n${text}`;
      chunks.push({
        id: `chunk_${fileId}_${chunkIndex++}`,
        fileId,
        chunkIndex,
        content: formatted,
        contentHash: computeSha256(formatted),
        sourceType: "architecture",
        symbolName: currentBlockTitle,
        symbolKind: currentBlockKind,
        heading: currentBlockTitle,
        startLine: blockStartLine,
        endLine,
        embeddingModel: modelName,
        embeddingDimension: dimensions,
        createdAt: now,
        updatedAt: now,
      });
      currentBlock = [];
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // 1. Explicit Relation syntax parsing: @relation [From] -> relation -> [To] or @relation From controls To
      const relationMatch1 = trimmed.match(
        /^(?:@relation\s+)?\[?([A-Za-z0-9_.-]+)\]?\s*-(?:-|\s*)\s*([A-Za-z0-9_.-]+)\s*(?:->|-->)\s*\[?([A-Za-z0-9_.-]+)\]?(?:\s*\(weight=([0-9.]+)\))?/i
      );
      const relationMatch2 = trimmed.match(
        /^(?:@relation\s+)?([A-Za-z0-9_.-]+)\s+([A-Za-z0-9_.-]+)\s+([A-Za-z0-9_.-]+)(?:\s*\(weight=([0-9.]+)\))?/i
      );

      if (relationMatch1) {
        const fromId = relationMatch1[1];
        const relation = relationMatch1[2];
        const toId = relationMatch1[3];
        const weight = relationMatch1[4] ? parseFloat(relationMatch1[4]) : 1.0;

        relations.push({
          id: `rel_${fromId}_${relation}_${toId}`,
          fromId,
          relation,
          toId,
          source: filepath,
          weight,
          confidence: 1.0,
          createdAt: now,
        });
      } else if (
        relationMatch2 &&
        (trimmed.startsWith("@relation") ||
          /^(controls|produces|persists|renders|calls|validates|synthesizes|transforms|depends_on|extends|bridges_to|indexes|triggers)$/i.test(
            relationMatch2[2]
          ))
      ) {
        const fromId = relationMatch2[1];
        const relation = relationMatch2[2].toLowerCase();
        const toId = relationMatch2[3];
        const weight = relationMatch2[4] ? parseFloat(relationMatch2[4]) : 1.0;

        relations.push({
          id: `rel_${fromId}_${relation}_${toId}`,
          fromId,
          relation,
          toId,
          source: filepath,
          weight,
          confidence: 1.0,
          createdAt: now,
        });
      }

      // 2. Structural block directive recognition: @component, @module, @decision, @constraint, @invariant, @section
      const directiveMatch = trimmed.match(
        /^@(component|module|decision|constraint|invariant|section|dataflow)\s+([A-Za-z0-9_.-]+)/i
      );

      if (directiveMatch) {
        flushBlock(i);
        currentBlockKind = directiveMatch[1].toLowerCase();
        currentBlockTitle = directiveMatch[2].replace(/[{:]$/, "").trim();
        blockStartLine = i + 1;
      }

      currentBlock.push(line);
    }

    flushBlock(lines.length);

    // Fallback if file was flat text
    if (chunks.length === 0) {
      const formatted = `// Architecture Specification: ${filepath}\n\n${content}`;
      chunks.push({
        id: `chunk_${fileId}_0`,
        fileId,
        chunkIndex: 0,
        content: formatted,
        contentHash: computeSha256(formatted),
        sourceType: "architecture",
        symbolName: filepath,
        symbolKind: "architecture_spec",
        startLine: 1,
        endLine: lines.length,
        embeddingModel: modelName,
        embeddingDimension: dimensions,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { chunks, relations };
  }
}
