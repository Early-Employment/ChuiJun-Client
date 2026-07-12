import type { CSSProperties } from "react";
import type { JudgeReport, TestcaseOutcome } from "@/features/code-judge/model/judge";
import type { SolveState } from "@/features/code-judge/model/use-solve-flow";
import { Spinner } from "@/shared/ui/spinner";

const PENDING_LABELS = {
  running: "실행 중…",
  judging: "검사 중…",
  submitting: "제출 중…",
} as const;

export function RunResultPanel({ state }: { state: SolveState }) {
  return (
    <div className="border-line bg-surface space-y-3 rounded-md border p-3">
      <p className="text-muted text-lg font-medium">실행 결과</p>
      <hr className="border-line" />
      <RunResultBody state={state} />
    </div>
  );
}

function RunResultBody({ state }: { state: SolveState }) {
  if (state.phase === "running" || state.phase === "judging" || state.phase === "submitting") {
    return (
      <div className="text-muted flex h-80 items-center justify-center gap-2 text-sm">
        <Spinner size={18} />
        {PENDING_LABELS[state.phase]}
      </div>
    );
  }

  if (state.phase === "ran") {
    if (state.examples.length === 0) {
      return (
        <div className="text-muted flex h-80 items-center justify-center text-sm">
          제공된 예제가 없어요.
        </div>
      );
    }
    const passedCount = state.examples.filter((outcome) => outcome.passed).length;
    return (
      <OutcomeReport
        label="예제"
        outcomes={state.examples}
        summary={`${state.examples.length}개 중 ${passedCount}개 일치`}
      />
    );
  }

  const report = reportOf(state);
  if (report) {
    return (
      <OutcomeReport
        label="테스트"
        outcomes={report.outcomes}
        summary={`${report.result.totalCount}개 중 ${report.result.passedCount}개 성공`}
      />
    );
  }

  return (
    <div className="text-muted flex h-80 items-center justify-center text-sm">
      코드를 실행하거나 제출해 보세요.
    </div>
  );
}

/** 채점이 끝난 상태에만 리포트가 있다. 채점기 자체가 실패한 error 는 리포트가 없다. */
function reportOf(state: SolveState): JudgeReport | null {
  if (state.phase === "solved" || state.phase === "wrong") return state.report;
  if (state.phase === "error" && state.cause === "submit") return state.report;
  return null;
}

function OutcomeReport({
  label,
  outcomes,
  summary,
}: {
  label: string;
  outcomes: TestcaseOutcome[];
  summary: string;
}) {
  return (
    <div className="flex h-80 flex-col gap-3">
      <div className="bg-surface-subtle min-h-0 flex-1 space-y-4 overflow-y-auto rounded-md px-5 py-3">
        {outcomes.map((outcome, index) => (
          <TestcaseBlock
            key={outcome.index}
            label={label}
            outcome={outcome}
            style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
          />
        ))}
      </div>
      <p className="shrink-0 text-sm font-medium">{summary}</p>
    </div>
  );
}

function TestcaseBlock({
  label,
  outcome,
  style,
}: {
  label: string;
  outcome: TestcaseOutcome;
  style?: CSSProperties;
}) {
  return (
    <div className="animate-stagger-item space-y-1 text-sm" style={style}>
      <p className="text-foreground font-medium">
        {label} {outcome.index + 1}
      </p>
      <Row label="입력값" value={outcome.input} />
      <Row label="기대값" value={outcome.expected} />
      <div className="flex gap-2">
        <span className="text-muted w-16 shrink-0">실행결과 &gt;</span>
        <span
          className={`font-medium ${outcome.passed ? "text-state-success" : "text-state-danger"}`}
        >
          {resultMessage(outcome)}
        </span>
      </div>
      <Row label="출력" value={outcome.received} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted w-16 shrink-0">{label} &gt;</span>
      <span className="text-foreground whitespace-pre-wrap">{value || "(없음)"}</span>
    </div>
  );
}

function resultMessage(outcome: TestcaseOutcome): string {
  if (outcome.passed) return "실행결과가 기대값이랑 같습니다";
  if (outcome.status === "timeout") return "시간 초과";
  if (outcome.status === "error") return "런타임 에러";
  return "실행결과가 기대값과 다릅니다";
}
