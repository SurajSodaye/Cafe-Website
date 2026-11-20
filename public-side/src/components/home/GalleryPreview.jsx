import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, ArrowRight, Expand } from 'lucide-react';
import { useGallery } from '../../hooks/useGallery';
import { Lightbox } from '../ui/Lightbox';
import { Button } from '../ui/Button';
import { SVG_FALLBACK_IMAGE, PRIMARY_FALLBACK_IMAGE } from '../../utils/imageFallback';

export function GalleryPreview() {
  const { images, loading } = useGallery({ limit: 6 });
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  return (
    <section className="py-16 sm:py-20 bg-cream-50 border-t border-espresso-100/60">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-terracotta-600 mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Glimpses of Bloom</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-900 tracking-tight">
              Life in the Courtyard
            </h2>
            <p className="text-espresso-600 text-sm sm:text-base mt-2 max-w-lg">
              Botanical corners, pour-over streams, warm bakes, and peaceful mornings.
            </p>
          </div>

          <Button
            to="/gallery"
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            iconPosition="right"
            className="text-terracotta-600 hover:text-terracotta-700 hover:bg-terracotta-50 self-start sm:self-auto font-semibold"
          >
            View Full Gallery
          </Button>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-espresso-200/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* 6 Images Grid */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
            {images.slice(0, 6).map((img, idx) => (
              <div
                key={img.id}
                onClick={() => setSelectedPhotoIndex(idx)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-espresso-100 cursor-pointer shadow-warm-sm hover:shadow-warm-md border border-espresso-100"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedPhotoIndex(idx);
                  }
                }}
                aria-label={`Open image: ${img.title}`}
              >
                <img
                  src={img.thumbnailUrl || img.imageUrl || PRIMARY_FALLBACK_IMAGE}
                  alt={img.alt || img.title || 'Brew & Bloom Café'}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="600"
                  onError={(e) => {
                    if (e.currentTarget.src !== PRIMARY_FALLBACK_IMAGE && e.currentTarget.src !== SVG_FALLBACK_IMAGE) {
                      e.currentTarget.src = PRIMARY_FALLBACK_IMAGE;
                    } else if (e.currentTarget.src !== SVG_FALLBACK_IMAGE) {
                      e.currentTarget.src = SVG_FALLBACK_IMAGE;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/80 via-espresso-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-cream-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-terracotta-300">
                        {img.category}
                      </p>
                      <h4 className="font-serif text-sm font-medium line-clamp-1">
                        {img.title}
                      </h4>
                    </div>
                    <span className="p-1.5 rounded-full bg-white/20 backdrop-blur-xs text-white">
                      <Expand className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox for Preview */}
      <Lightbox
        images={images}
        selectedIndex={selectedPhotoIndex}
        onClose={() => setSelectedPhotoIndex(null)}
        onNavigate={(newIdx) => setSelectedPhotoIndex(newIdx)}
      />
    </section>
  );
}
