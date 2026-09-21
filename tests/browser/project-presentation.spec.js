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

for (const width of [320, 390, 768, 1440]) {
  test(`projets : accueil léger et fiches à ${width}px`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) errors.push(response.url());
    });
    await page.goto(origin + '/');
    await page.evaluate(() => document.fonts.ready);
    const previews = page.locator('.project-preview');
    await expect(previews).toHaveCount(3);
    await expect(page.locator('.project-details, .project-cta')).toHaveCount(0);
    for (const img of await page.locator('.project-preview img').all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    if (browserName === 'chromium' && [390, 1440].includes(width)) {
      await page
        .locator('.project-previews')
        .locator('..')
        .screenshot({ path: `test-results/home-projects-${width}.jpg`, quality: 85 });
    }
    const destinations = await previews.evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    );
    for (const destination of destinations) {
      await page.goto(origin + '/');
      await page.locator(`.project-preview[href="${destination}"]`).click();
      await expect(page).toHaveURL(origin + destination);
      const id = destination.split('#')[1];
      await expect(page.locator(`[id="${id}"]`)).toBeInViewport();
    }
    await page.goto(origin + '/realisations/');
    await page.evaluate(() => document.fonts.ready);
    for (const project of await page.locator('.project').all()) {
      const details = project.locator('details');
      await expect(details).not.toHaveAttribute('open', '');
      const img = project.locator('img');
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true);
      if (width <= 800) {
        expect((await img.boundingBox()).width).toBeCloseTo((await project.boundingBox()).width, 0);
      }
      const imageOffset = await img.evaluate(
        (el) => el.getBoundingClientRect().top - el.closest('.project').getBoundingClientRect().top,
      );
      const summary = details.locator('summary');
      await summary.focus();
      await page.keyboard.press('Enter');
      await expect(details).toHaveAttribute('open', '');
      await expect(details).toContainText('Le besoin.');
      await expect(details).toContainText('Notre réponse.');
      expect(
        await img.evaluate(
          (el) =>
            el.getBoundingClientRect().top - el.closest('.project').getBoundingClientRect().top,
        ),
      ).toBeCloseTo(imageOffset, 1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.keyboard.press('Enter');
    }
    if ([390, 1440].includes(width)) {
      expect(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
          .violations,
      ).toEqual([]);
      if (browserName === 'chromium') {
        await page.goto(origin + '/realisations/');
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({
          path: `test-results/project-list-${width}.jpg`,
          fullPage: true,
          quality: 85,
        });
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.getByRole('button', { name: /mode sombre/i }).click();
      expect(
        (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
          .violations,
      ).toEqual([]);
    }
    const first = page.locator('.project').first();
    await first.getByRole('link', { name: 'Voir la maquette' }).click();
    await expect(page).toHaveURL(origin + '/concepts/lise/');
    expect(errors).toEqual([]);
  });
}
