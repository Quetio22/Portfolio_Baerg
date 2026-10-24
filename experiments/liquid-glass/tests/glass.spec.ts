import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const modes = ["original", "liqui"];
for (const width of [320, 390, 650, 651, 820, 1050, 1440, 1920]) {
  test(`deux liens et responsive ${width}`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    const mutations: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) errors.push(r.url());
    });
    page.on("request", (r) => {
      if (r.method() !== "GET") mutations.push(r.url());
    });
    for (const mode of modes) {
      await page.goto(`/?glass=${mode}`);
      await page.evaluate(() => document.fonts.ready);
      if (mode === "liqui")
        await expect(page.locator(".glass-action")).toHaveCount(2);
      else await expect(page.locator(".glass-action")).toHaveCount(0);
      const actions = page.locator(".home-hero-actions");
      const links = actions.getByRole("link");
      await expect(links).toHaveCount(2);
      await expect(links.nth(0)).toHaveAttribute("href", "/realisations/");
      await expect(links.nth(1)).toHaveAttribute("href", "/contact/");
      if (mode === "liqui") {
        await expect(page.locator("html")).toHaveAttribute(
          "data-glass",
          "liqui",
        );
        await expect(
          page.locator(
            `.liqui-glass--${browserName === "chromium" ? "refract" : "frost"}`,
          ),
        ).toHaveCount(2);
        for (const link of await links.all())
          expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      for (const label of await actions.locator(".glass-action__label").all()) {
        expect(
          await label.evaluate((el) => {
            const r = document.createRange();
            r.selectNodeContents(el);
            const a = el.closest("a")!.getBoundingClientRect();
            return [...r.getClientRects()].every(
              (r) => r.left >= a.left && r.right <= a.right,
            );
          }),
        ).toBe(true);
      }
    }
    expect(errors).toEqual([]);
    expect(mutations).toEqual([]);
    if ([390, 1440].includes(width)) {
      const violations = (
        await new AxeBuilder({ page })
          .include(".home-hero-actions")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations;
      expect(violations).toEqual([]);
      await page.locator(".glass-action").first().scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `../../test-results/liquid-glass/${browserName}-${width}.png`,
      });
    }
  });
}
test("la page originale reste identique et ne charge pas React", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/");
  expect(requests.some((u) => /\/liquid-glass\/glass\.(js|css)/.test(u))).toBe(
    false,
  );
  const selectors = [
    ".site-header",
    ".home-hero h1",
    ".home-scene",
    ".home-signature",
    ".editorial",
    ".closing",
  ];
  const read = () =>
    page.evaluate(
      (selectors) =>
        Object.fromEntries(
          selectors.map((s) => {
            const e = document.querySelector(s)!;
            const r = e.getBoundingClientRect(),
              c = getComputedStyle(e);
            return [s, [r.x, r.y, r.width, r.height, c.color, c.font]];
          }),
        ),
      selectors,
    );
  await page.evaluate(() => document.fonts.ready);
  const original = await read();
  await page.goto("/?glass=original");
  await page.evaluate(() => document.fonts.ready);
  expect(await read()).toEqual(original);
});
test("navigation clavier, Enter et nouvel onglet", async ({
  page,
  context,
}) => {
  await page.goto("/?glass=liqui");
  const first = page.getByRole("link", {
    name: "Découvrir les réalisations",
    exact: true,
  });
  await expect(first).toHaveClass(/glass-action/);
  await first.focus();
  await expect(first).toBeFocused();
  await expect(first).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/realisations/");
  await page.goto("/?glass=liqui");
  const second = page.locator(".glass-action").nth(1);
  await expect(second).toBeVisible();
  const opened = context.waitForEvent("page");
  await second.click({ modifiers: ["Meta"] });
  const tab = await opened;
  await tab.waitForLoadState();
  await expect(tab).toHaveURL(/\/contact\/$/);
  await tab.close();
});
for (const blocked of ["glass.js", "glass.css"])
  test(`repli lorsque ${blocked} échoue`, async ({ page }) => {
    await page.route(`**/liquid-glass/${blocked}`, (r) => r.abort());
    await page.goto("/?glass=liqui");
    await expect(page.locator("html")).toHaveAttribute(
      "data-glass",
      "original",
    );
    await expect(page.locator(".home-primary")).toBeVisible();
    await expect(page.locator(".home-secondary")).toBeVisible();
    await page.locator(".home-primary").click();
    await expect(page).toHaveURL("/realisations/");
  });
test("sans JavaScript, les liens HTML restent disponibles", async ({
  browser,
}) => {
  const c = await browser.newContext({ javaScriptEnabled: false });
  const p = await c.newPage();
  await p.goto("http://127.0.0.1:4613/?glass=liqui");
  await expect(p.locator(".home-primary")).toBeVisible();
  await expect(p.locator(".home-secondary")).toBeVisible();
  await p.locator(".home-secondary").click();
  await expect(p).toHaveURL(/\/contact\/$/);
  await c.close();
});
test("mouvement réduit et état de focus", async ({ page }) => {
  await page.goto("/?glass=liqui");
  await expect(page.locator(".glass-action")).toHaveCount(2);
  expect(
    await page
      .locator(".glass-action")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  expect(
    await page
      .locator(".glass-action__arrow")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
  ).toBe("0s");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(
              (a) =>
                a.effect?.target instanceof Element &&
                a.effect.target.closest(".liquid-glass-actions"),
            ).length,
      ),
    )
    .toBe(0);
});

test("sans filtre de fond, conserver les liens natifs", async ({ page }) => {
  await page.addInitScript(() => {
    const original = CSS.supports.bind(CSS);
    CSS.supports = ((...args: string[]) =>
      args[0].includes("backdrop-filter")
        ? false
        : original(args[0], args[1])) as typeof CSS.supports;
  });
  await page.goto("/?glass=liqui");
  await expect(page.locator("html")).toHaveAttribute("data-glass", "original");
  await expect(page.locator(".home-primary")).toBeVisible();
  await expect(page.locator(".glass-action")).toHaveCount(0);
});
