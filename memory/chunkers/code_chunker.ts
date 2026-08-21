import { computeSha256 } from "../scanner";
import { ChunkRecord } from "../types";

export interface ParsedCodeChunk {
  content: string;
  symbolName?: string;
  symbolKind?: string;
  heading?: string;
  startLine: number;
  endLine: number;
}

export class CodeChunker {
  chunk(
    filepath: string,
    content: string,
    fileId: string,
    modelName: string,
    dimensions: number
  ): ChunkRecord[] {
    const lines = content.split("\n");
    const parsedChunks = this.parseSemanticSymbols(filepath, lines, content);
    const now = Date.now();

    return parsedChunks.map((c, idx) => ({
      id: `chunk_${fileId}_${idx}`,
      fileId,
      chunkIndex: idx,
      content: c.content,
      contentHash: computeSha256(c.content),
      sourceType: "code",
      symbolName: c.symbolName,
      symbolKind: c.symbolKind,
      heading: c.heading,
      startLine: c.startLine,
      endLine: c.endLine,
      embeddingModel: modelName,
      embeddingDimension: dimensions,
      createdAt: now,
      updatedAt: now,
    }));
  }

  private parseSemanticSymbols(
    filepath: string,
    lines: string[],
    rawContent: string
  ): ParsedCodeChunk[] {
    const chunks: ParsedCodeChunk[] = [];
    const totalLines = lines.length;

    // Detect imports header to provide context
    const importsHeaderLines: string[] = [];
    let lineIdx = 0;
    while (lineIdx < totalLines) {
      const line = lines[lineIdx].trim();
      if (
        line.startsWith("import ") ||
        line.startsWith("export * from") ||
        line.startsWith('"use client"') ||
        line.startsWith("'use client'")
      ) {
        importsHeaderLines.push(lines[lineIdx]);
        lineIdx++;
      } else if (line === "" || line.startsWith("//")) {
        lineIdx++;
      } else {
        break;
      }
    }

    const importsHeader =
      importsHeaderLines.length > 0 && importsHeaderLines.length <= 15
        ? importsHeaderLines.join("\n")
        : "";

    // Regex patterns for TypeScript/JavaScript symbols
    const symbolRegex =
      /^(?:export\s+)?(?:async\s+)?(?:default\s+)?(?:function|class|interface|type|enum|const|let|var)\s+([A-Za-z0-9_$]+)/;
    const reactComponentRegex =
      /^(?:export\s+)?const\s+([A-Za-z0-9_$]+)\s*(?::\s*React\.FC|<[^>]+>)?\s*=/;
    const hookRegex =
      /^(?:export\s+)?(?:function|const)\s+(use[A-Za-z0-9_$]+)/;

    let currentStart = 0;
    let currentSymbol: string | undefined;
    let currentKind: string | undefined;
    let braceDepth = 0;
    let inSymbol = false;
    let symbolStartLine = 1;

    for (let i = 0; i < totalLines; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Check if starting a new top-level symbol (only when braceDepth === 0)
      if (braceDepth === 0) {
        const matchSymbol = line.match(symbolRegex);
        if (matchSymbol) {
          // If we had a previous chunk, finish it
          if (inSymbol && i > currentStart) {
            const chunkLines = lines.slice(currentStart, i);
            const chunkContent = this.formatChunkContent(
              filepath,
              currentSymbol,
              currentKind,
              importsHeader,
              chunkLines.join("\n")
            );
            chunks.push({
              content: chunkContent,
              symbolName: currentSymbol,
              symbolKind: currentKind,
              startLine: currentStart + 1,
              endLine: i,
            });
          }

          currentStart = i;
          currentSymbol = matchSymbol[1];
          currentKind = this.inferKind(line);
          inSymbol = true;
          symbolStartLine = i + 1;
        }
      }

      // Count braces
      for (const char of line) {
        if (char === "{") braceDepth++;
        else if (char === "}") {
          braceDepth = Math.max(0, braceDepth - 1);
        }
      }

      // If a top-level block closed
      if (inSymbol && braceDepth === 0 && (line.includes("}") || line.endsWith(";"))) {
        const chunkLines = lines.slice(currentStart, i + 1);
        if (chunkLines.length >= 3 || i === totalLines - 1) {
          const chunkContent = this.formatChunkContent(
            filepath,
            currentSymbol,
            currentKind,
            importsHeader,
            chunkLines.join("\n")
          );
          chunks.push({
            content: chunkContent,
            symbolName: currentSymbol,
            symbolKind: currentKind,
            startLine: currentStart + 1,
            endLine: i + 1,
          });
          inSymbol = false;
          currentStart = i + 1;
          currentSymbol = undefined;
          currentKind = undefined;
        }
      }
    }

    // Capture remaining lines
    if (currentStart < totalLines) {
      const remainingLines = lines.slice(currentStart);
      if (remainingLines.join("").trim().length > 0) {
        const chunkContent = this.formatChunkContent(
          filepath,
          currentSymbol,
          currentKind,
          importsHeader,
          remainingLines.join("\n")
        );
        chunks.push({
          content: chunkContent,
          symbolName: currentSymbol,
          symbolKind: currentKind || "module_fragment",
          startLine: currentStart + 1,
          endLine: totalLines,
        });
      }
    }

    // Fallback: If no symbols were detected (e.g. small file or json), chunk entire file
    if (chunks.length === 0) {
      chunks.push({
        content: `// File: ${filepath}\n${rawContent}`,
        symbolName: filepath,
        symbolKind: "file",
        startLine: 1,
        endLine: totalLines,
      });
    }

    return chunks;
  }

  private formatChunkContent(
    filepath: string,
    symbol?: string,
    kind?: string,
    importsHeader?: string,
    body?: string
  ): string {
    const parts: string[] = [`// File: ${filepath}`];
    if (symbol) {
      parts.push(`// Symbol: ${symbol} (${kind || "definition"})`);
    }
    if (importsHeader && importsHeader.trim().length > 0) {
      parts.push(importsHeader);
    }
    if (body) {
      parts.push(body);
    }
    return parts.join("\n\n");
  }

  private inferKind(line: string): string {
    if (line.includes("React.FC") || /const [A-Z][A-Za-z0-9]+\s*=/.test(line)) {
      return "ReactComponent";
    }
    if (line.includes("use") && (line.includes("function use") || line.includes("const use"))) {
      return "CustomHook";
    }
    if (line.includes("interface ")) return "Interface";
    if (line.includes("type ")) return "TypeAlias";
    if (line.includes("enum ")) return "Enum";
    if (line.includes("class ")) return "Class";
    if (line.includes("function ")) return "Function";
    return "ConstantDeclaration";
  }
}
