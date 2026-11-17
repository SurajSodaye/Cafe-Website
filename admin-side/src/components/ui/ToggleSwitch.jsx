import React from "react";

export const ToggleSwitch = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  id
}) => {
  const switchId = id || "switch-" + Math.random().toString(36).substring(2, 6);

  return (
    <div className="flex items-center justify-between gap-3 select-none">
      {(label || description) && (
        <label htmlFor={switchId} className="cursor-pointer flex-1">
          {label && (
            <span className="block text-sm font-medium text-espresso">
              {label}
            </span>
          )}
          {description && (
            <span className="block text-xs text-espresso/60">
              {description}
            </span>
          )}
        </label>
      )}
      <button
        type="button"
        id={switchId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "bg-terracotta" : "bg-espresso/20"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-cream shadow-sm ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};
