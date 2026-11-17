import React from 'react';
import { Search, X, Check } from 'lucide-react';
import { DietaryBadge } from '../ui/Badge';

export function FilterBar({
  searchQuery,
  onSearchChange,
  isVegOnly,
  onToggleVeg,
  totalItems,
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-espresso-100 shadow-warm-sm mb-8">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <label htmlFor="menu-search" className="sr-only">
            Search menu items
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-espresso-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="menu-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search espresso, tea, sourdough, cheesecake..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-cream-50/70 border border-espresso-200/80 text-sm text-espresso-800 placeholder-espresso-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-espresso-400 hover:text-espresso-700"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Veg-Only Toggle & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          {/* Veg Only Toggle */}
          <label
            htmlFor="veg-toggle"
            className="flex items-center gap-2.5 cursor-pointer select-none text-xs sm:text-sm font-medium text-espresso-800"
          >
            <DietaryBadge isVeg={true} />
            <span>Veg Only</span>
            <div className="relative inline-flex items-center">
              <input
                id="veg-toggle"
                type="checkbox"
                checked={isVegOnly}
                onChange={(e) => onToggleVeg(e.target.checked)}
                className="sr-only"
                role="switch"
                aria-checked={isVegOnly}
              />
              <div
                className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                  isVegOnly ? 'bg-emerald-600' : 'bg-espresso-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out mt-0.5 ml-0.5 flex items-center justify-center ${
                    isVegOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  {isVegOnly && <Check className="w-3 h-3 text-emerald-700" strokeWidth={3} />}
                </div>
              </div>
            </div>
          </label>

          {/* Item Count */}
          <span className="text-xs font-semibold px-2.5 py-1 bg-espresso-100/80 text-espresso-700 rounded-lg whitespace-nowrap">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>
    </div>
  );
}
