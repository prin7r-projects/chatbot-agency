/**
 * Drizzle database connection for Relayhouse domain tables.
 *
 * Uses the same DATABASE_URL as Prisma/Wasp. Enable pgvector extension
 * on first connect (idempotent).
 */
import { drizzle } from "drizzle-orm/postgres-js";
// postgres-js uses default ESM export; Bun resolves correctly at runtime
// @ts-ignore postgres-js default export; Bun handles CJS/ESM interop at runtime
import postgres from "postgres";
import * as schema from "./schema";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://relayhouse:relayhouse_dev@localhost:5432/relayhouse";

const client = postgres(DATABASE_URL, {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });

// Enable pgvector on connect (idempotent)
export async function ensurePgvector(): Promise<void> {
  await client.unsafe("CREATE EXTENSION IF NOT EXISTS vector");
}

export { schema };
