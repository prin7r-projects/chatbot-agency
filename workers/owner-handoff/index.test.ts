/**
 * Owner-handoff worker — focused unit tests
 *
 * Tests polling decision logic (time thresholds) without requiring
 * a live database or Telegram credentials.
 */
import { describe, test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { getTimeThresholds, classifyHandoff, clearState } from "./index.ts";
import type { HandoffSnapshot } from "./index.ts";

describe("getTimeThresholds", () => {
  test("returns re-ping threshold 15 minutes before now", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const { rePingThreshold } = getTimeThresholds(now);
    assert.equal(rePingThreshold.toISOString(), "2026-01-01T11:45:00.000Z");
  });

  test("returns escalate threshold 60 minutes before now", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const { escalateThreshold } = getTimeThresholds(now);
    assert.equal(escalateThreshold.toISOString(), "2026-01-01T11:00:00.000Z");
  });

  test("re-ping threshold is later than escalate threshold", () => {
    const now = new Date();
    const { rePingThreshold, escalateThreshold } = getTimeThresholds(now);
    assert.ok(rePingThreshold.getTime() > escalateThreshold.getTime());
  });
});

describe("polling decision logic (time boundary checks)", () => {
  test("ping at 14 min ago should NOT trigger re-ping", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const pingedAt = new Date("2026-01-01T11:46:00Z"); // 14 min ago
    const { rePingThreshold } = getTimeThresholds(now);
    assert.equal(pingedAt < rePingThreshold, false);
  });

  test("ping at 16 min ago SHOULD trigger re-ping", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const pingedAt = new Date("2026-01-01T11:44:00Z"); // 16 min ago
    const { rePingThreshold } = getTimeThresholds(now);
    assert.equal(pingedAt < rePingThreshold, true);
  });

  test("ping at 15 min exactly SHOULD NOT trigger re-ping (boundary)", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const pingedAt = new Date("2026-01-01T11:45:00Z"); // exactly 15 min
    const { rePingThreshold } = getTimeThresholds(now);
    // pingedAt equals threshold — '<' is false, so 15:00 exactly does NOT trigger
    assert.equal(pingedAt < rePingThreshold, false);
  });

  test("ping at 59 min ago should NOT trigger escalation", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const pingedAt = new Date("2026-01-01T11:01:00Z"); // 59 min ago
    const { escalateThreshold } = getTimeThresholds(now);
    assert.equal(pingedAt < escalateThreshold, false);
  });

  test("ping at 61 min ago SHOULD trigger escalation", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const pingedAt = new Date("2026-01-01T10:59:00Z"); // 61 min ago
    const { escalateThreshold } = getTimeThresholds(now);
    assert.equal(pingedAt < escalateThreshold, true);
  });

  test("re-ping threshold constants are correct", () => {
    const { rePingAfterMs, escalateAfterMs } = getTimeThresholds(new Date());
    assert.equal(rePingAfterMs, 15 * 60_000);
    assert.equal(escalateAfterMs, 60 * 60_000);
  });
});

describe("escalation takes priority over re-ping", () => {
  test("65 min ping qualifies for both — escalate should win", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    const pingedAt = new Date("2026-01-01T10:55:00Z"); // 65 min ago
    const { rePingThreshold, escalateThreshold } = getTimeThresholds(now);

    // Qualifies for both
    assert.equal(pingedAt < rePingThreshold, true);
    assert.equal(pingedAt < escalateThreshold, true);

    // Escalate threshold is further back — so escalation check runs first
    assert.ok(escalateThreshold.getTime() < rePingThreshold.getTime());
  });
});

// ---- classifyHandoff decision-logic tests ----------------------------------

function freshState() {
  clearState();
  return { rePinged: new Map<string, Date>(), escalated: new Set<string>() };
}

function mkHandoff(id: string, pingedAtIso: string | null): HandoffSnapshot {
  return {
    id,
    pingedAt: pingedAtIso ? new Date(pingedAtIso) : null,
  };
}

const NOW = new Date("2026-01-01T12:00:00Z");

describe("classifyHandoff", () => {
  beforeEach(() => clearState());

  test("returns skip when pingedAt is null (never pinged)", () => {
    const { rePinged, escalated } = freshState();
    const result = classifyHandoff(
      {
        handoff: mkHandoff("h1", null),
        rePingThreshold: new Date(NOW.getTime() - 15 * 60_000),
        escalateThreshold: new Date(NOW.getTime() - 60 * 60_000),
        now: NOW,
      },
      rePinged,
      escalated,
    );
    assert.equal(result.action, "skip");
    assert.equal(result.reason, "not yet pinged");
  });

  test("returns escalate when pingedAt exceeds escalation threshold", () => {
    const { rePinged, escalated } = freshState();
    const result = classifyHandoff(
      {
        handoff: mkHandoff("h1", "2026-01-01T10:55:00Z"), // 65 min ago
        rePingThreshold: new Date(NOW.getTime() - 15 * 60_000),
        escalateThreshold: new Date(NOW.getTime() - 60 * 60_000),
        now: NOW,
      },
      rePinged,
      escalated,
    );
    assert.equal(result.action, "escalate");
    assert.ok(escalated.has("h1"));
    assert.equal(rePinged.has("h1"), false);
  });

  test("returns re_ping when pingedAt exceeds re-ping threshold but not escalate", () => {
    const { rePinged, escalated } = freshState();
    const result = classifyHandoff(
      {
        handoff: mkHandoff("h1", "2026-01-01T11:35:00Z"), // 25 min ago
        rePingThreshold: new Date(NOW.getTime() - 15 * 60_000),
        escalateThreshold: new Date(NOW.getTime() - 60 * 60_000),
        now: NOW,
      },
      rePinged,
      escalated,
    );
    assert.equal(result.action, "re_ping");
    assert.equal(rePinged.get("h1"), NOW);
    assert.equal(escalated.has("h1"), false);
  });

  test("returns skip when pingedAt is within both thresholds", () => {
    const { rePinged, escalated } = freshState();
    const result = classifyHandoff(
      {
        handoff: mkHandoff("h1", "2026-01-01T11:50:00Z"), // 10 min ago
        rePingThreshold: new Date(NOW.getTime() - 15 * 60_000),
        escalateThreshold: new Date(NOW.getTime() - 60 * 60_000),
        now: NOW,
      },
      rePinged,
      escalated,
    );
    assert.equal(result.action, "skip");
    assert.equal(result.reason, "within thresholds or already handled");
  });

  test("returns skip when already escalated (idempotent)", () => {
    const { rePinged, escalated } = freshState();
    escalated.add("h1"); // pre-escalated

    const result = classifyHandoff(
      {
        handoff: mkHandoff("h1", "2026-01-01T10:55:00Z"), // still old
        rePingThreshold: new Date(NOW.getTime() - 15 * 60_000),
        escalateThreshold: new Date(NOW.getTime() - 60 * 60_000),
        now: NOW,
      },
      rePinged,
      escalated,
    );
    assert.equal(result.action, "skip");
    assert.equal(result.reason, "within thresholds or already handled");
  });

  test("does not re-ping if already escalated (escalation wins over re-ping)", () => {
    const { rePinged, escalated } = freshState();
    escalated.add("h1");

    const result = classifyHandoff(
      {
        handoff: mkHandoff("h1", "2026-01-01T11:35:00Z"), // 25 min ago — qualifies for re-ping
        rePingThreshold: new Date(NOW.getTime() - 15 * 60_000),
        escalateThreshold: new Date(NOW.getTime() - 60 * 60_000),
        now: NOW,
      },
      rePinged,
      escalated,
    );
    assert.equal(result.action, "skip");
  });

  test("tracks last re-ping timestamp — second call within re-ping window skips", () => {
    const { rePinged, escalated } = freshState();
    const handoff = mkHandoff("h1", "2026-01-01T11:35:00Z"); // 25 min ago
    const thresholds = {
      rePingThreshold: new Date(NOW.getTime() - 15 * 60_000),
      escalateThreshold: new Date(NOW.getTime() - 60 * 60_000),
    };

    // First call: should re_ping
    const r1 = classifyHandoff({ handoff, ...thresholds, now: NOW }, rePinged, escalated);
    assert.equal(r1.action, "re_ping");
    assert.equal(rePinged.get("h1"), NOW);

    // Second call immediately: should skip because rePinged tracks NOW as last ping
    const r2 = classifyHandoff({ handoff, ...thresholds, now: NOW }, rePinged, escalated);
    assert.equal(r2.action, "skip");
  });

  test("re-pings again after re-ping window passes from last re-ping", () => {
    const { rePinged, escalated } = freshState();
    const handoff = mkHandoff("h1", "2026-01-01T11:35:00Z"); // 25 min ago, below escalation threshold
    const now1 = NOW;
    const now2 = new Date(NOW.getTime() + 20 * 60_000); // +20 min
    const thresholds1 = {
      rePingThreshold: new Date(now1.getTime() - 15 * 60_000),
      escalateThreshold: new Date(now1.getTime() - 60 * 60_000),
    };
    const thresholds2 = {
      rePingThreshold: new Date(now2.getTime() - 15 * 60_000),
      escalateThreshold: new Date(now2.getTime() - 60 * 60_000),
    };

    // First re_ping at NOW
    const r1 = classifyHandoff({ handoff, ...thresholds1, now: now1 }, rePinged, escalated);
    assert.equal(r1.action, "re_ping");

    // 20 min later — original ping is still below escalation, while last re-ping exceeds 15 min.
    const r2 = classifyHandoff({ handoff, ...thresholds2, now: now2 }, rePinged, escalated);
    assert.equal(r2.action, "re_ping");
  });

  test("handoff re-pinged multiple times eventually escalates", () => {
    const { rePinged, escalated } = freshState();
    const handoff = mkHandoff("h1", "2026-01-01T11:00:00Z"); // exactly 60 min → at escalate boundary
    const now2 = new Date(NOW.getTime() + 1 * 60_000); // +1 min — now it exceeds escalate
    const thresholds2 = {
      rePingThreshold: new Date(now2.getTime() - 15 * 60_000),
      escalateThreshold: new Date(now2.getTime() - 60 * 60_000),
    };

    // At NOW, pingedAt (11:00) equals escalateThreshold (11:00) — not <, so no escalate
    const thresholds1 = {
      rePingThreshold: new Date(NOW.getTime() - 15 * 60_000),
      escalateThreshold: new Date(NOW.getTime() - 60 * 60_000),
    };
    const r1 = classifyHandoff({ handoff, ...thresholds1, now: NOW }, rePinged, escalated);
    assert.equal(r1.action, "re_ping"); // qualifies for re-ping but not escalate (boundary)

    // 1 min later — escalate threshold is now 11:01, pingedAt (11:00) < 11:01 → escalate
    const r2 = classifyHandoff({ handoff, ...thresholds2, now: now2 }, rePinged, escalated);
    assert.equal(r2.action, "escalate");
    assert.ok(escalated.has("h1"));
  });
});
