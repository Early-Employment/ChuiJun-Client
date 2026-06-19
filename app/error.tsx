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
      title="페이지를 불러오다 잠깐 멈췄어요"
      description="취준 캐릭터가 다시 길을 찾는 중입니다. 잠시 후 다시 시도하거나 홈으로 이동해 다른 문제부터 이어서 볼 수 있어요."
      resetLabel="다시 시도"
      onReset={reset}
    />
  );
}
