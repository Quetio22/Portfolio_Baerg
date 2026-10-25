import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = ["/", "/a-propos/", "/realisations/", "/offres/", "/contact/"];
const targets =
  "a.button, a.text-link, button.button, .menu-toggle, .dialog-close, .duo-select";
for (const width of [320, 390, 650, 651, 760, 820, 1050, 1440, 1920]) {
  test(`boutons et cartes sur cinq pages à ${width}`, async ({
    page,
    browserName,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    const posts: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (r.method() !== "GET") posts.push(r.url());
    });
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(r.url());
    });
    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("html")).toHaveAttribute("data-glass", "site");
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page
          .locator(targets)
          .evaluateAll((nodes) =>
            nodes.every((n) => n.classList.contains("glass-native")),
          ),
      ).toBe(true);
      await expect(page.locator(".glass-shell .liqui-glass")).toHaveCount(
        await page.locator(".glass-native").count(),
      );
      await expect(
        page.locator(
          `.liqui-glass--${browserName === "chromium" ? "refract" : "frost"}`,
        ),
      ).toHaveCount(await page.locator(".glass-native").count());
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (route === "/") {
        await expect(page.locator(".home-hero-actions > a")).toHaveCount(2);
        await expect(
          page.locator(".home-hero-actions .glass-shell"),
        ).toHaveCount(0);
        await expect(page.locator(".home-primary")).toHaveAttribute(
          "href",
          "/realisations/",
        );
        await expect(page.locator(".home-secondary")).toHaveAttribute(
          "href",
          "/contact/",
        );
      }
      if (route === "/a-propos/") {
        await expect(page.locator(".duo-card")).toHaveCount(2);
        const clipped = await page
          .locator(".duo-card h2,.duo-card p:not(.eyebrow)")
          .evaluateAll((nodes) =>
            nodes.some((n) => {
              const range = document.createRange();
              range.selectNodeContents(n);
              const card = n.closest(".duo-card")!.getBoundingClientRect();
              return [...range.getClientRects()].some(
                (r) => r.left < card.left || r.right > card.right,
              );
            }),
          );
        expect(clipped).toBe(false);
      }
      if ([390, 1440].includes(width))
        expect(
          (
            await new AxeBuilder({ page })
              .include(".glass-shell, .studio-duo")
              .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
              .analyze()
          ).violations,
        ).toEqual([]);
    }
    expect(errors).toEqual([]);
    expect(posts).toEqual([]);
  });
}
test("les liens du hero gardent exactement le rendu original", async ({
  page,
}) => {
  const metrics = () =>
    page.locator(".home-hero-actions").evaluate((el) =>
      [...el.querySelectorAll("a")].map((a) => {
        const c = getComputedStyle(a),
          r = a.getBoundingClientRect();
        return [
          a.textContent,
          a.getAttribute("href"),
          c.color,
          c.backgroundColor,
          c.borderTop,
          c.padding,
          r.x,
          r.y,
          r.width,
          r.height,
        ];
      }),
    );
  await page.goto("/?glass=original");
  await page.evaluate(() => document.fonts.ready);
  const original = await metrics();
  await page.goto("/");
  await expect(page.locator(".glass-shell").first()).toBeAttached();
  await page.evaluate(() => document.fonts.ready);
  expect(await metrics()).toEqual(original);
});
test("menu et fenêtre juridique gardent leur comportement natif", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.locator(".menu-toggle");
  await expect(menu).toHaveClass(/glass-native/);
  await menu.click();
  await expect(page.locator("#navigation")).toHaveClass(/open/);
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(page.locator("[data-legal]")).not.toHaveClass(/glass-native/);
  await page.locator("[data-legal]").click();
  await expect(page.locator("#legal-dialog")).toBeVisible();
  await expect(page.locator("#legal-dialog .dialog-close")).toHaveClass(
    /glass-native/,
  );
  await page.locator("#legal-dialog .dialog-close").click();
  await expect(page.locator("#legal-dialog")).toBeHidden();
});
test("liens, préremplissage et nouvel onglet conservés", async ({
  page,
  context,
}) => {
  await page.goto("/offres/");
  const link = page
    .locator('a.button[href="/contact/?projet=refonte"]')
    .first();
  await expect(link).toHaveClass(/glass-native/);
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/projet=refonte/);
  await expect(page.locator("[name=projectType]")).toHaveValue(
    "Refonte de site",
  );
  await page.goto("/realisations/");
  const demo = page.locator('a.button[href="/demos/lise/"]');
  await expect(demo).toHaveClass(/glass-native/);
  const popup = context.waitForEvent("page");
  await demo.click({ modifiers: ["Meta"] });
  const tab = await popup;
  await tab.waitForLoadState();
  await expect(tab).toHaveURL(/\/demos\/lise\/$/);
  await tab.close();
});
test("soumission de brouillon sans recréer le bouton du formulaire", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (r) => {
    if (r.method() !== "GET") requests.push(r.url());
  });
  await page.goto("/contact/");
  const submit = page.locator("button[type=submit]");
  await expect(submit).toHaveClass(/glass-native/);
  expect(await submit.evaluate((b: HTMLButtonElement) => b.form?.id)).toBe(
    "project-form",
  );
  await page.evaluate(() => {
    navigator.clipboard.writeText = async (text) => {
      (window as any).copied = text;
    };
  });
  await page.locator("#name").fill("Test Thomas");
  await page.locator("#email").fill("test@example.test");
  await page
    .locator("#message")
    .fill("Un projet de test de brouillon, sans envoi.");
  await submit.click();
  await expect(page.locator("#form-feedback")).toContainText(
    "Brouillon copié. Aucun message envoyé.",
  );
  expect(await page.evaluate(() => (window as any).copied)).toContain(
    "Test Thomas",
  );
  expect(requests).toEqual([]);
});
for (const blocked of ["glass.js", "glass.css"])
  test(`repli natif si ${blocked} manque`, async ({ page }) => {
    await page.route(`**/liquid-glass/${blocked}`, (r) => r.abort());
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute(
      "data-glass",
      "original",
    );
    await expect(page.locator(".glass-native")).toHaveCount(0);
    await page.locator(".closing a.button").click();
    await expect(page).toHaveURL("/contact/");
  });
test("comparaison originale sans chargement React", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/?glass=original");
  expect(requests.some((u) => /\/liquid-glass\/glass\.(js|css)/.test(u))).toBe(
    false,
  );
  await expect(page.locator(".glass-shell")).toHaveCount(0);
});
test("sans JavaScript, tous les contenus et liens restent disponibles", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const p = await context.newPage();
  await p.goto("http://127.0.0.1:4613/a-propos/");
  await expect(p.locator(".duo-card")).toHaveCount(2);
  await expect(p.locator(".duo-card h2")).toHaveText([
    "Deux apprentis.Un projet commun.",
    "Du designau développement.",
  ]);
  await expect(p.locator(".duo-select").first()).toBeHidden();
  await expect(p.locator(".glass-shell")).toHaveCount(0);
  await p.locator(".closing .button").click();
  await expect(p).toHaveURL(/\/contact\/$/);
  await context.close();
});
test("le lien commun répond au survol, à la sélection et au clavier", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/a-propos/");
  const duo = page.locator("[data-studio-duo]");
  const first = page.locator("[data-duo-select=history]");
  const second = page.locator("[data-duo-select=skills]");
  await expect(first).toHaveClass(/glass-native/);
  await page.locator(".duo-card--history").hover();
  await expect(duo).toHaveAttribute("data-focus", "history");
  await page.locator(".duo-card--skills").hover();
  await expect(duo).toHaveAttribute("data-focus", "skills");
  await second.click();
  await expect(second).toHaveAttribute("aria-pressed", "true");
  await page.locator("h1").hover();
  await expect(duo).toHaveAttribute("data-focus", "skills");
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("ArrowRight");
  await expect(second).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(second).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await expect(duo).toHaveAttribute("data-focus", "both");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await first.focus();
  await expect(page.locator(".duo-card--history")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(page.locator(".duo-card--skills")).toHaveCSS(
    "transform",
    "none",
  );
});
test("tactile, joint vertical et rotation des cartes", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4613/a-propos/");
  const second = page.locator("[data-duo-select=skills]");
  await expect(second).toHaveClass(/glass-native/);
  await second.tap();
  await expect(second).toHaveAttribute("aria-pressed", "true");
  const a = await page.locator(".duo-card--history").boundingBox();
  const b = await page.locator(".duo-card--skills").boundingBox();
  expect(b!.y).toBeGreaterThan(a!.y + a!.height);
  await page.setViewportSize({ width: 1050, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});
