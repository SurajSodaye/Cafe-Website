import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { galleryImages as fallbackGalleryImages } from '../data/gallery';

/**
 * Normalizes gallery item fields ensuring consistent property names across
 * Firestore demo seeds, admin manual additions, and local fallback data.
 * @param {Object} item
 * @param {number} index
 * @returns {Object}
 */
function normalizeGalleryItem(item, index) {
  const imageUrl = item.imageUrl || item.url || item.image || item.src || item.thumbnailUrl || '';
  const thumbnailUrl = item.thumbnailUrl || item.thumbUrl || imageUrl;
  const title = item.title?.trim() || item.caption?.trim() || 'Café Moment';
  const caption = item.caption?.trim() || item.title?.trim() || '';
  const alt = item.alt?.trim() || item.caption?.trim() || item.title?.trim() || 'Brew & Bloom Café photo';
  const category = item.category?.trim() || 'Ambience';
  const order = typeof item.order === 'number' ? item.order : (index + 1);

  return {
    ...item,
    id: item.id || `gallery-${index + 1}`,
    title,
    caption,
    alt,
    category,
    imageUrl,
    thumbnailUrl,
    featured: Boolean(item.featured),
    order
  };
}

/**
 * Fetch gallery images from Firestore with optional ordering and filters.
 * Falls back to curated initial gallery if Firestore is empty or unreachable.
 * Collection: "gallery"
 * @param {Object} options
 * @param {boolean} [options.featuredOnly]
 * @param {number} [options.limit]
 * @returns {Promise<Array>}
 */
export async function getGalleryImages({ featuredOnly = false, limit } = {}) {
  try {
    let results = [];

    // Query gallery collection directly without orderBy in the query constraint.
    // In Cloud Firestore, orderBy('order') silently filters out documents that do not
    // have the 'order' field defined, which breaks seeded demo documents.
    try {
      const snapshot = await getDocs(collection(db, 'gallery'));
      if (!snapshot.empty) {
        results = snapshot.docs.map((doc, idx) =>
          normalizeGalleryItem({ id: doc.id, ...doc.data() }, idx)
        );
      }
    } catch (firestoreErr) {
      console.warn('Firestore gallery fetch error, using local fallback:', firestoreErr);
    }

    // If Firestore has no gallery documents or was unreachable, fall back to curated dataset
    if (results.length === 0) {
      results = fallbackGalleryImages.map(normalizeGalleryItem);
    }

    // In-memory sort by order
    results.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Filter featured items if requested (e.g. for homepage preview)
    if (featuredOnly) {
      results = results.filter((img) => Boolean(img.featured));
    }

    // Apply limit if specified
    if (typeof limit === 'number' && limit > 0) {
      results = results.slice(0, limit);
    }

    return results;
  } catch (error) {
    console.error('Error in getGalleryImages, using fallback:', error);
    let fallback = fallbackGalleryImages.map(normalizeGalleryItem);

    if (featuredOnly) {
      fallback = fallback.filter((img) => Boolean(img.featured));
    }

    if (typeof limit === 'number' && limit > 0) {
      fallback = fallback.slice(0, limit);
    }

    return fallback;
  }
}
