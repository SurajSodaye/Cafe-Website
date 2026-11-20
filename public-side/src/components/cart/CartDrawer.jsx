import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Coffee,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';
import { DietaryBadge } from '../ui/Badge';
import { formatCurrency } from '../../utils/currency';
import { PRIMARY_FALLBACK_IMAGE, SVG_FALLBACK_IMAGE } from '../../utils/imageFallback';

export function CartDrawer() {
  const {
    items,
    totalItems,
    subtotal,
    hasInvalidPriceItems,
    invalidPriceItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart
  } = useCart();
  const navigate = useNavigate();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const handleProceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Order Tray"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={closeCart}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <aside className="w-screen max-w-md bg-cream-50 text-espresso-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-espresso-100">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-espresso-100 bg-cream-100/90 backdrop-blur-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-espresso-900 text-cream-50 flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5 text-cream-100" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-espresso-900 leading-tight">
                  Your Order Tray
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-semibold text-terracotta-700 bg-terracotta-50 border border-terracotta-200 px-2 py-0.2 rounded-full">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </span>
                  <span className="text-[11px] text-espresso-500">&bull; Cash on Delivery</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-xl text-espresso-400 hover:text-espresso-900 hover:bg-espresso-100/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-espresso-100/80">
            {items.length === 0 ? (
              /* Empty State */
              <div className="h-full flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="w-20 h-20 rounded-3xl bg-cream-200/60 border border-espresso-100 text-espresso-400 flex items-center justify-center mb-5 shadow-xs">
                  <Coffee className="w-10 h-10 text-espresso-500" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-espresso-900 mb-2">
                  Your tray is empty
                </h3>
                <p className="text-xs text-espresso-600 max-w-xs mb-8 leading-relaxed">
                  Treat yourself to our specialty single-origin coffees, hand-rolled croissants, and fresh artisanal toasts.
                </p>
                <Button
                  to="/menu"
                  variant="primary"
                  size="md"
                  onClick={closeCart}
                  icon={ArrowRight}
                  iconPosition="right"
                  className="bg-espresso-900 hover:bg-espresso-950 text-cream-50 shadow-sm"
                >
                  Explore Our Menu
                </Button>
              </div>
            ) : (
              /* Items List */
              <div className="space-y-4 pt-1">
                {items.map((entry) => {
                  const sizeObj = entry.selectedSize || entry.customizations?.size;
                  const milkObj = entry.selectedMilk || entry.customizations?.milk;
                  const addOnsList = Array.isArray(entry.selectedAddOns)
                    ? entry.selectedAddOns
                    : Array.isArray(entry.customizations?.addOns)
                    ? entry.customizations.addOns
                    : [];
                  const notesStr = entry.specialNotes || entry.customizations?.notes;

                  return (
                    <div
                      key={entry.cartItemId}
                      className="pt-3.5 first:pt-0 flex gap-3.5 group rounded-xl p-2.5 bg-cream-100/40 hover:bg-cream-100/80 border border-transparent hover:border-espresso-100 transition-all"
                    >
                      {/* Thumbnail with Dietary Badge */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-espresso-100 shrink-0 border border-espresso-200/80 relative shadow-xs">
                        <img
                          src={entry.image || entry.imageUrl || PRIMARY_FALLBACK_IMAGE}
                          alt={entry.name}
                          onError={(e) => {
                            if (e.currentTarget.src !== SVG_FALLBACK_IMAGE) {
                              e.currentTarget.src = SVG_FALLBACK_IMAGE;
                            }
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1 left-1 scale-75 origin-top-left">
                          <DietaryBadge isVeg={entry.isVeg} />
                        </div>
                      </div>

                      {/* Details & Controls */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-serif text-sm font-bold text-espresso-900 leading-snug truncate">
                              {entry.name}
                            </h4>
                            <span className="font-bold text-sm text-espresso-900 whitespace-nowrap">
                              {entry.hasValidPrice ? (
                                formatCurrency(
                                  entry.totalPrice ?? (entry.unitPrice * entry.quantity)
                                )
                              ) : (
                                <span className="text-[10px] text-amber-800 bg-amber-100/80 border border-amber-300 px-1.5 py-0.5 rounded font-semibold">
                                  Price Pending
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="text-[11px] text-espresso-500 mt-0.5">
                            <span>{formatCurrency(entry.unitPrice)} each</span>
                          </div>

                          {/* Customizations tags */}
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {sizeObj && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-espresso-100 text-espresso-800">
                                Size: {sizeObj.name}
                                {sizeObj.priceDelta > 0 && ` (+₹${sizeObj.priceDelta})`}
                              </span>
                            )}
                            {milkObj && (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-espresso-100 text-espresso-800">
                                Milk: {milkObj.name}
                                {milkObj.priceDelta > 0 && ` (+₹${milkObj.priceDelta})`}
                              </span>
                            )}
                            {addOnsList.map((add, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-terracotta-50 border border-terracotta-200 text-terracotta-800"
                              >
                                +{add.name} (+₹{add.price || add.priceDelta || 0})
                              </span>
                            ))}
                            {notesStr && (
                              <span className="text-[10px] italic text-espresso-600 block w-full mt-0.5 truncate">
                                "{notesStr}"
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Stepper Quantity & Remove Action */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-espresso-100/60">
                          <div className="inline-flex items-center gap-2 bg-white rounded-lg border border-espresso-200 px-2 py-0.5 shadow-xs">
                            <button
                              type="button"
                              onClick={() => updateQuantity(entry.cartItemId, -1)}
                              disabled={entry.quantity <= 1}
                              className="p-1 text-espresso-600 hover:text-terracotta-600 disabled:opacity-30 disabled:hover:text-espresso-600 transition-colors"
                              aria-label={`Decrease quantity of ${entry.name}`}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold text-espresso-900 min-w-[18px] text-center select-none">
                              {entry.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(entry.cartItemId, 1)}
                              className="p-1 text-espresso-600 hover:text-terracotta-600 transition-colors"
                              aria-label={`Increase quantity of ${entry.name}`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(entry.cartItemId)}
                            className="p-1.5 text-espresso-400 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-lg transition-colors"
                            title="Remove item"
                            aria-label={`Remove ${entry.name} from tray`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-espresso-100 bg-white/95 backdrop-blur-xs space-y-3 shadow-lg">
              {/* Pricing Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-espresso-700">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-espresso-900 text-sm">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-espresso-500">
                  <span>Taxes & Service</span>
                  <span className="text-sage-700 font-semibold">Included (₹0.00)</span>
                </div>
              </div>

              {/* Invalid Price Warning */}
              {hasInvalidPriceItems && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Price Verification Required</span>
                    <p className="mt-0.5 text-[11px] text-amber-800">
                      {invalidPriceItems.length} item(s) have unverified pricing. Please remove them before proceeding.
                    </p>
                  </div>
                </div>
              )}

              {/* Checkout CTA */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  disabled={hasInvalidPriceItems}
                  onClick={handleProceedToCheckout}
                  className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-espresso-900 via-espresso-800 to-espresso-900 hover:from-espresso-950 hover:via-espresso-900 hover:to-espresso-950 text-cream-50 p-1 shadow-warm-md hover:shadow-warm-lg active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  <div className="w-full py-3 px-4 rounded-xl flex items-center justify-between gap-3 bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-cream-100 shrink-0">
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-sm text-cream-50 tracking-tight">
                        Proceed to Checkout
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-white/15 border border-white/15 font-bold font-mono text-xs sm:text-sm text-cream-50 tracking-tight">
                        {formatCurrency(subtotal)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-cream-100 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </div>
                  </div>
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-xs text-espresso-500 hover:text-terracotta-600 transition-colors py-1"
                  >
                    Clear Entire Tray
                  </button>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="text-xs text-espresso-800 hover:text-terracotta-600 font-semibold py-1 flex items-center gap-1"
                  >
                    <span>+ Add More Items</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
