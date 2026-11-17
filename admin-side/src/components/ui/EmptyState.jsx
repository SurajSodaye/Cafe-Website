import React from "react";
import { Coffee } from "lucide-react";
import { Button } from "./Button";

export const EmptyState = ({
  icon: Icon = Coffee,
  title = "No items found",
  description = "Get started by adding your first item or adjusting your filters.",
  actionLabel,
  onAction,
  className = ""
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-espresso/20 bg-cream-light/30 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-espresso/5 flex items-center justify-center text-espresso/40 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="font-serif text-lg font-bold text-espresso mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-espresso/60 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
