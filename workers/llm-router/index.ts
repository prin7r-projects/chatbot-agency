/**
 * LLM Router Worker — Relayhouse Phase 1
 *
 * Pipeline: embed query → top-k=5 vector search → inject into prompt →
 * call GLM 5.1 Flash (primary) / Haiku 4.5 (fallback) → parse reply →
 * compute confidence → return reply or trigger owner handoff.
 */
import OpenAI from "openai";
import { db, ensurePgvector, schema } from "app/db/drizzle";
import { sql, eq, and, desc } from "drizzle-orm";
import type { NewMessage, NewOwnerHandoff, NewConversation } from "app/db/drizzle/schema";

// ---- Configuration ---------------------------------------------------------

const EMBEDDING_MODEL = "text-embedding-3-small";

const GLM_BASE_URL = "https://api.z.ai/v1";
const GLM_MODEL = "glm-4-flash"; // GLM 5.1 Flash via Z.ai

const ANTHROPIC_BASE_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_MODEL = "claude-3-5-haiku-20241022"; // Haiku 4.5 closest

const openaiEmbed = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? "" });
const openaiGlm = new OpenAI({
  apiKey: process.env.GLM_API_KEY ?? "",
  baseURL: GLM_BASE_URL,
});

// ---- Types -----------------------------------------------------------------

export interface RouterInput {
  contractId: string;
  channelId: string;
  conversationId?: string;
  externalUserId: string;
  text: string;
  language?: string;
}

export interface RouterOutput {
  replyText?: string;
  confidence: number;
  ragSourceIds: string[];
  llmProvider: string;
  ownerHandoff?: {
    reason: "low_confidence" | "forbidden_topic" | "customer_demand";
  };
}

// ---- Forbidden topics (hardcoded per doc 12 §7) ----------------------------

const FORBIDDEN_PATTERNS = [
  /\b(medical diagnosis|diagnose this|is this medication safe|treat this disease)\b/i,
  /\b(legal advice|sue|lawsuit|legal counsel|attorney)\b/i,
  /\b(financial advice|investment strategy|stock tip|tax advice|should I invest)\b/i,
];

function isForbiddenTopic(text: string): boolean {
  return FORBIDDEN_PATTERNS.some((p) => p.test(text));
}

// ---- Core router -----------------------------------------------------------

export async function route(input: RouterInput): Promise<RouterOutput> {
  await ensurePgvector();

  // 0. Forbidden topic check
  if (isForbiddenTopic(input.text)) {
    return {
      replyText: "I can't help with that — please call the clinic for assistance.",
      confidence: 0,
      ragSourceIds: [],
      llmProvider: "none",
      ownerHandoff: { reason: "forbidden_topic" },
    };
  }

  // 1. Embed query
  const [{ embedding }] = (
    await openaiEmbed.embeddings.create({
      model: EMBEDDING_MODEL,
      input: input.text,
    })
  ).data;

  // 2. Vector similarity search (cosine distance, top-k=5)
  const kb = await db
    .select({ id: schema.knowledgeBases.id })
    .from(schema.knowledgeBases)
    .where(eq(schema.knowledgeBases.contractId, input.contractId))
    .limit(1);

  if (kb.length === 0) {
    return {
      confidence: 0,
      ragSourceIds: [],
      llmProvider: "none",
      ownerHandoff: { reason: "low_confidence" },
    };
  }

  const kbId = kb[0].id;

  const similarChunks = await db.execute<{
    id: string;
    text: string;
    source: string | null;
    similarity: number;
  }>(
    sql`
      SELECT id, text, source,
             1 - (embedding <=> ${JSON.stringify(embedding)}::vector) AS similarity
      FROM kb_chunks
      WHERE kb_id = ${kbId}
      ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector
      LIMIT 5
    `,
  );

  const topChunks = similarChunks.rows;
  const bestScore = topChunks.length > 0 ? Number(topChunks[0].similarity) : 0;

  // 3. Build RAG prompt
  const context = topChunks.map((c, i) => `[${i + 1}] ${c.text}`).join("\n\n");
  const languageHint = input.language
    ? `Reply in ${input.language}.`
    : "Reply in the same language as the user's message.";

  const systemPrompt = `You are a customer-support chatbot for a business. Use ONLY the knowledge base excerpts below to answer the user's question. If the answer is not in the excerpts, say "I don't have that information — I'll notify the owner to help you." Never invent information. Never give medical, legal, or financial advice.

At the end of your reply, output a confidence self-rating on a new line in this exact format:
CONFIDENCE: <number between 0.0 and 1.0>

${languageHint}

KNOWLEDGE BASE EXCERPTS:
${context}`;

  // 4. Call LLM (primary: GLM, fallback: Haiku)
  let replyText: string;
  let llmProvider: string;

  try {
    const glmResponse = await openaiGlm.chat.completions.create({
      model: GLM_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input.text },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });
    replyText = glmResponse.choices[0]?.message?.content ?? "";
    llmProvider = "glm-4-flash";
  } catch (err) {
    console.warn("[llm-router] GLM failed, falling back to Haiku:", err instanceof Error ? err.message : err);
    try {
      replyText = await callAnthropic(systemPrompt, input.text);
      llmProvider = "claude-3-5-haiku";
    } catch (err2) {
      console.error("[llm-router] Anthropic fallback also failed:", err2);
      return {
        confidence: 0,
        ragSourceIds: [],
        llmProvider: "none",
        ownerHandoff: { reason: "low_confidence" },
      };
    }
  }

  // 5. Parse LLM self-rating and extract clean reply
  const { cleanReply, selfRating } = parseConfidence(replyText);

  // 6. Compute final confidence (union of chunk score + LLM self-rating)
  const confidence = selfRating !== null
    ? round(Math.min(1, (bestScore + selfRating) / 2), 4)
    : round(bestScore, 4);

  const ragSourceIds = topChunks.map((c) => c.id);

  // 7. Return result — caller decides handoff threshold
  return {
    replyText: cleanReply || undefined,
    confidence,
    ragSourceIds,
    llmProvider,
  };
}

// ---- Anthropic API (fetch-based, no SDK required) --------------------------

async function callAnthropic(
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const response = await fetch(ANTHROPIC_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? "";
}

// ---- Confidence parsing ----------------------------------------------------

function parseConfidence(text: string): {
  cleanReply: string;
  selfRating: number | null;
} {
  const lines = text.split("\n");
  let selfRating: number | null = null;
  const cleanLines: string[] = [];

  for (const line of lines) {
    const match = line.match(/^CONFIDENCE:\s*([0-9]*\.?[0-9]+)/i);
    if (match) {
      const parsed = parseFloat(match[1]);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        selfRating = parsed;
      }
      // Don't include the confidence line in the clean reply
      continue;
    }
    cleanLines.push(line);
  }

  return {
    cleanReply: cleanLines.join("\n").trim(),
    selfRating,
  };
}

// ---- Helpers ---------------------------------------------------------------

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

// ---- CLI entry point (for smoke testing) -----------------------------------

async function main() {
  const contractId = process.env.CONTRACT_ID;
  const text = process.env.QUERY;

  if (!contractId || !text) {
    console.error("Usage: CONTRACT_ID=<id> QUERY=<text> bun run index.ts");
    process.exit(1);
  }

  const result = await route({
    contractId,
    channelId: "00000000-0000-0000-0000-000000000000", // placeholder
    externalUserId: "smoke-test",
    text,
    language: "en",
  });

  console.log("[llm-router] result:", JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error("[llm-router] fatal:", err);
  process.exit(1);
});
