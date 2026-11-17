import React, { forwardRef } from "react";

export const Textarea = forwardRef(
  ({ label, error, helperText, rows = 3, className = "", id, required, ...props }, ref) => {
    const textareaId = id || props.name || "textarea-" + Math.random().toString(36).substring(2, 6);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1.5"
          >
            {label} {required && <span className="text-terracotta">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          required={required}
          className={`w-full bg-cream-light/60 border rounded-xl p-3 text-sm text-espresso placeholder-espresso/40 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta resize-y disabled:bg-cream-dark/30 disabled:cursor-not-allowed ${
            error
              ? "border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50/20"
              : "border-espresso/15"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-espresso/50">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
