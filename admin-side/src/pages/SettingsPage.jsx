import React, { useState, useEffect } from "react";
import {
  Save,
  UploadCloud,
  Database,
  Building,
  Phone,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useSettings } from "../hooks/useSettings";
import { initialCafeInfo } from "../data/cafeInfo";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { CardSkeleton } from "../components/ui/SkeletonLoader";

export const SettingsPage = () => {
  const {
    settings,
    loading,
    saving,
    importing,
    hasExistingData,
    saveSettings,
    importDemoData
  } = useSettings();

  const [formData, setFormData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Sync settings when loaded
  useEffect(() => {
    if (settings) {
      setFormData(JSON.parse(JSON.stringify(settings)));
      setIsDirty(false);
    } else if (!loading && !settings) {
      // If Firestore is empty, initialize template so form is usable
      setFormData(JSON.parse(JSON.stringify(initialCafeInfo)));
      setIsDirty(false);
    }
  }, [settings, loading]);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
  };

  const handleStoryChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      story: {
        ...(prev?.story || {}),
        [field]: value
      }
    }));
    setIsDirty(true);
  };

  const handleScheduleChange = (dayIndex, field, value) => {
    setFormData((prev) => {
      const schedule = [...(prev?.weeklySchedule || [])];
      schedule[dayIndex] = {
        ...schedule[dayIndex],
        [field]: value
      };
      return {
        ...prev,
        weeklySchedule: schedule
      };
    });
    setIsDirty(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData) return;

    try {
      await saveSettings(formData);
      setIsDirty(false);
    } catch (err) {
      // Toast handles error display
    }
  };

  const handleDiscard = () => {
    if (settings) {
      setFormData(JSON.parse(JSON.stringify(settings)));
    } else {
      setFormData(JSON.parse(JSON.stringify(initialCafeInfo)));
    }
    setIsDirty(false);
  };

  const handleImportConfirm = async () => {
    try {
      await importDemoData();
      setShowImportDialog(false);
      setIsDirty(false);
    } catch (err) {
      // Toast handles error
    }
  };

  if (loading || !formData) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-espresso/10 rounded-xl w-1/3 animate-pulse" />
        <CardSkeleton count={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-espresso/10">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso tracking-tight">
            Cafe Settings
          </h1>
          <p className="text-sm text-espresso/60 mt-1">
            Update cafe profile information, location details, social accounts, and operating hours in Firestore.
          </p>
        </div>

        {/* Top Save Controls */}
        <div className="flex items-center gap-3">
          {isDirty && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDiscard}
              disabled={saving}
            >
              Discard
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={saving}
            disabled={!isDirty}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Settings
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: Basic Information */}
        <div className="bg-white/90 p-5 sm:p-7 rounded-2xl border border-espresso/10 shadow-warm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-espresso/10">
            <Building className="w-5 h-5 text-terracotta" />
            <h2 className="font-serif text-lg font-bold text-espresso">
              General Cafe Profile
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Cafe Brand Name"
              value={formData.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              required
            />
            <Input
              label="Tagline"
              value={formData.tagline || ""}
              onChange={(e) => handleFieldChange("tagline", e.target.value)}
              placeholder="e.g. Slow coffee. Good company."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="City"
              value={formData.city || ""}
              onChange={(e) => handleFieldChange("city", e.target.value)}
            />
            <Input
              label="State / Region"
              value={formData.state || ""}
              onChange={(e) => handleFieldChange("state", e.target.value)}
            />
            <Input
              label="Country"
              value={formData.country || ""}
              onChange={(e) => handleFieldChange("country", e.target.value)}
            />
          </div>

          <Textarea
            label="About Teaser / Story Summary"
            rows={3}
            value={formData.story?.summary || ""}
            onChange={(e) => handleStoryChange("summary", e.target.value)}
            helperText="Short narrative presented on the homepage teaser and about page."
          />
        </div>

        {/* SECTION 2: Contact, Location & Social */}
        <div className="bg-white/90 p-5 sm:p-7 rounded-2xl border border-espresso/10 shadow-warm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-espresso/10">
            <Phone className="w-5 h-5 text-terracotta" />
            <h2 className="font-serif text-lg font-bold text-espresso">
              Contact & Social Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Street Address"
              value={formData.address || ""}
              onChange={(e) => handleFieldChange("address", e.target.value)}
              required
            />
            <Input
              label="Landmark"
              value={formData.landmark || ""}
              onChange={(e) => handleFieldChange("landmark", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Phone Number"
              value={formData.phone || ""}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              required
            />
            <Input
              label="WhatsApp Number"
              value={formData.whatsapp || ""}
              onChange={(e) => handleFieldChange("whatsapp", e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email || ""}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              required
            />
            <Input
              label="Instagram Handle"
              value={formData.instagram || ""}
              onChange={(e) => handleFieldChange("instagram", e.target.value)}
              placeholder="@brewandbloom"
            />
          </div>

          <Input
            label="Google Maps Embed URL (Iframe src)"
            value={formData.googleMapsEmbedUrl || ""}
            onChange={(e) => handleFieldChange("googleMapsEmbedUrl", e.target.value)}
            helperText="Iframe source link for Google Maps embed widget on the contact page."
          />
        </div>

        {/* SECTION 3: Operating Hours */}
        <div id="hours" className="bg-white/90 p-5 sm:p-7 rounded-2xl border border-espresso/10 shadow-warm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-espresso/10">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-terracotta" />
              <div>
                <h2 className="font-serif text-lg font-bold text-espresso">
                  Operating Hours
                </h2>
                <p className="text-xs text-espresso/60">
                  Configure daily opening and closing hours. Used for the real-time "Open now / Closed" badge.
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-espresso/10 border border-espresso/10 rounded-xl overflow-hidden bg-cream-light/30">
            {formData.weeklySchedule?.map((schedule, idx) => (
              <div
                key={schedule.day}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/50 transition-colors"
              >
                {/* Day name */}
                <div className="w-32">
                  <span className="font-semibold text-sm text-espresso">
                    {schedule.day}
                  </span>
                </div>

                {/* Times or Closed State */}
                <div className="flex-1 flex items-center gap-3">
                  {!schedule.isClosed ? (
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-espresso/50 block mb-0.5">
                          Opens
                        </span>
                        <input
                          type="time"
                          value={schedule.openTime || "08:00"}
                          onChange={(e) =>
                            handleScheduleChange(idx, "openTime", e.target.value)
                          }
                          className="bg-white border border-espresso/20 rounded-lg px-2.5 py-1.5 text-xs text-espresso font-mono focus:ring-1 focus:ring-terracotta"
                        />
                      </div>
                      <span className="text-espresso/40 pt-4">—</span>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-espresso/50 block mb-0.5">
                          Closes
                        </span>
                        <input
                          type="time"
                          value={schedule.closeTime || "23:00"}
                          onChange={(e) =>
                            handleScheduleChange(idx, "closeTime", e.target.value)
                          }
                          className="bg-white border border-espresso/20 rounded-lg px-2.5 py-1.5 text-xs text-espresso font-mono focus:ring-1 focus:ring-terracotta"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                      Closed all day
                    </span>
                  )}
                </div>

                {/* Closed toggle */}
                <div className="sm:text-right">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-espresso/70">
                    <input
                      type="checkbox"
                      checked={Boolean(schedule.isClosed)}
                      onChange={(e) =>
                        handleScheduleChange(idx, "isClosed", e.target.checked)
                      }
                      className="rounded text-terracotta focus:ring-terracotta"
                    />
                    <span>Mark as Closed</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: Database Seeding / Import Demo Data */}
        <div className="p-5 sm:p-7 rounded-2xl border border-espresso/15 bg-white/90 shadow-warm space-y-4">
          <div className="flex items-center gap-2 text-espresso">
            <Database className="w-5 h-5 text-terracotta" />
            <h3 className="font-serif text-lg font-bold">
              Database Seeding: Import Demo Data
            </h3>
          </div>
          <p className="text-xs text-espresso/70 leading-relaxed max-w-2xl">
            Populate your Cloud Firestore database with the complete initial menu catalog, category hierarchy, photo gallery, and cafe schedule. Uses atomic batched writes preserving standard IDs.
          </p>

          {hasExistingData ? (
            <div className="p-3.5 rounded-xl bg-cream-light border border-espresso/10 flex items-start gap-3 max-w-2xl">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-espresso/80">
                <span className="font-semibold block text-espresso">
                  Firestore Contains Active Data
                </span>
                Your database already holds collections. To prevent accidental overwrites of live items, the initial demo import button is disabled.
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={() => setShowImportDialog(true)}
                isLoading={importing}
                leftIcon={<UploadCloud className="w-4 h-4" />}
              >
                Import Demo Data to Firestore
              </Button>
            </div>
          )}
        </div>
      </form>

      {/* Floating Sticky Save Bar (shown when dirty) */}
      {isDirty && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 z-40 bg-espresso text-cream px-5 py-3.5 rounded-2xl shadow-warm-lg flex items-center justify-between gap-4 animate-slide-up border border-espresso-light">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>You have unsaved changes in settings.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDiscard}
              className="text-cream hover:bg-white/10"
              disabled={saving}
            >
              Discard
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              isLoading={saving}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Save Now
            </Button>
          </div>
        </div>
      )}

      {/* Import Demo Data Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onConfirm={handleImportConfirm}
        title="Import Demo Data to Firestore"
        message="This will write all initial categories, menu items, gallery photos, and cafe settings to Firestore using a batched write, preserving existing IDs. This will overwrite any existing items with the same IDs. Proceed?"
        confirmLabel="Import Demo Data"
        variant="primary"
        isLoading={importing}
      />
    </div>
  );
};
