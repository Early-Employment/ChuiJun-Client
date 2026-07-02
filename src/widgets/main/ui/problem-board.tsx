"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { problemKeys } from "@/entities/problem/api/problem-keys";
import { ChevronDownIcon } from "@/shared/assets/ChevronDownIcon";
import { useDebouncedValue } from "@/shared/lib/use-debounced-value";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";

const rowsPerPage = 10;
const searchDebounceMs = 200;

// 검색어 입력창은 결과 목록과 별도 Suspense 경계에 둔다.
// 그래야 디바운스 후 재조회로 목록이 로딩 상태에 빠져도 입력창(과 포커스)이 유지된다.
function ProblemBoard() {
  const [keyword, setKeyword] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("전체");
  const [selectedProblemStatus, setSelectedProblemStatus] = useState("전체");
  const [selectedLanguage, setSelectedLanguage] = useState("전체");
  const debouncedKeyword = useDebouncedValue(keyword, searchDebounceMs);
  const [currentPage, setCurrentPage] = useState(1);
  const [, startTransition] = useTransition();

  return (
    <section className="space-y-4">
      <div className="border-line bg-surface rounded-lg border p-2">
        <div className="border-line bg-surface flex items-center justify-between gap-3 rounded-md border px-4 py-4">
          <input
            type="text"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              startTransition(() => setCurrentPage(1));
            }}
            placeholder="문제 제목 입력"
            className="text-body placeholder:text-placeholder w-full bg-transparent outline-none"
          />
          <span className="text-placeholder text-3xl leading-none">⌕</span>
        </div>
      </div>

      <ProblemSelectFilters
        selectedLevel={selectedLevel}
        selectedProblemStatus={selectedProblemStatus}
        selectedLanguage={selectedLanguage}
        onSelectLevel={(level) => {
          setSelectedLevel(level);
          startTransition(() => setCurrentPage(1));
        }}
        onSelectProblemStatus={(problemStatus) => {
          setSelectedProblemStatus(problemStatus);
          startTransition(() => setCurrentPage(1));
        }}
        onSelectLanguage={(language) => {
          setSelectedLanguage(language);
          startTransition(() => setCurrentPage(1));
        }}
      />

      <QueryBoundary
        loadingFallback={<ProblemBoardResults.Loading />}
        errorFallback={ProblemBoardResults.Error}
      >
        <ProblemBoardResults
          keyword={debouncedKeyword}
          selectedLevel={selectedLevel}
          currentPage={currentPage}
          onPageChange={(page) => startTransition(() => setCurrentPage(page))}
        />
      </QueryBoundary>
    </section>
  );
}

function ProblemBoardResults({
  keyword,
  selectedLevel,
  currentPage,
  onPageChange,
}: {
  keyword: string;
  selectedLevel: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const { data: problemPage } = useSuspenseQuery(
    problemKeys.list(currentPage - 1, rowsPerPage, keyword),
  );
  const filteredItems = problemPage.items.filter((item) => {
    const matchesLevel = selectedLevel === "전체" || item.level === selectedLevel;

    return matchesLevel;
  });

  if (filteredItems.length === 0) {
    return <ProblemBoardResults.Empty />;
  }

  const totalPages = Math.max(1, problemPage.totalPages);
  const startIndex = problemPage.page * problemPage.size;
  const emptyRowCount = problemPage.size - filteredItems.length;

  return (
    <>
      <div className="border-line bg-surface overflow-hidden rounded-lg border">
        <ul className="divide-line divide-y md:hidden">
          {filteredItems.map((row, index) => (
            <li key={row.id} className="space-y-3 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <Link
                    href={`/problems/${row.id}`}
                    className="text-body text-foreground block truncate font-semibold hover:underline"
                  >
                    {row.title}
                  </Link>
                  <span className="bg-surface-accent text-accent-strong inline-flex rounded-full px-2.5 py-1 text-xs font-medium">
                    {row.category}
                  </span>
                </div>
                <span className="text-muted text-label shrink-0">#{startIndex + index + 1}</span>
              </div>
              <dl className="text-label grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <dt className="text-muted">난이도</dt>
                  <dd className="text-foreground">{row.level}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-muted">정답률</dt>
                  <dd className="text-foreground">{row.acceptRate}%</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[80px]" />
              <col />
              <col className="w-[120px]" />
              <col className="w-[140px]" />
            </colgroup>
            <thead className="bg-surface-subtle">
              <tr>
                <th className="text-label text-foreground px-6 py-4 text-center font-bold">순번</th>
                <th className="text-label text-foreground px-6 py-4 text-center font-bold">제목</th>
                <th className="text-label text-foreground px-6 py-4 text-center font-bold">
                  난이도
                </th>
                <th className="text-label text-foreground px-6 py-4 text-center font-bold">
                  정답률
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((row, index) => (
                <tr key={row.id} className="border-line text-body text-foreground border-t">
                  <td className="px-6 py-5 text-center">{startIndex + index + 1}</td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Link
                        href={`/problems/${row.id}`}
                        className="block w-full text-center hover:underline"
                      >
                        {row.title}
                      </Link>
                      <span className="bg-surface-accent text-accent-strong inline-flex rounded-full px-2.5 py-1 text-xs font-medium">
                        {row.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">{row.level}</td>
                  <td className="px-6 py-5 text-center">{row.acceptRate}%</td>
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
            onPageChange(Math.max(1, currentPage - 1));
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
                onPageChange(page);
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
            onPageChange(Math.min(totalPages, currentPage + 1));
          }}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
      </div>
    </>
  );
}

function ProblemSelectFilters({
  selectedLevel,
  selectedProblemStatus,
  selectedLanguage,
  onSelectLevel,
  onSelectProblemStatus,
  onSelectLanguage,
}: {
  selectedLevel: string;
  selectedProblemStatus: string;
  selectedLanguage: string;
  onSelectLevel: (level: string) => void;
  onSelectProblemStatus: (problemStatus: string) => void;
  onSelectLanguage: (language: string) => void;
}) {
  const levels = ["전체", "lv. 1", "lv. 2", "lv. 3", "lv. 4", "lv. 5"];
  const problemStatuses = ["전체"];
  const languages = ["전체"];

  return (
    <div className="border-line bg-surface grid gap-3 rounded-lg border p-2 md:grid-cols-2 xl:grid-cols-3">
      <FilterSelect
        label="난이도"
        value={selectedLevel}
        options={levels}
        onChange={onSelectLevel}
      />
      <FilterSelect
        label="문제 상태"
        value={selectedProblemStatus}
        options={problemStatuses}
        onChange={onSelectProblemStatus}
      />
      <FilterSelect
        label="언어"
        value={selectedLanguage}
        options={languages}
        onChange={onSelectLanguage}
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="border-line bg-surface text-foreground relative flex items-center rounded-md border px-5 py-4">
      <span className="text-body pointer-events-none">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="text-body absolute inset-0 w-full cursor-pointer appearance-none rounded-md bg-transparent px-5 pr-14 text-transparent outline-none"
        aria-label={label}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-muted ml-auto text-sm">{value}</span>
      <ChevronDownIcon className="text-foreground pointer-events-none ml-3 size-4 shrink-0" />
    </label>
  );
}

function ProblemBoardResultsLoading() {
  return <Skeleton className="h-[560px] w-full rounded-lg" />;
}

function ProblemBoardResultsError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="text-muted flex h-[480px] flex-col items-center justify-center gap-2 text-sm">
      <p>문제 목록을 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </div>
  );
}

function ProblemBoardResultsEmpty() {
  return (
    <div className="text-muted flex h-[480px] items-center justify-center text-sm">
      아직 표시할 문제가 없어요.
    </div>
  );
}

ProblemBoardResults.Loading = ProblemBoardResultsLoading;
ProblemBoardResults.Error = ProblemBoardResultsError;
ProblemBoardResults.Empty = ProblemBoardResultsEmpty;

export function ProblemBoardBoundary() {
  return <ProblemBoard />;
}
