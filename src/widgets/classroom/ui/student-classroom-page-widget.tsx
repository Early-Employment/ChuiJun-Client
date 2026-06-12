"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { studentClassroomKeys } from "@/entities/classroom/api/student-classroom-keys";
import type {
  StudentAssignment,
  StudentUpcomingAssignment,
} from "@/entities/classroom/model/student-classroom";
import { AssignmentIcon } from "@/shared/assets/AssignmentIcon";
import { CheckCircleIcon } from "@/shared/assets/CheckCircleIcon";
import { LogoIcon } from "@/shared/assets/LogoIcon";
import { XCircleIcon } from "@/shared/assets/XCircleIcon";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";

function StudentClassroomPageWidget() {
  const { data } = useSuspenseQuery(studentClassroomKeys.current());

  if (data.assignments.length === 0 && data.upcomingAssignments.length === 0) {
    return <StudentClassroomPageWidget.Empty />;
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 xl:px-10">
      <section className="mx-auto w-full max-w-[1160px] space-y-6">
        <ClassroomHero classroomName={data.classroomName} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,268px)_minmax(0,1fr)] lg:items-start lg:gap-[22px]">
          <UpcomingAssignmentsCard items={data.upcomingAssignments} />

          <section className="space-y-3">
            {data.assignments.map((assignment) => (
              <AssignmentCard key={assignment.id} assignment={assignment} />
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}

function ClassroomHero({ classroomName }: { classroomName: string }) {
  return (
    <section className="bg-primary-350 relative h-[312px] overflow-hidden rounded-[20px]">
      <h1 className="text-neutral-0 absolute top-9 left-9 text-[40px] font-bold whitespace-nowrap lg:text-[50px]">
        {classroomName}
      </h1>

      {/* 우측 마스코트 장식 (작은 화면에서는 숨김) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <div className="bg-neutral-0 absolute top-9 right-[69px] size-[216px] rounded-full" />
        <div className="absolute top-[144px] right-[190px] size-[216px] rounded-full bg-neutral-100" />
        <LogoIcon className="absolute top-[156px] right-[91px] size-[199px]" />
      </div>
    </section>
  );
}

function UpcomingAssignmentsCard({ items }: { items: StudentUpcomingAssignment[] }) {
  return (
    <section className="border-line-strong bg-surface h-fit rounded-[10px] border px-7 py-6">
      <h2 className="text-foreground text-xl font-medium">곧 마감되는 과제</h2>

      <ul className="mt-3">
        {items.map((item, index) => (
          <UpcomingAssignmentRow key={item.id} item={item} isLast={index === items.length - 1} />
        ))}
      </ul>
    </section>
  );
}

function UpcomingAssignmentRow({
  item,
  isLast,
}: {
  item: StudentUpcomingAssignment;
  isLast: boolean;
}) {
  return (
    <li
      className={`flex items-center justify-between gap-3 py-2 ${
        isLast ? "" : "border-line-strong border-b"
      }`}
    >
      <div className="flex min-w-0 gap-2">
        <span className="bg-accent mt-1.5 size-3 shrink-0 rounded-full" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-foreground text-label truncate">{item.title}</p>
          <p className="text-muted text-caption mt-1.5">{item.deadlineLabel}</p>
        </div>
      </div>
      <span className="text-foreground text-body shrink-0 font-medium">D-{item.remainingDays}</span>
    </li>
  );
}

function AssignmentCard({ assignment }: { assignment: StudentAssignment }) {
  const isSubmitted = assignment.submissionStatus === "submitted";

  return (
    <article className="border-line-strong bg-surface-subtle flex items-center justify-between gap-4 rounded-[10px] border px-4 py-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="bg-line text-muted flex size-8 shrink-0 items-center justify-center rounded-md">
          <AssignmentIcon className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-foreground text-body truncate font-medium">{assignment.title}</p>
          <p className="text-foreground text-label mt-1.5 font-light">{assignment.dateLabel}</p>
        </div>
        {assignment.required ? (
          <span className="bg-state-danger text-neutral-0 text-label shrink-0 rounded-md px-3 py-2 font-semibold">
            필수
          </span>
        ) : null}
      </div>

      <div className="text-foreground flex w-9 shrink-0 flex-col items-center gap-1">
        {isSubmitted ? <CheckCircleIcon className="size-6" /> : <XCircleIcon className="size-6" />}
        <span className="text-caption text-[10px]">{isSubmitted ? "제출완료" : "미제출"}</span>
      </div>
    </article>
  );
}

function StudentClassroomPageWidgetLoading() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 lg:py-10 xl:px-10">
      <section className="mx-auto w-full max-w-[1160px] space-y-6">
        <Skeleton className="h-[312px] w-full rounded-[20px]" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,268px)_minmax(0,1fr)] lg:items-start lg:gap-[22px]">
          <Skeleton className="h-[180px] w-full rounded-[10px]" />
          <div className="space-y-3">
            {Array.from({ length: 2 }, (_, index) => (
              <Skeleton key={index} className="h-[84px] w-full rounded-[10px]" />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function StudentClassroomPageWidgetError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <div className="text-muted flex min-h-[480px] flex-col items-center justify-center gap-2 px-4 text-sm">
      <p>학급 정보를 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </div>
  );
}

function StudentClassroomPageWidgetEmpty() {
  return (
    <div className="text-muted flex min-h-[480px] items-center justify-center px-4 text-sm">
      아직 표시할 과제가 없어요.
    </div>
  );
}

StudentClassroomPageWidget.Loading = StudentClassroomPageWidgetLoading;
StudentClassroomPageWidget.Error = StudentClassroomPageWidgetError;
StudentClassroomPageWidget.Empty = StudentClassroomPageWidgetEmpty;

export function StudentClassroomPageWidgetBoundary() {
  return (
    <QueryBoundary
      loadingFallback={<StudentClassroomPageWidget.Loading />}
      errorFallback={StudentClassroomPageWidget.Error}
    >
      <StudentClassroomPageWidget />
    </QueryBoundary>
  );
}
