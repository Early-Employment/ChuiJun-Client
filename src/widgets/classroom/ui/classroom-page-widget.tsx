"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { classroomDashboardKeys } from "@/entities/classroom/api/classroom-dashboard-keys";
import type {
  ClassroomAssignment,
  ClassroomMetric,
  ClassroomStudent,
} from "@/entities/classroom/model/classroom-dashboard";
import { AssignmentIcon } from "@/shared/assets/AssignmentIcon";
import { MoreVerticalIcon } from "@/shared/assets/MoreVerticalIcon";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";

function ClassroomPageWidget() {
  const { data } = useSuspenseQuery(classroomDashboardKeys.current());

  if (data.students.length === 0 && data.assignments.length === 0) {
    return <ClassroomPageWidget.Empty />;
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] bg-neutral-50 px-4 py-8 sm:px-8 lg:py-10 xl:px-10">
      <section className="mx-auto w-full max-w-[1160px] space-y-7">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="text-foreground text-[40px] leading-none font-semibold">학급</h1>
            <p className="text-muted pt-1 text-xl font-medium">{data.classLabel}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="border-line-strong bg-surface text-foreground rounded-md border px-7 py-4 text-base font-medium"
            >
              학생 초대
            </button>
            <button
              type="button"
              className="bg-accent text-neutral-0 rounded-md px-7 py-4 text-base font-medium"
            >
              과제 추가하기
            </button>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-9">
          {data.metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,261px)_minmax(0,1fr)] lg:items-start lg:gap-[22px]">
          <section className="border-line-strong bg-surface rounded-xl border p-5">
            <ul className="space-y-1">
              {data.students.map((student) => (
                <StudentRow key={student.id} student={student} />
              ))}
            </ul>
          </section>

          <section className="border-line-strong bg-surface overflow-hidden rounded-xl border">
            <ul>
              {data.assignments.map((assignment, index) => (
                <AssignmentRow
                  key={assignment.id}
                  assignment={assignment}
                  isLast={index === data.assignments.length - 1}
                />
              ))}
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ metric }: { metric: ClassroomMetric }) {
  return (
    <article className="border-line-strong bg-surface rounded-xl border px-5 py-5 sm:px-6 sm:py-6">
      <p className="text-foreground text-xl font-medium">{metric.label}</p>
      <p className="text-foreground mt-12 text-right text-[22px] font-semibold sm:text-[32px]">
        {metric.value}
      </p>
    </article>
  );
}

function StudentRow({ student }: { student: ClassroomStudent }) {
  const avatarClassName =
    student.avatarVariant === "highlight"
      ? "border-line-strong bg-primary-50 text-reward border"
      : "bg-line text-line";

  return (
    <li className="flex items-center justify-between gap-3 rounded-lg px-1 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex size-[33px] shrink-0 items-center justify-center rounded-full ${avatarClassName}`}
        >
          {student.avatarVariant === "highlight" ? (
            <span className="text-xs leading-none">*</span>
          ) : null}
        </div>
        <p className="text-foreground truncate text-[20px] font-medium">{student.name}</p>
      </div>
      <button
        type="button"
        aria-label={`${student.name} 더보기`}
        className="text-foreground flex size-8 shrink-0 items-center justify-center"
      >
        <MoreVerticalIcon className="size-[15px]" />
      </button>
    </li>
  );
}

function AssignmentRow({
  assignment,
  isLast,
}: {
  assignment: ClassroomAssignment;
  isLast: boolean;
}) {
  return (
    <li className={`px-7 py-6 ${isLast ? "" : "border-line-strong border-b"}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-foreground truncate text-base font-semibold">{assignment.title}</p>
            {assignment.isPinned ? (
              <span className="bg-line text-muted flex size-8 shrink-0 items-center justify-center rounded-[10px]">
                <AssignmentIcon className="size-4" />
              </span>
            ) : null}
          </div>
          <p className="text-muted mt-2 text-[15px] font-medium">{assignment.submissionLabel}</p>
        </div>

        <button
          type="button"
          className="border-line-strong bg-surface text-foreground shrink-0 self-start rounded-xl border px-4 py-2 text-[15px] font-medium"
        >
          수정
        </button>
      </div>
    </li>
  );
}

function ClassroomPageWidgetLoading() {
  return (
    <main className="mx-auto w-full max-w-[1440px] bg-neutral-50 px-4 py-8 sm:px-8 lg:py-10 xl:px-10">
      <section className="mx-auto w-full max-w-[1160px] space-y-7">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-7 w-24" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-[58px] w-[110px] rounded-md" />
            <Skeleton className="h-[58px] w-[143px] rounded-md" />
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-9">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-[128px] w-full rounded-xl" />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,261px)_minmax(0,1fr)] lg:items-start lg:gap-[22px]">
          <Skeleton className="h-[250px] w-full rounded-xl" />
          <Skeleton className="h-[386px] w-full rounded-xl" />
        </div>
      </section>
    </main>
  );
}

function ClassroomPageWidgetError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="text-muted flex min-h-[480px] flex-col items-center justify-center gap-2 px-4 text-sm">
      <p>학급 정보를 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </div>
  );
}

function ClassroomPageWidgetEmpty() {
  return (
    <div className="text-muted flex min-h-[480px] items-center justify-center px-4 text-sm">
      아직 표시할 학급 정보가 없어요.
    </div>
  );
}

ClassroomPageWidget.Loading = ClassroomPageWidgetLoading;
ClassroomPageWidget.Error = ClassroomPageWidgetError;
ClassroomPageWidget.Empty = ClassroomPageWidgetEmpty;

export function ClassroomPageWidgetBoundary() {
  return (
    <QueryBoundary
      loadingFallback={<ClassroomPageWidget.Loading />}
      errorFallback={ClassroomPageWidget.Error}
    >
      <ClassroomPageWidget />
    </QueryBoundary>
  );
}
