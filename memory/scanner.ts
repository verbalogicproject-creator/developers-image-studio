import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { MemoryConfig } from "./config";

export interface ScannedFile {
  filepath: string; // Relative to project root
  absolutePath: string;
  fileType: string;
  contentHash: string;
  mtime: number;
  size: number;
  content: string;
}

export function computeSha256(content: string): string {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

export class FileScanner {
  constructor(private config: MemoryConfig) {}

  scan(): ScannedFile[] {
    const results: ScannedFile[] = [];
    this.walk(this.config.projectRoot, results);
    return results;
  }

  private walk(dir: string, results: ScannedFile[]) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path
        .relative(this.config.projectRoot, fullPath)
        .replace(/\\/g, "/");

      if (entry.isDirectory()) {
        if (
          this.config.excludedDirectories.includes(entry.name) ||
          entry.name.startsWith(".")
        ) {
          continue;
        }
        this.walk(fullPath, results);
      } else if (entry.isFile()) {
        if (this.isExcludedFile(entry.name, relativePath)) {
          continue;
        }

        const ext = path.extname(entry.name).toLowerCase();
        if (this.config.supportedExtensions.includes(ext)) {
          try {
            const stats = fs.statSync(fullPath);
            const content = fs.readFileSync(fullPath, "utf8");
            const contentHash = computeSha256(content);

            results.push({
              filepath: relativePath,
              absolutePath: fullPath,
              fileType: ext.replace(/^\./, ""),
              contentHash,
              mtime: Math.floor(stats.mtimeMs),
              size: stats.size,
              content,
            });
          } catch (e) {
            // Ignore unreadable / locked files
          }
        }
      }
    }
  }

  private isExcludedFile(filename: string, relativePath: string): boolean {
    if (this.config.excludedFiles.includes(filename)) return true;
    if (filename.startsWith(".env")) return true;
    if (
      filename.endsWith(".log") ||
      filename.endsWith(".lock") ||
      filename.endsWith(".db") ||
      filename.endsWith(".sqlite")
    ) {
      return true;
    }
    return false;
  }
}
