"use client";

import { useEffect, useRef, type ReactNode } from "react";

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
  /** Esc·backdrop·닫기 버튼 모두 이 콜백으로 모인다. */
  onClose: () => void;
  retryLabel?: string;
  onRetry?: () => void;
}

/**
 * 네이티브 <dialog> 기반 결과 모달.
 * 포커스 트랩·Esc·backdrop 은 브라우저가 처리하므로 직접 구현하지 않는다.
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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="bg-surface text-foreground backdrop:bg-overlay m-auto w-full max-w-md rounded-lg px-8 py-7"
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
    </dialog>
  );
}
