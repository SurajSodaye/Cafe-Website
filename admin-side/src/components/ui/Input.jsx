import React, { forwardRef } from "react";

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = "",
      id,
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name || "input-" + Math.random().toString(36).substring(2, 6);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-espresso/70 mb-1.5"
          >
            {label} {required && <span className="text-terracotta">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-espresso/40">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            className={`w-full bg-cream-light/60 border rounded-xl py-2.5 text-sm text-espresso placeholder-espresso/40 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta disabled:bg-cream-dark/30 disabled:cursor-not-allowed ${
              leftIcon ? "pl-10" : "pl-3.5"
            } ${rightIcon ? "pr-10" : "pr-3.5"} ${
              error
                ? "border-red-400 focus:ring-red-500 focus:border-red-500 bg-red-50/20"
                : "border-espresso/15"
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-espresso/40">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-xs text-espresso/50">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
