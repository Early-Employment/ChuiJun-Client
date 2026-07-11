"use client";

import type { ReactNode } from "react";
import type { ServerJudgeStatus } from "@/entities/submission/model/submission";
import { isResultOpen, type SolveState } from "@/features/code-judge/model/use-solve-flow";
import { ResultDialog, type ResultTone } from "@/shared/ui/result-dialog";

const SERVER_JUDGE_STATUS_LABELS: Record<ServerJudgeStatus, string> = {
  QUEUED: "채점 대기",
  RUNNING: "채점 중",
  PASSED: "정답",
  FAILED: "실패",
  AC: "정답",
  WA: "오답",
  TLE: "시간 초과",
  MLE: "메모리 초과",
  RE: "런타임 에러",
  CE: "컴파일 에러",
  IE: "채점 오류",
};

interface Props {
  state: SolveState;
  onClose: () => void;
  onRetry: () => void;
}

interface DialogContent {
  tone: ResultTone;
  title: string;
  body: ReactNode;
  retryLabel?: string;
}

/** 종단 상태(solved/wrong/error)를 결과 모달 문구로 옮긴다. */
export function SolveResultDialog({ state, onClose, onRetry }: Props) {
  const content = resolveContent(state);
  const hasRetry = content?.retryLabel !== undefined;

  return (
    <ResultDialog
      open={isResultOpen(state)}
      tone={content?.tone ?? "success"}
      title={content?.title ?? ""}
      onClose={onClose}
      onRetry={hasRetry ? onRetry : undefined}
      retryLabel={content?.retryLabel}
    >
      {content?.body}
    </ResultDialog>
  );
}

function resolveContent(state: SolveState): DialogContent | null {
  if (state.phase === "solved") {
    const { totalCount } = state.report.result;
    return {
      tone: "success",
      title: "정답입니다",
      body: (
        <>
          <p>
            {totalCount}개 테스트 전부 통과 · +{state.record.score.toLocaleString()}점
          </p>
          <p>총 {state.record.totalScoreAfter.toLocaleString()}점</p>
        </>
      ),
    };
  }

  if (state.phase === "wrong") {
    const { passedCount, totalCount } = state.report.result;
    return {
      tone: "danger",
      title: "틀렸습니다",
      body: (
        <>
          <p>{SERVER_JUDGE_STATUS_LABELS[state.record.judgeStatus]}</p>
          <p>
            {totalCount}개 중 {passedCount}개 통과
          </p>
        </>
      ),
    };
  }

  if (state.phase === "error" && state.cause === "submit") {
    const { passedCount, totalCount, judgeStatus } = state.report.result;
    return {
      tone: "warning",
      title: "서버에 기록하지 못했어요",
      retryLabel: "다시 전송",
      // 채점은 끝났다. 코드를 고치라는 뜻이 아님을 분명히 한다.
      body: (
        <>
          <p>
            채점 결과: {SERVER_JUDGE_STATUS_LABELS[judgeStatus]} ({passedCount}/{totalCount})
          </p>
          <p>기록만 실패했어요. 코드는 그대로 두고 다시 전송해 주세요.</p>
        </>
      ),
    };
  }

  if (state.phase === "error") {
    return {
      tone: "warning",
      title: "채점기를 불러오지 못했어요",
      retryLabel: "다시 시도",
      body: (
        <>
          <p>{state.message}</p>
          <p>네트워크를 확인한 뒤 다시 시도해 주세요.</p>
        </>
      ),
    };
  }

  return null;
}
