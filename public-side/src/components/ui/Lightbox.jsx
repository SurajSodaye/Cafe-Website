import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SVG_FALLBACK_IMAGE, PRIMARY_FALLBACK_IMAGE } from '../../utils/imageFallback';

export function Lightbox({ images = [], selectedIndex = null, onClose, onNavigate }) {
  const isOpen = selectedIndex !== null && images.length > 0;
  const currentImage = isOpen ? images[selectedIndex] : null;

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate((selectedIndex - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        onNavigate((selectedIndex + 1) % images.length);
      }
    },
    [isOpen, selectedIndex, images.length, onClose, onNavigate]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-espresso-950/90 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="Image Lightbox Preview"
      >
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

        {/* Top bar with count & close button */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-cream-100 z-10 pointer-events-none">
          <span className="text-sm font-medium tracking-wide bg-espresso-900/80 px-3 py-1.5 rounded-full pointer-events-auto backdrop-blur-xs">
            {selectedIndex + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-espresso-900/80 hover:bg-espresso-800 text-cream-100 transition-colors pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400"
            aria-label="Close image viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Left Navigation */}
        <button
          type="button"
          onClick={() => onNavigate((selectedIndex - 1 + images.length) % images.length)}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-espresso-900/70 hover:bg-espresso-800 text-cream-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Navigation */}
        <button
          type="button"
          onClick={() => onNavigate((selectedIndex + 1) % images.length)}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-espresso-900/70 hover:bg-espresso-800 text-cream-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Main Content */}
        <motion.div
          key={currentImage.id || selectedIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-4xl max-h-[85vh] flex flex-col items-center z-10 pointer-events-auto"
        >
          <img
            src={currentImage.imageUrl || currentImage.thumbnailUrl || PRIMARY_FALLBACK_IMAGE}
            alt={currentImage.alt || currentImage.caption || currentImage.title || 'Brew & Bloom Café'}
            decoding="async"
            onError={(e) => {
              if (currentImage.thumbnailUrl && e.currentTarget.src !== currentImage.thumbnailUrl) {
                e.currentTarget.src = currentImage.thumbnailUrl;
              } else if (e.currentTarget.src !== PRIMARY_FALLBACK_IMAGE && e.currentTarget.src !== SVG_FALLBACK_IMAGE) {
                e.currentTarget.src = PRIMARY_FALLBACK_IMAGE;
              } else {
                e.currentTarget.src = SVG_FALLBACK_IMAGE;
              }
            }}
            className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
          />
          <div className="mt-4 text-center text-cream-100 px-4">
            <h4 className="font-serif text-lg sm:text-xl font-semibold">
              {currentImage.title || currentImage.caption || 'Café Moment'}
            </h4>
            <p className="text-xs sm:text-sm text-cream-200/80 mt-1 max-w-lg mx-auto">
              {currentImage.alt || currentImage.caption || currentImage.title}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
