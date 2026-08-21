import { RetrievedContext } from "./types";

export function packageContextForAgent(
  query: string,
  contexts: RetrievedContext[]
): string {
  if (contexts.length === 0) {
    return `### Project Memory Results\n\nNo relevant project memory found for query: "${query}".`;
  }

  const sections: string[] = [
    `# 🧠 Project Memory Retrieval Results`,
    `**Query:** "${query}"`,
    `**Retrieved Items:** ${contexts.length}`,
    `---`,
  ];

  contexts.forEach((ctx, index) => {
    const itemNum = index + 1;
    const headerParts: string[] = [`### [${itemNum}] ${ctx.symbol || ctx.heading || ctx.filepath || "Context Item"}`];
    
    if (ctx.filepath) {
      const lineRange = ctx.startLine && ctx.endLine ? `#L${ctx.startLine}-L${ctx.endLine}` : "";
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

    sections.push(headerParts.join("\n"));
    sections.push(bodyBlock);
    sections.push(`---`);
  });

  return sections.join("\n\n");
}
