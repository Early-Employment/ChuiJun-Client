"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { problemKeys } from "@/entities/problem/api/problem-keys";
import { useWarmPythonRuntime } from "@/shared/lib/pyodide/warm-runtime";
import { ChevronLeftIcon } from "@/shared/assets/ChevronLeftIcon";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";
import { ProblemMetaHeader } from "@/widgets/problem-solve/ui/problem-meta-header";
import { ProblemTab } from "@/widgets/problem-solve/ui/problem-tab";

function ProblemSolveView({ id }: { id: number }) {
  const { data: problem } = useSuspenseQuery(problemKeys.detail(id));
  useWarmPythonRuntime();

  return (
    <main className="mx-auto w-full max-w-[1440px] space-y-4 px-4 py-6 sm:px-8 xl:px-10">
      <button type="button" className="text-muted flex items-center gap-1 text-base font-medium">
        <ChevronLeftIcon className="size-5" />
        문제 목록
      </button>

      <ProblemMetaHeader
        tier={problem.tier}
        score={problem.score}
        title={problem.title}
        timeLimitMs={problem.timeLimitMs}
        memoryLimitMb={problem.memoryLimitMb}
        correctRate={problem.correctRate}
      />

      <div className="flex items-center justify-end">
        <button
          type="button"
          className="border-line bg-surface text-foreground rounded-md border px-4 py-2 text-sm font-semibold opacity-90"
        >
          건의
        </button>
      </div>

      <ProblemTab problem={problem} />
    </main>
  );
}

function ProblemSolveViewLoading() {
  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-4 px-4 py-6 sm:px-8 xl:px-10">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-20 w-80" />
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

function ProblemSolveViewError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="text-muted mx-auto flex h-60 max-w-[1440px] flex-col items-center justify-center gap-2 text-sm">
      <p>문제를 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </div>
  );
}

ProblemSolveView.Loading = ProblemSolveViewLoading;
ProblemSolveView.Error = ProblemSolveViewError;

export function ProblemSolveViewBoundary({ id }: { id: number }) {
  return (
    <QueryBoundary
      loadingFallback={<ProblemSolveView.Loading />}
      errorFallback={ProblemSolveView.Error}
    >
      <ProblemSolveView id={id} />
    </QueryBoundary>
  );
}
