/**
 * Owner Handoff Worker — Relayhouse Phase 1
 *
 * Polls unresolved handoffs, re-pings the dispatcher Telegram channel
 * after 15 minutes of silence, and escalates after 1 hour.
 *
 * Dual-mode: exports poll() for programmatic use + CLI main() for smoke testing.
 */
import { db, ensurePgvector, schema } from "app/db/drizzle";
import { isNull, lt, and } from "drizzle-orm";

// ---- Configuration ---------------------------------------------------------

const POLL_INTERVAL_MS = 60_000; // 1 minute
const REPING_AFTER_MS = 15 * 60_000; // 15 minutes
const ESCALATE_AFTER_MS = 60 * 60_000; // 1 hour

// ---- In-memory state -------------------------------------------------------

const rePinged = new Map<string, Date>();
const escalated = new Set<string>();

// ---- Types -----------------------------------------------------------------

export interface PollResult {
  total: number;
  rePinged: number;
  escalated: number;
}

export type HandoffAction = "skip" | "re_ping" | "escalate";

export interface HandoffSnapshot {
  id: string;
  pingedAt: Date | null;
}

export interface ClassifyInput {
  handoff: HandoffSnapshot;
  rePingThreshold: Date;
  escalateThreshold: Date;
  now: Date;
}

export interface ClassifyOutput {
  action: HandoffAction;
  reason: string;
}

// ---- Decision logic (testable without DB) ----------------------------------

/**
 * Classify what action to take for a single unresolved handoff.
 *
 * Mutates `rePinged` and `escalated` state maps as a side effect,
 * mirroring the in-memory tracking that poll() maintains.
 */
export function classifyHandoff(
  input: ClassifyInput,
  rePinged: Map<string, Date>,
  escalated: Set<string>,
): ClassifyOutput {
  const { handoff, rePingThreshold, escalateThreshold, now } = input;

  if (!handoff.pingedAt) {
    return { action: "skip", reason: "not yet pinged" };
  }

  if (handoff.pingedAt < escalateThreshold && !escalated.has(handoff.id)) {
    escalated.add(handoff.id);
    return { action: "escalate", reason: `pinged at ${handoff.pingedAt.toISOString()} exceeds escalation threshold` };
  }

  const lastPing = rePinged.get(handoff.id) ?? handoff.pingedAt;
  if (lastPing < rePingThreshold && !escalated.has(handoff.id)) {
    rePinged.set(handoff.id, now);
    return { action: "re_ping", reason: `last ping ${lastPing.toISOString()} exceeds re-ping threshold` };
  }

  return { action: "skip", reason: "within thresholds or already handled" };
}

// ---- Core logic -------------------------------------------------------------

export async function poll(): Promise<PollResult> {
  const now = new Date();
  const rePingThreshold = new Date(now.getTime() - REPING_AFTER_MS);
  const escalateThreshold = new Date(now.getTime() - ESCALATE_AFTER_MS);

  const unresolved = await db
    .select()
    .from(schema.ownerHandoffs)
    .where(isNull(schema.ownerHandoffs.resolvedByOwnerAt));

  let rePingedCount = 0;
  let escalatedCount = 0;

  for (const handoff of unresolved) {
    const result = classifyHandoff(
      { handoff: { id: handoff.id, pingedAt: handoff.pingedAt }, rePingThreshold, escalateThreshold, now },
      rePinged,
      escalated,
    );

    if (result.action === "escalate") {
      await sendEscalationPing(handoff);
      escalatedCount++;
    } else if (result.action === "re_ping") {
      await sendRePing(handoff);
      rePingedCount++;
    }
  }

  if (unresolved.length > 0) {
    console.log(
      `[owner-handoff] polled ${unresolved.length} unresolved — ` +
        `${rePingedCount} re-pinged, ${escalatedCount} escalated`,
    );
  }

  return { total: unresolved.length, rePinged: rePingedCount, escalated: escalatedCount };
}

// ---- Telegram helpers -------------------------------------------------------

async function sendRePing(handoff: typeof schema.ownerHandoffs.$inferSelect) {
  const channelId = process.env.DISPATCHER_TG_CHANNEL_ID;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!channelId || !token) {
    console.warn("[owner-handoff] skipping re-ping: DISPATCHER_TG_CHANNEL_ID or TELEGRAM_BOT_TOKEN not set");
    return;
  }

  const text = [
    `⏰ *Reminder — handoff still pending*`,
    ``,
    `Reason: \`${handoff.reason}\``,
    `Conversation: \`${handoff.conversationId}\``,
    `Pinged at: ${handoff.pingedAt?.toISOString() ?? "unknown"}`,
  ].join("\n");

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: channelId, text, parse_mode: "Markdown" }),
  });

  console.log(`[owner-handoff] re-ping sent for ${handoff.id} (reason: ${handoff.reason})`);
}

async function sendEscalationPing(handoff: typeof schema.ownerHandoffs.$inferSelect) {
  const channelId = process.env.DISPATCHER_TG_CHANNEL_ID;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!channelId || !token) {
    console.warn("[owner-handoff] skipping escalation: DISPATCHER_TG_CHANNEL_ID or TELEGRAM_BOT_TOKEN not set");
    return;
  }

  const elapsed = handoff.pingedAt
    ? Math.round((Date.now() - handoff.pingedAt.getTime()) / 60_000)
    : "unknown";

  const text = [
    `🚨 *ESCALATION — handoff unresolved for ${elapsed} min*`,
    ``,
    `Reason: \`${handoff.reason}\``,
    `Conversation: \`${handoff.conversationId}\``,
    `Handoff ID: \`${handoff.id}\``,
    `Pinged at: ${handoff.pingedAt?.toISOString() ?? "unknown"}`,
  ].join("\n");

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: channelId, text, parse_mode: "Markdown" }),
  });

  console.log(`[owner-handoff] escalation sent for ${handoff.id} (${elapsed} min)`);
}

// ---- Helpers exposed for testing -------------------------------------------

export function getTimeThresholds(now: Date) {
  return {
    rePingThreshold: new Date(now.getTime() - REPING_AFTER_MS),
    escalateThreshold: new Date(now.getTime() - ESCALATE_AFTER_MS),
    rePingAfterMs: REPING_AFTER_MS,
    escalateAfterMs: ESCALATE_AFTER_MS,
  };
}

export function clearState() {
  rePinged.clear();
  escalated.clear();
}

// ---- CLI entry point --------------------------------------------------------

async function main() {
  console.log("[owner-handoff] worker starting");

  if (process.env.CONTRACT_ID) {
    console.log(`[owner-handoff] smoke run for contract ${process.env.CONTRACT_ID}`);
    const result = await poll();
    console.log(`[owner-handoff] smoke result:`, result);
    return;
  }

  await ensurePgvector();

  setInterval(async () => {
    try {
      await poll();
    } catch (err) {
      console.error("[owner-handoff] poll error:", err);
    }
  }, POLL_INTERVAL_MS);

  console.log(`[owner-handoff] polling every ${POLL_INTERVAL_MS / 1000}s`);
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  main().catch((err) => {
    console.error("[owner-handoff] fatal:", err);
    process.exit(1);
  });
}
