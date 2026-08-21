import { RetrievalIntent } from "../types";

export function inferQueryIntent(query: string): RetrievalIntent {
  const lower = query.toLowerCase();

  // 1. Exact Symbol / Definition query
  if (
    lower.includes("where is") ||
    lower.includes("defined") ||
    lower.includes("definition of") ||
    lower.includes("find symbol") ||
    lower.includes("interface ") ||
    lower.includes("type ") ||
    lower.includes("function ") ||
    lower.includes("class ") ||
    /\b(compileStudioPrompt|OrchestratorTab|StudioTab|useStudioStore|CanvasMask|PromptPreview|Gallery)\b/.test(
      query
    )
  ) {
    return "exact_symbol";
  }

  // 2. Architectural query
  if (
    lower.includes("architecture") ||
    lower.includes("design") ||
    lower.includes("invariant") ||
    lower.includes("constraint") ||
    lower.includes("data flow") ||
    lower.includes("decision") ||
    lower.includes("component relationship") ||
    lower.includes(".ctx") ||
    lower.includes("boundary")
  ) {
    return "architecture";
  }

  // 3. Experiential / History / Generation query
  if (
    lower.includes("previous generation") ||
    lower.includes("past prompt") ||
    lower.includes("what prompt worked") ||
    lower.includes("history") ||
    lower.includes("previous runs") ||
    lower.includes("generation settings") ||
    lower.includes("skincare prompt") ||
    lower.includes("wine prompt") ||
    lower.includes("social post prompt")
  ) {
    return "generation";
  }

  // 4. Documentation query
  if (
    lower.includes("how to use") ||
    lower.includes("user guide") ||
    lower.includes("manual") ||
    lower.includes("readme") ||
    lower.includes("docs") ||
    lower.includes("quick start")
  ) {
    return "documentation";
  }

  // 5. Implementation / Code query
  if (
    lower.includes("how does") ||
    lower.includes("how is") ||
    lower.includes("implementation") ||
    lower.includes("code for") ||
    lower.includes("logic") ||
    lower.includes("compiler")
  ) {
    return "implementation";
  }

  return "general";
}
