import type { ProblemExample } from "@/entities/problem/model/problem-detail";
import { runTestcases, type TestcaseOutcome } from "@/features/code-judge/model/judge";

/** 채점과 분리된 예제 실행. 문제의 예제 입력을 그대로 주입해 케이스별로 돌린다. */
export function runExamples(
  code: string,
  examples: ProblemExample[],
  timeoutMs: number,
): Promise<TestcaseOutcome[]> {
  return runTestcases(
    code,
    examples.map((example) => ({ input: example.input, expectedOutput: example.output })),
    timeoutMs,
  );
}
