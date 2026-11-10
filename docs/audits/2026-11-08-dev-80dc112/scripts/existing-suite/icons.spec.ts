import { test, expect } from "@playwright/test";
const routes = [
  "/",
  "/a-propos/",
  "/realisations/",
  "/offres/",
  "/contact/",
  "/demos/lise/",
  "/demos/atelier-traverse/",
  "/demos/midi-et-compagnie/",
];
for (const width of [390, 1440])
  test(`Lucide sur huit pages à ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(r.url());
    });
    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.locator("svg.site-icon").count()).toBeGreaterThan(0);
      expect(
        await page
          .locator("svg:not([data-lucide])")
          .evaluateAll(
            (nodes) =>
              nodes.filter(
                (el) =>
                  !el.closest(".glass-underlay") &&
                  el.parentElement?.tagName.toLowerCase() !== "body",
              ).length,
          ),
      ).toBe(0);
      expect(
        await page
          .locator("svg.site-icon")
          .evaluateAll((nodes) =>
            nodes.every(
              (el) =>
                el.getAttribute("aria-hidden") === "true" &&
                el.getAttribute("focusable") === "false" &&
                el.childElementCount > 0,
            ),
          ),
      ).toBe(true);
      expect(await page.locator("body").innerText()).not.toMatch(/[↗↺←→↑×]/);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
test("icônes des démos : accordéon, galerie, fenêtre et retour", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demos/lise/");
  const summary = page.locator("summary").first();
  await expect(summary.locator("[data-lucide=plus]")).toBeVisible();
  await expect(summary.locator("[data-lucide=minus]")).toBeHidden();
  await summary.click();
  await expect(summary.locator("[data-lucide=minus]")).toBeVisible();
  await expect(summary.locator("[data-lucide=plus]")).toBeHidden();
  await page.goto("/demos/atelier-traverse/");
  const controls = page.locator(".gallery-select");
  await controls.nth(1).focus();
  await page.keyboard.press("Enter");
  await expect(controls.nth(1)).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(controls.first()).toHaveAttribute("aria-pressed", "true");
  await page.locator("[data-contact]").click();
  await expect(page.locator("dialog")).toBeVisible();
  await page.locator("button.close").click();
  await expect(page.locator("dialog")).toBeHidden();
  await page.goto("/demos/midi-et-compagnie/");
  await page.locator(".back-top").click();
  await expect(page).toHaveURL(/#haut$/);
});
