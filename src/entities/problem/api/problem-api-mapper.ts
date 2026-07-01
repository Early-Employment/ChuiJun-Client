import type {
  ProblemApiDetailResponse,
  ProblemApiListItemResponse,
  ProblemApiPageResponse,
  ProblemApiTestCase,
} from "@/entities/problem/api/problem-api-response";
import type {
  ProblemDetail,
  ProblemExample,
  Testcase,
} from "@/entities/problem/model/problem-detail";
import type { ProblemListItem } from "@/entities/problem/model/problem-list-item";
import type { ProblemListPage } from "@/entities/problem/model/problem-list-page";

function toMemoryLimitMb(memoryLimitKb: number) {
  return Math.round((memoryLimitKb / 1024) * 10) / 10;
}

// 백엔드 level enum("LEVEL_1"~"LEVEL_5")에서 숫자만 뽑아 "lv. N"으로 표시한다.
function toLevelLabel(level: string) {
  return `lv. ${level.replace("LEVEL_", "")}`;
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
    tier: toLevelLabel(problem.level),
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

export function mapProblemListItem(problem: ProblemApiListItemResponse): ProblemListItem {
  return {
    id: problem.problemId,
    code: problem.problemCode,
    title: problem.title,
    level: toLevelLabel(problem.level),
    acceptRate: problem.acceptRate,
  };
}

export function mapProblemListPage(problemPage: ProblemApiPageResponse): ProblemListPage {
  return {
    items: problemPage.content.map(mapProblemListItem),
    totalPages: problemPage.totalPages,
    totalElements: problemPage.totalElements,
    page: problemPage.number,
    size: problemPage.size,
  };
}
