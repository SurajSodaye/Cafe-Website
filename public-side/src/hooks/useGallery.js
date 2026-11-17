import { useState, useEffect } from 'react';
import { getGalleryImages } from '../services/galleryService';

export function useGallery({ featuredOnly = false, limit } = {}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getGalleryImages({ featuredOnly, limit })
      .then((data) => {
        if (isMounted) {
          setImages(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Failed to load gallery images');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [featuredOnly, limit]);

  return { images, loading, error };
}
