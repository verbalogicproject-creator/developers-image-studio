export interface LexicalMatch {
  id: string;
  score: number;
  matchedTerms: string[];
}

export class LexicalScorer {
  scoreText(
    query: string,
    id: string,
    content: string,
    symbolName?: string,
    heading?: string
  ): LexicalMatch | null {
    const rawTerms = query
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1);

    if (rawTerms.length === 0) return null;

    const lowerContent = content.toLowerCase();
    const lowerSymbol = (symbolName || "").toLowerCase();
    const lowerHeading = (heading || "").toLowerCase();

    let score = 0;
    const matchedTerms: string[] = [];

    // Exact phrase match bonus
    if (lowerContent.includes(query.toLowerCase())) {
      score += 10.0;
      matchedTerms.push(query);
    }

    for (const term of rawTerms) {
      let termMatched = false;

      // Exact symbol match is heavily weighted
      if (lowerSymbol === term) {
        score += 8.0;
        termMatched = true;
      } else if (lowerSymbol.includes(term)) {
        score += 4.0;
        termMatched = true;
      }

      // Heading match
      if (lowerHeading.includes(term)) {
        score += 3.0;
        termMatched = true;
      }

      // Content term frequency
      const occurrences = this.countOccurrences(lowerContent, term);
      if (occurrences > 0) {
        score += Math.min(occurrences * 0.5, 3.0);
        termMatched = true;
      }

      if (termMatched) {
        matchedTerms.push(term);
      }
    }

    if (score === 0) return null;

    return {
      id,
      score,
      matchedTerms,
    };
  }

  private countOccurrences(text: string, sub: string): number {
    let count = 0;
    let pos = 0;
    while ((pos = text.indexOf(sub, pos)) !== -1) {
      count++;
      pos += sub.length;
      if (count >= 10) break; // Cap count to avoid runaway
    }
    return count;
  }
}
