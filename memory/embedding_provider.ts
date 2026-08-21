import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI } from "@google/genai";
import {
  DocumentEmbeddingInput,
  EmbeddingProvider,
  QueryEmbeddingInput,
} from "./types";

export class GeminiEmbeddingProvider implements EmbeddingProvider {
  private ai: GoogleGenAI;
  readonly modelName: string;
  readonly dimensions: number;

  constructor(
    apiKey?: string,
    modelName = "gemini-embedding-2",
    dimensions = 768
  ) {
    let resolvedApiKey = apiKey || process.env.GEMINI_API_KEY;

    if (!resolvedApiKey) {
      // Attempt loading from .env.local in project root
      const envPath = path.join(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf8");
        const match = content.match(/GEMINI_API_KEY=(.+)/);
        if (match && match[1]) {
          resolvedApiKey = match[1].trim().replace(/^["']|["']$/g, "");
        }
      }
    }

    if (!resolvedApiKey) {
      throw new Error(
        "GEMINI_API_KEY is not set. Please set GEMINI_API_KEY in your environment or .env.local."
      );
    }

    this.ai = new GoogleGenAI({ apiKey: resolvedApiKey });
    this.modelName = modelName;
    this.dimensions = dimensions;
  }

  async embedDocument(input: DocumentEmbeddingInput): Promise<Float32Array> {
    let textToEmbed = input.text;
    if (input.context || input.symbol) {
      const headerParts: string[] = [];
      if (input.title) headerParts.push(`source: ${input.title}`);
      if (input.symbol) headerParts.push(`symbol: ${input.symbol}`);
      if (input.context) headerParts.push(`context: ${input.context}`);
      textToEmbed = `${headerParts.join(" | ")}\n\n${input.text}`;
    }

    return this.embedWithRetry(
      textToEmbed,
      "RETRIEVAL_DOCUMENT",
      input.title || input.symbol || "Document"
    );
  }

  async embedQuery(input: QueryEmbeddingInput): Promise<Float32Array> {
    const isCode =
      input.isCodeQuery ||
      input.intent === "exact_symbol" ||
      input.intent === "implementation";

    const taskType = isCode ? "CODE_RETRIEVAL_QUERY" : "RETRIEVAL_QUERY";
    return this.embedWithRetry(input.query, taskType);
  }

  private async embedWithRetry(
    text: string,
    taskType: string,
    title?: string,
    maxRetries = 3
  ): Promise<Float32Array> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const config: Record<string, unknown> = {
          taskType,
          outputDimensionality: this.dimensions,
        };
        if (title && taskType === "RETRIEVAL_DOCUMENT") {
          config.title = title;
        }

        const response = await this.ai.models.embedContent({
          model: this.modelName,
          contents: text,
          config,
        });

        const values = response.embeddings?.[0]?.values;

        if (!values || values.length === 0) {
          throw new Error("API returned an empty embedding vector.");
        }

        return new Float32Array(values);
      } catch (err: any) {
        attempt++;
        if (attempt >= maxRetries) {
          throw new Error(
            `Failed to embed text after ${maxRetries} attempts: ${err.message}`
          );
        }
        // Exponential backoff
        await new Promise((res) => setTimeout(res, 500 * Math.pow(2, attempt)));
      }
    }

    throw new Error("Unexpected embedding execution error.");
  }
}
