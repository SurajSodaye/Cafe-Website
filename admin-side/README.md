# Brew & Bloom Café — Admin Dashboard

This directory contains the standalone **Admin Dashboard** for **Brew & Bloom Café**, built with React 18, Vite, React Router v6, Tailwind CSS, and powered by **Firebase Authentication** and **Cloud Firestore**.

---

## 🚀 Quick Start

### 1. Installation
Navigate into the `admin-side` directory and install dependencies:
```bash
cd admin-side
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and fill in your Firebase project credentials:
```bash
cp .env.example .env
```

Your `.env` file requires:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server
Start the Vite development server (port **5174**):
```bash
npm run dev
```
Open **[http://localhost:5174](http://localhost:5174)** in your web browser.

*(The public cafe site runs concurrently on [http://localhost:5173](http://localhost:5173)).*

---

## 🔐 Admin Authentication Setup (One-time Setup)

The admin portal enforces strict access control through Firebase Authentication + Firestore:

1. **Create an account in Firebase Authentication Console:**
   - Go to your Firebase Console -> Authentication -> Users.
   - Click **Add User** (e.g. `admin@brewandbloom.com`, set a secure password).
   - Copy the generated `User UID`.

2. **Grant Admin Privileges in Firestore:**
   - In Firebase Console -> Firestore Database.
   - Create a document in collection `admins` using that user's UID as the document ID:
     - Path: `admins/{YOUR_USER_UID}`
     - Fields:
       - `name` (string): `Aarav Sharma`
       - `role` (string): `Head Cafe Manager`
       - `createdAt` (timestamp)
   - *Security Note:* The security rules defined in `firestore.rules` verify `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` for all write operations. Any user without this document is immediately rejected with: *"This account does not have admin access."*

3. **Forgot Password:**
   - Admins can reset their password via the "Forgot password?" link on the login page using standard Firebase email reset flows.

---

## 📦 Seeding Firestore (Import Demo Data)

Once logged in for the first time:
1. Navigate to **Cafe Settings** (`/settings`).
2. Scroll to the **Database Seeding: Import Demo Data** card.
3. Click **Import Demo Data to Firestore**.
4. A batched write will atomically populate Firestore collections (`categories`, `menuItems`, `gallery`, and `settings/cafeInfo`) using the initial dataset from `src/data/`, preserving all standard IDs.
5. Once imported, the button automatically disables to prevent accidental overwrites.

---

## 🛠 Features & Capabilities

### 1. Overview Dashboard (`/dashboard`)
- Real-time metric cards (Total Items, In Stock, Sold Out, Popular Highlights, Categories) fed directly from Cloud Firestore.
- Real-time opening schedule banner dynamically evaluated from today's Firestore hours.
- Top 5 recently updated items with real-time timestamps.
- Clear error alerts for permission-denied or network failures.

### 2. Menu Items (`/menu-items`)
- Add, edit, and delete menu items directly in Cloud Firestore with server timestamps.
- Toggle In-Stock / Sold-Out status and Popular status with 1 click.
- Filter by category, vegetarian diet, or text search query.
- Validation for item names, positive pricing, and categories.

### 3. Categories (`/categories`)
- Add, rename, and reorder category sequencing (`↑` / `↓`).
- **Deletion Safety Rule:** Prevents deleting categories that still have menu items assigned.

### 4. Photo Gallery (`/gallery`)
- Add, edit, and remove gallery moments with categories, captions, and featured badges.
- Image URL support with live visual preview.

### 5. Cafe Settings (`/settings`)
- Edit general cafe info, tagline, story, and address.
- Edit daily opening/closing schedules with full-day closure toggles.
- Unsaved changes indicator with save confirmation.
