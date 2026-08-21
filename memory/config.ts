import path from "node:path";

export interface MemoryConfig {
  projectRoot: string;
  dbPath: string;
  embeddingModel: string;
  embeddingDimensions: number;
  supportedExtensions: string[];
  excludedDirectories: string[];
  excludedFiles: string[];
  candidateLimit: number;
  defaultResultLimit: number;
  rrfConstant: number;
  minSimilarityThreshold: number;
}

export const DEFAULT_CONFIG: MemoryConfig = {
  projectRoot: process.cwd(),
  dbPath: path.join(process.cwd(), ".memory", "project_memory.db"),
  embeddingModel: "gemini-embedding-2",
  embeddingDimensions: 768,
  supportedExtensions: [
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".md",
    ".mdx",
    ".ctx",
    ".yaml",
    ".yml",
  ],
  excludedDirectories: [
    ".git",
    ".next",
    "node_modules",
    "dist",
    "build",
    "coverage",
    "out",
    ".cache",
    ".memory",
    ".gemini",
  ],
  excludedFiles: [
    ".env",
    ".env.local",
    ".env.production",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
  ],
  candidateLimit: 30,
  defaultResultLimit: 6,
  rrfConstant: 60,
  minSimilarityThreshold: 0.25,
};
