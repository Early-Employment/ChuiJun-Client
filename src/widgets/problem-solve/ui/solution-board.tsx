"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { solutionKeys } from "@/entities/solution/api/solution-keys";
import type { SolutionSummary } from "@/entities/solution/model/solution";
import { ChevronLeftIcon } from "@/shared/assets/ChevronLeftIcon";
import { ChevronRightIcon } from "@/shared/assets/ChevronRightIcon";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";

interface Props {
  problemId: number;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const COLUMNS = ["이름", "언어", "풀이시간", "조회", "댓글", "좋아요"] as const;

function SolutionBoard({ problemId, selectedId, onSelect }: Props) {
  const [page, setPage] = useState(1);
  const { data } = useSuspenseQuery(solutionKeys.list(problemId, page));

  return (
    <div className="space-y-3">
      <div className="border-line bg-surface overflow-x-auto rounded-md border">
        <table className="w-full min-w-[640px] border-collapse text-center text-sm">
          <thead className="bg-surface-subtle text-muted font-medium">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column} className="px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((solution) => (
              <SolutionRow
                key={solution.id}
                solution={solution}
                selected={solution.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
    </div>
  );
}

function SolutionRow({
  solution,
  selected,
  onSelect,
}: {
  solution: SolutionSummary;
  selected: boolean;
  onSelect: (id: number) => void;
}) {
  return (
    <tr
      onClick={() => onSelect(solution.id)}
      className={`border-line cursor-pointer border-t ${
        selected ? "bg-surface-accent" : "hover:bg-surface-subtle"
      }`}
    >
      <td className="px-4 py-3">{solution.author}</td>
      <td className="px-4 py-3">{solution.language}</td>
      <td className="px-4 py-3">{solution.solveTime}</td>
      <td className="px-4 py-3">{solution.views}</td>
      <td className="px-4 py-3">{solution.comments}</td>
      <td className="px-4 py-3">{solution.likes}</td>
    </tr>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="text-muted flex items-center justify-center gap-2 text-sm">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="disabled:opacity-30"
        aria-label="이전 페이지"
      >
        <ChevronLeftIcon className="size-4" />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
        <button
          type="button"
          key={number}
          onClick={() => onChange(number)}
          className={number === page ? "text-accent font-semibold" : ""}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="disabled:opacity-30"
        aria-label="다음 페이지"
      >
        <ChevronRightIcon className="size-4" />
      </button>
    </div>
  );
}

function SolutionBoardLoading() {
  return <Skeleton className="h-96 w-full" />;
}

function SolutionBoardError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="text-muted flex h-40 flex-col items-center justify-center gap-2 text-sm">
      <p>친구 풀이를 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </div>
  );
}

SolutionBoard.Loading = SolutionBoardLoading;
SolutionBoard.Error = SolutionBoardError;

export function SolutionBoardBoundary(props: Props) {
  return (
    <QueryBoundary loadingFallback={<SolutionBoard.Loading />} errorFallback={SolutionBoard.Error}>
      <SolutionBoard {...props} />
    </QueryBoundary>
  );
}
