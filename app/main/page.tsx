"use client";

import { useState } from "react";

const filterChips = ["난이도", "문제 상태", "언어", "문제집"] as const;
const rowsPerPage = 10;

const problemRows = [
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "해결함", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
  { status: "안 풀림", title: "서현이의 디자인 입문기", level: "lv. 2", solvedCount: "3" },
] as const;

const summaryCards = [
  {
    eyebrow: "오늘의 문제",
    title: "서현이의 이준건 전화번호 구하기",
    meta: "그리디",
  },
  {
    eyebrow: "최신 문제",
    title: "이준건의 서현 전번 구하기 2",
    meta: "그리디",
  },
  {
    eyebrow: "나의 실시간 순위",
    title: "1위",
    meta: "종합 랭킹",
  },
  {
    eyebrow: "이어서 풀기",
    title: "서현이의 이준건 전화번호 구하기",
    meta: "그리디",
  },
] as const;

const statItems = [
  { label: "종합 랭킹", value: "1위" },
  { label: "푼 문제", value: "1개" },
  { label: "티어", value: "플래티넘" },
] as const;

export default function MainPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-subtle">
      <HeroSection />
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-9 px-4 py-9 sm:px-8 xl:px-10">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_430px]">
          <ProblemBoard />
          <ProfileSidebar />
        </div>
      </main>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="bg-primary-500">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-3 px-4 py-4 sm:px-6 lg:py-5 xl:px-8">
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_460px]">
          <article className="flex min-h-56 flex-col justify-start rounded-lg bg-surface px-8 py-7 shadow-sm lg:min-h-64 lg:px-10 lg:py-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-[44px]">
              안녕하세요
            </h1>
            <p className="mt-6 text-xl font-semibold text-foreground lg:text-2xl">
              잘왔어요. 여기가 짱짱 좋음
            </p>
          </article>

          <aside className="self-start rounded-lg bg-surface p-3 shadow-sm">
            <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-2">
              {summaryCards.map((card, index) => (
                <SummaryCard
                  key={`${card.eyebrow}-${index}`}
                  eyebrow={card.eyebrow}
                  title={card.title}
                  meta={card.meta}
                  className={index === 0 || index === 3 ? "md:col-span-2 xl:col-span-2" : ""}
                />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  eyebrow,
  title,
  meta,
  className,
}: {
  eyebrow: string;
  title: string;
  meta: string;
  className?: string;
}) {
  return (
    <article
      className={`relative rounded-md bg-primary-50 p-3 text-foreground${className ? ` ${className}` : ""}`}
    >
      <p className="text-caption font-semibold text-accent-strong">{eyebrow}</p>
      <div className="mt-1.5 flex items-start justify-between gap-2.5">
        <div>
          <h2 className="text-body font-bold text-foreground">{title}</h2>
          <p className="mt-1 text-label text-muted">{meta}</p>
        </div>
        <span className="pt-0.5 text-xl leading-none text-accent-strong">›</span>
      </div>
    </article>
  );
}

function ProblemBoard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageDirection, setPageDirection] = useState<"left" | "right">("left");
  const totalPages = Math.ceil(problemRows.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pagedRows = problemRows.slice(startIndex, startIndex + rowsPerPage);
  const emptyRowCount = rowsPerPage - pagedRows.length;

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-line bg-surface p-2 shadow-sm">
        <div className="flex items-center justify-between gap-3 rounded-md border border-line bg-surface px-4 py-4">
          <span className="text-body text-placeholder">문제 제목 입력</span>
          <span className="text-3xl leading-none text-placeholder">⌕</span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.6fr)]">
        {filterChips.map((chip) => (
          <button
            key={chip}
            type="button"
            className="flex h-14 items-center justify-between rounded-md border border-line bg-surface px-4 text-left text-body font-semibold text-foreground shadow-sm"
          >
            {chip}
            <span className="text-lg text-muted">⌄</span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-sm">
        <div className="overflow-x-auto">
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
                <th className="px-6 py-4 text-center text-label font-bold text-foreground">순번</th>
                <th className="px-6 py-4 text-center text-label font-bold text-foreground">상태</th>
                <th className="px-6 py-4 text-center text-label font-bold text-foreground">제목</th>
                <th className="px-6 py-4 text-center text-label font-bold text-foreground">난이도</th>
                <th className="px-6 py-4 text-center text-label font-bold text-foreground">완료한 사람</th>
              </tr>
            </thead>
            <tbody
              key={currentPage}
              className={pageDirection === "left" ? "page-swap-enter-left" : "page-swap-enter-right"}
            >
              {pagedRows.map((row, index) => (
                <tr key={`${row.title}-${index}`} className="border-t border-line text-body text-foreground">
                  <td className="px-6 py-5 text-center">{startIndex + index + 1}</td>
                  <td className={`px-6 py-5 text-center${row.status === "해결함" ? " font-semibold text-accent" : ""}`}>
                    {row.status}
                  </td>
                  <td
                    className={`px-6 py-5 text-center${
                      startIndex + index === 3 ? " font-semibold text-info-600 underline" : ""
                    }`}
                  >
                    <span className="block w-full text-center">{row.title}</span>
                  </td>
                  <td className="px-6 py-5 text-center">{row.level}</td>
                  <td className="px-6 py-5 text-center">{row.solvedCount}</td>
                </tr>
              ))}
              {Array.from({ length: emptyRowCount }, (_, index) => (
                <tr key={`empty-${index}`} className="border-t border-line text-body text-foreground">
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

      <div className="flex items-center justify-center gap-5 py-2 text-xl text-muted">
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
              className={page === currentPage ? "font-bold text-foreground" : "cursor-pointer"}
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

function ProfileSidebar() {
  return (
    <aside className="self-start rounded-lg border border-line bg-surface p-6 shadow-sm">
      <h2 className="text-3xl font-extrabold text-foreground">000 선생님, 어서오세요!</h2>

      <div className="mt-5 grid grid-cols-3 gap-5">
        {statItems.map((item) => (
          <div key={item.label} className="space-y-1">
            <p className="text-body text-muted">{item.label}</p>
            <p className="text-2xl font-extrabold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-7">
        <h3 className="text-3xl font-extrabold text-foreground">이번 달 활동 기록</h3>
        <div className="mt-5 rounded-md bg-surface p-1">
          <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1">
            {Array.from({ length: 180 }, (_, index) => {
              const strong = index % 9 === 0 || index % 11 === 0;
              const medium = index % 4 === 0 || index % 7 === 0;

              return (
                <span
                  key={index}
                  className={`h-3.5 w-3.5 rounded-full ${
                    strong ? "bg-info-500" : medium ? "bg-info-100" : "bg-info-50"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
