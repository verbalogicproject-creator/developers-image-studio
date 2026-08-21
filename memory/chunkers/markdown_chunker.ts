import { computeSha256 } from "../scanner";
import { ChunkRecord } from "../types";

export class MarkdownChunker {
  chunk(
    filepath: string,
    content: string,
    fileId: string,
    modelName: string,
    dimensions: number
  ): ChunkRecord[] {
    const lines = content.split("\n");
    const sections: Array<{
      headingPath: string;
      heading: string;
      level: number;
      lines: string[];
      startLine: number;
      endLine: number;
    }> = [];

    const headingStack: Array<{ level: number; text: string }> = [];
    let currentLines: string[] = [];
    let currentStartLine = 1;
    let currentHeading = "Preamble";

    const getHeadingPath = () =>
      headingStack.map((h) => h.text).join(" > ") || "Overview";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();

        if (currentLines.length > 0) {
          sections.push({
            headingPath: getHeadingPath(),
            heading: currentHeading,
            level: headingStack[headingStack.length - 1]?.level || 1,
            lines: [...currentLines],
            startLine: currentStartLine,
            endLine: i,
          });
          currentLines = [];
        }

        // Adjust heading stack based on current level
        while (
          headingStack.length > 0 &&
          headingStack[headingStack.length - 1].level >= level
        ) {
          headingStack.pop();
        }

        headingStack.push({ level, text });
        currentHeading = text;
        currentStartLine = i + 1;
      }

      currentLines.push(line);
    }

    if (currentLines.length > 0) {
      sections.push({
        headingPath: getHeadingPath(),
        heading: currentHeading,
        level: headingStack[headingStack.length - 1]?.level || 1,
        lines: currentLines,
        startLine: currentStartLine,
        endLine: lines.length,
      });
    }

    const now = Date.now();
    return sections.map((sec, idx) => {
      const body = sec.lines.join("\n").trim();
      const formattedContent = `# Document: ${filepath}\n# Section: ${sec.headingPath}\n\n${body}`;

      return {
        id: `chunk_${fileId}_${idx}`,
        fileId,
        chunkIndex: idx,
        content: formattedContent,
        contentHash: computeSha256(formattedContent),
        sourceType: "documentation",
        heading: sec.headingPath,
        symbolName: sec.heading,
        symbolKind: "heading_section",
        startLine: sec.startLine,
        endLine: sec.endLine,
        embeddingModel: modelName,
        embeddingDimension: dimensions,
        createdAt: now,
        updatedAt: now,
      };
    });
  }
}
