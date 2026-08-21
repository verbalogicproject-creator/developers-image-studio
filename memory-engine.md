# Local Multimodal Project Memory Engine — Reference Manual 🧠

A comprehensive guide to the architecture, usage, maintenance, CLI commands, and programmatic APIs of the **Local Multimodal Project Memory Engine** built for `Imagen Nano Banana Image Studio v2` and the Antigravity AI orchestration framework.

---

## 📑 Table of Contents
1. [Core Philosophy & Architecture](#1-core-philosophy--architecture)
2. [The 4 Memory Classes](#2-the-4-memory-classes)
3. [Termux & Local Performance Characteristics](#3-termux--local-performance-characteristics)
4. [CLI Command Reference](#4-cli-command-reference)
5. [Programmatic TypeScript API](#5-programmatic-typescript-api)
6. [Retrieval Mechanics & Hybrid Rank Fusion (RRF)](#6-retrieval-mechanics--hybrid-rank-fusion-rrf)
7. [Semantic Code & Architectural Chunkers](#7-semantic-code--architectural-chunkers)
8. [Authoritative Architectural Memory (`.ctx`) & GraphRAG](#8-authoritative-architectural-memory-ctx--graphrag)
9. [Experiential & Multimodal Memory Ingestion](#9-experiential--multimodal-memory-ingestion)
10. [Database Schema & Binary BLOB Storage](#10-database-schema--binary-blob-storage)
11. [Maintenance, Updating & Troubleshooting](#11-maintenance-updating--troubleshooting)

---

## 1. Core Philosophy & Architecture

The Local Multimodal Project Memory Engine is a self-contained, deterministic, local-first retrieval layer. Unlike external vector databases (such as Pinecone, Chroma, Milvus, or Qdrant) that require Docker or background daemons, this engine runs entirely within the Node.js runtime on local SQLite (`node:sqlite`).

```
                               User / AI Agent Query
                                         │
                       ┌─────────────────┴─────────────────┐
                       ▼                                   ▼
         Query Intent Classification             Gemini Embedding (768d)
         (exact_symbol, architecture,             (gemini-embedding-2)
          history, implementation, etc.)                   │
                       │                                   ▼
       ┌───────────────┼───────────────┐           Cosine Similarity Loop
       ▼               ▼               ▼           (Pure TS Float32Array)
  Lexical / FTS5   Graph Traversal  Source Boost           │
    Exact Match    (.ctx Relations)  (Authority)           │
       └───────────────┬───────────────┘                   │
                       ▼                                   ▼
                 ┌───────────────────────────────────────────────┐
                 │ Reciprocal Rank Fusion (RRF) & Score Blending │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                        Diversity / Saturation Control
                                         ▼
                     Structured Context Package with Provenance
```

---

## 2. The 4 Memory Classes

The engine treats project memory as four distinct, interconnected categories:

| Memory Class | Format / Sources | Purpose | Example Questions Answered |
| :--- | :--- | :--- | :--- |
| **1. Source Memory** | `.ts`, `.tsx`, `.js`, `.jsx`, `.json` | Project code, AST symbols, functions, components, hooks, type interfaces, and configuration. | *"Where is compileStudioPrompt implemented?"*, *"Which component handles touch inpainting?"* |
| **2. Architectural Memory** | `.ctx`, `.yaml`, `.mmd`, `README.md` | Authoritative design specifications, decisions, constraints, invariants, and component relations. | *"How does Dual-Pipeline branching work?"*, *"What are the invariants for Gemini Nano Banana?"* |
| **3. Experiential Memory** | Live generation runs from `/api/generate` | Original user intents, compiled XML prompts, domain settings, lighting setups, aspect ratios, and refinement chains. | *"What prompt structure worked previously for deep tech?"*, *"Find my past wine cellar generations."* |
| **4. Multimodal Memory** | Shared 768d vector space | Unified semantic embedding space bridging textual code, architectural graphs, prompt metadata, and generated image representations. | Multi-modal association between prompt concepts and visual features. |

---

## 3. Termux & Local Performance Characteristics

* **Zero External Services:** Runs on Node v24 built-in `node:sqlite` (`DatabaseSync`). No Python sidecars, no Docker, and no native compilation hurdles.
* **Packed Binary BLOB Vector Storage:** Float32 vectors (768 dimensions) are stored directly as binary bytes (`Buffer.from(vector.buffer)`). Zero JSON stringification or array serialization overhead.
* **Pure TypeScript Cosine Math:** Zero-allocation indexed loop computing dot products and magnitudes directly over Float32Array memory.
* **Low RAM & Storage Footprint:** The entire codebase database (48 files, 181 chunks, 17 graph relations) occupies only **~1.6 MB** on disk.
* **Instant Cold Start:** Searches execute in **< 0.8 seconds**; incremental re-indexing of unchanged projects takes **< 1.5 seconds**.

---

## 4. CLI Command Reference

The memory engine provides a CLI executable via `npm run memory -- <command>` (or `npx tsx memory/cli.ts <command>`).

### 1. Incremental Indexing (`index`)
Recursively scans the project, computes SHA-256 hashes, and indexes new or modified files. Unchanged files are skipped with zero API calls.

```bash
npm run memory -- index
```

**Output:**
```
🧠 Starting Incremental Indexing for Project Memory Engine...

> Scanning project directory...
> Indexing complete. 48 indexed, 0 unchanged, 0 deleted.

✅ Indexing Summary:
   - Files Indexed:   48
   - Files Skipped:   0 (Unchanged)
   - Files Removed:   0
   - Total Chunks:    181
   - Duration:        84.0s
```

### 2. Hybrid Search & Retrieval (`search` or `query`)
Executes intent-aware hybrid search (Semantic + Lexical + GraphRAG) and outputs formatted context with file line ranges and provenance reasons.

```bash
# Code & symbol lookup
npm run memory -- search "Where is compileStudioPrompt implemented?"

# Architectural spec lookup
npm run memory -- search "How does Dual-Pipeline branching work in architecture?"

# Inpainting implementation lookup
npm run memory -- search "How does touch coordinate scaling work in CanvasMask?"

# Past generation history lookup
npm run memory -- search "Find past generations for deep tech quantum machine"
```

### 3. Engine Statistics (`stats`)
Displays database record counts, semantic chunk counts, graph relations, and disk storage metrics.

```bash
npm run memory -- stats
```

**Output:**
```
📊 Local Multimodal Project Memory Statistics:
   - Indexed Files:         48
   - Semantic Chunks:       181
   - Experiential Memories: 1
   - Architectural Relations: 17
   - SQLite Database Size:  1.59 MB
   - Last Indexed:          8/21/2026, 10:41:13 PM
```

### 4. Help Manual (`help`)
```bash
npm run memory -- help
```

---

## 5. Programmatic TypeScript API

You can import and interact with `MemoryEngine` directly inside Next.js API routes, server components, or custom scripts:

### Basic Retrieval Example:
```typescript
import { MemoryEngine } from "@/memory/engine";

async function getProjectContext() {
  const engine = new MemoryEngine();

  // Returns structured markdown packaged for LLM consumption
  const contextPackage = await engine.searchFormatted(
    "How does the visual prompt compiler work?",
    { limit: 5 }
  );

  console.log(contextPackage);

  engine.close();
}
```

### Raw Structured Result Access:
```typescript
import { MemoryEngine } from "@/memory/engine";

const engine = new MemoryEngine();

const results = await engine.search("OrchestratorTab", {
  limit: 3,
  minScore: 0.3,
});

results.forEach((item) => {
  console.log(`File: ${item.filepath}#L${item.startLine}-L${item.endLine}`);
  console.log(`Symbol: ${item.symbol} (${item.symbolKind})`);
  console.log(`Semantic Cosine: ${item.semanticScore}`);
  console.log(`Final RRF Score: ${item.finalScore}`);
  console.log(`Reason: ${item.reason}`);
  console.log(`Graph Edges:`, item.relatedNodes);
});

engine.close();
```

---

## 6. Retrieval Mechanics & Hybrid Rank Fusion (RRF)

### 1. Intent Classification (`memory/retrieval/intent.ts`)
The query is analyzed through deterministic heuristics into one of six intents:
* `exact_symbol`: Direct identifier queries (e.g. *"Where is compileStudioPrompt defined?"*). Boosts exact symbol and lexical scoring by **2.5x**.
* `architecture`: Invariant and design queries. Boosts `.ctx` chunks and graph relations by **2.2x**.
* `implementation`: Logic questions. Boosts code AST chunks by **1.5x**.
* `generation` / `history`: Queries regarding past image prompts. Boosts experiential memory records by **2.5x**.
* `documentation`: Walkthrough and guide questions. Boosts markdown chunks by **1.8x**.
* `general`: Balanced fallback weighting.

### 2. Reciprocal Rank Fusion (RRF) (`memory/retrieval/rank_fusion.ts`)
Combines candidate ranks using the standard reciprocal rank formula:
$$\text{Score} = \sum \frac{\text{Weight}_i}{k + \text{Rank}_i} \quad (k = 60)$$

### 3. Diversity & Saturation Control (`memory/diversity.ts`)
* **Deduplication:** Filters out identical content chunks.
* **Same-File Saturation:** Caps maximum chunks from any single file to **2** (unless an exact symbol match is detected), ensuring context diversity across different files.

---

## 7. Semantic Code & Architectural Chunkers

Rather than splitting files by arbitrary character limits, the engine uses dedicated AST and syntactic parsers:

1. **TypeScript/JavaScript AST Chunker (`memory/chunkers/code_chunker.ts`):**
   * Recognizes top-level declarations (`function`, `class`, `interface`, `type`, `React.FC`, `customHook`, `enum`).
   * Captures leading JSDoc comments, symbol names, symbol kinds, line ranges, and imports context.
2. **Markdown Heading Chunker (`memory/chunkers/markdown_chunker.ts`):**
   * Maintains a heading stack (`# H1 > ## H2 > ### H3`).
   * Emits chunks preserving complete breadcrumb context paths.
3. **Authoritative `.ctx` Chunker (`memory/chunkers/ctx_chunker.ts`):**
   * Parses architectural blocks (`@component`, `@module`, `@decision`, `@invariant`, `@constraint`).
   * Extracts GraphRAG relationship edges (`@relation [From] -> relation -> [To]`).
4. **Fallback Sliding Window Chunker (`memory/chunkers/text_chunker.ts`):**
   * Standard 800–1200 token windows with 15% sliding overlap along paragraph and sentence boundaries.

---

## 8. Authoritative Architectural Memory (`.ctx`) & GraphRAG

The file [`image-studio.architecture.ctx`](file:///root/image-studio/image-studio.architecture.ctx) defines the official design graph and invariants of the application.

### Syntax Reference:
```ctx
// Component definition
@component StudioTab {
  responsibility: "Primary generation interface..."
  state_dependencies: ["useStudioStore.pipelineMode"]
}

// Explicit Graph Relations (GraphRAG)
@relation OrchestratorTab controls MasterPipeline (weight=1.5)
@relation StudioTab triggers PromptCompiler (weight=1.5)
@relation PromptCompiler produces CompiledPrompt (weight=1.5)
@relation GenerateApiRoute calls GeminiNanoBanana (weight=1.5)
@relation Gallery persists GenerationRecord (weight=1.3)
@relation Gallery bridges_to CanvasMask (weight=1.2)

// Architectural Decisions
@decision DualPipelineBranching {
  context: "E-commerce needs different directives than viral social media."
  decision: "Split compiler and UI into E-Commerce vs Social Editorial."
}

// Invariants
@invariant GeminiNanoBananaOnly {
  rule: "Always target gemini-3.1-flash-image via generateContent."
}
```

When queried, the hybrid retriever traverses these relations and returns connected nodes alongside the code.

---

## 9. Experiential & Multimodal Memory Ingestion

### Automatic Ingestion in `/api/generate`:
Whenever an image generation request completes in [`app/api/generate/route.ts`](file:///root/image-studio/app/api/generate/route.ts), the route automatically calls:

```typescript
const engine = new MemoryEngine();
engine.ingestGenerationMemory({
  id: "gen_1787333210042",
  originalIntent: input.rawPrompt,
  compiledPrompt: compiledPrompt,
  pipelineMode: input.pipelineMode,
  domain: input.domain,
  lighting: input.lighting,
  aspectRatio: input.aspectRatio,
  headlineText: input.headlineText,
  publicationBadge: input.publicationBadge,
  authorBadge: input.authorBadge,
  createdAt: Date.now(),
});
```

This ensures that every generation, prompt iteration, and parameter set becomes instantly retrievable by semantic memory.

---

## 10. Database Schema & Binary BLOB Storage

The SQLite database is located at `.memory/project_memory.db` and contains 4 normalized tables:

```sql
-- 1. Tracked Files
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  filepath TEXT UNIQUE NOT NULL,
  file_type TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  mtime INTEGER NOT NULL,
  size INTEGER NOT NULL,
  indexed_at INTEGER NOT NULL
);

-- 2. Semantic Chunks (Packed Float32Array BLOB)
CREATE TABLE chunks (
  id TEXT PRIMARY KEY,
  file_id TEXT NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  source_type TEXT NOT NULL,
  symbol_name TEXT,
  symbol_kind TEXT,
  heading TEXT,
  start_line INTEGER,
  end_line INTEGER,
  embedding BLOB,
  embedding_model TEXT NOT NULL,
  embedding_dimension INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 3. Experiential & Multimodal Memories
CREATE TABLE memories (
  id TEXT PRIMARY KEY,
  memory_type TEXT NOT NULL,
  modality TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata TEXT,
  embedding BLOB,
  embedding_model TEXT NOT NULL,
  embedding_dimension INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 4. Architectural Graph Relations
CREATE TABLE relations (
  id TEXT PRIMARY KEY,
  from_id TEXT NOT NULL,
  relation TEXT NOT NULL,
  to_id TEXT NOT NULL,
  source TEXT NOT NULL,
  weight REAL NOT NULL DEFAULT 1.0,
  confidence REAL DEFAULT 1.0,
  metadata TEXT,
  created_at INTEGER NOT NULL
);

-- 5. Full-Text Search Virtual Tables
CREATE VIRTUAL TABLE chunks_fts USING fts5(
  chunk_id UNINDEXED,
  filepath UNINDEXED,
  content,
  symbol_name,
  heading,
  tokenize = 'porter unicode61'
);
```

---

## 11. Maintenance, Updating & Troubleshooting

### How to Re-Index After Code Changes:
Whenever you create or modify files, simply run:
```bash
npm run memory -- index
```
The scanner checks SHA-256 hashes and mtimes, embedding **only** the modified files and skipping unchanged files in ~1.3 seconds.

### How to Force a Full Clean Rebuild:
If you modify embedding dimensions or wish to perform a zero-state re-index:
```bash
rm -rf .memory
npm run memory -- index
```

### Security & Exclusions:
The scanner automatically ignores:
* `.env`, `.env.local`, `.env.*` (prevents secret leaks)
* `.git/`, `.next/`, `node_modules/`, `dist/`, `.cache/`, `.memory/`
* Binary files, lockfiles, and debug logs
