"use client";

import { useEffect, type ReactNode } from "react";

export type ResultTone = "success" | "danger" | "warning";

const TONE_TITLE_CLASSES: Record<ResultTone, string> = {
  success: "text-state-success",
  danger: "text-state-danger",
  warning: "text-state-warning",
};

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
 * 결과 모달. 프로젝트의 검증된 오버레이 패턴(fixed inset-0)을 따른다.
 * 화면 상단에서 내려온 것처럼 상단 중앙에 배치한다.
 */
export function ResultDialog({
  open,
  tone,
  title,
  children,
  onClose,
  retryLabel,
  onRetry,
}: ResultDialogProps) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      className="bg-overlay fixed inset-0 z-50 flex justify-center px-4 pt-16 sm:pt-24"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="bg-surface text-foreground h-fit w-full max-w-md rounded-lg px-8 py-7 shadow-lg"
      >
        <h2 className={`text-heading font-bold ${TONE_TITLE_CLASSES[tone]}`}>{title}</h2>
        <div className="text-muted mt-3 space-y-1 text-sm">{children}</div>

        <div className="mt-7 flex justify-end gap-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="bg-accent text-canvas cursor-pointer rounded-md px-4 py-2 text-sm font-semibold"
            >
              {retryLabel ?? "다시 시도"}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="border-line bg-surface cursor-pointer rounded-md border px-4 py-2 text-sm font-medium"
          >
            {onRetry ? "닫기" : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
}
