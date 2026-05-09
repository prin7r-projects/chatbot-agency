/**
 * Programmatic migration runner for Drizzle.
 * Call `migrateDb()` before using `db` in any worker.
 */
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index";

export async function migrateDb(): Promise<void> {
  await migrate(db, {
    migrationsFolder: "./db/drizzle/migrations",
  });
}
