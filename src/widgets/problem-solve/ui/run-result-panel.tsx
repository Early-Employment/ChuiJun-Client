import { Spinner } from "@/shared/ui/spinner";
import type { JudgeReport, TestcaseOutcome } from "@/features/code-judge/model/judge";

interface Props {
  running: boolean;
  exampleOutcomes: TestcaseOutcome[] | null;
  report: JudgeReport | null;
}

export function RunResultPanel({ running, exampleOutcomes, report }: Props) {
  return (
    <div className="border-line bg-surface space-y-3 rounded-md border p-3">
      <p className="text-muted text-lg font-medium">실행 결과</p>
      <hr className="border-line" />
      <Body running={running} exampleOutcomes={exampleOutcomes} report={report} />
    </div>
  );
}

function Body({ running, exampleOutcomes, report }: Props) {
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
      <OutcomeReport
        label="테스트"
        outcomes={report.outcomes}
        summary={`${report.result.totalCount}개 중 ${report.result.passedCount}개 성공`}
      />
    );
  }

  if (exampleOutcomes) {
    if (exampleOutcomes.length === 0) {
      return (
        <div className="text-muted flex h-24 items-center justify-center text-sm">
          제공된 예제가 없어요.
        </div>
      );
    }
    const passedCount = exampleOutcomes.filter((outcome) => outcome.passed).length;
    return (
      <OutcomeReport
        label="예제"
        outcomes={exampleOutcomes}
        summary={`${exampleOutcomes.length}개 중 ${passedCount}개 일치`}
      />
    );
  }

  return (
    <div className="text-muted flex h-24 items-center justify-center text-sm">
      코드를 실행하거나 제출해 보세요.
    </div>
  );
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
    <div className="space-y-3">
      <div className="bg-surface-subtle space-y-4 rounded-md px-5 py-3">
        {outcomes.map((outcome) => (
          <TestcaseBlock key={outcome.index} label={label} outcome={outcome} />
        ))}
      </div>
      <p className="text-sm font-medium">{summary}</p>
    </div>
  );
}

function TestcaseBlock({ label, outcome }: { label: string; outcome: TestcaseOutcome }) {
  return (
    <div className="space-y-1 text-sm">
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
