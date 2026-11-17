import { useState, useEffect, useCallback } from "react";
import { menuService } from "../services/menuService";
import { useToast } from "../context/ToastContext";

export const useMenuItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuService.getAll();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (itemData) => {
    try {
      const created = await menuService.create(itemData);
      setItems((prev) => [created, ...prev]);
      showToast(`Added "${created.name}" successfully!`, "success");
      return created;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const updateItem = async (id, updates) => {
    try {
      const updated = await menuService.update(id, updates);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      showToast(`Updated "${updated.name}" successfully!`, "success");
      return updated;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      const itemToDelete = items.find((i) => i.id === id);
      await menuService.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast(`Removed "${itemToDelete?.name || 'item'}" from menu.`, "info");
      return true;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const toggleAvailability = async (id) => {
    try {
      const item = items.find((i) => i.id === id);
      const updated = await menuService.toggleAvailability(id);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      const stateLabel = updated.available ? "available" : "sold out";
      showToast(`Marked "${item?.name}" as ${stateLabel}.`, "info");
      return updated;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const togglePopular = async (id) => {
    try {
      const item = items.find((i) => i.id === id);
      const updated = await menuService.togglePopular(id);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      const stateLabel = updated.isPopular ? "featured as popular" : "removed from popular";
      showToast(`"${item?.name}" ${stateLabel}.`, "info");
      return updated;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    toggleAvailability,
    togglePopular,
    refetch: fetchItems
  };
};
