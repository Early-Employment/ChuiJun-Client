"use client";

import { useState } from "react";

const filterChips = ["난이도", "문제 상태", "언어", "문제집"] as const;
const rowsPerPage = 10;

const problemRows = [
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
  {
    status: "해결함",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: true,
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
  {
    status: "안 풀림",
    title: "서현이의 디자인 입문기",
    level: "lv. 2",
    solvedCount: "3",
    isHighlighted: false,
  },
] as const;

export function ProblemBoard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDirection, setPageDirection] = useState<"left" | "right">("left");
  const totalPages = Math.ceil(problemRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pagedRows = problemRows.slice(startIndex, startIndex + rowsPerPage);
  const emptyRowCount = rowsPerPage - pagedRows.length;

  return (
    <section className="space-y-4">
      <div className="border-line bg-surface rounded-lg border p-2 shadow-sm">
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
            className="border-line bg-surface text-body text-foreground flex h-14 items-center justify-between rounded-md border px-4 text-left font-semibold shadow-sm"
          >
            {chip}
            <span className="text-muted text-lg">⌄</span>
          </button>
        ))}
      </div>

      <div className="border-line bg-surface overflow-hidden rounded-lg border shadow-sm">
        <ul
          key={`cards-${currentPage}`}
          className={`divide-line divide-y md:hidden ${
            pageDirection === "left" ? "page-swap-enter-left" : "page-swap-enter-right"
          }`}
        >
          {pagedRows.map((row, index) => (
            <li key={`${row.title}-${index}`} className="space-y-3 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`text-body font-semibold ${
                    row.isHighlighted ? "text-info-600 underline" : "text-foreground"
                  }`}
                >
                  {row.title}
                </span>
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
          <table className="w-full min-w-[720px] table-fixed border-collapse">
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
            <tbody
              key={currentPage}
              className={
                pageDirection === "left" ? "page-swap-enter-left" : "page-swap-enter-right"
              }
            >
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
                  <td
                    className={`px-6 py-5 text-center ${row.isHighlighted ? "text-info-600 font-semibold underline" : ""}`}
                  >
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
            setPageDirection("right");
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
                setPageDirection(page > currentPage ? "left" : "right");
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
            setPageDirection("left");
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
