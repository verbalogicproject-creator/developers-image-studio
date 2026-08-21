#!/usr/bin/env tsx
/**
 * Local Multimodal Project Memory Engine — CLI Tool
 * Fast, local-first retrieval & project memory CLI for Termux & Node.js
 */

import { MemoryEngine } from "./engine";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";

  const engine = new MemoryEngine();

  try {
    switch (command) {
      case "index": {
        console.log("🧠 Starting Incremental Indexing for Project Memory Engine...\n");
        const start = Date.now();

        const result = await engine.index((status) => {
          if (status.phase === "chunking") {
            process.stdout.write(
              `\r[${status.current}/${status.total}] ${status.file?.slice(0, 45).padEnd(45)}`
            );
          } else if (status.message) {
            console.log(`\n> ${status.message}`);
          }
        });

        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        console.log("\n");
        console.log("✅ Indexing Summary:");
        console.log(`   - Files Indexed:   ${result.indexed}`);
        console.log(`   - Files Skipped:   ${result.unchanged} (Unchanged)`);
        console.log(`   - Files Removed:   ${result.deleted}`);
        console.log(`   - Total Chunks:    ${result.totalChunks}`);
        console.log(`   - Duration:        ${elapsed}s\n`);
        break;
      }

      case "search":
      case "query": {
        const queryText = args.slice(1).join(" ").trim();
        if (!queryText) {
          console.error("Error: Please provide a search query.");
          console.log("Example: npx tsx memory/cli.ts search \"Where is compileStudioPrompt implemented?\"");
          process.exit(1);
        }

        const start = Date.now();
        const formattedResult = await engine.searchFormatted(queryText);
        const elapsed = ((Date.now() - start) / 1000).toFixed(2);

        console.log(formattedResult);
        console.log(`\n⚡ Retrieved in ${elapsed}s via Hybrid Rank Fusion (Semantic + Lexical + Graph).`);
        break;
      }

      case "stats": {
        const stats = engine.getStats();
        const sizeMb = (stats.dbSizeBytes / (1024 * 1024)).toFixed(2);

        console.log("\n📊 Local Multimodal Project Memory Statistics:");
        console.log(`   - Indexed Files:         ${stats.filesCount}`);
        console.log(`   - Semantic Chunks:       ${stats.chunksCount}`);
        console.log(`   - Experiential Memories: ${stats.memoriesCount}`);
        console.log(`   - Architectural Relations: ${stats.relationsCount}`);
        console.log(`   - SQLite Database Size:  ${sizeMb} MB`);
        console.log(
          `   - Last Indexed:          ${
            stats.lastIndexedAt
              ? new Date(stats.lastIndexedAt).toLocaleString()
              : "Never"
          }\n`
        );
        break;
      }

      case "help":
      default: {
        console.log(`
🧠 Local Multimodal Project Memory Engine CLI

Usage:
  npx tsx memory/cli.ts <command> [options]

Commands:
  index             Recursively scan & incrementally index project files into SQLite
  search <query>    Execute hybrid vector + lexical + GraphRAG search over project memory
  stats             Display memory database counts, chunk sizes, and stats
  help              Show this help manual

Examples:
  npx tsx memory/cli.ts index
  npx tsx memory/cli.ts search "How does dual-pipeline prompt compilation work?"
  npx tsx memory/cli.ts search "Where is packaging typography controlled?"
  npx tsx memory/cli.ts stats
`);
        break;
      }
    }
  } catch (err: any) {
    console.error("\n❌ Memory Engine Error:", err.message);
    process.exit(1);
  } finally {
    engine.close();
  }
}

main();
