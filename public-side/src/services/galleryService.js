import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Fetch gallery images from Firestore with optional ordering and filters.
 * Collection: "gallery", ordered by "order"
 * @param {Object} options
 * @param {boolean} [options.featuredOnly]
 * @param {number} [options.limit]
 * @returns {Promise<Array>}
 */
export async function getGalleryImages({ featuredOnly = false, limit } = {}) {
  try {
    let snapshot;
    try {
      const q = query(collection(db, 'gallery'), orderBy('order', 'asc'));
      snapshot = await getDocs(q);
    } catch (orderErr) {
      // If order field or index is missing, fetch unordered
      console.warn('Firestore gallery orderBy error, falling back to base query:', orderErr);
      snapshot = await getDocs(collection(db, 'gallery'));
    }

    let results = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    // In-memory sort by order if order is defined
    results.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    if (featuredOnly) {
      results = results.filter((img) => Boolean(img.featured));
    }

    if (typeof limit === 'number' && limit > 0) {
      results = results.slice(0, limit);
    }

    return results;
  } catch (error) {
    console.error('Firestore error in getGalleryImages:', error);
    throw error;
  }
}
