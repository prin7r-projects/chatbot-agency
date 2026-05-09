/**
 * KB Ingester Worker — Relayhouse Phase 1
 *
 * Pipeline: fetch source → chunk text → embed via text-embedding-3-small →
 * store in kb_chunks (idempotent on kbId + hash).
 */
import { createHash } from "node:crypto";
import OpenAI from "openai";
import { db, ensurePgvector, schema } from "app/db/drizzle";
import { eq, and } from "drizzle-orm";
import { fetchSource, type SourceKind } from "./fetcher";
import { splitText } from "./chunker";

// ---- Configuration ---------------------------------------------------------

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

const EMBEDDING_MODEL = "text-embedding-3-small";
const BATCH_SIZE = 20; // embed up to 20 chunks per API call

// ---- Types -----------------------------------------------------------------

export interface IngestInput {
  kbId: string;
  sources: Array<{ kind: SourceKind; value: string }>;
}

export interface IngestOutput {
  kbId: string;
  totalChunks: number;
  newChunks: number;
  skippedChunks: number;
  errors: string[];
}

// ---- Core pipeline ---------------------------------------------------------

export async function ingest(input: IngestInput): Promise<IngestOutput> {
  await ensurePgvector();

  const output: IngestOutput = {
    kbId: input.kbId,
    totalChunks: 0,
    newChunks: 0,
    skippedChunks: 0,
    errors: [],
  };

  for (const source of input.sources) {
    try {
      const result = await processSource(input.kbId, source.kind, source.value);
      output.totalChunks += result.total;
      output.newChunks += result.newCount;
      output.skippedChunks += result.skipped;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      output.errors.push(`[${source.kind}:${source.value}] ${msg}`);
      console.error(`[kb-ingester] error processing ${source.kind}:${source.value}:`, msg);
    }
  }

  // Update last_ingest_at on the knowledge base
  if (output.newChunks > 0) {
    await db
      .update(schema.knowledgeBases)
      .set({ lastIngestAt: new Date() })
      .where(eq(schema.knowledgeBases.id, input.kbId));
  }

  return output;
}

async function processSource(
  kbId: string,
  kind: SourceKind,
  value: string,
): Promise<{ total: number; newCount: number; skipped: number }> {
  // 1. Fetch
  console.log(`[kb-ingester] fetching ${kind}: ${value}`);
  const fetched = await fetchSource(kind, value);

  // 2. Chunk
  const chunks = splitText(fetched.text, {
    chunkSize: 2000,
    chunkOverlap: 200,
  });
  console.log(`[kb-ingester] chunked into ${chunks.length} pieces`);

  // 3. Embed in batches
  const embeddings = await embedBatch(chunks.map((c) => c.text));

  // 4. Store with idempotency
  let newCount = 0;
  let skipped = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = embeddings[i];
    const hash = sha256(chunk.text);

    // Idempotency check
    const existing = await db
      .select({ id: schema.kbChunks.id })
      .from(schema.kbChunks)
      .where(
        and(
          eq(schema.kbChunks.kbId, kbId),
          eq(schema.kbChunks.hash, hash),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await db.insert(schema.kbChunks).values({
      kbId,
      source: fetched.sourceUrl ?? value,
      text: chunk.text,
      embedding,
      hash,
    });
    newCount++;
  }

  console.log(
    `[kb-ingester] stored ${newCount} new chunks, skipped ${skipped} duplicates`,
  );

  return { total: chunks.length, newCount, skipped };
}

// ---- Embedding -------------------------------------------------------------

async function embedBatch(texts: string[]): Promise<number[][]> {
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
    });
    // Sort by index to maintain order
    const sorted = response.data.sort((a, b) => a.index - b.index);
    results.push(...sorted.map((e) => e.embedding));
  }

  return results;
}

// ---- Helpers ---------------------------------------------------------------

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex").slice(0, 16);
}

// ---- CLI entry point -------------------------------------------------------

async function main() {
  const kbId = process.env.KB_ID;
  const sourceUrl = process.env.SOURCE_URL;

  if (!kbId || !sourceUrl) {
    console.error("Usage: KB_ID=<uuid> SOURCE_URL=<url> bun run index.ts");
    process.exit(1);
  }

  console.log(`[kb-ingester] starting ingest for KB ${kbId}`);
  const result = await ingest({
    kbId,
    sources: [{ kind: "url", value: sourceUrl }],
  });

  console.log("[kb-ingester] complete:", JSON.stringify(result, null, 2));

  if (result.errors.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[kb-ingester] fatal:", err);
  process.exit(1);
});
