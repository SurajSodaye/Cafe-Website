import { useState, useEffect, useCallback } from "react";
import { categoryService } from "../services/categoryService";
import { useToast } from "../context/ToastContext";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (catData) => {
    try {
      const created = await categoryService.create(catData);
      setCategories((prev) => [...prev, created]);
      showToast(`Category "${created.name}" created!`, "success");
      return created;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const updated = await categoryService.update(id, updates);
      setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      showToast(`Category "${updated.name}" updated!`, "success");
      return updated;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const cat = categories.find((c) => c.id === id);
      await categoryService.remove(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      showToast(`Category "${cat?.name || 'item'}" deleted.`, "info");
      return true;
    } catch (err) {
      // Deletion blocked error is caught and shown via toast
      showToast(err.message, "error", 5000);
      throw err;
    }
  };

  const moveCategory = async (id, direction) => {
    try {
      const updated = await categoryService.move(id, direction);
      setCategories(updated);
      return updated;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    moveCategory,
    refetch: fetchCategories
  };
};
