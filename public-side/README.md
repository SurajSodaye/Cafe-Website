# ☕ Brew & Bloom Café — Public Website Frontend

> *"Slow coffee. Good company."*  
> A cozy, modern, and accessible public frontend for **Brew & Bloom Café**, located in Koregaon Park, Pune, India. Built with React 18, Vite, React Router v6, Tailwind CSS, and Framer Motion.

---

## 📋 Table of Contents
- [✨ Key Features](#-key-features)
- [🎨 Design Decisions & Tokens](#-design-decisions--tokens)
- [🚀 Quick Start](#-quick-start)
- [📁 Folder Structure](#-folder-structure)
- [📦 Data Layer Architecture](#-data-layer-architecture)
- [✏️ How to Modify Demo Content](#️-how-to-modify-demo-content)
- [🔥 How to Connect Firebase Later (Phase 2 Migration Guide)](#-how-to-connect-firebase-later-phase-2-migration-guide)
- [♿ Accessibility & Performance](#-accessibility--performance)

---

## ✨ Key Features

1. **Home Page (`/`)**:
   - Hero section with warm imagery, brand title, tagline, and instant action CTAs (*"View Menu"* & *"Find Us"*).
   - Real-time **"Open Now / Closed"** status badge dynamically computed from today's schedule and closing hours.
   - **Crowd Favorites** section showcasing 4 popular items with ₹ prices, dietary indicators, and direct menu deep-links.
   - **About Teaser** highlighting origin stories, shade-grown Chikmagalur roasts, and garden greenery.
   - **Life in the Courtyard** gallery preview (6 images) with interactive full-screen lightbox preview.
   - Inviting **Visit CTA** card with address, operating schedule, and directions button.

2. **Menu Page (`/menu`)**:
   - **Sticky category chips** (*All Items*, *Coffee*, *Tea*, *Cold Drinks*, *Snacks*, *Desserts*) with smooth horizontal scrolling on mobile.
   - **Real-time search bar** filtering by name and ingredients.
   - **Veg-only toggle switch** with standard Indian vegetarian and non-vegetarian visual symbols.
   - Item cards featuring prices in ₹, dietary badges, popular tags, and a distinct **Sold Out** state.
   - Animated skeleton loading states and friendly empty states with a one-click filter reset.

3. **Contact Page (`/contact`)**:
   - Complete address with landmark information.
   - Interactive **Google Maps embed** iframe.
   - Weekly operating hours table with **"Today"** highlighted automatically.
   - One-tap communication: **Click-to-Call**, **WhatsApp** (`wa.me`), and **Instagram** link.
   - Contact form with robust client-side validation (name, email, phone, inquiry topic, message) and elegant submission confirmation state.

4. **About Page (`/about`)**:
   - The founding story in Koregaon Park since 2021.
   - Core philosophy: *Mindful Sourcing, Artisanal Craft, Green Sanctuary, and Community Warmth*.
   - *"What Makes Us Different"* pillars (100% Indian Shade-Grown Arabica, Natural Sourdough Fermentation, Courtyard Ecosystem, Pet & People Friendly).
   - Team section highlighting roasters, pastry chefs, and lead baristas.

5. **Gallery Page (`/gallery`)**:
   - Responsive multi-column masonry/grid.
   - Filterable category tabs (*Ambience*, *Coffee Craft*, *Bakery*, *Kitchen*, *Community*).
   - Accessible **Full-Screen Lightbox** with keyboard controls (<kbd>Esc</kbd> to close, <kbd>←</kbd> and <kbd>→</kbd> to navigate), counter, and descriptive captions.

6. **404 Not Found Page**:
   - Warm *"Spilled Coffee"* page with navigation buttons back to Home and Menu.

---

## 🎨 Design Decisions & Tokens

### 1. Color Palette (WCAG AA Compliant)
- **Espresso Brown (`#3B2A20`, `#241811`)**: Deep roasted tones evoking rich coffee crema, grounding the brand and providing high-contrast readable typography.
- **Warm Cream (`#F6EFE6`, `#FDFAF6`)**: Warm, gentle paper-like canvas that feels inviting, softer on the eyes than pure `#FFFFFF`.
- **Terracotta Accent (`#C8643B`, `#AF512B`)**: Earthy clay tone reminiscent of handcrafted terracotta plant pots and artisanal brick ovens; used for primary buttons, highlights, and links.
- **Soft Sage (`#A8B5A0`, `#5A6F50`)**: Botanical green celebrating the cafe's 120+ courtyard plants and tranquil ambience.

### 2. Typography
- **Display & Headings**: `Playfair Display` (Google Fonts, `display: swap`) — An elegant serif with warmth, editorial poise, and handcrafted character.
- **Body & UI**: `Plus Jakarta Sans` (Google Fonts, `display: swap`) — Clean, contemporary geometric sans-serif offering maximum legibility on mobile screens from 360px upward.

### 3. Layout & Mobile-First UX
- **8px Spacing Scale**: Strict consistency (`p-2`, `p-4`, `p-6`, `p-8`, `p-12`).
- **Fixed Mobile Bottom Action Bar**: For screens `<768px`, immediate thumb-friendly access to **Call**, **WhatsApp**, **Directions**, and **Menu**.
- **Skip-to-Content Link**: Keyboard accessible navigation link for assistive devices.
- **Fluid Grid Max Width**: `max-w-content` (~1200px) centered with responsive padding.

---

## 🚀 Quick Start

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation & Run

1. **Clone or navigate to the workspace directory**:
   ```bash
   cd "c:/Users/suraj/OneDrive/Dokumen/ASHA SM/Cafe Website"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## 📁 Folder Structure

```
src/
├── assets/                  # Static assets and icons
├── components/
│   ├── contact/             # Contact page components (ContactForm, HoursTable, MapEmbed)
│   ├── gallery/             # Gallery components
│   ├── home/                # Home page sections (Hero, OpenBadge, PopularSection, AboutTeaser, GalleryPreview, HomeCTA)
│   ├── layout/              # Layout shell (Header, Footer, MobileBottomBar, Layout, SEO)
│   ├── menu/                # Menu page components (CategoryBar, FilterBar, MenuItemCard)
│   └── ui/                  # Reusable accessible atoms (Button, Badge, Card, Skeleton, EmptyState, Lightbox)
├── data/                    # Pure mock data files (NEVER imported directly by components)
│   ├── cafeInfo.js          # Cafe info, hours schedule, story, team, values
│   ├── categories.js        # Category list and slugs
│   ├── gallery.js           # Curated gallery images with alt text
│   └── menuItems.js         # 20 realistic items with ₹ prices, veg status, popular flags
├── hooks/                   # Custom hooks decoupling data from views
│   ├── useCafeHours.js      # Calculates real-time Open/Closed badge
│   ├── useCafeInfo.js       # Asynchronous cafe details hook
│   ├── useGallery.js        # Asynchronous gallery hook
│   └── useMenu.js           # Menu filter, search, category & popular items hook
├── pages/                   # Lazy-loaded route views
│   ├── AboutPage.jsx
│   ├── ContactPage.jsx
│   ├── GalleryPage.jsx
│   ├── HomePage.jsx
│   ├── MenuPage.jsx
│   └── NotFoundPage.jsx
├── routes/
│   └── index.jsx            # React Router v6 routing + placeholder for future /admin
├── services/                # Decoupled API service layer (returns Promises with simulated delay)
│   ├── cafeService.js       # getCafeInfo()
│   ├── galleryService.js    # getGalleryImages()
│   └── menuService.js       # getCategories(), getMenuItems(), getPopularMenuItems()
├── utils/
│   └── seoSchemas.js        # Schema.org JSON-LD structured data generator
├── App.jsx                  # Root App with HelmetProvider & RouterProvider
├── index.css                # Tailwind CSS base and utility styles
└── main.jsx                 # React 18 DOM mount point
```

---

## 📦 Data Layer Architecture

To prepare for a seamless future Firebase integration, components **never import directly from `src/data/`**:

```
UI Components (e.g. MenuPage, Hero)
          │
          ▼
Custom Hooks (useMenu, useCafeInfo, useGallery)
          │
          ▼
Service Functions (menuService, cafeService, galleryService)
          │  ─── Returns Promises (simulating network delay)
          ▼
Mock Files in src/data/ (Phase 1)  ──►  Replaced with Firestore SDK in Phase 2
```

---

## ✏️ How to Modify Demo Content

1. **Cafe Details, Operating Hours & Contact Info**:
   Open `src/data/cafeInfo.js` to modify the cafe name, address, phone number, WhatsApp link, opening/closing hours, team bios, and story text.
2. **Menu Items & Pricing**:
   Open `src/data/menuItems.js` to add, edit, or adjust items. Each item follows this schema:
   ```javascript
   {
     id: "item-1",
     name: "Bloom Signature Flat White",
     description: "Double ristretto with silky micro-foam and caramel undertones.",
     price: 240,                 // Price in Indian Rupees (₹)
     category: "coffee",         // matches slug in categories.js
     imageUrl: "https://...",
     isVeg: true,                // true = green veg dot, false = non-veg dot
     isPopular: true,            // true = displays on Home 'Crowd Favorites'
     available: true             // false = displays 'Sold Out' state
   }
   ```
3. **Gallery Photos**:
   Open `src/data/gallery.js` to update photos, titles, and alt text.

---

## 🔥 How to Connect Firebase Later (Phase 2 Migration Guide)

Because all UI components communicate strictly through `src/services/` and `src/hooks/`, **zero component code changes** will be required when adding Firebase.

### Step 1: Install Firebase
```bash
npm install firebase
```

### Step 2: Initialize Firebase Config
Create `src/services/firebase.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

### Step 3: Swap Service Layer Implementations
Replace the local Promise mock inside `src/services/menuService.js` with Firestore calls:
```javascript
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

export async function getMenuItems({ category = 'all', vegOnly = false } = {}) {
  const itemsRef = collection(db, 'menuItems');
  let q = itemsRef;

  if (category !== 'all') {
    q = query(q, where('category', '==', category));
  }
  if (vegOnly) {
    q = query(q, where('isVeg', '==', true));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

### Step 4: Add Protected Admin Routes
In `src/routes/index.jsx`, uncomment and mount the `/admin` routes using Firebase Auth:
```javascript
{
  path: '/admin',
  element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
  children: [
    { index: true, element: <AdminDashboard /> },
    { path: 'menu', element: <AdminMenuEditor /> }
  ]
}
```

---

## ♿ Accessibility & Performance

- **WCAG 2.1 AA Compliant**: All text combinations meet or exceed the 4.5:1 minimum contrast ratio.
- **Screen Reader Support**: Standard Indian dietary marks provide accessible `aria-label="Vegetarian"` / `aria-label="Non-Vegetarian"`. Form fields are linked with `aria-describedby` error IDs.
- **Keyboard Navigation**: Full keyboard navigation across all links, menus, search boxes, and image lightboxes (<kbd>Esc</kbd>, <kbd>Arrow Left</kbd>, <kbd>Arrow Right</kbd>).
- **Reduced Motion Support**: Respects user OS preference `@media (prefers-reduced-motion: reduce)`.
- **Performance Optimized**: Code splitting with `React.lazy()` for every page, optimized image aspect ratios to prevent CLS, and preconnected Google Fonts with `font-display: swap`.
- **Search Engine Optimization**: Complete `react-helmet-async` meta tags, Open Graph, Twitter cards, and Schema.org `CafeOrCoffeeShop` JSON-LD structured data on the homepage.
