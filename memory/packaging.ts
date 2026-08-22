import { RetrievedContext } from "./types";

export function packageContextForAgent(
  query: string,
  contexts: RetrievedContext[],
  maxItems = 3,
  maxChars = 4000
): string {
  if (contexts.length === 0) {
    return `### Project Memory Results\n\nNo relevant project memory found for query: "${query}".`;
  }

  // Enforce context window protection limit (top N most relevant chunks)
  const boundedContexts = contexts.slice(0, maxItems);

  const sections: string[] = [
    `# 🧠 Project Memory Retrieval Results`,
    `**Query:** "${query}"`,
    `**Showing Top Matches:** ${boundedContexts.length} of ${contexts.length}`,
    `---`,
  ];

  let currentTotalChars = 0;

  for (let index = 0; index < boundedContexts.length; index++) {
    const ctx = boundedContexts[index];
    const itemNum = index + 1;
    const headerParts: string[] = [
      `### [${itemNum}] ${ctx.symbol || ctx.heading || ctx.filepath || "Context Item"}`,
    ];

    if (ctx.filepath) {
      const lineRange =
        ctx.startLine && ctx.endLine
          ? `#L${ctx.startLine}-L${ctx.endLine}`
          : "";
      headerParts.push(`**File:** \`${ctx.filepath}${lineRange}\``);
    }
    if (ctx.symbolKind) {
      headerParts.push(`**Kind:** \`${ctx.symbolKind}\``);
    }
    if (ctx.reason) {
      headerParts.push(`**Match Reason:** *${ctx.reason}*`);
    }

    if (ctx.relatedNodes && ctx.relatedNodes.length > 0) {
      const edges = ctx.relatedNodes
        .map((r) => `\`${r.relation} -> ${r.targetId}\``)
        .join(", ");
      headerParts.push(`**Architectural Graph Relations:** ${edges}`);
    }

    let bodyBlock = ctx.content;
    // Format into code block if it's code
    if (ctx.sourceType === "code" && !bodyBlock.startsWith("```")) {
      bodyBlock = "```typescript\n" + bodyBlock + "\n```";
    }

    // Truncate overly long individual chunks if needed
    if (bodyBlock.length > 1800) {
      bodyBlock = bodyBlock.slice(0, 1800) + "\n... [truncated for context limit] ...\n```";
    }

    const itemText = headerParts.join("\n") + "\n\n" + bodyBlock;

    if (currentTotalChars + itemText.length > maxChars && index > 0) {
      sections.push(`*... additional matches omitted to protect context window limit.*`);
      break;
    }

    sections.push(itemText);
    sections.push(`---`);
    currentTotalChars += itemText.length;
  }

  return sections.join("\n\n");
}
