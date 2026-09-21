import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createApp } from '../../server.js';

let server;
let origin;
test.beforeAll(async () => {
  server = createApp();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
test.afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});
test.use({ reducedMotion: 'reduce' });

async function noOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const concept of ['atelier-traverse', 'midi-et-compagnie']) {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [768, 1024],
    [844, 390],
    [1024, 768],
    [1440, 900],
  ]) {
    test(`${concept} : affichage et interactions ${width} × ${height}`, async ({
      page,
      context,
      browserName,
    }) => {
      await page.setViewportSize({ width, height });
      const errors = [];
      const unexpectedRequests = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      page.on('response', (response) => {
        if (response.status() >= 400) errors.push(response.url());
      });
      page.on('requestfailed', (request) => errors.push(request.url()));
      page.on('request', (request) => {
        if (request.method() !== 'GET' || !request.url().startsWith(origin + '/'))
          unexpectedRequests.push(request.url());
      });
      await page.goto(`${origin}/concepts/${concept}/`);
      await page.evaluate(() => document.fonts.ready);
      await expect(
        page.getByText('Projet conceptuel — entreprise fictive', { exact: true }),
      ).toBeVisible();
      const back = page.getByRole('link', { name: '← Retour à Baerg', exact: true });
      await expect(back).toHaveAttribute('href', '/realisations/');
      expect((await back.boundingBox()).height).toBeGreaterThanOrEqual(44);
      await noOverflow(page);
      for (const image of await page.locator('img').all()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0))
          .toBe(true);
      }
      await expect(back).toBeInViewport();
      const brokenAnchors = await page
        .locator('a[href^="#"]')
        .evaluateAll((links) =>
          links
            .filter((link) => !document.getElementById(link.hash.slice(1)))
            .map((link) => link.hash),
        );
      expect(brokenAnchors).toEqual([]);
      await page.evaluate(() => scrollTo(0, 0));
      if (concept === 'atelier-traverse') {
        await expect(page.locator('.menu-toggle, .material-note')).toHaveCount(0);
        await page.getByRole('link', { name: 'Les aménagements', exact: true }).click();
        await expect(page.locator('#amenagements')).toBeFocused();
        const headerBottom = await page
          .locator('.site-header')
          .evaluate((el) => el.getBoundingClientRect().bottom);
        expect(
          await page.locator('#amenagements').evaluate((el) => el.getBoundingClientRect().top),
        ).toBeGreaterThanOrEqual(headerBottom - 1);
        const cards = await page.locator('.inspiration-card').all();
        const firstCard = await cards[0].boundingBox();
        const secondCard = await cards[1].boundingBox();
        expect(secondCard.y).toBeGreaterThanOrEqual(firstCard.y + firstCard.height);
        for (const summary of await page.locator('summary').all()) {
          await summary.focus();
          await page.keyboard.press('Enter');
          expect(await summary.evaluate((el) => el.parentElement.open)).toBe(true);
          await noOverflow(page);
          await page.keyboard.press('Enter');
        }
        await expect(page.locator('.demo-note')).toContainText('Aucune demande n’est envoyée');
        await expect(page.locator('.nav-quote button')).toBeDisabled();
      } else {
        await page.locator('.header a[href="#horaires"]').click();
        const headerBottom = await page
          .locator('.header')
          .evaluate((el) => el.getBoundingClientRect().bottom);
        expect(
          await page.locator('#horaires').evaluate((el) => el.getBoundingClientRect().top),
        ).toBeGreaterThanOrEqual(headerBottom - 1);
        await expect(page.locator('.hours-panel')).toContainText('11 h 30 – 14 h 30');
        for (const filter of ['entrees', 'plats', 'desserts', 'all']) {
          const button = page.locator(`[data-filter="${filter}"]`);
          await button.focus();
          await page.keyboard.press('Enter');
          await expect(button).toHaveAttribute('aria-pressed', 'true');
          await expect(page.locator('.menu-category:visible')).toHaveCount(
            filter === 'all' ? 3 : 1,
          );
          await expect(page.locator('#filter-status')).not.toBeEmpty();
        }
        await expect(page.locator('.reservation button')).toBeDisabled();
      }
      await expect(page.locator('form, input, textarea')).toHaveCount(0);
      expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([
        0, 0,
      ]);
      expect(await context.cookies()).toEqual([]);
      expect(unexpectedRequests).toEqual([]);
      const header = page.locator('[data-scroll-header]');
      await page.evaluate(() => {
        document.activeElement.blur();
        scrollTo(0, 0);
      });
      await expect(header).not.toHaveClass(/is-scroll-hidden/);
      await page.mouse.move(width / 2, height / 2);
      await page.mouse.wheel(0, 500);
      await expect(header).toHaveClass(/is-scroll-hidden/);
      await expect(back).toBeInViewport();
      await page.mouse.wheel(0, -1);
      await expect(header).not.toHaveClass(/is-scroll-hidden/);
      await page.mouse.wheel(0, 100);
      await expect(header).toHaveClass(/is-scroll-hidden/);
      await header.locator('a').first().focus();
      await expect(header).not.toHaveClass(/is-scroll-hidden/);
      await noOverflow(page);
      if ([390, 1440].includes(width)) {
        expect(
          (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
            .violations,
        ).toEqual([]);
        await page.evaluate(() => scrollTo(0, 0));
        if (process.env.CAPTURE_CONCEPTS && browserName === 'chromium') {
          await page.evaluate(() => document.activeElement.blur());
          await page.mouse.move(0, 0);
          await page.screenshot({
            path: `docs/concepts/captures/${concept}-${width}-ecran.jpg`,
            quality: 85,
          });
          await page.screenshot({
            path: `docs/concepts/captures/${concept}-${width}.jpg`,
            fullPage: true,
            quality: 85,
          });
        }
      }
      expect(errors).toEqual([]);
      await back.click();
      await expect(page).toHaveURL(`${origin}/realisations/`);
    });
  }

  test(`${concept} : navigation tactile et rotation`, async ({ browser }) => {
    const context = await browser.newContext({
      isMobile: true,
      hasTouch: true,
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto(`${origin}/concepts/${concept}/`);
    if (concept === 'atelier-traverse') {
      await page.getByRole('link', { name: 'Les aménagements', exact: true }).tap();
      await page.locator('summary').first().tap();
      await expect(page.locator('details').first()).toHaveAttribute('open', '');
    } else {
      await page.locator('.mobile-shortcuts a[href="#carte"]').tap();
      await page.locator('[data-filter="plats"]').tap();
      await expect(page.locator('.menu-category:visible')).toHaveCount(1);
      await page.locator('.mobile-shortcuts a[href="#horaires"]').tap();
      await expect(page.locator('#horaires')).toBeInViewport();
    }
    await page.setViewportSize({ width: 844, height: 390 });
    await noOverflow(page);
    await expect(page.getByRole('link', { name: '← Retour à Baerg' })).toBeInViewport();
    await context.close();
  });

  test(`${concept} : clavier et fonctionnement sans JavaScript`, async ({
    browser,
    browserName,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    await page.goto(`${origin}/concepts/${concept}/`);
    // WebKit sur macOS réserve Tab aux contrôles ; Option-Tab inclut les liens.
    await page.keyboard.press(
      browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab',
    );
    await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    if (concept === 'midi-et-compagnie') {
      await expect(page.locator('.menu-category:visible')).toHaveCount(3);
      await expect(page.locator('.filters')).toBeHidden();
    } else {
      await expect(page.getByRole('link', { name: 'Les aménagements', exact: true })).toBeVisible();
    }
    await noOverflow(page);
    await context.close();
  });
}
