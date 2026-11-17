import { useState, useEffect, useCallback } from "react";
import { settingsService } from "../services/settingsService";
import { useToast } from "../context/ToastContext";

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getSettings();
      setSettings(data);
      const exists = await settingsService.checkHasExistingData();
      setHasExistingData(exists);
    } catch (err) {
      console.error(err);
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (updates) => {
    try {
      setSaving(true);
      const saved = await settingsService.updateSettings(updates);
      setSettings(saved);
      showToast("Cafe settings saved successfully!", "success");
      return saved;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const importDemoData = async () => {
    try {
      setImporting(true);
      await settingsService.importDemoData();
      await fetchSettings();
      setHasExistingData(true);
      showToast("Demo data successfully imported to Firestore!", "success");
      return true;
    } catch (err) {
      showToast(err.message || "Failed to import demo data.", "error");
      throw err;
    } finally {
      setImporting(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    importing,
    hasExistingData,
    error,
    saveSettings,
    importDemoData,
    refetch: fetchSettings
  };
};
