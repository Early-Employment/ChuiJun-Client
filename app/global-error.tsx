"use client";

import { useEffect } from "react";
import { FullPageErrorScreen } from "@/shared/ui/full-page-error-screen";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalErrorPage]", error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <FullPageErrorScreen
          title="예상치 못한 문제가 생겼어요"
          description="서비스 전체 화면을 다시 정리하는 중입니다. 바로 새로 시도할 수 있고, 같은 문제가 반복되면 잠시 후 다시 접속해 주세요."
          resetLabel="새로 시도"
          onReset={reset}
        />
      </body>
    </html>
  );
}
