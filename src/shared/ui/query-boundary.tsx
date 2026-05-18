"use client";

import { Suspense, useSyncExternalStore, type ComponentType, type ReactNode } from "react";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  QueryErrorBoundary,
  type QueryErrorFallbackProps,
} from "@/shared/ui/query-error-boundary";

type Props = {
  children: ReactNode;
  loadingFallback: ReactNode;
  errorFallback: ComponentType<QueryErrorFallbackProps>;
};

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function QueryBoundary({ children, loadingFallback, errorFallback }: Props) {
  const isMounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const { reset } = useQueryErrorResetBoundary();

  if (!isMounted) return <>{loadingFallback}</>;

  return (
    <QueryErrorBoundary onReset={reset} fallback={errorFallback}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </QueryErrorBoundary>
  );
}

export type { QueryErrorFallbackProps };
