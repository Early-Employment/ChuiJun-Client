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
  level: string;
  primaryTag: string;
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
  level: string;
  primaryTag: string;
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
