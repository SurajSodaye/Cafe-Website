import React from "react";
import { Sparkles } from "lucide-react";

export const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = ""
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm"
  };

  const variantClasses = {
    default: "bg-cream-dark/60 text-espresso border border-espresso/10",
    primary: "bg-terracotta/10 text-terracotta border border-terracotta/20",
    secondary: "bg-espresso text-cream",
    success: "bg-sage-dark/15 text-sage-dark border border-sage-dark/25",
    warning: "bg-amber-100 text-amber-800 border border-amber-300",
    danger: "bg-red-100 text-red-700 border border-red-200",
    popular: "bg-terracotta text-cream shadow-sm"
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-sans font-medium rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {variant === "popular" && <Sparkles className="w-3 h-3 flex-shrink-0" />}
      {children}
    </span>
  );
};

export const VegIndicator = ({ isVeg, showText = false, size = "md" }) => {
  const boxSizes = size === "sm" ? "w-3.5 h-3.5 p-0.5" : "w-4 h-4 p-0.5";
  const dotSizes = size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2";

  return (
    <span
      className="inline-flex items-center gap-1.5"
      title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
    >
      <span
        className={`inline-flex items-center justify-center border rounded-sm ${boxSizes} ${
          isVeg ? "border-emerald-600" : "border-red-600"
        }`}
      >
        <span
          className={`rounded-full ${dotSizes} ${
            isVeg ? "bg-emerald-600" : "bg-red-600"
          }`}
        />
      </span>
      {showText && (
        <span
          className={`text-xs font-medium ${
            isVeg ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {isVeg ? "Veg" : "Non-Veg"}
        </span>
      )}
    </span>
  );
};
