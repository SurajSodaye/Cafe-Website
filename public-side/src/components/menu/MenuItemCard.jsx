import React, { useState, useEffect } from 'react';
import { DietaryBadge, PopularBadge, SoldOutBadge } from '../ui/Badge';
import { Card } from '../ui/Skeleton';
import { SVG_FALLBACK_IMAGE, PRIMARY_FALLBACK_IMAGE } from '../../utils/imageFallback';

export function MenuItemCard({ item }) {
  const [imgSrc, setImgSrc] = useState(item.imageUrl || PRIMARY_FALLBACK_IMAGE);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(item.imageUrl || PRIMARY_FALLBACK_IMAGE);
    setHasError(false);
  }, [item.imageUrl]);

  const handleImageError = () => {
    if (imgSrc !== PRIMARY_FALLBACK_IMAGE && imgSrc !== SVG_FALLBACK_IMAGE) {
      // First attempt: try high quality photo fallback
      setImgSrc(PRIMARY_FALLBACK_IMAGE);
    } else if (imgSrc !== SVG_FALLBACK_IMAGE) {
      // Second attempt: guaranteed offline self-contained SVG fallback
      setImgSrc(SVG_FALLBACK_IMAGE);
    } else {
      // Even if SVG fails (never expected), flag as error so broken img icon is hidden
      setHasError(true);
    }
  };

  return (
    <Card
      className={`group flex flex-col justify-between h-full ${
        !item.available ? 'opacity-75' : ''
      }`}
    >
      <div>
        {/* Image Container with fixed ratio */}
        <div className="relative aspect-[16/10] overflow-hidden bg-cream-100">
          {!hasError ? (
            <img
              src={imgSrc}
              alt={item.name}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              width="600"
              height="375"
              onError={handleImageError}
              className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                item.available ? 'group-hover:scale-105' : 'grayscale-[20%]'
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-cream-200 text-espresso-700 p-4">
              <span className="font-serif text-sm font-semibold">{item.name}</span>
            </div>
          )}

          {/* Badges on Top */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <DietaryBadge isVeg={item.isVeg} />
            {item.isPopular && <PopularBadge />}
          </div>

          {/* Sold out overlay */}
          {!item.available && (
            <div className="absolute inset-0 bg-espresso-950/65 backdrop-blur-xs flex items-center justify-center p-3 z-10">
              <SoldOutBadge />
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-lg font-bold text-espresso-900 leading-snug group-hover:text-terracotta-600 transition-colors">
              {item.name}
            </h3>
            <span className="font-sans font-bold text-base text-espresso-900 shrink-0">
              ₹{item.price}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-espresso-600 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Subtle bottom note */}
      <div className="px-5 pb-5 pt-0 flex items-center justify-between text-[11px] text-espresso-400 border-t border-espresso-50 mt-2">
        <span className="capitalize">{(item.category || '').replace('-', ' ')}</span>
        <span>{item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
      </div>
    </Card>
  );
}
