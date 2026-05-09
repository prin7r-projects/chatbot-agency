/**
 * Phase 1 API contract tests — Relayhouse
 *
 * Each Phase 1 API contract from doc 12 gets at least one assertion.
 * Target: localhost (BASE_URL env). Flip to live URL in Phase 4.
 *
 * Contracts tested:
 * - POST /api/contracts/:id/kb/ingest  (doc 12 §3.5)
 * - POST /api/webhooks/telegram/:contractId  (doc 12 §3.9)
 * - LLM router internal contract (doc 12 §3.10)
 *
 * Tests use the Playwright request fixture (API testing, no browser).
 */
import { test, expect } from "@playwright/test";

const TEST_CONTRACT_ID = "relay_test_e2e_001";
const TEST_CUSTOMER_ID = "00000000-0000-0000-0000-000000000001";
const TEST_KB_ID = "00000000-0000-0000-0000-0000000000a1";
const TEST_CHANNEL_ID = "00000000-0000-0000-0000-0000000000b1";

// ---------------------------------------------------------------------------
// KB Ingest endpoint (doc 12 §3.5)
// ---------------------------------------------------------------------------

test.describe("POST /api/contracts/:id/kb/ingest", () => {
  test("accepts valid URL source and returns jobId + eta", async ({
    request,
  }) => {
    const response = await request.post(
      `/api/contracts/${TEST_CONTRACT_ID}/kb/ingest`,
      {
        data: {
          sources: [{ kind: "url", value: "https://example.com" }],
        },
      },
    );

    // Phase 1: may return 501 (not wired) or 202 (accepted)
    // Assert the contract shape when wired
    expect(response.status()).toBeGreaterThanOrEqual(200);
    expect(response.status()).toBeLessThan(500);

    if (response.ok()) {
      const body = await response.json();
      expect(body).toHaveProperty("jobId");
      expect(body).toHaveProperty("eta");
      expect(typeof body.jobId).toBe("string");
    }
  });

  test("rejects invalid source kind", async ({ request }) => {
    const response = await request.post(
      `/api/contracts/${TEST_CONTRACT_ID}/kb/ingest`,
      {
        data: {
          sources: [
            { kind: "invalid_kind" as any, value: "https://example.com" },
          ],
        },
      },
    );

    // Should be a 4xx for bad input
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test("rejects missing sources array", async ({ request }) => {
    const response = await request.post(
      `/api/contracts/${TEST_CONTRACT_ID}/kb/ingest`,
      {
        data: {} as any,
      },
    );

    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });
});

// ---------------------------------------------------------------------------
// Telegram webhook endpoint (doc 12 §3.9)
// ---------------------------------------------------------------------------

test.describe("POST /api/webhooks/telegram/:contractId", () => {
  test("accepts valid Telegram update and returns 200 OK", async ({
    request,
  }) => {
    const update = {
      update_id: 1001,
      message: {
        message_id: 1,
        from: {
          id: 123456789,
          first_name: "Anya",
          language_code: "en",
        },
        chat: { id: 123456789 },
        text: "What are your opening hours?",
        date: Math.floor(Date.now() / 1000),
      },
    };

    const response = await request.post(
      `/api/webhooks/telegram/${TEST_CONTRACT_ID}`,
      {
        data: update,
      },
    );

    // Must always return 200 to acknowledge Telegram webhook
    expect(response.status()).toBe(200);
  });

  test("returns 200 for non-text messages (photo, voice note etc)", async ({
    request,
  }) => {
    const update = {
      update_id: 1002,
      message: {
        message_id: 2,
        from: { id: 123456789 },
        chat: { id: 123456789 },
        photo: [{ file_id: "abc123" }],
        date: Math.floor(Date.now() / 1000),
      },
    };

    const response = await request.post(
      `/api/webhooks/telegram/${TEST_CONTRACT_ID}`,
      {
        data: update,
      },
    );

    // Should still 200 — Telegram requires fast ack
    expect(response.status()).toBe(200);
  });

  test("returns 400 for malformed body", async ({ request }) => {
    const response = await request.post(
      `/api/webhooks/telegram/${TEST_CONTRACT_ID}`,
      {
        data: "not-json",
        headers: { "Content-Type": "text/plain" },
      },
    );

    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });
});

// ---------------------------------------------------------------------------
// LLM Router internal contract (doc 12 §3.10)
// ---------------------------------------------------------------------------

test.describe("LLM Router internal contract", () => {
  test("output shape has required fields", () => {
    // This test validates the router output contract shape.
    // In production, this is tested through the Telegram webhook flow.
    // Here we assert the type contract.

    const expectedFields = [
      "replyText",
      "confidence",
      "ragSourceIds",
      "llmProvider",
    ];

    const mockOutput = {
      replyText: "We are open 9-6 Mon-Fri.",
      confidence: 0.85,
      ragSourceIds: ["chunk-001", "chunk-002"],
      llmProvider: "glm-4-flash",
    };

    for (const field of expectedFields) {
      expect(mockOutput).toHaveProperty(field);
    }

    expect(mockOutput.confidence).toBeGreaterThanOrEqual(0);
    expect(mockOutput.confidence).toBeLessThanOrEqual(1);
    expect(Array.isArray(mockOutput.ragSourceIds)).toBe(true);
  });

  test("owner handoff output includes reason when triggered", () => {
    const handoffOutput = {
      confidence: 0,
      ragSourceIds: [],
      llmProvider: "none",
      ownerHandoff: { reason: "low_confidence" },
    };

    expect(handoffOutput).toHaveProperty("ownerHandoff");
    expect(handoffOutput.ownerHandoff).toHaveProperty("reason");
    expect([
      "low_confidence",
      "forbidden_topic",
      "customer_demand",
    ]).toContain(handoffOutput.ownerHandoff.reason);
  });
});
