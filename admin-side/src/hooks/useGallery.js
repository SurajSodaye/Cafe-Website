import { useState, useEffect, useCallback } from "react";
import { galleryService } from "../services/galleryService";
import { useToast } from "../context/ToastContext";

export const useGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchPhotos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await galleryService.getAll();
      setPhotos(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const addPhoto = async (photoData) => {
    try {
      const created = await galleryService.create(photoData);
      setPhotos((prev) => [created, ...prev]);
      showToast("Photo added to gallery!", "success");
      return created;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const updatePhoto = async (id, updates) => {
    try {
      const updated = await galleryService.update(id, updates);
      setPhotos((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showToast("Photo details updated!", "success");
      return updated;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const deletePhoto = async (id) => {
    try {
      await galleryService.remove(id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      showToast("Photo removed from gallery.", "info");
      return true;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  return {
    photos,
    loading,
    error,
    addPhoto,
    updatePhoto,
    deletePhoto,
    refetch: fetchPhotos
  };
};
