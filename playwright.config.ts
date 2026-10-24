import { defineConfig, devices } from "@playwright/test";

// End-to-end and accessibility tests. Run 'npm run build' first; the tests use the built site.
// Set CHROMIUM_PATH to use an already-installed Chromium instead of Playwright's own download.
const executablePath = process.env.CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: "tests/e2e",
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    launchOptions: { executablePath },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], launchOptions: { executablePath } } },
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions: { executablePath } } },
  ],
  webServer: {
    command: "npx vite preview --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: true,
  },
});
