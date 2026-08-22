import { RetrievalIntent } from "../types";

export interface RankedCandidate {
  id: string;
  semanticRank?: number;
  semanticScore?: number;
  lexicalRank?: number;
  lexicalScore?: number;
  graphScore?: number;
  sourceType?: string;
  finalScore: number;
  reason: string;
}

export function calculateRRFScore(
  rank: number,
  weight = 1.0,
  k = 60
): number {
  return weight / (k + rank);
}

export function reciprocalRankFusion(
  semanticRankings: Array<{ id: string; score: number; sourceType?: string }>,
  lexicalRankings: Array<{ id: string; score: number; sourceType?: string }>,
  graphRankings: Array<{ id: string; score: number; sourceType?: string }> = [],
  intent: RetrievalIntent = "general",
  k = 60
): RankedCandidate[] {
  const candidateMap = new Map<string, RankedCandidate>();

  // 1. Ingest Semantic rankings
  semanticRankings.forEach((item, rank) => {
    let semanticWeight = 1.0;
    if (intent === "exact_symbol") semanticWeight = 0.6;
    if (intent === "architecture" && item.sourceType === "architecture")
      semanticWeight = 1.5;

    const rrfScore = semanticWeight / (k + rank + 1);

    candidateMap.set(item.id, {
      id: item.id,
      semanticRank: rank + 1,
      semanticScore: item.score,
      sourceType: item.sourceType,
      finalScore: rrfScore,
      reason: `Semantic match (Cosine: ${item.score.toFixed(3)}, Rank: #${
        rank + 1
      })`,
    });
  });

  // 2. Ingest Lexical rankings
  lexicalRankings.forEach((item, rank) => {
    let lexicalWeight = 1.0;
    if (intent === "exact_symbol") lexicalWeight = 2.5;
    if (intent === "implementation") lexicalWeight = 1.3;

    const rrfScore = lexicalWeight / (k + rank + 1);

    const existing = candidateMap.get(item.id);
    if (existing) {
      existing.lexicalRank = rank + 1;
      existing.lexicalScore = item.score;
      existing.finalScore += rrfScore;
      existing.reason += ` + Lexical match (Rank: #${rank + 1})`;
    } else {
      candidateMap.set(item.id, {
        id: item.id,
        lexicalRank: rank + 1,
        lexicalScore: item.score,
        sourceType: item.sourceType,
        finalScore: rrfScore,
        reason: `Lexical match (Rank: #${rank + 1})`,
      });
    }
  });

  // 3. Ingest Graph / Architectural Relations rankings
  graphRankings.forEach((item, rank) => {
    let graphWeight = 1.2;
    if (intent === "architecture") graphWeight = 2.2;

    const rrfScore = graphWeight / (k + rank + 1);

    const existing = candidateMap.get(item.id);
    if (existing) {
      existing.graphScore = item.score;
      existing.finalScore += rrfScore;
      existing.reason += ` + Graph Relation connection`;
    } else {
      candidateMap.set(item.id, {
        id: item.id,
        graphScore: item.score,
        sourceType: item.sourceType,
        finalScore: rrfScore,
        reason: `Graph architectural relation connection`,
      });
    }
  });

  // 4. Sort descending by combined finalScore
  const sorted = Array.from(candidateMap.values()).sort(
    (a, b) => b.finalScore - a.finalScore
  );

  return sorted;
}
