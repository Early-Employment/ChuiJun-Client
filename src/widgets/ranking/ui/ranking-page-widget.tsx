"use client";

import { useEffect, useState } from "react";
import {
  rankingCategories,
  type RankingCategory,
} from "@/entities/ranking/model/ranking-category";
import type { RankingEntry, RankingSnapshot } from "@/entities/ranking/model/ranking-entry";

const rowsPerPage = 14;
const podiumOrder = [1, 0, 2] as const;

type SortDirection = "desc" | "asc";
type RankingMotion = "left" | "right" | "up";

function formatRank(rank: number) {
  return `${rank}위`;
}

function formatDelta(score: number) {
  return `${score > 0 ? "+" : ""}${score}점`;
}

function getMotionClass(motion: RankingMotion) {
  if (motion === "left") return "ranking-content-enter-left";
  if (motion === "right") return "ranking-content-enter-right";
  return "ranking-content-enter-up";
}

type RankingSnapshots = Record<RankingCategory, RankingSnapshot>;

export function RankingPageWidget({ snapshots }: { snapshots: RankingSnapshots }) {
  const [selectedCategory, setSelectedCategory] = useState<RankingCategory>("overall");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [motion, setMotion] = useState<RankingMotion>("up");
  const data = snapshots[selectedCategory];

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortDirection]);

  const sortedEntries = [...data.entries].sort((left, right) =>
    sortDirection === "desc" ? right.score - left.score : left.score - right.score,
  );
  const totalPages = Math.max(1, Math.ceil(sortedEntries.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const pageEntries = sortedEntries.slice(startIndex, startIndex + rowsPerPage);
  const myEntry = data.entries.find((entry) => entry.isMe);
  const podiumEntries = data.entries.slice(0, 3);

  if (data.entries.length === 0 || !myEntry) {
    return <RankingPageWidget.Empty />;
  }

  return (
    <main className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 lg:px-10">
      <section className="space-y-6">
        <header className="space-y-4">
          <h1 className="text-foreground text-display font-extrabold">랭킹</h1>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="border-line-strong bg-line-strong inline-flex w-full max-w-full gap-1 overflow-x-auto rounded-md border p-1">
              {rankingCategories.map((category) => {
                const isSelected = category.id === selectedCategory;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      if (category.id === selectedCategory) return;

                      const currentIndex = rankingCategories.findIndex(
                        (item) => item.id === selectedCategory,
                      );
                      const nextIndex = rankingCategories.findIndex((item) => item.id === category.id);

                      setMotion(nextIndex > currentIndex ? "left" : "right");
                      setSelectedCategory(category.id);
                    }}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color,transform,box-shadow] duration-200 ${
                      isSelected
                        ? "bg-surface text-foreground border-line-strong border shadow-sm"
                        : "text-foreground/80 hover:text-foreground hover:-translate-y-0.5"
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setMotion("up");
                setSortDirection((direction) => (direction === "desc" ? "asc" : "desc"));
              }}
              className="border-line-strong bg-surface text-foreground inline-flex h-11 min-w-28 items-center justify-between gap-6 self-start rounded-md border px-4 text-sm font-medium whitespace-nowrap transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:shadow-sm"
            >
              {sortDirection === "desc" ? "오름차순" : "내림차순"}
              <span
                aria-hidden
                className={`transition-transform duration-300 ${sortDirection === "desc" ? "rotate-0" : "rotate-180"}`}
              >
                ⌄
              </span>
            </button>
          </div>
        </header>

        <div
          key={`${selectedCategory}-${sortDirection}-summary`}
          className={`grid gap-6 lg:grid-cols-2 ${getMotionClass(motion)}`}
        >
          <section className="border-line-strong bg-surface rounded-xl border px-6 py-7">
            <p className="text-body font-semibold">나의 순위</p>
            <div className="mt-6 flex items-end justify-between gap-4">
              <p className="text-foreground text-[clamp(2rem,3vw,2.75rem)] leading-none font-extrabold">
                {formatRank(myEntry.rank)}
              </p>
              <p
                className={`text-lg font-medium ${
                  data.myDelta > 0
                    ? "text-state-success"
                    : data.myDelta < 0
                      ? "text-muted"
                      : "text-foreground"
                }`}
              >
                {formatDelta(data.myDelta)}
              </p>
            </div>
          </section>

          <section className="border-line-strong bg-surface rounded-xl border px-6 py-7">
            <p className="text-body font-semibold">순위권</p>
            <div className="mt-5 grid grid-cols-3 gap-4 text-center">
              {podiumOrder.map((podiumIndex) => {
                const entry = podiumEntries[podiumIndex];

                if (!entry) return <div key={podiumIndex} />;

                return (
                  <div key={entry.id} className="min-w-0">
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
          <div
            key={`${selectedCategory}-${sortDirection}-${safeCurrentPage}-table`}
            className={`border-line-strong bg-surface overflow-hidden rounded-lg border ${getMotionClass(
              motion,
            )}`}
          >
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] table-fixed border-collapse">
                <thead className="bg-surface-subtle">
                  <tr>
                    <th className="px-8 py-3 text-center text-sm font-medium">순위</th>
                    <th className="px-8 py-3 text-center text-sm font-medium">이름</th>
                    <th className="px-8 py-3 text-center text-sm font-medium">학번</th>
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
                      <dt className="text-muted">학번</dt>
                      <dd className="text-foreground mt-1">{entry.studentNumber}</dd>
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
              setMotion(page > safeCurrentPage ? "left" : "right");
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
      <td className="px-8 py-3.5 text-center text-sm">{entry.studentNumber}</td>
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
  return (
    <nav className="text-muted flex items-center justify-center gap-4 py-2 text-sm">
      <button
        type="button"
        aria-label="이전 페이지"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="text-lg transition-[transform,color,opacity] duration-200 hover:-translate-x-0.5 hover:text-foreground disabled:opacity-40"
      >
        ‹
      </button>
      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onChange(page)}
            className={`transition-[transform,color] duration-200 hover:-translate-y-0.5 hover:text-foreground ${
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
        className="text-lg transition-[transform,color,opacity] duration-200 hover:translate-x-0.5 hover:text-foreground disabled:opacity-40"
      >
        ›
      </button>
    </nav>
  );
}

function RankingPageWidgetEmpty() {
  return (
    <main className="mx-auto flex min-h-[50dvh] w-full max-w-[1240px] items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
      <p className="text-muted">아직 표시할 랭킹 데이터가 없어요.</p>
    </main>
  );
}

RankingPageWidget.Empty = RankingPageWidgetEmpty;
