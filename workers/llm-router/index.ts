/**
 * LLM Router Worker — Relayhouse Phase 0 (no-op stub)
 *
 * Phase 1+: Accepts inbound message → embed query → top-k=5
 * from pgvector → inject into prompt → call GLM 5.1 Flash →
 * parse output → compute confidence → return reply or no-op for handoff.
 */
console.log('[llm-router] worker running (no-op stub)');
