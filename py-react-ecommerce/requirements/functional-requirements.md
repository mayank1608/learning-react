# Functional Requirements — Login Module

## 1. Feature Description

The Login Module provides user authentication for the e-commerce application. It includes user registration (sign-up), user login with email and password, and JWT-based session management. The UI must be modern, visually appealing, and consistent with EY-inspired branding (dark navy, yellow accent, clean typography).

---

## 2. User Stories

### US-01 — User Registration

> **As a** new visitor,
> **I want to** create an account with my name, email, and password,
> **So that** I can access the e-commerce platform's features.

### US-02 — User Login

> **As a** registered user,
> **I want to** log in with my email and password,
> **So that** I can access my account and make purchases.

### US-03 — Input Validation Feedback

> **As a** user filling out the login or registration form,
> **I want to** see clear, inline validation messages when I enter invalid data,
> **So that** I can correct mistakes before submitting.

### US-04 — Secure Password Storage

> **As a** user,
> **I want** my password to be securely hashed and never stored in plain text,
> **So that** my account remains safe even if the database is compromised.

### US-05 — Token-Based Session

> **As a** logged-in user,
> **I want** my session to persist via a JWT token,
> **So that** I don't need to log in again on every page visit.

---

## 3. Acceptance Criteria

### Registration

| # | Criterion |
|---|-----------|
| AC-1 | User can register with first name, last name, email, and password. |
| AC-2 | Email must be unique; duplicate email returns a 409 Conflict error. |
| AC-3 | Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, one digit, and one special character. |
| AC-4 | On successful registration, the API returns 201 Created with the user profile (excluding password). |
| AC-5 | All fields are required; missing fields return 422 Unprocessable Entity. |

### Login

| # | Criterion |
|---|-----------|
| AC-6 | User can log in with email and password. |
| AC-7 | On successful login, the API returns 200 OK with a JWT access token and user profile. |
| AC-8 | Invalid email or password returns 401 Unauthorized with a generic message ("Invalid email or password"). |
| AC-9 | JWT token expires after 60 minutes. |
| AC-10 | The token contains the user ID and email as claims. |

---

## 4. UI/UX Requirements

### General

- Modern, clean single-page layout centered on screen.
- Responsive design — works on desktop and mobile viewports.
- Smooth transitions between Login and Register forms (tab or toggle switch).

### Branding / Styling

- **Primary color:** Dark navy (`#2E2E38`) — used for backgrounds, headings.
- **Accent color:** EY Yellow (`#FFE600`) — used for primary buttons, highlights.
- **Secondary text:** Medium gray (`#747480`).
- **Background:** Light gray (`#F6F6FA`) or white.
- **Font:** Sans-serif (e.g., system font stack or "EYInterstate" if available).
- **Border radius:** 8px on inputs and buttons for modern feel.
- **Box shadow:** Subtle elevation on the form card (`0 4px 24px rgba(0,0,0,0.08)`).

### Login Form

- Email input field with label and placeholder.
- Password input field with show/hide toggle icon.
- "Login" primary button (full width, yellow background, dark text).
- "Don't have an account? Sign up" link below the button.
- Inline error messages displayed in red below each field.

### Registration Form

- First name and last name fields (side by side on desktop).
- Email input field.
- Password input field with strength indicator.
- Confirm password field.
- "Register" primary button.
- "Already have an account? Log in" link below the button.
- Inline validation for all fields.

### Loading & Feedback

- Button shows a spinner while the API call is in progress.
- Success toast/notification on successful registration.
- Error toast for server errors (500).

---

## 5. API Endpoint Specifications

### POST `/api/v1/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "first_name": "string (required, max 100)",
  "last_name": "string (required, max 100)",
  "email": "string (required, valid email, max 255)",
  "password": "string (required, min 8, must meet complexity rules)"
}
```

**Responses:**

| Status | Description | Body |
|--------|-------------|------|
| 201 | User created | `{ "id": 1, "first_name": "John", "last_name": "Doe", "email": "john@example.com", "created_at": "..." }` |
| 409 | Email already exists | `{ "detail": "A user with this email already exists." }` |
| 422 | Validation error | `{ "detail": [ { "loc": ["body", "email"], "msg": "...", "type": "..." } ] }` |

---

### POST `/api/v1/auth/login`

Authenticate a user and return a JWT token.

**Request Body:**

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Responses:**

| Status | Description | Body |
|--------|-------------|------|
| 200 | Login successful | `{ "access_token": "eyJ...", "token_type": "bearer", "user": { "id": 1, "first_name": "John", "last_name": "Doe", "email": "john@example.com" } }` |
| 401 | Invalid credentials | `{ "detail": "Invalid email or password." }` |
| 422 | Validation error | `{ "detail": [ ... ] }` |

---

## 6. Security Requirements

| Requirement | Detail |
|-------------|--------|
| Password hashing | Use `bcrypt` with a cost factor of 12. Never store plain-text passwords. |
| JWT signing | Use HS256 algorithm with a server-side secret key stored in environment variables. |
| Token expiry | Access tokens expire after 60 minutes. |
| Input sanitization | Validate and sanitize all inputs on both client and server side. |
| Rate limiting | Limit login attempts to 5 per minute per IP to mitigate brute-force attacks. |
| CORS | Allow only the frontend origin in production. |
| HTTPS | All auth endpoints must be served over HTTPS in production. |
| Password rules | Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character. |
| Generic error messages | Login failure must not reveal whether the email exists or the password is wrong. |

---

## 7. Error Handling Scenarios

| Scenario | HTTP Status | User-Facing Message |
|----------|-------------|---------------------|
| Missing required fields | 422 | Field-specific validation messages |
| Invalid email format | 422 | "Please enter a valid email address." |
| Password too weak | 422 | "Password must be at least 8 characters with uppercase, lowercase, digit, and special character." |
| Duplicate email on register | 409 | "A user with this email already exists." |
| Wrong email or password on login | 401 | "Invalid email or password." |
| Server error | 500 | "Something went wrong. Please try again later." |
| Too many login attempts | 429 | "Too many login attempts. Please try again later." |

---

## 8. Non-Functional Requirements

- Registration and login API response time < 500ms under normal load.
- Password hashing must happen server-side only.
- JWT secret must never be committed to source control (use `.env`).
- The login page must achieve a Lighthouse accessibility score ≥ 90.

---

# Home Page Module

## 1. Feature Description

The Home Page serves as the primary landing page of the e-commerce application after login (or for guest visitors). It showcases featured products, categories, promotional banners, customer testimonials, and provides primary site navigation. The design must be modern, minimal, responsive, and include smooth hover effects and animations.

---

## 2. User Stories

### US-06 — Browse Featured Products

> **As a** visitor,
> **I want to** see a curated grid of featured products on the home page,
> **So that** I can quickly discover popular items.

### US-07 — Browse by Category

> **As a** visitor,
> **I want to** see product categories displayed visually,
> **So that** I can navigate to a specific category of interest.

### US-08 — View Trending/Best Sellers

> **As a** visitor,
> **I want to** see a carousel of trending or best-selling products,
> **So that** I can discover what's popular right now.

### US-09 — Add Product to Cart from Home

> **As a** logged-in user,
> **I want to** add a product to my cart directly from the home page product cards,
> **So that** I can shop quickly without navigating to product details.

### US-10 — View Cart Preview

> **As a** logged-in user,
> **I want to** see a cart icon with item count and a hover/click preview of cart contents,
> **So that** I can review my selections without leaving the current page.

### US-11 — Subscribe to Newsletter

> **As a** visitor,
> **I want to** subscribe to the newsletter by entering my email in the footer,
> **So that** I receive updates on deals and new products.

### US-12 — Navigate via Navbar

> **As a** visitor,
> **I want to** use a navigation bar with links to Home, Shop, Categories, About, and Contact,
> **So that** I can easily find different sections of the site.

### US-13 — Search Products

> **As a** visitor,
> **I want to** use a search bar in the navigation to find products by name,
> **So that** I can quickly locate specific items.

### US-14 — View Promotional Banners

> **As a** visitor,
> **I want to** see discount/offers banners and seasonal promotions,
> **So that** I'm aware of current deals.

### US-15 — Read Customer Reviews

> **As a** visitor,
> **I want to** see customer testimonials and trust badges,
> **So that** I feel confident about the platform's reliability.

---

## 3. Acceptance Criteria

### Hero Section

| # | Criterion |
|---|-----------|
| AC-11 | Hero section displays a headline, subheading, and a CTA button. |
| AC-12 | Hero has a visually appealing background image or gradient. |
| AC-13 | CTA button navigates to the Shop page or Featured Products section. |

### Navigation Bar

| # | Criterion |
|---|-----------|
| AC-14 | Navbar displays logo, menu links (Home, Shop, Categories, About, Contact), search bar, cart icon, and user profile/login button. |
| AC-15 | Navbar is sticky/fixed on scroll. |
| AC-16 | Cart icon shows badge with current item count (0 if empty). |
| AC-17 | Search bar filters/redirects based on user input. |
| AC-18 | User profile button shows user name if logged in, or "Login" if not authenticated. |

### Product Sections

| # | Criterion |
|---|-----------|
| AC-19 | Featured Products section displays a responsive grid of product cards (image, title, price, rating, "Add to Cart" button). |
| AC-20 | Categories section shows category cards with image and name. |
| AC-21 | Trending/Best Sellers section renders as a horizontal carousel with navigation arrows. |
| AC-22 | Each product card shows star rating (out of 5) and review count. |
| AC-23 | "Add to Cart" button requires authentication; unauthenticated users are redirected to login. |

### Promotional Section

| # | Criterion |
|---|-----------|
| AC-24 | At least one promotional/discount banner is displayed. |
| AC-25 | Seasonal banners rotate or display statically based on content. |

### Customer Trust Section

| # | Criterion |
|---|-----------|
| AC-26 | Displays at least 3 customer testimonials with name, rating, and comment. |
| AC-27 | Trust badges (secure payment, free shipping, etc.) are visible. |

### Footer

| # | Criterion |
|---|-----------|
| AC-28 | Footer contains navigation links, social media icons, newsletter subscription form, and payment method icons. |
| AC-29 | Newsletter form validates email format before submission. |
| AC-30 | Successful subscription shows a confirmation message. |
| AC-31 | Duplicate email subscription returns an appropriate message (not an error). |

### Performance & UX

| # | Criterion |
|---|-----------|
| AC-32 | Loading skeletons are shown while data is being fetched. |
| AC-33 | Images use lazy loading for performance. |
| AC-34 | Smooth hover effects on product cards and buttons (scale, shadow transitions). |
| AC-35 | Page is fully responsive (mobile, tablet, desktop). |

---

## 4. UI/UX Requirements

### Layout

- Full-width hero section at the top.
- Navbar fixed at top with z-index above hero.
- Content sections stacked vertically: Hero → Featured Products → Categories → Trending → Promotions → Testimonials → Footer.
- Max content width: 1200px, centered.

### Branding / Styling (consistent with Login module)

- **Primary color:** Dark navy (`#2E2E38`)
- **Accent color:** EY Yellow (`#FFE600`)
- **Background:** White or light gray (`#F6F6FA`) alternating sections
- **Card style:** White background, 8px border-radius, subtle shadow, hover elevation effect
- **Typography:** Sans-serif, clear hierarchy (h1 for hero, h2 for section titles)
- **Animations:** CSS transitions (0.3s ease) on hover for cards, buttons; fade-in on scroll for sections

### Product Card Design

- Product image (16:9 or square aspect ratio)
- Product title (truncated to 2 lines max)
- Price in bold (accent color for discounts)
- Star rating (filled/empty stars) + review count
- "Add to Cart" button (accent yellow, dark text)

### Cart Preview

- Dropdown/popover from cart icon on hover or click
- Shows list of items (thumbnail, name, qty, subtotal)
- "View Cart" and "Checkout" buttons at bottom
- Shows "Cart is empty" when no items

---

## 5. API Endpoint Specifications

### GET `/api/v1/products`

Retrieve a list of products with optional filters.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| featured | boolean | Filter featured products only |
| trending | boolean | Filter trending/best-seller products |
| category_id | integer | Filter by category |
| search | string | Search by product name (partial match) |
| skip | integer | Pagination offset (default: 0) |
| limit | integer | Pagination limit (default: 20, max: 100) |

**Response (200 OK):**

```json
{
  "products": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "description": "High-quality wireless headphones...",
      "price": 79.99,
      "image_url": "/images/products/headphones.jpg",
      "category_id": 2,
      "rating": 4.5,
      "review_count": 128,
      "is_featured": true,
      "is_trending": false
    }
  ],
  "total": 50,
  "skip": 0,
  "limit": 20
}
```

---

### GET `/api/v1/products/{id}`

Retrieve a single product by ID.

**Response (200 OK):**

```json
{
  "id": 1,
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones with noise cancellation...",
  "price": 79.99,
  "image_url": "/images/products/headphones.jpg",
  "category_id": 2,
  "rating": 4.5,
  "review_count": 128,
  "is_featured": true,
  "is_trending": false,
  "created_at": "2026-01-15T10:30:00Z"
}
```

**Response (404 Not Found):**

```json
{ "detail": "Product not found." }
```

---

### GET `/api/v1/categories`

Retrieve all product categories.

**Response (200 OK):**

```json
{
  "categories": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Gadgets, devices, and accessories",
      "image_url": "/images/categories/electronics.jpg"
    }
  ]
}
```

---

### GET `/api/v1/cart`

Retrieve the current user's cart items. **Requires authentication (JWT).**

**Response (200 OK):**

```json
{
  "items": [
    {
      "id": 1,
      "product_id": 5,
      "product_name": "Wireless Headphones",
      "product_image_url": "/images/products/headphones.jpg",
      "product_price": 79.99,
      "quantity": 2,
      "subtotal": 159.98
    }
  ],
  "total_items": 2,
  "total_price": 159.98
}
```

**Response (401 Unauthorized):**

```json
{ "detail": "Not authenticated." }
```

---

### POST `/api/v1/cart`

Add a product to the user's cart. **Requires authentication (JWT).**

**Request Body:**

```json
{
  "product_id": 5,
  "quantity": 1
}
```

**Responses:**

| Status | Description | Body |
|--------|-------------|------|
| 201 | Item added to cart | `{ "id": 1, "product_id": 5, "quantity": 1, "created_at": "..." }` |
| 400 | Invalid quantity | `{ "detail": "Quantity must be at least 1." }` |
| 401 | Not authenticated | `{ "detail": "Not authenticated." }` |
| 404 | Product not found | `{ "detail": "Product not found." }` |

---

### DELETE `/api/v1/cart/{item_id}`

Remove an item from the user's cart. **Requires authentication (JWT).**

**Responses:**

| Status | Description | Body |
|--------|-------------|------|
| 200 | Item removed | `{ "detail": "Item removed from cart." }` |
| 401 | Not authenticated | `{ "detail": "Not authenticated." }` |
| 404 | Cart item not found | `{ "detail": "Cart item not found." }` |

---

### GET `/api/v1/reviews`

Retrieve reviews for a specific product.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| product_id | integer (required) | The product to get reviews for |
| skip | integer | Pagination offset (default: 0) |
| limit | integer | Pagination limit (default: 10) |

**Response (200 OK):**

```json
{
  "reviews": [
    {
      "id": 1,
      "user_id": 3,
      "user_name": "Jane D.",
      "product_id": 5,
      "rating": 5,
      "comment": "Excellent quality! Highly recommend.",
      "created_at": "2026-03-10T14:22:00Z"
    }
  ],
  "total": 25,
  "skip": 0,
  "limit": 10
}
```

---

### POST `/api/v1/newsletter/subscribe`

Subscribe an email to the newsletter.

**Request Body:**

```json
{
  "email": "string (required, valid email)"
}
```

**Responses:**

| Status | Description | Body |
|--------|-------------|------|
| 201 | Subscribed | `{ "detail": "Successfully subscribed to newsletter." }` |
| 409 | Already subscribed | `{ "detail": "This email is already subscribed." }` |
| 422 | Invalid email | `{ "detail": "Please enter a valid email address." }` |

---

## 6. Error Handling Scenarios

| Scenario | HTTP Status | User-Facing Message |
|----------|-------------|---------------------|
| Product not found | 404 | "Product not found." |
| Cart item not found | 404 | "Cart item not found." |
| Unauthenticated cart access | 401 | "Not authenticated." |
| Invalid quantity (< 1) | 400 | "Quantity must be at least 1." |
| Newsletter duplicate email | 409 | "This email is already subscribed." |
| Invalid email for newsletter | 422 | "Please enter a valid email address." |
| Missing product_id for reviews | 422 | "product_id query parameter is required." |
| Server error | 500 | "Something went wrong. Please try again later." |

---

## 7. Non-Functional Requirements

- Home page initial load time < 2 seconds on 3G connection (with lazy loading).
- Product images served in optimized formats (WebP preferred) with appropriate dimensions.
- Skeleton loading states shown within 100ms of component mount.
- All interactive elements must be keyboard-accessible.
- Lighthouse accessibility score ≥ 90.
- Cart state persists across page navigation (stored via context/state management).
- API responses for product listings < 300ms under normal load.

---

# Hero Banner Module

## 1. Feature Description

The Hero Banner is a prominent, full-width visual section displayed at the top of the home page. It features a split layout with marketing text (title, subtitle) on the left side, a large hero image on the right side, and a call-to-action (CTA) button that directs users to a target page (e.g., Shop, Promotions). The banner content is managed dynamically via the database, allowing administrators to update titles, images, and CTA links without code changes.

---

## 2. Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-HB-01 | The system shall display a hero banner at the top of the home page with a title, subtitle, hero image, and CTA button. |
| FR-HB-02 | The hero banner content (title, subtitle, image URL, CTA text, CTA link) shall be stored in the database and retrieved via an API endpoint. |
| FR-HB-03 | Only the active hero banner (`is_active = true`) shall be displayed on the home page. If multiple banners are active, the most recently created one shall be shown. |
| FR-HB-04 | The CTA button shall navigate the user to the URL specified in the `cta_link` field when clicked. |
| FR-HB-05 | The system shall provide an API endpoint to retrieve the currently active hero banner content. |
| FR-HB-06 | If no active hero banner exists, the home page shall display a default/fallback banner with static content. |
| FR-HB-07 | The hero banner shall render responsively — stacking vertically (text above image) on mobile viewports. |

---

## 3. User Stories

### US-16 — View Hero Banner

> **As a** visitor,
> **I want to** see an eye-catching hero banner with a headline, description, and image when I land on the home page,
> **So that** I immediately understand the platform's value proposition or current promotion.

### US-17 — Click CTA Button

> **As a** visitor,
> **I want to** click the CTA button on the hero banner,
> **So that** I am directed to the relevant page (shop, promotion, or featured collection).

### US-18 — Dynamic Banner Content

> **As an** administrator,
> **I want** the hero banner content to be manageable from the database,
> **So that** I can update promotions and messaging without deploying new code.

---

## 4. Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-36 | Hero banner displays a title (h1), subtitle (paragraph), hero image, and CTA button. |
| AC-37 | Layout is split: text content on the left (50%), image on the right (50%) on desktop viewports (≥ 1024px). |
| AC-38 | On mobile viewports (< 768px), layout stacks vertically with text above the image. |
| AC-39 | CTA button is visually prominent (accent color) and navigates to the configured link on click. |
| AC-40 | Banner content is fetched from the API on page load. |
| AC-41 | A loading skeleton is displayed while the banner data is being fetched. |
| AC-42 | If the API returns no active banner, a default fallback banner is displayed with generic content. |
| AC-43 | Hero image maintains aspect ratio and does not distort on any viewport size. |
| AC-44 | The hero banner section has a minimum height of 400px on desktop and 300px on mobile. |
| AC-45 | CTA button has hover and focus states with smooth transitions. |

---

## 5. UI/UX Specifications

### Layout

- **Container:** Full-width section with max content width of 1200px centered.
- **Split layout (desktop):** Two equal columns — left column for text content, right column for hero image.
- **Stacked layout (mobile):** Single column — text on top, image below.
- **Minimum height:** 400px (desktop), 300px (mobile).
- **Padding:** 60px vertical, 24px horizontal.

### Text Content (Left Side)

- **Title:** h1, font-size 48px (desktop) / 32px (mobile), font-weight 700, color `#2E2E38`.
- **Subtitle:** Paragraph, font-size 18px (desktop) / 16px (mobile), color `#747480`, max-width 500px, line-height 1.6.
- **CTA Button:** Padding 14px 32px, background `#FFE600`, color `#2E2E38`, font-weight 600, border-radius 8px, font-size 16px. Hover: slight darkening of background + subtle shadow.

### Image (Right Side)

- **Dimensions:** Fill the right column, max-height 500px, object-fit cover/contain.
- **Border-radius:** 12px.
- **Shadow:** Subtle drop shadow (`0 8px 32px rgba(0,0,0,0.10)`).

### Responsive Breakpoints

| Viewport | Layout | Title Size | Min Height |
|----------|--------|------------|------------|
| ≥ 1024px | Split (50/50) | 48px | 400px |
| 768px–1023px | Split (45/55) | 40px | 360px |
| < 768px | Stacked (vertical) | 32px | 300px |

### Animation

- Text fades in from the left (translateX(-20px) → 0) on initial load.
- Image fades in from the right (translateX(20px) → 0) on initial load.
- CTA button has a scale(1.02) effect on hover.

---

## 6. API Endpoint Specifications

### GET `/api/v1/hero-banner`

Retrieve the currently active hero banner.

**Response (200 OK):**

```json
{
  "id": 1,
  "title": "Discover Our New Collection",
  "subtitle": "Shop the latest trends in electronics, fashion, and more. Exclusive deals await you.",
  "image_url": "/images/hero/banner-spring-2026.jpg",
  "cta_text": "Shop Now",
  "cta_link": "/shop",
  "is_active": true,
  "created_at": "2026-05-01T00:00:00Z"
}
```

**Response (404 Not Found — no active banner):**

```json
{ "detail": "No active hero banner found." }
```

---

## 7. Error Handling Scenarios

| Scenario | HTTP Status | User-Facing Message |
|----------|-------------|---------------------|
| No active banner in database | 404 | "No active hero banner found." (Frontend shows fallback) |
| Server error fetching banner | 500 | "Something went wrong. Please try again later." |

---

## 8. Non-Functional Requirements

- Hero banner API response time < 200ms under normal load.
- Hero image should be lazy-loaded if below the fold on any viewport.
- The hero section must be keyboard-accessible (CTA button focusable and activatable via Enter/Space).
- Lighthouse performance score for the hero section ≥ 90.

---

# Sitemap Page Module

## 1. Feature Description

The Sitemap Page is a dedicated route (`/sitemap`) that provides a visual, structured map of all navigable pages, sections, and links within the e-commerce application. It helps users understand the full site structure at a glance and provides direct navigation to any page or section. This is a frontend-only feature — no backend API or database changes are required.

---

## 2. User Stories

### US-19 — View Site Structure

> **As a** visitor,
> **I want to** access a sitemap page that lists all pages and sections of the site,
> **So that** I can quickly find and navigate to any part of the application.

### US-20 — Navigate from Sitemap

> **As a** visitor,
> **I want to** click on any item in the sitemap to be taken directly to that page or section,
> **So that** I can reach my destination in one click.

### US-21 — Understand Site Organization

> **As a** visitor,
> **I want** the sitemap items to be grouped by category (Pages, Home Sections, Account),
> **So that** I can understand how the site is organized.

---

## 3. Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-SM-01 | The sitemap page shall be accessible at route `/sitemap`. |
| FR-SM-02 | The sitemap shall display all navigable pages of the application: Home (`/`), Login (`/login`), and Sitemap (`/sitemap`). |
| FR-SM-03 | The sitemap shall display all sections within the Home page: Hero Banner, Categories, Featured Products, Trending Products, Testimonials, Newsletter, and Footer. |
| FR-SM-04 | Each item in the sitemap shall be a clickable link that navigates the user to the corresponding page or scrolls to the corresponding section (using anchor links for Home sections). |
| FR-SM-05 | Sitemap items shall be grouped into categories: **Pages** (top-level routes), **Home Sections** (sections within the Home page), and **Account** (login/register). |
| FR-SM-06 | The sitemap layout shall be fully responsive, adapting gracefully to mobile, tablet, and desktop viewports. |

---

## 4. Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-46 | Navigating to `/sitemap` renders the Sitemap page without errors. |
| AC-47 | The page displays a clear heading (e.g., "Sitemap" or "Site Map"). |
| AC-48 | All navigable pages (Home, Login, Sitemap) are listed under a "Pages" group. |
| AC-49 | All Home page sections (Hero Banner, Categories, Featured Products, Trending Products, Testimonials, Newsletter, Footer) are listed under a "Home Sections" group. |
| AC-50 | Login/Register is listed under an "Account" group. |
| AC-51 | Clicking a page link navigates to the correct route. |
| AC-52 | Clicking a Home section link navigates to the Home page and scrolls to the corresponding section (e.g., `/#categories`). |
| AC-53 | The layout displays groups side-by-side on desktop (≥ 1024px) and stacked vertically on mobile (< 768px). |
| AC-54 | All links are keyboard-accessible and have visible focus states. |
| AC-55 | The page meets a Lighthouse accessibility score ≥ 90. |

---

## 5. UI/UX Specifications

### Layout

- **Container:** Max content width of 1200px, centered, with vertical padding of 60px.
- **Heading:** h1 "Sitemap", font-size 36px (desktop) / 28px (mobile), font-weight 700, color `#2E2E38`.
- **Groups:** Displayed as cards or columns, arranged in a responsive grid (3 columns on desktop, 2 on tablet, 1 on mobile).

### Group Cards

- **Group title:** h2, font-size 22px, font-weight 600, color `#2E2E38`, margin-bottom 16px.
- **Items list:** Unordered list with no bullets, each item is a link styled with color `#2E2E38`, font-size 16px, padding 8px 0.
- **Link hover:** Color changes to accent `#FFE600` (or underline appears), smooth transition (0.2s).
- **Card style:** White background, border-radius 12px, padding 24px, subtle shadow (`0 2px 12px rgba(0,0,0,0.06)`).

### Groups Content

**Pages:**
- Home → `/`
- Sitemap → `/sitemap`

**Home Sections:**
- Hero Banner → `/#hero`
- Categories → `/#categories`
- Featured Products → `/#featured-products`
- Trending Products → `/#trending-products`
- Testimonials → `/#testimonials`
- Newsletter → `/#newsletter`
- Footer → `/#footer`

**Account:**
- Login → `/login`
- Register → `/login` (switches to register tab)

### Responsive Breakpoints

| Viewport | Layout | Columns |
|----------|--------|---------|
| ≥ 1024px | Grid | 3 columns |
| 768px–1023px | Grid | 2 columns |
| < 768px | Stacked | 1 column |

### Branding (consistent with site)

- **Primary color:** Dark navy (`#2E2E38`)
- **Accent color:** EY Yellow (`#FFE600`)
- **Background:** Light gray (`#F6F6FA`)
- **Font:** Sans-serif (system font stack)

---

## 6. Error Handling Scenarios

| Scenario | Handling |
|----------|----------|
| Route `/sitemap` not matched | React Router shows 404 / redirect to Home |
| Broken anchor link (section removed) | Graceful scroll failure — page stays at top |

---

## 7. Non-Functional Requirements

- Sitemap page renders in < 100ms (no API calls required — static content).
- All links must be valid and tested via end-to-end tests.
- Page is fully accessible via keyboard navigation.
- Lighthouse accessibility score ≥ 90.
- No database or backend dependencies — purely frontend rendered.
