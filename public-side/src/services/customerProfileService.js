import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const customerProfileService = {
  /**
   * Retrieve customer profile information from Firestore
   */
  async getCustomerProfile(uid) {
    if (!uid) return null;
    try {
      const docRef = doc(db, 'customers', uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return snapshot.data();
      }
      return null;
    } catch (err) {
      console.warn('Could not retrieve customer profile from Firestore:', err);
      return null;
    }
  },

  /**
   * Save or update customer profile details
   */
  async saveCustomerProfile(uid, data) {
    if (!uid) return;
    try {
      const docRef = doc(db, 'customers', uid);
      const payload = {
        ...data,
        updatedAt: serverTimestamp()
      };
      await setDoc(docRef, payload, { merge: true });
      return true;
    } catch (err) {
      console.warn('Could not save customer profile to Firestore:', err);
      throw err;
    }
  }
};
