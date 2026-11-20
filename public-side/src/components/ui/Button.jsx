import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable accessible Button / Link component
 */
export function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  ariaLabel,
  ...rest
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-warm-sm hover:shadow-warm-md focus-visible:ring-terracotta-600',
    secondary:
      'bg-espresso-800 hover:bg-espresso-900 text-cream-100 shadow-warm-sm focus-visible:ring-espresso-800',
    espresso:
      'bg-espresso-900 hover:bg-espresso-950 text-cream-50 shadow-warm-sm hover:shadow-warm-md focus-visible:ring-espresso-800',
    sage:
      'bg-sage-200 hover:bg-sage-300 text-espresso-800 focus-visible:ring-sage-500',
    outline:
      'border-2 border-espresso-600 text-espresso-700 hover:bg-espresso-600 hover:text-cream-50 focus-visible:ring-espresso-600',
    outlineTerracotta:
      'border-2 border-terracotta-500 text-terracotta-600 hover:bg-terracotta-500 hover:text-white focus-visible:ring-terracotta-500',
    ghost:
      'text-espresso-700 hover:bg-espresso-100/60 focus-visible:ring-espresso-400',
    none: ''
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
    none: ''
  };

  const variantClass = variant === 'none' ? '' : (variants[variant] || variants.primary);
  const sizeClass = size === 'none' ? '' : (sizes[size] || sizes.md);
  const combinedClasses = `${baseStyles} ${variantClass} ${sizeClass} ${className}`.trim();

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
      {typeof children === 'string' ? <span>{children}</span> : children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} aria-label={ariaLabel} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={combinedClasses}
        aria-label={ariaLabel}
        target={rest.target || '_blank'}
        rel={rest.rel || 'noopener noreferrer'}
        {...rest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      aria-label={ariaLabel}
      {...rest}
    >
      {content}
    </button>
  );
}
