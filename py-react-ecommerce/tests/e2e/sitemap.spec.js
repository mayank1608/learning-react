// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Sitemap Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sitemap');
    await page.waitForSelector('.sitemap-page');
  });

  test('TC-49: Sitemap page loads at /sitemap', async ({ page }) => {
    await expect(page).toHaveURL(/\/sitemap/);
    const sitemapPage = page.locator('.sitemap-page');
    await expect(sitemapPage).toBeVisible();
  });

  test('TC-50: Page header displays "Site Map" title', async ({ page }) => {
    const header = page.locator('.sitemap-header h1');
    await expect(header).toBeVisible();
    await expect(header).toContainText('Site');
    await expect(header).toContainText('Map');
  });

  test('TC-51: Pages section is visible with at least 3 items', async ({ page }) => {
    const sections = page.locator('.sitemap-section');
    const pagesSection = sections.nth(0);
    await expect(pagesSection).toBeVisible();

    const sectionTitle = pagesSection.locator('.sitemap-section-title');
    await expect(sectionTitle).toContainText('Pages');

    const cards = pagesSection.locator('.sitemap-card');
    await expect(cards).toHaveCount(3);
  });

  test('TC-52: Home Sections group is visible with at least 5 items', async ({ page }) => {
    const sections = page.locator('.sitemap-section');
    const homeSections = sections.nth(1);
    await expect(homeSections).toBeVisible();

    const sectionTitle = homeSections.locator('.sitemap-section-title');
    await expect(sectionTitle).toContainText('Home Sections');

    const cards = homeSections.locator('.sitemap-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('TC-53: API Endpoints section is visible', async ({ page }) => {
    const sections = page.locator('.sitemap-section');
    const apiSection = sections.nth(2);
    await expect(apiSection).toBeVisible();

    const sectionTitle = apiSection.locator('.sitemap-section-title');
    await expect(sectionTitle).toContainText('API Endpoints');

    const apiCards = apiSection.locator('.sitemap-api-card');
    const count = await apiCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-54: Method badges display (GET/POST)', async ({ page }) => {
    const badges = page.locator('.method-badge');
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);

    // Check that we have both GET and POST badges
    const getBadge = page.locator('.method-badge.get').first();
    const postBadge = page.locator('.method-badge.post').first();
    await expect(getBadge).toBeVisible();
    await expect(postBadge).toBeVisible();
    await expect(getBadge).toHaveText('GET');
    await expect(postBadge).toHaveText('POST');
  });

  test('TC-55: Page links navigate correctly (click Home link → goes to /)', async ({ page }) => {
    const sections = page.locator('.sitemap-section');
    const pagesSection = sections.nth(0);
    const homeLink = pagesSection.locator('.sitemap-card', { hasText: 'Home' });
    await expect(homeLink).toBeVisible();

    await homeLink.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('TC-56: Navbar Sitemap link works from Home page', async ({ page }) => {
    // Navigate to Home first
    await page.goto('/');
    await page.waitForSelector('.navbar');

    // Look for Sitemap link in footer or navigation
    const sitemapLink = page.locator('a[href="/sitemap"]').first();
    await expect(sitemapLink).toBeVisible();

    await sitemapLink.click();
    await expect(page).toHaveURL(/\/sitemap/);
    await expect(page.locator('.sitemap-page')).toBeVisible();
  });

  test('TC-57: Responsive layout works on mobile viewport (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/sitemap');
    await page.waitForSelector('.sitemap-page');

    // Page should still be visible and functional
    await expect(page.locator('.sitemap-header')).toBeVisible();
    await expect(page.locator('.sitemap-section').first()).toBeVisible();

    // Grid should fit within viewport (no horizontal overflow)
    const pageWidth = await page.locator('.sitemap-page').evaluate(
      (el) => el.scrollWidth
    );
    expect(pageWidth).toBeLessThanOrEqual(375);
  });

  test('TC-58: API data loads (not static fallback)', async ({ page }) => {
    // Fetch sitemap data directly from API
    const apiResponse = await page.request.get('/api/v1/sitemap');
    expect(apiResponse.ok()).toBeTruthy();

    const apiData = await apiResponse.json();

    // The API returns sections with "page" field; fallback does not
    // Verify the page content matches API data (not fallback)
    const sections = page.locator('.sitemap-section');
    const homeSections = sections.nth(1);
    const cards = homeSections.locator('.sitemap-card');
    const count = await cards.count();

    // API returns 7 sections; fallback has 6
    expect(count).toBe(apiData.sections.length);
  });
});
