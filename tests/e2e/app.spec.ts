import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Every page is checked with axe against WCAG 2.0, 2.1 and 2.2 A and AA rules.
async function checkA11y(page: Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const summary = results.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.help}`);
  expect(summary, `Accessibility problems on ${label}`).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.goto("./");
  await page.evaluate(() => localStorage.clear());
  await page.goto("./");
});

test("static pages are accessible", async ({ page }) => {
  for (const path of ["", "#/about", "#/sources", "#/privacy", "#/accessibility"]) {
    await page.goto(`./${path}`);
    await expect(page.locator("h1")).toBeVisible();
    await checkA11y(page, path || "home");
  }
});

test("complete a simple assessment and get the expected report", async ({ page }) => {
  await page.getByRole("button", { name: "Start the assessment" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Service details" })).toBeVisible();
  await page.getByLabel("Service or application name").fill("Test service");
  await checkA11y(page, "service details");

  await page.getByRole("link", { name: /^Next: Service profile/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Service profile" })).toBeVisible();
  for (const group of await page.locator("fieldset.question").all()) {
    await group.getByLabel("Yes", { exact: true }).check();
  }
  await checkA11y(page, "service profile");

  // Answer every question 'Yes' except one 'No' on a critical criterion.
  // After each click, wait for the next page's heading before reading its questions.
  const h1 = page.locator("h1");
  for (;;) {
    const before = (await h1.textContent()) ?? "";
    await page.getByRole("link", { name: /^Next: / }).click();
    await expect(h1).not.toHaveText(before);
    const title = await h1.textContent();
    if (title === "Materiality") break;
    for (const q of await page.locator("fieldset.question").all()) {
      const id = (await q.locator(".qid").textContent())?.trim();
      await q.getByLabel(id === "ACC-05" ? "No" : "Yes", { exact: true }).check();
    }
    if (title === "Accessibility") await checkA11y(page, "questions");
  }

  for (const q of await page.locator("fieldset.question").all()) {
    await q.getByRole("radio").nth(2).check(); // rate every factor 3
  }
  await checkA11y(page, "materiality");

  await page.getByRole("link", { name: "See the report" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Test service");
  await expect(page.locator(".result.tone-red .rating")).toHaveText("Needs attention");
  await expect(page.locator(".result.tone-red .figure")).toHaveText("60");
  await expect(page.locator(".result.mat-yellow .rating")).toHaveText("Moderate");
  await expect(page.getByRole("table").first().locator("tbody tr").first()).toContainText("ACC-05");
  await checkA11y(page, "report");
});

test("answers are kept after a reload", async ({ page }) => {
  await page.getByRole("button", { name: "Start the assessment" }).click();
  await page.getByLabel("Service or application name").fill("Saved service");
  await page.reload();
  await page.goto("./");
  await expect(page.getByText("You have an assessment of Saved service saved in this browser.")).toBeVisible();
});
