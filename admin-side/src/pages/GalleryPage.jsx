import React, { useState } from "react";
import { Plus, Edit2, Trash2, Sparkles, Image as ImageIcon } from "lucide-react";
import { useGallery } from "../hooks/useGallery";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { ToggleSwitch } from "../components/ui/ToggleSwitch";
import { Modal } from "../components/ui/Modal";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { CardSkeleton } from "../components/ui/SkeletonLoader";

const GALLERY_CATEGORIES = [
  "Ambience",
  "Coffee Craft",
  "Bakery",
  "Kitchen",
  "Community"
];

export const GalleryPage = () => {
  const { photos, loading, addPhoto, updatePhoto, deletePhoto } = useGallery();

  // Modal form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [formValues, setFormValues] = useState({
    caption: "",
    category: "Ambience",
    imageUrl: "",
    featured: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openAddModal = () => {
    setEditingPhoto(null);
    setFormValues({
      caption: "",
      category: "Ambience",
      imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
      featured: false
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const openEditModal = (photo) => {
    setEditingPhoto(photo);
    setFormValues({
      caption: photo.caption || photo.title || "",
      category: photo.category || "Ambience",
      imageUrl: photo.imageUrl || "",
      featured: Boolean(photo.featured)
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formValues.caption.trim()) {
      errs.caption = "Caption or title is required";
    }
    if (!formValues.imageUrl.trim()) {
      errs.imageUrl = "Image URL is required";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      if (editingPhoto) {
        await updatePhoto(editingPhoto.id, formValues);
      } else {
        await addPhoto(formValues);
      }
      setIsFormOpen(false);
    } catch (err) {
      // Toast handles error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await deletePhoto(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      // Toast handles error
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso tracking-tight">
              Photo Gallery
            </h1>
            <Badge variant="default" size="sm">
              {photos.length} Photos
            </Badge>
          </div>
          <p className="text-sm text-espresso/60 mt-1">
            Curate cafe ambience, barista pours, bakery highlights, and communal moments.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={openAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Photo
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : photos.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No gallery photos yet"
          description="Upload your first cafe photo to showcase the warm vibe of Brew & Bloom."
          actionLabel="Add Photo"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white/90 rounded-2xl border border-espresso/10 shadow-warm overflow-hidden flex flex-col group"
            >
              {/* Photo Image Container */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-espresso/5">
                <img
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.alt || photo.caption}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80";
                  }}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {photo.featured && (
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="popular" size="sm">
                      Featured
                    </Badge>
                  </div>
                )}
                <div className="absolute top-2.5 right-2.5">
                  <Badge variant="secondary" size="sm">
                    {photo.category}
                  </Badge>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-sm text-espresso line-clamp-2">
                    {photo.caption || photo.title}
                  </h3>
                </div>

                <div className="pt-3 mt-3 border-t border-espresso/10 flex items-center justify-between">
                  <span className="text-[11px] text-espresso/50">
                    ID: {photo.id}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(photo)}
                      className="p-1.5 rounded-lg text-espresso/70 hover:text-espresso hover:bg-espresso/10 transition-colors"
                      title="Edit photo"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(photo)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Photo Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingPhoto ? "Edit Photo" : "Add Photo to Gallery"}
        subtitle="Provide image URL, category, and descriptive caption."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Caption / Title"
            value={formValues.caption}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, caption: e.target.value }))
            }
            placeholder="e.g. Pour-over drip ritual"
            error={formErrors.caption}
            required
          />

          <Select
            label="Category"
            value={formValues.category}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            {GALLERY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>

          {/* Image URL & Live Preview */}
          {/*
            TODO (Storage Phase): When Firebase Storage is enabled:
            1. Initialize storage via getStorage(app) in src/lib/firebase.js
            2. Add an optional <input type="file" accept="image/*" /> field below
            3. Upload photo to ref(storage, `gallery/${Date.now()}_${file.name}`) via uploadBytes
            4. Obtain download URL with getDownloadURL() and set formValues.imageUrl
          */}
          <div className="space-y-2">
            <Input
              label="Image URL"
              value={formValues.imageUrl}
              onChange={(e) =>
                setFormValues((prev) => ({ ...prev, imageUrl: e.target.value }))
              }
              placeholder="https://images.unsplash.com/..."
              error={formErrors.imageUrl}
              required
            />
            {formValues.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-espresso/10 aspect-video max-h-48 bg-espresso/5">
                <img
                  src={formValues.imageUrl}
                  alt="Live preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <ToggleSwitch
              label="Featured on Homepage"
              description="Show in the 6-image preview grid on the homepage"
              checked={formValues.featured}
              onChange={(val) =>
                setFormValues((prev) => ({ ...prev, featured: val }))
              }
            />
          </div>

          <div className="pt-4 border-t border-espresso/10 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFormOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              {editingPhoto ? "Save Changes" : "Add to Gallery"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Photo"
        message={`Are you sure you want to remove "${deleteTarget?.caption || deleteTarget?.title}" from the gallery?`}
        confirmLabel="Remove Photo"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
