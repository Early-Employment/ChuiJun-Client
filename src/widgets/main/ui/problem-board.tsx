"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { problemKeys } from "@/entities/problem/api/problem-keys";
import {
  PROBLEM_ALGORITHM_TYPES,
  PROBLEM_ALGORITHM_TYPE_LABELS,
  type ProblemAlgorithmType,
} from "@/entities/problem/model/problem-algorithm-type";
import type { ProblemFilter } from "@/entities/problem/model/problem-filter";
import {
  PROBLEM_LEVELS,
  toProblemLevelLabel,
  type ProblemLevel,
} from "@/entities/problem/model/problem-level";
import {
  PROBLEM_SOLVE_STATUSES,
  PROBLEM_SOLVE_STATUS_LABELS,
  type ProblemSolveStatus,
} from "@/entities/problem/model/problem-solve-status";
import { ChevronDownIcon } from "@/shared/assets/ChevronDownIcon";
import { useDebouncedValue } from "@/shared/lib/use-debounced-value";
import { useIsAuthenticated } from "@/shared/lib/use-is-authenticated";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";

const rowsPerPage = 10;
const searchDebounceMs = 200;

// "전체" 는 필터를 걸지 않는다는 뜻이므로 빈 문자열을 값으로 쓰고, 요청에서는 제외한다.
const ALL_OPTION_VALUE = "";

interface FilterOption {
  value: string;
  label: string;
}

const allOption: FilterOption = { value: ALL_OPTION_VALUE, label: "전체" };

const levelOptions: FilterOption[] = [
  allOption,
  ...PROBLEM_LEVELS.map((level) => ({ value: level, label: toProblemLevelLabel(level) })),
];

const solveStatusOptions: FilterOption[] = [
  allOption,
  ...PROBLEM_SOLVE_STATUSES.map((status) => ({
    value: status,
    label: PROBLEM_SOLVE_STATUS_LABELS[status],
  })),
];

const algorithmTypeOptions: FilterOption[] = [
  allOption,
  ...PROBLEM_ALGORITHM_TYPES.map((algorithmType) => ({
    value: algorithmType,
    label: PROBLEM_ALGORITHM_TYPE_LABELS[algorithmType],
  })),
];

// 검색어 입력창은 결과 목록과 별도 Suspense 경계에 둔다.
// 그래야 디바운스 후 재조회로 목록이 로딩 상태에 빠져도 입력창(과 포커스)이 유지된다.
function ProblemBoard() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebouncedValue(keyword, searchDebounceMs);
  const [level, setLevel] = useState<ProblemLevel | undefined>(undefined);
  const [solveStatus, setSolveStatus] = useState<ProblemSolveStatus | undefined>(undefined);
  const [algorithmType, setAlgorithmType] = useState<ProblemAlgorithmType | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  // solveStatus 는 회원 기준으로 계산돼 비로그인 요청은 401 이 난다. 로그인 전에는 잠근다.
  const isAuthenticated = useIsAuthenticated();
  const canFilterBySolveStatus = isAuthenticated === true;

  const filter: ProblemFilter = {
    keyword: debouncedKeyword,
    level,
    solveStatus: canFilterBySolveStatus ? solveStatus : undefined,
    algorithmType,
  };

  // 필터가 바뀌면 이전 페이지 번호가 새 결과 범위를 벗어날 수 있으므로 첫 페이지로 되돌린다.
  const resetToFirstPage = () => startTransition(() => setCurrentPage(1));

  return (
    <section className="space-y-4">
      <div className="border-line bg-surface rounded-lg border p-2">
        <div className="border-line bg-surface flex items-center justify-between gap-3 rounded-md border px-4 py-4">
          <input
            type="text"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value);
              resetToFirstPage();
            }}
            placeholder="문제 제목 입력"
            className="text-body placeholder:text-placeholder w-full bg-transparent outline-none"
          />
          <span className="text-placeholder text-3xl leading-none">⌕</span>
        </div>
      </div>

      <ProblemSelectFilters
        level={level}
        solveStatus={solveStatus}
        algorithmType={algorithmType}
        canFilterBySolveStatus={canFilterBySolveStatus}
        onLevelChange={(value) => {
          setLevel(value);
          resetToFirstPage();
        }}
        onSolveStatusChange={(value) => {
          setSolveStatus(value);
          resetToFirstPage();
        }}
        onAlgorithmTypeChange={(value) => {
          setAlgorithmType(value);
          resetToFirstPage();
        }}
      />

      <QueryBoundary
        loadingFallback={<ProblemBoardResults.Loading />}
        errorFallback={ProblemBoardResults.Error}
      >
        <ProblemBoardResults
          filter={filter}
          currentPage={currentPage}
          isPending={isPending}
          onPageChange={(page) => startTransition(() => setCurrentPage(page))}
        />
      </QueryBoundary>
    </section>
  );
}

function ProblemBoardResults({
  filter,
  currentPage,
  isPending,
  onPageChange,
}: {
  filter: ProblemFilter;
  currentPage: number;
  isPending: boolean;
  onPageChange: (page: number) => void;
}) {
  const { data: problemPage } = useSuspenseQuery(
    problemKeys.list(currentPage - 1, rowsPerPage, filter),
  );
  if (problemPage.items.length === 0) {
    const isFiltered = Object.values(filter).some(Boolean);
    return <ProblemBoardResults.Empty isFiltered={isFiltered} />;
  }

  const totalPages = Math.max(1, problemPage.totalPages);
  const startIndex = problemPage.page * problemPage.size;
  const emptyRowCount = problemPage.size - problemPage.items.length;

  return (
    <>
      <div
        className={`border-line bg-surface overflow-hidden rounded-lg border transition-opacity ${
          isPending ? "opacity-60" : "opacity-100"
        }`}
      >
        <ul className="divide-line divide-y md:hidden">
          {problemPage.items.map((row, index) => (
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
                    {PROBLEM_ALGORITHM_TYPE_LABELS[row.algorithmType]}
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
              {problemPage.items.map((row, index) => (
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
                        {PROBLEM_ALGORITHM_TYPE_LABELS[row.algorithmType]}
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
      {isPending ? (
        <p className="text-muted text-center text-xs" aria-live="polite">
          문제 목록을 불러오는 중이에요.
        </p>
      ) : null}
    </>
  );
}

function ProblemSelectFilters({
  level,
  solveStatus,
  algorithmType,
  canFilterBySolveStatus,
  onLevelChange,
  onSolveStatusChange,
  onAlgorithmTypeChange,
}: {
  level: ProblemLevel | undefined;
  solveStatus: ProblemSolveStatus | undefined;
  algorithmType: ProblemAlgorithmType | undefined;
  canFilterBySolveStatus: boolean;
  onLevelChange: (value: ProblemLevel | undefined) => void;
  onSolveStatusChange: (value: ProblemSolveStatus | undefined) => void;
  onAlgorithmTypeChange: (value: ProblemAlgorithmType | undefined) => void;
}) {
  return (
    <div className="border-line bg-surface grid gap-3 rounded-lg border p-2 md:grid-cols-2 xl:grid-cols-3">
      <FilterSelect
        label="난이도"
        value={level ?? ALL_OPTION_VALUE}
        options={levelOptions}
        onChange={(value) => onLevelChange((value as ProblemLevel) || undefined)}
      />
      <FilterSelect
        label="문제 상태"
        value={solveStatus ?? ALL_OPTION_VALUE}
        options={solveStatusOptions}
        disabled={!canFilterBySolveStatus}
        hint={canFilterBySolveStatus ? undefined : "로그인 후 사용할 수 있어요."}
        onChange={(value) => onSolveStatusChange((value as ProblemSolveStatus) || undefined)}
      />
      <FilterSelect
        label="알고리즘 유형"
        value={algorithmType ?? ALL_OPTION_VALUE}
        options={algorithmTypeOptions}
        onChange={(value) => onAlgorithmTypeChange((value as ProblemAlgorithmType) || undefined)}
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  disabled = false,
  hint,
  onChange,
}: {
  label: string;
  value: string;
  options: FilterOption[];
  disabled?: boolean;
  hint?: string;
  onChange: (value: string) => void;
}) {
  const selectedLabel = options.find((option) => option.value === value)?.label ?? allOption.label;

  return (
    <label
      title={hint}
      className={`border-line bg-surface text-foreground relative flex items-center rounded-md border px-5 py-4 ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <span className="text-body pointer-events-none">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="absolute inset-0 w-full cursor-pointer appearance-none rounded-md bg-transparent opacity-0 outline-none disabled:cursor-default"
        aria-label={hint ? `${label} (${hint})` : label}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="text-muted ml-auto text-sm">{selectedLabel}</span>
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

function ProblemBoardResultsEmpty({ isFiltered = false }: { isFiltered?: boolean }) {
  return (
    <div className="text-muted flex h-[480px] items-center justify-center text-sm">
      {isFiltered ? "조건에 맞는 문제가 없어요." : "아직 표시할 문제가 없어요."}
    </div>
  );
}

ProblemBoardResults.Loading = ProblemBoardResultsLoading;
ProblemBoardResults.Error = ProblemBoardResultsError;
ProblemBoardResults.Empty = ProblemBoardResultsEmpty;

export function ProblemBoardBoundary() {
  return <ProblemBoard />;
}
