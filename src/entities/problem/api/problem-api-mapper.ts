import type {
  ProblemApiDetailResponse,
  ProblemApiTestCase,
} from "@/entities/problem/api/problem-api-response";
import type { ProblemDetail, ProblemExample, Testcase } from "@/entities/problem/model/problem-detail";

function toMemoryLimitMb(memoryLimitKb: number) {
  return Math.round((memoryLimitKb / 1024) * 10) / 10;
}

function toProblemExamples(testCases: ProblemApiTestCase[]): ProblemExample[] {
  return testCases
    .filter((testCase) => testCase.caseType === "PUBLIC")
    .map((testCase) => ({
      input: testCase.inputText,
      output: testCase.expectedOutputText,
    }));
}

function toProblemTestcases(testCases: ProblemApiTestCase[]): Testcase[] {
  return testCases.map((testCase) => ({
    input: testCase.inputText,
    expectedOutput: testCase.expectedOutputText,
  }));
}

export function mapProblemDetail(problem: ProblemApiDetailResponse): ProblemDetail {
  return {
    id: problem.problemId,
    title: problem.title,
    tier: `lv. ${problem.level}`,
    score: problem.point,
    description: problem.descriptionMd,
    category: problem.primaryTag,
    timeLimitMs: problem.timeLimitMs,
    memoryLimitMb: toMemoryLimitMb(problem.memoryLimitKb),
    correctRate: problem.acceptRate,
    inputDescription: problem.inputMd,
    outputDescription: problem.outputMd,
    examples: toProblemExamples(problem.testCases),
    testcases: toProblemTestcases(problem.testCases),
  };
}
