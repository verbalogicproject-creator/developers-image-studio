import { computeSha256 } from "../scanner";
import { ChunkRecord } from "../types";

export class TextChunker {
  chunk(
    filepath: string,
    content: string,
    fileId: string,
    modelName: string,
    dimensions: number,
    targetChunkTokens = 800
  ): ChunkRecord[] {
    const lines = content.split("\n");
    const chunks: ChunkRecord[] = [];
    const now = Date.now();

    // Group lines into ~800 token / ~3000 character windows with 15% overlap
    const maxChars = targetChunkTokens * 4;
    const overlapChars = Math.floor(maxChars * 0.15);

    let currentLines: string[] = [];
    let currentChars = 0;
    let startLine = 1;
    let chunkIdx = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      currentLines.push(line);
      currentChars += line.length + 1;

      if (currentChars >= maxChars || i === lines.length - 1) {
        const text = currentLines.join("\n");
        const formatted = `// Source: ${filepath} (Lines ${startLine}-${i + 1})\n\n${text}`;

        chunks.push({
          id: `chunk_${fileId}_${chunkIdx++}`,
          fileId,
          chunkIndex: chunkIdx,
          content: formatted,
          contentHash: computeSha256(formatted),
          sourceType: "general_text",
          symbolName: `${filepath}#L${startLine}-${i + 1}`,
          symbolKind: "text_block",
          startLine,
          endLine: i + 1,
          embeddingModel: modelName,
          embeddingDimension: dimensions,
          createdAt: now,
          updatedAt: now,
        });

        // Compute overlap for sliding window
        let overlapLineCount = 0;
        let overlapCharSum = 0;
        for (let j = currentLines.length - 1; j >= 0; j--) {
          overlapCharSum += currentLines[j].length + 1;
          overlapLineCount++;
          if (overlapCharSum >= overlapChars) break;
        }

        startLine = i + 1 - overlapLineCount + 1;
        currentLines = currentLines.slice(currentLines.length - overlapLineCount);
        currentChars = overlapCharSum;
      }
    }

    return chunks;
  }
}
