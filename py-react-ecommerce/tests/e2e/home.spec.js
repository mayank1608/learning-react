// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation (Navbar)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-16: Navbar is visible with logo, menu links, search, cart, user icons', async ({ page }) => {
    const navbar = page.locator('.navbar');
    await expect(navbar).toBeVisible();

    // Logo
    await expect(page.locator('.nav-logo .logo-name')).toHaveText('ShopEY');

    // Menu links
    const navLinks = page.locator('.nav-links a');
    await expect(navLinks).toHaveCount(5);
    await expect(navLinks.nth(0)).toHaveText('Home');
    await expect(navLinks.nth(1)).toHaveText('Shop');
    await expect(navLinks.nth(2)).toHaveText('Categories');
    await expect(navLinks.nth(3)).toHaveText('About');
    await expect(navLinks.nth(4)).toHaveText('Contact');

    // Search icon
    await expect(page.locator('button[aria-label="Search"]')).toBeVisible();

    // Cart icon
    await expect(page.locator('button[aria-label="Cart"]')).toBeVisible();

    // User/Login icon
    await expect(page.locator('a[aria-label="Login"]')).toBeVisible();
  });

  test('TC-17: Navbar becomes solid on scroll', async ({ page }) => {
    const navbar = page.locator('.navbar');

    // Initially not scrolled
    await expect(navbar).not.toHaveClass(/scrolled/);

    // Scroll down past 60px
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(300);

    // Navbar should have scrolled class
    await expect(navbar).toHaveClass(/scrolled/);
  });

  test('TC-18: Menu links are clickable (Home, Shop, Categories, About, Contact)', async ({ page }) => {
    const navLinks = page.locator('.nav-links a');

    // All links should have href attributes
    await expect(navLinks.nth(0)).toHaveAttribute('href', '#hero');
    await expect(navLinks.nth(1)).toHaveAttribute('href', '#featured');
    await expect(navLinks.nth(2)).toHaveAttribute('href', '#categories');
    await expect(navLinks.nth(3)).toHaveAttribute('href', '#trust');
    await expect(navLinks.nth(4)).toHaveAttribute('href', '#footer');

    // Click each link - should not navigate away
    for (let i = 0; i < 5; i++) {
      await navLinks.nth(i).click();
      await expect(page).toHaveURL(/localhost:5173\//);
    }
  });

  test('TC-19: Cart icon shows badge when items in cart', async ({ page }) => {
    // Without login, badge should not be present or show 0
    const badge = page.locator('.cart-badge');

    // Register and login to get a token
    const email = `cart_badge_${Date.now()}@example.com`;
    await page.request.post('/api/v1/auth/register', {
      data: { first_name: 'Cart', last_name: 'User', email, password: 'Test@1234' },
    });
    const loginResp = await page.request.post('/api/v1/auth/login', {
      data: { email, password: 'Test@1234' },
    });
    const { access_token } = await loginResp.json();

    // Add item to cart via API
    await page.request.post('/api/v1/cart/', {
      headers: { Authorization: `Bearer ${access_token}` },
      data: { product_id: 1, quantity: 2 },
    });

    // Set token in localStorage and reload
    await page.evaluate((token) => {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_name', 'Cart');
    }, access_token);
    await page.reload();

    // Badge should now be visible with count
    await expect(badge).toBeVisible({ timeout: 5000 });
    await expect(badge).not.toHaveText('0');
  });
});

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-20: Hero section displays headline, subheading, and CTA buttons', async ({ page }) => {
    const hero = page.locator('.hero');
    await expect(hero).toBeVisible();

    // Headline
    await expect(page.locator('.hero-title')).toContainText('Discover the');
    await expect(page.locator('.hero-highlight')).toHaveText('Latest Trends');

    // Subheading
    await expect(page.locator('.hero-subtitle')).toHaveText('Premium quality products at unbeatable prices');

    // CTA buttons
    await expect(page.locator('.hero-cta .btn-primary')).toHaveText('Shop Now');
    await expect(page.locator('.hero-cta .btn-outline')).toHaveText('Explore Categories');
  });

  test('TC-21: CTA "Shop Now" button scrolls to products section', async ({ page }) => {
    const shopNowBtn = page.locator('.hero-cta .btn-primary');
    await expect(shopNowBtn).toHaveAttribute('href', '#featured');

    await shopNowBtn.click();
    await page.waitForTimeout(500);

    // The featured section should be in viewport
    const featured = page.locator('#featured');
    await expect(featured).toBeInViewport();
  });
});

test.describe('Categories Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-22: Categories are loaded and displayed from API', async ({ page }) => {
    const categoriesSection = page.locator('.categories-section');
    await expect(categoriesSection).toBeVisible();

    // Wait for loading to finish (skeleton cards disappear)
    await expect(page.locator('.categories-row .category-card.skeleton').first()).not.toBeVisible({ timeout: 10000 });

    // At least one category card should exist
    const cards = page.locator('.categories-row .category-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-23: Category cards have images and names', async ({ page }) => {
    // Wait for categories to load
    await expect(page.locator('.categories-row .category-card.skeleton').first()).not.toBeVisible({ timeout: 10000 });

    const cards = page.locator('.categories-row .category-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // Each card should have an icon and name
    for (let i = 0; i < Math.min(count, 3); i++) {
      const card = cards.nth(i);
      await expect(card.locator('.category-icon')).toBeVisible();
      await expect(card.locator('.category-name')).toBeVisible();
      const name = await card.locator('.category-name').textContent();
      expect(name.trim().length).toBeGreaterThan(0);
    }
  });
});

test.describe('Products Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-24: Featured products are loaded and displayed in grid', async ({ page }) => {
    const featuredSection = page.locator('.featured-section');
    await expect(featuredSection).toBeVisible();

    // Wait for skeleton to disappear
    await expect(page.locator('.featured-section .product-card.skeleton').first()).not.toBeVisible({ timeout: 10000 });

    // Should have product cards in grid
    const grid = page.locator('.featured-section .products-grid');
    await expect(grid).toBeVisible();

    const cards = page.locator('.featured-section .products-grid .product-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-25: Product cards show image, name, price, rating, add to cart button', async ({ page }) => {
    // Wait for featured products to load
    await expect(page.locator('.featured-section .product-card.skeleton').first()).not.toBeVisible({ timeout: 10000 });

    const card = page.locator('.featured-section .product-card').first();
    await expect(card).toBeVisible();

    // Image
    await expect(card.locator('.product-image')).toBeVisible();

    // Name
    await expect(card.locator('.product-name')).toBeVisible();
    const name = await card.locator('.product-name').textContent();
    expect(name.trim().length).toBeGreaterThan(0);

    // Price
    await expect(card.locator('.product-price')).toBeVisible();
    const price = await card.locator('.product-price').textContent();
    expect(price).toMatch(/\$\d+/);

    // Rating (stars)
    await expect(card.locator('.product-rating')).toBeVisible();

    // Add to cart button
    await expect(card.locator('.add-to-cart-btn')).toBeVisible();
  });

  test('TC-26: Clicking "Add to Cart" shows toast notification', async ({ page }) => {
    // Login first
    const email = `addcart_${Date.now()}@example.com`;
    await page.request.post('/api/v1/auth/register', {
      data: { first_name: 'Add', last_name: 'Cart', email, password: 'Test@1234' },
    });
    const loginResp = await page.request.post('/api/v1/auth/login', {
      data: { email, password: 'Test@1234' },
    });
    const { access_token } = await loginResp.json();

    await page.evaluate((token) => {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_name', 'Add');
    }, access_token);
    await page.reload();

    // Wait for products to load
    await expect(page.locator('.featured-section .product-card.skeleton').first()).not.toBeVisible({ timeout: 10000 });

    // Click add to cart on first product
    const addBtn = page.locator('.featured-section .add-to-cart-btn').first();
    await addBtn.click();

    // Toast notification should appear
    await expect(page.locator('.toast-notification')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.toast-notification')).toContainText(/added to cart/i);
  });

  test('TC-27: Trending products section is visible with horizontal scroll', async ({ page }) => {
    const trendingSection = page.locator('.trending-section');
    await expect(trendingSection).toBeVisible();

    // Section title
    await expect(trendingSection.locator('.section-title')).toContainText('Trending Now');

    // Carousel controls
    await expect(page.locator('button[aria-label="Scroll left"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Scroll right"]')).toBeVisible();

    // Carousel container
    await expect(page.locator('.trending-carousel')).toBeVisible();
  });
});

test.describe('Promotional Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-28: Promotional banner is visible with discount text and CTA', async ({ page }) => {
    const promoBanner = page.locator('.promo-banner');
    await expect(promoBanner).toBeVisible();

    // Discount text
    await expect(page.locator('.promo-title')).toContainText('50% Off');

    // Promo tag
    await expect(page.locator('.promo-tag')).toHaveText('Limited Time Offer');

    // CTA button
    await expect(promoBanner.locator('.btn-primary')).toHaveText('Shop Deals');
  });
});

test.describe('Trust & Testimonials', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-29: Trust badges section shows 3 badges (Secure, Returns, Shipping)', async ({ page }) => {
    const trustBadges = page.locator('.trust-badges .trust-badge');
    await expect(trustBadges).toHaveCount(3);

    await expect(trustBadges.nth(0)).toContainText('Secure Payment');
    await expect(trustBadges.nth(1)).toContainText('Easy Returns');
    await expect(trustBadges.nth(2)).toContainText('Free Shipping');
  });

  test('TC-30: Testimonials section shows customer reviews', async ({ page }) => {
    const testimonials = page.locator('.testimonials');
    await expect(testimonials).toBeVisible();

    // Section title
    await expect(testimonials.locator('.section-title')).toContainText('What Our Customers Say');

    // At least 3 testimonial cards
    const cards = page.locator('.testimonial-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Each card has quote and author
    const firstCard = cards.first();
    await expect(firstCard.locator('.testimonial-quote')).toBeVisible();
    await expect(firstCard.locator('.author-name')).toBeVisible();
  });
});

test.describe('Newsletter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-31: Newsletter form accepts email and shows success on valid submit', async ({ page }) => {
    const newsletterEmail = `newsletter_${Date.now()}@example.com`;

    const emailInput = page.locator('.newsletter-input');
    await expect(emailInput).toBeVisible();

    await emailInput.fill(newsletterEmail);
    await page.locator('.newsletter-btn').click();

    // Success feedback
    await expect(page.locator('.newsletter-feedback.success')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.newsletter-feedback.success')).toContainText(/thanks for subscribing/i);
  });

  test('TC-32: Newsletter shows error for invalid/duplicate email', async ({ page }) => {
    // Test invalid email
    const emailInput = page.locator('.newsletter-input');
    await emailInput.fill('not-an-email');
    await page.locator('.newsletter-btn').click();

    await expect(page.locator('.newsletter-feedback.error')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.newsletter-feedback.error')).toContainText(/valid email/i);

    // Test duplicate email - subscribe first, then try again
    const dupEmail = `dup_newsletter_${Date.now()}@example.com`;
    await emailInput.fill(dupEmail);
    await page.locator('.newsletter-btn').click();
    await expect(page.locator('.newsletter-feedback.success')).toBeVisible({ timeout: 5000 });

    // Reload and try same email
    await page.reload();
    await page.locator('.newsletter-input').fill(dupEmail);
    await page.locator('.newsletter-btn').click();
    await expect(page.locator('.newsletter-feedback.error')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Footer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-33: Footer shows all 4 columns with links', async ({ page }) => {
    const footer = page.locator('.footer');
    await expect(footer).toBeVisible();

    const columns = page.locator('.footer-grid .footer-col');
    await expect(columns).toHaveCount(4);

    // Brand column
    await expect(columns.nth(0).locator('.logo-name')).toHaveText('ShopEY');

    // Company column
    await expect(columns.nth(1).locator('h4')).toHaveText('Company');
    await expect(columns.nth(1).locator('li')).toHaveCount(3);

    // Support column
    await expect(columns.nth(2).locator('h4')).toHaveText('Support');
    await expect(columns.nth(2).locator('li')).toHaveCount(3);

    // Legal column
    await expect(columns.nth(3).locator('h4')).toHaveText('Legal');
    await expect(columns.nth(3).locator('li')).toHaveCount(3);
  });

  test('TC-34: Footer shows payment method icons and copyright', async ({ page }) => {
    const footerBottom = page.locator('.footer-bottom');
    await expect(footerBottom).toBeVisible();

    // Copyright
    await expect(footerBottom).toContainText('© 2026 ShopEY. All rights reserved.');

    // Payment methods
    const paymentIcons = page.locator('.payment-methods .payment-icon');
    await expect(paymentIcons).toHaveCount(4);
    await expect(paymentIcons.nth(0)).toHaveText('VISA');
    await expect(paymentIcons.nth(1)).toHaveText('MC');
    await expect(paymentIcons.nth(2)).toHaveText('PayPal');
    await expect(paymentIcons.nth(3)).toHaveText('Amex');
  });
});

test.describe('Responsive Design', () => {
  test('TC-35: Page is responsive — products go to 2 columns on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Wait for products to load
    await expect(page.locator('.featured-section .product-card.skeleton').first()).not.toBeVisible({ timeout: 10000 });

    // Check that products grid is visible and has at least 2 cards
    const grid = page.locator('.featured-section .products-grid');
    await expect(grid).toBeVisible();

    const cards = page.locator('.featured-section .products-grid .product-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Check grid has computed columns <= 2 (tablet layout)
    const gridColumns = await grid.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.gridTemplateColumns;
    });
    const columnCount = gridColumns.split(' ').length;
    expect(columnCount).toBeLessThanOrEqual(2);
  });

  test('TC-36: Navbar collapses on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // On mobile, nav-links should be hidden
    const navLinks = page.locator('.nav-links');
    await expect(navLinks).not.toBeVisible();

    // Logo should still be visible
    await expect(page.locator('.nav-logo')).toBeVisible();
  });
});

test.describe('Cart Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-37: Cart sidebar opens when cart icon clicked', async ({ page }) => {
    const cartSidebar = page.locator('.cart-sidebar');

    // Initially closed
    await expect(cartSidebar).not.toHaveClass(/open/);

    // Click cart icon
    await page.locator('button[aria-label="Cart"]').click();

    // Sidebar should open
    await expect(cartSidebar).toHaveClass(/open/);
    await expect(page.locator('.cart-header h3')).toContainText('Your Cart');
  });

  test('TC-38: Cart sidebar can be closed', async ({ page }) => {
    const cartSidebar = page.locator('.cart-sidebar');

    // Open cart
    await page.locator('button[aria-label="Cart"]').click();
    await expect(cartSidebar).toHaveClass(/open/);

    // Close cart using close button
    await page.locator('.cart-close').click();
    await expect(cartSidebar).not.toHaveClass(/open/);
  });
});
