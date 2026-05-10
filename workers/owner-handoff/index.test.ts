/**
 * Owner-handoff worker — focused unit tests
 *
 * Tests polling decision logic (time thresholds) without requiring
 * a live database or Telegram credentials.
 */
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { getTimeThresholds } from "./index.ts";

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
