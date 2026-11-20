import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Plus } from 'lucide-react';
import { usePopularItems } from '../../hooks/useMenu';
import { DietaryBadge, PopularBadge, SoldOutBadge } from '../ui/Badge';
import { Card, MenuItemSkeleton } from '../ui/Skeleton';
import { Button } from '../ui/Button';
import { ItemDetailModal } from '../menu/ItemDetailModal';
import { SVG_FALLBACK_IMAGE, PRIMARY_FALLBACK_IMAGE } from '../../utils/imageFallback';

export function PopularSection() {
  const { popularItems, loading, error } = usePopularItems(4);
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <section className="py-16 sm:py-20 bg-cream-50 border-y border-espresso-100/60">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-terracotta-600 mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Crowd Favorites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900 tracking-tight">
              Most Loved at Bloom
            </h2>
            <p className="text-espresso-600 text-sm sm:text-base mt-2 max-w-xl">
              Hand-picked by our baristas and treasured by our regulars. Sourced with integrity, prepared with passion.
            </p>
          </div>

          <Button
            to="/menu"
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            className="text-terracotta-600 hover:text-terracotta-700 hover:bg-terracotta-50 self-start sm:self-auto font-semibold"
          >
            Explore Complete Menu
          </Button>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 space-y-3 animate-pulse border border-espresso-100">
                <div className="aspect-[4/3] bg-espresso-200/50 rounded-xl" />
                <div className="h-5 bg-espresso-200/60 rounded w-3/4" />
                <div className="h-4 bg-espresso-100 rounded w-full" />
                <div className="h-5 bg-espresso-200/40 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-6 text-center bg-white rounded-2xl border border-espresso-200 text-espresso-700">
            <p className="text-sm">Unable to load favorites right now.</p>
          </div>
        )}

        {/* Grid of 4 Popular Items */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularItems.map((item) => (
              <Card
                key={item.id}
                className="group flex flex-col justify-between hover:border-terracotta-300 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-espresso-100">
                    <img
                      src={item.imageUrl || PRIMARY_FALLBACK_IMAGE}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      width="500"
                      height="375"
                      onError={(e) => {
                        if (e.currentTarget.src !== PRIMARY_FALLBACK_IMAGE && e.currentTarget.src !== SVG_FALLBACK_IMAGE) {
                          e.currentTarget.src = PRIMARY_FALLBACK_IMAGE;
                        } else if (e.currentTarget.src !== SVG_FALLBACK_IMAGE) {
                          e.currentTarget.src = SVG_FALLBACK_IMAGE;
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <DietaryBadge isVeg={item.isVeg} />
                      <PopularBadge />
                    </div>

                    {!item.available && (
                      <div className="absolute inset-0 bg-espresso-950/60 backdrop-blur-xs flex items-center justify-center">
                        <SoldOutBadge />
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-serif text-lg font-semibold text-espresso-900 group-hover:text-terracotta-600 transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <span className="font-sans font-bold text-base text-espresso-900 whitespace-nowrap">
                        ₹{item.price}
                      </span>
                    </div>

                    <p className="text-xs text-espresso-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-5 pb-5 pt-0 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(item);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      item.available
                        ? 'bg-cream-100 hover:bg-terracotta-500 text-espresso-800 hover:text-white border border-espresso-200/80 hover:border-terracotta-500'
                        : 'bg-espresso-100 text-espresso-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{item.available ? 'Add to Tray' : 'Sold Out'}</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Item Customizer Modal */}
      <ItemDetailModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}
