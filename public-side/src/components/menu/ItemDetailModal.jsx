import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Minus, Coffee, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { DietaryBadge, PopularBadge, SoldOutBadge } from '../ui/Badge';
import { formatCurrency } from '../../utils/currency';
import { PRIMARY_FALLBACK_IMAGE, SVG_FALLBACK_IMAGE } from '../../utils/imageFallback';

export function ItemDetailModal({ item, isOpen, onClose }) {
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedMilk, setSelectedMilk] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [specialNotes, setSpecialNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  // Reset state when item changes or modal opens
  useEffect(() => {
    if (item && isOpen) {
      setQuantity(1);
      setSpecialNotes('');
      setValidationError('');

      // Auto-select first size if schema defines sizes
      if (Array.isArray(item.sizes) && item.sizes.length > 0) {
        setSelectedSize(item.sizes[0]);
      } else {
        setSelectedSize(null);
      }

      // Auto-select standard milk if schema defines milkOptions
      if (Array.isArray(item.milkOptions) && item.milkOptions.length > 0) {
        setSelectedMilk(item.milkOptions[0]);
      } else {
        setSelectedMilk(null);
      }

      setSelectedAddOns([]);
    }
  }, [item, isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Calculate live unit price based on base item + selections supported by data
  const unitPrice = useMemo(() => {
    if (!item) return 0;
    let extra = 0;
    if (selectedSize) extra += Number(selectedSize.priceDelta ?? selectedSize.price ?? 0);
    if (selectedMilk) extra += Number(selectedMilk.priceDelta ?? selectedMilk.price ?? 0);
    if (Array.isArray(selectedAddOns)) {
      extra += selectedAddOns.reduce(
        (s, a) => s + (Number(a.priceDelta ?? a.price) || 0),
        0
      );
    }
    const base = Number(item.price);
    return isNaN(base) ? 0 : Math.max(0, base + extra);
  }, [item, selectedSize, selectedMilk, selectedAddOns]);

  const totalPrice = unitPrice * quantity;

  if (!isOpen || !item) return null;

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.name === addOn.name);
      if (exists) {
        return prev.filter((a) => a.name !== addOn.name);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const handleAddToCart = () => {
    // Validate required size if sizes array exists in item data
    if (Array.isArray(item.sizes) && item.sizes.length > 0 && !selectedSize) {
      setValidationError('Please select a size option.');
      return;
    }

    const customizations = {};
    if (selectedSize) customizations.size = selectedSize;
    if (selectedMilk) customizations.milk = selectedMilk;
    if (selectedAddOns.length > 0) customizations.addOns = selectedAddOns;
    if (specialNotes.trim()) customizations.notes = specialNotes.trim();

    addItem(item, customizations, quantity);
    onClose();
  };

  const hasVariantsInSchema =
    (Array.isArray(item.sizes) && item.sizes.length > 0) ||
    (Array.isArray(item.milkOptions) && item.milkOptions.length > 0) ||
    (Array.isArray(item.addOns) && item.addOns.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso-950/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg bg-cream-50 rounded-3xl shadow-warm-lg overflow-hidden border border-espresso-100/80 z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-white/90 text-espresso-700 hover:text-espresso-950 hover:bg-white shadow-warm-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          {/* Item Image & Badges */}
          <div className="relative aspect-[16/10] w-full bg-espresso-100 overflow-hidden">
            <img
              src={item.imageUrl || PRIMARY_FALLBACK_IMAGE}
              alt={item.name}
              onError={(e) => {
                if (e.currentTarget.src !== SVG_FALLBACK_IMAGE) {
                  e.currentTarget.src = SVG_FALLBACK_IMAGE;
                }
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10">
              <DietaryBadge isVeg={item.isVeg} />
              {item.isPopular && <PopularBadge />}
            </div>

            {!item.available && (
              <div className="absolute inset-0 bg-espresso-950/65 backdrop-blur-xs flex items-center justify-center p-4 z-10">
                <SoldOutBadge />
              </div>
            )}
          </div>

          {/* Details Body */}
          <div className="p-6 space-y-5">
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 id="item-modal-title" className="font-serif text-2xl font-bold text-espresso-900 leading-tight">
                  {item.name}
                </h3>
                <span className="font-sans font-bold text-xl text-espresso-900 shrink-0">
                  ₹{item.price}
                </span>
              </div>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-espresso-500 mt-1 capitalize">
                {(item.category || '').replace('-', ' ')} · {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
              </span>
              <p className="text-sm text-espresso-700 mt-2.5 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Validation Notice */}
            {validationError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Size Options (If defined in item schema) */}
            {Array.isArray(item.sizes) && item.sizes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-espresso-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-700">
                  Select Size <span className="text-terracotta-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {item.sizes.map((size) => {
                    const isSelected = selectedSize?.name === size.name;
                    return (
                      <button
                        key={size.name}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setValidationError('');
                        }}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-terracotta-500 bg-terracotta-50/80 text-terracotta-900 shadow-xs'
                            : 'border-espresso-200 bg-white text-espresso-700 hover:bg-cream-100'
                        }`}
                      >
                        <span>{size.name}</span>
                        <span>{size.price > 0 ? `+₹${size.price}` : 'Standard'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Milk Options (If defined in item schema) */}
            {Array.isArray(item.milkOptions) && item.milkOptions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-espresso-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-700">
                  Choice of Milk
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {item.milkOptions.map((milk) => {
                    const isSelected = selectedMilk?.name === milk.name;
                    return (
                      <button
                        key={milk.name}
                        type="button"
                        onClick={() => setSelectedMilk(milk)}
                        className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-terracotta-500 bg-terracotta-50/80 text-terracotta-900 font-semibold shadow-xs'
                            : 'border-espresso-200 bg-white text-espresso-700 hover:bg-cream-100'
                        }`}
                      >
                        <span>{milk.name}</span>
                        {milk.price > 0 && <span className="text-[11px] text-espresso-500">+₹{milk.price}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add-ons (If defined in item schema) */}
            {Array.isArray(item.addOns) && item.addOns.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-espresso-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso-700">
                  Add-ons & Extras
                </label>
                <div className="space-y-1.5">
                  {item.addOns.map((addOn) => {
                    const isSelected = selectedAddOns.some((a) => a.name === addOn.name);
                    return (
                      <button
                        key={addOn.name}
                        type="button"
                        onClick={() => toggleAddOn(addOn)}
                        className={`w-full p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                          isSelected
                            ? 'border-terracotta-500 bg-terracotta-50/70 text-espresso-900 font-semibold'
                            : 'border-espresso-200 bg-white text-espresso-700 hover:bg-cream-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-terracotta-600 border-terracotta-600 text-white' : 'border-espresso-300'}`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span>{addOn.name}</span>
                        </div>
                        <span className="font-semibold text-espresso-800">+₹{addOn.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Instructions Note */}
            <div className="space-y-1.5 pt-2 border-t border-espresso-100">
              <label htmlFor="modal-notes" className="block text-xs font-bold uppercase tracking-wider text-espresso-700">
                Special Preparation Note
              </label>
              <textarea
                id="modal-notes"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Extra hot, less sweet, leave room for milk..."
                maxLength={200}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-espresso-200 bg-white text-xs text-espresso-800 placeholder-espresso-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-colors resize-none"
              />
              <span className="text-[10px] text-espresso-400 text-right block">
                {200 - specialNotes.length} characters remaining
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer (Quantity + Add Button) */}
        <div className="p-4 sm:p-5 border-t border-espresso-100 bg-white/95 backdrop-blur-xs flex items-center justify-between gap-4 shadow-warm-sm">
          {/* Quantity Selector */}
          <div className="inline-flex items-center gap-3 bg-cream-100/90 rounded-xl border border-espresso-200/80 px-3 py-1.5 shadow-xs">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1 || !item.available}
              className="p-1 text-espresso-600 hover:text-terracotta-600 disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm text-espresso-900 min-w-[20px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              disabled={quantity >= 99 || !item.available}
              className="p-1 text-espresso-600 hover:text-terracotta-600 disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <Button
            variant="primary"
            size="md"
            onClick={handleAddToCart}
            disabled={!item.available}
            className="flex-1 justify-center shadow-warm-sm py-2.5"
          >
            {item.available ? (
              <span>Add to Tray &bull; {formatCurrency(totalPrice)}</span>
            ) : (
              <span>Currently Sold Out</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
