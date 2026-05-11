import OpenAI from "openai";
import type express from "express";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { db, schema } from "../../db/drizzle";

const GLM_BASE_URL = "https://open.bigmodel.cn/api/paas/v4";
const GLM_MODEL = "glm-5.1";
const MAX_MESSAGE_LENGTH = 4000;

type ApiRequest = express.Request & {
  params: { botId?: string };
  query: { botId?: string };
  body?: {
    message?: unknown;
    conversationId?: unknown;
    visitorId?: unknown;
  };
};

type BotContext = {
  botId: string;
  contractId: string;
  channelId: string | null;
};

export async function relayhouseWidget(
  request: ApiRequest,
  response: express.Response,
): Promise<void> {
  const botId = normalizeBotId(request.params.botId);

  if (!botId) {
    response.status(400).type("text/plain").send("Invalid Relayhouse bot id.");
    return;
  }

  response
    .status(200)
    .set({
      "Cache-Control": "public, max-age=300",
      "Content-Type": "application/javascript; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    })
    .send(buildWidgetScript(botId));
}

export async function relayhouseChat(
  request: ApiRequest,
  response: express.Response,
): Promise<void> {
  setCorsHeaders(response);

  const botId = normalizeBotId(request.query.botId);
  const message = normalizeMessage(request.body?.message);

  if (!botId) {
    response.status(400).json({ error: "Missing or invalid botId." });
    return;
  }

  if (!message) {
    response.status(400).json({ error: "Message is required." });
    return;
  }

  const apiKey = process.env.GLM_API_KEY;
  if (!apiKey) {
    response.status(503).json({ error: "GLM_API_KEY is not configured." });
    return;
  }

  try {
    const bot = await resolveBotContext(botId);
    const reply = await callGlm(apiKey, bot, message);
    const conversationId =
      normalizeOptionalString(request.body?.conversationId) ?? randomUUID();

    response.status(200).json({
      botId,
      conversationId,
      reply,
    });
  } catch (error) {
    console.error("[relayhouse-widget] chat failed:", error);
    response.status(502).json({ error: "Relayhouse chat proxy failed." });
  }
}

export function relayhouseChatOptions(
  _request: ApiRequest,
  response: express.Response,
): void {
  setCorsHeaders(response);
  response.status(204).send();
}

async function resolveBotContext(botId: string): Promise<BotContext> {
  try {
    const [channel] = await db
      .select({
        channelId: schema.channels.id,
        contractId: schema.channels.contractId,
      })
      .from(schema.channels)
      .where(
        and(
          eq(schema.channels.kind, "web_widget"),
          eq(schema.channels.externalIdentifier, botId),
        ),
      )
      .limit(1);

    if (channel?.contractId) {
      return {
        botId,
        contractId: channel.contractId,
        channelId: channel.channelId,
      };
    }
  } catch (error) {
    console.warn(
      "[relayhouse-widget] could not resolve bot from channel table:",
      error,
    );
  }

  return {
    botId,
    contractId: botId,
    channelId: null,
  };
}

async function callGlm(
  apiKey: string,
  bot: BotContext,
  message: string,
): Promise<string> {
  const client = new OpenAI({
    apiKey,
    baseURL: GLM_BASE_URL,
  });

  const completion = await client.chat.completions.create({
    model: GLM_MODEL,
    temperature: 0.3,
    max_tokens: 700,
    messages: [
      {
        role: "system",
        content:
          "You are Relayhouse, a concise customer-support chat assistant. Answer helpfully, do not invent policy details, and ask for contact details when a human follow-up is needed.",
      },
      {
        role: "user",
        content: `Contract: ${bot.contractId}\nChannel: ${
          bot.channelId ?? "web_widget"
        }\nVisitor message: ${message}`,
      },
    ],
  });

  return (
    completion.choices[0]?.message?.content?.trim() ||
    "I could not produce a reply. Please try again."
  );
}

function buildWidgetScript(botId: string): string {
  return `(function () {
  "use strict";

  var BOT_ID = ${JSON.stringify(botId)};
  var script = document.currentScript;
  var apiOrigin = script && script.src ? new URL(script.src).origin : window.location.origin;
  var existing = document.querySelector("[data-relayhouse-widget='" + BOT_ID + "']");
  if (existing) return;

  var host = document.createElement("div");
  host.setAttribute("data-relayhouse-widget", BOT_ID);
  document.body.appendChild(host);

  var root = host.attachShadow ? host.attachShadow({ mode: "open" }) : host;
  root.innerHTML = '<style>' +
    ':host{all:initial;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}' +
    '.rh-button{position:fixed;right:20px;bottom:20px;z-index:2147483647;width:56px;height:56px;border:0;border-radius:50%;background:#111;color:#fff;box-shadow:0 12px 32px rgba(0,0,0,.24);cursor:pointer;font:700 18px/1 system-ui}' +
    '.rh-panel{position:fixed;right:20px;bottom:88px;z-index:2147483647;width:min(360px,calc(100vw - 32px));height:480px;max-height:calc(100vh - 120px);display:none;grid-template-rows:auto 1fr auto;background:#fff;color:#161616;border:1px solid #ddd;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,.22);overflow:hidden}' +
    '.rh-panel[data-open="true"]{display:grid}' +
    '.rh-head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:#111;color:#fff;font:700 14px/1.2 system-ui}' +
    '.rh-close{width:28px;height:28px;border:0;border-radius:4px;background:transparent;color:#fff;font-size:20px;line-height:1;cursor:pointer}' +
    '.rh-log{padding:12px;overflow:auto;background:#f7f5f2;display:flex;flex-direction:column;gap:8px}' +
    '.rh-msg{max-width:82%;padding:9px 11px;border-radius:8px;font:400 14px/1.35 system-ui;white-space:pre-wrap;word-break:break-word}' +
    '.rh-user{align-self:flex-end;background:#111;color:#fff}' +
    '.rh-bot{align-self:flex-start;background:#fff;color:#161616;border:1px solid #e5e0d8}' +
    '.rh-form{display:grid;grid-template-columns:1fr auto;gap:8px;padding:10px;border-top:1px solid #e5e0d8;background:#fff}' +
    '.rh-input{min-width:0;border:1px solid #cfc8bd;border-radius:6px;padding:10px;font:400 14px/1.2 system-ui;color:#161616}' +
    '.rh-send{border:0;border-radius:6px;background:#b42318;color:#fff;padding:0 14px;font:700 14px/1 system-ui;cursor:pointer}' +
    '.rh-send:disabled{opacity:.6;cursor:wait}' +
    '</style>' +
    '<button class="rh-button" type="button" aria-label="Open chat">Rh</button>' +
    '<section class="rh-panel" aria-label="Relayhouse chat panel">' +
      '<header class="rh-head"><span>Relayhouse</span><button class="rh-close" type="button" aria-label="Close chat">&times;</button></header>' +
      '<div class="rh-log" role="log" aria-live="polite"></div>' +
      '<form class="rh-form"><input class="rh-input" name="message" autocomplete="off" placeholder="Write a message" /><button class="rh-send" type="submit">Send</button></form>' +
    '</section>';

  var panel = root.querySelector(".rh-panel");
  var openButton = root.querySelector(".rh-button");
  var closeButton = root.querySelector(".rh-close");
  var log = root.querySelector(".rh-log");
  var form = root.querySelector(".rh-form");
  var input = root.querySelector(".rh-input");
  var send = root.querySelector(".rh-send");
  var conversationId = null;

  function append(text, kind) {
    var node = document.createElement("div");
    node.className = "rh-msg rh-" + kind;
    node.textContent = text;
    log.appendChild(node);
    log.scrollTop = log.scrollHeight;
  }

  function setOpen(open) {
    panel.setAttribute("data-open", open ? "true" : "false");
    if (open) setTimeout(function () { input.focus(); }, 0);
  }

  openButton.addEventListener("click", function () { setOpen(true); });
  closeButton.addEventListener("click", function () { setOpen(false); });
  append("Hi. Send a message and I will help.", "bot");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var message = input.value.trim();
    if (!message) return;
    input.value = "";
    append(message, "user");
    send.disabled = true;
    fetch(apiOrigin + "/api/chat?botId=" + encodeURIComponent(BOT_ID), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, conversationId: conversationId })
    })
      .then(function (res) { return res.json().then(function (body) { return { ok: res.ok, body: body }; }); })
      .then(function (result) {
        if (!result.ok) throw new Error(result.body && result.body.error ? result.body.error : "Chat request failed");
        conversationId = result.body.conversationId || conversationId;
        append(result.body.reply || "No reply returned.", "bot");
      })
      .catch(function (error) {
        append(error.message || "Chat request failed.", "bot");
      })
      .finally(function () {
        send.disabled = false;
        input.focus();
      });
  });
})();`;
}

function normalizeBotId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return /^[A-Za-z0-9_-]{1,80}$/.test(trimmed) ? trimmed : null;
}

function normalizeMessage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, MAX_MESSAGE_LENGTH) : null;
}

function normalizeOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, 120)
    : null;
}

function setCorsHeaders(response: express.Response): void {
  response.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  });
}
