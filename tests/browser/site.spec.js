import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { createApp } from '../../server.js';

test('les nouveaux styles remplacent l’ancien CSS encore présent dans le cache navigateur', async ({
  browser,
}) => {
  const app = createApp();
  let legacyStylesheetRequests = 0;
  const server = createServer((req, res) => {
    if (req.url === '/ancienne-version/') {
      res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' });
      return res.end(
        '<!doctype html><html><head><link rel="stylesheet" href="/styles.css"></head><body><a href="/">Ouvrir le site</a></body></html>',
      );
    }
    if (req.url === '/styles.css') {
      legacyStylesheetRequests++;
      res.writeHead(200, { 'Content-Type': 'text/css', 'Cache-Control': 'public, max-age=3600' });
      return res.end('body, .hero-band { background: #f7f3ec; }');
    }
    app.emit('request', req, res);
  });
  const context = await browser.newContext();
  try {
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/ancienne-version/`);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(247, 243, 236)');
    // No request interception: the browser really stores and reuses the old response.
    await page.evaluate(
      () =>
        new Promise((resolve, reject) => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = '/styles.css';
          link.onload = resolve;
          link.onerror = reject;
          document.head.append(link);
        }),
    );
    expect(legacyStylesheetRequests).toBe(1);
    await page.getByRole('link', { name: 'Ouvrir le site' }).click();
    await expect(page.locator('.hero-band')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(page.locator('.site-header')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute(
      'href',
      /\/styles\.css\?v=[a-f0-9]+/,
    );
    expect(legacyStylesheetRequests).toBe(1);
  } finally {
    await context.close();
    await new Promise((resolve) => server.close(resolve));
    app.emit('close');
  }
});

const paths = [
  '/',
  '/a-propos/',
  '/realisations/',
  '/contact/',
  '/mentions-legales/',
  '/confidentialite/',
  '/introuvable/',
];
for (const width of [320, 390, 600, 768, 1024, 1440]) {
  test(`pages, ressources et débordements à ${width}px`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    const failedResources = [];
    let takingScreenshot = false;
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      // Playwright injects "body {}" to sync animations during WebKit captures.
      // Our CSP correctly rejects it; keep checking all errors outside captures.
      if (
        takingScreenshot &&
        browserName === 'webkit' &&
        message.text().startsWith('Refused to apply a stylesheet because its hash, its nonce')
      )
        return;
      if (message.type() === 'error' && !message.text().includes('404 (Not Found)'))
        errors.push(message.text());
    });
    page.on('response', (response) => {
      if (response.status() >= 400 && response.request().resourceType() !== 'document')
        failedResources.push(response.url());
    });
    for (const path of paths) {
      const response = await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(response.status()).toBe(path === '/introuvable/' ? 404 : 200);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      if ([390, 1440].includes(width)) {
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
          .analyze();
        expect(result.violations, `${path} à ${width}px`).toEqual([]);
        takingScreenshot = true;
        try {
          await page.screenshot({
            path: `test-results/${browserName}-${path === '/' ? 'accueil' : path.replaceAll('/', '')}-${width}.png`,
            fullPage: true,
          });
        } finally {
          takingScreenshot = false;
        }
      }
    }
    expect(errors).toEqual([]);
    expect(failedResources).toEqual([]);
  });
}
test('menu mobile au clavier, fermeture Escape et page active', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Menu' });
  const nav = page.getByRole('navigation', { name: 'Navigation principale' });
  await expect(nav).toBeHidden();
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  // WebKit on macOS uses Option-Tab to include links in keyboard navigation.
  await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
  await expect(nav.getByRole('link', { name: 'Accueil', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toBeFocused();
  await expect(nav).toBeHidden();
  await menu.click();
  await nav.getByRole('link', { name: 'Réalisations', exact: true }).click();
  await expect(page).toHaveURL('/realisations/');
  await menu.click();
  await expect(nav.getByRole('link', { name: 'Réalisations', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
});
test('tous les liens internes fonctionnent et aucun chargement tiers', async ({
  page,
  request,
}) => {
  const external = [];
  page.on('request', (req) => {
    if (!req.url().startsWith('http://127.0.0.1:3000')) external.push(req.url());
  });
  const links = new Set();
  const titles = new Set();
  const descriptions = new Set();
  for (const path of paths.slice(0, -1)) {
    await page.goto(path);
    titles.add(await page.title());
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description.length).toBeGreaterThan(30);
    descriptions.add(description);
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      await page.title(),
    );
    for (const href of await page
      .locator('a')
      .evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')))) {
      expect(href).toBeTruthy();
      expect(href).not.toBe('#');
      if (href.startsWith('/') && !href.includes('#')) links.add(href);
    }
  }
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
  expect(titles.size).toBe(6);
  expect(descriptions.size).toBe(6);
  expect(external).toEqual([]);
});
test('formulaire honnêtement désactivé sans service', async ({ page }) => {
  await page.goto('/contact/');
  await expect(page.getByRole('button', { name: 'Envoyer mon message' })).toBeDisabled();
  await expect(
    page.getByText('Le formulaire n’est pas encore ouvert.', { exact: true }),
  ).toBeVisible();
});
// Activation uniquement dans la réponse HTML interceptée par ce test.
// Aucune configuration de publication modifiée, aucun e-mail réellement envoyé.
async function mockEnabledForm(page) {
  await page.route('**/contact/', async (route) => {
    const response = await route.fetch();
    const body = (await response.text())
      .replace('data-ready="false"', 'data-ready="true"')
      .replace('type="submit" disabled', 'type="submit"');
    await route.fulfill({ response, body });
  });
  await page.goto('/contact/');
  await page.getByLabel('Votre nom').fill('Test navigateur');
  await page.getByLabel('Votre e-mail').fill('test@example.com');
  await page.getByLabel('Votre message').fill('Mon projet de site web pour un test local.');
}
test('formulaire : erreurs réseau et serveur, saisies conservées, retry et succès simulé', async ({
  page,
}) => {
  await mockEnabledForm(page);
  let attempt = 0;
  const ids = [];
  await page.route('**/api/contact', async (route) => {
    ids.push(route.request().postDataJSON().requestId);
    attempt++;
    if (attempt === 1) return route.abort('internetdisconnected');
    if (attempt === 2)
      return route.fulfill({
        status: 502,
        json: { ok: false, message: 'Le service est indisponible. Vos saisies sont conservées.' },
      });
    await new Promise((resolve) => setTimeout(resolve, 350));
    return route.fulfill({ json: { ok: true } });
  });
  const submit = page.getByRole('button', { name: 'Envoyer mon message' });
  await submit.click();
  await expect(page.locator('#form-feedback')).toContainText('Vérifiez votre connexion');
  await expect(page.getByLabel('Votre message')).toHaveValue(
    'Mon projet de site web pour un test local.',
  );
  await submit.click();
  await expect(page.locator('#form-feedback')).toContainText('Le service est indisponible');
  await submit.click();
  await expect(page.getByRole('button', { name: 'Envoi en cours…' })).toBeDisabled();
  await expect(page.locator('#form-feedback')).toContainText('accepté par notre service');
  await expect(page.getByLabel('Votre message')).toHaveValue('');
  expect(new Set(ids).size).toBe(1);
  expect(attempt).toBe(3);
});
test('validation navigateur : aucun envoi si les champs requis sont invalides', async ({
  page,
}) => {
  await mockEnabledForm(page);
  let sent = false;
  await page.route('**/api/contact', (route) => {
    sent = true;
    return route.abort();
  });
  await page.getByLabel('Votre e-mail').fill('invalide');
  await page.getByRole('button', { name: 'Envoyer mon message' }).click();
  expect(await page.getByLabel('Votre e-mail').evaluate((input) => input.validity.valid)).toBe(
    false,
  );
  expect(sent).toBe(false);
});
test('navigation sans JavaScript et réduction des mouvements', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:3000/');
  await page
    .getByRole('navigation', { name: 'Navigation principale' })
    .getByRole('link', { name: 'À propos', exact: true })
    .click();
  await expect(page).toHaveURL(/a-propos/);
  await context.close();
});
test('texte agrandi à 200 % et mouvement réduit', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of paths.slice(0, -1)) {
    await page.goto(path);
    await page.evaluate(() => {
      // Double effectivement toutes les tailles de texte, y compris les tailles en px.
      const nodes = [...document.querySelectorAll('body *')].filter(
        (node) => !node.closest('.art-scene, .about-art'),
      );
      const sizes = nodes.map((node) => parseFloat(getComputedStyle(node).fontSize));
      nodes.forEach((node, index) => {
        node.style.fontSize = `${sizes[index] * 2}px`;
      });
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      path,
    ).toBe(true);
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    ).toBe('auto');
  }
});
