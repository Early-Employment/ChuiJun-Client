import type { WrongProblem } from "@/entities/problem/model/wrong-problem";

// 백엔드 미구현 기간 동안 사용하는 격리된 목 데이터.
// 실데이터 전환 시 problem-keys.ts 의 queryFn 만 instance.get 으로 교체하면 이 파일은 제거 대상이다.

export function createMockWrongProblems(): WrongProblem[] {
  return [
    { id: 1, title: "두 수의 합", attempts: 2, date: "2026.04.03", reason: "Runtime Error" },
    { id: 2, title: "DFS와 BFS", attempts: 3, date: "2026.04.04", reason: "Wrong Answer" },
  ];
}
