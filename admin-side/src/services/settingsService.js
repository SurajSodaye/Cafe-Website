import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  limit,
  query,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { initialCafeInfo } from '../data/cafeInfo';
import { initialCategories } from '../data/categories';
import { initialMenuItems } from '../data/menuItems';
import { initialGallery } from '../data/gallery';

export const settingsService = {
  /**
   * Fetch cafe profile and operating settings from Firestore
   * Document: settings/cafeInfo
   */
  async getSettings() {
    try {
      const docRef = doc(db, 'settings', 'cafeInfo');
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        return null;
      }
      return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.error('Firestore error in settingsService.getSettings:', err);
      throw err;
    }
  },

  /**
   * Update cafe settings with merge: true and updatedAt
   */
  async updateSettings(updates) {
    try {
      const docRef = doc(db, 'settings', 'cafeInfo');
      const payload = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      await setDoc(docRef, payload, { merge: true });
      const snap = await getDoc(docRef);
      return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.error('Firestore error in settingsService.updateSettings:', err);
      throw err;
    }
  },

  /**
   * Checks if Firestore collections already contain demo or real data
   */
  async checkHasExistingData() {
    try {
      const menuSnap = await getDocs(query(collection(db, 'menuItems'), limit(1)));
      const catSnap = await getDocs(query(collection(db, 'categories'), limit(1)));
      const settingsSnap = await getDoc(doc(db, 'settings', 'cafeInfo'));

      return menuSnap.size > 0 || catSnap.size > 0 || settingsSnap.exists();
    } catch (err) {
      console.error('Firestore error in checkHasExistingData:', err);
      return false;
    }
  },

  /**
   * Import initial seed data into Firestore using a batched write,
   * preserving the existing unique IDs.
   */
  async importDemoData() {
    try {
      const batch = writeBatch(db);

      // 1. Settings Document
      const settingsRef = doc(db, 'settings', 'cafeInfo');
      batch.set(
        settingsRef,
        {
          ...initialCafeInfo,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      // 2. Categories
      initialCategories.forEach((cat) => {
        const catRef = doc(db, 'categories', cat.id);
        batch.set(
          catRef,
          {
            ...cat,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp()
          },
          { merge: true }
        );
      });

      // 3. Menu Items
      initialMenuItems.forEach((item) => {
        const itemRef = doc(db, 'menuItems', item.id);
        batch.set(
          itemRef,
          {
            ...item,
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp()
          },
          { merge: true }
        );
      });

      // 4. Gallery Photos
      initialGallery.forEach((photo, idx) => {
        const photoRef = doc(db, 'gallery', photo.id);
        batch.set(
          photoRef,
          {
            ...photo,
            order: photo.order ?? (idx + 1),
            updatedAt: serverTimestamp(),
            createdAt: serverTimestamp()
          },
          { merge: true }
        );
      });

      // Commit the atomic batch
      await batch.commit();
      return true;
    } catch (err) {
      console.error('Firestore error in settingsService.importDemoData:', err);
      throw err;
    }
  }
};
