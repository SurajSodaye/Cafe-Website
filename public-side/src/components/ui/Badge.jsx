import React from 'react';

/**
 * Standard Indian Veg/Non-Veg symbol with high contrast & accessibility
 */
export function DietaryBadge({ isVeg, className = '' }) {
  if (isVeg) {
    return (
      <span
        className={`inline-flex items-center justify-center w-4 h-4 border-2 border-emerald-600 rounded-sm bg-white shrink-0 ${className}`}
        title="Vegetarian"
        role="img"
        aria-label="Vegetarian"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 border-2 border-amber-800 rounded-sm bg-white shrink-0 ${className}`}
      title="Non-Vegetarian"
      role="img"
      aria-label="Non-Vegetarian"
    >
      <span className="w-2 h-2 rounded-full bg-amber-800"></span>
    </span>
  );
}

export function PopularBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-terracotta-100 text-terracotta-700 border border-terracotta-200/60 shadow-xs ${className}`}
    >
      <span className="text-terracotta-600" aria-hidden="true">★</span> Popular
    </span>
  );
}

export function SoldOutBadge({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-espresso-800/90 text-cream-100 backdrop-blur-xs ${className}`}
    >
      Sold Out
    </span>
  );
}

export function CategoryPill({ children, active = false, onClick, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
        active
          ? 'bg-espresso-600 text-cream-50 shadow-warm-sm scale-[1.02]'
          : 'bg-white/80 hover:bg-white text-espresso-700 border border-espresso-200/60 hover:border-espresso-300'
      }`}
    >
      <span>{children}</span>
      {typeof count === 'number' && (
        <span
          className={`text-xs px-1.5 py-0.5 rounded-full ${
            active ? 'bg-espresso-700 text-cream-200' : 'bg-espresso-100 text-espresso-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
