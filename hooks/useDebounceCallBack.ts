/* eslint-disable prettier/prettier */
import { useRef, useEffect } from 'react';

/**
 * Debounce hoặc throttle một hàm, vẫn giữ nguyên kiểu trả về (sync hoặc async)
 * @param callback - Hàm cần debounce
 * @param delay - Thời gian chờ (ms)
 * @param throttle - Có bật throttle mode không
 * @param needDelay - Nếu true thì luôn chờ delay trước khi gọi
 */
export const useDebounceCallBack = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  throttle: boolean = false,
  needDelay?: boolean,
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const lastCallTime = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const callFunction = (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return new Promise((resolve) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      const now = Date.now();

      const invoke = async () => {
        const result = await callback(...args);

        resolve(result as ReturnType<T>);
      };

      if (throttle) {
        if (
          (!lastCallTime.current || now - lastCallTime.current >= delay) &&
          !needDelay
        ) {
          lastCallTime.current = now;
          invoke();
        } else {
          if (lastCallTime.current == null) {
            lastCallTime.current = now;
          }
          timer.current = setTimeout(
            () => {
              lastCallTime.current = Date.now();
              invoke();
            },
            delay - (now - lastCallTime.current),
          );
        }
      } else {
        timer.current = setTimeout(() => {
          invoke();
        }, delay);
      }
    });
  };

  return callFunction;
};
