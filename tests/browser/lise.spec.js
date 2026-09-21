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

for (const width of [320, 390, 700, 768, 1024, 1440]) {
  test(`Lise : rendu et simulation complète à ${width}px`, async ({
    page,
    context,
    browserName,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    const unexpected = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    page.on('response', (r) => {
      if (r.status() >= 400) errors.push(r.url());
    });
    page.on('requestfailed', (r) => errors.push(r.url()));
    page.on('request', (r) => {
      if (r.method() !== 'GET' || !r.url().startsWith(origin + '/')) unexpected.push(r.url());
    });
    await page.goto(origin + '/concepts/lise/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('h1')).toHaveText('Choisissez votre soin.Prenez votre temps.');
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0))
        .toBe(true);
    }
    expect(
      await page
        .locator('a[href^="#"]')
        .evaluateAll((links) =>
          links.filter((a) => !document.getElementById(a.hash.slice(1))).map((a) => a.hash),
        ),
    ).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    for (const summary of await page.locator('summary').all()) {
      await summary.focus();
      await page.keyboard.press('Enter');
      expect(await summary.evaluate((el) => el.parentElement.open)).toBe(true);
      await page.keyboard.press('Enter');
    }
    if ([390, 1440].includes(width)) {
      expect(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
          .violations,
      ).toEqual([]);
      await page.evaluate(() => {
        document.activeElement.blur();
        scrollTo(0, 0);
      });
      if (browserName === 'chromium') {
        await page.screenshot({
          path: `docs/concepts/captures/lise-${width}.jpg`,
          fullPage: true,
          quality: 85,
        });
        await page.screenshot({
          path: `docs/concepts/captures/lise-${width}-ecran.jpg`,
          quality: 85,
        });
      }
    }
    await page.getByRole('button', { name: 'Choisir un créneau' }).click();
    await expect(page.locator('#booking-error')).toHaveText('Choisissez un soin pour continuer.');
    await page.locator('[name="service"][value="visage"]').check();
    await page.getByRole('button', { name: 'Choisir un créneau' }).click();
    await expect(page.locator('[data-step="2"] h3')).toBeFocused();
    await page.getByRole('button', { name: 'Voir le récapitulatif' }).click();
    await expect(page.locator('#booking-error')).toContainText('Choisissez un jour');
    await page.locator('[name="day"][value="Samedi"]').check();
    await page.getByRole('button', { name: 'Voir le récapitulatif' }).click();
    await expect(page.locator('#booking-error')).toContainText('Choisissez une heure');
    await page.locator('[name="time"][value="12:00"]').check();
    await page.getByRole('button', { name: 'Voir le récapitulatif' }).click();
    await expect(page.locator('#booking-summary')).toContainText('12 h 00 – 13 h 00');
    await expect(page.locator('#booking-summary')).toContainText('95 CHF');
    await page.getByRole('button', { name: 'Modifier le créneau' }).click();
    await page.getByRole('button', { name: 'Changer de soin' }).click();
    await page.locator('[name="service"][value="mains"]').check();
    await page.getByRole('button', { name: 'Choisir un créneau' }).click();
    await page.getByRole('button', { name: 'Voir le récapitulatif' }).click();
    await expect(page.locator('#booking-summary')).toContainText('12 h 00 – 12 h 40');
    await expect(page.locator('#booking-summary')).toContainText('55 CHF');
    if (browserName === 'chromium' && [390, 1440].includes(width)) {
      await page.locator('#booking-app').screenshot({
        path: `docs/concepts/captures/lise-rendez-vous-${width}.jpg`,
        quality: 85,
      });
    }
    if (width === 390)
      expect(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
          .violations,
      ).toEqual([]);
    await page.getByRole('button', { name: 'Simuler ce rendez-vous' }).click();
    await expect(page.locator('#booking-complete')).toContainText(
      'Aucun rendez-vous n’a été réservé.',
    );
    await expect(page.locator('#booking-complete h3')).toBeFocused();
    await expect(page.locator('input:checked')).toHaveCount(0);
    await page.getByRole('button', { name: 'Recommencer la simulation' }).click();
    await expect(page.locator('[data-step="1"]')).toBeVisible();
    await page.locator('[data-choose="massage"]').click();
    await expect(page.locator('[data-step="2"]')).toBeVisible();
    await expect(page.locator('.selected-service')).toContainText('45 min · 75 CHF');
    await page.locator('[name="day"][value="Mardi"]').check();
    await page.locator('[name="time"][value="16:30"]').check();
    await page.locator('[name="day"][value="Samedi"]').check();
    await expect(page.locator('[name="time"]:checked')).toHaveCount(0);
    await expect(page.locator('[name="time"][value="16:30"]')).toHaveCount(0);
    expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
    expect(await context.cookies()).toEqual([]);
    expect(unexpected).toEqual([]);
    expect(errors).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
}

test('Lise : accès depuis les réalisations Baerg', async ({ page }) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(origin + '/realisations/');
    const project = page.locator('.project').filter({ hasText: 'Lise — soins & bien-être' });
    await expect(project).toHaveCount(1);
    await expect(project).toContainText('Concept non commandé');
    const image = project.locator('img');
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true);
    await project.getByRole('link', { name: 'Voir la maquette' }).click();
    await expect(page).toHaveURL(origin + '/concepts/lise/');
    await page.locator('.concept-bar a').click();
    await expect(page).toHaveURL(origin + '/realisations/');
  }
});

test('Lise : tactile, navigation et absence de JavaScript', async ({ browser, browserName }) => {
  const context = await browser.newContext({
    isMobile: true,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(origin + '/concepts/lise/');
  await page.locator('.quick-choices a').last().tap();
  await expect(page.locator('#soin-mains')).toBeFocused();
  await page.locator('[data-choose="mains"]').tap();
  await page.locator('[name="day"][value="Mardi"]').tap();
  await page.locator('[name="time"]').first().tap();
  await page.getByRole('button', { name: 'Voir le récapitulatif' }).tap();
  await page.getByRole('button', { name: 'Simuler ce rendez-vous' }).tap();
  await expect(page.locator('#booking-complete')).toBeVisible();
  await page.setViewportSize({ width: 844, height: 390 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
  const plain = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const nojs = await plain.newPage();
  await nojs.goto(origin + '/concepts/lise/');
  await expect(nojs.locator('.no-js')).toBeVisible();
  await expect(nojs.locator('#booking-app')).toBeHidden();
  await nojs.keyboard.press(
    browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab',
  );
  await expect(nojs.locator('.skip')).toBeFocused();
  await nojs.keyboard.press('Enter');
  await expect(nojs.locator('main')).toBeFocused();
  await plain.close();
});
