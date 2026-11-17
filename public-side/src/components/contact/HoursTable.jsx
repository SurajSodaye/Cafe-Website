import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { useCafeHours } from '../../hooks/useCafeHours';

export function HoursTable({ weeklySchedule = [] }) {
  const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday ...
  const { isOpen, statusText } = useCafeHours(weeklySchedule);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-espresso-100 shadow-warm-sm">
      <div className="flex items-center justify-between pb-4 border-b border-espresso-100 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-terracotta-500" />
          <h3 className="font-serif text-xl font-bold text-espresso-900">
            Weekly Hours
          </h3>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {statusText}
        </span>
      </div>

      <div className="divide-y divide-espresso-50">
        {weeklySchedule.map((item) => {
          const isToday = item.dayIndex === currentDayIndex;

          return (
            <div
              key={item.day}
              className={`py-3 px-3 rounded-xl flex items-center justify-between text-sm transition-colors ${
                isToday
                  ? 'bg-cream-100 font-semibold text-espresso-900 shadow-xs'
                  : 'text-espresso-700 hover:bg-cream-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{item.day}</span>
                {isToday && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-terracotta-500 text-white px-2 py-0.5 rounded-full">
                    Today
                  </span>
                )}
              </div>
              <span className={isToday ? 'text-terracotta-600 font-bold' : 'text-espresso-600'}>
                {item.display}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-espresso-500 mt-4 pt-3 border-t border-espresso-100 text-center">
        Kitchen closes 45 minutes before closing time.
      </p>
    </div>
  );
}
