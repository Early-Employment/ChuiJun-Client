import type { Testcase } from "@/entities/problem/model/problem-detail";
import type { JudgeStatus, SubmissionResult } from "@/entities/submission/model/submission";
import { runPython, type RunResult } from "@/shared/lib/pyodide/python-runner";
import { normalizeOutput } from "@/features/code-judge/model/normalize-output";

export interface TestcaseOutcome {
  index: number;
  passed: boolean;
  status: RunResult["status"];
  /** 주입한 표준 입력값 */
  input: string;
  expected: string;
  /** 통과 시 실제 출력, 에러 시 traceback, 타임아웃 시 안내 문구 */
  received: string;
}

export interface JudgeReport {
  result: SubmissionResult;
  outcomes: TestcaseOutcome[];
}

/** 테스트케이스를 순차 실행해 케이스별 결과를 만든다. 각 케이스는 timeLimitMs 안에 끝나야 한다. */
export async function runTestcases(
  code: string,
  testcases: Testcase[],
  timeLimitMs: number,
): Promise<TestcaseOutcome[]> {
  const outcomes: TestcaseOutcome[] = [];

  for (const [index, testcase] of testcases.entries()) {
    const run = await runPython(code, testcase.input, timeLimitMs);
    const expected = normalizeOutput(testcase.expectedOutput);
    const received = describeOutput(run);
    const passed = run.status === "ok" && received === expected;
    outcomes.push({
      index,
      passed,
      status: run.status,
      input: testcase.input,
      expected,
      received,
    });
  }

  return outcomes;
}

/** 테스트케이스를 전수 채점해 제출용 리포트를 만든다. */
export async function judge(
  problemId: number,
  code: string,
  testcases: Testcase[],
  timeLimitMs: number,
): Promise<JudgeReport> {
  const start = performance.now();
  const outcomes = await runTestcases(code, testcases, timeLimitMs);
  const passedCount = outcomes.filter((outcome) => outcome.passed).length;

  return {
    result: {
      problemId,
      passed: passedCount === testcases.length && testcases.length > 0,
      passedCount,
      totalCount: testcases.length,
      durationMs: Math.round(performance.now() - start),
      judgeStatus: deriveJudgeStatus(outcomes),
    },
    outcomes,
  };
}

/** 케이스별 결과로 서버 제출용 판정을 정한다. 전부 통과 → AC, 그 외엔 실패 사유 우선순위로. */
function deriveJudgeStatus(outcomes: TestcaseOutcome[]): JudgeStatus {
  if (outcomes.length > 0 && outcomes.every((outcome) => outcome.passed)) return "AC";
  if (outcomes.some((outcome) => outcome.status === "timeout")) return "TLE";
  if (outcomes.some((outcome) => outcome.status === "error")) return "RE";
  return "WA";
}

function describeOutput(run: RunResult): string {
  if (run.status === "ok") return normalizeOutput(run.stdout);
  if (run.status === "error") return run.message;
  return "시간 초과";
}
