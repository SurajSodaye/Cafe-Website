import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const menuService = {
  /**
   * Fetch all menu items from Firestore
   */
  async getAll() {
    try {
      const snap = await getDocs(collection(db, 'menuItems'));
      return snap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
    } catch (err) {
      console.error('Firestore error in menuService.getAll:', err);
      throw err;
    }
  },

  /**
   * Get single menu item by ID
   */
  async getById(id) {
    try {
      const docRef = doc(db, 'menuItems', id);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        throw new Error(`Menu item with ID "${id}" not found.`);
      }
      return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.error(`Firestore error in menuService.getById(${id}):`, err);
      throw err;
    }
  },

  /**
   * Create a new menu item
   */
  async create(itemData) {
    try {
      const payload = {
        name: itemData.name.trim(),
        category: itemData.category,
        price: Number(itemData.price),
        description: itemData.description?.trim() || '',
        imageUrl:
          itemData.imageUrl?.trim() ||
          'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=600&q=80',
        isVeg: Boolean(itemData.isVeg),
        isPopular: Boolean(itemData.isPopular),
        available: itemData.available !== undefined ? Boolean(itemData.available) : true,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'menuItems'), payload);
      return { id: docRef.id, ...payload };
    } catch (err) {
      console.error('Firestore error in menuService.create:', err);
      throw err;
    }
  },

  /**
   * Update an existing menu item
   */
  async update(id, updates) {
    try {
      const docRef = doc(db, 'menuItems', id);
      const payload = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      if (updates.price !== undefined) {
        payload.price = Number(updates.price);
      }

      await updateDoc(docRef, payload);
      const updatedSnap = await getDoc(docRef);
      return { id: updatedSnap.id, ...updatedSnap.data() };
    } catch (err) {
      console.error(`Firestore error in menuService.update(${id}):`, err);
      throw err;
    }
  },

  /**
   * Remove a menu item by ID
   */
  async remove(id) {
    try {
      await deleteDoc(doc(db, 'menuItems', id));
      return true;
    } catch (err) {
      console.error(`Firestore error in menuService.remove(${id}):`, err);
      throw err;
    }
  },

  /**
   * Quick toggle availability
   */
  async toggleAvailability(id) {
    const item = await this.getById(id);
    return this.update(id, { available: !item.available });
  },

  /**
   * Quick toggle popular status
   */
  async togglePopular(id) {
    const item = await this.getById(id);
    return this.update(id, { isPopular: !item.isPopular });
  }
};
