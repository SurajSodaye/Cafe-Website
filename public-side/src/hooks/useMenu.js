import { useState, useEffect, useCallback } from 'react';
import { getCategories, getMenuItems, getPopularMenuItems } from '../services/menuService';

export function useMenu(initialCategory = 'all') {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [menuItems, setMenuItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState(null);

  // Load categories once
  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((cats) => {
        if (isMounted) {
          setCategories(cats);
          setCategoriesLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setCategoriesLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch items whenever filters change
  const fetchItems = useCallback(() => {
    let isMounted = true;
    setItemsLoading(true);
    setItemsError(null);

    getMenuItems({
      category: activeCategory,
      vegOnly: isVegOnly,
      searchQuery: searchQuery,
    })
      .then((items) => {
        if (isMounted) {
          setMenuItems(items);
          setItemsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setItemsError(err?.message || 'Could not load menu items');
          setItemsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory, isVegOnly, searchQuery]);

  useEffect(() => {
    const cleanup = fetchItems();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [fetchItems]);

  const resetFilters = useCallback(() => {
    setActiveCategory('all');
    setIsVegOnly(false);
    setSearchQuery('');
  }, []);

  return {
    categories,
    categoriesLoading,
    activeCategory,
    setActiveCategory,
    isVegOnly,
    setIsVegOnly,
    searchQuery,
    setSearchQuery,
    menuItems,
    itemsLoading,
    itemsError,
    resetFilters,
    refetch: fetchItems,
  };
}

export function usePopularItems(limit = 4) {
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getPopularMenuItems(limit)
      .then((items) => {
        if (isMounted) {
          setPopularItems(items);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Failed to load popular items');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { popularItems, loading, error };
}
