import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  outputDir: "../../test-results/liquid-glass",
  workers: 1,
  fullyParallel: false,
  timeout: 30000,
  use: {
    baseURL: process.env.GLASS_URL || "http://127.0.0.1:4613",
    trace: "retain-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  webServer: {
    command: "node ../../server.js",
    url: "http://127.0.0.1:4613",
    env: { PORT: "4613" },
    reuseExistingServer: !process.env.CI,
  },
});
