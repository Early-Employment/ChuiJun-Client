"use client";

import { useEffect, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { rankingKeys } from "@/entities/ranking/api/ranking-keys";
import type { RankingEntry } from "@/entities/ranking/model/ranking-entry";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";

const rowsPerPage = 14;
const podiumOrder = [1, 0, 2] as const;

type SortDirection = "desc" | "asc";

function formatRank(rank: number) {
  return `${rank}위`;
}

function RankingPageWidget() {
  const { data: entries } = useSuspenseQuery(rankingKeys.list());
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortDirection]);

  const sortedEntries = [...entries].sort((left, right) =>
    sortDirection === "desc" ? right.score - left.score : left.score - right.score,
  );
  const totalPages = Math.max(1, Math.ceil(sortedEntries.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const pageEntries = sortedEntries.slice(startIndex, startIndex + rowsPerPage);
  const myEntry = entries.find((entry) => entry.isMe);
  const podiumEntries = [...entries].sort((left, right) => right.score - left.score).slice(0, 3);

  if (entries.length === 0) {
    return <RankingPageWidget.Empty />;
  }

  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 lg:px-10">
      <section className="space-y-6">
        <header className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-foreground text-display font-extrabold">랭킹</h1>

            <button
              type="button"
              onClick={() => {
                setSortDirection((direction) => (direction === "desc" ? "asc" : "desc"));
              }}
              className="border-line-strong bg-surface text-foreground inline-flex h-11 items-center justify-between gap-6 self-start rounded-md border px-4 text-sm font-medium whitespace-nowrap"
            >
              {sortDirection === "desc" ? "내림차순" : "오름차순"}
              <span aria-hidden className={sortDirection === "desc" ? "rotate-0" : "rotate-180"}>
                ⌄
              </span>
            </button>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="border-line-strong bg-surface rounded-xl border px-6 py-7">
            <p className="text-body font-semibold">나의 순위</p>
            {myEntry ? (
              <div className="mt-6 flex items-end justify-between gap-4">
                <p className="text-foreground text-[clamp(2rem,3vw,2.75rem)] leading-none font-extrabold">
                  {formatRank(myEntry.rank)}
                </p>
                <p className="text-muted text-lg font-medium">{myEntry.score}점</p>
              </div>
            ) : (
              <div className="mt-6 flex min-h-18 items-end">
                <p className="text-muted text-sm">현재 내 랭킹 정보를 확인할 수 없습니다.</p>
              </div>
            )}
          </section>

          <section className="border-line-strong bg-surface rounded-xl border px-6 py-7">
            <p className="text-body font-semibold">순위권</p>
            <div className="mt-5 grid grid-cols-3 gap-4 text-center">
              {podiumOrder.map((podiumIndex) => {
                const entry = podiumEntries[podiumIndex];

                if (!entry) {
                  return (
                    <div key={podiumIndex} className="min-w-0">
                      <p className="text-muted text-caption">{formatRank(podiumIndex + 1)}</p>
                      <p className="text-muted mt-2 truncate text-2xl font-extrabold sm:text-3xl">
                        없음
                      </p>
                    </div>
                  );
                }

                return (
                  <div key={podiumIndex} className="min-w-0">
                    <p className="text-muted text-caption">{formatRank(entry.rank)}</p>
                    <p className="text-foreground mt-2 truncate text-2xl font-extrabold sm:text-3xl">
                      {entry.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <section className="space-y-4">
          <div className="border-line-strong bg-surface overflow-hidden rounded-lg border">
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full table-fixed border-collapse">
                <thead className="bg-surface-subtle">
                  <tr>
                    <th className="px-8 py-3 text-center text-sm font-medium">순위</th>
                    <th className="px-8 py-3 text-center text-sm font-medium">이름</th>
                    <th className="px-8 py-3 text-center text-sm font-medium">학년/반</th>
                    <th className="px-8 py-3 text-center text-sm font-medium">통합 점수</th>
                  </tr>
                </thead>
                <tbody>
                  {pageEntries.map((entry) => (
                    <RankingTableRow key={entry.id} entry={entry} />
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-line-strong divide-y md:hidden">
              {pageEntries.map((entry) => (
                <li key={entry.id} className="space-y-3 px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-muted text-caption">{formatRank(entry.rank)}</p>
                      <p className="text-body mt-1 font-semibold">{entry.name}</p>
                    </div>
                    <p className="text-heading font-extrabold">{entry.score}</p>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <dt className="text-muted">학년/반</dt>
                      <dd className="text-foreground mt-1">{entry.classLabel}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">통합 점수</dt>
                      <dd className="text-foreground mt-1">{entry.score}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onChange={(page) => {
              if (page === safeCurrentPage) return;
              setCurrentPage(page);
            }}
          />
        </section>
      </section>
    </main>
  );
}

function RankingTableRow({ entry }: { entry: RankingEntry }) {
  return (
    <tr className="border-line-strong border-t">
      <td className="px-8 py-3.5 text-center text-sm">{formatRank(entry.rank)}</td>
      <td
        className={`px-8 py-3.5 text-center text-sm ${
          entry.isMe ? "text-accent font-semibold" : "text-foreground"
        }`}
      >
        {entry.name}
      </td>
      <td className="px-8 py-3.5 text-center text-sm">{entry.classLabel}</td>
      <td className="px-8 py-3.5 text-center text-sm">{entry.score}</td>
    </tr>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (totalPages <= 1) return null;

  return (
    <nav className="text-muted flex items-center justify-center gap-4 py-2 text-sm">
      <button
        type="button"
        aria-label="이전 페이지"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="hover:text-foreground text-lg disabled:opacity-40"
      >
        ‹
      </button>
      {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
        const page = startPage + index;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onChange(page)}
            className={`hover:text-foreground ${
              page === currentPage ? "text-foreground font-bold" : ""
            }`}
          >
            {page}
          </button>
        );
      })}
      <button
        type="button"
        aria-label="다음 페이지"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="hover:text-foreground text-lg disabled:opacity-40"
      >
        ›
      </button>
    </nav>
  );
}

function RankingPageWidgetLoading() {
  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 lg:px-10">
      <section className="space-y-6">
        <Skeleton className="h-12 w-40 rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
        <Skeleton className="h-[520px] w-full rounded-lg" />
      </section>
    </main>
  );
}

function RankingPageWidgetError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <main className="text-muted mx-auto flex min-h-[50dvh] w-full max-w-[1240px] flex-col items-center justify-center gap-2 px-4 py-10 text-sm sm:px-6 lg:px-10">
      <p>랭킹 데이터를 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </main>
  );
}

function RankingPageWidgetEmpty() {
  return (
    <main className="mx-auto flex min-h-[50dvh] w-full max-w-[1240px] items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
      <p className="text-muted">아직 표시할 랭킹 데이터가 없어요.</p>
    </main>
  );
}

RankingPageWidget.Loading = RankingPageWidgetLoading;
RankingPageWidget.Error = RankingPageWidgetError;
RankingPageWidget.Empty = RankingPageWidgetEmpty;

export function RankingPageWidgetBoundary() {
  return (
    <QueryBoundary
      loadingFallback={<RankingPageWidget.Loading />}
      errorFallback={RankingPageWidget.Error}
    >
      <RankingPageWidget />
    </QueryBoundary>
  );
}
