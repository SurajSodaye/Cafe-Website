const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

// Allowed origins for development and production
const ALLOWED_ORIGINS = [
  'http://127.0.0.1:5173',
  'http://localhost:5173',
  'https://brew-and-bloom-theta.vercel.app',
  /https:\/\/.*\.vercel\.app$/
];

/**
 * Callable Firebase Cloud Function: submitCashOrder
 * Handles verified server-side order calculation and submission for Cash on Delivery / Pay at Counter.
 */
exports.submitCashOrder = onCall(
  {
    cors: ALLOWED_ORIGINS,
    region: 'us-central1'
  },
  async (request) => {
    // 1. Authentication Check
    if (!request.auth || !request.auth.uid) {
      throw new HttpsError(
        'unauthenticated',
        'Customer must be signed in with a valid account to place an order.'
      );
    }

    const customerId = request.auth.uid;
    const authEmail = request.auth.token?.email || '';
    const data = request.data || {};

    const {
      customerName,
      customerPhone,
      customerEmail = authEmail,
      fulfillmentType,
      fulfillmentDetails,
      items,
      idempotencyKey
    } = data;

    // 2. Customer Contact Validation
    if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
      throw new HttpsError('invalid-argument', 'Customer full name is required.');
    }

    if (!customerPhone || typeof customerPhone !== 'string' || customerPhone.trim().length < 7) {
      throw new HttpsError('invalid-argument', 'A valid contact phone number is required (at least 7 digits).');
    }

    // 3. Fulfillment Validation
    if (!['dinein', 'takeaway', 'delivery'].includes(fulfillmentType)) {
      throw new HttpsError(
        'invalid-argument',
        'Invalid fulfillment type. Must be dinein, takeaway, or delivery.'
      );
    }

    if (!fulfillmentDetails || typeof fulfillmentDetails !== 'object') {
      throw new HttpsError('invalid-argument', 'Fulfillment details are required.');
    }

    const cleanFulfillment = {};

    if (fulfillmentType === 'dinein') {
      if (!fulfillmentDetails.tableNumber || !String(fulfillmentDetails.tableNumber).trim()) {
        throw new HttpsError('invalid-argument', 'Table number is required for dine-in orders.');
      }
      cleanFulfillment.tableNumber = String(fulfillmentDetails.tableNumber).trim();
      cleanFulfillment.guestCount = Math.max(1, parseInt(fulfillmentDetails.guestCount, 10) || 1);
      cleanFulfillment.diningNotes = (fulfillmentDetails.diningNotes || '').slice(0, 300).trim();
    } else if (fulfillmentType === 'takeaway') {
      if (!fulfillmentDetails.pickupTime || !String(fulfillmentDetails.pickupTime).trim()) {
        throw new HttpsError('invalid-argument', 'Estimated pickup time is required for takeaway.');
      }
      cleanFulfillment.pickupTime = String(fulfillmentDetails.pickupTime).trim();
      cleanFulfillment.takeawayNotes = (fulfillmentDetails.takeawayNotes || '').slice(0, 300).trim();
    } else if (fulfillmentType === 'delivery') {
      if (!fulfillmentDetails.address || !String(fulfillmentDetails.address).trim()) {
        throw new HttpsError('invalid-argument', 'Complete delivery address is required.');
      }
      if (!fulfillmentDetails.pincode || !String(fulfillmentDetails.pincode).trim()) {
        throw new HttpsError('invalid-argument', 'PIN code is required for delivery.');
      }
      cleanFulfillment.address = String(fulfillmentDetails.address).trim();
      cleanFulfillment.landmark = (fulfillmentDetails.landmark || '').slice(0, 150).trim();
      cleanFulfillment.pincode = String(fulfillmentDetails.pincode).trim();
      cleanFulfillment.deliveryNotes = (fulfillmentDetails.deliveryNotes || '').slice(0, 300).trim();
    }

    // 4. Items Array Validation
    if (!Array.isArray(items) || items.length === 0) {
      throw new HttpsError('invalid-argument', 'Cart is empty. Please add items to your tray.');
    }

    if (items.length > 50) {
      throw new HttpsError('invalid-argument', 'Orders cannot contain more than 50 distinct items.');
    }

    // 5. Idempotency Check (prevent accidental duplicate submissions)
    if (idempotencyKey && typeof idempotencyKey === 'string') {
      const existingSnap = await db
        .collection('orders')
        .where('customerId', '==', customerId)
        .where('idempotencyKey', '==', idempotencyKey.trim())
        .limit(1)
        .get();

      if (!existingSnap.empty) {
        const existingDoc = existingSnap.docs[0];
        const existingData = existingDoc.data();
        return {
          success: true,
          orderId: existingDoc.id,
          order: {
            ...existingData,
            createdAt: existingData.createdAt ? existingData.createdAt.toDate().toISOString() : new Date().toISOString()
          },
          isDuplicate: true
        };
      }
    }

    // 6. Authoritative Firestore Price Recalculation & Availability Verification
    let calculatedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const { menuItemId, quantity = 1, size, milk, addOns, specialInstructions } = item;

      if (!menuItemId || typeof menuItemId !== 'string') {
        throw new HttpsError('invalid-argument', 'Invalid menu item ID specified.');
      }

      const numQuantity = parseInt(quantity, 10);
      if (isNaN(numQuantity) || numQuantity < 1 || numQuantity > 50) {
        throw new HttpsError('invalid-argument', 'Item quantities must be integers between 1 and 50.');
      }

      // Fetch authentic menu item from Firestore
      const menuDoc = await db.collection('menuItems').doc(menuItemId).get();
      if (!menuDoc.exists) {
        throw new HttpsError('not-found', `Menu item "${menuItemId}" was not found in our catalog.`);
      }

      const menuData = menuDoc.data();

      // Check real-time item availability
      if (menuData.isAvailable === false || menuData.available === false) {
        throw new HttpsError(
          'failed-precondition',
          `"${menuData.name}" is currently sold out and cannot be ordered.`
        );
      }

      // Authoritative base price
      const basePrice = Number(menuData.price) || 0;

      // Variants validation (Sizes)
      let sizeDelta = 0;
      let sizeSnapshot = null;
      if (size && typeof size === 'object' && size.id) {
        if (Array.isArray(menuData.sizes) && menuData.sizes.length > 0) {
          const matchedSize = menuData.sizes.find((s) => s.id === size.id);
          if (matchedSize) {
            sizeDelta = Number(matchedSize.priceDelta ?? matchedSize.price ?? 0);
            sizeSnapshot = { id: matchedSize.id, name: matchedSize.name, priceDelta: sizeDelta };
          }
        }
      }

      // Variants validation (Milk options)
      let milkDelta = 0;
      let milkSnapshot = null;
      if (milk && typeof milk === 'object' && milk.id) {
        if (Array.isArray(menuData.milkOptions) && menuData.milkOptions.length > 0) {
          const matchedMilk = menuData.milkOptions.find((m) => m.id === milk.id);
          if (matchedMilk) {
            milkDelta = Number(matchedMilk.priceDelta ?? matchedMilk.price ?? 0);
            milkSnapshot = { id: matchedMilk.id, name: matchedMilk.name, priceDelta: milkDelta };
          }
        }
      }

      // Add-ons validation
      let addOnsDelta = 0;
      const addOnsSnapshot = [];
      if (Array.isArray(addOns) && addOns.length > 0) {
        if (Array.isArray(menuData.addOns) && menuData.addOns.length > 0) {
          for (const reqAddOn of addOns) {
            const matchedAddOn = menuData.addOns.find((a) => a.id === reqAddOn.id);
            if (matchedAddOn) {
              const addOnPrice = Number(matchedAddOn.price ?? matchedAddOn.priceDelta ?? 0);
              addOnsDelta += addOnPrice;
              addOnsSnapshot.push({
                id: matchedAddOn.id,
                name: matchedAddOn.name,
                price: addOnPrice
              });
            }
          }
        }
      }

      const unitPrice = Math.round((basePrice + sizeDelta + milkDelta + addOnsDelta) * 100) / 100;
      const itemTotal = Math.round(unitPrice * numQuantity * 100) / 100;
      calculatedSubtotal += itemTotal;

      verifiedItems.push({
        menuItemId,
        name: menuData.name,
        categoryName: menuData.categoryName || '',
        image: menuData.image || menuData.imageUrl || '',
        dietaryType: menuData.dietaryType || (menuData.isVeg ? 'veg' : 'non-veg'),
        unitPrice,
        quantity: numQuantity,
        itemTotal,
        size: sizeSnapshot,
        milk: milkSnapshot,
        addOns: addOnsSnapshot,
        specialInstructions: typeof specialInstructions === 'string' ? specialInstructions.slice(0, 200).trim() : ''
      });
    }

    const verifiedSubtotal = Math.round(calculatedSubtotal * 100) / 100;
    const verifiedTotal = verifiedSubtotal; // Fees = 0 (no unverified taxes or delivery charges)

    // 7. Unique Order ID Generation
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderId = `ORD-${dateStr}-${randStr}`;

    // 8. Order Document Assembly
    const orderDocument = {
      orderId,
      customerId,
      customerName: customerName.trim(),
      customerEmail: (customerEmail || authEmail).trim(),
      customerPhone: customerPhone.trim(),
      items: verifiedItems,
      fulfillmentType,
      fulfillmentDetails: cleanFulfillment,
      subtotal: verifiedSubtotal,
      fees: 0,
      total: verifiedTotal,
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      orderStatus: 'received',
      idempotencyKey: idempotencyKey ? idempotencyKey.trim() : null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    // 9. Trusted Server-Side Write
    await db.collection('orders').doc(orderId).set(orderDocument);

    return {
      success: true,
      orderId,
      order: {
        ...orderDocument,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }
);
