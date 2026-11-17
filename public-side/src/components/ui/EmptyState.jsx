import React from 'react';
import { Coffee, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  title = "No items match your selection",
  message = "Try clearing your search or switching to another category to view our delicious selections.",
  onReset,
}) {
  return (
    <div className="text-center py-16 px-4 bg-white/60 rounded-3xl border border-dashed border-espresso-200/80 max-w-lg mx-auto my-8">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream-200 flex items-center justify-center text-terracotta-600 shadow-inner">
        <Coffee className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="font-serif text-2xl font-semibold text-espresso-800 mb-2">
        {title}
      </h3>
      <p className="text-espresso-600 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
        {message}
      </p>
      {onReset && (
        <Button
          variant="outlineTerracotta"
          size="sm"
          onClick={onReset}
          icon={RotateCcw}
        >
          Reset Filters
        </Button>
      )}
    </div>
  );
}
