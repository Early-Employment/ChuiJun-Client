"use client";

import { useEffect, type ReactNode } from "react";
import { useMountAnimation } from "@/shared/lib/use-mount-animation";

export type ResultTone = "success" | "danger" | "warning";

interface ResultDialogProps {
  open: boolean;
  tone: ResultTone;
  title: string;
  children: ReactNode;
  /** Esc·닫기 버튼이 이 콜백으로 모인다. backdrop 클릭은 닫지 않는다(오조작 방지). */
  onClose: () => void;
  retryLabel?: string;
  onRetry?: () => void;
}

/**
 * 결과 배너(Figma node 1156:749 / 1191:749). 어둡게 가리는 오버레이 없이,
 * 화면 최상단에 헤더를 덮는 카드 형태다. tone 은 문구 분기에만 쓰이고
 * 배너 자체는 성공·실패 모두 동일한 스타일(흰 배경·teal 버튼)을 쓴다.
 */
export function ResultDialog({
  open,
  title,
  children,
  onClose,
  retryLabel,
  onRetry,
}: ResultDialogProps) {
  const { shouldRender, dataState, handleAnimationEnd } = useMountAnimation(open);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      role="presentation"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-4"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        data-state={dataState}
        onAnimationEnd={handleAnimationEnd}
        className="border-line-strong bg-surface text-foreground data-[state=closed]:animate-banner-out data-[state=open]:animate-banner-in pointer-events-auto w-full max-w-[360px] rounded-b-lg border pt-6 pr-5 pb-4 pl-[17px] shadow-lg"
      >
        <p className="text-[15px] leading-normal font-medium">{title}</p>
        <div className="text-muted mt-1 space-y-0.5 text-xs">{children}</div>

        <div className="mt-4 flex justify-end gap-2">
          {onRetry && (
            <button
              type="button"
              onClick={onClose}
              className="border-line-strong bg-surface text-foreground h-[30px] cursor-pointer rounded-md border px-4 text-xs font-medium"
            >
              닫기
            </button>
          )}
          <button
            type="button"
            onClick={onRetry ?? onClose}
            className="bg-accent h-[30px] cursor-pointer rounded-md px-4 text-xs font-medium text-white"
          >
            {onRetry ? (retryLabel ?? "다시 시도") : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
