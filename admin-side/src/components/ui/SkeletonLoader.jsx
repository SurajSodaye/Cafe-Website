import React from "react";

export const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-espresso/10 rounded-lg ${className}`}
    />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="w-full space-y-3">
      <div className="h-10 bg-espresso/10 rounded-xl w-full animate-pulse" />
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div
          key={rIdx}
          className="flex items-center gap-4 p-4 rounded-xl border border-espresso/10 bg-white/50 animate-pulse"
        >
          <div className="w-12 h-12 rounded-lg bg-espresso/10 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-espresso/10 rounded w-1/3" />
            <div className="h-3 bg-espresso/10 rounded w-1/2" />
          </div>
          <div className="h-6 w-16 bg-espresso/10 rounded-full" />
          <div className="h-4 w-12 bg-espresso/10 rounded" />
          <div className="h-8 w-16 bg-espresso/10 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl border border-espresso/10 bg-white/60 animate-pulse space-y-3"
        >
          <div className="w-10 h-10 rounded-xl bg-espresso/10" />
          <div className="h-6 w-20 bg-espresso/10 rounded" />
          <div className="h-4 w-28 bg-espresso/10 rounded" />
        </div>
      ))}
    </div>
  );
};
