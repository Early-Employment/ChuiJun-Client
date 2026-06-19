"use client";

import { useEffect } from "react";
import { FullPageErrorScreen } from "@/shared/ui/full-page-error-screen";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[AppErrorPage]", error);
  }, [error]);

  return (
    <FullPageErrorScreen
      title="문제가 발생했어요"
      description="잠시 후 다시 시도하거나 문제가 지속된다면 관리자에게 문의해주세요."
      resetLabel="다시 시도"
      onReset={reset}
    />
  );
}
