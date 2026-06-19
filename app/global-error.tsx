"use client";

import { useEffect } from "react";
import { FullPageErrorScreen } from "@/shared/ui/full-page-error-screen";
import "./globals.css";

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
          title="문제가 발생했어요"
          description={"잠시\u00A0후 다시 시도하거나 문제가 지속된다면 관리자에게 문의해주세요."}
          resetLabel="새로 시도"
          onReset={reset}
          secondaryAction={{ href: "/", label: "홈으로 돌아가기", tone: "secondary" }}
        />
      </body>
    </html>
  );
}
