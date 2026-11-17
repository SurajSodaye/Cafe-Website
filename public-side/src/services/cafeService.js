import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Fetch cafe profile and operating settings from Firestore.
 * Document: settings/cafeInfo
 * @returns {Promise<Object|null>}
 */
export async function getCafeInfo() {
  try {
    const docRef = doc(db, 'settings', 'cafeInfo');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn('Firestore: settings/cafeInfo document not found.');
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Firestore error in getCafeInfo:', error);
    throw error;
  }
}
