"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { problemKeys } from "@/entities/problem/api/problem-keys";
import { Skeleton } from "@/shared/ui/skeleton";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";

function WrongProblemBoard() {
  const { data: wrongProblems } = useSuspenseQuery(problemKeys.wrong());

  if (wrongProblems.length === 0) {
    return <WrongProblemBoard.Empty />;
  }

  return (
    <>
      <ul className="border-line divide-line bg-surface mt-2 divide-y rounded-md border md:hidden">
        {wrongProblems.map((problem) => (
          <li key={problem.id} className="space-y-3 px-4 py-4 text-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="font-semibold">{problem.title}</span>
              <span className="text-muted shrink-0">#{problem.id}</span>
            </div>
            <dl className="grid grid-cols-3 gap-2 text-xs">
              <div className="space-y-1">
                <dt className="text-muted">시도 횟수</dt>
                <dd>{problem.attempts}회</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted">시도 날짜</dt>
                <dd>{problem.date}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-muted">실패 이유</dt>
                <dd>{problem.reason}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <div className="border-line mt-2 hidden overflow-x-auto rounded-md border md:block">
        <table className="bg-surface w-full min-w-[720px] border-collapse text-center text-sm">
          <thead className="bg-neutral-200 font-medium">
            <tr>
              <th className="px-6 py-3 font-medium">순번</th>
              <th className="px-6 py-3 font-medium">문제명</th>
              <th className="px-6 py-3 font-medium">시도한 횟수</th>
              <th className="px-6 py-3 font-medium">시도한 날짜</th>
              <th className="px-6 py-3 font-medium">실패 이유</th>
            </tr>
          </thead>
          <tbody>
            {wrongProblems.map((problem) => (
              <tr key={problem.id} className="border-line border-t">
                <td className="px-6 py-3">{problem.id}</td>
                <td className="px-6 py-3">{problem.title}</td>
                <td className="px-6 py-3">{problem.attempts}</td>
                <td className="px-6 py-3">{problem.date}</td>
                <td className="px-6 py-3">{problem.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function WrongProblemBoardLoading() {
  return <Skeleton className="mt-2 h-40 w-full" />;
}

function WrongProblemBoardError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="text-muted mt-2 flex h-40 flex-col items-center justify-center gap-2 text-sm">
      <p>틀린 문제 기록을 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </div>
  );
}

function WrongProblemBoardEmpty() {
  return (
    <div className="text-muted mt-2 flex h-40 items-center justify-center text-sm">
      아직 틀린 문제가 없어요.
    </div>
  );
}

WrongProblemBoard.Loading = WrongProblemBoardLoading;
WrongProblemBoard.Error = WrongProblemBoardError;
WrongProblemBoard.Empty = WrongProblemBoardEmpty;

export function WrongProblemBoardBoundary() {
  return (
    <QueryBoundary
      loadingFallback={<WrongProblemBoard.Loading />}
      errorFallback={WrongProblemBoard.Error}
    >
      <WrongProblemBoard />
    </QueryBoundary>
  );
}
