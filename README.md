# Brew & Bloom Café

> *"Slow coffee. Good company."*  
> A boutique cafe web platform located in Koregaon Park, Pune, Maharashtra, India.

This monorepo contains both the public-facing customer website and the administrative back-office portal, unified with Google Cloud Firebase.

---

## Architecture Overview

```
.
├── public-side/          # Public Customer Experience (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/   # UI & Section components (Hero, Menu, Lightbox, Badges)
│   │   ├── pages/        # Home, Menu, About, Gallery, Contact
│   │   ├── services/     # Firestore read layer (menu, categories, gallery, settings, messages)
│   │   └── utils/        # Image fallbacks (offline SVG data URIs, SEO schemas)
│   └── .env.example      # Environment variables template
│
├── admin-side/           # Admin Management Portal (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/   # Admin UI, layout, modals, tables, badges
│   │   ├── pages/        # Dashboard, Messages Inbox, Menu, Categories, Gallery, Settings
│   │   ├── services/     # Firestore write/read CRUD & realtime snapshot services
│   │   └── context/      # Firebase AuthContext & ToastContext
│   └── .env.example      # Environment variables template
│
├── firestore.rules       # Cloud Firestore security rules (role-based admin & public access)
├── firestore.indexes.json# Firestore compound indexes definition
├── firebase.json         # Firebase project configuration
└── .firebaserc           # Firebase project targets
```

---

## Features

### 1. Public Customer Website (`public-side`)
* **Menu Experience**: Browse coffee, teas, cold beverages, artisanal bakes, and sourdough snacks with real-time availability and dietary badges (Vegetarian / Non-Vegetarian).
* **Interactive Gallery**: High-resolution courtyard ambience and coffee craft photo gallery with full-screen lightbox.
* **Operating Hours**: Live "Open / Closed" badge calculated dynamically from the cafe's schedule in `Asia/Kolkata` time.
* **Customer Inquiry Form**: Real-time message submission to Cloud Firestore with anti-spam honeypot detection and 30-second cooldown protection.
* **Resilient Media**: Multi-tier image fallback with guaranteed offline SVG data URI illustrations for zero broken images.

### 2. Admin Management Dashboard (`admin-side`)
* **Firebase Authentication**: Protected dashboard authenticated through Firebase Auth and verified against the Firestore `admins/{uid}` collection.
* **Live Inquiries Inbox**: Real-time `onSnapshot` message inbox with unread counter badge in sidebar, auto-mark-as-read, status filters, and quick action buttons (Reply by Email, WhatsApp, Call).
* **Menu & Category Management**: Full CRUD operations for menu items and categories with batch reordering and deletion protection.
* **Gallery Manager**: Add, edit, feature, and organize gallery photo moments.
* **Cafe Operating Settings**: Live synchronization of address, phone, social links, and weekly hours.

---

## Getting Started

### Prerequisites
* **Node.js** (v18 or higher)
* **npm** (v9 or higher)
* A **Firebase** project with Cloud Firestore and Authentication enabled

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SurajSodaye/Cafe-Website.git
   cd Cafe-Website
   ```

2. **Setup Environment Variables:**
   In both `public-side` and `admin-side`, copy `.env.example` to `.env` and fill in your Firebase project credentials:
   ```bash
   cp public-side/.env.example public-side/.env
   cp admin-side/.env.example admin-side/.env
   ```

3. **Install Dependencies:**
   ```bash
   # Public website
   cd public-side && npm install

   # Admin portal
   cd ../admin-side && npm install
   ```

4. **Run Development Servers:**
   ```bash
   # In public-side:
   npm run dev
   # Runs on http://localhost:5173

   # In admin-side:
   npm run dev
   # Runs on http://localhost:5174 (or 5175)
   ```

---

## Security & Firestore Rules

Security rules are managed in `firestore.rules`:
* **Public**: Read access for menu items, categories, gallery moments, and cafe settings. Write-only create access for contact messages with strict schema validation.
* **Admin**: Restricted read, write, and delete access governed by document existence in `admins/{uid}`.

---

## License

MIT License. Designed & Developed for Brew & Bloom Café.
