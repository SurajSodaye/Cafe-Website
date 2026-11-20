/**
 * Currency formatting and Cart Item sanitization utilities
 * Brew & Bloom Café
 */

/**
 * Safely formats a numeric amount into INR currency (e.g., "₹120.00")
 * Never throws TypeError on null, undefined, NaN, or non-numeric types.
 *
 * @param {number|string|null|undefined} amount
 * @param {object} options
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, { fallback = '₹0.00', showSymbol = true } = {}) {
  if (amount === null || amount === undefined || amount === '') {
    return fallback;
  }
  const num = Number(amount);
  if (isNaN(num)) {
    return fallback;
  }
  const formatted = num.toFixed(2);
  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Normalizes any raw cart item (whether newly created or loaded from an older localStorage structure)
 * into a single consistent, immutable data contract with guaranteed numeric fields.
 *
 * @param {object} rawItem
 * @returns {object|null}
 */
export function sanitizeCartItem(rawItem) {
  if (!rawItem || typeof rawItem !== 'object') return null;

  const id = String(rawItem.id || rawItem.menuItemId || '');
  const name = String(rawItem.name || 'Menu Item');
  const quantity = Math.max(1, Math.min(99, parseInt(rawItem.quantity, 10) || 1));

  // Determine base price: check basePrice, unitPrice, price
  let candidatePrice = NaN;
  if (rawItem.basePrice !== undefined && rawItem.basePrice !== null && rawItem.basePrice !== '') {
    candidatePrice = Number(rawItem.basePrice);
  } else if (rawItem.unitPrice !== undefined && rawItem.unitPrice !== null && rawItem.unitPrice !== '') {
    candidatePrice = Number(rawItem.unitPrice);
  } else if (rawItem.price !== undefined && rawItem.price !== null && rawItem.price !== '') {
    candidatePrice = Number(rawItem.price);
  }

  const hasValidBasePrice = !isNaN(candidatePrice) && candidatePrice >= 0;

  // Customizations extraction
  const rawCust = rawItem.customizations || {};
  const size = rawItem.selectedSize || rawCust.size || null;
  const milk = rawItem.selectedMilk || rawCust.milk || null;
  const addOns = Array.isArray(rawItem.selectedAddOns)
    ? rawItem.selectedAddOns
    : Array.isArray(rawCust.addOns)
    ? rawCust.addOns
    : [];
  const notes = String(
    rawItem.specialNotes || rawCust.notes || rawCust.specialNotes || ''
  ).trim();

  // Customization extra adjustments
  let extraCost = 0;
  if (size) extraCost += Number(size.priceDelta ?? size.price ?? 0);
  if (milk) extraCost += Number(milk.priceDelta ?? milk.price ?? 0);
  if (Array.isArray(addOns)) {
    extraCost += addOns.reduce(
      (sum, a) => sum + Number(a.priceDelta ?? a.price ?? 0),
      0
    );
  }

  // Calculate unit price and line subtotal
  const unitPrice = hasValidBasePrice ? Math.max(0, candidatePrice + extraCost) : null;
  const totalPrice = unitPrice !== null ? Math.round(unitPrice * quantity * 100) / 100 : null;

  // Stable cartItemId
  const cartItemId =
    rawItem.cartItemId ||
    `${id}_${encodeURIComponent(
      JSON.stringify({
        s: size?.id,
        m: milk?.id,
        a: addOns.map((a) => a.id).sort(),
        n: notes
      })
    )}`;

  const isVeg = Boolean(
    rawItem.isVeg ??
    (rawItem.dietaryType === 'veg' || rawItem.dietaryType === 'vegan')
  );

  const image = String(rawItem.image || rawItem.imageUrl || '');

  return {
    cartItemId,
    id,
    name,
    basePrice: hasValidBasePrice ? candidatePrice : null,
    unitPrice,
    price: unitPrice, // backwards compatibility alias
    totalPrice,
    lineTotal: totalPrice, // alias
    quantity,
    image,
    imageUrl: image, // alias
    isVeg,
    category: String(rawItem.category || rawItem.categoryName || ''),
    customizations: {
      size,
      milk,
      addOns,
      notes
    },
    // Direct top-level aliases so both access patterns work seamlessly
    selectedSize: size,
    selectedMilk: milk,
    selectedAddOns: addOns,
    specialNotes: notes,
    hasValidPrice: hasValidBasePrice && unitPrice !== null
  };
}
