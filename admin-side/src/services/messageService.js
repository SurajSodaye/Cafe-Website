import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const COLLECTION_NAME = 'messages';

/**
 * Helper to safely extract milliseconds from Firestore Timestamp, Date, or string
 */
function parseTimestamp(val) {
  if (!val) return 0;
  if (typeof val?.toMillis === 'function') return val.toMillis();
  if (typeof val?.toDate === 'function') return val.toDate().getTime();
  if (val instanceof Date) return val.getTime();
  const parsed = new Date(val).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

export const messageService = {
  /**
   * Fetch all messages sorted newest first
   * @returns {Promise<Array>}
   */
  async getAll() {
    try {
      let snap;
      try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        snap = await getDocs(q);
      } catch (orderErr) {
        console.warn('Firestore messages orderBy error, falling back to base collection:', orderErr);
        snap = await getDocs(collection(db, COLLECTION_NAME));
      }

      const messages = snap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));

      return messages.sort((a, b) => parseTimestamp(b.createdAt) - parseTimestamp(a.createdAt));
    } catch (err) {
      console.error('Firestore error in messageService.getAll:', err);
      throw err;
    }
  },

  /**
   * Fetch a single message by ID
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        throw new Error(`Message with ID "${id}" not found.`);
      }
      return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.error(`Firestore error in messageService.getById(${id}):`, err);
      throw err;
    }
  },

  /**
   * Update message status ('new' | 'read' | 'replied' | 'archived')
   * @param {string} id
   * @param {string} status
   * @returns {Promise<Object>}
   */
  async updateStatus(id, status) {
    const validStatuses = ['new', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status "${status}". Must be one of: ${validStatuses.join(', ')}`);
    }

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp()
      });
      return { id, status };
    } catch (err) {
      console.error(`Firestore error in messageService.updateStatus(${id}):`, err);
      throw err;
    }
  },

  /**
   * Delete a message by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async remove(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error(`Firestore error in messageService.remove(${id}):`, err);
      throw err;
    }
  },

  /**
   * Subscribe to realtime updates for the messages collection
   * @param {Function} callback - Receives sorted messages array
   * @param {Function} [onError] - Error callback
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback, onError) {
    let q;
    try {
      q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    } catch (err) {
      q = collection(db, COLLECTION_NAME);
    }

    return onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data()
        }));
        // Ensure accurate descending order in memory
        messages.sort((a, b) => parseTimestamp(b.createdAt) - parseTimestamp(a.createdAt));
        callback(messages);
      },
      (err) => {
        console.error('Firestore onSnapshot error on messages:', err);
        if (onError) onError(err);
      }
    );
  }
};
