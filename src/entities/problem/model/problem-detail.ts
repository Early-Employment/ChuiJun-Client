/** 백준 스타일 채점 단위: stdin 입력과 기대 stdout 한 쌍. */
export interface Testcase {
  /** 표준 입력으로 주입할 문자열 */
  input: string;
  /** 기대 표준 출력 (우측 공백·개행 정규화 후 비교) */
  expectedOutput: string;
}

/** 문제 설명에 노출되는 예제 입출력 한 쌍. */
export interface ProblemExample {
  input: string;
  output: string;
}

export interface ProblemDetail {
  id: number;
  title: string;
  /** 난이도 등급 (예: "브론즈") */
  tier: string;
  /** 획득 점수 */
  score: number;
  /** 문제 설명 (평문/줄바꿈) */
  description: string;
  /** 분야 (분야별 현황 집계 키와 동일) */
  category: string;
  /** 실행 제한 시간(ms) */
  timeLimitMs: number;
  /** 메모리 제한(MB) */
  memoryLimitMb: number;
  /** 정답률(%) */
  correctRate: number;
  /** 입력 형식 설명 */
  inputDescription: string;
  /** 출력 형식 설명 */
  outputDescription: string;
  /** 문제 설명에 노출되는 예제 입출력 */
  examples: ProblemExample[];
  /** 채점에 사용하는 테스트케이스 */
  testcases: Testcase[];
}
