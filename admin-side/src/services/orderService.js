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

const COLLECTION_NAME = 'orderRequests';

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

export const orderService = {
  /**
   * Real-time subscription to orderRequests collection sorted newest first
   */
  subscribe(onSuccess, onError) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
      return onSnapshot(
        q,
        (snap) => {
          const orders = snap.docs.map((d) => ({
            id: d.id,
            ...d.data()
          }));
          onSuccess(orders);
        },
        (err) => {
          console.warn('onSnapshot orderBy error, falling back to unordered listener:', err);
          // Fallback if composite index is not yet built
          return onSnapshot(
            collection(db, COLLECTION_NAME),
            (snap) => {
              const orders = snap.docs.map((d) => ({
                id: d.id,
                ...d.data()
              }));
              orders.sort((a, b) => parseTimestamp(b.createdAt) - parseTimestamp(a.createdAt));
              onSuccess(orders);
            },
            onError
          );
        }
      );
    } catch (err) {
      if (typeof onError === 'function') onError(err);
      return () => {};
    }
  },

  /**
   * Fetch all orders (one-time fetch)
   */
  async getAll() {
    try {
      let snap;
      try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        snap = await getDocs(q);
      } catch (orderErr) {
        console.warn('Firestore orders orderBy error:', orderErr);
        snap = await getDocs(collection(db, COLLECTION_NAME));
      }

      const orders = snap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));

      return orders.sort((a, b) => parseTimestamp(b.createdAt) - parseTimestamp(a.createdAt));
    } catch (err) {
      console.error('Firestore error in orderService.getAll:', err);
      throw err;
    }
  },

  /**
   * Fetch a single order by ID
   */
  async getById(id) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        throw new Error(`Order with ID "${id}" not found.`);
      }
      return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.error(`Firestore error in orderService.getById(${id}):`, err);
      throw err;
    }
  },

  /**
   * Verify order price and item availability, and advance to 'confirmed' status
   */
  async verifyOrder(id, verifiedTotal, extra = {}) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const numTotal = Math.round(Number(verifiedTotal) * 100) / 100;
      await updateDoc(docRef, {
        priceVerificationStatus: 'verified',
        adminVerifiedSubtotal: numTotal,
        adminVerifiedTotal: numTotal,
        orderStatus: 'confirmed',
        verifiedAt: serverTimestamp(),
        ...extra,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error(`Firestore error in orderService.verifyOrder(${id}):`, err);
      throw err;
    }
  },

  /**
   * Update operational order status (received, confirmed, preparing, ready, completed, cancelled)
   */
  async updateStatus(id, newStatus, extra = {}) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        orderStatus: newStatus,
        ...extra,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error(`Firestore error in orderService.updateStatus(${id}):`, err);
      throw err;
    }
  },

  /**
   * Update payment status (pending, paid)
   */
  async updatePaymentStatus(id, paymentStatus) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        paymentStatus,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error(`Firestore error in orderService.updatePaymentStatus(${id}):`, err);
      throw err;
    }
  },

  /**
   * Cancel an order with required reason
   */
  async cancel(id, reason = '') {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        orderStatus: 'cancelled',
        cancellationReason: reason.trim(),
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error(`Firestore error in orderService.cancel(${id}):`, err);
      throw err;
    }
  }
};
