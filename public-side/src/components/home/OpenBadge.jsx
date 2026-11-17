import React from 'react';
import { Clock } from 'lucide-react';
import { useCafeHours } from '../../hooks/useCafeHours';

export function OpenBadge({ schedule, className = '' }) {
  const { isOpen, statusText, subText, todaySchedule } = useCafeHours(schedule);

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md shadow-warm-sm border transition-all ${
        isOpen
          ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30'
          : 'bg-amber-500/10 text-amber-900 border-amber-500/30'
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <span className="relative flex h-2 w-2">
        {isOpen && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOpen ? 'bg-emerald-600' : 'bg-amber-600'
          }`}
        ></span>
      </span>

      <span className="font-bold tracking-wide uppercase text-[11px]">
        {statusText}
      </span>

      <span className="text-espresso-400 font-normal">|</span>

      <span className="font-medium text-espresso-700 hidden xs:inline">
        {subText}
      </span>
    </div>
  );
}
