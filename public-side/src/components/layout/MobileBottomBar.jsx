import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Navigation, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export function MobileBottomBar({ cafeInfo }) {
  const { totalItems, openCart } = useCart();

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-50/95 backdrop-blur-lg border-t border-espresso-200/80 px-2 py-1.5 shadow-[0_-4px_16px_rgba(59,42,32,0.08)]"
      role="region"
      aria-label="Quick Actions"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-0.5">
        {/* Call */}
        <a
          href={`tel:${cafeInfo?.phoneRaw || '+919876543210'}`}
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-espresso-700 hover:text-espresso-900 active:bg-espresso-100/60 transition-colors"
          aria-label="Call Brew & Bloom Café"
        >
          <Phone className="w-4.5 h-4.5 text-espresso-600 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Call</span>
        </a>

        {/* WhatsApp */}
        <a
          href={cafeInfo?.whatsappUrl || 'https://wa.me/919876543210'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-espresso-700 hover:text-emerald-700 active:bg-emerald-50 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-4.5 h-4.5 text-emerald-600 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">WhatsApp</span>
        </a>

        {/* Directions */}
        <a
          href={cafeInfo?.googleMapsDirectionsUrl || 'https://maps.google.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-espresso-700 hover:text-terracotta-600 active:bg-terracotta-50 transition-colors"
          aria-label="Directions on Google Maps"
        >
          <Navigation className="w-4.5 h-4.5 text-terracotta-600 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Directions</span>
        </a>

        {/* Menu */}
        <Link
          to="/menu"
          className="flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl text-espresso-700 hover:text-espresso-900 active:bg-espresso-100/60 transition-colors"
          aria-label="Open Menu"
        >
          <UtensilsCrossed className="w-4.5 h-4.5 text-espresso-600 mb-0.5" />
          <span className="text-[10px] font-medium tracking-tight">Menu</span>
        </Link>

        {/* Tray / Cart */}
        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl bg-terracotta-500 text-white shadow-warm-sm active:bg-terracotta-600 transition-colors"
          aria-label={`Open order tray with ${totalItems} items`}
        >
          <div className="relative">
            <ShoppingBag className="w-4.5 h-4.5 mb-0.5 text-white" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-3.5 px-0.5 flex items-center justify-center rounded-full bg-espresso-900 text-white text-[9px] font-bold border border-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Tray</span>
        </button>
      </div>
    </div>
  );
}
