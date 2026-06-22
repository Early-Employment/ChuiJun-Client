"use client";

import Link from "next/link";
import { useSuspenseQueries } from "@tanstack/react-query";
import { classroomSummaryKeys } from "@/entities/classroom/api/classroom-summary-keys";
import { classroomViewerKeys } from "@/entities/classroom/api/classroom-viewer-keys";
import type { ClassroomSummary } from "@/entities/classroom/model/classroom-summary";
import { PlusCircleIcon } from "@/shared/assets/PlusCircleIcon";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";

/**
 * /class 진입 시 교사·학생 모두가 거쳐가는 학급 목록 화면.
 * 카드를 누르면 역할별 학급 상세(/class/[classId])로 진입한다.
 * "수업 추가"는 교사만 노출한다.
 */
function ClassroomListWidget() {
  const [{ data: classrooms }, { data: viewer }] = useSuspenseQueries({
    queries: [classroomSummaryKeys.list(), classroomViewerKeys.current()],
  });

  if (classrooms.length === 0) {
    return <ClassroomListWidget.Empty />;
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 xl:px-10">
      <section className="mx-auto w-full max-w-[1160px] space-y-7">
        <header className="flex items-center justify-between gap-4">
          <h1 className="text-foreground text-[40px] leading-none font-semibold">학급</h1>
          {viewer.role === "teacher" ? (
            <button
              type="button"
              className="text-foreground flex shrink-0 items-center gap-2 text-xl font-medium sm:text-2xl"
            >
              <PlusCircleIcon className="size-7" />
              수업 추가
            </button>
          ) : null}
        </header>

        <ul className="grid grid-cols-1 gap-x-[29px] gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {classrooms.map((classroom) => (
            <ClassroomCard key={classroom.id} classroom={classroom} />
          ))}
        </ul>
      </section>
    </main>
  );
}

function ClassroomCard({ classroom }: { classroom: ClassroomSummary }) {
  return (
    <li className="relative">
      <Link
        href={`/class/${classroom.id}`}
        className="border-line-strong block w-full overflow-hidden rounded-xl border"
      >
        <div className="bg-primary-350 border-line-strong flex flex-col gap-2.5 border-b px-7 py-5">
          <p className="text-foreground text-base font-medium">{classroom.courseName}</p>
          <p className="text-muted text-sm">{classroom.classLabel}</p>
        </div>
        <div className="bg-surface-subtle flex items-center px-7 py-5">
          <p className="text-foreground text-base">{classroom.teacherName}</p>
        </div>
      </Link>

      <span
        aria-hidden="true"
        className="bg-line border-line-strong text-foreground pointer-events-none absolute top-[52px] right-[18px] flex size-[88px] items-center justify-center rounded-full border text-2xl font-medium"
      >
        {classroom.avatarLabel}
      </span>
    </li>
  );
}

function ClassroomListWidgetLoading() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 xl:px-10">
      <section className="mx-auto w-full max-w-[1160px] space-y-7">
        <header className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-8 w-28" />
        </header>

        <div className="grid grid-cols-1 gap-x-[29px] gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-[174px] w-full rounded-xl" />
          ))}
        </div>
      </section>
    </main>
  );
}

function ClassroomListWidgetError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="text-muted flex min-h-[480px] flex-col items-center justify-center gap-2 px-4 text-sm">
      <p>학급 목록을 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </div>
  );
}

function ClassroomListWidgetEmpty() {
  return (
    <div className="text-muted flex min-h-[480px] items-center justify-center px-4 text-sm">
      아직 소속된 학급이 없어요.
    </div>
  );
}

ClassroomListWidget.Loading = ClassroomListWidgetLoading;
ClassroomListWidget.Error = ClassroomListWidgetError;
ClassroomListWidget.Empty = ClassroomListWidgetEmpty;

export function ClassroomListWidgetBoundary() {
  return (
    <QueryBoundary
      loadingFallback={<ClassroomListWidget.Loading />}
      errorFallback={ClassroomListWidget.Error}
    >
      <ClassroomListWidget />
    </QueryBoundary>
  );
}
