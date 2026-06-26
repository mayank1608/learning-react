// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Hero Banner (TC-39 to TC-48)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-39: Hero banner section is visible on page load', async ({ page }) => {
    const heroBanner = page.locator('.hero-banner');
    await expect(heroBanner).toBeVisible();
  });

  test('TC-40: Banner displays title text', async ({ page }) => {
    const title = page.locator('.hero-banner-title');
    await expect(title).toBeVisible();
    const text = await title.textContent();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test('TC-41: Banner displays subtitle text', async ({ page }) => {
    const subtitle = page.locator('.hero-banner-subtitle');
    await expect(subtitle).toBeVisible();
    const text = await subtitle.textContent();
    expect(text.trim().length).toBeGreaterThan(0);
  });

  test('TC-42: Banner has a visible CTA button', async ({ page }) => {
    const ctaButton = page.locator('.hero-banner-cta .btn-primary');
    await expect(ctaButton).toBeVisible();
  });

  test('TC-43: CTA button has correct text from API', async ({ page }) => {
    // Fetch expected CTA text from the API
    const response = await page.request.get('/api/v1/hero-banner');
    const banners = await response.json();
    const activeBanner = banners.find(b => b.is_active);

    const ctaButton = page.locator('.hero-banner-cta .btn-primary');
    if (activeBanner && activeBanner.cta_text) {
      await expect(ctaButton).toHaveText(activeBanner.cta_text);
    } else {
      // Fallback — button should still have some text
      const text = await ctaButton.textContent();
      expect(text.trim().length).toBeGreaterThan(0);
    }
  });

  test('TC-44: Banner image is visible', async ({ page }) => {
    const heroImg = page.locator('.hero-img');
    await expect(heroImg).toBeVisible();
  });

  test('TC-45: Banner image has proper src attribute', async ({ page }) => {
    const heroImg = page.locator('.hero-img');
    const src = await heroImg.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src.length).toBeGreaterThan(0);
  });

  test('TC-46: CTA button is clickable / navigates', async ({ page }) => {
    const ctaButton = page.locator('.hero-banner-cta .btn-primary');
    await expect(ctaButton).toBeEnabled();

    // Check that it has an href or onclick behavior
    const parentLink = page.locator('.hero-banner-cta a.btn-primary');
    const isLink = await parentLink.count();

    if (isLink > 0) {
      const href = await parentLink.getAttribute('href');
      expect(href).toBeTruthy();
    } else {
      // It's a button — click should not throw
      await ctaButton.click();
    }
  });

  test('TC-47: Banner loads API data (not static fallback)', async ({ page }) => {
    // Intercept the hero-banner API call
    const apiResponse = await page.request.get('/api/v1/hero-banner');
    expect(apiResponse.ok()).toBeTruthy();

    const banners = await apiResponse.json();
    expect(banners.length).toBeGreaterThan(0);

    const activeBanner = banners.find(b => b.is_active);
    expect(activeBanner).toBeTruthy();

    // Verify the page title matches API data
    const title = page.locator('.hero-banner-title');
    await expect(title).toHaveText(activeBanner.title);
  });

  test('TC-48: Banner is responsive (mobile viewport)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const heroBanner = page.locator('.hero-banner');
    await expect(heroBanner).toBeVisible();

    // Title and CTA should still be visible on mobile
    await expect(page.locator('.hero-banner-title')).toBeVisible();
    await expect(page.locator('.hero-banner-cta .btn-primary')).toBeVisible();

    // Banner should fit within viewport width
    const box = await heroBanner.boundingBox();
    expect(box.width).toBeLessThanOrEqual(375);
  });
});
