import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export const Select = forwardRef(
  ({ label, error, helperText, options = [], className = "", id, required, children, ...props }, ref) => {
    const selectId = id || props.name || "select-" + Math.random().toString(36).substring(2, 6);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1.5"
          >
            {label} {required && <span className="text-terracotta">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          <select
            ref={ref}
            id={selectId}
            required={required}
            className={`w-full bg-cream-light/60 border rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-espresso appearance-none transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta disabled:bg-cream-dark/30 disabled:cursor-not-allowed ${
              error
                ? "border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50/20"
                : "border-espresso/15"
            } ${className}`}
            {...props}
          >
            {options.length > 0
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-espresso/40">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-espresso/50">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
