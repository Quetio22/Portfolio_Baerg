import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createApp } from '../../server.js';
let server, origin;
test.beforeAll(async () => {
  server = createApp();
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  origin = `http://127.0.0.1:${server.address().port}`;
});
test.afterAll(async () => {
  await new Promise((r) => server.close(r));
});
test.use({ reducedMotion: 'reduce' });
for (const width of [320, 390, 650, 651, 820, 1000, 1440, 1920]) {
  test(`Traverse : composition, clavier et démo ${width}`, async ({ page, context }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [],
      mutations = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('response', (r) => {
      if (r.status() >= 400) errors.push(r.url());
    });
    page.on('request', (r) => {
      if (r.method() !== 'GET') mutations.push(r.url());
    });
    const response = await page.goto(origin + '/concepts/atelier-traverse');
    expect(response.status()).toBe(200);
    await expect(page).toHaveURL(origin + '/concepts/atelier-traverse/');
    await expect(page.locator('h1')).toHaveText('Le bois,à votre mesure.');
    await expect(page.locator('.wordmark')).toHaveCSS('font-weight', '700');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const hero = page.locator('.hero-image img');
    expect(await hero.evaluate((e) => e.complete && e.naturalWidth === 1536)).toBe(true);
    expect(await hero.evaluate((e) => getComputedStyle(e).objectPosition)).toBe(
      width <= 650 ? '50% 50%' : '50% 58%',
    );
    if (width > 650) await expect(hero).toHaveCSS('height', '490px');
    await page.getByRole('link', { name: 'Réalisations', exact: true }).click();
    await expect(page.locator('#realisations')).toBeFocused();
    for (const id of ['amenagements', 'entree', 'haut', 'contenu'])
      expect(await page.locator('#' + id).count()).toBe(1);
    const trigger = page.locator('[data-contact]');
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('dialog')).toBeVisible();
    await expect(page.locator('#demo-note')).toHaveText(
      'Démonstration locale : rien n’est envoyé ni enregistré.',
    );
    await page.locator('#project').fill('Une bibliothèque de démonstration');
    await page.locator('#email').fill('demo@example.test');
    await page.locator('.submit').click();
    await expect(page.locator('.form-result')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(page.locator('#email')).toHaveValue('');
    await expect(page.locator('.form-result')).toBeHidden();
    if ([390, 1440].includes(width))
      expect(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
          .violations,
      ).toEqual([]);
    await page.locator('.close').click();
    if ([390, 1440].includes(width))
      expect(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
          .violations,
      ).toEqual([]);
    expect(
      await page.evaluate(() => [
        localStorage.length,
        sessionStorage.length,
        document.getAnimations().length,
      ]),
    ).toEqual([0, 0, 0]);
    expect(await context.cookies()).toEqual([]);
    expect(mutations).toEqual([]);
    expect(errors).toEqual([]);
    await page.getByRole('link', { name: '← Retour à Baerg' }).click();
    await expect(page).toHaveURL(origin + '/realisations/');
  });
}
test('Traverse : sans JavaScript et navigation clavier', async ({ browser, browserName }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(origin + '/concepts/atelier-traverse/');
  await page.keyboard.press(
    browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab',
  );
  await expect(page.locator('.skip')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page.locator('[data-contact]')).toBeDisabled();
  await expect(
    page.getByText(
      'Démonstration indisponible sans JavaScript. Aucun message ne peut être envoyé.',
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.locator('.wordmark')).toHaveCSS('font-weight', '700');
  await context.close();
});
test('Traverse : tactile, rotation et mouvement réduit dynamique', async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  await page.goto(origin + '/concepts/atelier-traverse/');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.evaluate(() => document.getAnimations().length)).toBe(0);
  await page.locator('[data-contact]').tap();
  await expect(page.locator('dialog')).toBeVisible();
  await page.setViewportSize({ width: 844, height: 390 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.close').tap();
  await expect(page.locator('[data-contact]')).toBeFocused();
  await context.close();
});
for (const width of [390, 820, 1440]) {
  test(`Traverse : galerie échange animé ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(origin + '/concepts/atelier-traverse/');
    const gallery = page.locator('.project-grid');
    const cards = gallery.locator('article');
    const buttons = gallery.locator('button');
    await gallery.scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => document.getAnimations().length)).toBe(0);
    const firstBefore = await cards.nth(0).boundingBox();
    const secondBefore = await cards.nth(1).boundingBox();
    expect(firstBefore.width).toBeGreaterThan(secondBefore.width * 1.8);
    await buttons.nth(1).click();
    await expect(buttons.nth(1)).toHaveAttribute('aria-pressed', 'true');
    await expect
      .poll(
        async () =>
          (await cards.nth(1).boundingBox()).width / (await cards.nth(0).boundingBox()).width,
      )
      .toBeGreaterThan(1.8);
    await expect.poll(() => page.evaluate(() => document.getAnimations().length)).toBe(0);
    const firstAfter = await cards.nth(0).boundingBox();
    const secondAfter = await cards.nth(1).boundingBox();
    expect(firstAfter.width + secondAfter.width).toBeCloseTo(
      firstBefore.width + secondBefore.width,
      0,
    );
    expect(secondAfter.width).toBeCloseTo(firstBefore.width, 0);
    // Safari does not focus buttons on pointer click; establish keyboard focus first.
    await buttons.nth(1).focus();
    await page.keyboard.press('ArrowLeft');
    await expect(buttons.nth(0)).toBeFocused();
    await expect(buttons.nth(0)).toHaveAttribute('aria-pressed', 'true');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await buttons.nth(1).click();
    expect(await cards.nth(1).evaluate((e) => getComputedStyle(e).transitionDuration)).toBe('0s');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}
