import type { ProblemDetail } from "@/entities/problem/model/problem-detail";

// 백엔드 미구현 기간 동안 사용하는 격리된 목 데이터.
// 실데이터 전환 시 problem-keys.ts 의 queryFn 만 instance.get 으로 교체하면 이 파일은 제거 대상이다.

const MOCK_PROBLEMS: Record<number, ProblemDetail> = {
  1: {
    id: 1,
    title: "서현이의 준건이 전화번호 알아내기",
    tier: "브론즈",
    score: 10,
    description: "서현이가 준건이의 전화번호를 알 수 있게 문제를 풀자.",
    category: "구현",
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    correctRate: 80,
    inputDescription: "첫째 줄에 n이 주어진다.\n둘째 줄에 x가 주어진다.",
    outputDescription: "이준건의 전화번호가 출력되어야 한다.",
    examples: [
      { input: "1 2", output: "3" },
      { input: "10 20", output: "30" },
    ],
    testcases: [
      { input: "1 2\n", expectedOutput: "3" },
      { input: "10 20\n", expectedOutput: "30" },
    ],
  },
  2: {
    id: 2,
    title: "문자열 뒤집기",
    tier: "브론즈",
    score: 10,
    description: "한 줄의 문자열을 입력받아 뒤집어 출력한다.",
    category: "문자열",
    timeLimitMs: 1000,
    memoryLimitMb: 256,
    correctRate: 72.5,
    inputDescription: "첫째 줄에 문자열 s가 주어진다.",
    outputDescription: "s를 뒤집은 문자열을 출력한다.",
    examples: [
      { input: "hello", output: "olleh" },
      { input: "ChuiJun", output: "nuJiuhC" },
    ],
    testcases: [
      { input: "hello\n", expectedOutput: "olleh" },
      { input: "ChuiJun\n", expectedOutput: "nuJiuhC" },
    ],
  },
};

export function createMockProblemDetail(id: number): ProblemDetail {
  const problem = MOCK_PROBLEMS[id];
  if (!problem) {
    throw new Error(`문제를 찾을 수 없습니다: ${id}`);
  }
  return problem;
}
