"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { submissionKeys } from "@/entities/submission/api/submission-keys";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";
import { SolutionBoardBoundary } from "@/widgets/problem-solve/ui/solution-board";
import { SolutionDetailBoundary } from "@/widgets/problem-solve/ui/solution-detail";
import { SubmitGateModal } from "@/widgets/problem-solve/ui/submit-gate-modal";

interface Props {
  problemId: number;
  /** 미제출 모달의 "확인" 시 문제 탭으로 되돌리는 콜백 */
  onRequireProblemTab: () => void;
}

function FriendSolutionsPanel({ problemId, onRequireProblemTab }: Props) {
  const { data: hasSubmitted } = useSuspenseQuery(submissionKeys.hasSubmitted(problemId));
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (!hasSubmitted) {
    return (
      <>
        <div className="h-60" />
        <SubmitGateModal onConfirm={onRequireProblemTab} />
      </>
    );
  }

  if (selectedId === null) {
    return (
      <SolutionBoardBoundary
        key={problemId}
        problemId={problemId}
        selectedId={null}
        onSelect={setSelectedId}
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <SolutionBoardBoundary
        key={problemId}
        problemId={problemId}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <SolutionDetailBoundary solutionId={selectedId} />
    </div>
  );
}

function FriendSolutionsPanelLoading() {
  return <Skeleton className="h-96 w-full" />;
}

function FriendSolutionsPanelError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="text-muted flex h-40 flex-col items-center justify-center gap-2 text-sm">
      <p>제출 정보를 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </div>
  );
}

FriendSolutionsPanel.Loading = FriendSolutionsPanelLoading;
FriendSolutionsPanel.Error = FriendSolutionsPanelError;

export function FriendSolutionsPanelBoundary(props: Props) {
  return (
    <QueryBoundary
      loadingFallback={<FriendSolutionsPanel.Loading />}
      errorFallback={FriendSolutionsPanel.Error}
    >
      <FriendSolutionsPanel {...props} />
    </QueryBoundary>
  );
}
