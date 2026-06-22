"use client";

interface Props {
  onConfirm: () => void;
}

export function SubmitGateModal({ onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="bg-surface w-full max-w-sm space-y-4 rounded-md p-6">
        <p className="text-foreground text-sm">
          해당 문제를 1번 제출해야
          <br />
          친구 풀이를 확인할 수 있습니다!
        </p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onConfirm}
            className="bg-accent text-neutral-0 rounded-md px-4 py-2 text-sm font-medium"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
