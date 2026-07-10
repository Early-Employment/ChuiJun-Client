import type { ProblemAlgorithmType } from "@/entities/problem/model/problem-algorithm-type";
import type { ProblemLevel } from "@/entities/problem/model/problem-level";
import type { ProblemSolveStatus } from "@/entities/problem/model/problem-solve-status";

export interface ProblemApiTestCase {
  testCaseId: number;
  caseType: string;
  inputText: string;
  expectedOutputText: string;
  explanationMd?: string;
}

export interface ProblemApiDetailResponse {
  problemId: number;
  problemCode: string;
  title: string;
  descriptionMd: string;
  inputMd: string;
  outputMd: string;
  level: ProblemLevel;
  algorithmType: ProblemAlgorithmType;
  point: number;
  timeLimitMs: number;
  memoryLimitKb: number;
  testCases: ProblemApiTestCase[];
  acceptRate: number;
}

export interface ProblemApiListItemResponse {
  problemId: number;
  problemCode: string;
  title: string;
  level: ProblemLevel;
  algorithmType: ProblemAlgorithmType;
  /** 비로그인 조회에서는 null 로 내려온다. */
  solveStatus: ProblemSolveStatus | null;
  point: number;
  acceptRate: number;
}

export interface ProblemApiPageResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: ProblemApiListItemResponse[];
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
