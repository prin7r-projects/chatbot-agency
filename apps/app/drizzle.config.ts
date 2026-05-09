import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/drizzle/schema.ts",
  out: "./db/drizzle/migrations",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://relayhouse:relayhouse_dev@localhost:5432/relayhouse",
  },
});
