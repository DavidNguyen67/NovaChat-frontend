/* eslint-disable prettier/prettier */
import { useRef, useEffect } from 'react';

/**
 *
 * @param callback call back function
 * @param delay delay
 * @returns
 * @description hook
 */
export const useDebounceCallBack = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
  throttle: boolean = false,
  needDelay?: boolean,
) => {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const lastCallTime = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);
  const callFunction = (...args: Parameters<T>) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    if (throttle) {
      const now = new Date().getTime();

      if (
        (!lastCallTime.current || now - lastCallTime.current >= delay) &&
        !needDelay
      ) {
        callback(...args);
        lastCallTime.current = now;
      } else {
        if (lastCallTime.current == null) {
          lastCallTime.current = now; // for first time
        }
        timer.current = setTimeout(
          () => {
            lastCallTime.current = now;
            callback(...args);
          },
          delay - (now - lastCallTime.current),
        );
      }
    } else {
      timer.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }
  };

  return callFunction;
};
