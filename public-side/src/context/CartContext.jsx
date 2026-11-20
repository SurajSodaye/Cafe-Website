import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { sanitizeCartItem } from '../utils/currency';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'brew_bloom_cart_v1';

export const CartProvider = ({ children }) => {
  // Load and sanitize items from localStorage upon initialization
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(sanitizeCartItem).filter(Boolean);
        }
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage:', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist cart to localStorage:', e);
    }
  }, [items]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  /**
   * Add menu item with optional customizations and quantity
   */
  const addItem = useCallback((item, customizations = {}, quantity = 1) => {
    const safeQty = Math.max(1, Math.min(99, Math.floor(Number(quantity) || 1)));

    const newEntry = sanitizeCartItem({
      ...item,
      customizations,
      quantity: safeQty
    });

    if (!newEntry) return;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.cartItemId === newEntry.cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const existing = updated[existingIndex];
        const newQty = Math.min(99, existing.quantity + safeQty);
        const newTotal =
          existing.unitPrice !== null ? Math.round(existing.unitPrice * newQty * 100) / 100 : null;

        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          totalPrice: newTotal,
          lineTotal: newTotal
        };
        return updated;
      } else {
        return [...prevItems, newEntry];
      }
    });

    setIsCartOpen(true);
  }, []);

  /**
   * Update quantity by delta (+1 / -1)
   */
  const updateQuantity = useCallback((cartItemId, delta) => {
    setItems((prevItems) => {
      return prevItems
        .map((entry) => {
          if (entry.cartItemId === cartItemId) {
            const nextQty = entry.quantity + delta;
            if (nextQty <= 0) return null;
            const safeNext = Math.min(99, nextQty);
            const nextTotal =
              entry.unitPrice !== null ? Math.round(entry.unitPrice * safeNext * 100) / 100 : null;

            return {
              ...entry,
              quantity: safeNext,
              totalPrice: nextTotal,
              lineTotal: nextTotal
            };
          }
          return entry;
        })
        .filter(Boolean);
    });
  }, []);

  /**
   * Set specific quantity directly
   */
  const setItemQuantity = useCallback((cartItemId, newQty) => {
    const safeQty = Math.floor(Number(newQty));
    if (isNaN(safeQty) || safeQty <= 0) {
      setItems((prevItems) => prevItems.filter((i) => i.cartItemId !== cartItemId));
      return;
    }
    const finalQty = Math.min(99, safeQty);
    setItems((prevItems) =>
      prevItems.map((entry) => {
        if (entry.cartItemId === cartItemId) {
          const nextTotal =
            entry.unitPrice !== null ? Math.round(entry.unitPrice * finalQty * 100) / 100 : null;
          return {
            ...entry,
            quantity: finalQty,
            totalPrice: nextTotal,
            lineTotal: nextTotal
          };
        }
        return entry;
      })
    );
  }, []);

  /**
   * Remove item from cart completely
   */
  const removeItem = useCallback((cartItemId) => {
    setItems((prevItems) => prevItems.filter((i) => i.cartItemId !== cartItemId));
  }, []);

  /**
   * Empty the entire cart
   */
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  }, [items]);

  const subtotal = useMemo(() => {
    const sum = items.reduce((acc, item) => {
      if (item.hasValidPrice && typeof item.unitPrice === 'number') {
        return acc + item.unitPrice * (item.quantity || 1);
      }
      return acc;
    }, 0);
    return Math.round(sum * 100) / 100;
  }, [items]);

  // Validation: Check if any item in cart is missing price
  const invalidPriceItems = useMemo(() => {
    return items.filter(
      (item) => !item.hasValidPrice || item.unitPrice === null || isNaN(item.unitPrice)
    );
  }, [items]);

  const hasInvalidPriceItems = invalidPriceItems.length > 0;

  const value = {
    items,
    totalItems,
    subtotal,
    hasInvalidPriceItems,
    invalidPriceItems,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    updateQuantity,
    setItemQuantity,
    removeItem,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
