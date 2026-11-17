import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Fetch categories from Firestore ordered by "order".
 * Collection: "categories"
 * @returns {Promise<Array>}
 */
export async function getCategories() {
  try {
    let snapshot;
    try {
      const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
      snapshot = await getDocs(q);
    } catch (orderErr) {
      // In case ordering index is pending or order field is missing, fetch unordered
      console.warn('Firestore categories orderBy error, falling back to base query:', orderErr);
      snapshot = await getDocs(collection(db, 'categories'));
    }

    const results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    // In-memory sort by order as a safety guarantee
    results.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return results;
  } catch (error) {
    console.error('Firestore error in getCategories:', error);
    throw error;
  }
}

/**
 * Fetch menu items from Firestore with optional category, veg-only, and search filters.
 * Collection: "menuItems"
 * @param {Object} options
 * @param {string} [options.category] - Category slug or 'all'
 * @param {boolean} [options.vegOnly] - Filter for vegetarian only
 * @param {string} [options.searchQuery] - Search text for name or description
 * @returns {Promise<Array>}
 */
export async function getMenuItems({ category = 'all', vegOnly = false, searchQuery = '' } = {}) {
  try {
    const snapshot = await getDocs(collection(db, 'menuItems'));
    let results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    // Category filter
    if (category && category !== 'all') {
      results = results.filter((item) => item.category === category || item.slug === category);
    }

    // Vegetarian filter
    if (vegOnly) {
      results = results.filter((item) => Boolean(item.isVeg));
    }

    // Search query filter (name or description)
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q))
      );
    }

    return results;
  } catch (error) {
    console.error('Firestore error in getMenuItems:', error);
    throw error;
  }
}

/**
 * Fetch popular menu items for homepage highlight.
 * Collection: "menuItems" (where isPopular == true)
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getPopularMenuItems(limit = 4) {
  try {
    const snapshot = await getDocs(collection(db, 'menuItems'));
    const allItems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    const popular = allItems.filter((item) => Boolean(item.isPopular)).slice(0, limit);
    return popular;
  } catch (error) {
    console.error('Firestore error in getPopularMenuItems:', error);
    throw error;
  }
}
