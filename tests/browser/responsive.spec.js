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
const sizes = [
  [320, 568],
  [360, 800],
  [375, 667],
  [390, 844],
  [430, 932],
  [600, 800],
  [601, 800],
  [768, 1024],
  [800, 600],
  [801, 600],
  [844, 390],
  [932, 430],
  [1024, 768],
  [1440, 900],
];

// A text-only enlargement, including fixed px sizes. Brand artwork is exempt.
// This complements viewport emulation; it does not simulate a physical OS setting.
async function enlargeText(page) {
  await page.evaluate(() => {
    const elements = [...document.querySelectorAll('body *')].filter(
      (el) => !el.closest('[aria-hidden="true"], .honeypot, .logo'),
    );
    const sizes = elements.map((el) => parseFloat(getComputedStyle(el).fontSize));
    elements.forEach((el, i) => (el.style.fontSize = `${sizes[i] * 2}px`));
  });
}

async function expectNoOverflow(page, description) {
  const issues = await page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    const issues = [];
    if (document.documentElement.scrollWidth > viewport + 1) issues.push('Page trop large');
    // Inspect actual text, so clipping/overflow:hidden cannot hide a regression.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (
        !node.textContent.trim() ||
        parent.closest('[aria-hidden="true"], .honeypot, .skip-link, script, style, option') ||
        !parent.getClientRects().length
      )
        continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      if (
        [...range.getClientRects()].some(
          (rect) => rect.width > 0 && (rect.left < -1 || rect.right > viewport + 1),
        )
      ) {
        issues.push(node.textContent.trim().slice(0, 100));
      }
    }
    return issues;
  });
  expect(issues, description).toEqual([]);
}

test.describe('responsive tactile', () => {
  test.use({ isMobile: true, hasTouch: true, reducedMotion: 'reduce' });

  for (const [width, height] of sizes) {
    test(`sept pages à ${width} × ${height}, texte normal et doublé`, async ({
      page,
      browserName,
    }) => {
      await page.setViewportSize({ width, height });
      for (const path of paths) {
        await page.goto(path);
        await page.evaluate(() => document.fonts.ready);
        await expectNoOverflow(page, `${path}, texte normal`);
        if (width <= 800) {
          const smallTargets = await page
            .locator('nav a, .footer-bottom a, .text-link, button, .button')
            .evaluateAll((elements) =>
              elements
                .filter((el) => {
                  const rect = el.getBoundingClientRect();
                  return rect.width > 0 && (rect.height < 44 || rect.width < 44);
                })
                .map((el) => el.textContent.trim()),
            );
          expect(smallTargets, `${path}, zones tactiles`).toEqual([]);
        }
        await enlargeText(page);
        await expectNoOverflow(page, `${path}, texte doublé`);
        if (width === 320 && ['/', '/a-propos/', '/contact/'].includes(path)) {
          await page.screenshot({
            path: `test-results/${browserName}-${path === '/' ? 'accueil' : path.replaceAll('/', '')}-320-texte-double.png`,
            fullPage: true,
          });
        }
      }
    });
  }

  test('menu tactile, texte doublé, rotation et fermeture extérieure', async ({
    page,
    browserName,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    await enlargeText(page);
    const menu = page.locator('.menu-toggle');
    const nav = page.getByRole('navigation', { name: 'Navigation principale' });
    await menu.tap();
    await expect(nav).toBeVisible();
    await expectNoOverflow(page, 'Menu ouvert avec texte doublé');
    const headerBox = await page.locator('.header-inner').boundingBox();
    const navBox = await nav.boundingBox();
    expect(navBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 1);
    await expect(nav.getByRole('link', { name: 'Contact', exact: true })).toBeInViewport();
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([]);
    await page.screenshot({ path: `test-results/${browserName}-menu-320.png` });
    await page.setViewportSize({ width: 844, height: 390 });
    await expect(menu).toBeHidden();
    await expect(nav).toBeVisible();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expectNoOverflow(page, 'Rotation paysage');
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(nav).toBeHidden();
    await menu.tap();
    await page.locator('h1').tap();
    await expect(nav).toBeHidden();
    await menu.tap();
    await nav.getByRole('link', { name: 'Contact', exact: true }).tap();
    await expect(page).toHaveURL('/contact/');
  });

  test('portraits chargés, proportions et absence de chevauchement', async ({ page }) => {
    for (const width of [320, 390, 600, 601, 844]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto('/a-propos/');
      const images = page.locator('.founder-photo img');
      await expect(images).toHaveCount(2);
      for (const image of await images.all()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() => image.evaluate((el) => el.complete && el.naturalWidth > 0))
          .toBe(true);
        const box = await image.boundingBox();
        expect(box.width / box.height).toBeCloseTo(0.8, 2);
      }
      const first = await page.locator('.founder').nth(0).boundingBox();
      const second = await page.locator('.founder').nth(1).boundingBox();
      if (width <= 600) expect(second.y).toBeGreaterThan(first.y + first.height);
      else expect(second.x).toBeGreaterThan(first.x + first.width);
    }
  });

  test('formulaire mobile : champs lisibles, saisie, erreurs et confirmation simulées', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route('**/contact/', async (route) => {
      const response = await route.fetch();
      const body = (await response.text())
        .replace('data-ready="false"', 'data-ready="true"')
        .replace('type="submit" disabled', 'type="submit"');
      await route.fulfill({ response, body });
    });
    await page.goto('/contact/');
    const name = page.getByLabel('Votre nom');
    const email = page.getByLabel('Votre e-mail');
    const nameBox = await name.boundingBox();
    const emailBox = await email.boundingBox();
    expect(emailBox.y).toBeGreaterThan(nameBox.y + nameBox.height);
    for (const field of await page.locator('.field input, .field select, .field textarea').all()) {
      expect(
        await field.evaluate((el) => parseFloat(getComputedStyle(el).fontSize)),
      ).toBeGreaterThanOrEqual(16);
    }
    await name.fill('Test mobile');
    await email.fill('test@example.com');
    await page.getByLabel('Votre projet').selectOption({ index: 1 });
    await page.getByLabel('Budget envisagé').selectOption({ index: 1 });
    await page
      .getByLabel('Votre message')
      .fill('Un message de test sur téléphone, sans envoi réel.');
    // Reduced available height approximates keyboard space, not an actual OS keyboard.
    await page.setViewportSize({ width: 390, height: 360 });
    await expectNoOverflow(page, 'Saisie avec hauteur réduite');
    await page.setViewportSize({ width: 390, height: 844 });
    await enlargeText(page);
    let attempt = 0;
    await page.route('**/api/contact', (route) => {
      attempt++;
      return route.fulfill(
        attempt === 1
          ? {
              status: 502,
              json: {
                ok: false,
                message: 'Le service est indisponible. Vos saisies sont conservées.',
              },
            }
          : { json: { ok: true } },
      );
    });
    const submit = page.getByRole('button', { name: 'Envoyer mon message' });
    const feedback = page.locator('#form-feedback');
    await submit.tap();
    await expect(feedback).toHaveAttribute('data-state', 'error');
    await expect(email).toHaveValue('test@example.com');
    await expect(feedback).toBeFocused();
    await expectNoOverflow(page, 'Erreur mobile');
    await submit.tap();
    await expect(feedback).toHaveAttribute('data-state', 'success');
    await expect(feedback).toBeFocused();
    await expectNoOverflow(page, 'Confirmation mobile');
    expect(attempt).toBe(2);
  });
});
