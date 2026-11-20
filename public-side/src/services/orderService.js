import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

const COLLECTION_NAME = 'orderRequests';

/**
 * Direct Firestore Order Service (Spark Free Plan Architecture)
 * Completely replaces Cloud Functions with secure, authenticated direct Firestore operations.
 */
export const orderService = {
  /**
   * Submit Cash on Delivery order directly to Firestore `orderRequests`
   */
  async submitOrderRequest(orderPayload) {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.uid) {
      throw new Error('Customer authentication required. Please sign in to place your order.');
    }

    const {
      customerName,
      customerPhone,
      customerEmail = currentUser.email || '',
      fulfillmentType,
      fulfillmentDetails,
      items,
      customerQuotedSubtotal,
      customerQuotedTotal,
      idempotencyKey
    } = orderPayload;

    // Client-side pre-flight validations
    if (!customerName || !customerName.trim()) {
      throw new Error('Customer name is required.');
    }
    if (!customerPhone || customerPhone.trim().length < 7) {
      throw new Error('A valid phone number (at least 7 digits) is required.');
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Your tray is empty. Please add items before placing an order.');
    }
    if (!['dinein', 'takeaway', 'delivery', 'dine_in'].includes(fulfillmentType)) {
      throw new Error('Invalid fulfillment method selected.');
    }

    // Format clean sanitized items list (no undefined fields)
    const sanitizedItems = items.map((item) => ({
      menuItemId: String(item.menuItemId || item.id || ''),
      name: String(item.name || ''),
      quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
      selectedCustomizations: Array.isArray(item.selectedCustomizations)
        ? item.selectedCustomizations
        : [],
      size: item.size ? { id: String(item.size.id || item.size.name || ''), name: String(item.size.name || '') } : null,
      milk: item.milk ? { id: String(item.milk.id || item.milk.name || ''), name: String(item.milk.name || '') } : null,
      addOns: Array.isArray(item.addOns)
        ? item.addOns.map((a) => ({ id: String(a.id || a.name || ''), name: String(a.name || '') }))
        : [],
      specialInstructions: typeof item.specialInstructions === 'string' ? item.specialInstructions.trim() : '',
      customerDisplayedUnitPrice: Number(item.customerDisplayedUnitPrice ?? item.unitPrice ?? 0),
      customerDisplayedLineTotal: Number(
        item.customerDisplayedLineTotal ??
        item.itemTotal ??
        ((item.unitPrice || 0) * (item.quantity || 1))
      ),
      image: String(item.image || item.imageUrl || ''),
      isVeg: Boolean(item.isVeg)
    }));

    // Generate unique human-readable Order ID
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderId = `ORD-${dateStr}-${randStr}`;

    const quotedSubtotal = Number(customerQuotedSubtotal ?? orderPayload.subtotal ?? 0);
    const quotedTotal = Number(customerQuotedTotal ?? orderPayload.total ?? quotedSubtotal);

    // Assembly of orderRequests document matching firestore.rules requirements
    const orderDocument = {
      orderId,
      customerId: currentUser.uid,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      items: sanitizedItems,
      fulfillmentType,
      fulfillmentDetails: fulfillmentDetails || {},
      customerQuotedSubtotal: Math.round(quotedSubtotal * 100) / 100,
      customerQuotedTotal: Math.round(quotedTotal * 100) / 100,
      priceVerificationStatus: 'unverified',
      adminVerifiedSubtotal: null,
      adminVerifiedTotal: null,
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      orderStatus: 'received',
      idempotencyKey: idempotencyKey ? String(idempotencyKey) : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      const orderDocRef = doc(db, COLLECTION_NAME, orderId);
      await setDoc(orderDocRef, orderDocument);

      return {
        success: true,
        orderId,
        order: {
          ...orderDocument,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    } catch (err) {
      console.error('Direct Firestore order submission failed:', err);
      if (err?.code === 'permission-denied') {
        throw new Error(
          'Order rejected by security policy. Please verify you are signed in with a valid account.'
        );
      }
      throw new Error(
        err.message || 'Unable to place order at this time. Please check your connection and try again.'
      );
    }
  },

  /**
   * Backwards-compatible alias for existing callers
   */
  async submitCashOrder(orderPayload) {
    return this.submitOrderRequest(orderPayload);
  },

  /**
   * Fetch a single order by ID from `orderRequests` (with fallback to `orders`)
   */
  async getOrderById(orderId) {
    if (!orderId) throw new Error('Order ID is required.');
    try {
      // Primary: orderRequests
      const reqRef = doc(db, COLLECTION_NAME, orderId);
      let snapshot = await getDoc(reqRef);

      // Fallback: legacy orders collection
      if (!snapshot.exists()) {
        const legacyRef = doc(db, 'orders', orderId);
        snapshot = await getDoc(legacyRef);
      }

      if (!snapshot.exists()) {
        return null;
      }

      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt
      };
    } catch (err) {
      console.error('getOrderById error:', err);
      throw err;
    }
  },

  /**
   * Fetch all orders for current authenticated customer
   */
  async getCustomerOrders(customerId) {
    if (!customerId) return [];
    try {
      let ordersQuery;
      try {
        ordersQuery = query(
          collection(db, COLLECTION_NAME),
          where('customerId', '==', customerId),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(ordersQuery);
        return snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
          };
        });
      } catch (indexErr) {
        // Fallback for missing index or building index
        console.warn('Index note, querying orderRequests without sort:', indexErr);
        ordersQuery = query(
          collection(db, COLLECTION_NAME),
          where('customerId', '==', customerId)
        );
        const snapshot = await getDocs(ordersQuery);
        const list = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
          };
        });
        return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      }
    } catch (err) {
      console.error('getCustomerOrders error:', err);
      throw err;
    }
  }
};
