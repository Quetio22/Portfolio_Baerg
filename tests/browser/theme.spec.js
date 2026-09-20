import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const paths = [
  '/',
  '/a-propos/',
  '/realisations/',
  '/contact/',
  '/mentions-legales/',
  '/confidentialite/',
  '/introuvable/',
];

test('thème : bouton au clavier, navigation, rechargement et application avant le script principal', async ({
  page,
}) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Mode sombre', exact: true });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(28, 29, 34)');
  await expect(page.locator('.hero-actions .button')).toHaveCSS(
    'background-color',
    'rgb(64, 89, 216)',
  );
  await expect(page.locator('.art-annotation')).toHaveCSS('background-color', 'rgb(240, 184, 154)');
  await expect(page.locator('.browser-sheet')).toHaveCSS('color', 'rgb(41, 42, 48)');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#1C1D22');
  await page.locator('.hero-actions .button').click();
  await expect(page).toHaveURL('/contact/');
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await toggle.click();
  // The tiny head script must restore the theme even if the deferred app cannot load.
  await page.route('**/app.js?*', (route) => route.abort());
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(28, 29, 34)');
  await expect(page.locator('.theme-toggle')).toBeHidden();
});

test('thème utilisable sans stockage navigateur', async ({ page }) => {
  await page.addInitScript(() => {
    for (const method of ['getItem', 'setItem']) {
      Storage.prototype[method] = () => {
        throw new DOMException('Storage blocked', 'SecurityError');
      };
    }
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Mode sombre', exact: true });
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(errors).toEqual([]);
});

test('thème synchronisé entre les onglets', async ({ page, context }) => {
  await page.goto('/');
  const other = await context.newPage();
  await other.goto('/a-propos/');
  await page.getByRole('button', { name: 'Mode sombre', exact: true }).click();
  await expect(other.locator('.theme-toggle')).toHaveAttribute('aria-pressed', 'true');
  await other.locator('.theme-toggle').click();
  await expect(page.locator('.theme-toggle')).toHaveAttribute('aria-pressed', 'false');
  await other.close();
});

test.describe('mode sombre responsive', () => {
  test.use({ isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  for (const width of [320, 390, 844, 1440]) {
    test(`toutes les pages et contrastes à ${width}px`, async ({ page, browserName }) => {
      await page.setViewportSize({ width, height: width === 844 ? 390 : 844 });
      await page.goto('/');
      await page.getByRole('button', { name: 'Mode sombre', exact: true }).tap();
      for (const path of paths) {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(28, 29, 34)');
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          path,
        ).toBe(true);
        const toggle = page.locator('.theme-toggle');
        await expect(toggle).toBeInViewport();
        const box = await toggle.boundingBox();
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
        const violations = (
          await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
        ).violations;
        expect(violations, path).toEqual([]);
        if ([390, 1440].includes(width) && ['/', '/a-propos/', '/contact/'].includes(path)) {
          await page.screenshot({
            path: `test-results/${browserName}-sombre-${path === '/' ? 'accueil' : path.replaceAll('/', '')}-${width}.png`,
            fullPage: true,
          });
        }
      }
    });
  }

  test('menu mobile sombre, survol, focus et messages fonctionnels', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/contact/');
    await page.getByRole('button', { name: 'Mode sombre', exact: true }).tap();
    await page.getByRole('button', { name: 'Menu', exact: true }).tap();
    await expect(page.locator('#main-navigation')).toHaveCSS('background-color', 'rgb(28, 29, 34)');
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(page.locator('.menu-toggle')).toBeFocused();
    // Check both functional palettes without enabling the unconfigured mail service.
    for (const state of ['error', 'success']) {
      await page.locator('#form-feedback').evaluate((el, state) => {
        el.dataset.state = state;
        el.textContent =
          state === 'error' ? 'Votre message n’a pas pu être envoyé.' : 'Votre message a été reçu.';
        el.focus();
      }, state);
      expect(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
          .violations,
        state,
      ).toEqual([]);
    }
    await page.locator('.theme-toggle').focus();
    await expect(page.locator('.theme-toggle')).toHaveCSS('outline-style', 'solid');
    await page.locator('.theme-toggle').hover();
    await expect(page.locator('.theme-toggle')).toHaveCSS('background-color', 'rgb(37, 38, 45)');
  });
});
