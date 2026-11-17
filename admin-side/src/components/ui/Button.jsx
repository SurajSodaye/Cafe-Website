import React from "react";
import { Loader2 } from "lucide-react";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  className = "",
  leftIcon = null,
  rightIcon = null,
  type = "button",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5 min-h-[36px]",
    md: "px-4 py-2 text-sm rounded-xl gap-2 min-h-[44px]",
    lg: "px-6 py-3 text-base rounded-xl gap-2.5 min-h-[48px]"
  };

  const variantClasses = {
    primary:
      "bg-terracotta text-cream hover:bg-terracotta-dark active:bg-terracotta-dark focus:ring-terracotta shadow-sm hover:shadow",
    secondary:
      "bg-espresso text-cream hover:bg-espresso-dark active:bg-espresso-dark focus:ring-espresso shadow-sm",
    outline:
      "border border-espresso/20 text-espresso hover:bg-espresso/5 active:bg-espresso/10 focus:ring-espresso",
    ghost:
      "text-espresso hover:bg-espresso/5 active:bg-espresso/10 focus:ring-espresso",
    danger:
      "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm",
    dangerOutline:
      "border border-red-300 text-red-600 hover:bg-red-50 active:bg-red-100 focus:ring-red-500"
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};
