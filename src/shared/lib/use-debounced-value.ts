import { startTransition, useEffect, useState } from "react";

// startTransition 으로 갱신해야, 이 값을 쓰는 useSuspenseQuery 가 새 쿼리 키로 바뀌어도
// Suspense fallback 을 건너뛰고 이전 화면을 유지한 채 새 데이터로 바로 전환된다.
/** value 가 delayMs 동안 더 바뀌지 않을 때만 갱신되는 지연 값을 반환한다. */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => setDebounced(value));
    }, delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
