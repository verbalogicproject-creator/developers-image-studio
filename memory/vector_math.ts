/**
 * High-Performance Pure TypeScript Vector Math
 * Zero-allocation cosine similarity and binary SQLite BLOB packing for Float32Array.
 */

export function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) {
    throw new Error(
      `Vector dimension mismatch: vector A is ${a.length}d, vector B is ${b.length}d`
    );
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = a.length;

  for (let i = 0; i < len; i++) {
    const valA = a[i];
    const valB = b[i];
    dot += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function dotProduct(a: Float32Array, b: Float32Array): number {
  if (a.length !== b.length) {
    throw new Error(
      `Vector dimension mismatch: vector A is ${a.length}d, vector B is ${b.length}d`
    );
  }

  let dot = 0;
  const len = a.length;
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
  }
  return dot;
}

export function normalizeVector(a: Float32Array): Float32Array {
  let norm = 0;
  const len = a.length;
  for (let i = 0; i < len; i++) {
    norm += a[i] * a[i];
  }

  if (norm === 0) {
    return new Float32Array(len);
  }

  const invMagnitude = 1 / Math.sqrt(norm);
  const normalized = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    normalized[i] = a[i] * invMagnitude;
  }
  return normalized;
}

/**
 * Converts a Float32Array into a Node.js Buffer for SQLite BLOB storage.
 * Zero stringification or JSON overhead.
 */
export function float32ToBuffer(vector: Float32Array): Buffer {
  return Buffer.from(
    vector.buffer,
    vector.byteOffset,
    vector.byteLength
  );
}

/**
 * Converts an SQLite BLOB Buffer back to a typed Float32Array.
 */
export function bufferToFloat32(buffer: Buffer): Float32Array {
  const byteOffset = buffer.byteOffset;
  const byteLength = buffer.byteLength;
  const arrayBuffer = buffer.buffer.slice(
    byteOffset,
    byteOffset + byteLength
  );
  return new Float32Array(arrayBuffer);
}
