import { useRef, useCallback, useEffect } from 'react';

/**
 * Reusable hook to detect consecutive rapid clicks.
 * If `clicks` count is met within `windowMs` milliseconds between each click,
 * `onTrigger` is called and default navigation is prevented on that final click.
 *
 * @param {Object} options
 * @param {number} [options.clicks=5] - Number of clicks required to trigger
 * @param {number} [options.windowMs=3000] - Window in milliseconds between clicks
 * @param {Function} options.onTrigger - Callback executed on the triggering click
 * @returns {Function} Click event handler
 */
export function useSecretClicks({ clicks = 5, windowMs = 3000, onTrigger } = {}) {
  const countRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleClick = useCallback(
    (event) => {
      // Allow standard keyboard activation (Enter key produces event.detail === 0)
      if (event && event.detail === 0) {
        return;
      }

      const now = Date.now();

      // Reset if too much time has passed since the previous click
      if (now - lastClickTimeRef.current > windowMs) {
        countRef.current = 0;
      }

      lastClickTimeRef.current = now;
      countRef.current += 1;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        countRef.current = 0;
      }, windowMs);

      // On reaching the required threshold
      if (countRef.current >= clicks) {
        if (event && typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        countRef.current = 0;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        if (typeof onTrigger === 'function') {
          onTrigger();
        }
      }
    },
    [clicks, windowMs, onTrigger]
  );

  return handleClick;
}
