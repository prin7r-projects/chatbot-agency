// Run from apps/app directory: node ../../run-migrate.cjs
const { drizzle } = require("drizzle-orm/postgres-js");
const { migrate } = require("drizzle-orm/postgres-js/migrator");
const postgres = require("postgres");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

async function main() {
  const client = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(client);

  await client.unsafe("CREATE EXTENSION IF NOT EXISTS vector");
  console.log("pgvector extension enabled");

  await migrate(db, { migrationsFolder: "./db/drizzle/migrations" });
  console.log("Migrations applied");

  const tables = await client.unsafe(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name",
  );
  console.log("Tables:", tables.map((t) => t.table_name).join(", "));

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
