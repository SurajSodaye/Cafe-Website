import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Navigation, UtensilsCrossed } from 'lucide-react';

export function MobileBottomBar({ cafeInfo }) {
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-50/95 backdrop-blur-lg border-t border-espresso-200/80 px-3 py-2 shadow-[0_-4px_16px_rgba(59,42,32,0.08)]"
      role="region"
      aria-label="Quick Actions"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {/* Call */}
        <a
          href={`tel:${cafeInfo?.phoneRaw || '+919876543210'}`}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-espresso-700 hover:text-espresso-900 active:bg-espresso-100/60 transition-colors"
          aria-label="Call Brew & Bloom Café"
        >
          <Phone className="w-5 h-5 text-espresso-600 mb-1" />
          <span className="text-[11px] font-medium tracking-tight">Call</span>
        </a>

        {/* WhatsApp */}
        <a
          href={cafeInfo?.whatsappUrl || 'https://wa.me/919876543210'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-espresso-700 hover:text-emerald-700 active:bg-emerald-50 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 text-emerald-600 mb-1" />
          <span className="text-[11px] font-medium tracking-tight">WhatsApp</span>
        </a>

        {/* Directions */}
        <a
          href={cafeInfo?.googleMapsDirectionsUrl || 'https://maps.google.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-espresso-700 hover:text-terracotta-600 active:bg-terracotta-50 transition-colors"
          aria-label="Directions on Google Maps"
        >
          <Navigation className="w-5 h-5 text-terracotta-600 mb-1" />
          <span className="text-[11px] font-medium tracking-tight">Directions</span>
        </a>

        {/* Menu */}
        <Link
          to="/menu"
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-terracotta-500 text-white shadow-warm-sm active:bg-terracotta-600 transition-colors"
          aria-label="Open Menu"
        >
          <UtensilsCrossed className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-semibold tracking-tight">Menu</span>
        </Link>
      </div>
    </div>
  );
}
