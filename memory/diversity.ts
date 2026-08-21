import { RetrievedContext } from "./types";

export interface DiversityOptions {
  maxPerFile?: number;
  limit?: number;
}

export function filterForDiversity(
  candidates: RetrievedContext[],
  options: DiversityOptions = {}
): RetrievedContext[] {
  const maxPerFile = options.maxPerFile ?? 2;
  const limit = options.limit ?? 6;

  const fileCountMap = new Map<string, number>();
  const seenContentHashes = new Set<string>();
  const results: RetrievedContext[] = [];

  for (const item of candidates) {
    if (results.length >= limit) break;

    // Check duplicate content
    const contentKey = (item.filepath || "") + ":" + item.content.slice(0, 100);
    if (seenContentHashes.has(contentKey)) {
      continue;
    }

    // Check same-file saturation limit
    if (item.filepath) {
      const currentCount = fileCountMap.get(item.filepath) || 0;
      // Allow exception if item has a very high lexical exact symbol score
      const isExactSymbol = (item.lexicalScore || 0) >= 8.0;
      if (currentCount >= maxPerFile && !isExactSymbol) {
        continue;
      }
      fileCountMap.set(item.filepath, currentCount + 1);
    }

    seenContentHashes.add(contentKey);
    results.push(item);
  }

  return results;
}
