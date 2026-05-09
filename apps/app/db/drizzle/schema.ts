/**
 * Relayhouse domain schema — Drizzle (doc 12 §2.2)
 *
 * ORM split: Prisma manages Wasp/auth models (apps/app/schema.prisma).
 * Drizzle manages the domain tables below. Both share the same
 * Postgres 16 + pgvector DB. Wasp `User` ↔ domain `customers` are
 * separate tables, joined by email.
 */
import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  date,
  timestamp,
  jsonb,
  customType,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ---------------------------------------------------------------------------
// pgvector column type (text-embedding-3-small → 1536 dims)
// ---------------------------------------------------------------------------
const vector = customType<{
  data: number[];
  driverData: string;
}>({
  dataType() {
    return "vector(1536)";
  },
  toDriver(value: number[]): string {
    return JSON.stringify(value);
  },
  fromDriver(value: string): number[] {
    return JSON.parse(value);
  },
});

// ---------------------------------------------------------------------------
// Tables (mirrors doc 12 §2.2 schema sketch)
// ---------------------------------------------------------------------------

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    language: text("language").default("en"), // 'en'|'ru'|'es'|'uk'|'pt'
    agencyPartnerCode: text("agency_partner_code"),
  },
);

export const contracts = pgTable(
  "contracts",
  {
    id: text("id").primaryKey(), // 'relay_growth_<ts>_<rand>'
    customerId: uuid("customer_id").references(() => customers.id),
    tier: text("tier").notNull(), // 'starter'|'growth'|'pro'|'enterprise'
    status: text("status").default("pending"), // 'pending'|'active'|'paused'|'cancelled'
    setupFeeUsd: numeric("setup_fee_usd", { precision: 10, scale: 2 }),
    monthlyFeeUsd: numeric("monthly_fee_usd", { precision: 10, scale: 2 }),
    includedMessages: integer("included_messages"),
    overageRateUsd: numeric("overage_rate_usd", { precision: 10, scale: 4 }),
    tuningHoursPerMonth: integer("tuning_hours_per_month"),
    goLiveDate: date("go_live_date"),
    ownerHandoffThreshold: numeric("owner_handoff_threshold", {
      precision: 3,
      scale: 2,
    }).default("0.65"),
    referralCode: text("referral_code"),
    activatedAt: timestamp("activated_at"),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

export const channels = pgTable(
  "channels",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractId: text("contract_id").references(() => contracts.id),
    kind: text("kind").notNull(), // 'telegram'|'whatsapp'|'discord'|'web_widget'
    externalIdentifier: text("external_identifier").notNull(),
    apiTokenEncrypted: text("api_token_encrypted").notNull(),
    status: text("status").default("healthy"),
  },
  (table) => [
    index("channels_contract_kind_idx").on(table.contractId, table.kind),
  ],
);

export const knowledgeBases = pgTable(
  "knowledge_bases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractId: text("contract_id").references(() => contracts.id),
    toneOfVoice: text("tone_of_voice"),
    forbidTopics: jsonb("forbid_topics").default("[]"),
    lastIngestAt: timestamp("last_ingest_at"),
  },
);

export const kbChunks = pgTable(
  "kb_chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kbId: uuid("kb_id").references(() => knowledgeBases.id),
    source: text("source"), // url or filename
    text: text("text").notNull(),
    embedding: vector("embedding"),
    hash: text("hash").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    uniqueIndex("kb_chunks_hash_idx").on(table.kbId, table.hash),
  ],
);

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractId: text("contract_id").references(() => contracts.id),
    channelId: uuid("channel_id").references(() => channels.id),
    externalUserId: text("external_user_id"),
    language: text("language"),
    startedAt: timestamp("started_at").defaultNow(),
  },
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id").references(() => conversations.id),
    direction: text("direction").notNull(), // 'inbound'|'outbound'
    text: text("text").notNull(),
    confidence: numeric("confidence", { precision: 5, scale: 4 }),
    ragSourceIds: jsonb("rag_source_ids").default("[]"),
    llmProvider: text("llm_provider"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("messages_conv_created_idx").on(
      table.conversationId,
      table.createdAt,
    ),
  ],
);

export const ownerHandoffs = pgTable(
  "owner_handoffs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id").references(() => conversations.id),
    reason: text("reason").notNull(), // 'low_confidence'|'forbidden_topic'|'customer_demand'
    pingedAt: timestamp("pinged_at").defaultNow(),
    resolvedByOwnerAt: timestamp("resolved_by_owner_at"),
  },
);

export const tuningSessions = pgTable(
  "tuning_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    contractId: text("contract_id").references(() => contracts.id),
    scheduledFor: timestamp("scheduled_for").notNull(),
    completedAt: timestamp("completed_at"),
    diffSummary: jsonb("diff_summary"),
  },
);

export const referrals = pgTable(
  "referrals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id").references(() => customers.id),
    code: text("code").notNull().unique(),
    marginPercent: numeric("margin_percent", { precision: 5, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow(),
  },
);

// ---------------------------------------------------------------------------
// Type exports
// ---------------------------------------------------------------------------
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Contract = typeof contracts.$inferSelect;
export type NewContract = typeof contracts.$inferInsert;
export type Channel = typeof channels.$inferSelect;
export type NewChannel = typeof channels.$inferInsert;
export type KnowledgeBase = typeof knowledgeBases.$inferSelect;
export type NewKnowledgeBase = typeof knowledgeBases.$inferInsert;
export type KbChunk = typeof kbChunks.$inferSelect;
export type NewKbChunk = typeof kbChunks.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type OwnerHandoff = typeof ownerHandoffs.$inferSelect;
export type NewOwnerHandoff = typeof ownerHandoffs.$inferInsert;
export type TuningSession = typeof tuningSessions.$inferSelect;
export type NewTuningSession = typeof tuningSessions.$inferInsert;
export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;
