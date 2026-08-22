#!/usr/bin/env tsx
/**
 * Local Multimodal Project Memory OS — Interactive TUI & CLI Engine
 * Fast, local-first retrieval & project memory operating system for Termux & Node.js
 */

import fs from "node:fs";
import path from "node:path";
import cron from "node-cron";
import prompts from "prompts";
import { MemoryEngine } from "./engine";

interface AutomationConfig {
  enabled: boolean;
  schedule: string; // e.g. "0 20 * * *"
  lastRun?: number;
}

const AUTOMATION_FILE = path.join(process.cwd(), ".memory", "automation.json");

function loadAutomationConfig(): AutomationConfig {
  try {
    if (fs.existsSync(AUTOMATION_FILE)) {
      return JSON.parse(fs.readFileSync(AUTOMATION_FILE, "utf8"));
    }
  } catch (e) {}
  return {
    enabled: false,
    schedule: "0 20 * * *", // Default daily at 20:00
  };
}

function saveAutomationConfig(config: AutomationConfig) {
  const dir = path.dirname(AUTOMATION_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(AUTOMATION_FILE, JSON.stringify(config, null, 2), "utf8");
}

function printBanner() {
  console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║             🧠 LOCAL MULTIMODAL MEMORY OS (v2.2)                  ║
║       Local-First • node:sqlite Float32 BLOBs • GraphRAG          ║
║               Termux Android / Node.js Runtime                    ║
╚═══════════════════════════════════════════════════════════════════╝
`);
}

async function handleInteractiveMenu(engine: MemoryEngine) {
  printBanner();

  let keepRunning = true;

  while (keepRunning) {
    const response = await prompts({
      type: "select",
      name: "action",
      message: "Select Memory OS Operation:",
      choices: [
        { title: "🔍 [ Search Memory ]", value: "search" },
        { title: "⚡ [ Manual Ingestion ]", value: "index" },
        { title: "📝 [ Log Session / Note ]", value: "log" },
        { title: "⏱️ [ Automation Config ]", value: "automation" },
        { title: "🕸️ [ Graph Inspector ]", value: "graph" },
        { title: "📊 [ Memory Statistics ]", value: "stats" },
        { title: "🚪 [ Exit ]", value: "exit" },
      ],
      initial: 0,
    });

    if (!response.action || response.action === "exit") {
      keepRunning = false;
      console.log("\n👋 Exiting Memory OS. Goodbye!");
      break;
    }

    console.log("");

    switch (response.action) {
      case "search": {
        const queryPrompt = await prompts({
          type: "text",
          name: "query",
          message: "Enter Search Query:",
          validate: (v) => (v.trim().length > 0 ? true : "Query cannot be empty"),
        });

        if (queryPrompt.query) {
          console.log("\n🔎 Executing Hybrid Rank Fusion Search...\n");
          const start = Date.now();
          const result = await engine.searchFormatted(queryPrompt.query, {}, 3, 4000);
          const elapsed = ((Date.now() - start) / 1000).toFixed(2);
          console.log(result);
          console.log(`\n⚡ Search completed in ${elapsed}s.`);
        }
        break;
      }

      case "index": {
        console.log("⚡ Starting Incremental Ingestion Pipeline...\n");
        const start = Date.now();
        const result = await engine.index((status) => {
          if (status.phase === "chunking") {
            process.stdout.write(
              `\r[${status.current}/${status.total}] ${status.file?.slice(0, 40).padEnd(40)}`
            );
          } else if (status.message) {
            console.log(`\n> ${status.message}`);
          }
        });
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        console.log("\n\n✅ Ingestion Finished:");
        console.log(`   - Files Indexed:   ${result.indexed}`);
        console.log(`   - Files Skipped:   ${result.unchanged} (Unchanged)`);
        console.log(`   - Files Deleted:   ${result.deleted}`);
        console.log(`   - Total Chunks:    ${result.totalChunks}`);
        console.log(`   - Duration:        ${elapsed}s`);
        break;
      }

      case "log": {
        const logPrompt = await prompts([
          {
            type: "text",
            name: "title",
            message: "Title / Subject (Optional):",
          },
          {
            type: "text",
            name: "content",
            message: "Note / Session Summary Content:",
            validate: (v) =>
              v.trim().length > 0 ? true : "Content cannot be empty",
          },
        ]);

        if (logPrompt.content) {
          console.log("\n🧠 Encoding note into 768d semantic vector memory...");
          const memoryId = await engine.ingestText(
            logPrompt.content,
            logPrompt.title || undefined,
            "user_interaction"
          );
          console.log(`✅ Note successfully ingested into SQLite [ID: ${memoryId}]`);
        }
        break;
      }

      case "automation": {
        const autoConfig = loadAutomationConfig();
        console.log("⏱️ Current Automation Status:");
        console.log(`   - Scheduled Ingestion: ${autoConfig.enabled ? "ACTIVE 🟢" : "DISABLED ⚪"}`);
        console.log(`   - Cron Schedule:       ${autoConfig.schedule}`);
        console.log(
          `   - Last Executed:       ${
            autoConfig.lastRun ? new Date(autoConfig.lastRun).toLocaleString() : "Never"
          }\n`
        );

        const autoPrompt = await prompts([
          {
            type: "toggle",
            name: "enabled",
            message: "Enable Background Ingestion Cron?",
            initial: autoConfig.enabled,
            active: "yes",
            inactive: "no",
          },
          {
            type: (prev) => (prev ? "select" : null),
            name: "schedule",
            message: "Select Schedule Frequency:",
            choices: [
              { title: "Daily at 20:00 (0 20 * * *)", value: "0 20 * * *" },
              { title: "Every 4 Hours (0 */4 * * *)", value: "0 */4 * * *" },
              { title: "Every 1 Hour (0 * * * *)", value: "0 * * * *" },
              { title: "Every 30 Minutes (*/30 * * * *)", value: "*/30 * * * *" },
            ],
            initial: 0,
          },
        ]);

        if (typeof autoPrompt.enabled === "boolean") {
          autoConfig.enabled = autoPrompt.enabled;
          if (autoPrompt.schedule) {
            autoConfig.schedule = autoPrompt.schedule;
          }
          saveAutomationConfig(autoConfig);
          console.log("💾 Automation settings saved to .memory/automation.json");
        }
        break;
      }

      case "graph": {
        const relations = engine.getAllRelations();
        console.log(`🕸️ Architectural Graph Relations (${relations.length} edges found):\n`);
        if (relations.length === 0) {
          console.log("No architectural relations indexed. Ensure .ctx files are present.");
        } else {
          relations.forEach((r, idx) => {
            console.log(
              `  [${idx + 1}] ${r.fromId.padEnd(20)} --(${r.relation}, w=${r.weight})--> ${r.toId}`
            );
          });
        }
        break;
      }

      case "stats": {
        const stats = engine.getStats();
        const sizeMb = (stats.dbSizeBytes / (1024 * 1024)).toFixed(2);
        console.log("📊 Project Memory Statistics:");
        console.log(`   - Indexed Files:           ${stats.filesCount}`);
        console.log(`   - Semantic Chunks:         ${stats.chunksCount}`);
        console.log(`   - Experiential Memories:   ${stats.memoriesCount}`);
        console.log(`   - Architectural Relations: ${stats.relationsCount}`);
        console.log(`   - SQLite Database Size:    ${sizeMb} MB`);
        console.log(
          `   - Last Indexed:            ${
            stats.lastIndexedAt
              ? new Date(stats.lastIndexedAt).toLocaleString()
              : "Never"
          }`
        );
        break;
      }
    }

    console.log("\n───────────────────────────────────────────────────────────────────\n");
  }
}

async function handleDirectCli(engine: MemoryEngine, command: string, args: string[]) {
  switch (command) {
    case "search":
    case "query": {
      const queryText = args.join(" ").trim();
      if (!queryText) {
        console.error("Error: Please provide a search query.");
        console.log("Usage: npm run memory -- search \"<query>\"");
        process.exit(1);
      }

      const start = Date.now();
      // Bound output to top 3 matches and 4000 chars max to protect agent context window
      const formattedResult = await engine.searchFormatted(queryText, {}, 3, 4000);
      const elapsed = ((Date.now() - start) / 1000).toFixed(2);

      console.log(formattedResult);
      console.log(`\n⚡ Retrieved in ${elapsed}s via Hybrid Rank Fusion (Semantic + Lexical + Graph).`);
      break;
    }

    case "ingest-text":
    case "log":
    case "ingest-note": {
      const textToIngest = args.join(" ").trim();
      if (!textToIngest) {
        console.error("Error: Please provide text content to ingest.");
        console.log("Usage: npm run memory -- ingest-text \"<markdown_string>\"");
        process.exit(1);
      }

      const memoryId = await engine.ingestText(
        textToIngest,
        undefined,
        "user_interaction"
      );
      console.log(`✅ Successfully encoded and ingested text memory into SQLite.`);
      console.log(`   - Embedding ID: ${memoryId}`);
      console.log(`   - Timestamp:    ${new Date().toISOString()}`);
      break;
    }

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

    case "stats": {
      const stats = engine.getStats();
      const sizeMb = (stats.dbSizeBytes / (1024 * 1024)).toFixed(2);

      console.log("\n📊 Local Multimodal Project Memory Statistics:");
      console.log(`   - Indexed Files:           ${stats.filesCount}`);
      console.log(`   - Semantic Chunks:         ${stats.chunksCount}`);
      console.log(`   - Experiential Memories:   ${stats.memoriesCount}`);
      console.log(`   - Architectural Relations: ${stats.relationsCount}`);
      console.log(`   - SQLite Database Size:    ${sizeMb} MB`);
      console.log(
        `   - Last Indexed:            ${
          stats.lastIndexedAt
            ? new Date(stats.lastIndexedAt).toLocaleString()
            : "Never"
        }\n`
      );
      break;
    }

    case "graph": {
      const relations = engine.getAllRelations();
      console.log(`\n🕸️ Architectural Graph Relations (${relations.length} edges):\n`);
      relations.forEach((r, idx) => {
        console.log(
          `  [${idx + 1}] ${r.fromId.padEnd(20)} --(${r.relation}, w=${r.weight})--> ${r.toId}`
        );
      });
      console.log("");
      break;
    }

    case "cron-runner": {
      const autoConfig = loadAutomationConfig();
      if (!autoConfig.enabled) {
        console.log("Automation is disabled in .memory/automation.json. Exiting.");
        return;
      }
      console.log(`⏰ Starting Background Ingestion Cron Daemon (${autoConfig.schedule})...`);
      cron.schedule(autoConfig.schedule, async () => {
        console.log(`[${new Date().toISOString()}] Running scheduled memory ingestion...`);
        try {
          await engine.index();
          autoConfig.lastRun = Date.now();
          saveAutomationConfig(autoConfig);
          console.log(`[${new Date().toISOString()}] Scheduled ingestion complete.`);
        } catch (e: any) {
          console.error("Scheduled ingestion error:", e.message);
        }
      });
      // Keep process alive for daemon
      break;
    }

    case "help":
    default: {
      console.log(`
🧠 Local Multimodal Project Memory OS CLI

Interactive Mode:
  npm run memory                 Launch the interactive TUI menu

Direct CLI Commands:
  npm run memory -- search "<query>"       Execute hybrid search (Semantic + Lexical + Graph)
  npm run memory -- ingest-text "<text>"   Encode and store note or session handoff summary
  npm run memory -- index                  Incremental scan & index of project files
  npm run memory -- stats                  Display SQLite database size and counts
  npm run memory -- graph                  Inspect .ctx architectural relations graph
  npm run memory -- cron-runner            Start background scheduled ingestion daemon
  npm run memory -- help                   Display this help manual
`);
      break;
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const engine = new MemoryEngine();

  try {
    if (args.length === 0) {
      await handleInteractiveMenu(engine);
    } else {
      await handleDirectCli(engine, args[0], args.slice(1));
    }
  } catch (err: any) {
    console.error("\n❌ Memory OS Error:", err.message);
    process.exit(1);
  } finally {
    if (args[0] !== "cron-runner") {
      engine.close();
    }
  }
}

main();
