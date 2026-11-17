import React from "react";
import { AlertTriangle, Trash2, Info } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false
}) => {
  const getIcon = () => {
    switch (variant) {
      case "danger":
        return (
          <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
        );
      case "warning":
        return (
          <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-11 h-11 rounded-full bg-cream-dark flex items-center justify-center text-espresso flex-shrink-0">
            <Info className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={false}>
      <div className="flex items-start gap-4 pt-2">
        {getIcon()}
        <div className="flex-1">
          <h4 className="font-serif text-lg font-bold text-espresso">{title}</h4>
          <p className="mt-2 text-sm text-espresso/70 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-espresso/10">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant={variant === "danger" ? "danger" : "primary"}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
};
