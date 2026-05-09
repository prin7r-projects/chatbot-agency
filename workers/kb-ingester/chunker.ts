/**
 * RecursiveCharacterTextSplitter — splits text on natural boundaries
 * with overlap, targeting ~500 tokens per chunk (≈ 2000 chars for English).
 *
 * Based on LangChain's RecursiveCharacterTextSplitter semantics.
 */
const SEPARATORS = ["\n\n", "\n", ". ", "! ", "? ", "; ", ", ", " ", ""];

export interface ChunkResult {
  text: string;
  index: number;
  startChar: number;
  endChar: number;
}

export function splitText(
  text: string,
  options: {
    chunkSize?: number; // target chars per chunk (default 2000)
    chunkOverlap?: number; // overlap chars (default 200)
  } = {},
): ChunkResult[] {
  const { chunkSize = 2000, chunkOverlap = 200 } = options;

  if (text.length <= chunkSize) {
    return [{ text, index: 0, startChar: 0, endChar: text.length }];
  }

  const chunks: ChunkResult[] = [];
  const splits = splitRecursive(text, SEPARATORS, chunkSize);

  let index = 0;
  let current = "";
  let currentStart = 0;
  let lastEnd = 0;

  for (const split of splits) {
    if (current.length + split.length > chunkSize && current.length > 0) {
      chunks.push({
        text: current.trim(),
        index,
        startChar: currentStart,
        endChar: lastEnd,
      });
      index++;

      // Overlap: keep last chunkOverlap chars of current
      const overlapStart = Math.max(0, current.length - chunkOverlap);
      current = current.slice(overlapStart);
      currentStart = currentStart + overlapStart;
    }

    current += current.length > 0 ? split : split;
    lastEnd += split.length;
  }

  if (current.trim().length > 0) {
    chunks.push({
      text: current.trim(),
      index,
      startChar: currentStart,
      endChar: lastEnd,
    });
  }

  return chunks;
}

function splitRecursive(
  text: string,
  separators: string[],
  chunkSize: number,
): string[] {
  const sep = separators[0];
  if (!sep || sep === "") {
    // Final fallback: character-level split
    const results: string[] = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      results.push(text.slice(i, i + chunkSize));
    }
    return results;
  }

  const splits = text.split(sep);
  const results: string[] = [];

  for (let i = 0; i < splits.length; i++) {
    const piece = splits[i];
    if (piece.length <= chunkSize) {
      results.push(i < splits.length - 1 ? piece + sep : piece);
    } else {
      // Recurse with next separator
      const subSplits = splitRecursive(piece, separators.slice(1), chunkSize);
      if (i < splits.length - 1 && subSplits.length > 0) {
        subSplits[subSplits.length - 1] += sep;
      }
      results.push(...subSplits);
    }
  }

  return results;
}
