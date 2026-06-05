import { Spinner } from "@/shared/ui/spinner";
import type { RunResult } from "@/shared/lib/pyodide/python-runner";
import type { JudgeReport, TestcaseOutcome } from "@/features/code-judge/model/judge";

interface Props {
  running: boolean;
  runResult: RunResult | null;
  report: JudgeReport | null;
}

export function RunResultPanel({ running, runResult, report }: Props) {
  return (
    <div className="border-line bg-surface space-y-3 rounded-md border p-3">
      <p className="text-muted text-lg font-medium">실행 결과</p>
      <hr className="border-line" />
      <Body running={running} runResult={runResult} report={report} />
    </div>
  );
}

function Body({ running, runResult, report }: Props) {
  if (running) {
    return (
      <div className="text-muted flex h-24 items-center justify-center gap-2 text-sm">
        <Spinner size={18} />
        실행 중…
      </div>
    );
  }

  if (report) {
    return (
      <div className="space-y-3">
        <div className="bg-surface-subtle space-y-4 rounded-md px-5 py-3">
          {report.outcomes.map((outcome) => (
            <TestcaseBlock key={outcome.index} outcome={outcome} />
          ))}
        </div>
        <p className="text-sm font-medium">
          {report.result.totalCount}개 중 {report.result.passedCount}개 성공
        </p>
      </div>
    );
  }

  if (runResult) {
    return <FreeRunOutput result={runResult} />;
  }

  return (
    <div className="text-muted flex h-24 items-center justify-center text-sm">
      코드를 실행하거나 제출해 보세요.
    </div>
  );
}

function TestcaseBlock({ outcome }: { outcome: TestcaseOutcome }) {
  return (
    <div className="space-y-1 text-sm">
      <p className="text-foreground font-medium">테스트 {outcome.index + 1}</p>
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

function FreeRunOutput({ result }: { result: RunResult }) {
  if (result.status === "timeout") {
    return <OutputBox tone="warning" text="실행이 제한 시간을 초과했어요." />;
  }
  if (result.status === "error") {
    return <OutputBox tone="danger" text={result.message} />;
  }
  return <OutputBox tone="neutral" text={result.stdout || "(출력 없음)"} />;
}

const TONE_CLASS = {
  neutral: "text-foreground",
  danger: "text-state-danger",
  warning: "text-state-warning",
} as const;

function OutputBox({ tone, text }: { tone: keyof typeof TONE_CLASS; text: string }) {
  return (
    <pre
      className={`bg-surface-subtle overflow-x-auto rounded-md p-3 text-sm whitespace-pre-wrap ${TONE_CLASS[tone]}`}
    >
      {text}
    </pre>
  );
}
