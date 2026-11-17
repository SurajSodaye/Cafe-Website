import React, { useState } from 'react';
import { SEO } from '../components/layout/SEO';
import { Camera, Expand, Sparkles, Filter } from 'lucide-react';
import { useGallery } from '../hooks/useGallery';
import { Lightbox } from '../components/ui/Lightbox';
import { GallerySkeleton } from '../components/ui/Skeleton';
import { SVG_FALLBACK_IMAGE, PRIMARY_FALLBACK_IMAGE } from '../utils/imageFallback';

export default function GalleryPage() {
  const { images, loading, error } = useGallery();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = ['All', 'Ambience', 'Coffee Craft', 'Bakery', 'Kitchen', 'Community'];

  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter((img) => img.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <>
      <SEO
        title="Gallery — Courtyard Ambience, Coffee Art & Fresh Bakes"
        description="Browse the photo gallery of Brew & Bloom Café in Koregaon Park, Pune. Sunlit courtyard garden, single-origin espresso rituals, and fresh sourdough bakes."
      />

      {/* Hero Header */}
      <section className="bg-cream-100 pt-10 pb-8 border-b border-espresso-100">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-terracotta-600 mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>The Bloom Aesthetic</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-900 mb-2">
            A Glimpse Into Our Garden Sanctuary
          </h1>
          <p className="text-sm sm:text-base text-espresso-600 max-w-2xl leading-relaxed">
            Every corner is designed for stillness. Explore snapshots of our green veranda, single-origin pour-overs, and morning bakes.
          </p>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="py-8 sm:py-14 bg-cream-50 min-h-[70vh]">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-espresso-400 mr-2 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 ${
                  selectedCategory === cat
                    ? 'bg-espresso-800 text-cream-50 shadow-warm-sm scale-[1.02]'
                    : 'bg-white text-espresso-700 border border-espresso-200/80 hover:bg-cream-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Skeletons while loading */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <GallerySkeleton key={n} />
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="p-8 text-center bg-white rounded-2xl border border-espresso-200 max-w-md mx-auto">
              <p className="text-sm text-espresso-700">Unable to load photo gallery.</p>
            </div>
          )}

          {/* Images Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {filteredImages.map((image, idx) => (
                <div
                  key={image.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-espresso-100 cursor-pointer shadow-warm-sm hover:shadow-warm-md border border-espresso-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setLightboxIndex(idx);
                    }
                  }}
                  aria-label={`Open photo: ${image.title}`}
                >
                  <img
                    src={image.thumbnailUrl || image.imageUrl || PRIMARY_FALLBACK_IMAGE}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
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

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/85 via-espresso-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-cream-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta-300">
                          {image.category}
                        </span>
                        <h3 className="font-serif text-sm font-semibold text-cream-50 line-clamp-1">
                          {image.title}
                        </h3>
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
      </section>

      {/* Lightbox Modal */}
      <Lightbox
        images={filteredImages}
        selectedIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </>
  );
}
