"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { assignmentKeys } from "@/entities/assignment/api/assignment-keys";
import { classroomAssignmentKeys } from "@/entities/classroom/api/classroom-assignment-keys";
import { problemKeys } from "@/entities/problem/api/problem-keys";
import { ChevronLeftIcon } from "@/shared/assets/ChevronLeftIcon";
import { QueryBoundary, type QueryErrorFallbackProps } from "@/shared/ui/query-boundary";
import { Skeleton } from "@/shared/ui/skeleton";
import { LabeledField } from "@/widgets/assignment-form/ui/labeled-field";

const fieldClassName =
  "border-line-strong bg-surface text-foreground placeholder:text-muted focus:border-accent w-full rounded-md border px-4 py-3 text-base font-medium outline-none";

// 배정 가능한 문제를 한 번에 보여줄 상한. 백엔드 목록이 커지면 검색형 셀렉터로 교체한다.
const PROBLEM_PAGE_SIZE = 100;

type AssignmentFormMode = "create" | "edit";

interface AssignmentFormProps {
  mode?: AssignmentFormMode;
  /** edit 모드에서 수정할 과제 id(라우트 [id]). */
  assignmentId?: string;
}

function toDateTimeLocalValue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toIsoDueDate(localValue: string): string {
  return new Date(localValue).toISOString();
}

function FormShell({
  title,
  backHref,
  onSubmit,
  children,
  submitLabel,
  isSubmitting,
}: {
  title: string;
  backHref: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  submitLabel: string;
  isSubmitting: boolean;
}) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-9 sm:px-6">
      <form
        onSubmit={onSubmit}
        className="border-line-strong bg-surface flex flex-col gap-5 rounded-lg border px-6 py-8 sm:px-12 sm:py-10"
      >
        <div className="flex flex-col gap-4">
          <Link
            href={backHref}
            className="text-muted flex w-fit items-center gap-1 text-base font-medium"
          >
            <ChevronLeftIcon className="size-5" />
            뒤로가기
          </Link>
          <h1 className="text-foreground text-display font-semibold">{title}</h1>
        </div>

        <div className="flex flex-col gap-4">{children}</div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-accent border-accent-strong text-foreground-inverse rounded-md border px-7 py-4 text-base font-bold disabled:opacity-60"
          >
            {isSubmitting ? "처리 중…" : submitLabel}
          </button>
        </div>
      </form>
    </main>
  );
}

function DueDateField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <LabeledField label="마감일">
      <input
        type="datetime-local"
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClassName}
      />
    </LabeledField>
  );
}

function RequiredField({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="text-foreground flex items-center gap-3 text-base font-medium">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="accent-primary-500 size-5"
      />
      필수 과제로 지정
    </label>
  );
}

function CreateAssignmentForm({ classroomId }: { classroomId: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: problemPage } = useSuspenseQuery(problemKeys.list(0, PROBLEM_PAGE_SIZE));
  const [problemId, setProblemId] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [required, setRequired] = useState(false);

  const { mutateAsync, isPending } = useMutation(assignmentKeys.create(classroomId));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (problemId === null) return;

    await mutateAsync({ problemId, dueDate: toIsoDueDate(dueDate), required });
    await queryClient.invalidateQueries({ queryKey: classroomAssignmentKeys.all });
    router.push(`/class/${classroomId}`);
  };

  return (
    <FormShell
      title="과제 출제"
      backHref={`/class/${classroomId}`}
      onSubmit={handleSubmit}
      submitLabel="작성 완료"
      isSubmitting={isPending}
    >
      <LabeledField label="문제 선택">
        <select
          required
          value={problemId ?? ""}
          onChange={(event) => setProblemId(Number(event.target.value))}
          className={fieldClassName}
        >
          <option value="" disabled>
            배정할 문제를 선택하세요
          </option>
          {problemPage.items.map((problem) => (
            <option key={problem.id} value={problem.id}>
              {problem.code} · {problem.title}
            </option>
          ))}
        </select>
      </LabeledField>

      <DueDateField value={dueDate} onChange={setDueDate} />
      <RequiredField checked={required} onChange={setRequired} />
    </FormShell>
  );
}

function EditAssignmentForm({
  classroomId,
  assignmentId,
}: {
  classroomId: number;
  assignmentId: number;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: assignments } = useSuspenseQuery(classroomAssignmentKeys.list(classroomId));
  const target = assignments.find((assignment) => assignment.assignmentId === assignmentId);

  const [dueDate, setDueDate] = useState(target ? toDateTimeLocalValue(target.dueDate) : "");
  const [required, setRequired] = useState(target?.required ?? false);

  const { mutateAsync, isPending } = useMutation(assignmentKeys.update(assignmentId));

  if (!target) {
    return <AssignmentFormFallback message="수정할 과제를 찾을 수 없어요." />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await mutateAsync({ dueDate: toIsoDueDate(dueDate), required });
    await queryClient.invalidateQueries({ queryKey: classroomAssignmentKeys.all });
    router.push(`/class/${classroomId}`);
  };

  return (
    <FormShell
      title="과제 수정"
      backHref={`/class/${classroomId}`}
      onSubmit={handleSubmit}
      submitLabel="저장"
      isSubmitting={isPending}
    >
      <LabeledField label="문제">
        <p className={`${fieldClassName} text-muted`}>{target.problemTitle}</p>
      </LabeledField>

      <DueDateField value={dueDate} onChange={setDueDate} />
      <RequiredField checked={required} onChange={setRequired} />
    </FormShell>
  );
}

function AssignmentFormFallback({ message }: { message: string }) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-9 sm:px-6">
      <div className="border-line-strong bg-surface text-muted flex min-h-[240px] items-center justify-center rounded-lg border px-6 py-8 text-sm">
        {message}
      </div>
    </main>
  );
}

function AssignmentFormLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-9 sm:px-6">
      <div className="border-line-strong bg-surface flex flex-col gap-5 rounded-lg border px-6 py-8 sm:px-12 sm:py-10">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-40 self-end rounded-md" />
      </div>
    </main>
  );
}

function AssignmentFormError({ resetErrorBoundary }: QueryErrorFallbackProps) {
  return (
    <main className="text-muted mx-auto flex min-h-[50dvh] max-w-7xl flex-col items-center justify-center gap-2 px-4 py-9 text-sm sm:px-6">
      <p>과제 정보를 불러오지 못했어요.</p>
      <button type="button" onClick={resetErrorBoundary} className="text-accent font-medium">
        다시 시도
      </button>
    </main>
  );
}

function AssignmentFormContent({ mode, assignmentId }: AssignmentFormProps) {
  const searchParams = useSearchParams();
  const classroomIdParam = searchParams.get("classroomId");
  const classroomId = classroomIdParam === null ? null : Number(classroomIdParam);

  if (classroomId === null || Number.isNaN(classroomId)) {
    return <AssignmentFormFallback message="학급 정보가 없어 과제를 배정할 수 없어요." />;
  }

  if (mode === "edit") {
    if (assignmentId === undefined) {
      return <AssignmentFormFallback message="수정할 과제 정보가 없어요." />;
    }
    return <EditAssignmentForm classroomId={classroomId} assignmentId={Number(assignmentId)} />;
  }

  return <CreateAssignmentForm classroomId={classroomId} />;
}

export function AssignmentForm({ mode = "create", assignmentId }: AssignmentFormProps) {
  return (
    <QueryBoundary loadingFallback={<AssignmentFormLoading />} errorFallback={AssignmentFormError}>
      <AssignmentFormContent mode={mode} assignmentId={assignmentId} />
    </QueryBoundary>
  );
}
