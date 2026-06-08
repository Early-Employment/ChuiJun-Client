"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { solutionKeys } from "@/entities/solution/api/solution-keys";
import { LikeButton } from "@/features/solution-like/ui/like-button";
import { HeartIcon } from "@/shared/assets/HeartIcon";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";
import { CodeEditor } from "@/widgets/problem-solve/ui/code-editor";

function SolutionDetail({ solutionId }: { solutionId: number }) {
  const { data: solution } = useSuspenseQuery(solutionKeys.detail(solutionId));

  return (
    <div className="border-line bg-surface space-y-4 rounded-md border p-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-surface-subtle size-9 rounded-full" />
          <div>
            <p className="text-sm font-semibold">
              {solution.author} <span className="text-muted">{solution.authorId}</span>
            </p>
            <p className="text-muted text-xs">{solution.createdAt}</p>
          </div>
        </div>
        <span className="text-muted flex items-center gap-1 text-sm">
          {solution.likes}
          <HeartIcon filled={solution.liked} className="size-4" />
        </span>
      </header>

      <CodeEditor value={solution.code} readOnly height="280px" />

      <div className="flex items-center justify-center gap-4">
        <span className="text-muted flex items-center gap-1 text-sm">
          {solution.likes}
          <HeartIcon filled={solution.liked} className="size-4" />
        </span>
        <LikeButton solutionId={solution.id} liked={solution.liked} />
      </div>
    </div>
  );
}

function SolutionDetailLoading() {
  return <Skeleton className="h-96 w-full" />;
}

function SolutionDetailError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="text-muted flex h-40 flex-col items-center justify-center gap-2 text-sm">
      <p>풀이를 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </div>
  );
}

SolutionDetail.Loading = SolutionDetailLoading;
SolutionDetail.Error = SolutionDetailError;

export function SolutionDetailBoundary({ solutionId }: { solutionId: number }) {
  return (
    <QueryBoundary
      loadingFallback={<SolutionDetail.Loading />}
      errorFallback={SolutionDetail.Error}
    >
      <SolutionDetail solutionId={solutionId} />
    </QueryBoundary>
  );
}
