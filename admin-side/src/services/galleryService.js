import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export const galleryService = {
  /**
   * Fetch all gallery photos from Firestore
   */
  async getAll() {
    try {
      const snap = await getDocs(collection(db, 'gallery'));
      const photos = snap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));

      return photos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    } catch (err) {
      console.error('Firestore error in galleryService.getAll:', err);
      throw err;
    }
  },

  /**
   * Add new photo to gallery
   */
  async create(imageData) {
    try {
      const payload = {
        title: imageData.title?.trim() || imageData.caption?.trim() || 'Cafe Moment',
        caption: imageData.caption?.trim() || imageData.title?.trim() || '',
        category: imageData.category || 'Ambience',
        alt: imageData.alt?.trim() || imageData.caption?.trim() || 'Brew & Bloom Café photo',
        imageUrl: imageData.imageUrl.trim(),
        thumbnailUrl: imageData.thumbnailUrl?.trim() || imageData.imageUrl.trim(),
        featured: Boolean(imageData.featured),
        order: imageData.order ?? Date.now(),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'gallery'), payload);
      return { id: docRef.id, ...payload };
    } catch (err) {
      console.error('Firestore error in galleryService.create:', err);
      throw err;
    }
  },

  /**
   * Update gallery item details
   */
  async update(id, updates) {
    try {
      const docRef = doc(db, 'gallery', id);
      const payload = {
        ...updates,
        title: updates.caption || updates.title,
        caption: updates.caption || updates.title,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, payload);
      const snap = await getDoc(docRef);
      return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.error(`Firestore error in galleryService.update(${id}):`, err);
      throw err;
    }
  },

  /**
   * Delete photo from gallery
   */
  async remove(id) {
    try {
      await deleteDoc(doc(db, 'gallery', id));
      return true;
    } catch (err) {
      console.error(`Firestore error in galleryService.remove(${id}):`, err);
      throw err;
    }
  }
};
