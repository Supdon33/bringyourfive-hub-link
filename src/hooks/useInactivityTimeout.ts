import { useEffect, useRef, useCallback } from "react";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

const ACTIVITY_EVENTS: (keyof DocumentEventMap)[] = [
  "mousedown",
  "mousemove",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];

export function useInactivityTimeout(onTimeout: () => void, enabled: boolean) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onTimeout, INACTIVITY_TIMEOUT);
  }, [onTimeout]);

  useEffect(() => {
    if (!enabled) return;

    resetTimer();

    ACTIVITY_EVENTS.forEach((event) =>
      document.addEventListener(event, resetTimer, { passive: true })
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) =>
        document.removeEventListener(event, resetTimer)
      );
    };
  }, [enabled, resetTimer]);
}
