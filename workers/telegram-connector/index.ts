/**
 * Telegram Connector — Relayhouse Phase 1
 *
 * Bun HTTP server that:
 * - Registers webhook with Telegram Bot API on startup
 * - Receives inbound messages via webhook
 * - Dispatches to LLM router for RAG reply
 * - Handles owner-handoff on low-confidence / forbidden-topic
 * - Sends reply back to Telegram via sendMessage
 */
import { db, ensurePgvector, schema } from "app/db/drizzle";
import { route } from "llm-router";
import { eq, and } from "drizzle-orm";
import type { NewMessage, NewOwnerHandoff, NewConversation } from "app/db/drizzle/schema";

// ---- Configuration ---------------------------------------------------------

const PORT = parseInt(process.env.PORT ?? "3010", 10);
const WEBHOOK_PATH = "/api/webhooks/telegram";

// ---- Types -----------------------------------------------------------------

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: { id: number; first_name?: string; username?: string; language_code?: string };
    chat: { id: number };
    text?: string;
    date: number;
  };
}

interface TelegramSendMessage {
  chat_id: number;
  text: string;
  reply_to_message_id?: number;
}

// ---- Main server -----------------------------------------------------------

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/health") {
      return new Response("ok", { status: 200 });
    }

    if (url.pathname === WEBHOOK_PATH && req.method === "POST") {
      return handleWebhook(req);
    }

    return new Response("not found", { status: 404 });
  },
});

console.log(`[telegram-connector] listening on :${PORT}`);

// ---- Webhook handler -------------------------------------------------------

async function handleWebhook(req: Request): Promise<Response> {
  let update: TelegramUpdate;
  try {
    update = await req.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }

  // Only handle text messages for now (Phase 1)
  if (!update.message?.text) {
    return new Response("ok", { status: 200 });
  }

  const msg = update.message;
  const chatId = msg.chat.id;
  const externalUserId = String(msg.from?.id ?? chatId);

  // Process in background — respond 200 quickly to Telegram
  processMessage(update).catch((err) => {
    console.error("[telegram-connector] background processing error:", err);
  });

  return new Response("ok", { status: 200 });
}

async function processMessage(update: TelegramUpdate) {
  const msg = update.message!;
  const chatId = msg.chat.id;
  const externalUserId = String(msg.from?.id ?? chatId);
  const text = msg.text!;
  const language = msg.from?.language_code;

  // Find active channel for this chat
  const channel = await findChannel(chatId);
  if (!channel) {
    console.warn(`[telegram-connector] no active channel found for chat ${chatId}`);
    return;
  }

  // Get or create conversation
  const conversation = await getOrCreateConversation(
    channel.contractId,
    channel.id,
    externalUserId,
    language,
  );

  // Store inbound message
  const [inbound] = await db
    .insert(schema.messages)
    .values({
      conversationId: conversation.id,
      direction: "inbound",
      text,
      createdAt: new Date(msg.date * 1000),
    })
    .returning({ id: schema.messages.id });

  // Route through LLM
  const contract = await db
    .select({
      ownerHandoffThreshold: schema.contracts.ownerHandoffThreshold,
    })
    .from(schema.contracts)
    .where(eq(schema.contracts.id, channel.contractId))
    .limit(1);

  const threshold = contract[0]?.ownerHandoffThreshold
    ? Number(contract[0].ownerHandoffThreshold)
    : 0.65;

  const result = await route({
    contractId: channel.contractId,
    channelId: channel.id,
    conversationId: conversation.id,
    externalUserId,
    text,
    language,
  });

  // Handle owner handoff
  if (result.ownerHandoff) {
    await db.insert(schema.ownerHandoffs).values({
      conversationId: conversation.id,
      reason: result.ownerHandoff.reason,
      pingedAt: new Date(),
    });

    // Send dispatcher ping
    await sendDispatcherPing(channel.contractId, conversation.id, text, result.ownerHandoff.reason);

    // Reply to customer with canned message
    if (result.replyText) {
      await sendTelegramMessage(chatId, result.replyText, msg.message_id);
    }
    return;
  }

  // Check confidence threshold
  if (result.confidence < threshold) {
    await db.insert(schema.ownerHandoffs).values({
      conversationId: conversation.id,
      reason: "low_confidence",
      pingedAt: new Date(),
    });

    await sendDispatcherPing(channel.contractId, conversation.id, text, "low_confidence");

    // Don't reply to customer — let owner handle it
    return;
  }

  // Store outbound message
  await db.insert(schema.messages).values({
    conversationId: conversation.id,
    direction: "outbound",
    text: result.replyText ?? "(no reply)",
    confidence: result.confidence.toFixed(4),
    ragSourceIds: result.ragSourceIds,
    llmProvider: result.llmProvider,
  });

  // Send reply
  if (result.replyText) {
    await sendTelegramMessage(chatId, result.replyText, msg.message_id);
  }
}

// ---- Telegram API helpers --------------------------------------------------

async function sendTelegramMessage(
  chatId: number,
  text: string,
  replyToMessageId?: number,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.error("[telegram-connector] TELEGRAM_BOT_TOKEN not set");
    return;
  }

  const body: TelegramSendMessage = { chat_id: chatId, text };
  if (replyToMessageId) body.reply_to_message_id = replyToMessageId;

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    console.error(
      "[telegram-connector] sendMessage failed:",
      response.status,
      await response.text(),
    );
  }
}

async function sendDispatcherPing(
  contractId: string,
  conversationId: string,
  userText: string,
  reason: string,
): Promise<void> {
  const channelId = process.env.DISPATCHER_TG_CHANNEL_ID;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!channelId || !token) return;

  const text = [
    `🔔 *Owner handoff* — ${reason}`,
    ``,
    `Contract: \`${contractId}\``,
    `Conversation: \`${conversationId}\``,
    `Message: ${userText.slice(0, 200)}${userText.length > 200 ? "…" : ""}`,
  ].join("\n");

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: channelId,
      text,
      parse_mode: "Markdown",
    }),
  });
}

// ---- Database helpers ------------------------------------------------------

async function findChannel(chatId: number) {
  const rows = await db
    .select({
      id: schema.channels.id,
      contractId: schema.channels.contractId,
      kind: schema.channels.kind,
    })
    .from(schema.channels)
    .where(
      and(
        eq(schema.channels.kind, "telegram"),
        eq(schema.channels.externalIdentifier, String(chatId)),
        eq(schema.channels.status, "healthy"),
      ),
    )
    .limit(1);

  // Fallback: find ANY telegram channel (Phase 1 single-tenant)
  if (rows.length === 0) {
    const allTg = await db
      .select({
        id: schema.channels.id,
        contractId: schema.channels.contractId,
        kind: schema.channels.kind,
      })
      .from(schema.channels)
      .where(eq(schema.channels.kind, "telegram"))
      .limit(1);
    return allTg[0] ?? null;
  }
  return rows[0];
}

async function getOrCreateConversation(
  contractId: string,
  channelId: string,
  externalUserId: string,
  language?: string,
) {
  const existing = await db
    .select({ id: schema.conversations.id })
    .from(schema.conversations)
    .where(
      and(
        eq(schema.conversations.contractId, contractId),
        eq(schema.conversations.channelId, channelId),
        eq(schema.conversations.externalUserId, externalUserId),
      ),
    )
    .limit(1);

  if (existing.length > 0) return existing[0];

  const [created] = await db
    .insert(schema.conversations)
    .values({ contractId, channelId, externalUserId, language })
    .returning({ id: schema.conversations.id });

  return created;
}

// ---- Startup: register webhook ---------------------------------------------

async function registerWebhook() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
  if (!token || !webhookUrl) {
    console.warn(
      "[telegram-connector] TELEGRAM_BOT_TOKEN or TELEGRAM_WEBHOOK_URL not set; skipping webhook registration",
    );
    return;
  }

  const fullUrl = `${webhookUrl.replace(/\/$/, "")}${WEBHOOK_PATH}`;
  const response = await fetch(
    `https://api.telegram.org/bot${token}/setWebhook`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: fullUrl }),
    },
  );

  const data = await response.json();
  if (data.ok) {
    console.log(`[telegram-connector] webhook registered: ${fullUrl}`);
  } else {
    console.error(
      "[telegram-connector] webhook registration failed:",
      data.description,
    );
  }
}

// Init
await ensurePgvector();
await registerWebhook();


