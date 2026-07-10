/** 백엔드 algorithmType enum. `GET /problems` 의 `algorithmType` 필터 값으로 그대로 보낸다. */
export const PROBLEM_ALGORITHM_TYPES = [
  "BRUTE_FORCE",
  "DP",
  "GREEDY",
  "BFS",
  "DFS",
  "BINARY_SEARCH",
] as const;

export type ProblemAlgorithmType = (typeof PROBLEM_ALGORITHM_TYPES)[number];

export const PROBLEM_ALGORITHM_TYPE_LABELS: Record<ProblemAlgorithmType, string> = {
  BRUTE_FORCE: "브루트포스",
  DP: "DP",
  GREEDY: "그리디",
  BFS: "BFS",
  DFS: "DFS",
  BINARY_SEARCH: "이진 탐색",
};
