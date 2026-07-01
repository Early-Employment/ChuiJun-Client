import { useEffect, useState } from "react";

/** value 가 delayMs 동안 더 바뀌지 않을 때만 갱신되는 지연 값을 반환한다. */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
