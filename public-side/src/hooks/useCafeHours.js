import { useMemo } from 'react';

/**
 * Hook to calculate whether the cafe is currently open or closed
 * based on schedule:
 * Mon-Fri: 8:00 AM – 11:00 PM (08:00 to 23:00)
 * Sat-Sun: 8:00 AM – 12:00 AM (08:00 to 24:00 midnight)
 */
export function useCafeHours(schedule = []) {
  return useMemo(() => {
    const now = new Date();
    const dayIndex = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Map schedule by dayIndex
    const scheduleByDay = {
      0: { name: "Sunday", openMins: 8 * 60, closeMins: 24 * 60, display: "8:00 AM – 12:00 AM" },
      1: { name: "Monday", openMins: 8 * 60, closeMins: 23 * 60, display: "8:00 AM – 11:00 PM" },
      2: { name: "Tuesday", openMins: 8 * 60, closeMins: 23 * 60, display: "8:00 AM – 11:00 PM" },
      3: { name: "Wednesday", openMins: 8 * 60, closeMins: 23 * 60, display: "8:00 AM – 11:00 PM" },
      4: { name: "Thursday", openMins: 8 * 60, closeMins: 23 * 60, display: "8:00 AM – 11:00 PM" },
      5: { name: "Friday", openMins: 8 * 60, closeMins: 23 * 60, display: "8:00 AM – 11:00 PM" },
      6: { name: "Saturday", openMins: 8 * 60, closeMins: 24 * 60, display: "8:00 AM – 12:00 AM" },
    };

    const todayRule = scheduleByDay[dayIndex];
    const isOpen = currentMinutes >= todayRule.openMins && currentMinutes < todayRule.closeMins;

    let subText = '';
    if (isOpen) {
      const closeDisplay = dayIndex === 0 || dayIndex === 6 ? 'Midnight (12:00 AM)' : '11:00 PM';
      subText = `Closes at ${closeDisplay}`;
    } else {
      if (currentMinutes < todayRule.openMins) {
        subText = 'Opens today at 8:00 AM';
      } else {
        const nextDayIndex = (dayIndex + 1) % 7;
        const nextDayName = scheduleByDay[nextDayIndex].name;
        subText = `Opens ${nextDayName} at 8:00 AM`;
      }
    }

    return {
      isOpen,
      statusText: isOpen ? 'Open Now' : 'Closed',
      subText,
      todaySchedule: todayRule.display,
      todayDayName: todayRule.name,
    };
  }, [schedule]);
}
