import React from 'react';

export function Card({ children, className = '', hover = true, ...rest }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-espresso-100 shadow-warm-sm overflow-hidden transition-all duration-300 ${
        hover ? 'hover:shadow-warm-md hover:-translate-y-0.5' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-espresso-200/50 rounded-lg ${className}`}
      aria-hidden="true"
    />
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-espresso-100 p-4 flex flex-col sm:flex-row gap-4 shadow-warm-sm animate-pulse">
      <div className="w-full sm:w-32 h-44 sm:h-32 bg-espresso-200/50 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col justify-between py-1 space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-3">
            <div className="h-5 bg-espresso-200/60 rounded w-2/3" />
            <div className="h-5 bg-espresso-200/60 rounded w-16" />
          </div>
          <div className="h-3.5 bg-espresso-100 rounded w-full" />
          <div className="h-3.5 bg-espresso-100 rounded w-4/5" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <div className="h-4 w-4 bg-espresso-200/60 rounded-sm" />
          <div className="h-4 bg-espresso-100 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="aspect-square bg-espresso-200/50 rounded-2xl animate-pulse" />
  );
}
