import { defineConfig } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      "Content-Type": "application/json",
    },
  },
  // API tests only for Phase 1 (no browser needed)
  projects: [
    {
      name: "api",
      testMatch: /.*\.spec\.ts/,
    },
  ],
});
