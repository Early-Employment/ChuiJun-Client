"use client";

import type { JudgeStatus } from "@/entities/submission/model/submission";
import { isResultOpen, type SolveState } from "@/features/code-judge/model/use-solve-flow";
import { ResultDialog } from "@/shared/ui/result-dialog";

const JUDGE_STATUS_LABELS: Record<JudgeStatus, string> = {
  AC: "정답",
  WA: "오답",
  TLE: "시간 초과",
  RE: "런타임 에러",
};

interface Props {
  state: SolveState;
  onClose: () => void;
  onRetry: () => void;
}

/** 종단 상태(solved/wrong/error)를 결과 모달 문구로 옮긴다. */
export function SolveResultDialog({ state, onClose, onRetry }: Props) {
  const open = isResultOpen(state);

  if (state.phase === "solved") {
    const { totalCount } = state.report.result;
    return (
      <ResultDialog open={open} tone="success" title="정답입니다" onClose={onClose}>
        <p>
          {totalCount}개 테스트 전부 통과 · +{state.record.score.toLocaleString()}점
        </p>
        <p>총 {state.record.totalScoreAfter.toLocaleString()}점</p>
      </ResultDialog>
    );
  }

  if (state.phase === "wrong") {
    const { passedCount, totalCount, judgeStatus } = state.report.result;
    return (
      <ResultDialog open={open} tone="danger" title="틀렸습니다" onClose={onClose}>
        <p>
          {totalCount}개 중 {passedCount}개 통과
        </p>
        <p>{JUDGE_STATUS_LABELS[judgeStatus]}</p>
      </ResultDialog>
    );
  }

  if (state.phase === "error" && state.cause === "submit") {
    const { passedCount, totalCount, judgeStatus } = state.report.result;
    return (
      <ResultDialog
        open={open}
        tone="warning"
        title="서버에 기록하지 못했어요"
        onClose={onClose}
        onRetry={onRetry}
        retryLabel="다시 전송"
      >
        {/* 채점은 끝났다. 코드를 고치라는 뜻이 아님을 분명히 한다. */}
        <p>
          채점 결과: {JUDGE_STATUS_LABELS[judgeStatus]} ({passedCount}/{totalCount})
        </p>
        <p>기록만 실패했어요. 코드는 그대로 두고 다시 전송해 주세요.</p>
      </ResultDialog>
    );
  }

  if (state.phase === "error") {
    return (
      <ResultDialog
        open={open}
        tone="warning"
        title="채점기를 불러오지 못했어요"
        onClose={onClose}
        onRetry={onRetry}
        retryLabel="다시 시도"
      >
        <p>{state.message}</p>
        <p>네트워크를 확인한 뒤 다시 시도해 주세요.</p>
      </ResultDialog>
    );
  }

  return null;
}
