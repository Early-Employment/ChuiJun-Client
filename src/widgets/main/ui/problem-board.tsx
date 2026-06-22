"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { problemKeys } from "@/entities/problem/api/problem-keys";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";

const filterChips = ["난이도", "문제 상태", "언어", "문제집"] as const;
const rowsPerPage = 10;

function ProblemBoard() {
  const { data: problemRows } = useSuspenseQuery(problemKeys.list());
  const [currentPage, setCurrentPage] = useState(1);

  if (problemRows.length === 0) {
    return <ProblemBoard.Empty />;
  }

  const totalPages = Math.ceil(problemRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pagedRows = problemRows.slice(startIndex, startIndex + rowsPerPage);
  const emptyRowCount = rowsPerPage - pagedRows.length;

  return (
    <section className="space-y-4">
      <div className="border-line bg-surface rounded-lg border p-2">
        <div className="border-line bg-surface flex items-center justify-between gap-3 rounded-md border px-4 py-4">
          <span className="text-body text-placeholder">문제 제목 입력</span>
          <span className="text-placeholder text-3xl leading-none">⌕</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.6fr)]">
        {filterChips.map((chip) => (
          <button
            key={chip}
            type="button"
            className="border-line bg-surface text-body text-foreground flex h-14 items-center justify-between rounded-md border px-4 text-left font-semibold"
          >
            {chip}
            <span className="text-muted text-lg">⌄</span>
          </button>
        ))}
      </div>

      <div className="border-line bg-surface overflow-hidden rounded-lg border">
        <ul className="divide-line divide-y md:hidden">
          {pagedRows.map((row, index) => (
            <li key={`${row.title}-${index}`} className="space-y-3 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <span className="text-body text-foreground font-semibold">{row.title}</span>
                <span className="text-muted text-label shrink-0">#{startIndex + index + 1}</span>
              </div>
              <dl className="text-label grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <dt className="text-muted">상태</dt>
                  <dd
                    className={
                      row.status === "해결함" ? "text-accent font-semibold" : "text-foreground"
                    }
                  >
                    {row.status}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-muted">난이도</dt>
                  <dd className="text-foreground">{row.level}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-muted">완료한 사람</dt>
                  <dd className="text-foreground">{row.solvedCount}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[80px]" />
              <col className="w-[124px]" />
              <col />
              <col className="w-[120px]" />
              <col className="w-[140px]" />
            </colgroup>
            <thead className="bg-surface-subtle">
              <tr>
                <th className="text-label text-foreground px-6 py-4 text-center font-bold">순번</th>
                <th className="text-label text-foreground px-6 py-4 text-center font-bold">상태</th>
                <th className="text-label text-foreground px-6 py-4 text-center font-bold">제목</th>
                <th className="text-label text-foreground px-6 py-4 text-center font-bold">
                  난이도
                </th>
                <th className="text-label text-foreground px-6 py-4 text-center font-bold">
                  완료한 사람
                </th>
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row, index) => (
                <tr
                  key={`${row.title}-${index}`}
                  className="border-line text-body text-foreground border-t"
                >
                  <td className="px-6 py-5 text-center">{startIndex + index + 1}</td>
                  <td
                    className={`px-6 py-5 text-center ${row.status === "해결함" ? "text-accent font-semibold" : ""}`}
                  >
                    {row.status}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="block w-full text-center">{row.title}</span>
                  </td>
                  <td className="px-6 py-5 text-center">{row.level}</td>
                  <td className="px-6 py-5 text-center">{row.solvedCount}</td>
                </tr>
              ))}
              {Array.from({ length: emptyRowCount }, (_, index) => (
                <tr
                  key={`empty-${index}`}
                  className="border-line text-body text-foreground border-t"
                >
                  <td className="px-6 py-5 text-center">&nbsp;</td>
                  <td className="px-6 py-5 text-center">&nbsp;</td>
                  <td className="px-6 py-5 text-center">&nbsp;</td>
                  <td className="px-6 py-5 text-center">&nbsp;</td>
                  <td className="px-6 py-5 text-center">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-muted flex items-center justify-center gap-5 py-2 text-xl">
        <button
          type="button"
          className="cursor-pointer disabled:cursor-default disabled:opacity-40"
          onClick={() => {
            setCurrentPage((page) => Math.max(1, page - 1));
          }}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              type="button"
              className={page === currentPage ? "text-foreground font-bold" : "cursor-pointer"}
              onClick={() => {
                setCurrentPage(page);
              }}
            >
              {page}
            </button>
          );
        })}
        <button
          type="button"
          className="cursor-pointer disabled:cursor-default disabled:opacity-40"
          onClick={() => {
            setCurrentPage((page) => Math.min(totalPages, page + 1));
          }}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
      </div>
    </section>
  );
}

function ProblemBoardLoading() {
  return (
    <section className="space-y-4">
      <Skeleton className="h-16 w-full rounded-lg" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.6fr)]">
        {Array.from({ length: filterChips.length }, (_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-md" />
        ))}
      </div>
      <Skeleton className="h-[560px] w-full rounded-lg" />
    </section>
  );
}

function ProblemBoardError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="text-muted flex h-[480px] flex-col items-center justify-center gap-2 text-sm">
      <p>문제 목록을 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </div>
  );
}

function ProblemBoardEmpty() {
  return (
    <div className="text-muted flex h-[480px] items-center justify-center text-sm">
      아직 표시할 문제가 없어요.
    </div>
  );
}

ProblemBoard.Loading = ProblemBoardLoading;
ProblemBoard.Error = ProblemBoardError;
ProblemBoard.Empty = ProblemBoardEmpty;

export function ProblemBoardBoundary() {
  return (
    <QueryBoundary loadingFallback={<ProblemBoard.Loading />} errorFallback={ProblemBoard.Error}>
      <ProblemBoard />
    </QueryBoundary>
  );
}
