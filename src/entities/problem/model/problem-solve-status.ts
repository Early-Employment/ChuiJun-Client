/**
 * 백엔드 solveStatus enum. `GET /problems` 의 `solveStatus` 필터 값으로 그대로 보낸다.
 * 로그인한 회원 기준으로 계산되므로, 비로그인 응답의 `solveStatus` 는 항상 null 이고
 * `solveStatus` 필터를 붙인 요청은 401 로 거절된다.
 */
export const PROBLEM_SOLVE_STATUSES = ["SOLVED", "UNSOLVED", "ATTEMPTED"] as const;

export type ProblemSolveStatus = (typeof PROBLEM_SOLVE_STATUSES)[number];

export const PROBLEM_SOLVE_STATUS_LABELS: Record<ProblemSolveStatus, string> = {
  SOLVED: "푼 문제",
  UNSOLVED: "안 푼 문제",
  ATTEMPTED: "시도한 문제",
};
