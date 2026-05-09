/**
 * Source fetchers — fetch content from various source types.
 * Phase 1: URL (web crawl) only. PDF + Notion stubbed.
 */

export type SourceKind = "url" | "pdf" | "notion" | "gdoc";

export interface FetchResult {
  text: string;
  title?: string;
  sourceUrl?: string;
  byteLength: number;
}

/**
 * Fetch and extract text from a public URL.
 * Strips HTML tags using a simple regex (no Cheerio dep for Phase 1).
 */
async function fetchUrl(url: string): Promise<FetchResult> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "RelayhouseKB/1.0 (chatbot-agency.prin7r.com)",
    },
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: HTTP ${response.status}`);
  }

  const html = await response.text();
  const text = stripHtml(html);
  const title = extractTitle(html);

  return { text, title, sourceUrl: url, byteLength: html.length };
}

/**
 * Fetch a PDF from URL and extract text.
 * Phase 1 stub — returns placeholder. Will use pdf-parse in follow-up.
 */
async function fetchPdf(url: string): Promise<FetchResult> {
  // Stub: fetch raw and note it's binary; real extraction via pdf-parse or similar
  const response = await fetch(url, {
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF ${url}: HTTP ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  throw new Error(
    "PDF parsing not yet implemented (Phase 1 stub). Use URL or plain text sources.",
  );
}

/**
 * Fetch from Notion page.
 * Phase 1 stub — Notion API integration in Phase 3.
 */
async function fetchNotion(pageId: string): Promise<FetchResult> {
  throw new Error(
    "Notion API integration not yet implemented (Phase 3). Use URL or plain text sources.",
  );
}

/**
 * Fetch from Google Doc.
 * Phase 1 stub.
 */
async function fetchGdoc(docId: string): Promise<FetchResult> {
  throw new Error(
    "Google Doc integration not yet implemented. Use URL or plain text sources.",
  );
}

// ---- HTML stripping helpers ------------------------------------------------

function stripHtml(html: string): string {
  // Remove scripts, styles, head
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, " ")
    // Decode common entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

function extractTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match?.[1]?.trim();
}

// ---- Main dispatcher -------------------------------------------------------

export async function fetchSource(
  kind: SourceKind,
  value: string,
): Promise<FetchResult> {
  switch (kind) {
    case "url":
      return fetchUrl(value);
    case "pdf":
      return fetchPdf(value);
    case "notion":
      return fetchNotion(value);
    case "gdoc":
      return fetchGdoc(value);
    default:
      throw new Error(`Unknown source kind: ${kind}`);
  }
}
